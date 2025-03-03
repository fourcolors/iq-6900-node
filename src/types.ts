/**
 * Type definitions for IQ-6900
 */

export interface IQ6900Config {
  /**
   * Solana wallet address
   */
  walletAddress?: string;

  /**
   * Solana RPC URL (defaults to mainnet)
   */
  rpcUrl?: string;

  /**
   * IQ Contract API host
   */
  apiHost?: string;
}

export interface TransactionInfo {
  argData?: {
    type_field?: string;
    offset?: string;
    tail_tx?: string;
  };
}

export interface TransactionData {
  method: string;
  code: string;
  decode_break: number;
  before_tx: string;
}

export interface TransactionDataResponse {
  code: string;
  method: string;
  decode_break: number;
}

export interface CodeResult {
  json_data: string;
  commit_message: string;
}
