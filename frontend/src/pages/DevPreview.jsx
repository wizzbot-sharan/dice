import React from 'react';



export default function DevPreview() {
  const operator = { role: 'admin' }; // Mocked for preview
  
  

  return (
    <div className="flex flex-col h-screen bg-black text-slate-200 font-sans overflow-hidden">
      {/* Global Top Bar */}
      <div className="bg-[#0a0a0a] border-b border-white/5 px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-6">
          <span className="text-white font-semibold text-lg">Dev Command Center</span>
          <div className="h-5 w-px bg-white/10"></div>
          
          {/* Global Filters */}
          <div className="flex space-x-3">
            <select className="bg-black border border-white/10 text-white text-sm rounded-lg px-4 py-2 outline-none focus:border-white/20 transition-colors">
              <option>All CAs</option>
              <option>John Doe</option>
            </select>
            <select className="bg-black border border-white/10 text-white text-sm rounded-lg px-4 py-2 outline-none focus:border-white/20 transition-colors">
              <option>All Candidates</option>
            </select>
            <select className="bg-black border border-white/10 text-white text-sm rounded-lg px-4 py-2 outline-none focus:border-white/20 transition-colors">
              <option>All Event Types</option>
              <option>Errors Only</option>
            </select>
          </div>
        </div>
        
        <div className="flex space-x-4 items-center">
          <button className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-lg transition-colors border border-white/5">
            Clear Logs
          </button>
          <span className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-md border border-emerald-500/20 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> SYSTEM HEALTHY
          </span>
        </div>
      </div>
      
      {/* Main Split Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Pane (Stats, Health, Queue) */}
        <div className="w-[450px] border-r border-white/5 bg-[#0a0a0a] p-6 flex flex-col gap-6 overflow-y-auto custom-scrollbar">
          
          {/* Stats Summary */}
          <div>
            <h3 className="text-zinc-500 text-xs font-bold tracking-widest uppercase mb-4">Telemetry Overview</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-black border border-white/5 p-4 rounded-xl">
                <div className="text-zinc-500 text-xs mb-1">Total Events</div>
                <div className="text-white text-2xl font-semibold">1,248</div>
              </div>
              <div className="bg-black border border-white/5 p-4 rounded-xl">
                <div className="text-rose-500/70 text-xs mb-1">Error Rate</div>
                <div className="text-rose-400 text-2xl font-semibold">2.4%</div>
              </div>
              <div className="bg-black border border-white/5 p-4 rounded-xl">
                <div className="text-emerald-500/70 text-xs mb-1">Prompts Sent</div>
                <div className="text-emerald-400 text-2xl font-semibold">342</div>
              </div>
              <div className="bg-black border border-white/5 p-4 rounded-xl">
                <div className="text-zinc-500 text-xs mb-1">Active Sessions</div>
                <div className="text-white text-2xl font-semibold">18</div>
              </div>
            </div>
          </div>

          {/* Railway Metrics (Health) */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-zinc-500 text-xs font-bold tracking-widest uppercase">Railway Live Metrics</h3>
              <span className="text-[10px] text-zinc-500 border border-white/10 px-2 py-0.5 rounded bg-black">dice_autoapply_dashboard</span>
            </div>
            <div className="bg-black border border-white/5 p-5 rounded-xl space-y-5">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-white font-medium">Memory Usage</span>
                  <span className="text-zinc-400 font-mono">75.4 MB / 512 MB</span>
                </div>
                <div className="w-full bg-zinc-900 rounded-full h-1.5">
                  <div className="bg-white h-1.5 rounded-full" style={{ width: '15%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-white font-medium">CPU Load</span>
                  <span className="text-zinc-400 font-mono">~0.00%</span>
                </div>
                <div className="w-full bg-zinc-900 rounded-full h-1.5">
                  <div className="bg-emerald-400 h-1.5 rounded-full" style={{ width: '2%' }}></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Queue Workers */}
          <div className="flex-1">
            <h3 className="text-zinc-500 text-xs font-bold tracking-widest uppercase mb-4">Apply Queue Workers</h3>
            <div className="bg-black border border-white/5 rounded-xl p-2 space-y-2">
              <div className="flex justify-between items-center p-3 hover:bg-white/5 rounded-lg border border-transparent transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  <span className="text-sm text-white font-mono">worker-01</span>
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wide bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded border border-emerald-500/20">Idle</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-zinc-900/50 rounded-lg border border-white/5">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                  <span className="text-sm text-white font-mono">worker-02</span>
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wide bg-blue-500/10 text-blue-400 px-2.5 py-1 rounded border border-blue-500/20">Processing</span>
              </div>
              <div className="flex justify-between items-center p-3 hover:bg-white/5 rounded-lg border border-transparent transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                  <span className="text-sm text-white font-mono">worker-03</span>
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wide bg-rose-500/10 text-rose-400 px-2.5 py-1 rounded border border-rose-500/20">Offline</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Pane (Terminal Stream) */}
        <div className="flex-1 bg-black p-6 flex flex-col min-w-0">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-zinc-500 text-xs font-bold tracking-widest uppercase">Live Audit Stream</h3>
            <div className="flex items-center space-x-2">
              <label className="flex items-center space-x-2 text-sm text-zinc-400 cursor-pointer">
                <input type="checkbox" defaultChecked className="accent-zinc-500" />
                <span>Auto-scroll</span>
              </label>
            </div>
          </div>
          
          {/* Terminal Box */}
          <div className="flex-1 bg-[#050505] border border-white/5 rounded-2xl p-6 font-mono text-xs overflow-y-auto custom-scrollbar shadow-inner">
            <div className="space-y-3">
              <div className="flex gap-4 text-zinc-400 hover:bg-white/5 p-1.5 rounded transition-colors break-words">
                <span className="text-zinc-600 shrink-0">14:02:11</span>
                <span className="text-zinc-300 shrink-0 w-16">[INFO]</span>
                <span className="text-zinc-300">Initialized connection to database and Railway metrics...</span>
              </div>
              <div className="flex gap-4 text-zinc-400 hover:bg-white/5 p-1.5 rounded transition-colors break-words">
                <span className="text-zinc-600 shrink-0">14:02:15</span>
                <span className="text-emerald-400 shrink-0 w-16">[YES]</span>
                <span className="text-white font-medium">Candidate John Doe approved job application: "Senior Frontend Engineer at TechCorp"</span>
              </div>
              <div className="flex gap-4 text-zinc-400 hover:bg-white/5 p-1.5 rounded transition-colors break-words">
                <span className="text-zinc-600 shrink-0">14:02:16</span>
                <span className="text-blue-400 shrink-0 w-16">[QUEUE]</span>
                <span className="text-zinc-300">Job appended to dice_apply_queue. Status set to queued.</span>
              </div>
              <div className="flex gap-4 text-zinc-400 hover:bg-white/5 p-1.5 rounded transition-colors break-words">
                <span className="text-zinc-600 shrink-0">14:02:17</span>
                <span className="text-zinc-500 shrink-0 w-16">[DEBUG]</span>
                <span className="text-zinc-500">worker-02 claimed queued job for John Doe. Transitioning status to running...</span>
              </div>
              <div className="flex gap-4 text-zinc-400 hover:bg-white/5 p-1.5 rounded bg-rose-500/5 border border-rose-500/10 break-words">
                <span className="text-zinc-600 shrink-0">14:03:01</span>
                <span className="text-rose-400 shrink-0 w-16 font-bold">[ERROR]</span>
                <span className="text-rose-300">Playwright timeout encountered on automation pipeline for target URL: https://dice.com/jobs/1234. Retrying...</span>
              </div>
              <div className="flex gap-4 text-zinc-400 hover:bg-white/5 p-1.5 rounded transition-colors break-words">
                <span className="text-zinc-600 shrink-0">14:03:05</span>
                <span className="text-indigo-400 shrink-0 w-16">[SYNC]</span>
                <span className="text-zinc-300">Next automated scan scheduled for 15 minutes from now.</span>
              </div>
              <div className="flex gap-4 text-zinc-400 hover:bg-white/5 p-1.5 rounded transition-colors break-words items-center mt-4">
                <span className="text-zinc-600 shrink-0">14:03:06</span>
                <span className="text-zinc-500 shrink-0 w-16"></span>
                <span className="flex items-center space-x-2 text-zinc-500"><div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce"></div><span>Awaiting new events...</span></span>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
