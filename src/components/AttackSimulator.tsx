import React, { useState, useEffect } from 'react';
import { AttackScenario, AttackStep, SecurityControl } from '../types/cyberrisk';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  FastForward, 
  ShieldAlert, 
  Flame, 
  CheckCircle2, 
  AlertOctagon, 
  ShieldCheck, 
  DollarSign, 
  ArrowRight,
  Crosshair,
  Lock,
  Layers
} from 'lucide-react';
import { formatCurrency } from '../utils/fairEngine';

interface AttackSimulatorProps {
  scenarios: AttackScenario[];
  activeScenario: AttackScenario | null;
  setActiveScenario: (scenario: AttackScenario | null) => void;
  currentStepIndex: number;
  setCurrentStepIndex: React.Dispatch<React.SetStateAction<number>>;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  activeControls: SecurityControl[];
  currency: 'USD' | 'INR';
  onSimulateNodeCompromise: (nodeId: string) => void;
  onResetSimulatedNodes: () => void;
}

export const AttackSimulator: React.FC<AttackSimulatorProps> = ({
  scenarios,
  activeScenario,
  setActiveScenario,
  currentStepIndex,
  setCurrentStepIndex,
  isPlaying,
  setIsPlaying,
  activeControls,
  currency,
  onSimulateNodeCompromise,
  onResetSimulatedNodes
}) => {
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(2000); // 2000ms per step

  // Select initial scenario if none selected
  useEffect(() => {
    if (!activeScenario && scenarios.length > 0) {
      setActiveScenario(scenarios[0]);
    }
  }, [activeScenario, scenarios, setActiveScenario]);

  // Step runner timer when isPlaying is true
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && activeScenario) {
      timer = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev < activeScenario.attackSteps.length - 1) {
            const nextIdx = prev + 1;
            // Compromise the target node of this step
            const step = activeScenario.attackSteps[nextIdx];
            if (step) {
              onSimulateNodeCompromise(step.targetNodeId);
            }
            return nextIdx;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, playbackSpeed);
    }
    return () => clearInterval(timer);
  }, [isPlaying, activeScenario, playbackSpeed, setCurrentStepIndex, setIsPlaying, onSimulateNodeCompromise]);

  const handleSelectScenario = (sc: AttackScenario) => {
    setIsPlaying(false);
    onResetSimulatedNodes();
    setActiveScenario(sc);
    setCurrentStepIndex(0);
    if (sc.attackSteps[0]) {
      onSimulateNodeCompromise(sc.attackSteps[0].targetNodeId);
    }
  };

  const handlePlayToggle = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      if (activeScenario && currentStepIndex >= activeScenario.attackSteps.length - 1) {
        // Reset if reached end
        setCurrentStepIndex(0);
        onResetSimulatedNodes();
        if (activeScenario.attackSteps[0]) {
          onSimulateNodeCompromise(activeScenario.attackSteps[0].targetNodeId);
        }
      }
      setIsPlaying(true);
    }
  };

  const handleStepForward = () => {
    if (activeScenario && currentStepIndex < activeScenario.attackSteps.length - 1) {
      const nextIdx = currentStepIndex + 1;
      setCurrentStepIndex(nextIdx);
      const step = activeScenario.attackSteps[nextIdx];
      if (step) {
        onSimulateNodeCompromise(step.targetNodeId);
      }
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
    onResetSimulatedNodes();
    if (activeScenario && activeScenario.attackSteps[0]) {
      onSimulateNodeCompromise(activeScenario.attackSteps[0].targetNodeId);
    }
  };

  if (!activeScenario) return null;

  // Active step info
  const activeStep = activeScenario.attackSteps[currentStepIndex];

  // Calculate cumulative loss up to current step
  const cumulativeFinancialLoss = activeScenario.attackSteps
    .slice(0, currentStepIndex + 1)
    .reduce((acc, s) => acc + s.financialImpactStep, 0);

  // Check if current step is blocked by any active security controls
  const blockingControls = activeStep.mitigatedBy.filter(cId => 
    activeControls.some(ctrl => ctrl.id === cId && ctrl.isActive)
  );
  const isStepBlocked = blockingControls.length > 0;

  return (
    <div className="space-y-6">
      
      {/* Top Banner: MITRE ATT&CK Simulation Engine */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-rose-950 text-rose-300 border border-rose-800">
              MITRE ATT&CK v14
            </span>
            <span className="text-slate-400 text-xs">
              Adversary Breach Path & Blast Radius Simulation Engine
            </span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            Breach Simulation & Containment Sandbox
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 max-w-2xl">
            Simulates realistic threat actor intrusion kill-chains across the digital twin.
            Tests whether deployed controls effectively sever the attack path before crown-jewel assets are compromised.
          </p>
        </div>

        {/* Player Controls Bar */}
        <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800">
          <button
            onClick={handlePlayToggle}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs transition cursor-pointer ${
              isPlaying
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/20'
            }`}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{isPlaying ? 'Pause Simulation' : 'Run Attack'}</span>
          </button>

          <button
            onClick={handleStepForward}
            disabled={isPlaying || currentStepIndex >= activeScenario.attackSteps.length - 1}
            className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 disabled:opacity-40 transition cursor-pointer"
            title="Step Next"
          >
            <FastForward className="w-4 h-4" />
          </button>

          <button
            onClick={handleReset}
            className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition cursor-pointer"
            title="Reset Simulation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Speed Selector */}
          <div className="border-l border-slate-800 pl-2 flex items-center gap-1 text-[11px] font-mono">
            {[
              { label: '1x', ms: 2500 },
              { label: '2x', ms: 1500 },
              { label: '4x', ms: 750 }
            ].map((spd) => (
              <button
                key={spd.label}
                onClick={() => setPlaybackSpeed(spd.ms)}
                className={`px-1.5 py-0.5 rounded transition cursor-pointer ${
                  playbackSpeed === spd.ms ? 'bg-cyan-900 text-cyan-300 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {spd.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Scenario Selector Ribbon */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {scenarios.map((sc) => {
          const isSelected = activeScenario.id === sc.id;
          return (
            <div
              key={sc.id}
              onClick={() => handleSelectScenario(sc)}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-slate-900 border-rose-500/80 shadow-[0_0_15px_rgba(244,63,94,0.15)]'
                  : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-slate-400">{sc.primaryZone.toUpperCase()}</span>
                <span className="font-mono font-bold text-rose-400">
                  Est. Impact: {formatCurrency(sc.estimatedTotalLoss, currency)}
                </span>
              </div>
              <h3 className="text-sm font-bold text-white mt-1.5 leading-snug">
                {sc.title}
              </h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                {sc.description}
              </p>
              <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-800/80 pt-2 font-mono">
                <span>Actor: {sc.threatActor}</span>
                <span>{sc.attackSteps.length} Kill-Chain Steps</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Real-time Ticker Metrics for Current Run */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="bg-[#0d1424] border border-slate-800 rounded-xl p-4 shadow">
          <div className="text-xs text-slate-400 font-medium">Real-Time Financial Damage Incurred</div>
          <div className="text-2xl font-bold font-mono text-rose-400 mt-1 animate-pulse">
            {formatCurrency(cumulativeFinancialLoss, currency)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Progressive incident triage, downtime & exfiltration costs
          </div>
        </div>

        <div className="bg-[#0d1424] border border-slate-800 rounded-xl p-4 shadow">
          <div className="text-xs text-slate-400 font-medium">Kill-Chain Progression</div>
          <div className="text-2xl font-bold font-mono text-cyan-400 mt-1">
            Step {currentStepIndex + 1} of {activeScenario.attackSteps.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {Math.round(((currentStepIndex + 1) / activeScenario.attackSteps.length) * 100)}% through adversary campaign
          </div>
        </div>

        <div className="bg-[#0d1424] border border-slate-800 rounded-xl p-4 shadow">
          <div className="text-xs text-slate-400 font-medium">Active Defense Intervention</div>
          <div className={`text-lg font-bold font-mono mt-1.5 flex items-center gap-2 ${
            isStepBlocked ? 'text-emerald-400' : 'text-amber-400'
          }`}>
            {isStepBlocked ? (
              <>
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>ATTACK SEVERED & BLOCKED</span>
              </>
            ) : (
              <>
                <AlertOctagon className="w-5 h-5 text-amber-400 shrink-0" />
                <span>EXPLOIT SUCCEEDING</span>
              </>
            )}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {isStepBlocked 
              ? `Intercepted by: ${blockingControls.join(', ')}`
              : 'Deploy recommended controls in Optimizer to block'}
          </div>
        </div>

      </div>

      {/* Kill Chain Step Stepper Progression Bar */}
      <div className="bg-[#0d1424] border border-slate-800 rounded-xl p-5 shadow space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span>ATT&CK Kill-Chain Phase Progression</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {activeScenario.attackSteps.map((step, idx) => {
            const isCompleted = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            const isPending = idx > currentStepIndex;

            return (
              <div
                key={step.stepNumber}
                onClick={() => {
                  setIsPlaying(false);
                  setCurrentStepIndex(idx);
                  onSimulateNodeCompromise(step.targetNodeId);
                }}
                className={`p-3 rounded-lg border text-xs transition cursor-pointer ${
                  isCurrent
                    ? 'bg-rose-950/60 border-rose-500 text-white shadow-lg shadow-rose-950/40 ring-1 ring-rose-500'
                    : isCompleted
                    ? 'bg-slate-900 border-slate-700 text-slate-300'
                    : 'bg-slate-950/40 border-slate-800 text-slate-500'
                }`}
              >
                <div className="flex items-center justify-between font-mono text-[11px] mb-1">
                  <span className={isCurrent ? 'text-rose-400 font-bold' : ''}>
                    Phase 0{step.stepNumber}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                    {step.techniqueId}
                  </span>
                </div>
                <div className="font-semibold truncate">{step.name}</div>
                <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1 font-mono">
                  <span>{step.sourceNodeId}</span>
                  <ArrowRight className="w-2.5 h-2.5" />
                  <span className="text-rose-300">{step.targetNodeId}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Phase Deep Dive Card */}
      <div className="bg-gradient-to-br from-slate-900 via-[#0d1424] to-slate-950 border border-slate-800 rounded-xl p-5 shadow space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Crosshair className="w-4 h-4 text-rose-400" />
            <h3 className="text-sm font-bold text-white">
              Active Phase Telemetry: Step {activeStep.stepNumber} · {activeStep.techniqueName}
            </h3>
          </div>
          <span className="text-xs font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
            MITRE {activeStep.techniqueId}
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          {activeStep.narrative}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono pt-1">
          <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
            <span className="text-slate-500 block text-[10px]">Exploit Probability:</span>
            <span className="text-amber-400 font-bold">{(activeStep.exploitLikelihood * 100).toFixed(0)}%</span>
          </div>

          <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
            <span className="text-slate-500 block text-[10px]">Detection Likelihood:</span>
            <span className="text-cyan-400 font-bold">{(activeStep.detectionChance * 100).toFixed(0)}%</span>
          </div>

          <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
            <span className="text-slate-500 block text-[10px]">Target Asset ID:</span>
            <span className="text-rose-400 font-bold">{activeStep.targetNodeId}</span>
          </div>
        </div>

        {/* Remediation / Countermeasure Mapping */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-medium">Countermeasures capable of neutralizing this step:</span>
            <span className="text-[11px] font-mono text-cyan-400">
              {activeStep.mitigatedBy.length} Control(s)
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {activeStep.mitigatedBy.map((ctrlId) => {
              const controlObj = activeControls.find(c => c.id === ctrlId);
              const isActive = controlObj?.isActive;

              return (
                <span
                  key={ctrlId}
                  className={`px-2.5 py-1 rounded text-xs font-mono font-medium flex items-center gap-1.5 border ${
                    isActive
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  {isActive ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <Lock className="w-3 h-3" />}
                  <span>{controlObj?.name || ctrlId}</span>
                  <span className="text-[10px] text-slate-500">
                    {isActive ? '(ACTIVE)' : '(DISABLED)'}
                  </span>
                </span>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
};
