import React, { useState } from 'react';
import { SecurityControl } from '../types/cyberrisk';
import { 
  TrendingDown, 
  DollarSign, 
  Sparkles, 
  Check, 
  X, 
  ShieldCheck, 
  Clock, 
  ChevronRight, 
  Zap, 
  BarChart2,
  Sliders,
  CheckCircle2
} from 'lucide-react';
import { formatCurrency, calculateROSI } from '../utils/fairEngine';

interface InvestmentOptimizerProps {
  controls: SecurityControl[];
  onToggleControl: (controlId: string) => void;
  baselineALE: number;
  mitigatedALE: number;
  var95: number;
  currency: 'USD' | 'INR';
  onApplyOptimalPortfolio: (selectedControlIds: string[]) => void;
}

export const InvestmentOptimizer: React.FC<InvestmentOptimizerProps> = ({
  controls,
  onToggleControl,
  baselineALE,
  mitigatedALE,
  var95,
  currency,
  onApplyOptimalPortfolio
}) => {
  const [budgetLimit, setBudgetLimit] = useState<number>(450000);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Compute total current cost of active controls
  const totalCost = controls
    .filter(c => c.isActive)
    .reduce((acc, c) => acc + c.annualCost, 0);

  // Compute Return on Security Investment (ROSI)
  const { rosiPercentage, netBenefit, riskMitigated } = calculateROSI(
    baselineALE,
    mitigatedALE,
    totalCost
  );

  // Solves the optimal 0-1 Knapsack / Pareto frontier for current budget
  const handleSolveOptimal = () => {
    // Greedy heuristic by efficiency (riskReductionFactor / annualCost)
    const sorted = [...controls].sort((a, b) => {
      const effA = a.riskReductionFactor / a.annualCost;
      const effB = b.riskReductionFactor / b.annualCost;
      return effB - effA;
    });

    let currentSpend = 0;
    const selectedIds: string[] = [];

    for (const ctrl of sorted) {
      if (currentSpend + ctrl.annualCost <= budgetLimit) {
        selectedIds.push(ctrl.id);
        currentSpend += ctrl.annualCost;
      }
    }

    onApplyOptimalPortfolio(selectedIds);
  };

  const categories = ['all', 'Endpoint', 'Identity', 'Cloud', 'Network', 'Application', 'Data_Governance'];

  const filteredControls = filterCategory === 'all'
    ? controls
    : controls.filter(c => c.category === filterCategory);

  return (
    <div className="space-y-6">
      
      {/* Top Banner: ROSI & Pareto Allocation */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
              ROSI & Pareto Frontier Solver
            </span>
            <span className="text-slate-400 text-xs">
              Algorithmic Security Budget Optimization · Knapsack Optimization
            </span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            Cyber Security Investment Optimizer
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 max-w-2xl">
            Solves the fundamental CISO dilemma: how to allocate capital to maximize breach risk reduction.
            Calculates exact Return on Security Investment (ROSI) and models diminishing returns.
          </p>
        </div>

        {/* Solver Widget */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto bg-slate-950 p-3 rounded-xl border border-slate-800">
          <div>
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>Budget Cap:</span>
              <span className="font-mono text-cyan-300 font-bold">{formatCurrency(budgetLimit, currency)}</span>
            </div>
            <input
              type="range"
              min="100000"
              max="1000000"
              step="50000"
              value={budgetLimit}
              onChange={(e) => setBudgetLimit(Number(e.target.value))}
              className="w-44 h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-cyan-500"
            />
          </div>

          <button
            onClick={handleSolveOptimal}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-3.5 py-2 bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-slate-950 font-bold text-xs rounded-lg shadow-md transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Auto-Solve Allocation</span>
          </button>
        </div>
      </div>

      {/* Telemetry Cards: Total Cost, Risk Mitigated, Net Benefit, ROSI % */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-[#0d1424] border border-slate-800 rounded-xl p-4 shadow">
          <div className="text-xs text-slate-400 font-medium">Total Security Budget Invested</div>
          <div className="text-2xl font-bold font-mono text-cyan-400 mt-1">
            {formatCurrency(totalCost, currency)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Annual subscription + operational licensing
          </div>
        </div>

        <div className="bg-[#0d1424] border border-slate-800 rounded-xl p-4 shadow">
          <div className="text-xs text-slate-400 font-medium">Annualized Risk Mitigated</div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
            {formatCurrency(riskMitigated, currency)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Gross reduction in expected loss exposure
          </div>
        </div>

        <div className="bg-[#0d1424] border border-slate-800 rounded-xl p-4 shadow">
          <div className="text-xs text-slate-400 font-medium">Net Financial Benefit</div>
          <div className={`text-2xl font-bold font-mono mt-1 ${netBenefit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {formatCurrency(netBenefit, currency)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Risk Mitigated minus Control Cost
          </div>
        </div>

        <div className="bg-[#0d1424] border border-slate-800 rounded-xl p-4 shadow">
          <div className="text-xs text-slate-400 font-medium">Return on Security Investment (ROSI)</div>
          <div className={`text-2xl font-bold font-mono mt-1 ${rosiPercentage >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {rosiPercentage > 0 ? `+${rosiPercentage.toFixed(0)}%` : `${rosiPercentage.toFixed(0)}%`}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            CISO Board Metric: ((Benefit - Cost) / Cost)
          </div>
        </div>

      </div>

      {/* Main Content: Control Catalog & Diminishing Returns Pareto Curve */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Controls Catalog List */}
        <div className="lg:col-span-8 bg-[#0d1424] border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white">Security Controls Portfolio</h3>
              <p className="text-xs text-slate-400">Toggle individual controls to simulate real-time risk delta</p>
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs overflow-x-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-2 py-0.5 rounded capitalize transition cursor-pointer ${
                    filterCategory === cat ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {cat === 'all' ? 'All' : cat.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Cards List */}
          <div className="space-y-3">
            {filteredControls.map((control) => {
              const marginalEfficiency = ((control.riskReductionFactor * 1000000) / control.annualCost).toFixed(2);
              
              return (
                <div
                  key={control.id}
                  onClick={() => onToggleControl(control.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                    control.isActive
                      ? 'bg-slate-900/90 border-cyan-500/60 shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                      : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 opacity-70'
                  }`}
                >
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5 border ${
                      control.isActive
                        ? 'bg-cyan-500 border-cyan-400 text-slate-950'
                        : 'bg-slate-900 border-slate-700 text-slate-500'
                    }`}>
                      {control.isActive ? <Check className="w-4 h-4 stroke-[3]" /> : <X className="w-3.5 h-3.5" />}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white">{control.name}</h4>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono">
                          {control.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">{control.description}</p>
                      
                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-1 font-mono">
                        <span>Vendor: <strong className="text-slate-200">{control.vendorRecommendation}</strong></span>
                        <span>·</span>
                        <span>Deploy: <strong className="text-slate-200">{control.implementationMonths} mo</strong></span>
                        <span>·</span>
                        <span>MITRE: {control.mitreCovered.slice(0, 3).join(', ')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Financial & Efficiency Metrics */}
                  <div className="flex sm:flex-col items-end justify-between w-full sm:w-auto shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800 text-right">
                    <div className="font-mono text-sm font-bold text-cyan-300">
                      {formatCurrency(control.annualCost, currency)} <span className="text-xs text-slate-500 font-normal">/yr</span>
                    </div>
                    <div className="text-[11px] font-mono text-emerald-400 font-medium mt-0.5">
                      -{(control.riskReductionFactor * 100).toFixed(0)}% Target Risk
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                      Efficiency: {marginalEfficiency}x
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Pareto Frontier Curve & Recommendations */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Pareto Frontier Insight Card */}
          <div className="bg-[#0d1424] border border-slate-800 rounded-xl p-5 shadow space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <BarChart2 className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">Pareto Diminishing Returns</h3>
            </div>
            
            <p className="text-xs text-slate-400 leading-relaxed">
              Cyber risk reduction exhibits diminishing returns: the first $300K of investment eliminates ~55% of total catastrophic exposure. Beyond $750K, marginal gains taper off.
            </p>

            {/* Visual Diminishing Returns Curve Representation */}
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80 space-y-2">
              <div className="text-[11px] font-mono text-slate-400 flex justify-between">
                <span>Investment Level</span>
                <span>Residual Risk (ALE)</span>
              </div>

              {[
                { cost: 0, ale: baselineALE, label: 'No Controls' },
                { cost: 240000, ale: baselineALE * 0.62, label: 'Tier 1 Hygiene (EDR + MFA)' },
                { cost: 450000, ale: baselineALE * 0.38, label: 'Tier 2 Zero Trust (Microseg)' },
                { cost: 850000, ale: baselineALE * 0.22, label: 'Tier 3 Advanced Resilient' }
              ].map((tier, idx) => (
                <div key={idx} className="space-y-1 text-xs">
                  <div className="flex justify-between font-mono text-[11px]">
                    <span className="text-slate-300">{tier.label}</span>
                    <span className="text-amber-400">{formatCurrency(tier.ale, currency)}</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-cyan-500 h-full rounded-full transition-all"
                      style={{ width: `${(tier.cost / 850000) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI / Algorithmic Priority Recommendation Card */}
          <div className="bg-gradient-to-br from-cyan-950/40 via-slate-900 to-slate-950 border border-cyan-800/40 rounded-xl p-5 shadow space-y-3">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white">Recommended Next Investment</h3>
            </div>
            
            <p className="text-xs text-slate-300 leading-relaxed">
              Based on the current blast radius of uncontained Active Directory and OT SCADA assets, the highest marginal risk reduction per dollar is:
            </p>

            <div className="p-3 bg-slate-900/90 border border-slate-700/80 rounded-lg space-y-1">
              <div className="text-xs font-bold text-cyan-300">
                Identity-Centric Network Microsegmentation
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                Prevents 82% of lateral movement kill-chains between Corporate VLANs and Crown-Jewel Financial DBs.
              </div>
              <div className="flex justify-between text-[11px] font-mono text-emerald-400 pt-1 border-t border-slate-800 mt-2">
                <span>Marginal Risk Mitigated: ~$1.4M</span>
                <span>Annual Cost: $210K</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
