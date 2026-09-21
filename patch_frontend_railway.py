import re

with open('frontend/src/pages/DevLogs.jsx', 'r') as f:
    code = f.read()

old_health_block = """{activeTab === 'health' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-white text-lg font-medium">Container OS & System Health</h3>
                <span className="text-[10px] text-zinc-500 border border-white/10 px-3 py-1 rounded-full bg-black uppercase tracking-wider font-bold">Live Server Environment</span>
              </div>
              <div className="grid grid-cols-2 gap-6">
                
                {/* Node JS Memory */}
                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6">
                  <h4 className="text-zinc-400 font-medium mb-6">Process Memory (RSS)</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white font-medium">Used</span>
                      <span className="text-zinc-400 font-mono">{overview?.system?.memory?.rss_mb || '?'} MB / {overview?.system?.memory?.os_total_mb || '?'} MB</span>
                    </div>
                    <div className="w-full bg-black border border-white/5 rounded-full h-3">
                      <div className="bg-indigo-500 h-3 rounded-full" style={{ width: `${Math.min(100, Math.round(((overview?.system?.memory?.rss_mb || 0) / (overview?.system?.memory?.os_total_mb || 1)) * 100))}%` }}></div>
                    </div>
                  </div>
                </div>

                {/* OS Memory */}
                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6">
                  <h4 className="text-zinc-400 font-medium mb-6">Container Memory (OS Load)</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white font-medium">Used</span>
                      <span className="text-zinc-400 font-mono">{overview?.system?.memory?.os_used_mb || '?'} MB / {overview?.system?.memory?.os_total_mb || '?'} MB</span>
                    </div>
                    <div className="w-full bg-black border border-white/5 rounded-full h-3">
                      <div className="bg-emerald-500 h-3 rounded-full" style={{ width: `${Math.min(100, Math.round(((overview?.system?.memory?.os_used_mb || 0) / (overview?.system?.memory?.os_total_mb || 1)) * 100))}%` }}></div>
                    </div>
                  </div>
                </div>

                {/* CPU Load */}
                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 col-span-2">
                  <h4 className="text-zinc-400 font-medium mb-6">CPU Compute Load (1m / 5m / 15m avg)</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white font-medium">Average Load</span>
                      <span className="text-zinc-400 font-mono">{overview?.system?.cpu?.load_avg?.map(n => n.toFixed(2)).join(' / ') || '?'} ({overview?.system?.cpu?.cores || 1} Cores)</span>
                    </div>
                    <div className="w-full bg-black border border-white/5 rounded-full h-3">
                      <div className="bg-blue-500 h-3 rounded-full" style={{ width: `${Math.min(100, (overview?.system?.cpu?.load_avg?.[0] || 0) * 10)}%` }}></div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 col-span-2 mt-2">
                  <h4 className="text-zinc-400 font-medium mb-4">Node Runtime Environment</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-black p-4 rounded-xl border border-white/5">
                      <div className="text-xs text-zinc-500 mb-1">Node Version</div>
                      <div className="text-sm font-mono text-white">{overview?.system?.node_version || 'v22.x'}</div>
                    </div>
                    <div className="bg-black p-4 rounded-xl border border-white/5">
                      <div className="text-xs text-zinc-500 mb-1">Browser Engine</div>
                      <div className="text-sm font-mono text-emerald-400">{overview?.system?.browser_mode || 'Chromium'}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}"""

new_health_block = """{activeTab === 'health' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-white text-lg font-medium">Container OS & System Health</h3>
                <span className="flex gap-2">
                  {overview?.system?.railway && <span className="text-[10px] text-fuchsia-400 border border-fuchsia-500/30 px-3 py-1 rounded-full bg-fuchsia-500/10 uppercase tracking-wider font-bold">Railway API Connected</span>}
                  <span className="text-[10px] text-zinc-500 border border-white/10 px-3 py-1 rounded-full bg-black uppercase tracking-wider font-bold">Live Server Environment</span>
                </span>
              </div>
              <div className="grid grid-cols-2 gap-6">
                
                {/* Node JS Memory */}
                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6">
                  <h4 className="text-zinc-400 font-medium mb-6">Process Memory (RSS)</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white font-medium">Used</span>
                      <span className="text-zinc-400 font-mono">{overview?.system?.memory?.rss_mb || '?'} MB / {overview?.system?.memory?.os_total_mb || '?'} MB</span>
                    </div>
                    <div className="w-full bg-black border border-white/5 rounded-full h-3">
                      <div className="bg-indigo-500 h-3 rounded-full" style={{ width: `${Math.min(100, Math.round(((overview?.system?.memory?.rss_mb || 0) / (overview?.system?.memory?.os_total_mb || 1)) * 100))}%` }}></div>
                    </div>
                  </div>
                </div>

                {/* OS/Railway Memory */}
                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 relative overflow-hidden">
                  {overview?.system?.railway && <div className="absolute top-0 right-0 border-l border-b border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-400 text-[9px] px-2 py-1 font-bold uppercase rounded-bl-lg">Railway</div>}
                  <h4 className="text-zinc-400 font-medium mb-6">Container Memory</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white font-medium">Used</span>
                      <span className="text-zinc-400 font-mono">{overview?.system?.railway ? Math.round(overview.system.railway.mem_mb) : (overview?.system?.memory?.os_used_mb || '?')} MB / {overview?.system?.memory?.os_total_mb || '?'} MB</span>
                    </div>
                    <div className="w-full bg-black border border-white/5 rounded-full h-3">
                      <div className="bg-emerald-500 h-3 rounded-full" style={{ width: `${Math.min(100, Math.round(((overview?.system?.railway?.mem_mb || overview?.system?.memory?.os_used_mb || 0) / (overview?.system?.memory?.os_total_mb || 1)) * 100))}%` }}></div>
                    </div>
                  </div>
                </div>

                {/* CPU Load */}
                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 col-span-2 relative overflow-hidden">
                  {overview?.system?.railway && <div className="absolute top-0 right-0 border-l border-b border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-400 text-[9px] px-2 py-1 font-bold uppercase rounded-bl-lg">Railway</div>}
                  <h4 className="text-zinc-400 font-medium mb-6">{overview?.system?.railway ? 'CPU Compute Load (Railway %)' : 'CPU Compute Load (1m / 5m / 15m avg)'}</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white font-medium">{overview?.system?.railway ? 'Current CPU Usage' : 'Average Load'}</span>
                      <span className="text-zinc-400 font-mono">
                        {overview?.system?.railway 
                          ? `${overview.system.railway.cpu_percent.toFixed(2)}%`
                          : `${overview?.system?.cpu?.load_avg?.map(n => n.toFixed(2)).join(' / ') || '?'} (${overview?.system?.cpu?.cores || 1} Cores)`
                        }
                      </span>
                    </div>
                    <div className="w-full bg-black border border-white/5 rounded-full h-3">
                      <div className="bg-blue-500 h-3 rounded-full" style={{ 
                        width: overview?.system?.railway 
                          ? `${Math.min(100, overview.system.railway.cpu_percent)}%`
                          : `${Math.min(100, (overview?.system?.cpu?.load_avg?.[0] || 0) * 10)}%` 
                      }}></div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 col-span-2 mt-2">
                  <h4 className="text-zinc-400 font-medium mb-4">Node Runtime Environment</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-black p-4 rounded-xl border border-white/5">
                      <div className="text-xs text-zinc-500 mb-1">Node Version</div>
                      <div className="text-sm font-mono text-white">{overview?.system?.node_version || 'v22.x'}</div>
                    </div>
                    <div className="bg-black p-4 rounded-xl border border-white/5">
                      <div className="text-xs text-zinc-500 mb-1">Browser Engine</div>
                      <div className="text-sm font-mono text-emerald-400">{overview?.system?.browser_mode || 'Chromium'}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}"""

if "Container OS & System Health" in code:
    code = code.replace(old_health_block, new_health_block)
    with open('frontend/src/pages/DevLogs.jsx', 'w') as f:
        f.write(code)
    print("Frontend patched.")

