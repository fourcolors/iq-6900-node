# IQ-6900 (ALPHA)

> **⚠️ ALPHA SOFTWARE**: This package is in early alpha stage (v0.0.1). APIs may change without notice. Not recommended for production use yet.

A Solana-based utility for retrieving and processing on-chain data from the IQ blockchain.

## Installation

```bash
# Using JSR (recommended)
npx jsr add @sterling/iq-6900

# Using pnpm
pnpm add @sterling/iq-6900

# Using npm
npm install @sterling/iq-6900

# Using yarn
yarn add @sterling/iq-6900

# Using Deno
import { getOnchainJson, getOnchainData } from "@sterling/iq-6900";
```

## Usage

The library provides APIs for retrieving on-chain JSON data:

### Get Raw JSON String

```typescript
import { getOnchainJson } from "@sterling/iq-6900";

// Pass configuration options
const jsonString = await getOnchainJson({
  walletAddress: "your-wallet-address",
  rpcUrl: "https://api.mainnet-beta.solana.com", // Optional
  apiHost: "https://solanacontractapi.uc.r.appspot.com", // Optional
});

console.log(jsonString);
```

### Get Parsed JSON Data (Recommended)

```typescript
import { getOnchainData } from "@sterling/iq-6900";

// This will automatically parse the JSON for you
const data = await getOnchainData({
  walletAddress: "your-wallet-address",
});

if (data) {
  // TypeScript support with generic type parameter
  const typedData = await getOnchainData<YourDataType>({
    walletAddress: "your-wallet-address",
  });

  console.log(data.someProperty);
}
```

The original function is still available for backward compatibility:

```typescript
import { bringAgentWithWalletAddress } from "@sterling/iq-6900";

const jsonString = await bringAgentWithWalletAddress({
  walletAddress: "your-wallet-address",
});
```

## Configuration Options

All functions require a configuration object with the following options:

| Option          | Description                           | Default                                        |
| --------------- | ------------------------------------- | ---------------------------------------------- |
| `walletAddress` | Your Solana wallet address (required) | None - must be provided                        |
| `rpcUrl`        | Solana RPC URL (optional)             | `"https://api.mainnet-beta.solana.com"`        |
| `apiHost`       | IQ Contract API host (optional)       | `"https://solanacontractapi.uc.r.appspot.com"` |

## Development

### Setup

```bash
# Clone the repository
git clone https://github.com/sterling/iq-6900.git
cd iq-6900

# Install dependencies
pnpm install
```

### Testing

```bash
# Run tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Run tests in watch mode
pnpm test:watch
```

### Building

```bash
# Build the package
pnpm build
```

## Contributing

Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for details on how to contribute to this project.

## Publishing

To publish a new version:

1. Install the JSR CLI: `pnpm add -g @jsr/cli`
2. Login: `jsr auth`
3. Publish: `jsr publish`

## License

ISC
