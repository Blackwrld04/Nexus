# Nexus MCP Server (Model Context Protocol on Monad EVM)

The **Nexus MCP Server** bridges autonomous AI agents, developer IDEs (Claude Desktop, Cursor, Antigravity, VS Code), and the Monad Testnet blockchain ecosystem. Built with the official `@modelcontextprotocol/sdk` and `zod`, it exposes full multi-agent swarm orchestration, ERC-8004 identity verification, conditional escrow vault locking, and live Monad RPC telemetry directly to LLM clients.

---

## 🚀 Features

- **Standard Stdio JSON-RPC 2.0 Transport**: Compliant with Anthropic's Model Context Protocol specification.
- **Live Monad Testnet RPC Cascade**: Leverages Dwellir high-throughput node, QuickNode fallback, and public Monad endpoints to guarantee zero downtime and live single-slot finality telemetry.
- **ERC-8004 Agent Directory**: Inspect registered agent passports, metadata hashes, and capabilities.
- **Full Closed-Loop Swarm Auditing**: Trigger planner, specialized workers (Nansen onchain intel & security auditing), Groq-powered adversarial evaluation, and final synthesis in a single tool call.
- **MON-Denominated Escrow Settlement**: Quote and lock `0.05 MON` testnet bounties in `NexusEscrowVault.sol`.

---

## 🛠️ Tools Available

| Tool Name | Parameters | Description |
|---|---|---|
| `nexus_list_agents` | _None_ | Lists all registered ERC-8004 agents with capability tags, passport IDs, and MON fee structures. |
| `nexus_execute_swarm_audit` | `targetContract`, `missionObjective` | Executes the complete autonomous multi-agent swarm audit pipeline, returning verified findings and MonadScan explorer proofs. |
| `nexus_create_escrow` | `targetContract`, `bountyMon`, `taskDescription` | Calculates task splits and quotes escrow locking in `NexusEscrowVault.sol` (default `0.05 MON`). |
| `nexus_verify_deliverable` | `taskId`, `targetContract`, `workerAgentId`, `findings` | Evaluator Gatekeeper powered by Groq LPU reasoning to adversarially verify worker findings against live Monad RPC state. |
| `nexus_get_monad_telemetry` | _None_ | Queries live Monad Testnet block height, active RPC endpoints, latency benchmarks, and verified contract addresses. |
| `nexus_inspect_contract` | `address` | Probes live bytecode size, native MON balance, and latest confirmed block/tx proofs on Monad Testnet. |

---

## 📦 Resources & Prompts

### Resources
- `monad://telemetry` — Live Monad Testnet block height, Dwellir status, and RPC cascade.
- `nexus://agents` — Catalog of ERC-8004 onchain registered worker agents.
- `nexus://contracts` — Canonical verified contracts on Monad Testnet (`IdentityRegistry`, `EscrowVault`, `ReputationRegistry`, Agora AUSD).

### Prompts
- `audit_monad_pool` — Scaffolded prompt to run deep smart money whale and bytecode security analysis on any pool/token.
- `verify_agent_deliverable` — Adversarial audit evaluation prompt for verifying agent citations.

---

## ⚙️ Configuration & Integration

### 1. Claude Desktop (`claude_desktop_config.json`)
Add the following to your Claude Desktop configuration (`~/.config/Claude/claude_desktop_config.json` on Linux or `~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):

```json
{
  "mcpServers": {
    "nexus-monad": {
      "command": "node",
      "args": [
        "/home/blackwrld04/Nexus(Monad)/agents/dist/mcp/server.js"
      ],
      "env": {
        "DWELLIR_API_KEY": "3311bba2-f8b9-4786-9082-3f72c160d17d",
        "GROQ_API_KEY": "your_groq_api_key_here"
      }
    }
  }
}
```

### 2. Cursor IDE (`.cursor/mcp.json`)
```json
{
  "mcpServers": {
    "nexus-monad": {
      "command": "node",
      "args": ["dist/mcp/server.js"],
      "cwd": "/home/blackwrld04/Nexus(Monad)/agents"
    }
  }
}
```

### 3. Antigravity IDE (`mcp_config.json`)
```json
{
  "mcpServers": {
    "nexus-monad": {
      "command": "node",
      "args": ["/home/blackwrld04/Nexus(Monad)/agents/dist/mcp/server.js"]
    }
  }
}
```

---

## 🏗️ Build & Run Manually

```bash
# 1. Install dependencies
npm install

# 2. Build TypeScript to dist/
npm run build

# 3. Run the MCP server over stdio
npm run mcp:dist

# Or run with ts-node directly:
npm run mcp
```
