# 📋 Insurance Claims Processing Kata

## Instructions for Running the App (with Bun)

1. **Install Bun**  
   If you don’t have Bun, install it (on Windows, use WSL or follow [Bun’s Windows guide](https://bun.sh/docs/installation)):
   ```sh
   curl -fsSL https://bun.sh/install | bash
   ```

2. **Install dependencies**  
   ```sh
   bun install
   ```

3. **Run tests**  
   ```sh
   bun test
   ```

4. **Lint and format code**  
   If you use Biome or another tool, run:
   ```sh
   bun run lint
   bun run format
   ```

## Decisions and Trade-offs

- **Switched to Bun:**  
  Bun offers faster installs and test runs than npm/yarn. It’s modern and supports TypeScript and Jest-like testing out of the box.

- **Business Logic:**  
  All claim evaluation logic is in [`ClaimProcessor`](src/services/ClaimProcessor.ts) for clarity and testability.

## If I Had More Time

- Add a database or API layer.
- Add more tests and validation.
- Improve documentation and types.
