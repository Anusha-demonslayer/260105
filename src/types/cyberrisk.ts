export type NetworkZone = 'perimeter' | 'dmz' | 'internal' | 'cloud' | 'ot_ics' | 'financial_db';

export type CriticalityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type NodeStatus = 'healthy' | 'vulnerable' | 'simulated_compromise' | 'breached' | 'isolated';

export interface Vulnerability {
  cveId: string;
  title: string;
  cvss: number;
  epss: number; // Exploit Prediction Scoring System 0.0 - 1.0
  severity: CriticalityLevel;
  vector: string;
  description: string;
  patchAvailable: boolean;
  remediationCost: number;
}

export interface NetworkNode {
  id: string;
  label: string;
  zone: NetworkZone;
  category: 'server' | 'database' | 'endpoint' | 'gateway' | 'cloud_service' | 'scada_plc' | 'identity_provider';
  ipAddress: string;
  criticality: CriticalityLevel;
  valueAtRisk: number; // in USD
  vulnerabilities: Vulnerability[];
  status: NodeStatus;
  x: number;
  y: number;
  tags: string[];
  blastRadiusScore: number; // 1-100
  controlsApplied: string[];
  owner: string;
}

export interface NetworkEdge {
  id: string;
  source: string;
  target: string;
  protocol: string;
  port: number;
  isEncrypted: boolean;
  trustLevel: 'high' | 'medium' | 'untrusted';
  activeAttackPath?: boolean;
}

export interface AttackStep {
  stepNumber: number;
  name: string;
  techniqueId: string; // e.g. T1078, T1059
  techniqueName: string;
  sourceNodeId: string;
  targetNodeId: string;
  narrative: string;
  exploitLikelihood: number; // 0.0 to 1.0
  detectionChance: number;
  financialImpactStep: number;
  mitigatedBy: string[]; // Control IDs
}

export interface AttackScenario {
  id: string;
  title: string;
  threatActor: string;
  actorProfile: string;
  description: string;
  primaryZone: NetworkZone;
  estimatedTotalLoss: number;
  attackSteps: AttackStep[];
}

export interface SecurityControl {
  id: string;
  name: string;
  category: 'Endpoint' | 'Identity' | 'Cloud' | 'Network' | 'Application' | 'Data_Governance';
  annualCost: number;
  implementationMonths: number;
  riskReductionFactor: number; // e.g. 0.35 = reduces 35% of relevant risk
  coverageZones: NetworkZone[];
  description: string;
  mitreCovered: string[];
  vendorRecommendation: string;
  isActive: boolean;
}

export interface FairModelInputs {
  threatEventFrequencyMin: number; // TEF min per year
  threatEventFrequencyMode: number;
  threatEventFrequencyMax: number;
  threatCapabilityMode: number; // 0-100
  controlStrengthMode: number; // 0-100
  primaryLossMin: number; // in USD
  primaryLossMode: number;
  primaryLossMax: number;
  secondaryLossMin: number;
  secondaryLossMode: number;
  secondaryLossMax: number;
  secondaryLossProbability: number; // 0-1.0
}

export interface MonteCarloResult {
  iterations: number;
  annualizedLossExpectancy: number; // ALE (mean)
  medianLoss: number; // P50
  var95: number; // 95th percentile Value-at-Risk
  var99: number; // 99th percentile Value-at-Risk
  minLoss: number;
  maxLoss: number;
  lossEventFrequencyMean: number;
  distributionHistogram: { bucket: string; count: number; lossRangeMax: number }[];
  lossExceedanceCurve: { threshold: number; probability: number }[];
}

export interface ComplianceFrameworkScore {
  framework: string;
  overallScore: number; // 0-100
  categories: {
    name: string;
    score: number;
    controlsImplemented: number;
    controlsTotal: number;
  }[];
}
