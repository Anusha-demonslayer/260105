import React from 'react';
import { 
  ShieldAlert, 
  Activity, 
  DollarSign, 
  Cpu, 
  Network, 
  TrendingDown, 
  FileText, 
  Layers, 
  GitBranch,
  Sparkles,
  Download
} from 'lucide-react';
import { formatCurrency } from '../utils/fairEngine';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currency: 'USD' | 'INR';
  setCurrency: (c: 'USD' | 'INR') => void;
  baselineALE: number;
  mitigatedALE: number;
  var95: number;
  vulnerableCount: number;
  compromisedCount: number;
  onOpenReport: () => void;
  onOpenGitModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  currency,
  setCurrency,
  baselineALE,
  mitigatedALE,
  var95,
  vulnerableCount,
  compromisedCount,
  onOpenReport,
  onOpenGitModal
}) => {
  const riskReducedPct = Math.round(((baselineALE - mitigatedALE) / baselineALE) * 100);

  const tabs = [
    { id: 'topology', label: 'Digital Twin Topology', icon: Network },
    { id: 'fair', label: 'FAIR Risk Engine', icon: Activity },
    { id: 'optimizer', label: 'Investment Optimizer (ROSI)', icon: TrendingDown },
    { id: 'simulator', label: 'Attack Path Simulation', icon: ShieldAlert },
    { id: 'assets', label: 'Asset & CVE Matrix', icon: Layers },
    { id: 'compliance', label: 'Compliance Crosswalk', icon: Cpu },
  ];

  return (
    <header className="border-b border-slate-800/80 bg-[#090d16]/95 backdrop-blur sticky top-0 z-40">
      {/* Top Bar: Brand, Quick Status, Currency & Actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.25)]">
            <Network className="w-5 h-5 text-cyan-400" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                CyberRiskTwin
                <span className="text-xs px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300 font-mono">
                  SIH260105
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400">
              Continuous Cyber Risk Quantification & Investment Optimization Platform
            </p>
          </div>
        </div>

        {/* Real-time Metric Telemetry Strip */}
        <div className="flex items-center flex-wrap gap-4 text-xs">
          {/* Current ALE Exposure */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-lg px-3 py-1.5 flex items-center gap-2">
            <span className="text-slate-400">Current Exposure (ALE):</span>
            <span className="font-mono font-bold text-amber-400 text-sm">
              {formatCurrency(mitigatedALE, currency)}
            </span>
            {riskReducedPct > 0 && (
              <span className="text-emerald-400 font-mono text-[11px] font-semibold">
                ↓ {riskReducedPct}%
              </span>
            )}
          </div>

          {/* Value at Risk (VaR 95) */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-lg px-3 py-1.5 flex items-center gap-2">
            <span className="text-slate-400">VaR (95%):</span>
            <span className="font-mono font-bold text-rose-400 text-sm">
              {formatCurrency(var95, currency)}
            </span>
          </div>

          {/* Node Health Status */}
          <div className="hidden sm:flex items-center gap-2 text-slate-400">
            <span>Vuln Assets: <strong className="text-amber-400 font-mono">{vulnerableCount}</strong></span>
            <span>·</span>
            <span>Breached: <strong className={compromisedCount > 0 ? "text-rose-400 font-mono font-bold" : "text-emerald-400 font-mono"}>{compromisedCount}</strong></span>
          </div>

          {/* Currency Toggle */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5">
            <button
              onClick={() => setCurrency('USD')}
              className={`px-2.5 py-1 rounded text-xs font-mono font-semibold transition-colors ${
                currency === 'USD' ? 'bg-cyan-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              $ USD
            </button>
            <button
              onClick={() => setCurrency('INR')}
              className={`px-2.5 py-1 rounded text-xs font-mono font-semibold transition-colors ${
                currency === 'INR' ? 'bg-cyan-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              ₹ INR
            </button>
          </div>

          {/* Top Actions: Download Zip, Executive Brief & GitHub Repo Sync */}
          <a
            href="/CyberRiskTwin-SIH260105.zip"
            download="CyberRiskTwin-SIH260105.zip"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-600/50 transition text-xs font-semibold cursor-pointer shadow-sm shadow-cyan-900/30"
            title="Download complete project source files as a ZIP"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Download ZIP</span>
          </a>

          <button
            onClick={onOpenReport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition text-xs font-medium cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            <span>CISO Brief</span>
          </button>

          <button
            onClick={onOpenGitModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900/90 text-emerald-300 border border-emerald-600/50 transition text-xs font-medium cursor-pointer"
          >
            <GitBranch className="w-3.5 h-3.5 text-emerald-400" />
            <span>GitHub Sync</span>
          </button>
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-800/60 overflow-x-auto">
        <nav className="flex space-x-1 py-1" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-2 px-3 text-xs font-medium rounded-md whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-cyan-950/70 text-cyan-300 border-b-2 border-cyan-400 shadow-[inset_0_-1px_0_rgba(6,182,212,0.4)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
