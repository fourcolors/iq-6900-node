# Contributing to IQ-6900

Thank you for your interest in contributing to IQ-6900! This document provides guidelines and instructions for contributing to this project.

## Setting Up Development Environment

1. Clone the repository:

   ```bash
   git clone https://github.com/sterling/iq-6900
   cd iq-6900
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

## Development Workflow

1. Create a new branch for your feature or bugfix:

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and test them thoroughly:

   ```bash
   pnpm test
   ```

3. Ensure your code follows the project's style guidelines and passes all tests:

   ```bash
   pnpm lint
   pnpm test:coverage
   ```

4. Commit your changes with a descriptive message following conventional commits:

   ```bash
   git commit -m "feat: add new feature"
   git commit -m "fix: resolve issue with..."
   ```

5. Push your branch and create a pull request.

## Code Style and Guidelines

- Use TypeScript for all new code
- Include type definitions for all functions and interfaces
- Write comprehensive JSDoc comments
- Use relative imports with `.ts` extensions (e.g., `import { something } from './file.ts'`)
- Follow functional programming principles where appropriate
- Format your code using Prettier:
  ```bash
  pnpm format
  ```

## Pull Request Process

1. Ensure your code is well-tested and documented.
2. Update the README.md with details of changes if applicable.
3. Your PR should target the `main` branch.
4. A maintainer will review your PR and provide feedback.

## License

By contributing to this project, you agree that your contributions will be licensed under the same [ISC License](LICENSE) that covers this project.

Thank you for your contributions!
