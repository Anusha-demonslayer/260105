import React, { useState } from 'react';
import { 
  NetworkNode, 
  NetworkEdge, 
  NetworkZone, 
  AttackScenario, 
  AttackStep 
} from '../types/cyberrisk';
import { 
  Shield, 
  ShieldAlert, 
  Server, 
  Database, 
  Radio, 
  Lock, 
  Flame, 
  Eye, 
  Slash, 
  AlertTriangle, 
  CheckCircle2, 
  ExternalLink,
  Zap,
  Info
} from 'lucide-react';
import { formatCurrency } from '../utils/fairEngine';

interface DigitalTwinCanvasProps {
  nodes: NetworkNode[];
  edges: NetworkEdge[];
  selectedNode: NetworkNode | null;
  setSelectedNode: (node: NetworkNode | null) => void;
  currency: 'USD' | 'INR';
  activeScenario?: AttackScenario | null;
  activeAttackStep?: AttackStep | null;
  onIsolateNode: (nodeId: string) => void;
  onRestoreNode: (nodeId: string) => void;
  onPatchNode: (nodeId: string) => void;
}

export const DigitalTwinCanvas: React.FC<DigitalTwinCanvasProps> = ({
  nodes,
  edges,
  selectedNode,
  setSelectedNode,
  currency,
  activeScenario,
  activeAttackStep,
  onIsolateNode,
  onRestoreNode,
  onPatchNode
}) => {
  const [activeZoneFilter, setActiveZoneFilter] = useState<string>('all');
  const [showBlastRadius, setShowBlastRadius] = useState<boolean>(true);

  // Compute blast radius affected nodes for the selected node
  const blastRadiusAffectedNodeIds = React.useMemo(() => {
    if (!selectedNode || !showBlastRadius) return new Set<string>();
    const affected = new Set<string>();
    affected.add(selectedNode.id);

    // 1-hop and 2-hop connected nodes
    edges.forEach(e => {
      if (e.source === selectedNode.id) affected.add(e.target);
      if (e.target === selectedNode.id) affected.add(e.source);
    });

    return affected;
  }, [selectedNode, showBlastRadius, edges]);

  // Zone metadata
  const zones: { id: NetworkZone | 'all'; label: string; x: number; width: number; color: string }[] = [
    { id: 'perimeter', label: '1. Edge & Perimeter', x: 40, width: 180, color: 'border-blue-500/30 bg-blue-950/10' },
    { id: 'dmz', label: '2. DMZ & Auth Proxy', x: 240, width: 180, color: 'border-cyan-500/30 bg-cyan-950/10' },
    { id: 'cloud', label: '3. Cloud AWS / EKS', x: 440, width: 220, color: 'border-sky-500/30 bg-sky-950/10' },
    { id: 'internal', label: '4. Corporate Internal', x: 680, width: 180, color: 'border-amber-500/30 bg-amber-950/10' },
    { id: 'ot_ics', label: '5. OT / ICS SCADA', x: 880, width: 180, color: 'border-orange-500/30 bg-orange-950/10' },
    { id: 'financial_db', label: '6. Financial Core Vault', x: 1080, width: 200, color: 'border-emerald-500/30 bg-emerald-950/10' }
  ];

  const filteredNodes = activeZoneFilter === 'all' 
    ? nodes 
    : nodes.filter(n => n.zone === activeZoneFilter);

  // Node Category Icon Helper
  const getNodeIcon = (node: NetworkNode) => {
    switch (node.category) {
      case 'database':
        return <Database className="w-4 h-4" />;
      case 'gateway':
        return <Shield className="w-4 h-4" />;
      case 'cloud_service':
        return <Radio className="w-4 h-4" />;
      case 'scada_plc':
        return <Zap className="w-4 h-4 text-orange-400" />;
      case 'identity_provider':
        return <Lock className="w-4 h-4 text-amber-400" />;
      default:
        return <Server className="w-4 h-4" />;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-140px)] min-h-[640px]">
      
      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col bg-[#0b1120] border border-slate-800 rounded-xl overflow-hidden shadow-2xl relative">
        
        {/* Canvas Toolbar */}
        <div className="p-3 bg-slate-900/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs z-10">
          
          {/* Zone Selector */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            <span className="text-slate-400 px-2 font-medium">Zone View:</span>
            {['all', 'perimeter', 'dmz', 'cloud', 'internal', 'ot_ics', 'financial_db'].map((z) => (
              <button
                key={z}
                onClick={() => setActiveZoneFilter(z)}
                className={`px-2.5 py-1 rounded text-xs capitalize transition cursor-pointer ${
                  activeZoneFilter === z 
                    ? 'bg-cyan-500 text-slate-950 font-semibold shadow' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {z === 'all' ? 'Entire Twin' : z.replace('_', ' ')}
              </button>
            ))}
          </div>

          {/* Toggles & Legend */}
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer select-none text-slate-300">
              <input
                type="checkbox"
                checked={showBlastRadius}
                onChange={(e) => setShowBlastRadius(e.target.checked)}
                className="rounded border-slate-700 bg-slate-800 text-cyan-500 focus:ring-0 cursor-pointer"
              />
              <span>Blast Radius Highlighting</span>
            </label>

            {/* Quick Status Legend */}
            <div className="hidden sm:flex items-center gap-3 text-[11px] text-slate-400 border-l border-slate-700 pl-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
                <span>Normal</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                <span>Vulnerable</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
                <span>Breached</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                <span>Quarantined</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Attack Scenario Alert Banner if Active */}
        {activeScenario && (
          <div className="bg-rose-950/70 border-b border-rose-800/80 px-4 py-2 flex items-center justify-between text-xs text-rose-200 z-10">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-rose-400 animate-bounce" />
              <span>
                <strong>SIMULATION ACTIVE:</strong> {activeScenario.title} · Threat Actor: <strong>{activeScenario.threatActor}</strong>
              </span>
            </div>
            {activeAttackStep && (
              <span className="font-mono text-rose-300 bg-rose-900/60 px-2 py-0.5 rounded border border-rose-700">
                Step {activeAttackStep.stepNumber}: {activeAttackStep.techniqueName} ({activeAttackStep.techniqueId})
              </span>
            )}
          </div>
        )}

        {/* Interactive SVG Network Graph */}
        <div className="flex-1 cyber-grid relative overflow-auto p-4 select-none">
          <svg className="w-[1320px] h-[520px] min-w-full" viewBox="0 0 1320 520">
            <defs>
              {/* Arrow Marker for Edges */}
              <marker id="arrow" viewBox="0 0 10 10" refX="28" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#475569" />
              </marker>
              <marker id="arrow-attack" viewBox="0 0 10 10" refX="28" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#f43f5e" />
              </marker>
              {/* Gradients */}
              <radialGradient id="blast-grad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.0" />
              </radialGradient>
            </defs>

            {/* Zone Backdrops */}
            {zones.map((z) => (
              <g key={z.id}>
                <rect
                  x={z.x}
                  y={30}
                  width={z.width}
                  height={460}
                  rx={10}
                  className={`fill-slate-900/40 stroke-slate-800 stroke-1 ${activeZoneFilter === z.id ? 'stroke-cyan-500 stroke-2 fill-cyan-950/20' : ''}`}
                />
                <text
                  x={z.x + 12}
                  y={54}
                  fill="#94a3b8"
                  fontSize="11"
                  fontWeight="600"
                  fontFamily="JetBrains Mono, monospace"
                  className="tracking-wider uppercase"
                >
                  {z.label}
                </text>
              </g>
            ))}

            {/* Render Network Edges */}
            {edges.map((edge) => {
              const srcNode = nodes.find(n => n.id === edge.source);
              const tgtNode = nodes.find(n => n.id === edge.target);
              if (!srcNode || !tgtNode) return null;

              // Check if edge is part of the active attack step
              const isAttackEdge = activeAttackStep && 
                ((activeAttackStep.sourceNodeId === edge.source && activeAttackStep.targetNodeId === edge.target) ||
                 (activeAttackStep.sourceNodeId === edge.target && activeAttackStep.targetNodeId === edge.source));

              // Check if either node is isolated
              const isIsolated = srcNode.status === 'isolated' || tgtNode.status === 'isolated';

              return (
                <g key={edge.id}>
                  <line
                    x1={srcNode.x}
                    y1={srcNode.y}
                    x2={tgtNode.x}
                    y2={tgtNode.y}
                    stroke={isIsolated ? '#475569' : isAttackEdge ? '#f43f5e' : '#334155'}
                    strokeWidth={isAttackEdge ? 3.5 : 1.5}
                    strokeDasharray={isIsolated ? '4,4' : isAttackEdge ? '6,4' : 'none'}
                    markerEnd={isAttackEdge ? 'url(#arrow-attack)' : 'url(#arrow)'}
                    className={isAttackEdge ? 'animate-pulse' : ''}
                  />
                  {/* Protocol label on edge */}
                  <text
                    x={(srcNode.x + tgtNode.x) / 2}
                    y={(srcNode.y + tgtNode.y) / 2 - 6}
                    fill={isAttackEdge ? '#fda4af' : '#64748b'}
                    fontSize="9"
                    fontFamily="monospace"
                    textAnchor="middle"
                    className="select-none pointer-events-none"
                  >
                    {isIsolated ? '[SEVERED]' : `${edge.protocol}:${edge.port}`}
                  </text>
                </g>
              );
            })}

            {/* Render Blast Radius Glows */}
            {selectedNode && showBlastRadius && (
              <circle
                cx={selectedNode.x}
                cy={selectedNode.y}
                r={selectedNode.blastRadiusScore * 1.8}
                fill="url(#blast-grad)"
                className="animate-pulse pointer-events-none"
              />
            )}

            {/* Render Network Nodes */}
            {filteredNodes.map((node) => {
              const isSelected = selectedNode?.id === node.id;
              const isPartOfBlast = blastRadiusAffectedNodeIds.has(node.id);
              const isBreached = node.status === 'breached';
              const isVulnerable = node.status === 'vulnerable';
              const isIsolated = node.status === 'isolated';

              let borderColor = '#06b6d4'; // cyan normal
              let fillColor = '#0f172a';
              if (isBreached) {
                borderColor = '#f43f5e';
                fillColor = '#4c0519';
              } else if (isIsolated) {
                borderColor = '#a855f7';
                fillColor = '#2e1065';
              } else if (isVulnerable) {
                borderColor = '#f59e0b';
                fillColor = '#451a03';
              }

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  onClick={() => setSelectedNode(node)}
                  className="cursor-pointer transition-transform hover:scale-110 group"
                >
                  {/* Outer selection ring */}
                  {isSelected && (
                    <circle
                      r="28"
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="2.5"
                      strokeDasharray="4,3"
                      className="animate-spin origin-center"
                    />
                  )}

                  {/* Blast radius ring indicator */}
                  {isPartOfBlast && !isSelected && (
                    <circle
                      r="25"
                      fill="none"
                      stroke="#f43f5e"
                      strokeWidth="1.5"
                      strokeDasharray="2,2"
                      opacity="0.8"
                    />
                  )}

                  {/* Main Node Body */}
                  <circle
                    r="20"
                    fill={fillColor}
                    stroke={borderColor}
                    strokeWidth={isSelected ? 3 : 2}
                    className="filter drop-shadow-md"
                  />

                  {/* Node Icon container */}
                  <foreignObject x="-10" y="-10" width="20" height="20" className="pointer-events-none">
                    <div className="w-full h-full flex items-center justify-center text-slate-200">
                      {getNodeIcon(node)}
                    </div>
                  </foreignObject>

                  {/* Vulnerability Alert Pip */}
                  {node.vulnerabilities.length > 0 && (
                    <circle
                      cx="14"
                      cy="-14"
                      r="5"
                      fill="#ef4444"
                      stroke="#0f172a"
                      strokeWidth="1.5"
                    />
                  )}

                  {/* Node Label Text */}
                  <text
                    y="32"
                    fill={isSelected ? '#38bdf8' : '#e2e8f0'}
                    fontSize="10"
                    fontWeight="600"
                    textAnchor="middle"
                    className="select-none font-sans"
                  >
                    {node.label.length > 22 ? node.label.substring(0, 20) + '...' : node.label}
                  </text>

                  {/* Node IP Text */}
                  <text
                    y="44"
                    fill="#64748b"
                    fontSize="8.5"
                    fontFamily="monospace"
                    textAnchor="middle"
                    className="select-none"
                  >
                    {node.ipAddress}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Bottom Legend & Status */}
        <div className="p-2.5 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-cyan-400" />
            <span>Click any asset to inspect vulnerabilities, blast radius & trigger containment.</span>
          </div>
          <div className="font-mono text-[11px] text-slate-400">
            Total Digital Assets: <strong>{nodes.length}</strong> · Active Connections: <strong>{edges.length}</strong>
          </div>
        </div>
      </div>

      {/* Right-Hand Asset Inspector Drawer */}
      <div className="w-full lg:w-96 bg-[#0d1424] border border-slate-800 rounded-xl flex flex-col overflow-hidden shadow-2xl">
        {selectedNode ? (
          <div className="flex-1 flex flex-col overflow-y-auto p-4 space-y-4">
            {/* Asset Header */}
            <div className="border-b border-slate-800 pb-3">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-mono tracking-wider text-cyan-400">
                  Asset Telemetry
                </span>
                <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
                  selectedNode.criticality === 'CRITICAL' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                  selectedNode.criticality === 'HIGH' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                  'bg-blue-950 text-blue-300 border border-blue-800'
                }`}>
                  {selectedNode.criticality}
                </span>
              </div>
              <h3 className="text-base font-bold text-white mt-1">
                {selectedNode.label}
              </h3>
              <div className="text-xs text-slate-400 font-mono mt-0.5">
                {selectedNode.ipAddress} · Zone: <span className="capitalize text-slate-300">{selectedNode.zone.replace('_', ' ')}</span>
              </div>
            </div>

            {/* Financial Value at Risk Card */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Asset Asset Value at Risk (VaR):</span>
                <span className="font-mono font-bold text-rose-400 text-sm">
                  {formatCurrency(selectedNode.valueAtRisk, currency)}
                </span>
              </div>
              <div className="mt-2 flex justify-between items-center text-xs">
                <span className="text-slate-400">Blast Radius Index:</span>
                <span className="font-mono font-bold text-amber-400">
                  {selectedNode.blastRadiusScore} / 100
                </span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-amber-500 to-rose-500 h-full rounded-full"
                  style={{ width: `${selectedNode.blastRadiusScore}%` }}
                />
              </div>
            </div>

            {/* Containment / Action Buttons */}
            <div className="flex gap-2">
              {selectedNode.status === 'isolated' ? (
                <button
                  onClick={() => onRestoreNode(selectedNode.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs transition cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Restore to Network
                </button>
              ) : (
                <button
                  onClick={() => onIsolateNode(selectedNode.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-rose-600/90 hover:bg-rose-500 text-white font-bold text-xs transition cursor-pointer shadow-lg shadow-rose-900/40"
                >
                  <Slash className="w-3.5 h-3.5" />
                  Isolate Node (Quarantine)
                </button>
              )}

              {selectedNode.vulnerabilities.length > 0 && (
                <button
                  onClick={() => onPatchNode(selectedNode.id)}
                  className="flex items-center justify-center gap-1 py-2 px-3 rounded-lg bg-cyan-900/60 hover:bg-cyan-800 text-cyan-200 border border-cyan-700 text-xs font-medium transition cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5 text-cyan-400" />
                  Apply Patch
                </button>
              )}
            </div>

            {/* Detected Vulnerabilities Section */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-2">
                <span>Associated CVEs ({selectedNode.vulnerabilities.length})</span>
                {selectedNode.vulnerabilities.length > 0 && (
                  <span className="text-[11px] text-rose-400">Action Required</span>
                )}
              </div>

              {selectedNode.vulnerabilities.length === 0 ? (
                <div className="p-3 bg-emerald-950/20 border border-emerald-900/40 rounded-lg text-xs text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>No unpatched CVEs found on this node. Controls active.</span>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {selectedNode.vulnerabilities.map((vuln) => (
                    <div 
                      key={vuln.cveId} 
                      className="p-3 bg-slate-900/80 border border-slate-800 rounded-lg space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-rose-400 text-xs">{vuln.cveId}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-slate-400">EPSS: {(vuln.epss * 100).toFixed(0)}%</span>
                          <span className="font-mono text-xs px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
                            CVSS {vuln.cvss}
                          </span>
                        </div>
                      </div>
                      <h4 className="text-xs font-semibold text-slate-200 leading-snug">{vuln.title}</h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed">{vuln.description}</p>
                      <div className="pt-1 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                        <span>Est. Remediation: ${vuln.remediationCost.toLocaleString()}</span>
                        <span>{vuln.patchAvailable ? 'Vendor Patch Ready' : 'Zero-Day / Mitigation Only'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Applied Controls & Owner */}
            <div className="border-t border-slate-800 pt-3 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Custodian / Owner:</span>
                <span className="text-slate-200 font-medium">{selectedNode.owner}</span>
              </div>
              <div>
                <span className="text-slate-400">Active Protective Controls:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedNode.controlsApplied.length === 0 ? (
                    <span className="text-amber-400 text-[11px]">No dedicated control assigned</span>
                  ) : (
                    selectedNode.controlsApplied.map(c => (
                      <span key={c} className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300 font-mono">
                        {c}
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>

          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-500">
            <Server className="w-12 h-12 text-slate-700 mb-3" />
            <h4 className="text-sm font-semibold text-slate-400">No Asset Selected</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-[220px]">
              Select any asset on the Digital Twin topology canvas to inspect vulnerabilities, blast radius & containment options.
            </p>
          </div>
        )}
      </div>

    </div>
  );
};
