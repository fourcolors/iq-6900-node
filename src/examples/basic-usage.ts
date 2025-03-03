/**
 * Basic usage example for IQ-6900
 *
 * This example demonstrates how to use the IQ-6900 package to retrieve
 * on-chain data from the Solana blockchain.
 */

import { getOnchainData, getOnchainJson } from "../mod";

// Example with raw JSON string
async function example1() {
  console.log("Example 1: Using raw JSON string");

  try {
    const jsonString = await getOnchainJson({
      walletAddress: "YourSolanaWalletAddressHere",
      // Optional parameters
      // rpcUrl: "https://api.mainnet-beta.solana.com",
      // apiHost: "https://solanacontractapi.uc.r.appspot.com"
    });

    if (jsonString) {
      console.log("Successfully retrieved on-chain data:");
      console.log(jsonString);
    } else {
      console.log("No on-chain data found for this wallet address");
    }
  } catch (error) {
    console.error("Error retrieving on-chain data:", error);
  }
}

// Example with parsed JSON data
async function example2() {
  console.log("Example 2: Using parsed JSON data");

  try {
    // Using type inference
    const data = await getOnchainData({
      walletAddress: "YourSolanaWalletAddressHere",
    });

    if (data) {
      console.log("Successfully retrieved and parsed on-chain data:");
      console.log(data);

      // Access properties directly
      // console.log("Property value:", data.someProperty);
    } else {
      console.log(
        "No on-chain data found for this wallet address or parsing failed"
      );
    }
  } catch (error) {
    console.error("Error retrieving on-chain data:", error);
  }
}

// Example with type-safe parsed JSON data
interface MyDataType {
  name: string;
  description: string;
  properties: Record<string, unknown>;
}

async function example3() {
  console.log("Example 3: Using type-safe parsed JSON data");

  try {
    // Using generic type parameter for type safety
    const data = await getOnchainData<MyDataType>({
      walletAddress: "YourSolanaWalletAddressHere",
    });

    if (data) {
      console.log("Successfully retrieved and parsed on-chain data:");
      console.log("Name:", data.name);
      console.log("Description:", data.description);
      console.log("Properties:", data.properties);
    } else {
      console.log(
        "No on-chain data found for this wallet address or parsing failed"
      );
    }
  } catch (error) {
    console.error("Error retrieving on-chain data:", error);
  }
}

// Run examples
example1();
// Uncomment to run additional examples
// example2();
// example3();
