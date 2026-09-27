/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { 
  INITIAL_NETWORK_NODES, 
  INITIAL_NETWORK_EDGES, 
  SECURITY_CONTROLS_CATALOG, 
  ATTACK_SCENARIOS, 
  BASELINE_FAIR_INPUTS, 
  COMPLIANCE_SCORES 
} from './data/enterpriseData';
import { 
  NetworkNode, 
  NetworkEdge, 
  SecurityControl, 
  FairModelInputs, 
  MonteCarloResult,
  AttackScenario 
} from './types/cyberrisk';
import { runFairMonteCarloSimulation } from './utils/fairEngine';

import { Header } from './components/Header';
import { DigitalTwinCanvas } from './components/DigitalTwinCanvas';
import { FairRiskQuantification } from './components/FairRiskQuantification';
import { InvestmentOptimizer } from './components/InvestmentOptimizer';
import { AttackSimulator } from './components/AttackSimulator';
import { AssetMatrix } from './components/AssetMatrix';
import { ComplianceCrosswalk } from './components/ComplianceCrosswalk';
import { ExecutiveReportModal } from './components/ExecutiveReportModal';
import { GitHubRepoSyncModal } from './components/GitHubRepoSyncModal';

export default function App() {
  // Navigation & View State
  const [activeTab, setActiveTab] = useState<string>('topology');
  const [currency, setCurrency] = useState<'USD' | 'INR'>('USD');

  // Enterprise Digital Twin Topology State
  const [nodes, setNodes] = useState<NetworkNode[]>(INITIAL_NETWORK_NODES);
  const [edges, setEdges] = useState<NetworkEdge[]>(INITIAL_NETWORK_EDGES);
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);

  // FAIR Model & Controls State
  const [fairInputs, setFairInputs] = useState<FairModelInputs>(BASELINE_FAIR_INPUTS);
  const [controls, setControls] = useState<SecurityControl[]>(SECURITY_CONTROLS_CATALOG);

  // Attack Simulator State
  const [scenarios] = useState<AttackScenario[]>(ATTACK_SCENARIOS);
  const [activeScenario, setActiveScenario] = useState<AttackScenario | null>(ATTACK_SCENARIOS[0] || null);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlayingAttack, setIsPlayingAttack] = useState<boolean>(false);

  // Modals
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [isGitModalOpen, setIsGitModalOpen] = useState<boolean>(false);

  // Compute Baseline ALE (with 0 controls active)
  const baselineMonteCarlo = useMemo(() => {
    return runFairMonteCarloSimulation(fairInputs, [], 3000);
  }, [fairInputs]);

  // Compute Current Mitigated Monte Carlo Result (with active controls)
  const [monteCarloResult, setMonteCarloResult] = useState<MonteCarloResult>(() => {
    return runFairMonteCarloSimulation(BASELINE_FAIR_INPUTS, SECURITY_CONTROLS_CATALOG, 5000);
  });

  // Re-run Monte Carlo when active controls or fair inputs change
  useEffect(() => {
    const res = runFairMonteCarloSimulation(fairInputs, controls, 5000);
    setMonteCarloResult(res);
  }, [fairInputs, controls]);

  // Handle Node Actions
  const handleIsolateNode = (nodeId: string) => {
    setNodes(prev => prev.map(n => n.id === nodeId ? { ...n, status: 'isolated' } : n));
    if (selectedNode?.id === nodeId) {
      setSelectedNode(prev => prev ? { ...prev, status: 'isolated' } : null);
    }
  };

  const handleRestoreNode = (nodeId: string) => {
    setNodes(prev => prev.map(n => {
      if (n.id === nodeId) {
        return { ...n, status: n.vulnerabilities.length > 0 ? 'vulnerable' : 'healthy' };
      }
      return n;
    }));
    if (selectedNode?.id === nodeId) {
      setSelectedNode(prev => prev ? { ...prev, status: prev.vulnerabilities.length > 0 ? 'vulnerable' : 'healthy' } : null);
    }
  };

  const handlePatchNode = (nodeId: string) => {
    setNodes(prev => prev.map(n => {
      if (n.id === nodeId) {
        return {
          ...n,
          vulnerabilities: [],
          status: 'healthy',
          blastRadiusScore: Math.max(15, n.blastRadiusScore - 40)
        };
      }
      return n;
    }));

    if (selectedNode?.id === nodeId) {
      setSelectedNode(prev => prev ? {
        ...prev,
        vulnerabilities: [],
        status: 'healthy',
        blastRadiusScore: Math.max(15, prev.blastRadiusScore - 40)
      } : null);
    }
  };

  // Toggle Security Control
  const handleToggleControl = (controlId: string) => {
    setControls(prev => prev.map(c => c.id === controlId ? { ...c, isActive: !c.isActive } : c));
  };

  // Apply Optimal Portfolio from Knapsack Solver
  const handleApplyOptimalPortfolio = (selectedControlIds: string[]) => {
    const selectedSet = new Set(selectedControlIds);
    setControls(prev => prev.map(c => ({
      ...c,
      isActive: selectedSet.has(c.id)
    })));
  };

  // Simulate Node Compromise during Attack Run
  const handleSimulateNodeCompromise = (nodeId: string) => {
    setNodes(prev => prev.map(n => n.id === nodeId && n.status !== 'isolated' ? { ...n, status: 'breached' } : n));
  };

  // Reset Simulated Breach Nodes
  const handleResetSimulatedNodes = () => {
    setNodes(INITIAL_NETWORK_NODES);
  };

  // Telemetry counts
  const vulnerableCount = nodes.filter(n => n.vulnerabilities.length > 0).length;
  const compromisedCount = nodes.filter(n => n.status === 'breached').length;

  const activeAttackStep = activeScenario?.attackSteps[currentStepIndex] || null;

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans">
      
      {/* Universal Command Center Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currency={currency}
        setCurrency={setCurrency}
        baselineALE={baselineMonteCarlo.annualizedLossExpectancy}
        mitigatedALE={monteCarloResult.annualizedLossExpectancy}
        var95={monteCarloResult.var95}
        vulnerableCount={vulnerableCount}
        compromisedCount={compromisedCount}
        onOpenReport={() => setIsReportModalOpen(true)}
        onOpenGitModal={() => setIsGitModalOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* View 1: Digital Twin Topology Canvas */}
        {activeTab === 'topology' && (
          <DigitalTwinCanvas
            nodes={nodes}
            edges={edges}
            selectedNode={selectedNode}
            setSelectedNode={setSelectedNode}
            currency={currency}
            activeScenario={isPlayingAttack ? activeScenario : null}
            activeAttackStep={isPlayingAttack ? activeAttackStep : null}
            onIsolateNode={handleIsolateNode}
            onRestoreNode={handleRestoreNode}
            onPatchNode={handlePatchNode}
          />
        )}

        {/* View 2: Quantitative FAIR Risk Engine */}
        {activeTab === 'fair' && (
          <FairRiskQuantification
            fairInputs={fairInputs}
            setFairInputs={setFairInputs}
            monteCarloResult={monteCarloResult}
            setMonteCarloResult={setMonteCarloResult}
            activeControls={controls}
            currency={currency}
          />
        )}

        {/* View 3: Investment Optimizer (ROSI & Pareto Frontier) */}
        {activeTab === 'optimizer' && (
          <InvestmentOptimizer
            controls={controls}
            onToggleControl={handleToggleControl}
            baselineALE={baselineMonteCarlo.annualizedLossExpectancy}
            mitigatedALE={monteCarloResult.annualizedLossExpectancy}
            var95={monteCarloResult.var95}
            currency={currency}
            onApplyOptimalPortfolio={handleApplyOptimalPortfolio}
          />
        )}

        {/* View 4: MITRE ATT&CK Breach Simulation */}
        {activeTab === 'simulator' && (
          <AttackSimulator
            scenarios={scenarios}
            activeScenario={activeScenario}
            setActiveScenario={setActiveScenario}
            currentStepIndex={currentStepIndex}
            setCurrentStepIndex={setCurrentStepIndex}
            isPlaying={isPlayingAttack}
            setIsPlaying={setIsPlayingAttack}
            activeControls={controls}
            currency={currency}
            onSimulateNodeCompromise={handleSimulateNodeCompromise}
            onResetSimulatedNodes={handleResetSimulatedNodes}
          />
        )}

        {/* View 5: Asset & CVE Matrix */}
        {activeTab === 'assets' && (
          <AssetMatrix
            nodes={nodes}
            onSelectNode={(node) => {
              setSelectedNode(node);
              setActiveTab('topology');
            }}
            onIsolateNode={handleIsolateNode}
            onRestoreNode={handleRestoreNode}
            onPatchNode={handlePatchNode}
            currency={currency}
          />
        )}

        {/* View 6: Regulatory Compliance Crosswalk */}
        {activeTab === 'compliance' && (
          <ComplianceCrosswalk
            complianceScores={COMPLIANCE_SCORES}
          />
        )}

      </main>

      {/* CISO Executive Brief Modal */}
      <ExecutiveReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        baselineALE={baselineMonteCarlo.annualizedLossExpectancy}
        mitigatedALE={monteCarloResult.annualizedLossExpectancy}
        var95={monteCarloResult.var95}
        var99={monteCarloResult.var99}
        activeControls={controls}
        nodes={nodes}
        currency={currency}
      />

      {/* GitHub Repository Sync Modal */}
      <GitHubRepoSyncModal
        isOpen={isGitModalOpen}
        onClose={() => setIsGitModalOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#070b12] py-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400">CyberRiskTwin</span>
            <span>·</span>
            <span>Continuous Cyber Risk Quantification & Investment Optimization Platform</span>
          </div>
          <div className="font-mono text-[11px] text-slate-500">
            Smart India Hackathon (SIH 2026) · Problem Statement SIH260105
          </div>
        </div>
      </footer>

    </div>
  );
}
