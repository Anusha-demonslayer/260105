# Quantitative Cyber Risk Methodology (FAIR Standard)
### Mathematical Foundations for CyberRiskTwin (SIH260105)

---

## 1. The Core FAIR Risk Taxonomy

CyberRiskTwin implements the **Factor Analysis of Information Risk (FAIR)** framework (The Open Group Standard O-RT:2013).

```
                             ┌───────────────┐
                             │     RISK      │
                             └───────┬───────┘
                     ┌───────────────┴───────────────┐
                     ▼                               ▼
          ┌─────────────────────┐         ┌─────────────────────┐
          │  LOSS EVENT FREQ    │         │   LOSS MAGNITUDE    │
          │       (LEF)         │         │        (LM)         │
          └──────────┬──────────┘         └──────────┬──────────┘
           ┌─────────┴─────────┐           ┌─────────┴─────────┐
           ▼                   ▼           ▼                   ▼
    ┌─────────────┐     ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
    │THREAT EVENT │     │VULNERABILITY│ │PRIMARY LOSS │ │SECONDARY    │
    │  FREQ (TEF) │     │   (VULN)    │ │ MAGNITUDE   │ │LOSS MAGN    │
    └─────────────┘     └──────┬──────┘ └─────────────┘ └─────────────┘
                         ┌─────┴─────┐
                         ▼           ▼
                  ┌─────────────┐ ┌─────────────┐
                  │ THREAT CAP  │ │   CONTROL   │
                  │   (TCap)    │ │STRENGTH(CS) │
                  └─────────────┘ └─────────────┘
```

---

## 2. Mathematical Formulations

### 2.1 Threat Event Frequency (TEF) & Vulnerability
Threat Event Frequency is modeled as a continuous random variable sampled from a Beta-PERT distribution with minimum ($a$), mode ($m$), and maximum ($b$):
$$\text{TEF} \sim \text{PERT}(a_{\text{TEF}}, m_{\text{TEF}}, b_{\text{TEF}})$$

Vulnerability represents the probability that a threat event exceeds the defensive controls. It is computed via a logistic sigmoid differential between Threat Capability ($\text{TCap}$) and Control Strength ($\text{CS}$):
$$P(\text{Vuln}) = \frac{1}{1 + e^{-(\text{TCap} - \text{CS}) / 20}}$$

### 2.2 Loss Event Frequency (LEF)
For each simulated year, the expected number of successful breach events is:
$$\lambda = \text{TEF} \times P(\text{Vuln})$$
The realized count of breach events is simulated using Poisson sampling:
$$K \sim \text{Poisson}(\lambda)$$

### 2.3 Loss Magnitude (LM)
For every realized breach $k \in \{1, \dots, K\}$:
$$\text{Loss}_k = \text{PrimaryLoss}_k + \mathbb{I}_{\text{Secondary}} \times \text{SecondaryLoss}_k$$
- **Primary Loss**: Direct incident response, forensic triage, system restoration, and direct downtime.
- **Secondary Loss**: Regulatory fines (GDPR, RBI, DPDPA up to ₹250 Cr), customer attrition, reputation loss, and shareholder litigation.

### 2.4 Annualized Loss Expectancy (ALE) & Value-at-Risk (VaR)
Across $N = 5,000$ iterations:
$$\text{ALE} = \frac{1}{N} \sum_{i=1}^{N} \text{AnnualLoss}_i$$
Value-at-Risk at confidence level $\alpha = 0.95$:
$$\text{VaR}_{95\%} = \inf \{ L \in \mathbb{R} : P(\text{AnnualLoss} > L) \le 0.05 \}$$

---

## 3. Return on Security Investment (ROSI)

CyberRiskTwin computes ROSI to mathematically justify security controls to CFOs and the Board:
$$\text{ROSI} = \frac{(\text{ALE}_{\text{unmitigated}} - \text{ALE}_{\text{mitigated}}) - \text{Cost}_{\text{control}}}{\text{Cost}_{\text{control}}} \times 100\%$$
Where:
- $\text{ALE}_{\text{unmitigated}}$ is baseline expected loss without the control.
- $\text{ALE}_{\text{mitigated}}$ is the residual expected loss with the control active.
- $\text{Cost}_{\text{control}}$ is the total annual cost of ownership (licensing, infrastructure, operations).
