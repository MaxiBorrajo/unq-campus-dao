// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Governor} from "@openzeppelin/contracts/governance/Governor.sol";
import {GovernorSettings} from "@openzeppelin/contracts/governance/extensions/GovernorSettings.sol";
import {GovernorCountingSimple} from "@openzeppelin/contracts/governance/extensions/GovernorCountingSimple.sol";
import {GovernorVotes} from "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";
import {GovernorVotesQuorumFraction} from "@openzeppelin/contracts/governance/extensions/GovernorVotesQuorumFraction.sol";
import {GovernorTimelockControl} from "@openzeppelin/contracts/governance/extensions/GovernorTimelockControl.sol";
import {GovernorProposalGuardian} from "@openzeppelin/contracts/governance/extensions/GovernorProposalGuardian.sol";
import {TimelockController} from "@openzeppelin/contracts/governance/TimelockController.sol";
import {IVotes} from "@openzeppelin/contracts/governance/utils/IVotes.sol";
import {IGovernor} from "@openzeppelin/contracts/governance/IGovernor.sol";
import {Time} from "@openzeppelin/contracts/utils/types/Time.sol";

/// @notice Governor estudiantil. Cada propuesta puede definir su propia duración de votación
///         dentro de [minVotingPeriod, maxVotingPeriod]. Si no se indica, usa `votingPeriod()`.
contract StudentGovernor is
    Governor,
    GovernorSettings,
    GovernorCountingSimple,
    GovernorVotes,
    GovernorVotesQuorumFraction,
    GovernorTimelockControl,
    GovernorProposalGuardian
{
    struct Config {
        IVotes token;
        TimelockController timelock;
        uint48 votingDelay;
        uint32 votingPeriod; // duración por defecto
        uint256 quorumPercent;
        uint48 proposalCooldown;
        address guardian;
        uint32 minVotingPeriod;
        uint32 maxVotingPeriod;
    }

    uint48 private _proposalCooldown;
    uint32 private _minVotingPeriod;
    uint32 private _maxVotingPeriod;

    /// @dev Duración a aplicar en la propuesta que se está creando. Solo es distinta de 0 durante `propose`.
    uint32 private _pendingVotingPeriod;

    mapping(address proposer => uint256) private _lastProposalId;
    mapping(address proposer => uint256) private _lastProposalAt;

    event ProposalCooldownUpdated(uint48 previous, uint48 current);
    event VotingPeriodBoundsUpdated(uint32 minPeriod, uint32 maxPeriod);

    error ActiveProposalExists(address proposer, uint256 proposalId);
    error ProposalCooldownActive(address proposer, uint256 availableAt);
    error InvalidVotingPeriod(uint32 requested, uint32 minPeriod, uint32 maxPeriod);
    error InvalidVotingPeriodBounds(uint32 minPeriod, uint32 maxPeriod);

    constructor(Config memory config)
        Governor("StudentGovernor")
        GovernorSettings(config.votingDelay, config.votingPeriod, 1)
        GovernorVotes(config.token)
        GovernorVotesQuorumFraction(config.quorumPercent)
        GovernorTimelockControl(config.timelock)
    {
        _setProposalCooldown(config.proposalCooldown);
        _setProposalGuardian(config.guardian);
        _setVotingPeriodBounds(config.minVotingPeriod, config.maxVotingPeriod);
    }

    function proposalCooldown() public view returns (uint48) {
        return _proposalCooldown;
    }

    function minVotingPeriod() public view returns (uint32) {
        return _minVotingPeriod;
    }

    function maxVotingPeriod() public view returns (uint32) {
        return _maxVotingPeriod;
    }

    function setProposalCooldown(uint48 newCooldown) external onlyGovernance {
        _setProposalCooldown(newCooldown);
    }

    function setVotingPeriodBounds(uint32 minPeriod, uint32 maxPeriod) external onlyGovernance {
        _setVotingPeriodBounds(minPeriod, maxPeriod);
    }

    /// @notice Crea una propuesta con la duración de votación por defecto.
    function propose(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        string memory description
    ) public override returns (uint256) {
        return _proposeWithPeriod(targets, values, calldatas, description, 0);
    }

    /// @notice Crea una propuesta con duración de votación propia, en segundos.
    /// @param duration Debe estar entre `minVotingPeriod()` y `maxVotingPeriod()`.
    function proposeWithDuration(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        string memory description,
        uint32 duration
    ) public returns (uint256) {
        if (duration < _minVotingPeriod || duration > _maxVotingPeriod) {
            revert InvalidVotingPeriod(duration, _minVotingPeriod, _maxVotingPeriod);
        }
        return _proposeWithPeriod(targets, values, calldatas, description, duration);
    }

    /// @dev `Governor._propose` guarda `votingPeriod()` en la propuesta (`voteDuration`), por lo que
    ///      devolver el valor pendiente mientras se crea fija la duración de esa propuesta. Después
    ///      `proposalDeadline` y `state` siempre usan la duración guardada, no este getter.
    function votingPeriod() public view override(Governor, GovernorSettings) returns (uint256) {
        uint32 pending = _pendingVotingPeriod;
        return pending != 0 ? pending : super.votingPeriod();
    }

    function votingDelay() public view override(Governor, GovernorSettings) returns (uint256) {
        return super.votingDelay();
    }

    function proposalThreshold() public view override(Governor, GovernorSettings) returns (uint256) {
        return super.proposalThreshold();
    }

    function quorum(uint256 timepoint) public view override(Governor, GovernorVotesQuorumFraction) returns (uint256) {
        return super.quorum(timepoint);
    }

    function state(uint256 proposalId) public view override(Governor, GovernorTimelockControl) returns (ProposalState) {
        return super.state(proposalId);
    }

    function proposalNeedsQueuing(uint256 proposalId)
        public
        view
        override(Governor, GovernorTimelockControl)
        returns (bool)
    {
        return super.proposalNeedsQueuing(proposalId);
    }

    function _queueOperations(
        uint256 proposalId,
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) internal override(Governor, GovernorTimelockControl) returns (uint48) {
        return super._queueOperations(proposalId, targets, values, calldatas, descriptionHash);
    }

    function _executeOperations(
        uint256 proposalId,
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) internal override(Governor, GovernorTimelockControl) {
        super._executeOperations(proposalId, targets, values, calldatas, descriptionHash);
    }

    function _cancel(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) internal override(Governor, GovernorTimelockControl) returns (uint256) {
        return super._cancel(targets, values, calldatas, descriptionHash);
    }

    function _executor() internal view override(Governor, GovernorTimelockControl) returns (address) {
        return super._executor();
    }

    function _validateCancel(uint256 proposalId, address caller)
        internal
        view
        override(Governor, GovernorProposalGuardian)
        returns (bool)
    {
        return super._validateCancel(proposalId, caller);
    }

    function _proposeWithPeriod(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        string memory description,
        uint32 duration
    ) private returns (uint256 proposalId) {
        address proposer = _msgSender();
        _enforceProposalLimits(proposer);

        _pendingVotingPeriod = duration;
        proposalId = super.propose(targets, values, calldatas, description);
        _pendingVotingPeriod = 0;

        _lastProposalId[proposer] = proposalId;
        _lastProposalAt[proposer] = block.timestamp;
    }

    function _enforceProposalLimits(address proposer) private view {
        uint256 lastId = _lastProposalId[proposer];
        if (lastId != 0) {
            ProposalState lastState = state(lastId);
            if (lastState == ProposalState.Pending || lastState == ProposalState.Active) {
                revert ActiveProposalExists(proposer, lastId);
            }
        }
        uint256 availableAt = _lastProposalAt[proposer] + _proposalCooldown;
        if (block.timestamp < availableAt) revert ProposalCooldownActive(proposer, availableAt);
    }

    function _setProposalCooldown(uint48 newCooldown) private {
        emit ProposalCooldownUpdated(_proposalCooldown, newCooldown);
        _proposalCooldown = newCooldown;
    }

    function _setVotingPeriodBounds(uint32 minPeriod, uint32 maxPeriod) private {
        if (minPeriod == 0 || minPeriod > maxPeriod) revert InvalidVotingPeriodBounds(minPeriod, maxPeriod);
        _minVotingPeriod = minPeriod;
        _maxVotingPeriod = maxPeriod;
        emit VotingPeriodBoundsUpdated(minPeriod, maxPeriod);
    }
}
