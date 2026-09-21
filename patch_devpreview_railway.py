import re

with open('frontend/src/pages/DevPreview.jsx', 'r') as f:
    code = f.read()

# Add the new button to the sidebar
sidebar_btn = """          <button 
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
          </button>"""
code = code.replace("""          <button 
            onClick={() => setActiveTab('users')}
            className={`w-full text-left px-4 py-3 rounded-xl transition-all text-sm font-medium ${activeTab === 'users' ? 'bg-white text-black shadow-sm' : 'text-zinc-400 hover:bg-white/5 hover:text-white'}`}
          >
            Telegram Users
          </button>""", sidebar_btn)

# Add the content for the 'health' tab
health_content = """          {activeTab === 'health' && (
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

        </div>"""
code = code.replace("        </div>", health_content)

with open('frontend/src/pages/DevPreview.jsx', 'w') as f:
    f.write(code)

