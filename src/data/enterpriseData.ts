import {
  AttackScenario,
  ComplianceFrameworkScore,
  FairModelInputs,
  NetworkEdge,
  NetworkNode,
  SecurityControl
} from '../types/cyberrisk';

export const INITIAL_NETWORK_NODES: NetworkNode[] = [
  // Perimeter & DMZ
  {
    id: 'edge-waf',
    label: 'Cloud WAF & DDoS Shield',
    zone: 'perimeter',
    category: 'gateway',
    ipAddress: '198.51.100.12',
    criticality: 'HIGH',
    valueAtRisk: 450000,
    vulnerabilities: [],
    status: 'healthy',
    x: 100,
    y: 120,
    tags: ['Edge', 'Cloudflare', 'DDoS-Protected'],
    blastRadiusScore: 25,
    controlsApplied: ['ctrl-waf', 'ctrl-ddos'],
    owner: 'SecOps Team'
  },
  {
    id: 'vpn-gw',
    label: 'SSL-VPN Gateway (Ivanti)',
    zone: 'perimeter',
    category: 'gateway',
    ipAddress: '198.51.100.45',
    criticality: 'CRITICAL',
    valueAtRisk: 1850000,
    vulnerabilities: [
      {
        cveId: 'CVE-2023-46805',
        title: 'Ivanti Connect Secure Authentication Bypass',
        cvss: 9.8,
        epss: 0.94,
        severity: 'CRITICAL',
        vector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H',
        description: 'Authentication bypass vulnerability allows remote unauthenticated attacker to access restricted resources.',
        patchAvailable: true,
        remediationCost: 15000
      }
    ],
    status: 'vulnerable',
    x: 100,
    y: 280,
    tags: ['VPN', 'Remote-Access', 'Perimeter'],
    blastRadiusScore: 88,
    controlsApplied: [],
    owner: 'NetOps Infrastructure'
  },
  {
    id: 'dmz-proxy',
    label: 'NGINX Ingress Reverse Proxy',
    zone: 'dmz',
    category: 'server',
    ipAddress: '172.16.10.15',
    criticality: 'HIGH',
    valueAtRisk: 750000,
    vulnerabilities: [
      {
        cveId: 'CVE-2024-24576',
        title: 'Rust Command Injection via OS Execution',
        cvss: 7.5,
        epss: 0.42,
        severity: 'HIGH',
        vector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N',
        description: 'Command injection vulnerability in standard library on Windows-adjacent subsystem.',
        patchAvailable: true,
        remediationCost: 8000
      }
    ],
    status: 'healthy',
    x: 290,
    y: 120,
    tags: ['DMZ', 'Proxy', 'TLS-Terminator'],
    blastRadiusScore: 55,
    controlsApplied: ['ctrl-waf'],
    owner: 'Platform Eng'
  },
  {
    id: 'auth-keycloak',
    label: 'Keycloak SSO / OIDC Auth Provider',
    zone: 'dmz',
    category: 'identity_provider',
    ipAddress: '172.16.10.40',
    criticality: 'CRITICAL',
    valueAtRisk: 3200000,
    vulnerabilities: [
      {
        cveId: 'CVE-2023-22515',
        title: 'Broken Access Control & Token Impersonation',
        cvss: 8.8,
        epss: 0.65,
        severity: 'HIGH',
        vector: 'CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:N',
        description: 'Flaw in token revocation validation allows forged session tokens to maintain persistent access.',
        patchAvailable: true,
        remediationCost: 25000
      }
    ],
    status: 'vulnerable',
    x: 290,
    y: 280,
    tags: ['Identity', 'OIDC', 'SSO'],
    blastRadiusScore: 92,
    controlsApplied: ['ctrl-mfa'],
    owner: 'IAM Security'
  },

  // Cloud Infrastructure (AWS / Azure)
  {
    id: 'cloud-eks-ingress',
    label: 'Kubernetes Ingress (EKS Cluster)',
    zone: 'cloud',
    category: 'cloud_service',
    ipAddress: '10.200.4.10',
    criticality: 'HIGH',
    valueAtRisk: 1400000,
    vulnerabilities: [
      {
        cveId: 'CVE-2024-3094',
        title: 'XZ Utils Backdoor Infiltration Vector',
        cvss: 10.0,
        epss: 0.89,
        severity: 'CRITICAL',
        vector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:H/A:H',
        description: 'Malicious code in upstream liblzma compression library targeting SSH daemon authentication.',
        patchAvailable: true,
        remediationCost: 35000
      }
    ],
    status: 'vulnerable',
    x: 520,
    y: 80,
    tags: ['K8s', 'EKS', 'Containers'],
    blastRadiusScore: 78,
    controlsApplied: ['ctrl-cspm'],
    owner: 'DevSecOps'
  },
  {
    id: 'cloud-microservices',
    label: 'Banking API Microservices Cluster',
    zone: 'cloud',
    category: 'server',
    ipAddress: '10.200.4.55',
    criticality: 'CRITICAL',
    valueAtRisk: 4200000,
    vulnerabilities: [],
    status: 'healthy',
    x: 520,
    y: 220,
    tags: ['Core-API', 'Microservices', 'Spring-Boot'],
    blastRadiusScore: 85,
    controlsApplied: ['ctrl-edr', 'ctrl-cspm'],
    owner: 'Fintech Engineering'
  },
  {
    id: 'cloud-s3-datalake',
    label: 'AWS S3 Customer Data Lake & Vault',
    zone: 'cloud',
    category: 'database',
    ipAddress: '10.200.8.99',
    criticality: 'CRITICAL',
    valueAtRisk: 6800000,
    vulnerabilities: [],
    status: 'healthy',
    x: 520,
    y: 380,
    tags: ['DataLake', 'S3', 'PII-Store', 'Encrypted-KMS'],
    blastRadiusScore: 95,
    controlsApplied: ['ctrl-dlp', 'ctrl-cspm'],
    owner: 'Chief Data Officer'
  },

  // Internal Corporate Network
  {
    id: 'corp-ad-dc',
    label: 'Active Directory Domain Controller',
    zone: 'internal',
    category: 'identity_provider',
    ipAddress: '192.168.1.10',
    criticality: 'CRITICAL',
    valueAtRisk: 5500000,
    vulnerabilities: [
      {
        cveId: 'CVE-2023-38606',
        title: 'Active Directory Kerberos Privilege Elevation',
        cvss: 8.8,
        epss: 0.72,
        severity: 'HIGH',
        vector: 'CVSS:3.1/AV:A/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H',
        description: 'Improper validation in Kerberos PAC signature verification grants Golden Ticket delegation.',
        patchAvailable: true,
        remediationCost: 18000
      }
    ],
    status: 'vulnerable',
    x: 740,
    y: 100,
    tags: ['Active-Directory', 'Kerberos', 'Crown-Jewel'],
    blastRadiusScore: 98,
    controlsApplied: ['ctrl-mfa'],
    owner: 'IT Enterprise Ops'
  },
  {
    id: 'corp-workstations',
    label: 'Executive & Finance Workstations (VLAN 40)',
    zone: 'internal',
    category: 'endpoint',
    ipAddress: '192.168.40.0/24',
    criticality: 'HIGH',
    valueAtRisk: 1100000,
    vulnerabilities: [
      {
        cveId: 'CVE-2023-36884',
        title: 'Office & Windows HTML RCE Vulnerability',
        cvss: 8.3,
        epss: 0.58,
        severity: 'HIGH',
        vector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:H/I:H/A:H',
        description: 'Spear-phishing vector with crafted Microsoft Office attachments executing unverified payload.',
        patchAvailable: true,
        remediationCost: 12000
      }
    ],
    status: 'vulnerable',
    x: 740,
    y: 250,
    tags: ['Endpoints', 'Windows-11', 'Phishing-Vector'],
    blastRadiusScore: 68,
    controlsApplied: ['ctrl-edr'],
    owner: 'IT Support'
  },
  {
    id: 'corp-erp-payroll',
    label: 'SAP ERP & Payroll Processing Server',
    zone: 'internal',
    category: 'server',
    ipAddress: '192.168.20.100',
    criticality: 'HIGH',
    valueAtRisk: 2900000,
    vulnerabilities: [],
    status: 'healthy',
    x: 740,
    y: 400,
    tags: ['ERP', 'SAP', 'Payroll', 'Finance'],
    blastRadiusScore: 72,
    controlsApplied: ['ctrl-edr'],
    owner: 'Finance Director'
  },

  // OT / ICS SCADA Industrial Zone
  {
    id: 'ot-bridge-firewall',
    label: 'IT/OT Air-Gap Bridge Firewall',
    zone: 'ot_ics',
    category: 'gateway',
    ipAddress: '192.168.99.1',
    criticality: 'CRITICAL',
    valueAtRisk: 2200000,
    vulnerabilities: [],
    status: 'healthy',
    x: 950,
    y: 80,
    tags: ['Purdue-Level-3.5', 'DMZ-OT', 'Palo-Alto'],
    blastRadiusScore: 84,
    controlsApplied: ['ctrl-microseg'],
    owner: 'Industrial SecOps'
  },
  {
    id: 'ot-scada-historian',
    label: 'SCADA Data Historian & Telemetry Server',
    zone: 'ot_ics',
    category: 'server',
    ipAddress: '10.50.1.15',
    criticality: 'CRITICAL',
    valueAtRisk: 4900000,
    vulnerabilities: [
      {
        cveId: 'CVE-2022-29953',
        title: 'Wonderware Historian Unauthenticated Stack Overflow',
        cvss: 9.1,
        epss: 0.62,
        severity: 'CRITICAL',
        vector: 'CVSS:3.1/AV:A/AC:L/PR:N/UI:N/S:C/C:H/I:H/A:H',
        description: 'Remote stack-based buffer overflow enables execution of arbitrary shellcode in SCADA subsystem.',
        patchAvailable: false,
        remediationCost: 45000
      }
    ],
    status: 'vulnerable',
    x: 950,
    y: 220,
    tags: ['SCADA', 'Telemetry', 'Purdue-Level-3'],
    blastRadiusScore: 90,
    controlsApplied: [],
    owner: 'Plant Operations'
  },
  {
    id: 'ot-siemens-plc',
    label: 'Siemens S7-1500 Industrial PLC Array',
    zone: 'ot_ics',
    category: 'scada_plc',
    ipAddress: '10.50.2.1-16',
    criticality: 'CRITICAL',
    valueAtRisk: 8500000,
    vulnerabilities: [],
    status: 'healthy',
    x: 950,
    y: 380,
    tags: ['PLC', 'S7-1500', 'Physical-Safety', 'Critical-Infra'],
    blastRadiusScore: 99,
    controlsApplied: ['ctrl-microseg'],
    owner: 'Chief Automation Engineer'
  },

  // Financial Core Vault
  {
    id: 'fin-core-db',
    label: 'PostgreSQL Core Financial Ledger',
    zone: 'financial_db',
    category: 'database',
    ipAddress: '10.100.1.20',
    criticality: 'CRITICAL',
    valueAtRisk: 12500000,
    vulnerabilities: [],
    status: 'healthy',
    x: 1160,
    y: 160,
    tags: ['Core-Ledger', 'PCI-DSS', 'High-Integrity', 'Crown-Jewel'],
    blastRadiusScore: 100,
    controlsApplied: ['ctrl-immutable-backup', 'ctrl-microseg'],
    owner: 'Chief Risk Officer'
  },
  {
    id: 'fin-swift-switch',
    label: 'SWIFT / Fedwire Payment Gateway',
    zone: 'financial_db',
    category: 'server',
    ipAddress: '10.100.1.88',
    criticality: 'CRITICAL',
    valueAtRisk: 15000000,
    vulnerabilities: [],
    status: 'healthy',
    x: 1160,
    y: 320,
    tags: ['SWIFT', 'Payment-Switch', 'HSM-Backed', 'RBI-Regulated'],
    blastRadiusScore: 100,
    controlsApplied: ['ctrl-mfa', 'ctrl-immutable-backup'],
    owner: 'Treasury & Settlement'
  }
];

export const INITIAL_NETWORK_EDGES: NetworkEdge[] = [
  { id: 'e1', source: 'edge-waf', target: 'dmz-proxy', protocol: 'HTTPS', port: 443, isEncrypted: true, trustLevel: 'medium' },
  { id: 'e2', source: 'vpn-gw', target: 'auth-keycloak', protocol: 'LDAPS', port: 636, isEncrypted: true, trustLevel: 'medium' },
  { id: 'e3', source: 'vpn-gw', target: 'corp-workstations', protocol: 'RDP/SSH', port: 3389, isEncrypted: true, trustLevel: 'untrusted' },
  { id: 'e4', source: 'dmz-proxy', target: 'cloud-eks-ingress', protocol: 'gRPC', port: 8443, isEncrypted: true, trustLevel: 'high' },
  { id: 'e5', source: 'auth-keycloak', target: 'corp-ad-dc', protocol: 'Kerberos', port: 88, isEncrypted: true, trustLevel: 'high' },
  { id: 'e6', source: 'cloud-eks-ingress', target: 'cloud-microservices', protocol: 'HTTP/2', port: 8080, isEncrypted: true, trustLevel: 'high' },
  { id: 'e7', source: 'cloud-microservices', target: 'cloud-s3-datalake', protocol: 'HTTPS/S3', port: 443, isEncrypted: true, trustLevel: 'high' },
  { id: 'e8', source: 'corp-workstations', target: 'corp-ad-dc', protocol: 'SMB/RPC', port: 445, isEncrypted: false, trustLevel: 'medium' },
  { id: 'e9', source: 'corp-workstations', target: 'corp-erp-payroll', protocol: 'HTTPS', port: 8443, isEncrypted: true, trustLevel: 'medium' },
  { id: 'e10', source: 'corp-ad-dc', target: 'ot-bridge-firewall', protocol: 'LDAP', port: 389, isEncrypted: false, trustLevel: 'untrusted' },
  { id: 'e11', source: 'ot-bridge-firewall', target: 'ot-scada-historian', protocol: 'OPC-UA', port: 4840, isEncrypted: true, trustLevel: 'medium' },
  { id: 'e12', source: 'ot-scada-historian', target: 'ot-siemens-plc', protocol: 'S7comm', port: 102, isEncrypted: false, trustLevel: 'high' },
  { id: 'e13', source: 'cloud-microservices', target: 'fin-core-db', protocol: 'PostgreSQL TLS', port: 5432, isEncrypted: true, trustLevel: 'high' },
  { id: 'e14', source: 'corp-erp-payroll', target: 'fin-swift-switch', protocol: 'MT/ISO20022', port: 9000, isEncrypted: true, trustLevel: 'high' },
  { id: 'e15', source: 'fin-core-db', target: 'fin-swift-switch', protocol: 'RPC Mutual TLS', port: 7001, isEncrypted: true, trustLevel: 'high' }
];

export const SECURITY_CONTROLS_CATALOG: SecurityControl[] = [
  {
    id: 'ctrl-edr',
    name: 'Next-Gen EDR & XDR Agent (CrowdStrike / Defender)',
    category: 'Endpoint',
    annualCost: 145000,
    implementationMonths: 1.5,
    riskReductionFactor: 0.42,
    coverageZones: ['internal', 'dmz'],
    description: 'Autonomous behavioral containment, memory exploitation defense, and continuous endpoint telemetry.',
    mitreCovered: ['T1059', 'T1055', 'T1078', 'T1204'],
    vendorRecommendation: 'CrowdStrike Falcon Enterprise',
    isActive: true
  },
  {
    id: 'ctrl-mfa',
    name: 'FIDO2 Zero-Trust Hardware MFA & Conditional Access',
    category: 'Identity',
    annualCost: 95000,
    implementationMonths: 2,
    riskReductionFactor: 0.48,
    coverageZones: ['perimeter', 'dmz', 'internal', 'financial_db'],
    description: 'Phishing-resistant WebAuthn security keys enforcing strict context-aware device health evaluation.',
    mitreCovered: ['T1078', 'T1110', 'T1556'],
    vendorRecommendation: 'Yubico / Okta FastPass',
    isActive: true
  },
  {
    id: 'ctrl-cspm',
    name: 'Cloud Security Posture Management & CI/CD Scanner',
    category: 'Cloud',
    annualCost: 120000,
    implementationMonths: 1,
    riskReductionFactor: 0.38,
    coverageZones: ['cloud'],
    description: 'Automated drift detection, IAM over-permissioning remediator, and K8s admission controller.',
    mitreCovered: ['T1078.004', 'T1580', 'T1530'],
    vendorRecommendation: 'Wiz / Prisma Cloud',
    isActive: false
  },
  {
    id: 'ctrl-microseg',
    name: 'Identity-Centric Network Microsegmentation',
    category: 'Network',
    annualCost: 210000,
    implementationMonths: 3.5,
    riskReductionFactor: 0.52,
    coverageZones: ['internal', 'ot_ics', 'financial_db'],
    description: 'Software-defined distributed microsegmentation preventing all unauthorized lateral movement across zones.',
    mitreCovered: ['T1021', 'T1046', 'T1570'],
    vendorRecommendation: 'Illumio Zero Trust Core',
    isActive: false
  },
  {
    id: 'ctrl-immutable-backup',
    name: 'Air-Gapped Immutable Cloud & Tape Backup Vault',
    category: 'Data_Governance',
    annualCost: 175000,
    implementationMonths: 2,
    riskReductionFactor: 0.45,
    coverageZones: ['cloud', 'financial_db', 'internal'],
    description: 'WORM-protected offsite snapshots with zero delete window and automated 15-minute bare-metal recovery.',
    mitreCovered: ['T1486', 'T1490'],
    vendorRecommendation: 'Rubrik Security Cloud',
    isActive: true
  },
  {
    id: 'ctrl-waf',
    name: 'Edge Next-Gen WAF & API Threat Shield',
    category: 'Application',
    annualCost: 85000,
    implementationMonths: 0.5,
    riskReductionFactor: 0.30,
    coverageZones: ['perimeter', 'dmz'],
    description: 'Deep packet inspection blocking OWASP Top 10, automated credential stuffing, and unauthenticated API abuse.',
    mitreCovered: ['T1190', 'T1212'],
    vendorRecommendation: 'Cloudflare Magic WAN + API Shield',
    isActive: true
  },
  {
    id: 'ctrl-patch-orchestration',
    name: 'Continuous Risk-Based Vulnerability & Patch Automation',
    category: 'Endpoint',
    annualCost: 110000,
    implementationMonths: 1.5,
    riskReductionFactor: 0.39,
    coverageZones: ['perimeter', 'dmz', 'internal', 'cloud'],
    description: 'EPSS-correlated automated patching within 72 hours for actively exploited CISA KEV vulnerabilities.',
    mitreCovered: ['T1190', 'T1068'],
    vendorRecommendation: 'Tenable One + Automox',
    isActive: false
  },
  {
    id: 'ctrl-ot-guard',
    name: 'OT/ICS Industrial Protocol DPI & Anomaly Sensor',
    category: 'Network',
    annualCost: 160000,
    implementationMonths: 3,
    riskReductionFactor: 0.44,
    coverageZones: ['ot_ics'],
    description: 'Deep inspection of Modbus, OPC-UA, and S7comm packets detecting unauthorized firmware reprogram commands.',
    mitreCovered: ['T0814', 'T0836', 'T0855'],
    vendorRecommendation: 'Nozomi Networks Guardian',
    isActive: false
  }
];

export const ATTACK_SCENARIOS: AttackScenario[] = [
  {
    id: 'scenario-ransomware',
    title: 'Multi-Stage Human-Operated Ransomware (BlackCat / LockBit 3.0)',
    threatActor: 'FIN7 / Scattered Spider Variant',
    actorProfile: 'Financially motivated threat syndicate targeting financial institutions with double extortion and data auctions.',
    description: 'Infiltration begins via spear-phishing an executive workstation, escalating privileges in Active Directory, pivoting to the core financial databases, and deploying volume shadow copy wipe and Salsa20 encryption.',
    primaryZone: 'internal',
    estimatedTotalLoss: 6200000,
    attackSteps: [
      {
        stepNumber: 1,
        name: 'Initial Access via Spear-Phishing Macro',
        techniqueId: 'T1566.001',
        techniqueName: 'Spearphishing Attachment',
        sourceNodeId: 'edge-waf',
        targetNodeId: 'corp-workstations',
        narrative: 'Targeted spear-phishing email bypasses perimeter filter and delivers weaponized invoice attachment executing PowerShell loader in memory.',
        exploitLikelihood: 0.65,
        detectionChance: 0.35,
        financialImpactStep: 85000,
        mitigatedBy: ['ctrl-edr']
      },
      {
        stepNumber: 2,
        name: 'Credential Harvesting & Kerberoasting',
        techniqueId: 'T1558.003',
        techniqueName: 'Kerberoasting',
        sourceNodeId: 'corp-workstations',
        targetNodeId: 'corp-ad-dc',
        narrative: 'Attacker requests TGS tickets for domain service accounts and cracks RC4/AES hashes offline, achieving Domain Admin equivalence.',
        exploitLikelihood: 0.78,
        detectionChance: 0.45,
        financialImpactStep: 340000,
        mitigatedBy: ['ctrl-mfa', 'ctrl-edr']
      },
      {
        stepNumber: 3,
        name: 'Lateral Movement across VLANs',
        techniqueId: 'T1021.002',
        techniqueName: 'SMB/Windows Admin Shares',
        sourceNodeId: 'corp-ad-dc',
        targetNodeId: 'corp-erp-payroll',
        narrative: 'Using captured Golden Ticket credentials, adversary moves east-west across unrestricted internal subnet directly into core SAP ERP systems.',
        exploitLikelihood: 0.82,
        detectionChance: 0.40,
        financialImpactStep: 950000,
        mitigatedBy: ['ctrl-microseg']
      },
      {
        stepNumber: 4,
        name: 'Crown Jewel Database Extortion & Encryption',
        techniqueId: 'T1486',
        techniqueName: 'Data Encrypted for Impact',
        sourceNodeId: 'corp-erp-payroll',
        targetNodeId: 'fin-core-db',
        narrative: 'Adversary exfiltrates 1.2M financial records via covert TLS channel, deletes local snapshots, and launches multi-threaded ChaCha20 encryption across database nodes.',
        exploitLikelihood: 0.90,
        detectionChance: 0.70,
        financialImpactStep: 4825000,
        mitigatedBy: ['ctrl-immutable-backup', 'ctrl-microseg']
      }
    ]
  },
  {
    id: 'scenario-edge-vpn',
    title: 'Zero-Day Edge Perimeter Bypass & Identity Hijack',
    threatActor: 'Volt Typhoon / Nation-State APT',
    actorProfile: 'Advanced persistent threat utilizing living-off-the-land techniques to establish long-term espionage persistence in critical infrastructure.',
    description: 'Exploitation of Ivanti SSL-VPN authentication bypass zero-day CVE-2023-46805, forging SAML assertion tokens to impersonate cloud administrator identities.',
    primaryZone: 'perimeter',
    estimatedTotalLoss: 4800000,
    attackSteps: [
      {
        stepNumber: 1,
        name: 'Authentication Bypass on Perimeter Gateway',
        techniqueId: 'T1190',
        techniqueName: 'Exploit Public-Facing Application',
        sourceNodeId: 'edge-waf',
        targetNodeId: 'vpn-gw',
        narrative: 'Attacker probes Ivanti endpoint with path-traversal payload bypassing auth checks and drops web shell in webroot directory.',
        exploitLikelihood: 0.94,
        detectionChance: 0.20,
        financialImpactStep: 220000,
        mitigatedBy: ['ctrl-patch-orchestration', 'ctrl-waf']
      },
      {
        stepNumber: 2,
        name: 'SAML Token Tampering & Identity Impersonation',
        techniqueId: 'T1606.002',
        techniqueName: 'SAML Token Manipulation',
        sourceNodeId: 'vpn-gw',
        targetNodeId: 'auth-keycloak',
        narrative: 'Exploiting shared signing keys from memory dump, adversary issues signed cryptographic assertion claiming SuperAdmin role in Keycloak.',
        exploitLikelihood: 0.74,
        detectionChance: 0.35,
        financialImpactStep: 890000,
        mitigatedBy: ['ctrl-mfa']
      },
      {
        stepNumber: 3,
        name: 'Cloud EKS Pod Takeover & S3 Exfiltration',
        techniqueId: 'T1530',
        techniqueName: 'Data from Cloud Storage',
        sourceNodeId: 'auth-keycloak',
        targetNodeId: 'cloud-s3-datalake',
        narrative: 'Forged identity assumes AWS IAM role, extracts S3 bucket objects containing sensitive financial customer records, triggering compliance violation fines.',
        exploitLikelihood: 0.85,
        detectionChance: 0.60,
        financialImpactStep: 3690000,
        mitigatedBy: ['ctrl-cspm', 'ctrl-microseg']
      }
    ]
  },
  {
    id: 'scenario-ot-sabotage',
    title: 'Critical Infrastructure OT/ICS SCADA Sabotage',
    threatActor: 'Sandworm / Cyber Warfare Unit',
    actorProfile: 'State-sponsored destructive actor aiming to cause physical damage, blackouts, or mechanical equipment destruction in operational networks.',
    description: 'Adversary traverses corporate IT network, exploits IT/OT bridge routing, injects malicious command blocks into SCADA Historian, and overrides PLC safety limits.',
    primaryZone: 'ot_ics',
    estimatedTotalLoss: 9200000,
    attackSteps: [
      {
        stepNumber: 1,
        name: 'IT/OT Bridge Firewall Traversal',
        techniqueId: 'T0885',
        techniqueName: 'Commonly Used Port Pivoting',
        sourceNodeId: 'corp-ad-dc',
        targetNodeId: 'ot-bridge-firewall',
        narrative: 'Adversary uses hijacked domain credentials to pivot through legacy maintenance port permitted on the IT/OT boundary firewall.',
        exploitLikelihood: 0.60,
        detectionChance: 0.30,
        financialImpactStep: 450000,
        mitigatedBy: ['ctrl-microseg']
      },
      {
        stepNumber: 2,
        name: 'SCADA Historian Telemetry Hijack',
        techniqueId: 'T0814',
        techniqueName: 'Denial of Service & Spoofed Telemetry',
        sourceNodeId: 'ot-bridge-firewall',
        targetNodeId: 'ot-scada-historian',
        narrative: 'Exploitation of Wonderware buffer overflow CVE-2022-29953 injects fake temperature and pressure readings into operator consoles.',
        exploitLikelihood: 0.72,
        detectionChance: 0.40,
        financialImpactStep: 1850000,
        mitigatedBy: ['ctrl-ot-guard', 'ctrl-patch-orchestration']
      },
      {
        stepNumber: 3,
        name: 'Physical Safety Logic Override on S7 PLC Array',
        techniqueId: 'T0855',
        techniqueName: 'Unauthorized Command Message',
        sourceNodeId: 'ot-scada-historian',
        targetNodeId: 'ot-siemens-plc',
        narrative: 'Attacker sends unauthorized S7comm packets to alter logic blocks in Siemens S7 PLCs, causing thermal shutdown and turbine damage.',
        exploitLikelihood: 0.80,
        detectionChance: 0.65,
        financialImpactStep: 6900000,
        mitigatedBy: ['ctrl-ot-guard', 'ctrl-microseg']
      }
    ]
  }
];

export const BASELINE_FAIR_INPUTS: FairModelInputs = {
  threatEventFrequencyMin: 12, // 12 attempted breach campaigns / year
  threatEventFrequencyMode: 38,
  threatEventFrequencyMax: 85,
  threatCapabilityMode: 68, // Adversary capability score 0-100
  controlStrengthMode: 44, // Baseline enterprise control strength
  primaryLossMin: 150000, // Incident response, forensic, triage
  primaryLossMode: 850000,
  primaryLossMax: 3200000,
  secondaryLossMin: 400000, // Regulatory fines, reputational fallout, churn
  secondaryLossMode: 2400000,
  secondaryLossMax: 8500000,
  secondaryLossProbability: 0.72
};

export const COMPLIANCE_SCORES: ComplianceFrameworkScore[] = [
  {
    framework: 'NIST Cybersecurity Framework 2.0',
    overallScore: 68,
    categories: [
      { name: 'Govern (GV)', score: 75, controlsImplemented: 12, controlsTotal: 16 },
      { name: 'Identify (ID)', score: 72, controlsImplemented: 18, controlsTotal: 25 },
      { name: 'Protect (PR)', score: 64, controlsImplemented: 21, controlsTotal: 33 },
      { name: 'Detect (DE)', score: 61, controlsImplemented: 14, controlsTotal: 23 },
      { name: 'Respond (RS)', score: 70, controlsImplemented: 14, controlsTotal: 20 },
      { name: 'Recover (RC)', score: 60, controlsImplemented: 9, controlsTotal: 15 }
    ]
  },
  {
    framework: 'ISO/IEC 27001:2022 Annex A',
    overallScore: 71,
    categories: [
      { name: 'Organizational Controls (5.x)', score: 78, controlsImplemented: 29, controlsTotal: 37 },
      { name: 'People Controls (6.x)', score: 65, controlsImplemented: 5, controlsTotal: 8 },
      { name: 'Physical Controls (7.x)', score: 82, controlsImplemented: 11, controlsTotal: 14 },
      { name: 'Technological Controls (8.x)', score: 64, controlsImplemented: 22, controlsTotal: 34 }
    ]
  },
  {
    framework: 'CIS Critical Security Controls v8',
    overallScore: 65,
    categories: [
      { name: 'IG1 (Basic Cyber Hygiene)', score: 84, controlsImplemented: 47, controlsTotal: 56 },
      { name: 'IG2 (Enterprise Defense)', score: 62, controlsImplemented: 46, controlsTotal: 74 },
      { name: 'IG3 (Advanced Threat Defense)', score: 48, controlsImplemented: 19, controlsTotal: 40 }
    ]
  }
];
