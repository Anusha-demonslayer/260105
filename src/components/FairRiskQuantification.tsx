import React, { useState } from 'react';
import { 
  FairModelInputs, 
  MonteCarloResult, 
  SecurityControl 
} from '../types/cyberrisk';
import { 
  formatCurrency, 
  formatAbbreviatedMoney,
  runFairMonteCarloSimulation
} from '../utils/fairEngine';
import { 
  Activity, 
  Sliders, 
  RefreshCw, 
  TrendingUp, 
  AlertCircle, 
  ShieldCheck, 
  HelpCircle,
  BarChart3,
  Flame,
  CheckCircle2
} from 'lucide-react';

interface FairRiskQuantificationProps {
  fairInputs: FairModelInputs;
  setFairInputs: (inputs: FairModelInputs) => void;
  monteCarloResult: MonteCarloResult;
  setMonteCarloResult: (res: MonteCarloResult) => void;
  activeControls: SecurityControl[];
  currency: 'USD' | 'INR';
}

export const FairRiskQuantification: React.FC<FairRiskQuantificationProps> = ({
  fairInputs,
  setFairInputs,
  monteCarloResult,
  setMonteCarloResult,
  activeControls,
  currency
}) => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [iterationsChoice, setIterationsChoice] = useState<number>(5000);

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      const res = runFairMonteCarloSimulation(fairInputs, activeControls, iterationsChoice);
      setMonteCarloResult(res);
      setIsSimulating(false);
    }, 250);
  };

  const handleInputChange = (key: keyof FairModelInputs, value: number) => {
    const updated = { ...fairInputs, [key]: value };
    setFairInputs(updated);
  };

  const maxHistogramCount = Math.max(...monteCarloResult.distributionHistogram.map(b => b.count), 1);

  return (
    <div className="space-y-6">
      
      {/* Top Banner: FAIR Standard & Problem Statement Context */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
              FAIR Standard (O-RT:2013)
            </span>
            <span className="text-slate-400 text-xs">
              Factor Analysis of Information Risk · Quantitative Cyber Financial Exposure
            </span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            Continuous Cyber Risk Quantification Engine
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 max-w-2xl">
            Replaces subjective qualitative matrices (High/Med/Low) with mathematically sound monetary distributions.
            Calibrated using Threat Event Frequency (TEF), Control Strength (CS), and Beta-PERT Monte Carlo stochastic sampling.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-1 text-xs">
            <span className="text-slate-400 px-2 font-mono">Samples:</span>
            {[2500, 5000, 10000].map((count) => (
              <button
                key={count}
                onClick={() => setIterationsChoice(count)}
                className={`px-2 py-1 rounded font-mono transition cursor-pointer ${
                  iterationsChoice === count ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {count.toLocaleString()}
              </button>
            ))}
          </div>

          <button
            onClick={handleRunSimulation}
            disabled={isSimulating}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs rounded-lg shadow-lg shadow-cyan-500/20 transition cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
            <span>{isSimulating ? 'Simulating...' : 'Run Monte Carlo'}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards: ALE, Median, VaR 95%, VaR 99% */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-[#0d1424] border border-slate-800 rounded-xl p-4 shadow">
          <div className="text-xs text-slate-400 font-medium">Annualized Loss Expectancy (ALE)</div>
          <div className="text-2xl font-bold font-mono text-cyan-400 mt-1">
            {formatCurrency(monteCarloResult.annualizedLossExpectancy, currency)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Mean expected annual cyber financial impact
          </div>
        </div>

        <div className="bg-[#0d1424] border border-slate-800 rounded-xl p-4 shadow">
          <div className="text-xs text-slate-400 font-medium">Median Loss (P50)</div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
            {formatCurrency(monteCarloResult.medianLoss, currency)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            50% probability annual loss is below this threshold
          </div>
        </div>

        <div className="bg-[#0d1424] border border-slate-800 rounded-xl p-4 shadow">
          <div className="text-xs text-slate-400 font-medium">Value-at-Risk (95% VaR)</div>
          <div className="text-2xl font-bold font-mono text-amber-400 mt-1">
            {formatCurrency(monteCarloResult.var95, currency)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            1-in-20 year worst-case loss ceiling (Board Benchmark)
          </div>
        </div>

        <div className="bg-[#0d1424] border border-slate-800 rounded-xl p-4 shadow">
          <div className="text-xs text-slate-400 font-medium">Extreme Tail Risk (99% VaR)</div>
          <div className="text-2xl font-bold font-mono text-rose-400 mt-1">
            {formatCurrency(monteCarloResult.var99, currency)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            1-in-100 year catastrophic solvency threat level
          </div>
        </div>

      </div>

      {/* Main Grid: Parameter Calibration Controls & Loss Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: FAIR Parameter Ontology Sliders */}
        <div className="lg:col-span-5 bg-[#0d1424] border border-slate-800 rounded-xl p-5 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">FAIR Calibration Parameters</h3>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Continuous Tuning</span>
          </div>

          {/* Section 1: Threat Event Frequency (TEF) */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-200">Threat Event Frequency (TEF) / Year</span>
              <span className="font-mono text-cyan-400 font-bold">{fairInputs.threatEventFrequencyMode} attempts</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-[11px]">
              <div>
                <label className="text-slate-400">Min</label>
                <input
                  type="number"
                  value={fairInputs.threatEventFrequencyMin}
                  onChange={(e) => handleInputChange('threatEventFrequencyMin', Number(e.target.value))}
                  className="w-full mt-1 bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-200 font-mono text-xs"
                />
              </div>
              <div>
                <label className="text-slate-400 font-bold text-cyan-300">Mode</label>
                <input
                  type="number"
                  value={fairInputs.threatEventFrequencyMode}
                  onChange={(e) => handleInputChange('threatEventFrequencyMode', Number(e.target.value))}
                  className="w-full mt-1 bg-slate-900 border border-cyan-800 rounded px-2 py-1 text-cyan-300 font-mono text-xs"
                />
              </div>
              <div>
                <label className="text-slate-400">Max</label>
                <input
                  type="number"
                  value={fairInputs.threatEventFrequencyMax}
                  onChange={(e) => handleInputChange('threatEventFrequencyMax', Number(e.target.value))}
                  className="w-full mt-1 bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-200 font-mono text-xs"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Capability vs Control Strength */}
          <div className="space-y-4 pt-2 border-t border-slate-800/80">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">Adversary Threat Capability (TCap):</span>
                <span className="font-mono text-rose-400 font-bold">{fairInputs.threatCapabilityMode} / 100</span>
              </div>
              <input
                type="range"
                min="20"
                max="95"
                value={fairInputs.threatCapabilityMode}
                onChange={(e) => handleInputChange('threatCapabilityMode', Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">Baseline Control Strength (CS):</span>
                <span className="font-mono text-emerald-400 font-bold">{fairInputs.controlStrengthMode} / 100</span>
              </div>
              <input
                type="range"
                min="10"
                max="90"
                value={fairInputs.controlStrengthMode}
                onChange={(e) => handleInputChange('controlStrengthMode', Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>
          </div>

          {/* Section 3: Primary Loss Magnitude */}
          <div className="space-y-2 pt-2 border-t border-slate-800/80">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-200">Primary Loss Magnitude (Incident Triage & Downtime)</span>
              <span className="font-mono text-cyan-400 font-bold">{formatCurrency(fairInputs.primaryLossMode, currency)}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-[11px]">
              <div>
                <label className="text-slate-400">Min ($)</label>
                <input
                  type="number"
                  step="50000"
                  value={fairInputs.primaryLossMin}
                  onChange={(e) => handleInputChange('primaryLossMin', Number(e.target.value))}
                  className="w-full mt-1 bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-200 font-mono text-xs"
                />
              </div>
              <div>
                <label className="text-slate-400 font-bold text-cyan-300">Mode ($)</label>
                <input
                  type="number"
                  step="50000"
                  value={fairInputs.primaryLossMode}
                  onChange={(e) => handleInputChange('primaryLossMode', Number(e.target.value))}
                  className="w-full mt-1 bg-slate-900 border border-cyan-800 rounded px-2 py-1 text-cyan-300 font-mono text-xs"
                />
              </div>
              <div>
                <label className="text-slate-400">Max ($)</label>
                <input
                  type="number"
                  step="100000"
                  value={fairInputs.primaryLossMax}
                  onChange={(e) => handleInputChange('primaryLossMax', Number(e.target.value))}
                  className="w-full mt-1 bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-200 font-mono text-xs"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Secondary Loss Magnitude */}
          <div className="space-y-2 pt-2 border-t border-slate-800/80">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-200">Secondary Loss (Fines, Litigation & Churn)</span>
              <span className="font-mono text-amber-400 font-bold">{formatCurrency(fairInputs.secondaryLossMode, currency)}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-[11px]">
              <div>
                <label className="text-slate-400">Min ($)</label>
                <input
                  type="number"
                  step="100000"
                  value={fairInputs.secondaryLossMin}
                  onChange={(e) => handleInputChange('secondaryLossMin', Number(e.target.value))}
                  className="w-full mt-1 bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-200 font-mono text-xs"
                />
              </div>
              <div>
                <label className="text-slate-400 font-bold text-amber-300">Mode ($)</label>
                <input
                  type="number"
                  step="100000"
                  value={fairInputs.secondaryLossMode}
                  onChange={(e) => handleInputChange('secondaryLossMode', Number(e.target.value))}
                  className="w-full mt-1 bg-slate-900 border border-amber-800 rounded px-2 py-1 text-amber-300 font-mono text-xs"
                />
              </div>
              <div>
                <label className="text-slate-400">Max ($)</label>
                <input
                  type="number"
                  step="500000"
                  value={fairInputs.secondaryLossMax}
                  onChange={(e) => handleInputChange('secondaryLossMax', Number(e.target.value))}
                  className="w-full mt-1 bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-200 font-mono text-xs"
                />
              </div>
            </div>
            <div className="pt-2">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">Secondary Loss Occurrence Probability:</span>
                <span className="font-mono text-slate-200">{(fairInputs.secondaryLossProbability * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={fairInputs.secondaryLossProbability}
                onChange={(e) => handleInputChange('secondaryLossProbability', Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
            </div>
          </div>

          <button
            onClick={handleRunSimulation}
            className="w-full py-2.5 rounded-lg bg-cyan-950 border border-cyan-800 hover:bg-cyan-900 text-cyan-300 font-semibold text-xs transition cursor-pointer flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Recalculate Probability Distributions
          </button>
        </div>

        {/* Right Column: Monte Carlo Loss Histogram & Loss Exceedance Curve (LEC) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Histogram Chart */}
          <div className="bg-[#0d1424] border border-slate-800 rounded-xl p-5 shadow">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">
                  Monte Carlo Loss Distribution ({monteCarloResult.iterations.toLocaleString()} Iterations)
                </h3>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                P95 VaR: <strong className="text-amber-400">{formatCurrency(monteCarloResult.var95, currency)}</strong>
              </span>
            </div>

            {/* Custom SVG/CSS Bar Histogram */}
            <div className="h-52 flex items-end gap-1.5 pt-4 pb-2 px-2 bg-slate-950/60 rounded-lg border border-slate-800/80">
              {monteCarloResult.distributionHistogram.map((item, idx) => {
                const heightPct = Math.max(4, (item.count / maxHistogramCount) * 100);
                const isVaRTail = item.lossRangeMax >= monteCarloResult.var95;

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                    {/* Tooltip on Hover */}
                    <div className="absolute -top-12 bg-slate-900 border border-slate-700 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap z-20 font-mono shadow-xl">
                      Range: {item.bucket} <br />
                      Runs: {item.count} ({((item.count / monteCarloResult.iterations) * 100).toFixed(1)}%)
                    </div>

                    <div
                      style={{ height: `${heightPct}%` }}
                      className={`w-full rounded-t transition-all duration-300 ${
                        isVaRTail 
                          ? 'bg-rose-500/80 group-hover:bg-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.4)]' 
                          : 'bg-cyan-500/70 group-hover:bg-cyan-400'
                      }`}
                    />
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between items-center text-[11px] font-mono text-slate-400 mt-2 px-1">
              <span>$0 (No Major Breach)</span>
              <span className="text-cyan-400">Median (P50): {formatCurrency(monteCarloResult.medianLoss, currency)}</span>
              <span className="text-rose-400">95th Percentile Tail Risk</span>
            </div>
          </div>

          {/* Loss Exceedance Curve (LEC) Table & Plot */}
          <div className="bg-[#0d1424] border border-slate-800 rounded-xl p-5 shadow">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">
                  Loss Exceedance Curve (LEC)
                </h3>
              </div>
              <span className="text-[11px] text-slate-400">Annual Probability of Loss Exceeding Threshold</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {monteCarloResult.lossExceedanceCurve.slice(1, 6).map((lec, idx) => (
                <div key={idx} className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-lg text-center">
                  <div className="text-[11px] text-slate-400 font-mono font-medium">
                    &gt; {formatCurrency(lec.threshold, currency)}
                  </div>
                  <div className={`text-base font-mono font-bold mt-1 ${
                    lec.probability > 40 ? 'text-rose-400' :
                    lec.probability > 15 ? 'text-amber-400' : 'text-emerald-400'
                  }`}>
                    {lec.probability.toFixed(1)}%
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    {lec.probability > 0 ? `1 in ${(100 / Math.max(0.1, lec.probability)).toFixed(0)} yrs` : 'Negligible'}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-slate-900/60 border border-slate-800/80 rounded-lg flex items-start gap-2.5 text-xs text-slate-300">
              <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <strong>Boardroom Cyber Risk Statement:</strong> With current deployed controls, there is a{' '}
                <strong className="text-amber-400">5.0% probability</strong> that annual cyber breach losses will exceed{' '}
                <strong className="text-white font-mono">{formatCurrency(monteCarloResult.var95, currency)}</strong>.
                Investment in target controls (Microsegmentation + EDR) reduces this exposure significantly.
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
