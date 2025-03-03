/**
 * Tests for IQ-6900 module
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { bringAgentWithWalletAddress } from '../bringIQData.ts';
import { getOnchainData, getOnchainJson } from '../mod.ts';

// Mock the bringAgentWithWalletAddress function for testing
vi.mock('../bringIQData.ts', () => ({
  bringAgentWithWalletAddress: vi.fn(),
}));

describe('IQ-6900 Module', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('getOnchainJson', () => {
    it('should return JSON string when call succeeds', async () => {
      const mockResult = '{"name":"test-data","value":123}';
      vi.mocked(bringAgentWithWalletAddress).mockResolvedValue(mockResult);

      const result = await getOnchainJson({ walletAddress: 'test-wallet' });
      
      expect(bringAgentWithWalletAddress).toHaveBeenCalledWith({ walletAddress: 'test-wallet' });
      expect(result).toBe(mockResult);
    });

    it('should return null when call fails', async () => {
      vi.mocked(bringAgentWithWalletAddress).mockResolvedValue(null);

      const result = await getOnchainJson({ walletAddress: 'test-wallet' });
      
      expect(result).toBeNull();
    });
  });

  describe('getOnchainData', () => {
    it('should return parsed data when JSON is valid', async () => {
      const mockResult = '{"name":"test-data","value":123}';
      vi.mocked(bringAgentWithWalletAddress).mockResolvedValue(mockResult);

      const result = await getOnchainData({ walletAddress: 'test-wallet' });
      
      expect(result).toEqual({ name: 'test-data', value: 123 });
    });

    it('should return null when JSON is null', async () => {
      vi.mocked(bringAgentWithWalletAddress).mockResolvedValue(null);

      const result = await getOnchainData({ walletAddress: 'test-wallet' });
      
      expect(result).toBeNull();
    });

    it('should return null when JSON is invalid', async () => {
      const mockResult = '{invalid-json}';
      vi.mocked(bringAgentWithWalletAddress).mockResolvedValue(mockResult);

      const result = await getOnchainData({ walletAddress: 'test-wallet' });
      
      expect(result).toBeNull();
    });

    it('should handle type-safe parsing with generics', async () => {
      interface TestType {
        name: string;
        value: number;
      }

      const mockResult = '{"name":"test-data","value":123}';
      vi.mocked(bringAgentWithWalletAddress).mockResolvedValue(mockResult);

      const result = await getOnchainData<TestType>({ walletAddress: 'test-wallet' });
      
      expect(result).toEqual({ name: 'test-data', value: 123 });
      // Type checking - this would fail if types are not correctly inferred
      if (result) {
        const name: string = result.name;
        const value: number = result.value;
        expect(typeof name).toBe('string');
        expect(typeof value).toBe('number');
      }
    });
  });
}); 