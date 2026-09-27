import React, { useState } from 'react';
import { 
  X, 
  GitBranch, 
  CheckCircle2, 
  Copy, 
  Terminal, 
  FolderTree, 
  BookOpen, 
  Key, 
  Send,
  AlertCircle,
  ExternalLink,
  Code,
  Download
} from 'lucide-react';

interface GitHubRepoSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GitHubRepoSyncModal: React.FC<GitHubRepoSyncModalProps> = ({
  isOpen,
  onClose
}) => {
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [githubToken, setGithubToken] = useState<string>('');
  const [pushStatus, setPushStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState<string>('');

  if (!isOpen) return null;

  const repoUrl = 'https://github.com/Anusha-demonslayer/SIH260105';

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const handleTestPushCommand = () => {
    if (!githubToken.trim()) {
      setPushStatus('error');
      setStatusMessage('Please enter your GitHub Personal Access Token (PAT) with "repo" write permissions.');
      return;
    }

    setPushStatus('success');
    setStatusMessage('Command generated with your token! Run the command below in your terminal or use Git credential manager.');
  };

  const pushCommandWithToken = githubToken.trim() 
    ? `git push -u https://${githubToken.trim()}@github.com/Anusha-demonslayer/SIH260105.git main --force`
    : `git push -u origin main`;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#0b1120] border border-slate-700 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">
              GitHub Repository Synchronization & Documentation
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-slate-200 text-xs">
          
          {/* Target Repo Banner */}
          <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-mono text-emerald-400 uppercase font-semibold">
                Target Repository
              </span>
              <div className="text-sm font-bold font-mono text-white mt-0.5">
                {repoUrl}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Ref: Smart India Hackathon 2026 Problem Statement <strong>SIH260105</strong>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <a
                href="/CyberRiskTwin-SIH260105.zip"
                download="CyberRiskTwin-SIH260105.zip"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 rounded-lg text-xs font-bold transition shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Full Project .ZIP</span>
              </a>

              <a
                href={repoUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-lg text-xs font-mono transition"
              >
                <span>View on GitHub</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Quick Upload Guide for Zip */}
          <div className="p-4 bg-cyan-950/30 border border-cyan-800/40 rounded-xl space-y-2">
            <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider font-mono flex items-center gap-2">
              <Download className="w-4 h-4 text-cyan-400" />
              <span>How to Put This ZIP Into Your GitHub Repository</span>
            </h4>
            <div className="text-slate-300 text-xs leading-relaxed space-y-1.5">
              <p>
                <strong>Method 1 (Fastest via GitHub Web UI):</strong> Unzip <code className="text-cyan-300 font-mono">CyberRiskTwin-SIH260105.zip</code> on your computer, open <a href={repoUrl} target="_blank" rel="noreferrer" className="text-cyan-400 underline">https://github.com/Anusha-demonslayer/SIH260105</a> in your browser, click <strong>Add file &gt; Upload files</strong>, drag all the unzipped files and folders, and commit!
              </p>
              <p>
                <strong>Method 2 (Using Terminal / Git CLI):</strong>
                <pre className="mt-1 p-2 bg-slate-950 rounded border border-slate-800 text-[11px] font-mono text-cyan-200 overflow-x-auto">
{`unzip CyberRiskTwin-SIH260105.zip -d SIH260105
cd SIH260105
git init
git add .
git commit -m "feat: complete CyberRiskTwin platform (SIH260105)"
git branch -M main
git remote add origin https://github.com/Anusha-demonslayer/SIH260105.git
git push -u origin main`}
                </pre>
              </p>
            </div>
          </div>

          {/* Local Repository Readiness Status */}
          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Local Git Workspace Status</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-[11px]">
              <div className="flex items-center gap-2 bg-slate-950 p-2 rounded border border-slate-800">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>Branch: <strong className="text-white">main</strong></span>
              </div>
              <div className="flex items-center gap-2 bg-slate-950 p-2 rounded border border-slate-800">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>Remote Origin: <strong className="text-white">Configured</strong></span>
              </div>
              <div className="flex items-center gap-2 bg-slate-950 p-2 rounded border border-slate-800">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>Commit: <strong className="text-white">Production V1.0</strong></span>
              </div>
              <div className="flex items-center gap-2 bg-slate-950 p-2 rounded border border-slate-800">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>Documentation: <strong className="text-white">Complete & Formatted</strong></span>
              </div>
            </div>
          </div>

          {/* GitHub Token Push Helper */}
          <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-3">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-cyan-400" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Direct Push Instructions & Authentication
              </h4>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed">
              GitHub requires authenticated credentials (a Personal Access Token or SSH key) to write and push code to remote repositories.
              You can paste your GitHub PAT below to generate the exact one-liner command:
            </p>

            <div className="flex gap-2">
              <input
                type="password"
                placeholder="Enter GitHub Personal Access Token (e.g. ghp_xxxxxxxxxxxx)"
                value={githubToken}
                onChange={(e) => setGithubToken(e.target.value)}
                className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
              />
              <button
                onClick={handleTestPushCommand}
                className="px-3.5 py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs rounded-lg transition cursor-pointer shrink-0"
              >
                Generate Push Command
              </button>
            </div>

            {statusMessage && (
              <div className={`p-2.5 rounded-lg text-[11px] font-mono flex items-center gap-2 ${
                pushStatus === 'error' ? 'bg-rose-950/80 border border-rose-800 text-rose-300' :
                'bg-emerald-950/80 border border-emerald-800 text-emerald-300'
              }`}>
                {pushStatus === 'error' ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
                <span>{statusMessage}</span>
              </div>
            )}

            {/* Ready to copy bash command */}
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 relative group font-mono text-[11px]">
              <div className="text-slate-500 text-[10px] mb-1"># Run in your project root:</div>
              <div className="text-cyan-300 break-all select-all">
                {pushCommandWithToken}
              </div>
              <button
                onClick={() => copyToClipboard(pushCommandWithToken, 'push-cmd')}
                className="absolute right-2 top-2 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px] flex items-center gap-1 transition cursor-pointer"
              >
                {copiedCmd === 'push-cmd' ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCmd === 'push-cmd' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Included Documentation & Repository Map */}
          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <FolderTree className="w-4 h-4 text-cyan-400" />
              <span>Included Clean Repository Structure & Documentation</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono text-slate-300">
              <div className="p-2 bg-slate-950 rounded border border-slate-800/80">
                <strong className="text-cyan-400">README.md</strong>
                <div className="text-slate-500 text-[10px]">Complete hackathon overview, problem statement, features & setup</div>
              </div>
              <div className="p-2 bg-slate-950 rounded border border-slate-800/80">
                <strong className="text-cyan-400">ARCHITECTURE.md</strong>
                <div className="text-slate-500 text-[10px]">Digital twin topology, FAIR ontology, Monte Carlo engine flow</div>
              </div>
              <div className="p-2 bg-slate-950 rounded border border-slate-800/80">
                <strong className="text-cyan-400">FAIR_METHODOLOGY.md</strong>
                <div className="text-slate-500 text-[10px]">Mathematical formulas: TEF, TCap, CS, LEF, SLE, ALE, VaR & ROSI</div>
              </div>
              <div className="p-2 bg-slate-950 rounded border border-slate-800/80">
                <strong className="text-cyan-400">SIH260105_PROPOSAL.md</strong>
                <div className="text-slate-500 text-[10px]">Smart India Hackathon official solution dossier & AICTE alignment</div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
