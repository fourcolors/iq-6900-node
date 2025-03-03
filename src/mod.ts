/**
 * IQ-6900 Module
 * A Solana-based utility for retrieving and processing on-chain data.
 */

import { bringAgentWithWalletAddress } from "./bringIQData";
import type { IQ6900Config } from "./types.ts";

/**
 * Retrieves JSON data from the Solana blockchain
 *
 * @param config - Configuration options for the IQ-6900 client
 * @returns The JSON data as a string, or null if not found
 * @example
 * ```ts
 * // Using configuration options
 * const jsonData = await getOnchainJson({
 *   walletAddress: "your-wallet-address"
 * });
 * ```
 */
export async function getOnchainJson(
  config: IQ6900Config
): Promise<string | null> {
  return bringAgentWithWalletAddress(config);
}

/**
 * Retrieves and parses JSON data from the Solana blockchain
 *
 * @param config - Configuration options for the IQ-6900 client
 * @returns The parsed JSON data, or null if not found or invalid
 * @example
 * ```ts
 * const data = await getOnchainData({
 *   walletAddress: "your-wallet-address"
 * });
 *
 * if (data) {
 *   console.log(data.someProperty);
 * }
 * ```
 */
export async function getOnchainData<T = any>(
  config: IQ6900Config
): Promise<T | null> {
  const jsonString = await getOnchainJson(config);

  if (!jsonString) {
    return null;
  }

  try {
    return JSON.parse(jsonString) as T;
  } catch (error) {
    console.error("Error parsing on-chain JSON data:", error);
    return null;
  }
}

// Export the original function for backward compatibility
export { bringAgentWithWalletAddress } from "./bringIQData";

// Export types
export type {
  CodeResult,
  IQ6900Config,
  TransactionData,
  TransactionDataResponse,
  TransactionInfo
} from "./types.ts";

