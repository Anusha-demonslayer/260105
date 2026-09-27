# Smart India Hackathon (SIH 2026) Project Proposal
## Problem Statement ID: SIH260105 / SIH26105
**Title**: AI-Powered Continuous Cyber Risk Quantification and Investment Optimization Platform  
**Theme**: Blockchain & Cybersecurity  
**Category**: Software  
**Submitted By**: Team CyberRiskTwin  
**Repository**: [https://github.com/Anusha-demonslayer/SIH260105](https://github.com/Anusha-demonslayer/SIH260105)

---

## 1. Problem Statement Context & Justification
In modern enterprise environments, despite substantial capital allocation toward cybersecurity defenses (EDR, Firewalls, SIEM, IAM), cyber risk is persistently communicated in qualitative terms ("Low", "Medium", "High"). 
This introduces critical organizational friction:
- Board members and CFOs cannot understand qualitative matrices to evaluate capital allocation.
- Security teams cannot determine which controls yield the highest risk reduction per rupee/dollar spent.
- Conventional audits are point-in-time and fail to account for dynamic network changes, cloud migrations, and weaponized zero-day exploits.

## 2. Our Proposed Solution: CyberRiskTwin
**CyberRiskTwin** bridges technical cybersecurity telemetry with executive financial governance:
1. **Digital Twin of Enterprise Architecture**: Models IT, Cloud (AWS), Active Directory, Financial Core Systems, and OT/ICS SCADA infrastructure without impacting live production.
2. **Automated Continuous FAIR Quantification**: Calculates Annualized Loss Expectancy (ALE) and Value-at-Risk (95% VaR) using Monte Carlo stochastic sampling.
3. **Algorithmic Security Budget Optimizer**: Utilizes a 0-1 Knapsack Pareto optimization solver to determine the mathematically optimal control bundle for any specified budget limit.
4. **Adversary Kill-Chain Simulation**: Evaluates MITRE ATT&CK attack trajectories (Ransomware, OT Sabotage, Edge Exploitation) and proves control efficacy in real time.
5. **Regulatory Crosswalk**: Aligns with NIST CSF 2.0, ISO 27001, CERT-In 6-Hour reporting directives, and India's Digital Personal Data Protection Act (DPDPA 2023).

## 3. Technology Stack & Implementation
- **Frontend & Digital Twin Canvas**: React 19, TypeScript, Tailwind CSS, SVG Directed Graph Engine, Motion animations.
- **Quantitative Engine**: Pure TypeScript implementation of Beta-PERT Monte Carlo sampling (5,000+ iterations in <200ms).
- **Optimization Solver**: Dynamic programming and greedy heuristic 0-1 Knapsack solver for Pareto frontier calculation.
- **Telemetry & Standards**: Open FAIR (O-RT:2013), MITRE ATT&CK v14, CISA KEV, EPSS Exploit Scoring.

## 4. Key Differentiators & Innovation
- **Zero Production Disruption**: Simulations run in a deterministic virtual digital twin model.
- **Real-Time Dual-Currency Support**: Instant conversion between USD ($) and Indian Rupees (₹ Lakh / ₹ Crore) for Indian regulatory bodies (RBI, SEBI, CERT-In).
- **Automated CISO Briefing Generator**: Produces Board-ready dossiers and audit-compliant JSON output with one click.
