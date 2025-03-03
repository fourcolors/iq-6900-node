// Simple logger implementation
const logger = {
  info: (message: string, ...args: any[]) => console.log(`[INFO] ${message}`, ...args),
  error: (message: string, ...args: any[]) => console.error(`[ERROR] ${message}`, ...args),
  debug: (message: string, ...args: any[]) => console.debug(`[DEBUG] ${message}`, ...args),
  warn: (message: string, ...args: any[]) => console.warn(`[WARN] ${message}`, ...args),
};

import { Connection, PublicKey } from "@solana/web3.js";
import type {
  CodeResult,
  IQ6900Config,
  TransactionData,
  TransactionDataResponse,
  TransactionInfo,
} from "./types.ts";

// Constants
const DEFAULT_RPC = "https://api.mainnet-beta.solana.com";
const DEFAULT_API_HOST = "https://solanacontractapi.uc.r.appspot.com";
const GENESIS_TX = "Genesis";
const ERROR_RESULT: CodeResult = {
  json_data: "false",
  commit_message: "false",
};

// Helper functions
async function convertTextToEmoji(text: string): Promise<string> {
  return text.replace(/\/u([0-9A-Fa-f]{4,6})/g, (_, code) =>
    String.fromCodePoint(Number.parseInt(code, 16))
  );
}

async function fetchTransactionInfo(
  txId: string,
  apiHost: string
): Promise<TransactionInfo["argData"] | null> {
  try {
    const response = await fetch(`${apiHost}/get_transaction_info/${txId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.argData || null;
  } catch (error) {
    logger.error("Error fetching transaction info:", error);
    return null;
  }
}

async function fetchDBPDA(
  walletAddress: string,
  apiHost: string
): Promise<string | null> {
  if (!walletAddress) {
    logger.error("Wallet address not provided");
    return null;
  }

  try {
    logger.info("Connecting to Solana...(IQ6900)");
    logger.info(`Your Address: ${walletAddress}`);

    const response = await fetch(`${apiHost}/getDBPDA/${walletAddress}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.DBPDA || null;
  } catch (error) {
    logger.error("Error fetching PDA:", error);
    return null;
  }
}

async function getTransactionData(transactionData: TransactionData): Promise<{
  data: TransactionDataResponse | "fail";
  before_tx: string;
}> {
  if (!transactionData || !("code" in transactionData)) {
    return {
      data: "fail",
      before_tx: "fail",
    };
  }

  return {
    data: {
      code: transactionData.code,
      method: transactionData.method,
      decode_break: transactionData.decode_break,
    },
    before_tx: transactionData.before_tx,
  };
}

async function extractCommitMessage(
  dataTxid: string,
  apiHost: string
): Promise<string | null> {
  const txInfo = await fetchTransactionInfo(dataTxid, apiHost);
  if (!txInfo) return null;

  const type_field = txInfo.type_field || null;
  if (type_field === "json" && txInfo.offset) {
    const [, commitMessage] = txInfo.offset.split("commit: ");
    return commitMessage || null;
  }

  return null;
}

function isTransactionDataResponse(
  data: TransactionDataResponse | "fail"
): data is TransactionDataResponse {
  return data !== "fail" && typeof data === "object" && "code" in data;
}

async function bringCode(
  dataTxid: string,
  apiHost: string
): Promise<CodeResult> {
  const txInfo = await fetchTransactionInfo(dataTxid, apiHost);
  if (!txInfo || !txInfo.tail_tx) return ERROR_RESULT;

  const chunks: string[] = [];
  let before_tx = txInfo.tail_tx;

  if (before_tx === null) return ERROR_RESULT;

  try {
    while (before_tx !== GENESIS_TX) {
      if (!before_tx) {
        logger.error("Before transaction undefined");
        return ERROR_RESULT;
      }

      logger.info(`Chunks: ${before_tx}`);
      const chunk = await fetchTransactionInfo(before_tx, apiHost);

      if (!chunk) {
        logger.error("No chunk found");
        return ERROR_RESULT;
      }

      const chunkData = await getTransactionData(chunk as TransactionData);
      if (!chunkData.data || !isTransactionDataResponse(chunkData.data)) {
        logger.error("Chunk data undefined or invalid");
        return ERROR_RESULT;
      }

      chunks.push(chunkData.data.code);
      before_tx = chunkData.before_tx;
    }

    const textData = chunks.reverse().join("");
    return {
      json_data: await convertTextToEmoji(textData),
      commit_message: txInfo.offset || "false",
    };
  } catch (error) {
    logger.error("Error in bringCode:", error);
    return ERROR_RESULT;
  }
}

async function fetchSignaturesForAddress(
  dbAddress: PublicKey,
  connection: Connection
): Promise<string[]> {
  try {
    logger.info("Find Your Signature...(IQ6900)");
    const signatures = await connection.getSignaturesForAddress(dbAddress, {
      limit: 20,
    });
    return signatures.map((sig) => sig.signature);
  } catch (error) {
    logger.error("Error fetching signatures:", error);
    return [];
  }
}

async function findRecentJsonSignature(
  walletAddress: string,
  connection: Connection,
  apiHost: string
): Promise<string | null> {
  const dbAddress = await fetchDBPDA(walletAddress, apiHost);
  if (!dbAddress) {
    logger.error("Failed to fetch DBPDA");
    return null;
  }

  const signatures = await fetchSignaturesForAddress(
    new PublicKey(dbAddress),
    connection
  );
  if (signatures.length === 0) {
    logger.error("No signatures found");
    return null;
  }

  for (const signature of signatures) {
    const commit = await extractCommitMessage(signature, apiHost);
    if (commit) return signature;
  }

  return null;
}

/**
 * Retrieves agent data from the blockchain for a specified wallet address
 *
 * @param config - Configuration options
 * @returns The JSON data as a string, or null if not found
 */
export async function bringAgentWithWalletAddress(
  config: IQ6900Config
): Promise<string | null> {
  if (!config.walletAddress) {
    logger.error("Wallet address not provided in config");
    return null;
  }

  const walletAddress = config.walletAddress;
  const rpcUrl = config.rpcUrl || DEFAULT_RPC;
  const apiHost = config.apiHost || DEFAULT_API_HOST;

  // Initialize connection with provided or default RPC
  const connection = new Connection(rpcUrl, "confirmed");

  const recent = await findRecentJsonSignature(
    walletAddress,
    connection,
    apiHost
  );
  if (!recent) {
    logger.error("Cannot found onchain data in this wallet.");
    return null;
  }

  const result = await bringCode(recent, apiHost);
  return result.json_data === "false" ? null : result.json_data;
}
