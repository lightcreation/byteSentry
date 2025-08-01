# ByteSentry

**Decentralized Smart Contract Risk Scoring and Audit Reputation Network**

ByteSentry is a blockchain-based platform that provides decentralized, continuous security auditing, reputation tracking, and verifiable risk scoring for smart contracts across chains.

---

## Overview

ByteSentry consists of ten core Clarity smart contracts that work together to secure the Web3 ecosystem through trustless auditing mechanisms, incentive alignment, and transparent score aggregation:

1. **Registry Contract** – Manages enrolled protocols seeking security audits  
2. **Audit Submission Contract** – Allows auditors to submit structured security reviews  
3. **Score Oracle Contract** – Aggregates submitted audits to generate trust scores  
4. **Staking Contract** – Auditors stake tokens to guarantee audit honesty  
5. **Dispute Resolution Contract** – Resolves challenges to audits through arbitration  
6. **Bounty Vault Contract** – Projects lock tokens to reward valid vulnerability reports  
7. **Reputation Contract** – Tracks auditor performance over time  
8. **Governance Contract** – Community proposals to evolve scoring logic and criteria  
9. **Subscription Contract** – Protocols subscribe for ongoing security monitoring  
10. **Proof NFT Contract** – Issues timestamped audit NFTs for public verification

---

## Features

- Decentralized & permissionless audit network  
- On-chain trust scores for any smart contract  
- Verifiable audit trail via timestamped NFTs  
- Whitehat-friendly bounty distribution  
- Slashing-based honesty enforcement  
- Continuous security assessment — not one-time snapshots  
- On-chain auditor reputation tracking  
- DAO-based governance of scoring models

---

## Smart Contracts

### Registry Contract
- Registers and manages smart contract projects requesting audits
- Stores metadata and audit state

### Audit Submission Contract
- Allows verified auditors to publish risk assessments
- Supports modular vulnerability categories and severity

### Score Oracle Contract
- Aggregates audit submissions
- Computes normalized risk scores for each project

### Staking Contract
- Requires auditors to stake tokens with their submissions
- Enforces honesty through slashing if audits are overturned

### Dispute Resolution Contract
- Facilitates peer-based or DAO arbitration on contested audits
- Ensures fairness and accountability

### Bounty Vault Contract
- Protocols can deposit tokens for vulnerability discovery
- Automates payout to verified submissions

### Reputation Contract
- Tracks audit history, dispute outcomes, and staking behavior
- Public leaderboard of reliable security researchers

### Governance Contract
- Enables tokenholders to vote on score algorithm updates
- Proposals to adjust risk frameworks, reward models, etc.

### Subscription Contract
- Manages active monitoring plans for protocols
- Funds auditor incentives via recurring payments

### Proof NFT Contract
- Mints permanent, auditable records of submitted audit reports
- Used for showcasing transparency and due diligence

---

## Installation

1. Install Clarinet CLI: [https://docs.stacks.co/clarity/clarinet](https://docs.stacks.co/clarity/clarinet)
2. Clone this repository:
   ```bash
   git clone https://github.com/your-org/bytesentry.git
   cd bytesentry
   ```
3. Run tests:
    ```bash
    npm test
    ```
4. Deploy contracts:
    ```bash
    clarinet deploy
    ```

## Usage

Each contract is modular and can be deployed individually or as part of the full ByteSentry protocol. Consult the /contracts directory and inline documentation for specific details.

## Testing

Tests are written using Vitest with Clarity integration.
```bash
npm test
```

Test scenarios include:

- Honest and dishonest audit submissions
- Dispute and resolution simulations
- Bounty payout flows
- Score computation integrity

## License

MIT License
