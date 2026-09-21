import React, { useState } from 'react';

export default function DevPreview() {
  const operator = { role: 'admin' }; // Mocked for preview
  const [activeTab, setActiveTab] = useState('logs');

  return (
    <div className="flex flex-col h-screen bg-black text-slate-200 font-sans overflow-hidden">
      
      {/* 1. TOP HEADER / NAV BAR */}
      <div className="bg-[#0a0a0a] border-b border-white/5 px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-6">
          <span className="text-white font-semibold text-lg flex items-center space-x-2">
            <span className="text-emerald-500">⚡</span>
            <span>Dev Command Center</span>
          </span>
          <div className="h-5 w-px bg-white/10"></div>
          
          {/* Global Filters */}
          <div className="flex space-x-3">
            <select className="bg-black border border-white/10 text-white text-sm rounded-lg px-4 py-1.5 outline-none focus:border-white/20 transition-colors">
              <option>All CAs</option>
              <option>John Doe</option>
            </select>
            <select className="bg-black border border-white/10 text-white text-sm rounded-lg px-4 py-1.5 outline-none focus:border-white/20 transition-colors">
              <option>All Candidates</option>
            </select>
            {activeTab === 'health' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-white text-lg font-medium">System Health & Railway Metrics</h3>
                <span className="text-[10px] text-zinc-500 border border-white/10 px-3 py-1 rounded-full bg-black uppercase tracking-wider font-bold">dice_autoapply_dashboard</span>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6">
                  <h4 className="text-zinc-400 font-medium mb-6">Memory (RAM) Usage</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white font-medium">Used</span>
                      <span className="text-zinc-400 font-mono">75.4 MB / 512.0 MB</span>
                    </div>
                    <div className="w-full bg-black border border-white/5 rounded-full h-3">
                      <div className="bg-indigo-500 h-3 rounded-full" style={{ width: '15%' }}></div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/5 flex justify-between text-xs text-zinc-500">
                      <span>Status: <span className="text-emerald-500 font-bold">Healthy</span></span>
                      <span>15% Load</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6">
                  <h4 className="text-zinc-400 font-medium mb-6">CPU Compute Load</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white font-medium">Load</span>
                      <span className="text-zinc-400 font-mono">~0.01% / 100%</span>
                    </div>
                    <div className="w-full bg-black border border-white/5 rounded-full h-3">
                      <div className="bg-emerald-500 h-3 rounded-full" style={{ width: '2%' }}></div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/5 flex justify-between text-xs text-zinc-500">
                      <span>Status: <span className="text-emerald-500 font-bold">Optimal</span></span>
                      <span>Extremely Low Load</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 col-span-2 mt-2">
                  <h4 className="text-zinc-400 font-medium mb-4">Node Runtime Environment</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-black p-4 rounded-xl border border-white/5">
                      <div className="text-xs text-zinc-500 mb-1">Node Version</div>
                      <div className="text-sm font-mono text-white">v22.x</div>
                    </div>
                    <div className="bg-black p-4 rounded-xl border border-white/5">
                      <div className="text-xs text-zinc-500 mb-1">Process Uptime</div>
                      <div className="text-sm font-mono text-white">4d 12h 33m</div>
                    </div>
                    <div className="bg-black p-4 rounded-xl border border-white/5">
                      <div className="text-xs text-zinc-500 mb-1">Browser Engine</div>
                      <div className="text-sm font-mono text-emerald-400">Playwright (Chromium)</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
          {activeTab === 'health' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-white text-lg font-medium">System Health & Railway Metrics</h3>
                <span className="text-[10px] text-zinc-500 border border-white/10 px-3 py-1 rounded-full bg-black uppercase tracking-wider font-bold">dice_autoapply_dashboard</span>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6">
                  <h4 className="text-zinc-400 font-medium mb-6">Memory (RAM) Usage</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white font-medium">Used</span>
                      <span className="text-zinc-400 font-mono">75.4 MB / 512.0 MB</span>
                    </div>
                    <div className="w-full bg-black border border-white/5 rounded-full h-3">
                      <div className="bg-indigo-500 h-3 rounded-full" style={{ width: '15%' }}></div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/5 flex justify-between text-xs text-zinc-500">
                      <span>Status: <span className="text-emerald-500 font-bold">Healthy</span></span>
                      <span>15% Load</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6">
                  <h4 className="text-zinc-400 font-medium mb-6">CPU Compute Load</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white font-medium">Load</span>
                      <span className="text-zinc-400 font-mono">~0.01% / 100%</span>
                    </div>
                    <div className="w-full bg-black border border-white/5 rounded-full h-3">
                      <div className="bg-emerald-500 h-3 rounded-full" style={{ width: '2%' }}></div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/5 flex justify-between text-xs text-zinc-500">
                      <span>Status: <span className="text-emerald-500 font-bold">Optimal</span></span>
                      <span>Extremely Low Load</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 col-span-2 mt-2">
                  <h4 className="text-zinc-400 font-medium mb-4">Node Runtime Environment</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-black p-4 rounded-xl border border-white/5">
                      <div className="text-xs text-zinc-500 mb-1">Node Version</div>
                      <div className="text-sm font-mono text-white">v22.x</div>
                    </div>
                    <div className="bg-black p-4 rounded-xl border border-white/5">
                      <div className="text-xs text-zinc-500 mb-1">Process Uptime</div>
                      <div className="text-sm font-mono text-white">4d 12h 33m</div>
                    </div>
                    <div className="bg-black p-4 rounded-xl border border-white/5">
                      <div className="text-xs text-zinc-500 mb-1">Browser Engine</div>
                      <div className="text-sm font-mono text-emerald-400">Playwright (Chromium)</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
        
        <div className="flex space-x-4 items-center">
          <span className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-md border border-emerald-500/20 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> HEALTHY
          </span>
          {activeTab === 'health' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-white text-lg font-medium">System Health & Railway Metrics</h3>
                <span className="text-[10px] text-zinc-500 border border-white/10 px-3 py-1 rounded-full bg-black uppercase tracking-wider font-bold">dice_autoapply_dashboard</span>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6">
                  <h4 className="text-zinc-400 font-medium mb-6">Memory (RAM) Usage</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white font-medium">Used</span>
                      <span className="text-zinc-400 font-mono">75.4 MB / 512.0 MB</span>
                    </div>
                    <div className="w-full bg-black border border-white/5 rounded-full h-3">
                      <div className="bg-indigo-500 h-3 rounded-full" style={{ width: '15%' }}></div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/5 flex justify-between text-xs text-zinc-500">
                      <span>Status: <span className="text-emerald-500 font-bold">Healthy</span></span>
                      <span>15% Load</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6">
                  <h4 className="text-zinc-400 font-medium mb-6">CPU Compute Load</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white font-medium">Load</span>
                      <span className="text-zinc-400 font-mono">~0.01% / 100%</span>
                    </div>
                    <div className="w-full bg-black border border-white/5 rounded-full h-3">
                      <div className="bg-emerald-500 h-3 rounded-full" style={{ width: '2%' }}></div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/5 flex justify-between text-xs text-zinc-500">
                      <span>Status: <span className="text-emerald-500 font-bold">Optimal</span></span>
                      <span>Extremely Low Load</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 col-span-2 mt-2">
                  <h4 className="text-zinc-400 font-medium mb-4">Node Runtime Environment</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-black p-4 rounded-xl border border-white/5">
                      <div className="text-xs text-zinc-500 mb-1">Node Version</div>
                      <div className="text-sm font-mono text-white">v22.x</div>
                    </div>
                    <div className="bg-black p-4 rounded-xl border border-white/5">
                      <div className="text-xs text-zinc-500 mb-1">Process Uptime</div>
                      <div className="text-sm font-mono text-white">4d 12h 33m</div>
                    </div>
                    <div className="bg-black p-4 rounded-xl border border-white/5">
                      <div className="text-xs text-zinc-500 mb-1">Browser Engine</div>
                      <div className="text-sm font-mono text-emerald-400">Playwright (Chromium)</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
      
      {/* 2. FIXED STATS ROW (Under Nav Bar) */}
      <div className="bg-[#050505] border-b border-white/5 px-6 py-4 shrink-0 flex gap-4 overflow-x-auto custom-scrollbar">
        <div className="bg-[#0a0a0a] border border-white/5 p-4 rounded-xl flex-1 min-w-[150px]">
          <div className="text-zinc-500 text-xs mb-1 uppercase tracking-wider font-bold">Telegram Users</div>
          <div className="text-white text-2xl font-semibold">142</div>
          {activeTab === 'health' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-white text-lg font-medium">System Health & Railway Metrics</h3>
                <span className="text-[10px] text-zinc-500 border border-white/10 px-3 py-1 rounded-full bg-black uppercase tracking-wider font-bold">dice_autoapply_dashboard</span>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6">
                  <h4 className="text-zinc-400 font-medium mb-6">Memory (RAM) Usage</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white font-medium">Used</span>
                      <span className="text-zinc-400 font-mono">75.4 MB / 512.0 MB</span>
                    </div>
                    <div className="w-full bg-black border border-white/5 rounded-full h-3">
                      <div className="bg-indigo-500 h-3 rounded-full" style={{ width: '15%' }}></div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/5 flex justify-between text-xs text-zinc-500">
                      <span>Status: <span className="text-emerald-500 font-bold">Healthy</span></span>
                      <span>15% Load</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6">
                  <h4 className="text-zinc-400 font-medium mb-6">CPU Compute Load</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white font-medium">Load</span>
                      <span className="text-zinc-400 font-mono">~0.01% / 100%</span>
                    </div>
                    <div className="w-full bg-black border border-white/5 rounded-full h-3">
                      <div className="bg-emerald-500 h-3 rounded-full" style={{ width: '2%' }}></div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/5 flex justify-between text-xs text-zinc-500">
                      <span>Status: <span className="text-emerald-500 font-bold">Optimal</span></span>
                      <span>Extremely Low Load</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 col-span-2 mt-2">
                  <h4 className="text-zinc-400 font-medium mb-4">Node Runtime Environment</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-black p-4 rounded-xl border border-white/5">
                      <div className="text-xs text-zinc-500 mb-1">Node Version</div>
                      <div className="text-sm font-mono text-white">v22.x</div>
                    </div>
                    <div className="bg-black p-4 rounded-xl border border-white/5">
                      <div className="text-xs text-zinc-500 mb-1">Process Uptime</div>
                      <div className="text-sm font-mono text-white">4d 12h 33m</div>
                    </div>
                    <div className="bg-black p-4 rounded-xl border border-white/5">
                      <div className="text-xs text-zinc-500 mb-1">Browser Engine</div>
                      <div className="text-sm font-mono text-emerald-400">Playwright (Chromium)</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
        <div className="bg-[#0a0a0a] border border-white/5 p-4 rounded-xl flex-1 min-w-[150px]">
          <div className="text-zinc-500 text-xs mb-1 uppercase tracking-wider font-bold">Jobs Sent</div>
          <div className="text-blue-400 text-2xl font-semibold">894</div>
          {activeTab === 'health' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-white text-lg font-medium">System Health & Railway Metrics</h3>
                <span className="text-[10px] text-zinc-500 border border-white/10 px-3 py-1 rounded-full bg-black uppercase tracking-wider font-bold">dice_autoapply_dashboard</span>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6">
                  <h4 className="text-zinc-400 font-medium mb-6">Memory (RAM) Usage</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white font-medium">Used</span>
                      <span className="text-zinc-400 font-mono">75.4 MB / 512.0 MB</span>
                    </div>
                    <div className="w-full bg-black border border-white/5 rounded-full h-3">
                      <div className="bg-indigo-500 h-3 rounded-full" style={{ width: '15%' }}></div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/5 flex justify-between text-xs text-zinc-500">
                      <span>Status: <span className="text-emerald-500 font-bold">Healthy</span></span>
                      <span>15% Load</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6">
                  <h4 className="text-zinc-400 font-medium mb-6">CPU Compute Load</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white font-medium">Load</span>
                      <span className="text-zinc-400 font-mono">~0.01% / 100%</span>
                    </div>
                    <div className="w-full bg-black border border-white/5 rounded-full h-3">
                      <div className="bg-emerald-500 h-3 rounded-full" style={{ width: '2%' }}></div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/5 flex justify-between text-xs text-zinc-500">
                      <span>Status: <span className="text-emerald-500 font-bold">Optimal</span></span>
                      <span>Extremely Low Load</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 col-span-2 mt-2">
                  <h4 className="text-zinc-400 font-medium mb-4">Node Runtime Environment</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-black p-4 rounded-xl border border-white/5">
                      <div className="text-xs text-zinc-500 mb-1">Node Version</div>
                      <div className="text-sm font-mono text-white">v22.x</div>
                    </div>
                    <div className="bg-black p-4 rounded-xl border border-white/5">
                      <div className="text-xs text-zinc-500 mb-1">Process Uptime</div>
                      <div className="text-sm font-mono text-white">4d 12h 33m</div>
                    </div>
                    <div className="bg-black p-4 rounded-xl border border-white/5">
                      <div className="text-xs text-zinc-500 mb-1">Browser Engine</div>
                      <div className="text-sm font-mono text-emerald-400">Playwright (Chromium)</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
        <div className="bg-[#0a0a0a] border border-white/5 p-4 rounded-xl flex-1 min-w-[150px]">
          <div className="text-emerald-500/70 text-xs mb-1 uppercase tracking-wider font-bold">Yes (Approved)</div>
          <div className="text-emerald-400 text-2xl font-semibold">412</div>
          {activeTab === 'health' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-white text-lg font-medium">System Health & Railway Metrics</h3>
                <span className="text-[10px] text-zinc-500 border border-white/10 px-3 py-1 rounded-full bg-black uppercase tracking-wider font-bold">dice_autoapply_dashboard</span>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6">
                  <h4 className="text-zinc-400 font-medium mb-6">Memory (RAM) Usage</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white font-medium">Used</span>
                      <span className="text-zinc-400 font-mono">75.4 MB / 512.0 MB</span>
                    </div>
                    <div className="w-full bg-black border border-white/5 rounded-full h-3">
                      <div className="bg-indigo-500 h-3 rounded-full" style={{ width: '15%' }}></div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/5 flex justify-between text-xs text-zinc-500">
                      <span>Status: <span className="text-emerald-500 font-bold">Healthy</span></span>
                      <span>15% Load</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6">
                  <h4 className="text-zinc-400 font-medium mb-6">CPU Compute Load</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white font-medium">Load</span>
                      <span className="text-zinc-400 font-mono">~0.01% / 100%</span>
                    </div>
                    <div className="w-full bg-black border border-white/5 rounded-full h-3">
                      <div className="bg-emerald-500 h-3 rounded-full" style={{ width: '2%' }}></div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/5 flex justify-between text-xs text-zinc-500">
                      <span>Status: <span className="text-emerald-500 font-bold">Optimal</span></span>
                      <span>Extremely Low Load</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 col-span-2 mt-2">
                  <h4 className="text-zinc-400 font-medium mb-4">Node Runtime Environment</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-black p-4 rounded-xl border border-white/5">
                      <div className="text-xs text-zinc-500 mb-1">Node Version</div>
                      <div className="text-sm font-mono text-white">v22.x</div>
                    </div>
                    <div className="bg-black p-4 rounded-xl border border-white/5">
                      <div className="text-xs text-zinc-500 mb-1">Process Uptime</div>
                      <div className="text-sm font-mono text-white">4d 12h 33m</div>
                    </div>
                    <div className="bg-black p-4 rounded-xl border border-white/5">
                      <div className="text-xs text-zinc-500 mb-1">Browser Engine</div>
                      <div className="text-sm font-mono text-emerald-400">Playwright (Chromium)</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
        <div className="bg-[#0a0a0a] border border-white/5 p-4 rounded-xl flex-1 min-w-[150px]">
          <div className="text-rose-500/70 text-xs mb-1 uppercase tracking-wider font-bold">No (Rejected)</div>
          <div className="text-rose-400 text-2xl font-semibold">156</div>
          {activeTab === 'health' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-white text-lg font-medium">System Health & Railway Metrics</h3>
                <span className="text-[10px] text-zinc-500 border border-white/10 px-3 py-1 rounded-full bg-black uppercase tracking-wider font-bold">dice_autoapply_dashboard</span>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6">
                  <h4 className="text-zinc-400 font-medium mb-6">Memory (RAM) Usage</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white font-medium">Used</span>
                      <span className="text-zinc-400 font-mono">75.4 MB / 512.0 MB</span>
                    </div>
                    <div className="w-full bg-black border border-white/5 rounded-full h-3">
                      <div className="bg-indigo-500 h-3 rounded-full" style={{ width: '15%' }}></div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/5 flex justify-between text-xs text-zinc-500">
                      <span>Status: <span className="text-emerald-500 font-bold">Healthy</span></span>
                      <span>15% Load</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6">
                  <h4 className="text-zinc-400 font-medium mb-6">CPU Compute Load</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white font-medium">Load</span>
                      <span className="text-zinc-400 font-mono">~0.01% / 100%</span>
                    </div>
                    <div className="w-full bg-black border border-white/5 rounded-full h-3">
                      <div className="bg-emerald-500 h-3 rounded-full" style={{ width: '2%' }}></div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/5 flex justify-between text-xs text-zinc-500">
                      <span>Status: <span className="text-emerald-500 font-bold">Optimal</span></span>
                      <span>Extremely Low Load</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 col-span-2 mt-2">
                  <h4 className="text-zinc-400 font-medium mb-4">Node Runtime Environment</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-black p-4 rounded-xl border border-white/5">
                      <div className="text-xs text-zinc-500 mb-1">Node Version</div>
                      <div className="text-sm font-mono text-white">v22.x</div>
                    </div>
                    <div className="bg-black p-4 rounded-xl border border-white/5">
                      <div className="text-xs text-zinc-500 mb-1">Process Uptime</div>
                      <div className="text-sm font-mono text-white">4d 12h 33m</div>
                    </div>
                    <div className="bg-black p-4 rounded-xl border border-white/5">
                      <div className="text-xs text-zinc-500 mb-1">Browser Engine</div>
                      <div className="text-sm font-mono text-emerald-400">Playwright (Chromium)</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
        <div className="bg-[#0a0a0a] border border-white/5 p-4 rounded-xl flex-1 min-w-[150px]">
          <div className="text-amber-500/70 text-xs mb-1 uppercase tracking-wider font-bold">Missed (Timeout)</div>
          <div className="text-amber-400 text-2xl font-semibold">326</div>
          {activeTab === 'health' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-white text-lg font-medium">System Health & Railway Metrics</h3>
                <span className="text-[10px] text-zinc-500 border border-white/10 px-3 py-1 rounded-full bg-black uppercase tracking-wider font-bold">dice_autoapply_dashboard</span>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6">
                  <h4 className="text-zinc-400 font-medium mb-6">Memory (RAM) Usage</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white font-medium">Used</span>
                      <span className="text-zinc-400 font-mono">75.4 MB / 512.0 MB</span>
                    </div>
                    <div className="w-full bg-black border border-white/5 rounded-full h-3">
                      <div className="bg-indigo-500 h-3 rounded-full" style={{ width: '15%' }}></div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/5 flex justify-between text-xs text-zinc-500">
                      <span>Status: <span className="text-emerald-500 font-bold">Healthy</span></span>
                      <span>15% Load</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6">
                  <h4 className="text-zinc-400 font-medium mb-6">CPU Compute Load</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white font-medium">Load</span>
                      <span className="text-zinc-400 font-mono">~0.01% / 100%</span>
                    </div>
                    <div className="w-full bg-black border border-white/5 rounded-full h-3">
                      <div className="bg-emerald-500 h-3 rounded-full" style={{ width: '2%' }}></div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/5 flex justify-between text-xs text-zinc-500">
                      <span>Status: <span className="text-emerald-500 font-bold">Optimal</span></span>
                      <span>Extremely Low Load</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 col-span-2 mt-2">
                  <h4 className="text-zinc-400 font-medium mb-4">Node Runtime Environment</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-black p-4 rounded-xl border border-white/5">
                      <div className="text-xs text-zinc-500 mb-1">Node Version</div>
                      <div className="text-sm font-mono text-white">v22.x</div>
                    </div>
                    <div className="bg-black p-4 rounded-xl border border-white/5">
                      <div className="text-xs text-zinc-500 mb-1">Process Uptime</div>
                      <div className="text-sm font-mono text-white">4d 12h 33m</div>
                    </div>
                    <div className="bg-black p-4 rounded-xl border border-white/5">
                      <div className="text-xs text-zinc-500 mb-1">Browser Engine</div>
                      <div className="text-sm font-mono text-emerald-400">Playwright (Chromium)</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* 3. L-SHAPE SPLIT LAYOUT */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar Pane (Sections) */}
        <div className="w-64 bg-[#0a0a0a] border-r border-white/5 p-4 flex flex-col gap-2 shrink-0">
          <button 
            onClick={() => setActiveTab('logs')}
            className={`w-full text-left px-4 py-3 rounded-xl transition-all text-sm font-medium ${activeTab === 'logs' ? 'bg-white text-black shadow-sm' : 'text-zinc-400 hover:bg-white/5 hover:text-white'}`}
          >
            Live Logs
          </button>
          <button 
            onClick={() => setActiveTab('workers')}
            className={`w-full text-left px-4 py-3 rounded-xl transition-all text-sm font-medium ${activeTab === 'workers' ? 'bg-white text-black shadow-sm' : 'text-zinc-400 hover:bg-white/5 hover:text-white'}`}
          >
            Apply Workers
          </button>
          <button 
            onClick={() => setActiveTab('errors')}
            className={`w-full text-left px-4 py-3 rounded-xl transition-all text-sm font-medium ${activeTab === 'errors' ? 'bg-white text-black shadow-sm' : 'text-zinc-400 hover:bg-white/5 hover:text-white'}`}
          >
            Diagnostics / Errors
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`w-full text-left px-4 py-3 rounded-xl transition-all text-sm font-medium ${activeTab === 'users' ? 'bg-white text-black shadow-sm' : 'text-zinc-400 hover:bg-white/5 hover:text-white'}`}
          >
            Telegram Users
          </button>
          <button 
            onClick={() => setActiveTab('health')}
            className={`w-full text-left px-4 py-3 rounded-xl transition-all text-sm font-medium ${activeTab === 'health' ? 'bg-white text-black shadow-sm' : 'text-zinc-400 hover:bg-white/5 hover:text-white'}`}
          >
            Railway Metrics
          </button>
          {activeTab === 'health' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-white text-lg font-medium">System Health & Railway Metrics</h3>
                <span className="text-[10px] text-zinc-500 border border-white/10 px-3 py-1 rounded-full bg-black uppercase tracking-wider font-bold">dice_autoapply_dashboard</span>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6">
                  <h4 className="text-zinc-400 font-medium mb-6">Memory (RAM) Usage</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white font-medium">Used</span>
                      <span className="text-zinc-400 font-mono">75.4 MB / 512.0 MB</span>
                    </div>
                    <div className="w-full bg-black border border-white/5 rounded-full h-3">
                      <div className="bg-indigo-500 h-3 rounded-full" style={{ width: '15%' }}></div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/5 flex justify-between text-xs text-zinc-500">
                      <span>Status: <span className="text-emerald-500 font-bold">Healthy</span></span>
                      <span>15% Load</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6">
                  <h4 className="text-zinc-400 font-medium mb-6">CPU Compute Load</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white font-medium">Load</span>
                      <span className="text-zinc-400 font-mono">~0.01% / 100%</span>
                    </div>
                    <div className="w-full bg-black border border-white/5 rounded-full h-3">
                      <div className="bg-emerald-500 h-3 rounded-full" style={{ width: '2%' }}></div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/5 flex justify-between text-xs text-zinc-500">
                      <span>Status: <span className="text-emerald-500 font-bold">Optimal</span></span>
                      <span>Extremely Low Load</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 col-span-2 mt-2">
                  <h4 className="text-zinc-400 font-medium mb-4">Node Runtime Environment</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-black p-4 rounded-xl border border-white/5">
                      <div className="text-xs text-zinc-500 mb-1">Node Version</div>
                      <div className="text-sm font-mono text-white">v22.x</div>
                    </div>
                    <div className="bg-black p-4 rounded-xl border border-white/5">
                      <div className="text-xs text-zinc-500 mb-1">Process Uptime</div>
                      <div className="text-sm font-mono text-white">4d 12h 33m</div>
                    </div>
                    <div className="bg-black p-4 rounded-xl border border-white/5">
                      <div className="text-xs text-zinc-500 mb-1">Browser Engine</div>
                      <div className="text-sm font-mono text-emerald-400">Playwright (Chromium)</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Right Content Area (Dynamic based on selected section) */}
        <div className="flex-1 bg-black p-6 overflow-y-auto custom-scrollbar">
          
          {activeTab === 'logs' && (
            <div className="h-full flex flex-col">
              <div className="flex justify-between items-center mb-4 shrink-0">
                <h3 className="text-white text-lg font-medium">Live Audit Stream</h3>
                <div className="flex space-x-2">
                  <input type="text" placeholder="Grep logs..." className="bg-[#0a0a0a] border border-white/5 text-sm text-white px-3 py-1.5 rounded-lg outline-none focus:border-white/20 w-64" />
                  {activeTab === 'health' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-white text-lg font-medium">System Health & Railway Metrics</h3>
                <span className="text-[10px] text-zinc-500 border border-white/10 px-3 py-1 rounded-full bg-black uppercase tracking-wider font-bold">dice_autoapply_dashboard</span>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6">
                  <h4 className="text-zinc-400 font-medium mb-6">Memory (RAM) Usage</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white font-medium">Used</span>
                      <span className="text-zinc-400 font-mono">75.4 MB / 512.0 MB</span>
                    </div>
                    <div className="w-full bg-black border border-white/5 rounded-full h-3">
                      <div className="bg-indigo-500 h-3 rounded-full" style={{ width: '15%' }}></div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/5 flex justify-between text-xs text-zinc-500">
                      <span>Status: <span className="text-emerald-500 font-bold">Healthy</span></span>
                      <span>15% Load</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6">
                  <h4 className="text-zinc-400 font-medium mb-6">CPU Compute Load</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white font-medium">Load</span>
                      <span className="text-zinc-400 font-mono">~0.01% / 100%</span>
                    </div>
                    <div className="w-full bg-black border border-white/5 rounded-full h-3">
                      <div className="bg-emerald-500 h-3 rounded-full" style={{ width: '2%' }}></div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/5 flex justify-between text-xs text-zinc-500">
                      <span>Status: <span className="text-emerald-500 font-bold">Optimal</span></span>
                      <span>Extremely Low Load</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 col-span-2 mt-2">
                  <h4 className="text-zinc-400 font-medium mb-4">Node Runtime Environment</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-black p-4 rounded-xl border border-white/5">
                      <div className="text-xs text-zinc-500 mb-1">Node Version</div>
                      <div className="text-sm font-mono text-white">v22.x</div>
                    </div>
                    <div className="bg-black p-4 rounded-xl border border-white/5">
                      <div className="text-xs text-zinc-500 mb-1">Process Uptime</div>
                      <div className="text-sm font-mono text-white">4d 12h 33m</div>
                    </div>
                    <div className="bg-black p-4 rounded-xl border border-white/5">
                      <div className="text-xs text-zinc-500 mb-1">Browser Engine</div>
                      <div className="text-sm font-mono text-emerald-400">Playwright (Chromium)</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
                {activeTab === 'health' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-white text-lg font-medium">System Health & Railway Metrics</h3>
                <span className="text-[10px] text-zinc-500 border border-white/10 px-3 py-1 rounded-full bg-black uppercase tracking-wider font-bold">dice_autoapply_dashboard</span>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6">
                  <h4 className="text-zinc-400 font-medium mb-6">Memory (RAM) Usage</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white font-medium">Used</span>
                      <span className="text-zinc-400 font-mono">75.4 MB / 512.0 MB</span>
                    </div>
                    <div className="w-full bg-black border border-white/5 rounded-full h-3">
                      <div className="bg-indigo-500 h-3 rounded-full" style={{ width: '15%' }}></div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/5 flex justify-between text-xs text-zinc-500">
                      <span>Status: <span className="text-emerald-500 font-bold">Healthy</span></span>
                      <span>15% Load</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6">
                  <h4 className="text-zinc-400 font-medium mb-6">CPU Compute Load</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white font-medium">Load</span>
                      <span className="text-zinc-400 font-mono">~0.01% / 100%</span>
                    </div>
                    <div className="w-full bg-black border border-white/5 rounded-full h-3">
                      <div className="bg-emerald-500 h-3 rounded-full" style={{ width: '2%' }}></div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/5 flex justify-between text-xs text-zinc-500">
                      <span>Status: <span className="text-emerald-500 font-bold">Optimal</span></span>
                      <span>Extremely Low Load</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 col-span-2 mt-2">
                  <h4 className="text-zinc-400 font-medium mb-4">Node Runtime Environment</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-black p-4 rounded-xl border border-white/5">
                      <div className="text-xs text-zinc-500 mb-1">Node Version</div>
                      <div className="text-sm font-mono text-white">v22.x</div>
                    </div>
                    <div className="bg-black p-4 rounded-xl border border-white/5">
                      <div className="text-xs text-zinc-500 mb-1">Process Uptime</div>
                      <div className="text-sm font-mono text-white">4d 12h 33m</div>
                    </div>
                    <div className="bg-black p-4 rounded-xl border border-white/5">
                      <div className="text-xs text-zinc-500 mb-1">Browser Engine</div>
                      <div className="text-sm font-mono text-emerald-400">Playwright (Chromium)</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
              <div className="flex-1 bg-[#050505] border border-white/5 rounded-2xl p-6 font-mono text-xs overflow-y-auto custom-scrollbar shadow-inner">
                <div className="space-y-3">
                  <div className="flex gap-4 text-zinc-400 hover:bg-white/5 p-1.5 rounded transition-colors break-words">
                    <span className="text-zinc-600 shrink-0">14:02:11</span>
                    <span className="text-zinc-300 shrink-0 w-16">[INFO]</span>
                    <span className="text-zinc-300">Initialized connection to database and Railway metrics...</span>
                    {activeTab === 'health' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-white text-lg font-medium">System Health & Railway Metrics</h3>
                <span className="text-[10px] text-zinc-500 border border-white/10 px-3 py-1 rounded-full bg-black uppercase tracking-wider font-bold">dice_autoapply_dashboard</span>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6">
                  <h4 className="text-zinc-400 font-medium mb-6">Memory (RAM) Usage</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white font-medium">Used</span>
                      <span className="text-zinc-400 font-mono">75.4 MB / 512.0 MB</span>
                    </div>
                    <div className="w-full bg-black border border-white/5 rounded-full h-3">
                      <div className="bg-indigo-500 h-3 rounded-full" style={{ width: '15%' }}></div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/5 flex justify-between text-xs text-zinc-500">
                      <span>Status: <span className="text-emerald-500 font-bold">Healthy</span></span>
                      <span>15% Load</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6">
                  <h4 className="text-zinc-400 font-medium mb-6">CPU Compute Load</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white font-medium">Load</span>
                      <span className="text-zinc-400 font-mono">~0.01% / 100%</span>
                    </div>
                    <div className="w-full bg-black border border-white/5 rounded-full h-3">
                      <div className="bg-emerald-500 h-3 rounded-full" style={{ width: '2%' }}></div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/5 flex justify-between text-xs text-zinc-500">
                      <span>Status: <span className="text-emerald-500 font-bold">Optimal</span></span>
                      <span>Extremely Low Load</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 col-span-2 mt-2">
                  <h4 className="text-zinc-400 font-medium mb-4">Node Runtime Environment</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-black p-4 rounded-xl border border-white/5">
                      <div className="text-xs text-zinc-500 mb-1">Node Version</div>
                      <div className="text-sm font-mono text-white">v22.x</div>
                    </div>
                    <div className="bg-black p-4 rounded-xl border border-white/5">
                      <div className="text-xs text-zinc-500 mb-1">Process Uptime</div>
                      <div className="text-sm font-mono text-white">4d 12h 33m</div>
                    </div>
                    <div className="bg-black p-4 rounded-xl border border-white/5">
                      <div className="text-xs text-zinc-500 mb-1">Browser Engine</div>
                      <div className="text-sm font-mono text-emerald-400">Playwright (Chromium)</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
                  <div className="flex gap-4 text-zinc-400 hover:bg-white/5 p-1.5 rounded transition-colors break-words">
                    <span className="text-zinc-600 shrink-0">14:02:15</span>
                    <span className="text-emerald-400 shrink-0 w-16">[YES]</span>
                    <span className="text-white font-medium">Candidate John Doe approved job application: "Senior Frontend Engineer"</span>
                    {activeTab === 'health' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-white text-lg font-medium">System Health & Railway Metrics</h3>
                <span className="text-[10px] text-zinc-500 border border-white/10 px-3 py-1 rounded-full bg-black uppercase tracking-wider font-bold">dice_autoapply_dashboard</span>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6">
                  <h4 className="text-zinc-400 font-medium mb-6">Memory (RAM) Usage</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white font-medium">Used</span>
                      <span className="text-zinc-400 font-mono">75.4 MB / 512.0 MB</span>
                    </div>
                    <div className="w-full bg-black border border-white/5 rounded-full h-3">
                      <div className="bg-indigo-500 h-3 rounded-full" style={{ width: '15%' }}></div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/5 flex justify-between text-xs text-zinc-500">
                      <span>Status: <span className="text-emerald-500 font-bold">Healthy</span></span>
                      <span>15% Load</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6">
                  <h4 className="text-zinc-400 font-medium mb-6">CPU Compute Load</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white font-medium">Load</span>
                      <span className="text-zinc-400 font-mono">~0.01% / 100%</span>
                    </div>
                    <div className="w-full bg-black border border-white/5 rounded-full h-3">
                      <div className="bg-emerald-500 h-3 rounded-full" style={{ width: '2%' }}></div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/5 flex justify-between text-xs text-zinc-500">
                      <span>Status: <span className="text-emerald-500 font-bold">Optimal</span></span>
                      <span>Extremely Low Load</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 col-span-2 mt-2">
                  <h4 className="text-zinc-400 font-medium mb-4">Node Runtime Environment</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-black p-4 rounded-xl border border-white/5">
                      <div className="text-xs text-zinc-500 mb-1">Node Version</div>
                      <div className="text-sm font-mono text-white">v22.x</div>
                    </div>
                    <div className="bg-black p-4 rounded-xl border border-white/5">
                      <div className="text-xs text-zinc-500 mb-1">Process Uptime</div>
                      <div className="text-sm font-mono text-white">4d 12h 33m</div>
                    </div>
                    <div className="bg-black p-4 rounded-xl border border-white/5">
                      <div className="text-xs text-zinc-500 mb-1">Browser Engine</div>
                      <div className="text-sm font-mono text-emerald-400">Playwright (Chromium)</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
                  <div className="flex gap-4 text-zinc-400 hover:bg-white/5 p-1.5 rounded transition-colors break-words">
                    <span className="text-zinc-600 shrink-0">14:02:16</span>
                    <span className="text-blue-400 shrink-0 w-16">[QUEUE]</span>
                    <span className="text-zinc-300">Job appended to dice_apply_queue. Status set to queued.</span>
                    {activeTab === 'health' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-white text-lg font-medium">System Health & Railway Metrics</h3>
                <span className="text-[10px] text-zinc-500 border border-white/10 px-3 py-1 rounded-full bg-black uppercase tracking-wider font-bold">dice_autoapply_dashboard</span>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6">
                  <h4 className="text-zinc-400 font-medium mb-6">Memory (RAM) Usage</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white font-medium">Used</span>
                      <span className="text-zinc-400 font-mono">75.4 MB / 512.0 MB</span>
                    </div>
                    <div className="w-full bg-black border border-white/5 rounded-full h-3">
                      <div className="bg-indigo-500 h-3 rounded-full" style={{ width: '15%' }}></div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/5 flex justify-between text-xs text-zinc-500">
                      <span>Status: <span className="text-emerald-500 font-bold">Healthy</span></span>
                      <span>15% Load</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6">
                  <h4 className="text-zinc-400 font-medium mb-6">CPU Compute Load</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white font-medium">Load</span>
                      <span className="text-zinc-400 font-mono">~0.01% / 100%</span>
                    </div>
                    <div className="w-full bg-black border border-white/5 rounded-full h-3">
                      <div className="bg-emerald-500 h-3 rounded-full" style={{ width: '2%' }}></div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/5 flex justify-between text-xs text-zinc-500">
                      <span>Status: <span className="text-emerald-500 font-bold">Optimal</span></span>
                      <span>Extremely Low Load</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 col-span-2 mt-2">
                  <h4 className="text-zinc-400 font-medium mb-4">Node Runtime Environment</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-black p-4 rounded-xl border border-white/5">
                      <div className="text-xs text-zinc-500 mb-1">Node Version</div>
                      <div className="text-sm font-mono text-white">v22.x</div>
                    </div>
                    <div className="bg-black p-4 rounded-xl border border-white/5">
                      <div className="text-xs text-zinc-500 mb-1">Process Uptime</div>
                      <div className="text-sm font-mono text-white">4d 12h 33m</div>
                    </div>
                    <div className="bg-black p-4 rounded-xl border border-white/5">
                      <div className="text-xs text-zinc-500 mb-1">Browser Engine</div>
                      <div className="text-sm font-mono text-emerald-400">Playwright (Chromium)</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
                  <div className="flex gap-4 text-zinc-400 hover:bg-white/5 p-1.5 rounded bg-rose-500/5 border border-rose-500/10 break-words">
                    <span className="text-zinc-600 shrink-0">14:03:01</span>
                    <span className="text-rose-400 shrink-0 w-16 font-bold">[ERROR]</span>
                    <span className="text-rose-300">Playwright timeout encountered on automation pipeline for target URL.</span>
                    {activeTab === 'health' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-white text-lg font-medium">System Health & Railway Metrics</h3>
                <span className="text-[10px] text-zinc-500 border border-white/10 px-3 py-1 rounded-full bg-black uppercase tracking-wider font-bold">dice_autoapply_dashboard</span>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6">
                  <h4 className="text-zinc-400 font-medium mb-6">Memory (RAM) Usage</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white font-medium">Used</span>
                      <span className="text-zinc-400 font-mono">75.4 MB / 512.0 MB</span>
                    </div>
                    <div className="w-full bg-black border border-white/5 rounded-full h-3">
                      <div className="bg-indigo-500 h-3 rounded-full" style={{ width: '15%' }}></div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/5 flex justify-between text-xs text-zinc-500">
                      <span>Status: <span className="text-emerald-500 font-bold">Healthy</span></span>
                      <span>15% Load</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6">
                  <h4 className="text-zinc-400 font-medium mb-6">CPU Compute Load</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white font-medium">Load</span>
                      <span className="text-zinc-400 font-mono">~0.01% / 100%</span>
                    </div>
                    <div className="w-full bg-black border border-white/5 rounded-full h-3">
                      <div className="bg-emerald-500 h-3 rounded-full" style={{ width: '2%' }}></div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/5 flex justify-between text-xs text-zinc-500">
                      <span>Status: <span className="text-emerald-500 font-bold">Optimal</span></span>
                      <span>Extremely Low Load</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 col-span-2 mt-2">
                  <h4 className="text-zinc-400 font-medium mb-4">Node Runtime Environment</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-black p-4 rounded-xl border border-white/5">
                      <div className="text-xs text-zinc-500 mb-1">Node Version</div>
                      <div className="text-sm font-mono text-white">v22.x</div>
                    </div>
                    <div className="bg-black p-4 rounded-xl border border-white/5">
                      <div className="text-xs text-zinc-500 mb-1">Process Uptime</div>
                      <div className="text-sm font-mono text-white">4d 12h 33m</div>
                    </div>
                    <div className="bg-black p-4 rounded-xl border border-white/5">
                      <div className="text-xs text-zinc-500 mb-1">Browser Engine</div>
                      <div className="text-sm font-mono text-emerald-400">Playwright (Chromium)</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
                  {activeTab === 'health' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-white text-lg font-medium">System Health & Railway Metrics</h3>
                <span className="text-[10px] text-zinc-500 border border-white/10 px-3 py-1 rounded-full bg-black uppercase tracking-wider font-bold">dice_autoapply_dashboard</span>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6">
                  <h4 className="text-zinc-400 font-medium mb-6">Memory (RAM) Usage</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white font-medium">Used</span>
                      <span className="text-zinc-400 font-mono">75.4 MB / 512.0 MB</span>
                    </div>
                    <div className="w-full bg-black border border-white/5 rounded-full h-3">
                      <div className="bg-indigo-500 h-3 rounded-full" style={{ width: '15%' }}></div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/5 flex justify-between text-xs text-zinc-500">
                      <span>Status: <span className="text-emerald-500 font-bold">Healthy</span></span>
                      <span>15% Load</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6">
                  <h4 className="text-zinc-400 font-medium mb-6">CPU Compute Load</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white font-medium">Load</span>
                      <span className="text-zinc-400 font-mono">~0.01% / 100%</span>
                    </div>
                    <div className="w-full bg-black border border-white/5 rounded-full h-3">
                      <div className="bg-emerald-500 h-3 rounded-full" style={{ width: '2%' }}></div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/5 flex justify-between text-xs text-zinc-500">
                      <span>Status: <span className="text-emerald-500 font-bold">Optimal</span></span>
                      <span>Extremely Low Load</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 col-span-2 mt-2">
                  <h4 className="text-zinc-400 font-medium mb-4">Node Runtime Environment</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-black p-4 rounded-xl border border-white/5">
                      <div className="text-xs text-zinc-500 mb-1">Node Version</div>
                      <div className="text-sm font-mono text-white">v22.x</div>
                    </div>
                    <div className="bg-black p-4 rounded-xl border border-white/5">
                      <div className="text-xs text-zinc-500 mb-1">Process Uptime</div>
                      <div className="text-sm font-mono text-white">4d 12h 33m</div>
                    </div>
                    <div className="bg-black p-4 rounded-xl border border-white/5">
                      <div className="text-xs text-zinc-500 mb-1">Browser Engine</div>
                      <div className="text-sm font-mono text-emerald-400">Playwright (Chromium)</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
                {activeTab === 'health' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-white text-lg font-medium">System Health & Railway Metrics</h3>
                <span className="text-[10px] text-zinc-500 border border-white/10 px-3 py-1 rounded-full bg-black uppercase tracking-wider font-bold">dice_autoapply_dashboard</span>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6">
                  <h4 className="text-zinc-400 font-medium mb-6">Memory (RAM) Usage</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white font-medium">Used</span>
                      <span className="text-zinc-400 font-mono">75.4 MB / 512.0 MB</span>
                    </div>
                    <div className="w-full bg-black border border-white/5 rounded-full h-3">
                      <div className="bg-indigo-500 h-3 rounded-full" style={{ width: '15%' }}></div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/5 flex justify-between text-xs text-zinc-500">
                      <span>Status: <span className="text-emerald-500 font-bold">Healthy</span></span>
                      <span>15% Load</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6">
                  <h4 className="text-zinc-400 font-medium mb-6">CPU Compute Load</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white font-medium">Load</span>
                      <span className="text-zinc-400 font-mono">~0.01% / 100%</span>
                    </div>
                    <div className="w-full bg-black border border-white/5 rounded-full h-3">
                      <div className="bg-emerald-500 h-3 rounded-full" style={{ width: '2%' }}></div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/5 flex justify-between text-xs text-zinc-500">
                      <span>Status: <span className="text-emerald-500 font-bold">Optimal</span></span>
                      <span>Extremely Low Load</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 col-span-2 mt-2">
                  <h4 className="text-zinc-400 font-medium mb-4">Node Runtime Environment</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-black p-4 rounded-xl border border-white/5">
                      <div className="text-xs text-zinc-500 mb-1">Node Version</div>
                      <div className="text-sm font-mono text-white">v22.x</div>
                    </div>
                    <div className="bg-black p-4 rounded-xl border border-white/5">
                      <div className="text-xs text-zinc-500 mb-1">Process Uptime</div>
                      <div className="text-sm font-mono text-white">4d 12h 33m</div>
                    </div>
                    <div className="bg-black p-4 rounded-xl border border-white/5">
                      <div className="text-xs text-zinc-500 mb-1">Browser Engine</div>
                      <div className="text-sm font-mono text-emerald-400">Playwright (Chromium)</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
              {activeTab === 'health' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-white text-lg font-medium">System Health & Railway Metrics</h3>
                <span className="text-[10px] text-zinc-500 border border-white/10 px-3 py-1 rounded-full bg-black uppercase tracking-wider font-bold">dice_autoapply_dashboard</span>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6">
                  <h4 className="text-zinc-400 font-medium mb-6">Memory (RAM) Usage</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white font-medium">Used</span>
                      <span className="text-zinc-400 font-mono">75.4 MB / 512.0 MB</span>
                    </div>
                    <div className="w-full bg-black border border-white/5 rounded-full h-3">
                      <div className="bg-indigo-500 h-3 rounded-full" style={{ width: '15%' }}></div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/5 flex justify-between text-xs text-zinc-500">
                      <span>Status: <span className="text-emerald-500 font-bold">Healthy</span></span>
                      <span>15% Load</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6">
                  <h4 className="text-zinc-400 font-medium mb-6">CPU Compute Load</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white font-medium">Load</span>
                      <span className="text-zinc-400 font-mono">~0.01% / 100%</span>
                    </div>
                    <div className="w-full bg-black border border-white/5 rounded-full h-3">
                      <div className="bg-emerald-500 h-3 rounded-full" style={{ width: '2%' }}></div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/5 flex justify-between text-xs text-zinc-500">
                      <span>Status: <span className="text-emerald-500 font-bold">Optimal</span></span>
                      <span>Extremely Low Load</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 col-span-2 mt-2">
                  <h4 className="text-zinc-400 font-medium mb-4">Node Runtime Environment</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-black p-4 rounded-xl border border-white/5">
                      <div className="text-xs text-zinc-500 mb-1">Node Version</div>
                      <div className="text-sm font-mono text-white">v22.x</div>
                    </div>
                    <div className="bg-black p-4 rounded-xl border border-white/5">
                      <div className="text-xs text-zinc-500 mb-1">Process Uptime</div>
                      <div className="text-sm font-mono text-white">4d 12h 33m</div>
                    </div>
                    <div className="bg-black p-4 rounded-xl border border-white/5">
                      <div className="text-xs text-zinc-500 mb-1">Browser Engine</div>
                      <div className="text-sm font-mono text-emerald-400">Playwright (Chromium)</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
          )}

          {activeTab === 'workers' && (
            <div>
              <h3 className="text-white text-lg font-medium mb-6">Apply Workers & Queue Status</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6">
                  <h4 className="text-zinc-400 font-medium mb-4">Active Workers</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-black rounded-xl border border-white/5">
                      <div className="flex items-center space-x-3"><div className="w-2 h-2 rounded-full bg-emerald-500"></div><span className="text-sm text-white font-mono">worker-01</span></div>
                      <span className="text-xs uppercase font-bold tracking-wide bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded border border-emerald-500/20">Idle</span>
                      {activeTab === 'health' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-white text-lg font-medium">System Health & Railway Metrics</h3>
                <span className="text-[10px] text-zinc-500 border border-white/10 px-3 py-1 rounded-full bg-black uppercase tracking-wider font-bold">dice_autoapply_dashboard</span>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6">
                  <h4 className="text-zinc-400 font-medium mb-6">Memory (RAM) Usage</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white font-medium">Used</span>
                      <span className="text-zinc-400 font-mono">75.4 MB / 512.0 MB</span>
                    </div>
                    <div className="w-full bg-black border border-white/5 rounded-full h-3">
                      <div className="bg-indigo-500 h-3 rounded-full" style={{ width: '15%' }}></div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/5 flex justify-between text-xs text-zinc-500">
                      <span>Status: <span className="text-emerald-500 font-bold">Healthy</span></span>
                      <span>15% Load</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6">
                  <h4 className="text-zinc-400 font-medium mb-6">CPU Compute Load</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white font-medium">Load</span>
                      <span className="text-zinc-400 font-mono">~0.01% / 100%</span>
                    </div>
                    <div className="w-full bg-black border border-white/5 rounded-full h-3">
                      <div className="bg-emerald-500 h-3 rounded-full" style={{ width: '2%' }}></div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/5 flex justify-between text-xs text-zinc-500">
                      <span>Status: <span className="text-emerald-500 font-bold">Optimal</span></span>
                      <span>Extremely Low Load</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 col-span-2 mt-2">
                  <h4 className="text-zinc-400 font-medium mb-4">Node Runtime Environment</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-black p-4 rounded-xl border border-white/5">
                      <div className="text-xs text-zinc-500 mb-1">Node Version</div>
                      <div className="text-sm font-mono text-white">v22.x</div>
                    </div>
                    <div className="bg-black p-4 rounded-xl border border-white/5">
                      <div className="text-xs text-zinc-500 mb-1">Process Uptime</div>
                      <div className="text-sm font-mono text-white">4d 12h 33m</div>
                    </div>
                    <div className="bg-black p-4 rounded-xl border border-white/5">
                      <div className="text-xs text-zinc-500 mb-1">Browser Engine</div>
                      <div className="text-sm font-mono text-emerald-400">Playwright (Chromium)</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
                    <div className="flex justify-between items-center p-3 bg-black rounded-xl border border-white/5">
                      <div className="flex items-center space-x-3"><div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div><span className="text-sm text-white font-mono">worker-02</span></div>
                      <span className="text-xs uppercase font-bold tracking-wide bg-blue-500/10 text-blue-400 px-2.5 py-1 rounded border border-blue-500/20">Processing</span>
                      {activeTab === 'health' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-white text-lg font-medium">System Health & Railway Metrics</h3>
                <span className="text-[10px] text-zinc-500 border border-white/10 px-3 py-1 rounded-full bg-black uppercase tracking-wider font-bold">dice_autoapply_dashboard</span>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6">
                  <h4 className="text-zinc-400 font-medium mb-6">Memory (RAM) Usage</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white font-medium">Used</span>
                      <span className="text-zinc-400 font-mono">75.4 MB / 512.0 MB</span>
                    </div>
                    <div className="w-full bg-black border border-white/5 rounded-full h-3">
                      <div className="bg-indigo-500 h-3 rounded-full" style={{ width: '15%' }}></div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/5 flex justify-between text-xs text-zinc-500">
                      <span>Status: <span className="text-emerald-500 font-bold">Healthy</span></span>
                      <span>15% Load</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6">
                  <h4 className="text-zinc-400 font-medium mb-6">CPU Compute Load</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white font-medium">Load</span>
                      <span className="text-zinc-400 font-mono">~0.01% / 100%</span>
                    </div>
                    <div className="w-full bg-black border border-white/5 rounded-full h-3">
                      <div className="bg-emerald-500 h-3 rounded-full" style={{ width: '2%' }}></div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/5 flex justify-between text-xs text-zinc-500">
                      <span>Status: <span className="text-emerald-500 font-bold">Optimal</span></span>
                      <span>Extremely Low Load</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 col-span-2 mt-2">
                  <h4 className="text-zinc-400 font-medium mb-4">Node Runtime Environment</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-black p-4 rounded-xl border border-white/5">
                      <div className="text-xs text-zinc-500 mb-1">Node Version</div>
                      <div className="text-sm font-mono text-white">v22.x</div>
                    </div>
                    <div className="bg-black p-4 rounded-xl border border-white/5">
                      <div className="text-xs text-zinc-500 mb-1">Process Uptime</div>
                      <div className="text-sm font-mono text-white">4d 12h 33m</div>
                    </div>
                    <div className="bg-black p-4 rounded-xl border border-white/5">
                      <div className="text-xs text-zinc-500 mb-1">Browser Engine</div>
                      <div className="text-sm font-mono text-emerald-400">Playwright (Chromium)</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
                    {activeTab === 'health' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-white text-lg font-medium">System Health & Railway Metrics</h3>
                <span className="text-[10px] text-zinc-500 border border-white/10 px-3 py-1 rounded-full bg-black uppercase tracking-wider font-bold">dice_autoapply_dashboard</span>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6">
                  <h4 className="text-zinc-400 font-medium mb-6">Memory (RAM) Usage</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white font-medium">Used</span>
                      <span className="text-zinc-400 font-mono">75.4 MB / 512.0 MB</span>
                    </div>
                    <div className="w-full bg-black border border-white/5 rounded-full h-3">
                      <div className="bg-indigo-500 h-3 rounded-full" style={{ width: '15%' }}></div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/5 flex justify-between text-xs text-zinc-500">
                      <span>Status: <span className="text-emerald-500 font-bold">Healthy</span></span>
                      <span>15% Load</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6">
                  <h4 className="text-zinc-400 font-medium mb-6">CPU Compute Load</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white font-medium">Load</span>
                      <span className="text-zinc-400 font-mono">~0.01% / 100%</span>
                    </div>
                    <div className="w-full bg-black border border-white/5 rounded-full h-3">
                      <div className="bg-emerald-500 h-3 rounded-full" style={{ width: '2%' }}></div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/5 flex justify-between text-xs text-zinc-500">
                      <span>Status: <span className="text-emerald-500 font-bold">Optimal</span></span>
                      <span>Extremely Low Load</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 col-span-2 mt-2">
                  <h4 className="text-zinc-400 font-medium mb-4">Node Runtime Environment</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-black p-4 rounded-xl border border-white/5">
                      <div className="text-xs text-zinc-500 mb-1">Node Version</div>
                      <div className="text-sm font-mono text-white">v22.x</div>
                    </div>
                    <div className="bg-black p-4 rounded-xl border border-white/5">
                      <div className="text-xs text-zinc-500 mb-1">Process Uptime</div>
                      <div className="text-sm font-mono text-white">4d 12h 33m</div>
                    </div>
                    <div className="bg-black p-4 rounded-xl border border-white/5">
                      <div className="text-xs text-zinc-500 mb-1">Browser Engine</div>
                      <div className="text-sm font-mono text-emerald-400">Playwright (Chromium)</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
                  {activeTab === 'health' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-white text-lg font-medium">System Health & Railway Metrics</h3>
                <span className="text-[10px] text-zinc-500 border border-white/10 px-3 py-1 rounded-full bg-black uppercase tracking-wider font-bold">dice_autoapply_dashboard</span>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6">
                  <h4 className="text-zinc-400 font-medium mb-6">Memory (RAM) Usage</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white font-medium">Used</span>
                      <span className="text-zinc-400 font-mono">75.4 MB / 512.0 MB</span>
                    </div>
                    <div className="w-full bg-black border border-white/5 rounded-full h-3">
                      <div className="bg-indigo-500 h-3 rounded-full" style={{ width: '15%' }}></div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/5 flex justify-between text-xs text-zinc-500">
                      <span>Status: <span className="text-emerald-500 font-bold">Healthy</span></span>
                      <span>15% Load</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6">
                  <h4 className="text-zinc-400 font-medium mb-6">CPU Compute Load</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white font-medium">Load</span>
                      <span className="text-zinc-400 font-mono">~0.01% / 100%</span>
                    </div>
                    <div className="w-full bg-black border border-white/5 rounded-full h-3">
                      <div className="bg-emerald-500 h-3 rounded-full" style={{ width: '2%' }}></div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/5 flex justify-between text-xs text-zinc-500">
                      <span>Status: <span className="text-emerald-500 font-bold">Optimal</span></span>
                      <span>Extremely Low Load</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 col-span-2 mt-2">
                  <h4 className="text-zinc-400 font-medium mb-4">Node Runtime Environment</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-black p-4 rounded-xl border border-white/5">
                      <div className="text-xs text-zinc-500 mb-1">Node Version</div>
                      <div className="text-sm font-mono text-white">v22.x</div>
                    </div>
                    <div className="bg-black p-4 rounded-xl border border-white/5">
                      <div className="text-xs text-zinc-500 mb-1">Process Uptime</div>
                      <div className="text-sm font-mono text-white">4d 12h 33m</div>
                    </div>
                    <div className="bg-black p-4 rounded-xl border border-white/5">
                      <div className="text-xs text-zinc-500 mb-1">Browser Engine</div>
                      <div className="text-sm font-mono text-emerald-400">Playwright (Chromium)</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6">
                  <h4 className="text-zinc-400 font-medium mb-4">Jobs Queued for Playwright</h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-black rounded-xl border border-white/5">
                      <div className="text-sm text-white font-medium mb-1">John Doe - Frontend Dev at TechCorp</div>
                      <div className="text-xs text-zinc-500">Queued 2 minutes ago • Attempt 1</div>
                      {activeTab === 'health' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-white text-lg font-medium">System Health & Railway Metrics</h3>
                <span className="text-[10px] text-zinc-500 border border-white/10 px-3 py-1 rounded-full bg-black uppercase tracking-wider font-bold">dice_autoapply_dashboard</span>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6">
                  <h4 className="text-zinc-400 font-medium mb-6">Memory (RAM) Usage</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white font-medium">Used</span>
                      <span className="text-zinc-400 font-mono">75.4 MB / 512.0 MB</span>
                    </div>
                    <div className="w-full bg-black border border-white/5 rounded-full h-3">
                      <div className="bg-indigo-500 h-3 rounded-full" style={{ width: '15%' }}></div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/5 flex justify-between text-xs text-zinc-500">
                      <span>Status: <span className="text-emerald-500 font-bold">Healthy</span></span>
                      <span>15% Load</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6">
                  <h4 className="text-zinc-400 font-medium mb-6">CPU Compute Load</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white font-medium">Load</span>
                      <span className="text-zinc-400 font-mono">~0.01% / 100%</span>
                    </div>
                    <div className="w-full bg-black border border-white/5 rounded-full h-3">
                      <div className="bg-emerald-500 h-3 rounded-full" style={{ width: '2%' }}></div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/5 flex justify-between text-xs text-zinc-500">
                      <span>Status: <span className="text-emerald-500 font-bold">Optimal</span></span>
                      <span>Extremely Low Load</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 col-span-2 mt-2">
                  <h4 className="text-zinc-400 font-medium mb-4">Node Runtime Environment</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-black p-4 rounded-xl border border-white/5">
                      <div className="text-xs text-zinc-500 mb-1">Node Version</div>
                      <div className="text-sm font-mono text-white">v22.x</div>
                    </div>
                    <div className="bg-black p-4 rounded-xl border border-white/5">
                      <div className="text-xs text-zinc-500 mb-1">Process Uptime</div>
                      <div className="text-sm font-mono text-white">4d 12h 33m</div>
                    </div>
                    <div className="bg-black p-4 rounded-xl border border-white/5">
                      <div className="text-xs text-zinc-500 mb-1">Browser Engine</div>
                      <div className="text-sm font-mono text-emerald-400">Playwright (Chromium)</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
                    <div className="p-3 bg-black rounded-xl border border-white/5">
                      <div className="text-sm text-white font-medium mb-1">Jane Smith - Data Scientist at AI Labs</div>
                      <div className="text-xs text-zinc-500">Queued 5 minutes ago • Attempt 2</div>
                      {activeTab === 'health' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-white text-lg font-medium">System Health & Railway Metrics</h3>
                <span className="text-[10px] text-zinc-500 border border-white/10 px-3 py-1 rounded-full bg-black uppercase tracking-wider font-bold">dice_autoapply_dashboard</span>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6">
                  <h4 className="text-zinc-400 font-medium mb-6">Memory (RAM) Usage</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white font-medium">Used</span>
                      <span className="text-zinc-400 font-mono">75.4 MB / 512.0 MB</span>
                    </div>
                    <div className="w-full bg-black border border-white/5 rounded-full h-3">
                      <div className="bg-indigo-500 h-3 rounded-full" style={{ width: '15%' }}></div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/5 flex justify-between text-xs text-zinc-500">
                      <span>Status: <span className="text-emerald-500 font-bold">Healthy</span></span>
                      <span>15% Load</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6">
                  <h4 className="text-zinc-400 font-medium mb-6">CPU Compute Load</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white font-medium">Load</span>
                      <span className="text-zinc-400 font-mono">~0.01% / 100%</span>
                    </div>
                    <div className="w-full bg-black border border-white/5 rounded-full h-3">
                      <div className="bg-emerald-500 h-3 rounded-full" style={{ width: '2%' }}></div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/5 flex justify-between text-xs text-zinc-500">
                      <span>Status: <span className="text-emerald-500 font-bold">Optimal</span></span>
                      <span>Extremely Low Load</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 col-span-2 mt-2">
                  <h4 className="text-zinc-400 font-medium mb-4">Node Runtime Environment</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-black p-4 rounded-xl border border-white/5">
                      <div className="text-xs text-zinc-500 mb-1">Node Version</div>
                      <div className="text-sm font-mono text-white">v22.x</div>
                    </div>
                    <div className="bg-black p-4 rounded-xl border border-white/5">
                      <div className="text-xs text-zinc-500 mb-1">Process Uptime</div>
                      <div className="text-sm font-mono text-white">4d 12h 33m</div>
                    </div>
                    <div className="bg-black p-4 rounded-xl border border-white/5">
                      <div className="text-xs text-zinc-500 mb-1">Browser Engine</div>
                      <div className="text-sm font-mono text-emerald-400">Playwright (Chromium)</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
                    {activeTab === 'health' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-white text-lg font-medium">System Health & Railway Metrics</h3>
                <span className="text-[10px] text-zinc-500 border border-white/10 px-3 py-1 rounded-full bg-black uppercase tracking-wider font-bold">dice_autoapply_dashboard</span>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6">
                  <h4 className="text-zinc-400 font-medium mb-6">Memory (RAM) Usage</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white font-medium">Used</span>
                      <span className="text-zinc-400 font-mono">75.4 MB / 512.0 MB</span>
                    </div>
                    <div className="w-full bg-black border border-white/5 rounded-full h-3">
                      <div className="bg-indigo-500 h-3 rounded-full" style={{ width: '15%' }}></div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/5 flex justify-between text-xs text-zinc-500">
                      <span>Status: <span className="text-emerald-500 font-bold">Healthy</span></span>
                      <span>15% Load</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6">
                  <h4 className="text-zinc-400 font-medium mb-6">CPU Compute Load</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white font-medium">Load</span>
                      <span className="text-zinc-400 font-mono">~0.01% / 100%</span>
                    </div>
                    <div className="w-full bg-black border border-white/5 rounded-full h-3">
                      <div className="bg-emerald-500 h-3 rounded-full" style={{ width: '2%' }}></div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/5 flex justify-between text-xs text-zinc-500">
                      <span>Status: <span className="text-emerald-500 font-bold">Optimal</span></span>
                      <span>Extremely Low Load</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 col-span-2 mt-2">
                  <h4 className="text-zinc-400 font-medium mb-4">Node Runtime Environment</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-black p-4 rounded-xl border border-white/5">
                      <div className="text-xs text-zinc-500 mb-1">Node Version</div>
                      <div className="text-sm font-mono text-white">v22.x</div>
                    </div>
                    <div className="bg-black p-4 rounded-xl border border-white/5">
                      <div className="text-xs text-zinc-500 mb-1">Process Uptime</div>
                      <div className="text-sm font-mono text-white">4d 12h 33m</div>
                    </div>
                    <div className="bg-black p-4 rounded-xl border border-white/5">
                      <div className="text-xs text-zinc-500 mb-1">Browser Engine</div>
                      <div className="text-sm font-mono text-emerald-400">Playwright (Chromium)</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
                  {activeTab === 'health' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-white text-lg font-medium">System Health & Railway Metrics</h3>
                <span className="text-[10px] text-zinc-500 border border-white/10 px-3 py-1 rounded-full bg-black uppercase tracking-wider font-bold">dice_autoapply_dashboard</span>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6">
                  <h4 className="text-zinc-400 font-medium mb-6">Memory (RAM) Usage</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white font-medium">Used</span>
                      <span className="text-zinc-400 font-mono">75.4 MB / 512.0 MB</span>
                    </div>
                    <div className="w-full bg-black border border-white/5 rounded-full h-3">
                      <div className="bg-indigo-500 h-3 rounded-full" style={{ width: '15%' }}></div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/5 flex justify-between text-xs text-zinc-500">
                      <span>Status: <span className="text-emerald-500 font-bold">Healthy</span></span>
                      <span>15% Load</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6">
                  <h4 className="text-zinc-400 font-medium mb-6">CPU Compute Load</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white font-medium">Load</span>
                      <span className="text-zinc-400 font-mono">~0.01% / 100%</span>
                    </div>
                    <div className="w-full bg-black border border-white/5 rounded-full h-3">
                      <div className="bg-emerald-500 h-3 rounded-full" style={{ width: '2%' }}></div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/5 flex justify-between text-xs text-zinc-500">
                      <span>Status: <span className="text-emerald-500 font-bold">Optimal</span></span>
                      <span>Extremely Low Load</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 col-span-2 mt-2">
                  <h4 className="text-zinc-400 font-medium mb-4">Node Runtime Environment</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-black p-4 rounded-xl border border-white/5">
                      <div className="text-xs text-zinc-500 mb-1">Node Version</div>
                      <div className="text-sm font-mono text-white">v22.x</div>
                    </div>
                    <div className="bg-black p-4 rounded-xl border border-white/5">
                      <div className="text-xs text-zinc-500 mb-1">Process Uptime</div>
                      <div className="text-sm font-mono text-white">4d 12h 33m</div>
                    </div>
                    <div className="bg-black p-4 rounded-xl border border-white/5">
                      <div className="text-xs text-zinc-500 mb-1">Browser Engine</div>
                      <div className="text-sm font-mono text-emerald-400">Playwright (Chromium)</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
                {activeTab === 'health' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-white text-lg font-medium">System Health & Railway Metrics</h3>
                <span className="text-[10px] text-zinc-500 border border-white/10 px-3 py-1 rounded-full bg-black uppercase tracking-wider font-bold">dice_autoapply_dashboard</span>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6">
                  <h4 className="text-zinc-400 font-medium mb-6">Memory (RAM) Usage</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white font-medium">Used</span>
                      <span className="text-zinc-400 font-mono">75.4 MB / 512.0 MB</span>
                    </div>
                    <div className="w-full bg-black border border-white/5 rounded-full h-3">
                      <div className="bg-indigo-500 h-3 rounded-full" style={{ width: '15%' }}></div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/5 flex justify-between text-xs text-zinc-500">
                      <span>Status: <span className="text-emerald-500 font-bold">Healthy</span></span>
                      <span>15% Load</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6">
                  <h4 className="text-zinc-400 font-medium mb-6">CPU Compute Load</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white font-medium">Load</span>
                      <span className="text-zinc-400 font-mono">~0.01% / 100%</span>
                    </div>
                    <div className="w-full bg-black border border-white/5 rounded-full h-3">
                      <div className="bg-emerald-500 h-3 rounded-full" style={{ width: '2%' }}></div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/5 flex justify-between text-xs text-zinc-500">
                      <span>Status: <span className="text-emerald-500 font-bold">Optimal</span></span>
                      <span>Extremely Low Load</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 col-span-2 mt-2">
                  <h4 className="text-zinc-400 font-medium mb-4">Node Runtime Environment</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-black p-4 rounded-xl border border-white/5">
                      <div className="text-xs text-zinc-500 mb-1">Node Version</div>
                      <div className="text-sm font-mono text-white">v22.x</div>
                    </div>
                    <div className="bg-black p-4 rounded-xl border border-white/5">
                      <div className="text-xs text-zinc-500 mb-1">Process Uptime</div>
                      <div className="text-sm font-mono text-white">4d 12h 33m</div>
                    </div>
                    <div className="bg-black p-4 rounded-xl border border-white/5">
                      <div className="text-xs text-zinc-500 mb-1">Browser Engine</div>
                      <div className="text-sm font-mono text-emerald-400">Playwright (Chromium)</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
              {activeTab === 'health' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-white text-lg font-medium">System Health & Railway Metrics</h3>
                <span className="text-[10px] text-zinc-500 border border-white/10 px-3 py-1 rounded-full bg-black uppercase tracking-wider font-bold">dice_autoapply_dashboard</span>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6">
                  <h4 className="text-zinc-400 font-medium mb-6">Memory (RAM) Usage</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white font-medium">Used</span>
                      <span className="text-zinc-400 font-mono">75.4 MB / 512.0 MB</span>
                    </div>
                    <div className="w-full bg-black border border-white/5 rounded-full h-3">
                      <div className="bg-indigo-500 h-3 rounded-full" style={{ width: '15%' }}></div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/5 flex justify-between text-xs text-zinc-500">
                      <span>Status: <span className="text-emerald-500 font-bold">Healthy</span></span>
                      <span>15% Load</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6">
                  <h4 className="text-zinc-400 font-medium mb-6">CPU Compute Load</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white font-medium">Load</span>
                      <span className="text-zinc-400 font-mono">~0.01% / 100%</span>
                    </div>
                    <div className="w-full bg-black border border-white/5 rounded-full h-3">
                      <div className="bg-emerald-500 h-3 rounded-full" style={{ width: '2%' }}></div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/5 flex justify-between text-xs text-zinc-500">
                      <span>Status: <span className="text-emerald-500 font-bold">Optimal</span></span>
                      <span>Extremely Low Load</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 col-span-2 mt-2">
                  <h4 className="text-zinc-400 font-medium mb-4">Node Runtime Environment</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-black p-4 rounded-xl border border-white/5">
                      <div className="text-xs text-zinc-500 mb-1">Node Version</div>
                      <div className="text-sm font-mono text-white">v22.x</div>
                    </div>
                    <div className="bg-black p-4 rounded-xl border border-white/5">
                      <div className="text-xs text-zinc-500 mb-1">Process Uptime</div>
                      <div className="text-sm font-mono text-white">4d 12h 33m</div>
                    </div>
                    <div className="bg-black p-4 rounded-xl border border-white/5">
                      <div className="text-xs text-zinc-500 mb-1">Browser Engine</div>
                      <div className="text-sm font-mono text-emerald-400">Playwright (Chromium)</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
          )}

          {activeTab === 'errors' && (
            <div>
              <h3 className="text-white text-lg font-medium mb-6">Error Diagnostics</h3>
              <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-black text-zinc-500 text-xs uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4 font-medium">Timestamp</th>
                      <th className="px-6 py-4 font-medium">Candidate</th>
                      <th className="px-6 py-4 font-medium">Reason</th>
                      <th className="px-6 py-4 font-medium">Action Needed</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    <tr>
                      <td className="px-6 py-4 text-zinc-400">14:03:01</td>
                      <td className="px-6 py-4 text-white">John Doe</td>
                      <td className="px-6 py-4 text-rose-400">Missing Apply Button (Redirects Externally)</td>
                      <td className="px-6 py-4"><button className="text-xs px-3 py-1 bg-white/10 text-white rounded hover:bg-white/20 transition">View Link</button></td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-zinc-400">12:45:22</td>
                      <td className="px-6 py-4 text-white">Jane Smith</td>
                      <td className="px-6 py-4 text-rose-400">Playwright Timeout (Stuck on CAPTCHA)</td>
                      <td className="px-6 py-4"><button className="text-xs px-3 py-1 bg-white/10 text-white rounded hover:bg-white/20 transition">Retry Job</button></td>
                    </tr>
                  </tbody>
                </table>
                {activeTab === 'health' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-white text-lg font-medium">System Health & Railway Metrics</h3>
                <span className="text-[10px] text-zinc-500 border border-white/10 px-3 py-1 rounded-full bg-black uppercase tracking-wider font-bold">dice_autoapply_dashboard</span>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6">
                  <h4 className="text-zinc-400 font-medium mb-6">Memory (RAM) Usage</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white font-medium">Used</span>
                      <span className="text-zinc-400 font-mono">75.4 MB / 512.0 MB</span>
                    </div>
                    <div className="w-full bg-black border border-white/5 rounded-full h-3">
                      <div className="bg-indigo-500 h-3 rounded-full" style={{ width: '15%' }}></div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/5 flex justify-between text-xs text-zinc-500">
                      <span>Status: <span className="text-emerald-500 font-bold">Healthy</span></span>
                      <span>15% Load</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6">
                  <h4 className="text-zinc-400 font-medium mb-6">CPU Compute Load</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white font-medium">Load</span>
                      <span className="text-zinc-400 font-mono">~0.01% / 100%</span>
                    </div>
                    <div className="w-full bg-black border border-white/5 rounded-full h-3">
                      <div className="bg-emerald-500 h-3 rounded-full" style={{ width: '2%' }}></div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/5 flex justify-between text-xs text-zinc-500">
                      <span>Status: <span className="text-emerald-500 font-bold">Optimal</span></span>
                      <span>Extremely Low Load</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 col-span-2 mt-2">
                  <h4 className="text-zinc-400 font-medium mb-4">Node Runtime Environment</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-black p-4 rounded-xl border border-white/5">
                      <div className="text-xs text-zinc-500 mb-1">Node Version</div>
                      <div className="text-sm font-mono text-white">v22.x</div>
                    </div>
                    <div className="bg-black p-4 rounded-xl border border-white/5">
                      <div className="text-xs text-zinc-500 mb-1">Process Uptime</div>
                      <div className="text-sm font-mono text-white">4d 12h 33m</div>
                    </div>
                    <div className="bg-black p-4 rounded-xl border border-white/5">
                      <div className="text-xs text-zinc-500 mb-1">Browser Engine</div>
                      <div className="text-sm font-mono text-emerald-400">Playwright (Chromium)</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
              {activeTab === 'health' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-white text-lg font-medium">System Health & Railway Metrics</h3>
                <span className="text-[10px] text-zinc-500 border border-white/10 px-3 py-1 rounded-full bg-black uppercase tracking-wider font-bold">dice_autoapply_dashboard</span>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6">
                  <h4 className="text-zinc-400 font-medium mb-6">Memory (RAM) Usage</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white font-medium">Used</span>
                      <span className="text-zinc-400 font-mono">75.4 MB / 512.0 MB</span>
                    </div>
                    <div className="w-full bg-black border border-white/5 rounded-full h-3">
                      <div className="bg-indigo-500 h-3 rounded-full" style={{ width: '15%' }}></div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/5 flex justify-between text-xs text-zinc-500">
                      <span>Status: <span className="text-emerald-500 font-bold">Healthy</span></span>
                      <span>15% Load</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6">
                  <h4 className="text-zinc-400 font-medium mb-6">CPU Compute Load</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white font-medium">Load</span>
                      <span className="text-zinc-400 font-mono">~0.01% / 100%</span>
                    </div>
                    <div className="w-full bg-black border border-white/5 rounded-full h-3">
                      <div className="bg-emerald-500 h-3 rounded-full" style={{ width: '2%' }}></div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/5 flex justify-between text-xs text-zinc-500">
                      <span>Status: <span className="text-emerald-500 font-bold">Optimal</span></span>
                      <span>Extremely Low Load</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 col-span-2 mt-2">
                  <h4 className="text-zinc-400 font-medium mb-4">Node Runtime Environment</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-black p-4 rounded-xl border border-white/5">
                      <div className="text-xs text-zinc-500 mb-1">Node Version</div>
                      <div className="text-sm font-mono text-white">v22.x</div>
                    </div>
                    <div className="bg-black p-4 rounded-xl border border-white/5">
                      <div className="text-xs text-zinc-500 mb-1">Process Uptime</div>
                      <div className="text-sm font-mono text-white">4d 12h 33m</div>
                    </div>
                    <div className="bg-black p-4 rounded-xl border border-white/5">
                      <div className="text-xs text-zinc-500 mb-1">Browser Engine</div>
                      <div className="text-sm font-mono text-emerald-400">Playwright (Chromium)</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
          )}

          {activeTab === 'users' && (
            <div>
              <h3 className="text-white text-lg font-medium mb-6">Telegram Users & Workflows</h3>
              <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-black text-zinc-500 text-xs uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4 font-medium">Candidate</th>
                      <th className="px-6 py-4 font-medium">Telegram Status</th>
                      <th className="px-6 py-4 font-medium">9-Hour Session</th>
                      <th className="px-6 py-4 font-medium">Recent Activity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    <tr>
                      <td className="px-6 py-4 text-white font-medium">John Doe</td>
                      <td className="px-6 py-4"><span className="text-emerald-400 text-xs flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Connected</span></td>
                      <td className="px-6 py-4 text-zinc-300">Active (4h 12m remaining)</td>
                      <td className="px-6 py-4 text-zinc-400">Approved job 2 mins ago</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-white font-medium">Mike Ross</td>
                      <td className="px-6 py-4"><span className="text-emerald-400 text-xs flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Connected</span></td>
                      <td className="px-6 py-4 text-rose-400">Expired</td>
                      <td className="px-6 py-4 text-zinc-400">Missed 3 consecutive prompts</td>
                    </tr>
                  </tbody>
                </table>
                {activeTab === 'health' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-white text-lg font-medium">System Health & Railway Metrics</h3>
                <span className="text-[10px] text-zinc-500 border border-white/10 px-3 py-1 rounded-full bg-black uppercase tracking-wider font-bold">dice_autoapply_dashboard</span>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6">
                  <h4 className="text-zinc-400 font-medium mb-6">Memory (RAM) Usage</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white font-medium">Used</span>
                      <span className="text-zinc-400 font-mono">75.4 MB / 512.0 MB</span>
                    </div>
                    <div className="w-full bg-black border border-white/5 rounded-full h-3">
                      <div className="bg-indigo-500 h-3 rounded-full" style={{ width: '15%' }}></div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/5 flex justify-between text-xs text-zinc-500">
                      <span>Status: <span className="text-emerald-500 font-bold">Healthy</span></span>
                      <span>15% Load</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6">
                  <h4 className="text-zinc-400 font-medium mb-6">CPU Compute Load</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white font-medium">Load</span>
                      <span className="text-zinc-400 font-mono">~0.01% / 100%</span>
                    </div>
                    <div className="w-full bg-black border border-white/5 rounded-full h-3">
                      <div className="bg-emerald-500 h-3 rounded-full" style={{ width: '2%' }}></div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/5 flex justify-between text-xs text-zinc-500">
                      <span>Status: <span className="text-emerald-500 font-bold">Optimal</span></span>
                      <span>Extremely Low Load</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 col-span-2 mt-2">
                  <h4 className="text-zinc-400 font-medium mb-4">Node Runtime Environment</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-black p-4 rounded-xl border border-white/5">
                      <div className="text-xs text-zinc-500 mb-1">Node Version</div>
                      <div className="text-sm font-mono text-white">v22.x</div>
                    </div>
                    <div className="bg-black p-4 rounded-xl border border-white/5">
                      <div className="text-xs text-zinc-500 mb-1">Process Uptime</div>
                      <div className="text-sm font-mono text-white">4d 12h 33m</div>
                    </div>
                    <div className="bg-black p-4 rounded-xl border border-white/5">
                      <div className="text-xs text-zinc-500 mb-1">Browser Engine</div>
                      <div className="text-sm font-mono text-emerald-400">Playwright (Chromium)</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
              {activeTab === 'health' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-white text-lg font-medium">System Health & Railway Metrics</h3>
                <span className="text-[10px] text-zinc-500 border border-white/10 px-3 py-1 rounded-full bg-black uppercase tracking-wider font-bold">dice_autoapply_dashboard</span>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6">
                  <h4 className="text-zinc-400 font-medium mb-6">Memory (RAM) Usage</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white font-medium">Used</span>
                      <span className="text-zinc-400 font-mono">75.4 MB / 512.0 MB</span>
                    </div>
                    <div className="w-full bg-black border border-white/5 rounded-full h-3">
                      <div className="bg-indigo-500 h-3 rounded-full" style={{ width: '15%' }}></div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/5 flex justify-between text-xs text-zinc-500">
                      <span>Status: <span className="text-emerald-500 font-bold">Healthy</span></span>
                      <span>15% Load</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6">
                  <h4 className="text-zinc-400 font-medium mb-6">CPU Compute Load</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white font-medium">Load</span>
                      <span className="text-zinc-400 font-mono">~0.01% / 100%</span>
                    </div>
                    <div className="w-full bg-black border border-white/5 rounded-full h-3">
                      <div className="bg-emerald-500 h-3 rounded-full" style={{ width: '2%' }}></div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/5 flex justify-between text-xs text-zinc-500">
                      <span>Status: <span className="text-emerald-500 font-bold">Optimal</span></span>
                      <span>Extremely Low Load</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 col-span-2 mt-2">
                  <h4 className="text-zinc-400 font-medium mb-4">Node Runtime Environment</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-black p-4 rounded-xl border border-white/5">
                      <div className="text-xs text-zinc-500 mb-1">Node Version</div>
                      <div className="text-sm font-mono text-white">v22.x</div>
                    </div>
                    <div className="bg-black p-4 rounded-xl border border-white/5">
                      <div className="text-xs text-zinc-500 mb-1">Process Uptime</div>
                      <div className="text-sm font-mono text-white">4d 12h 33m</div>
                    </div>
                    <div className="bg-black p-4 rounded-xl border border-white/5">
                      <div className="text-xs text-zinc-500 mb-1">Browser Engine</div>
                      <div className="text-sm font-mono text-emerald-400">Playwright (Chromium)</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
          )}

          {activeTab === 'health' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-white text-lg font-medium">System Health & Railway Metrics</h3>
                <span className="text-[10px] text-zinc-500 border border-white/10 px-3 py-1 rounded-full bg-black uppercase tracking-wider font-bold">dice_autoapply_dashboard</span>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6">
                  <h4 className="text-zinc-400 font-medium mb-6">Memory (RAM) Usage</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white font-medium">Used</span>
                      <span className="text-zinc-400 font-mono">75.4 MB / 512.0 MB</span>
                    </div>
                    <div className="w-full bg-black border border-white/5 rounded-full h-3">
                      <div className="bg-indigo-500 h-3 rounded-full" style={{ width: '15%' }}></div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/5 flex justify-between text-xs text-zinc-500">
                      <span>Status: <span className="text-emerald-500 font-bold">Healthy</span></span>
                      <span>15% Load</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6">
                  <h4 className="text-zinc-400 font-medium mb-6">CPU Compute Load</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white font-medium">Load</span>
                      <span className="text-zinc-400 font-mono">~0.01% / 100%</span>
                    </div>
                    <div className="w-full bg-black border border-white/5 rounded-full h-3">
                      <div className="bg-emerald-500 h-3 rounded-full" style={{ width: '2%' }}></div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/5 flex justify-between text-xs text-zinc-500">
                      <span>Status: <span className="text-emerald-500 font-bold">Optimal</span></span>
                      <span>Extremely Low Load</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 col-span-2 mt-2">
                  <h4 className="text-zinc-400 font-medium mb-4">Node Runtime Environment</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-black p-4 rounded-xl border border-white/5">
                      <div className="text-xs text-zinc-500 mb-1">Node Version</div>
                      <div className="text-sm font-mono text-white">v22.x</div>
                    </div>
                    <div className="bg-black p-4 rounded-xl border border-white/5">
                      <div className="text-xs text-zinc-500 mb-1">Process Uptime</div>
                      <div className="text-sm font-mono text-white">4d 12h 33m</div>
                    </div>
                    <div className="bg-black p-4 rounded-xl border border-white/5">
                      <div className="text-xs text-zinc-500 mb-1">Browser Engine</div>
                      <div className="text-sm font-mono text-emerald-400">Playwright (Chromium)</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
