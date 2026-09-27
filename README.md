# CyberRiskTwin 🛡️⚡
### AI-Powered Continuous Cyber Risk Quantification & Investment Optimization Platform
**Smart India Hackathon (SIH 2026) — Problem Statement ID: SIH260105 / SIH26105**  
*Theme: Blockchain & Cybersecurity | Organization: All India Council for Technical Education (AICTE)*  
*Repository: [https://github.com/Anusha-demonslayer/SIH260105](https://github.com/Anusha-demonslayer/SIH260105)*

---

## 📌 Executive Summary & Problem Context

Despite billions of dollars invested annually into enterprise cybersecurity solutions, **cyber risk continues to be communicated qualitatively** using subjective heatmaps (e.g., *'High'*, *'Medium'*, *'Low'* or Red/Amber/Green matrices). 

This legacy approach fails executive leadership and boards because:
1. **Lack of Financial Justification**: CISOs cannot mathematically demonstrate the return on investment (ROI) of a $300,000 security control to CFOs or Board members.
2. **Static Snapshot Blindspots**: Periodic penetration tests and point-in-time audits fail to capture dynamic network topology changes, cloud drift, and emerging zero-day vulnerabilities.
3. **No Attack Path Correlation**: Vulnerability scanners report isolated CVE scores without modeling how an adversary pivots laterally from an edge gateway into crown-jewel databases or operational technology (OT) SCADA arrays.

### 💡 The Solution: CyberRiskTwin
**CyberRiskTwin** is a real-time, AI-driven **Cybersecurity Digital Twin** paired with an automated **FAIR (Factor Analysis of Information Risk)** Monte Carlo simulation engine and a **0-1 Knapsack Pareto Frontier Optimizer**. It creates an exact virtual model of an enterprise's digital environment, continuously simulates breach blast radiuses, calculates Value-at-Risk (VaR) in monetary terms ($ / ₹), and mathematically determines the optimal security budget allocation.

---

## 🌟 Core Innovations & Capabilities

### 1. 🌐 Interactive Digital Twin Network Topology & Blast Radius Engine
- Real-time visualization of hybrid multi-zone enterprise infrastructure:
  - **Edge & Perimeter**: Cloudflare WAF, Ivanti SSL-VPN Gateways
  - **DMZ & Auth**: NGINX Reverse Proxies, Keycloak SSO / OIDC
  - **Cloud Infrastructure**: AWS EKS Ingress, Banking Microservices, AWS S3 PII Data Lake
  - **Corporate Internal**: Active Directory Domain Controllers, Executive Workstations, SAP ERP
  - **OT / ICS SCADA**: Purdue Model Level 3.5 Firewall, SCADA Telemetry Historian, Siemens S7-1500 PLCs
  - **Financial Core Vault**: PostgreSQL Core Banking Ledger, SWIFT / Fedwire Payment Gateways
- **Dynamic Blast Radius Analysis**: Interactive cascading impact simulator modeling 1-hop and 2-hop contagion when a node is breached.
- **One-Click Node Containment**: Instant quarantine simulation severing network routes to arrest lateral movement.

### 2. 📊 Open FAIR Quantitative Cyber Risk Engine
- Implements the Open Group **Factor Analysis of Information Risk (O-RT:2013)** standard:
  - **Loss Event Frequency (LEF)** = Threat Event Frequency (TEF) × Vulnerability Probability
  - **Vulnerability** = Adversary Threat Capability (TCap) vs. Control Strength (CS)
  - **Loss Magnitude (LM)** = Primary Loss (Triage, Forensics, Downtime) + Secondary Loss (Fines, Litigation, Churn)
- **High-Performance Monte Carlo Simulator**:
  - Runs 5,000 to 10,000 iterations using **Beta-PERT distribution sampling**.
  - Computes **Annualized Loss Expectancy (ALE)**, **Median Loss (P50)**, and **Value-at-Risk (95% VaR & 99% Tail Risk)**.
  - Interactive **Loss Exceedance Curve (LEC)** and probability density histograms.
  - Currency toggle: **USD ($)** and **INR (₹)** for national and global regulatory alignment.

### 3. 💰 Security Investment Optimizer & ROSI Pareto Frontier
- **Algorithmic 0-1 Knapsack Solver**: Given any annual budget cap (e.g., $100K to $1M), mathematically calculates the optimal portfolio of security controls that minimizes residual financial risk.
- **Return on Security Investment (ROSI %)**:
  $$\text{ROSI} = \frac{\Delta \text{Risk Mitigated} - \text{Annual Cost of Control}}{\text{Annual Cost of Control}} \times 100\%$$
- **Pareto Diminishing Returns Curve**: Pinpoints the exact saturation point where additional security spending yields diminishing risk reduction.

### 4. ⚔️ MITRE ATT&CK Adversary Breach Simulation
- Realistic multi-stage kill-chain execution across the digital twin:
  - **Scenario 1**: Double-Extortion Ransomware (BlackCat / LockBit 3.0)
  - **Scenario 2**: Zero-Day Edge VPN Infiltration (Ivanti Connect Secure CVE-2023-46805)
  - **Scenario 3**: Critical Infrastructure OT/ICS SCADA Sabotage (Stuxnet/Sandworm variant)
- Real-time step runner with telemetry tickers: financial loss meter, compromised asset counter, and active defense interception triggers.

### 5. 🔍 Continuous Asset & Vulnerability Inventory Matrix
- Real-time correlation with live CVEs (CVE-2024-3094 XZ Backdoor, CVE-2023-38606 Kerberos elevation, CVE-2023-22515, etc.).
- **EPSS (Exploit Prediction Scoring System)** integration assessing real-world weaponization probability.
- Direct patch simulation with immediate risk recalculation.

### 6. 📜 Regulatory Crosswalk & National Mandates
- **NIST Cybersecurity Framework 2.0** (Govern, Identify, Protect, Detect, Respond, Recover).
- **ISO/IEC 27001:2022 Annex A** technological and organizational controls.
- **CIS Critical Security Controls v8** (IG1, IG2, IG3).
- **Indian National Regulatory Compliance**:
  - **CERT-In 6-Hour Incident Notification** timeline readiness.
  - **Digital Personal Data Protection Act (DPDPA 2023)** penalty mitigation (up to ₹250 Cr protection).
  - **RBI Cyber Security Framework** for banking switches and payment rails.

### 7. 📄 Executive CISO & Boardroom Dossier Generator
- One-click export of executive briefings to **Audit JSON** and printable **Board PDFs**.

---

## 🏗️ Architecture & Repository Structure

```
├── .github/
│   └── workflows/
│       └── ci.yml                 # Automated build, lint & test pipeline
├── src/
│   ├── components/
│   │   ├── Header.tsx             # Command center bar, live ALE/VaR telemetry & navigation
│   │   ├── DigitalTwinCanvas.tsx  # SVG Interactive network topology & blast radius engine
│   │   ├── FairRiskQuantification.tsx # FAIR ontology sliders, Monte Carlo & LEC charts
│   │   ├── InvestmentOptimizer.tsx # Knapsack solver, ROSI % & Pareto frontier
│   │   ├── AttackSimulator.tsx    # MITRE ATT&CK multi-stage breach runner
│   │   ├── AssetMatrix.tsx        # Filterable CVE/EPSS inventory & patch actions
│   │   ├── ComplianceCrosswalk.tsx# NIST CSF 2.0, ISO 27001 & DPDPA/CERT-In scoring
│   │   ├── ExecutiveReportModal.tsx # Board-ready printable dossier & JSON exporter
│   │   └── GitHubRepoSyncModal.tsx# GitHub sync assistant & credential generator
│   ├── data/
│   │   └── enterpriseData.ts      # Multi-zone digital twin topology, CVEs & controls
│   ├── types/
│   │   └── cyberrisk.ts           # Comprehensive TypeScript domain interfaces
│   ├── utils/
│   │   └── fairEngine.ts          # Beta-PERT Monte Carlo, ROSI & Currency calculators
│   ├── App.tsx                    # Main state machine & orchestrator
│   ├── index.css                  # Cyber command-center styling & grid animations
│   └── main.tsx                   # React 19 entry point
├── ARCHITECTURE.md                # Detailed system architecture & telemetry pipeline
├── FAIR_METHODOLOGY.md            # Mathematical formulation of the FAIR engine
├── SIH260105_PROPOSAL.md          # Complete hackathon proposal & evaluation dossier
├── package.json                   # Dependencies & scripts
├── tsconfig.json                  # TypeScript compiler settings
└── vite.config.ts                 # Vite bundler & Tailwind configuration
```

---

## 🚀 Quickstart & Local Setup

### Prerequisites
- Node.js 18+ or 20+
- npm 9+

### 1. Clone the repository
```bash
git clone https://github.com/Anusha-demonslayer/SIH260105.git
cd SIH260105
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for production
```bash
npm run build
```

---

## 🔄 Synchronizing & Pushing to GitHub

To push the latest updates to your target GitHub repository (`https://github.com/Anusha-demonslayer/SIH260105`):

```bash
# 1. Initialize and stage all files
git init
git add .

# 2. Create commit
git commit -m "feat: CyberRiskTwin complete continuous cyber risk quantification platform (SIH260105)"

# 3. Set main branch & remote origin
git branch -M main
git remote add origin https://github.com/Anusha-demonslayer/SIH260105.git

# 4. Push using your GitHub Personal Access Token (PAT):
git push -u https://<YOUR_GITHUB_TOKEN>@github.com/Anusha-demonslayer/SIH260105.git main
```

*(You can also use the built-in **GitHub Sync** button in the application header to generate and copy this command with your token!)*

---

## ⚖️ License
This project is released under the Apache-2.0 License. Developed for the Smart India Hackathon (SIH 2026).
