import React, { useState, useEffect } from 'react';
import { Role, Proposal, WalletState, StudentRequest } from './types';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { RightSidebar } from './components/RightSidebar';
import { ProposalsView } from './views/ProposalsView';
import { CreateProposalView } from './views/CreateProposalView';
import { ProposalDetailView } from './views/ProposalDetailView';
import { StudentBadge } from './components/StudentBadge';
import { StudentRegistrationView } from './views/StudentRegistrationView';
import { AdminPanelView } from './views/AdminPanelView';
import { VoteModal } from './components/VoteModal';
import { LoginView } from './views/LoginView';

import { 
  checkStudentCredential, 
  getTreasuryInfo, 
  fetchOnChainProposalState,
  hasUserVoted,
  PROPOSAL_STATES
} from './services/web3';
import { api } from './services/api';
import { CONTRACT_ADDRESSES } from './config/contracts';

export function App() {
  const [wallet, setWallet] = useState<WalletState>({
    address: null,
    chainId: null,
    isConnected: false,
    isConnecting: false,
    isIssuerAdmin: false,
    hasCredentialNft: false,
    votingPower: 0,
  });

  const [activeRole, setActiveRole] = useState<Role>('student');
  const [currentView, setCurrentView] = useState<string>('proposals');
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [votingProposal, setVotingProposal] = useState<Proposal | null>(null);

  const [studentProfile, setStudentProfile] = useState<StudentRequest | null>(null);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [pendingRequestsCount, setPendingRequestsCount] = useState<number>(0);
  const [treasuryBalance, setTreasuryBalance] = useState<string>('0.0');

  // Connect MetaMask
  const handleConnect = async () => {
    if (typeof window === 'undefined' || !(window as any).ethereum) {
      alert('Por favor instalá MetaMask para interactuar con la DApp del Campus Virtual UNQ.');
      return;
    }

    try {
      setWallet((prev) => ({ ...prev, isConnecting: true }));
      const ethereum = (window as any).ethereum;
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      const chainIdHex = await ethereum.request({ method: 'eth_chainId' });
      const chainId = parseInt(chainIdHex, 16);

      if (accounts && accounts.length > 0) {
        const address = accounts[0];
        await updateAccountData(address, chainId);
      }
    } catch (e: any) {
      console.error('Error connecting wallet:', e);
      alert('No se pudo conectar la billetera: ' + (e.message || e));
    } finally {
      setWallet((prev) => ({ ...prev, isConnecting: false }));
    }
  };

  const handleDisconnect = () => {
    setWallet({
      address: null,
      chainId: null,
      isConnected: false,
      isConnecting: false,
      isIssuerAdmin: false,
      hasCredentialNft: false,
      votingPower: 0,
    });
    setStudentProfile(null);
  };

  const updateAccountData = async (address: string, chainId: number) => {
    try {
      const credStatus = await checkStudentCredential(address);

      setWallet({
        address,
        chainId,
        isConnected: true,
        isConnecting: false,
        isIssuerAdmin: credStatus.isIssuerAdmin,
        hasCredentialNft: credStatus.hasCredentialNft,
        nftTokenId: credStatus.nftTokenId,
        votingPower: credStatus.votingPower,
      });

      // Default role if isIssuerAdmin: switch to admin or keep user choice
      if (credStatus.isIssuerAdmin) {
        setActiveRole('admin');
      }

      // Check SQLite student profile
      const studentRes = await api.getStudent(address);
      if (studentRes.found && studentRes.student) {
        setStudentProfile(studentRes.student);
      } else {
        setStudentProfile(null);
      }

      // Check pending requests count for admin badge
      loadPendingCount();
    } catch (e) {
      console.error('Error updating account data:', e);
    }
  };

  const loadPendingCount = async () => {
    try {
      const requests = await api.getAdminRequests();
      const pending = requests.filter((r) => r.status === 'pending').length;
      setPendingRequestsCount(pending);
    } catch (e) {}
  };

  const loadProposals = async () => {
    try {
      const metadataList = await api.getProposalsMetadata();
      const updatedList: Proposal[] = [];

      for (const m of metadataList) {
        let statusCode = 1; // Default Active
        let status = 'Active';
        let againstVotes = 0;
        let forVotes = 1;
        let abstainVotes = 0;
        let totalVotes = 1;
        let hasVoted = false;

        // Try to fetch on-chain state if on Sepolia
        if (m.proposalId && m.proposalId.length > 10) {
          const onChain = await fetchOnChainProposalState(m.proposalId);
          if (onChain) {
            statusCode = onChain.statusCode;
            status = onChain.status;
            againstVotes = onChain.againstVotes;
            forVotes = onChain.forVotes;
            abstainVotes = onChain.abstainVotes;
            totalVotes = onChain.totalVotes;
          }
        }

        if (wallet.address && m.proposalId && m.proposalId.length > 10) {
          hasVoted = await hasUserVoted(m.proposalId, wallet.address);
        }

        updatedList.push({
          id: m.proposalId,
          title: m.title,
          description: m.description,
          category: m.category || 'General',
          proposer: m.proposer,
          targetAddress: m.targetAddress,
          ethAmount: m.ethAmount,
          status: (PROPOSAL_STATES[statusCode] || status) as any,
          statusCode,
          forVotes,
          againstVotes,
          abstainVotes,
          totalVotes,
          quorum: 10,
          hasVoted,
          createdAt: m.createdAt,
        });
      }

      setProposals(updatedList);
    } catch (e) {
      console.warn('Error loading proposals:', e);
    }
  };

  const loadTreasury = async () => {
    try {
      const data = await getTreasuryInfo();
      setTreasuryBalance(data.balanceEth);
    } catch (e) {}
  };

  // Listen to MetaMask account / chain changes
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      const ethereum = (window as any).ethereum;

      ethereum.request({ method: 'eth_accounts' }).then((accounts: string[]) => {
        if (accounts.length > 0) {
          ethereum.request({ method: 'eth_chainId' }).then((chainIdHex: string) => {
            updateAccountData(accounts[0], parseInt(chainIdHex, 16));
          });
        }
      });

      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          handleDisconnect();
        } else {
          ethereum.request({ method: 'eth_chainId' }).then((chainIdHex: string) => {
            updateAccountData(accounts[0], parseInt(chainIdHex, 16));
          });
        }
      };

      const handleChainChanged = (chainIdHex: string) => {
        if (wallet.address) {
          updateAccountData(wallet.address, parseInt(chainIdHex, 16));
        }
      };

      ethereum.on('accountsChanged', handleAccountsChanged);
      ethereum.on('chainChanged', handleChainChanged);

      return () => {
        ethereum.removeListener('accountsChanged', handleAccountsChanged);
        ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [wallet.address]);

  useEffect(() => {
    loadProposals();
    loadTreasury();
    loadPendingCount();
  }, [wallet.address]);

  // Si no está conectado con MetaMask, mostrar pantalla de inicio institucional estilo Campus UNQ
  if (!wallet.isConnected) {
    return (
      <LoginView
        onConnect={handleConnect}
        isConnecting={wallet.isConnecting}
      />
    );
  }

  // Student name to display
  const studentDisplayName = studentProfile 
    ? `${studentProfile.firstName} ${studentProfile.lastName}`
    : wallet.address
      ? `Estudiante (${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)})`
      : 'Estudiante UNQ';

  const studentPhoto = studentProfile?.photoData || undefined;

  return (
    <div className="min-h-screen flex flex-col bg-[#f0f0f0]">
      {/* Navbar Superior Bordó Institucional UNQ */}
      <Navbar
        wallet={wallet}
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
        activeRole={activeRole}
        onToggleRole={(role) => {
          setActiveRole(role);
          if (role === 'admin') setCurrentView('admin');
          else if (currentView === 'admin') setCurrentView('proposals');
        }}
        studentName={studentDisplayName}
        studentPhoto={studentPhoto}
      />

      {/* Contenedor Principal (3 Columnas: Sidebar izquierdo, Contenido Central, Sidebar derecho) */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex-1 w-full">
        <div className="flex flex-col lg:flex-row gap-5 items-start">
          
          {/* Columna Izquierda: Perfil y Menú de Accesos Rápidos */}
          <Sidebar
            currentView={currentView}
            onSelectView={(v) => {
              setSelectedProposal(null);
              setCurrentView(v);
            }}
            wallet={wallet}
            activeRole={activeRole}
            pendingRequestsCount={pendingRequestsCount}
            studentName={studentDisplayName}
            studentPhoto={studentPhoto}
          />

          {/* Columna Central: Pantallas Específicas */}
          <section className="flex-1 w-full min-w-0">
            {currentView === 'proposals' && (
              <ProposalsView
                proposals={proposals}
                wallet={wallet}
                onSelectProposal={(p) => {
                  setSelectedProposal(p);
                  setCurrentView('proposal-detail');
                }}
                onVoteClick={(p) => setVotingProposal(p)}
                onCreateProposalClick={() => setCurrentView('create-proposal')}
                initialTab="all"
              />
            )}

            {currentView === 'my-proposals' && (
              <ProposalsView
                proposals={proposals}
                wallet={wallet}
                onSelectProposal={(p) => {
                  setSelectedProposal(p);
                  setCurrentView('proposal-detail');
                }}
                onVoteClick={(p) => setVotingProposal(p)}
                onCreateProposalClick={() => setCurrentView('create-proposal')}
                initialTab="mine"
              />
            )}

            {currentView === 'create-proposal' && (
              <CreateProposalView
                wallet={wallet}
                onBack={() => setCurrentView('proposals')}
                onCreated={() => {
                  loadProposals();
                  setCurrentView('proposals');
                }}
                treasuryBalance={treasuryBalance}
              />
            )}

            {currentView === 'proposal-detail' && selectedProposal && (
              <ProposalDetailView
                proposal={selectedProposal}
                wallet={wallet}
                onBack={() => setCurrentView('proposals')}
                onVoteClick={(p) => setVotingProposal(p)}
                onRefresh={() => {
                  loadProposals();
                }}
              />
            )}

            {currentView === 'credential' && (
              <div className="unq-card rounded bg-white p-6 shadow-sm">
                <div className="text-center mb-6">
                  <h2 className="text-lg font-bold text-gray-900">
                    Credencial Estudiantil Digital Oficial
                  </h2>
                  <p className="text-xs text-gray-500">
                    Emitida bajo el contrato StudentCredential (CRED) en la red Sepolia
                  </p>
                </div>
                <StudentBadge
                  address={wallet.address || '0x0000000000000000000000000000000000000000'}
                  tokenId={wallet.nftTokenId}
                  studentName={studentDisplayName}
                  dni={studentProfile?.dni || '42.123.456'}
                  career={studentProfile?.career || 'Licenciatura en Informática'}
                  photoUrl={studentPhoto}
                  hasNft={wallet.hasCredentialNft}
                />
              </div>
            )}

            {currentView === 'registration' && (
              <StudentRegistrationView
                wallet={wallet}
                onRequestSubmitted={() => {
                  if (wallet.address) updateAccountData(wallet.address, wallet.chainId || 11155111);
                }}
              />
            )}

            {currentView === 'admin' && (
              <AdminPanelView
                wallet={wallet}
                proposals={proposals}
                onRefreshData={() => {
                  loadProposals();
                  loadPendingCount();
                  loadTreasury();
                }}
              />
            )}
          </section>

          {/* Columna Derecha: Banners UNQ oficiales */}
          <RightSidebar />

        </div>
      </main>

      {/* Footer estilo UNQ */}
      <footer className="bg-[#7a1827] text-white text-xs py-4 border-t-2 border-[#5e101c] mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold">Universidad Nacional de Quilmes</span>
            <span>• Roque Sáenz Peña 352, Bernal, Provincia de Buenos Aires</span>
          </div>
          <div className="text-red-200 text-[11px] font-mono">
            Centro de Estudiantes UNQ • DAO Sepolia Testnet
          </div>
        </div>
      </footer>

      {/* Modal de Votación */}
      {votingProposal && (
        <VoteModal
          proposal={votingProposal}
          onClose={() => setVotingProposal(null)}
          onVoteSuccess={() => {
            loadProposals();
          }}
        />
      )}
    </div>
  );
}
export default App;

