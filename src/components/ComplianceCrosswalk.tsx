import React from 'react';
import { ComplianceFrameworkScore } from '../types/cyberrisk';
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  FileCheck, 
  Award,
  ExternalLink
} from 'lucide-react';

interface ComplianceCrosswalkProps {
  complianceScores: ComplianceFrameworkScore[];
}

export const ComplianceCrosswalk: React.FC<ComplianceCrosswalkProps> = ({
  complianceScores
}) => {
  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-blue-950 text-blue-300 border border-blue-800">
              Regulatory Compliance Crosswalk
            </span>
            <span className="text-slate-400 text-xs">
              Automated Audit Readiness · NIST CSF 2.0 · ISO 27001 · CIS v8
            </span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            Governance & Regulatory Assurance Matrix
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 max-w-2xl">
            Correlates continuous technical security control telemetry directly to global compliance frameworks
            and Indian regulatory guidelines (CERT-In Mandates & Digital Personal Data Protection Act 2023).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-emerald-950/80 border border-emerald-800 p-3 rounded-xl flex items-center gap-3">
            <Award className="w-8 h-8 text-emerald-400 shrink-0" />
            <div>
              <div className="text-[10px] text-emerald-300 uppercase font-mono tracking-wider font-semibold">
                Average Audit Readiness
              </div>
              <div className="text-xl font-bold font-mono text-white">
                68.2% Ready
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Framework Scores Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {complianceScores.map((framework) => (
          <div key={framework.framework} className="bg-[#0d1424] border border-slate-800 rounded-xl p-5 shadow space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white leading-tight">
                {framework.framework}
              </h3>
              <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${
                framework.overallScore >= 70 ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                'bg-amber-950 text-amber-300 border border-amber-800'
              }`}>
                {framework.overallScore}%
              </span>
            </div>

            {/* Category Progress Bars */}
            <div className="space-y-3">
              {framework.categories.map((cat) => (
                <div key={cat.name} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-300">{cat.name}</span>
                    <span className="font-mono text-slate-400 text-[11px]">
                      {cat.controlsImplemented}/{cat.controlsTotal} ({cat.score}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        cat.score >= 75 ? 'bg-emerald-500' :
                        cat.score >= 60 ? 'bg-cyan-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${cat.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

          </div>
        ))}
      </div>

      {/* National Regulatory Guidelines Crosswalk Card (DPDPA & CERT-In) */}
      <div className="bg-[#0d1424] border border-slate-800 rounded-xl p-5 shadow space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <FileCheck className="w-5 h-5 text-cyan-400" />
          <h3 className="text-sm font-bold text-white">
            Smart India Hackathon (SIH 2026) Regulatory Mandates Alignment
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          
          <div className="bg-slate-900/80 p-3.5 rounded-lg border border-slate-800 space-y-1.5">
            <span className="text-[10px] uppercase font-mono text-cyan-400 font-bold">CERT-In Directives</span>
            <h4 className="font-bold text-white text-xs">6-Hour Breach Reporting</h4>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Automated audit trail generation immediately logs forensic timelines required for CERT-In incident notification.
            </p>
            <div className="text-emerald-400 font-mono text-[10px] flex items-center gap-1 pt-1">
              <CheckCircle2 className="w-3 h-3" /> Fully Compliant
            </div>
          </div>

          <div className="bg-slate-900/80 p-3.5 rounded-lg border border-slate-800 space-y-1.5">
            <span className="text-[10px] uppercase font-mono text-cyan-400 font-bold">DPDPA 2023</span>
            <h4 className="font-bold text-white text-xs">Digital Personal Data Protection</h4>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              PII risk quantification flags unencrypted S3 datalakes and enforces fines mitigation up to ₹250 Crore cap.
            </p>
            <div className="text-emerald-400 font-mono text-[10px] flex items-center gap-1 pt-1">
              <CheckCircle2 className="w-3 h-3" /> Audited
            </div>
          </div>

          <div className="bg-slate-900/80 p-3.5 rounded-lg border border-slate-800 space-y-1.5">
            <span className="text-[10px] uppercase font-mono text-cyan-400 font-bold">RBI Cyber Framework</span>
            <h4 className="font-bold text-white text-xs">Continuous SOC Telemetry</h4>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Real-time FAIR modeling translates cyber telemetry into Board-level Operational Risk Capital allocation.
            </p>
            <div className="text-cyan-400 font-mono text-[10px] flex items-center gap-1 pt-1">
              <CheckCircle2 className="w-3 h-3" /> Operational
            </div>
          </div>

          <div className="bg-slate-900/80 p-3.5 rounded-lg border border-slate-800 space-y-1.5">
            <span className="text-[10px] uppercase font-mono text-cyan-400 font-bold">NCIIPC Guideline</span>
            <h4 className="font-bold text-white text-xs">Critical Information Infra (CII)</h4>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Air-gap microsegmentation models protect Purdue Level 3/4 OT SCADA assets against hostile state-sponsored sabotage.
            </p>
            <div className="text-emerald-400 font-mono text-[10px] flex items-center gap-1 pt-1">
              <CheckCircle2 className="w-3 h-3" /> Protected
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
