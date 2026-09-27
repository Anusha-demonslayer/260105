import React from 'react';
import { 
  X, 
  Printer, 
  Download, 
  FileText, 
  ShieldCheck, 
  CheckCircle2, 
  TrendingDown, 
  AlertTriangle 
} from 'lucide-react';
import { 
  FairModelInputs, 
  MonteCarloResult, 
  SecurityControl, 
  NetworkNode 
} from '../types/cyberrisk';
import { formatCurrency } from '../utils/fairEngine';

interface ExecutiveReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  baselineALE: number;
  mitigatedALE: number;
  var95: number;
  var99: number;
  activeControls: SecurityControl[];
  nodes: NetworkNode[];
  currency: 'USD' | 'INR';
}

export const ExecutiveReportModal: React.FC<ExecutiveReportModalProps> = ({
  isOpen,
  onClose,
  baselineALE,
  mitigatedALE,
  var95,
  var99,
  activeControls,
  nodes,
  currency
}) => {
  if (!isOpen) return null;

  const totalCost = activeControls
    .filter(c => c.isActive)
    .reduce((acc, c) => acc + c.annualCost, 0);

  const riskMitigated = Math.max(0, baselineALE - mitigatedALE);
  const netBenefit = riskMitigated - totalCost;
  const rosiPercentage = totalCost > 0 ? (netBenefit / totalCost) * 100 : 0;

  const vulnerableNodes = nodes.filter(n => n.vulnerabilities.length > 0);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJSON = () => {
    const reportData = {
      project: 'CyberRiskTwin - Continuous Cyber Risk Quantification & Investment Optimizer',
      problemStatement: 'SIH260105 / SIH26105 (AICTE Smart India Hackathon)',
      timestamp: new Date().toISOString(),
      currency,
      executiveMetrics: {
        baselineALE,
        mitigatedALE,
        riskReductionPercentage: Math.round(((baselineALE - mitigatedALE) / baselineALE) * 100),
        valueAtRisk95: var95,
        extremeTailRisk99: var99,
        securityInvestmentCost: totalCost,
        netFinancialBenefit: netBenefit,
        returnOnSecurityInvestmentROSI: rosiPercentage
      },
      activeProtectiveControls: activeControls.filter(c => c.isActive).map(c => ({
        id: c.id,
        name: c.name,
        category: c.category,
        annualCost: c.annualCost,
        riskReductionFactor: c.riskReductionFactor
      })),
      assetInventorySummary: {
        totalAssets: nodes.length,
        vulnerableCount: vulnerableNodes.length,
        vulnerableAssets: vulnerableNodes.map(v => ({
          name: v.label,
          ip: v.ipAddress,
          criticality: v.criticality,
          cves: v.vulnerabilities.map(c => c.cveId)
        }))
      }
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CyberRiskTwin-SIH260105-ExecutiveReport-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#0b1120] border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white">
              CISO & Boardroom Cyber Risk Executive Briefing
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>

            <button
              onClick={handleDownloadJSON}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 rounded-lg text-xs font-bold transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Audit JSON</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-slate-200">
          
          {/* Document Header */}
          <div className="border-b border-slate-800 pb-5">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-semibold">
                  CONFIDENTIAL · BOARD OF DIRECTORS BRIEFING
                </span>
                <h1 className="text-2xl font-bold text-white mt-1">
                  Cyber Risk Quantification & Investment Allocation Dossier
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Prepared by: <strong>CyberRiskTwin Autonomous Risk Engine</strong> · Framework: Open FAIR Standard
                </p>
              </div>
              <div className="text-right text-xs font-mono text-slate-400">
                <div>Date: {new Date().toLocaleDateString()}</div>
                <div>Classification: Restricted</div>
                <div className="text-cyan-400 font-bold">Hackathon Ref: SIH260105</div>
              </div>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-cyan-300 uppercase font-mono tracking-wider">
              1. Executive Summary
            </h3>
            <p className="text-xs leading-relaxed text-slate-300">
              This report provides continuous, quantitative financial measurement of our digital risk posture.
              Unlike qualitative risk matrices (High/Medium/Low), this assessment applies stochastic Factor Analysis of Information Risk (FAIR) 
              and dynamic digital twin simulation to calculate exact expected financial loss distributions and Return on Security Investment (ROSI).
            </p>
          </div>

          {/* Key Financial Risk Findings */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-cyan-300 uppercase font-mono tracking-wider">
              2. Quantitative Financial Risk Exposure
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-lg">
                <span className="text-[11px] text-slate-400 block">Baseline Unmitigated ALE</span>
                <span className="text-base font-bold font-mono text-slate-300 mt-1 block">
                  {formatCurrency(baselineALE, currency)}
                </span>
              </div>

              <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-lg">
                <span className="text-[11px] text-slate-400 block">Current Mitigated ALE</span>
                <span className="text-base font-bold font-mono text-cyan-400 mt-1 block">
                  {formatCurrency(mitigatedALE, currency)}
                </span>
              </div>

              <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-lg">
                <span className="text-[11px] text-slate-400 block">95% Value-at-Risk (VaR)</span>
                <span className="text-base font-bold font-mono text-amber-400 mt-1 block">
                  {formatCurrency(var95, currency)}
                </span>
              </div>

              <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-lg">
                <span className="text-[11px] text-slate-400 block">Extreme Tail Risk (99%)</span>
                <span className="text-base font-bold font-mono text-rose-400 mt-1 block">
                  {formatCurrency(var99, currency)}
                </span>
              </div>
            </div>
          </div>

          {/* Security Investment ROI */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-cyan-300 uppercase font-mono tracking-wider">
              3. Return on Security Investment (ROSI) & Optimization
            </h3>

            <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Total Security Budget Invested:</span>
                <span className="font-mono font-bold text-white">{formatCurrency(totalCost, currency)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Gross Cyber Risk Mitigated:</span>
                <span className="font-mono font-bold text-emerald-400">{formatCurrency(riskMitigated, currency)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Net Financial Value Generated:</span>
                <span className="font-mono font-bold text-cyan-400">{formatCurrency(netBenefit, currency)}</span>
              </div>
              <div className="flex justify-between py-1 font-bold text-sm">
                <span className="text-slate-200">Return on Investment (ROSI %):</span>
                <span className="font-mono text-emerald-400">+{rosiPercentage.toFixed(0)}%</span>
              </div>
            </div>
          </div>

          {/* Active Controls & Prioritized Recommendations */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-cyan-300 uppercase font-mono tracking-wider">
              4. Active Control Portfolio
            </h3>

            <div className="space-y-1.5 text-xs">
              {activeControls.filter(c => c.isActive).map((c) => (
                <div key={c.id} className="p-2.5 bg-slate-900/70 border border-slate-800 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <strong className="text-white">{c.name}</strong>
                      <span className="text-slate-500 font-mono ml-2">({c.category})</span>
                    </div>
                  </div>
                  <div className="font-mono text-slate-300">
                    {formatCurrency(c.annualCost, currency)} / yr
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Digital Twin Vulnerability Summary */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-cyan-300 uppercase font-mono tracking-wider">
              5. Priority Vulnerabilities & Blast Radius Exposures
            </h3>

            <div className="p-3 bg-slate-900/70 border border-slate-800 rounded-lg space-y-2 text-xs">
              <div className="text-slate-300">
                <strong>{vulnerableNodes.length} critical assets</strong> currently contain unpatched CVEs with high Exploit Prediction (EPSS) scores:
              </div>
              <ul className="list-disc list-inside text-slate-400 space-y-1 font-mono text-[11px]">
                {vulnerableNodes.map(n => (
                  <li key={n.id}>
                    <strong>{n.label}</strong> ({n.ipAddress}) · {n.vulnerabilities.map(v => `${v.cveId} (CVSS ${v.cvss})`).join(', ')}
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
