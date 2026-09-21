import re

with open('frontend/src/pages/Dashboard.jsx', 'r') as f:
    code = f.read()

old_vars = """                const isCaExpanded = expandedCAs[caName];
                const totalCandidates = candidates.length;
                const connectedCandidates = candidates.filter(c => c.telegram_chat_id).length;"""

new_vars = """                const isCaExpanded = expandedCAs[caName];
                const totalCandidates = candidates.length;
                const connectedCandidates = candidates.filter(c => c.telegram_chat_id).length;
                const activeSessions = candidates.filter(c => c.session?.session_deadline && new Date(c.session.session_deadline).getTime() > Date.now()).length;"""

code = code.replace(old_vars, new_vars)

with open('frontend/src/pages/Dashboard.jsx', 'w') as f:
    f.write(code)
