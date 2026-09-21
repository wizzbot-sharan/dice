import re

with open('frontend/src/pages/DevLogs.jsx', 'r') as f:
    code = f.read()

old_workers_block_start = "{activeTab === 'workers' && ("
old_workers_block_end = "          {activeTab === 'errors' && ("

old_workers_block = code[code.find(old_workers_block_start):code.find(old_workers_block_end)]

new_workers_block = """{activeTab === 'workers' && (
            <div className="h-full flex flex-col">
              <h3 className="text-white text-lg font-medium mb-6 shrink-0">Apply Workers & Queue Status {selectedCandidate !== 'ALL' ? '(Filtered)' : ''}</h3>
              
              {/* TOP: Active Workers (Horizontal Scroll) */}
              <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 mb-6 shrink-0">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-zinc-400 font-medium">Active Worker Processes</h4>
                  <span className="text-xs font-mono text-zinc-500">{overview?.stats?.queue_running || 0} Online</span>
                </div>
                
                <div className="flex space-x-4 overflow-x-auto custom-scrollbar pb-2">
                  {(!filteredQueue || filteredQueue.filter(q => q.status === 'running').length === 0) ? (
                    <div className="text-zinc-500 text-sm italic">No workers currently processing jobs. Queue is idle.</div>
                  ) : (
                    filteredQueue.filter(q => q.status === 'running').map(q => (
                      <div key={q.id} className="min-w-[250px] bg-black border border-white/5 p-4 rounded-xl flex-shrink-0">
                        <div className="flex justify-between items-center mb-3">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                            <span className="text-sm text-white font-mono">{q.worker_id || `worker-${q.id.substring(0,6)}`}</span>
                          </div>
                          <span className="text-[10px] uppercase font-bold tracking-wide bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20">Busy</span>
                        </div>
                        <div className="text-xs text-zinc-400 truncate">Processing: <span className="text-white">{q.full_name || q.client_id}</span></div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* BOTTOM: Queue (Fills remaining space) */}
              <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 flex-1 flex flex-col min-h-0">
                <div className="flex justify-between items-center mb-4 shrink-0">
                  <h4 className="text-zinc-400 font-medium">Jobs Queued for Playwright</h4>
                  <span className="text-xs font-mono text-zinc-500">{filteredQueue.length} Total Jobs</span>
                </div>
                
                <div className="space-y-3 overflow-y-auto custom-scrollbar flex-1 pr-2">
                  {filteredQueue.length === 0 ? (
                    <div className="text-zinc-500 text-sm italic">Queue is empty.</div>
                  ) : (
                    filteredQueue.map(q => (
                      <div key={q.id} className="p-4 bg-black rounded-xl border border-white/5 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                        <div className="min-w-0 flex-1">
                           <div className="text-sm text-white font-medium mb-1">{q.full_name || q.client_id}</div>
                           <div className="text-xs text-zinc-400 truncate" title={q.url}>{q.url}</div>
                           {q.last_error && <div className="mt-2 text-xs text-rose-300 italic truncate" title={q.last_error}>{q.last_error}</div>}
                        </div>
                        
                        <div className="flex flex-col items-end shrink-0">
                           <div className="text-xs text-zinc-500 mb-2">Attempt {q.attempts}/{q.max_attempts}</div>
                           <div className={`text-[10px] px-2.5 py-1 inline-block rounded font-bold uppercase tracking-wider ${
                             q.status === 'failed' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 
                             q.status === 'running' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                             q.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                             'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20'
                           }`}>
                             {q.status}
                           </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

"""

code = code.replace(old_workers_block, new_workers_block)

with open('frontend/src/pages/DevLogs.jsx', 'w') as f:
    f.write(code)

