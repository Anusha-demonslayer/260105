# CyberRiskTwin Architecture Specification
### Continuous Cyber Risk Quantification & Investment Optimization Platform
**Smart India Hackathon Ref: SIH260105 / SIH26105**

---

## 1. High-Level Architectural Blueprint

```
+-----------------------------------------------------------------------------------+
|                            CYBER RISK TWIN PLATFORM                              |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  [ LAYER 1: DATA INGESTION & TOPOLOGY MAPPING ]                                   |
|  * Multi-Cloud Infrastructure (AWS VPC, EKS, S3 Data Lake)                       |
|  * Corporate On-Premise (Active Directory, Kerberos, ERP, VLANs)                 |
|  * OT / ICS Purdue Architecture (Bridge Firewalls, SCADA Historians, S7 PLCs)    |
|  * Threat Intelligence & CVE Feeds (NVD, CISA KEV, EPSS Exploit Scoring)         |
|                                       │                                           |
|                                       ▼                                           |
|  [ LAYER 2: DIGITAL TWIN VIRTUAL GRAPH ENGINE ]                                   |
|  * Directed Graph Topology Model (Nodes = Digital Assets, Edges = Trust Protocols)|
|  * Blast Radius Calculator (Cascading 1-hop, 2-hop contagion score)              |
|  * Real-Time Node Quarantine & Traffic Severance Sandbox                         |
|                                       │                                           |
|                                       ▼                                           |
|  [ LAYER 3: QUANTITATIVE RISK ENGINE (FAIR O-RT:2013) ]                           |
|  * Threat Event Frequency (TEF) Beta-PERT Sampler                                |
|  * Threat Capability (TCap) vs Control Strength (CS) Logistic Formulation        |
|  * Loss Magnitude Sampler (Primary Loss + Secondary Regulatory & Churn Loss)     |
|  * High-Performance Monte Carlo Simulator (5,000 - 10,000 stochastic runs)      |
|  * Output: ALE (Mean), Median (P50), Value-at-Risk (95% VaR & 99% Tail Risk)     |
|                                       │                                           |
|                                       ▼                                           |
|  [ LAYER 4: DECISION OPTIMIZATION & ROSI SOLVER ]                                |
|  * 0-1 Knapsack Pareto Frontier Optimizer for Security Control Portfolios        |
|  * Marginal Risk Reduction per Dollar Solver                                      |
|  * Return on Security Investment (ROSI %) Calculator                              |
|                                       │                                           |
|                                       ▼                                           |
|  [ LAYER 5: ATTACK SIMULATION & REGULATORY CROSSWALK ]                           |
|  * MITRE ATT&CK Multi-Phase Kill-Chain Progression (Ransomware, OT Sabotage, Zero-Day)
|  * Regulatory Assurance (NIST CSF 2.0, ISO/IEC 27001:2022, CIS v8, CERT-In, DPDPA)
|  * CISO Executive Dossier & Automated Audit JSON Generation                      |
+-----------------------------------------------------------------------------------+
```

---

## 2. Component Design & Interactions

### 2.1 Digital Twin State Engine (`src/types/cyberrisk.ts`, `src/data/enterpriseData.ts`)
- **Assets (`NetworkNode`)**: Encapsulates unique hardware/software identifiers, IP addresses, zones, asset criticality, monetary Value-at-Risk, active CVEs, Exploit Prediction Scoring System (EPSS) rating, and applied controls.
- **Edges (`NetworkEdge`)**: Represents communication paths, ports, network encapsulation protocols (HTTPS, gRPC, LDAPS, S7comm, MT/ISO20022), encryption flags, and trust domain boundaries.

### 2.2 FAIR Quantitative Engine (`src/utils/fairEngine.ts`)
- Implements Beta-PERT probability density distribution:
  $$f(x; a, m, b, \lambda) = \frac{(x-a)^{\alpha-1}(b-x)^{\beta-1}}{B(\alpha, \beta)(b-a)^{\alpha+\beta-1}}$$
  where $\alpha = 1 + \lambda \frac{m-a}{b-a}$, $\beta = 1 + \lambda \frac{b-m}{b-a}$, with default shape parameter $\lambda = 4$.
- Executes parallelized random variable generation across $N = 5,000$ iterations.
- Generates empirical Loss Exceedance Curves (LEC) and percentile boundaries for boardroom risk appetites.

### 2.3 Knapsack Pareto Optimizer
- Maximizes:
  $$\max \sum_{i=1}^{n} \Delta \text{Risk}_i \cdot x_i \quad \text{subject to} \quad \sum_{i=1}^{n} c_i \cdot x_i \le B, \quad x_i \in \{0, 1\}$$
  where $c_i$ is the annualized implementation and operational cost of control $i$, $\Delta \text{Risk}_i$ is the empirical risk reduction factor, and $B$ is the enterprise cybersecurity budget cap.

---

## 3. Security & Telemetry Isolation
- **No Production Disruption**: Attack simulations run purely on the digital twin representation without active packet transmission to live customer infrastructure.
- **Client-Side Privacy**: All Monte Carlo calculations and asset telemetry process inside browser memory without sending customer network topologies to third-party endpoints.
