import re

with open('frontend/src/pages/Dashboard.jsx', 'r') as f:
    code = f.read()

# Replace CA Stats Grid with Table
old_ca_stats = """{/* CA Stats Grid (Only if multiple CAs exist) */}
              {(operator?.role === 'admin' || operator?.role === 'manager') && data.ca_stats && data.ca_stats.length > 0 && (
                <div className="mb-12">
                  <h3 className="text-lg font-medium text-white mb-4">CA Performance</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {data.ca_stats.map((ca, idx) => (
                      <div key={idx} className="bg-[#111111] border border-white/5 p-4 rounded-xl flex flex-col justify-between">
                        <div className="mb-3">
                          <h4 className="text-white font-medium truncate">{ca.ca_name || ca.ca_email || 'Unassigned'}</h4>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="bg-white/5 p-2 rounded-lg">
                            <p className="text-xs text-slate-500">Clients</p>
                            <p className="text-white font-medium">{ca.clients_active || 0} / {ca.clients_count || 0}</p>
                          </div>
                          <div className="bg-emerald-500/10 p-2 rounded-lg">
                            <p className="text-xs text-emerald-500/70">Approved</p>
                            <p className="text-emerald-400 font-medium">{ca.approved_count || 0}</p>
                          </div>
                          <div className="bg-red-500/10 p-2 rounded-lg">
                            <p className="text-xs text-red-500/70">Failed</p>
                            <p className="text-red-400 font-medium">{ca.failed_count || 0}</p>
                          </div>
                          <div className="bg-blue-500/10 p-2 rounded-lg">
                            <p className="text-xs text-blue-500/70">Manual</p>
                            <p className="text-blue-400 font-medium">{ca.manual_count || 0}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}"""

new_ca_stats = """{/* CA Stats Grid (Only if multiple CAs exist) */}
              {(operator?.role === 'admin' || operator?.role === 'manager') && data.ca_stats && data.ca_stats.length > 0 && (
                <div className="mb-12 bg-[#111111] border border-white/5 rounded-2xl overflow-hidden shadow-sm">
                  <div className="px-6 py-5 border-b border-white/5">
                    <h3 className="text-lg font-medium text-white">Career Associate Directory</h3>
                  </div>
                  <div className="overflow-x-auto max-h-[600px] overflow-y-auto custom-scrollbar">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                      <thead className="bg-[#0a0a0a] text-slate-500 text-xs uppercase tracking-wider sticky top-0 z-10 shadow-sm">
                        <tr>
                          <th className="px-6 py-4 font-medium">CA Email / ID</th>
                          <th className="px-6 py-4 font-medium">Total Clients</th>
                          <th className="px-6 py-4 font-medium">Active Sessions</th>
                          <th className="px-6 py-4 font-medium">Applied Today</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {data.ca_stats.map((ca, idx) => (
                          <tr key={idx} className="hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4 text-white font-medium">
                              <strong>{ca.ca_name || ca.ca_email || 'Unassigned'}</strong>
                            </td>
                            <td className="px-6 py-4 text-white">
                              {ca.total_clients || 0}
                            </td>
                            <td className="px-6 py-4 text-slate-300">
                              {ca.active_sessions || 0}
                            </td>
                            <td className="px-6 py-4">
                              <span className="px-3 py-1 bg-blue-500/10 text-blue-400 font-medium rounded-full">
                                {ca.applied_today || 0}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}"""

code = code.replace(old_ca_stats, new_ca_stats)

with open('frontend/src/pages/Dashboard.jsx', 'w') as f:
    f.write(code)

