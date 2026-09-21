import re

with open('frontend/src/pages/Dashboard.jsx', 'r') as f:
    code = f.read()

# 1. Update the grouped CA badge
old_ca_group_vars = """                  const isExpanded = expandedCA === caName;
                  const connectedCandidates = caCandidates.filter(c => c.telegram_chat_id).length;
                  const totalCandidates = caCandidates.length;"""

new_ca_group_vars = """                  const isExpanded = expandedCA === caName;
                  const connectedCandidates = caCandidates.filter(c => c.telegram_chat_id).length;
                  const activeSessions = caCandidates.filter(c => c.session?.session_deadline && new Date(c.session.session_deadline).getTime() > Date.now()).length;
                  const totalCandidates = caCandidates.length;"""

code = code.replace(old_ca_group_vars, new_ca_group_vars)

old_ca_group_badges = """                          <div className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-sm font-medium rounded-full flex items-center space-x-1.5">
                            <Check size={12} strokeWidth={3} />
                            <span><span className="text-emerald-300 mr-1">{connectedCandidates}</span> Connected</span>
                          </div>
                        </div>"""

new_ca_group_badges = """                          <div className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-sm font-medium rounded-full flex items-center space-x-1.5">
                            <Check size={12} strokeWidth={3} />
                            <span><span className="text-emerald-300 mr-1">{connectedCandidates}</span> Connected</span>
                          </div>
                          <div className="px-3 py-1 bg-blue-500/10 text-blue-400 text-sm font-medium rounded-full flex items-center space-x-1.5">
                            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></div>
                            <span><span className="text-blue-300 mr-1">{activeSessions}</span> Active</span>
                          </div>
                        </div>"""

code = code.replace(old_ca_group_badges, new_ca_group_badges)

# 2. Update the individual CA badge
old_indiv_badges = """                  <div className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-sm font-medium rounded-full flex items-center space-x-1.5">
                    <Check size={12} strokeWidth={3} />
                    <span><span className="text-emerald-300 mr-1">{data?.users?.filter(c => c.telegram_chat_id).length || 0}</span> Connected</span>
                  </div>
                </div>"""

new_indiv_badges = """                  <div className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-sm font-medium rounded-full flex items-center space-x-1.5">
                    <Check size={12} strokeWidth={3} />
                    <span><span className="text-emerald-300 mr-1">{data?.users?.filter(c => c.telegram_chat_id).length || 0}</span> Connected</span>
                  </div>
                  <div className="px-3 py-1 bg-blue-500/10 text-blue-400 text-sm font-medium rounded-full flex items-center space-x-1.5">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></div>
                    <span><span className="text-blue-300 mr-1">{data?.users?.filter(c => c.session?.session_deadline && new Date(c.session.session_deadline).getTime() > Date.now()).length || 0}</span> Active</span>
                  </div>
                </div>"""

code = code.replace(old_indiv_badges, new_indiv_badges)

with open('frontend/src/pages/Dashboard.jsx', 'w') as f:
    f.write(code)

