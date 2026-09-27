import React, { useState } from 'react';
import { NetworkNode, CriticalityLevel, NetworkZone } from '../types/cyberrisk';
import { 
  Search, 
  Filter, 
  ShieldAlert, 
  CheckCircle2, 
  Slash, 
  Zap, 
  ExternalLink,
  ArrowUpDown,
  Layers,
  Database
} from 'lucide-react';
import { formatCurrency } from '../utils/fairEngine';

interface AssetMatrixProps {
  nodes: NetworkNode[];
  onSelectNode: (node: NetworkNode) => void;
  onIsolateNode: (nodeId: string) => void;
  onRestoreNode: (nodeId: string) => void;
  onPatchNode: (nodeId: string) => void;
  currency: 'USD' | 'INR';
}

export const AssetMatrix: React.FC<AssetMatrixProps> = ({
  nodes,
  onSelectNode,
  onIsolateNode,
  onRestoreNode,
  onPatchNode,
  currency
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [zoneFilter, setZoneFilter] = useState<string>('all');
  const [criticalityFilter, setCriticalityFilter] = useState<string>('all');
  const [vulnerableOnly, setVulnerableOnly] = useState(false);

  // Filtered Assets
  const filteredAssets = nodes.filter((node) => {
    const matchesSearch = 
      node.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.ipAddress.includes(searchQuery) ||
      node.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.vulnerabilities.some(v => v.cveId.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesZone = zoneFilter === 'all' || node.zone === zoneFilter;
    const matchesCrit = criticalityFilter === 'all' || node.criticality === criticalityFilter;
    const matchesVuln = !vulnerableOnly || node.vulnerabilities.length > 0;

    return matchesSearch && matchesZone && matchesCrit && matchesVuln;
  });

  return (
    <div className="space-y-5">
      
      {/* Search and Filters Header */}
      <div className="bg-[#0d1424] border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-3 shadow">
        
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search asset name, IP, CVE..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
          />
        </div>

        {/* Filter Dropdowns & Checkboxes */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto text-xs">
          
          {/* Zone filter */}
          <select
            value={zoneFilter}
            onChange={(e) => setZoneFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-300 focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            <option value="all">All Zones</option>
            <option value="perimeter">Edge / Perimeter</option>
            <option value="dmz">DMZ</option>
            <option value="cloud">Cloud AWS</option>
            <option value="internal">Corporate Internal</option>
            <option value="ot_ics">OT / SCADA</option>
            <option value="financial_db">Financial Core</option>
          </select>

          {/* Criticality filter */}
          <select
            value={criticalityFilter}
            onChange={(e) => setCriticalityFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-300 focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            <option value="all">All Criticalities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          {/* Vulnerable Only Checkbox */}
          <label className="flex items-center gap-2 text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={vulnerableOnly}
              onChange={(e) => setVulnerableOnly(e.target.checked)}
              className="rounded border-slate-700 bg-slate-800 text-cyan-500 focus:ring-0 cursor-pointer"
            />
            <span>Vulnerable Only</span>
          </label>

          <span className="text-slate-500 font-mono text-[11px]">
            Showing <strong>{filteredAssets.length}</strong> of {nodes.length} assets
          </span>
        </div>

      </div>

      {/* Assets Table */}
      <div className="bg-[#0d1424] border border-slate-800 rounded-xl overflow-hidden shadow">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 font-mono border-b border-slate-800">
              <tr>
                <th className="py-3 px-4 font-semibold">Asset Name & IP</th>
                <th className="py-3 px-4 font-semibold">Zone</th>
                <th className="py-3 px-4 font-semibold">Criticality</th>
                <th className="py-3 px-4 font-semibold">Value-at-Risk</th>
                <th className="py-3 px-4 font-semibold">CVEs & EPSS</th>
                <th className="py-3 px-4 font-semibold">Blast Index</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredAssets.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    No assets matched your search criteria.
                  </td>
                </tr>
              ) : (
                filteredAssets.map((asset) => {
                  const isIsolated = asset.status === 'isolated';
                  const isBreached = asset.status === 'breached';

                  return (
                    <tr 
                      key={asset.id} 
                      className="hover:bg-slate-800/40 transition cursor-pointer"
                      onClick={() => onSelectNode(asset)}
                    >
                      {/* Name & IP */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-white flex items-center gap-1.5">
                          {asset.label}
                        </div>
                        <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                          {asset.ipAddress} · <span className="text-slate-500">{asset.category}</span>
                        </div>
                      </td>

                      {/* Zone */}
                      <td className="py-3 px-4 font-mono text-slate-300 capitalize">
                        {asset.zone.replace('_', ' ')}
                      </td>

                      {/* Criticality */}
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          asset.criticality === 'CRITICAL' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                          asset.criticality === 'HIGH' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                          'bg-blue-950 text-blue-300 border border-blue-800'
                        }`}>
                          {asset.criticality}
                        </span>
                      </td>

                      {/* Value at Risk */}
                      <td className="py-3 px-4 font-mono font-bold text-cyan-400">
                        {formatCurrency(asset.valueAtRisk, currency)}
                      </td>

                      {/* CVEs */}
                      <td className="py-3 px-4">
                        {asset.vulnerabilities.length === 0 ? (
                          <span className="text-emerald-400 text-[11px] flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Clean
                          </span>
                        ) : (
                          <div className="space-y-1">
                            {asset.vulnerabilities.map(v => (
                              <div key={v.cveId} className="flex items-center gap-1.5">
                                <span className="font-mono text-rose-400 font-semibold">{v.cveId}</span>
                                <span className="text-[10px] px-1 rounded bg-rose-950 text-rose-300 border border-rose-800 font-mono">
                                  CVSS {v.cvss}
                                </span>
                                <span className="text-[10px] text-slate-400 font-mono">
                                  EPSS: {(v.epss * 100).toFixed(0)}%
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </td>

                      {/* Blast Index */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-amber-400 text-xs">
                            {asset.blastRadiusScore}
                          </span>
                          <div className="w-16 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className="bg-amber-500 h-full rounded-full"
                              style={{ width: `${asset.blastRadiusScore}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-mono capitalize ${
                          isBreached ? 'bg-rose-950 text-rose-300 border border-rose-800 font-bold animate-pulse' :
                          isIsolated ? 'bg-purple-950 text-purple-300 border border-purple-800 font-bold' :
                          asset.vulnerabilities.length > 0 ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                          'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        }`}>
                          {asset.status.replace('_', ' ')}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          {isIsolated ? (
                            <button
                              onClick={() => onRestoreNode(asset.id)}
                              className="px-2 py-1 bg-emerald-900/60 hover:bg-emerald-800 text-emerald-300 border border-emerald-700 rounded text-[11px] font-medium transition cursor-pointer"
                            >
                              Restore
                            </button>
                          ) : (
                            <button
                              onClick={() => onIsolateNode(asset.id)}
                              className="px-2 py-1 bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 rounded text-[11px] font-medium transition cursor-pointer"
                            >
                              Quarantine
                            </button>
                          )}

                          {asset.vulnerabilities.length > 0 && (
                            <button
                              onClick={() => onPatchNode(asset.id)}
                              className="px-2 py-1 bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 rounded text-[11px] font-medium transition cursor-pointer"
                              title="Apply security patch"
                            >
                              Patch
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
