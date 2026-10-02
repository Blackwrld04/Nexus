# AgentNexus Sample Data Directory

This directory contains lightweight, curated sample data used to support the `SAMPLE_MODE=true` deterministic execution fallback, ensuring judges can run and verify the complete agent swarm workflow even without active live API credentials or in offline testing environments.

## Datasets Included

1. **`nansen_sample_flow.json`**
   - **Source**: Nansen Token Inflow Telemetry & Onchain Holder Clustering.
   - **Records**: 24-hour smart-money accumulation metrics, top 10 holder distribution, and verified Monad block numbers.
   - **Usage**: Consumed by `NansenAlphaWorker.ts`.

2. **`bytecode_audit_sample.json`**
   - **Source**: Monad EVM Bytecode & Opcode Disassembly.
   - **Records**: Reentrancy layout proofs, timelocked governance parameters, and Monad parallel tick array validations.
   - **Usage**: Consumed by `SecurityAuditWorker.ts`.

## Privacy & Sensitivity
* Zero personal data or private credentials are included.
* Synthetic contract addresses and open public blockchain identifiers only.
