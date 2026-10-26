import { ethers } from 'ethers';
import { CONTRACT_ADDRESSES, GOVERNOR_ABI, GOVERNOR_DEPLOY_BLOCK, TREASURY_ABI } from '../../../config/contracts';
import { db } from '../../../db';
import { PROPOSAL_CATEGORIES, TREASURY_CATEGORY, type ProposalCategory } from '../../../types';
import { getProvider } from '../../blockchain';

/** `eth_getLogs` rechaza rangos mayores a 10.000 bloques en los nodos habituales. */
const MAX_LOG_RANGE = 9_999;
const PARALLEL_REQUESTS = 4;
const SCAN_KEY = 'unq_dao_proposals_scanned_block_v1';
const MIN_INTERVAL_MS = 30_000;

const treasury = new ethers.Interface(TREASURY_ABI);

/** Inversa de `buildProposalDescription`: "título\n\ndescripción\n\n[Categoría: X]". */
function parseDescription(text: string): { title: string; description: string; category: ProposalCategory } {
  const match = text.match(/^([\s\S]*?)\n\n([\s\S]*)\n\n\[Categoría: (.+)\]$/);
  if (!match) return { title: text.split('\n')[0] || 'Propuesta', description: text, category: 'General' };
  const [, title, description, category] = match;
  const known = PROPOSAL_CATEGORIES.find((c) => c === category);
  return { title, description, category: known ?? 'General' };
}

function readScanned(): number | null {
  try {
    const n = Number(localStorage.getItem(SCAN_KEY));
    return Number.isFinite(n) && n > 0 ? n : null;
  } catch {
    return null;
  }
}

function writeScanned(block: number) {
  try {
    localStorage.setItem(SCAN_KEY, String(block));
  } catch {
    /* sin almacenamiento: se vuelve a escanear la próxima vez */
  }
}

let lastRun = 0;
let running: Promise<void> | null = null;

/**
 * Reconstruye el metadato de las propuestas a partir de los eventos `ProposalCreated`,
 * así la lista no depende de la base local del navegador que las creó.
 * No pisa lo que ya existe en la base local.
 */
export function syncProposalsFromChain(): Promise<void> {
  if (running) return running;
  if (Date.now() - lastRun < MIN_INTERVAL_MS) return Promise.resolve();

  running = (async () => {
    try {
      const provider = await getProvider();
      const gov = new ethers.Contract(CONTRACT_ADDRESSES.GOVERNOR, GOVERNOR_ABI, provider);
      const latest = await provider.getBlockNumber();
      const from = readScanned() ?? GOVERNOR_DEPLOY_BLOCK;

      const ranges: [number, number][] = [];
      for (let start = from; start <= latest; start += MAX_LOG_RANGE + 1) {
        ranges.push([start, Math.min(latest, start + MAX_LOG_RANGE)]);
      }

      const filter = gov.filters.ProposalCreated();
      const logs: (ethers.Log | ethers.EventLog)[] = [];
      for (let i = 0; i < ranges.length; i += PARALLEL_REQUESTS) {
        const batch = ranges.slice(i, i + PARALLEL_REQUESTS);
        logs.push(...(await Promise.all(batch.map(([a, b]) => gov.queryFilter(filter, a, b)))).flat());
      }

      for (const log of logs) {
        if (!('args' in log)) continue;
        const id = log.args.proposalId.toString();
        if (await db.proposals.get(id)) continue;

        const { title, description, category } = parseDescription(log.args.description);
        const calldata: string = log.args.calldatas[0] ?? '0x';
        let beneficiaryAddress: string | undefined;
        let ethAmount: string | undefined;
        try {
          const decoded = treasury.decodeFunctionData('transferETH', calldata);
          beneficiaryAddress = decoded[0];
          ethAmount = ethers.formatEther(decoded[1]);
        } catch {
          /* propuesta informativa, sin transferencia */
        }

        const block = await provider.getBlock(log.blockNumber);
        await db.proposals.put({
          id,
          title,
          description,
          category: beneficiaryAddress ? TREASURY_CATEGORY : category,
          targetAddress: log.args.targets[0],
          beneficiaryAddress,
          ethAmount: ethAmount ?? '0',
          proposer: String(log.args.proposer).toLowerCase(),
          createdAt: new Date((block?.timestamp ?? Date.now() / 1000) * 1000).toISOString(),
        });
      }

      writeScanned(latest + 1);
      lastRun = Date.now();
    } catch (e) {
      console.warn('No se pudieron leer las propuestas de la blockchain:', e);
    } finally {
      running = null;
    }
  })();
  return running;
}
