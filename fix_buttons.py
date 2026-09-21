with open('frontend/src/pages/Dashboard.jsx', 'r') as f:
    code = f.read()

# Fix the Dashboard button
old_dash = '<button className="w-full flex items-center space-x-3 px-3 py-2 bg-white/10 text-white rounded-lg font-medium transition-colors border border-white/5">\n            <LayoutDashboard size={16} className="text-indigo-400" />\n            <span>Dashboard</span>\n          </button>'
new_dash = """<button onClick={() => setMainTab('dashboard')} className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg font-medium transition-colors ${mainTab === 'dashboard' ? 'bg-white/10 text-white border border-white/5' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
            <LayoutDashboard size={16} className={mainTab === 'dashboard' ? "text-indigo-400" : "text-slate-500"} />
            <span>Dashboard</span>
          </button>"""
code = code.replace(old_dash, new_dash)

# Fix the Stats button
old_stats = '<button className="w-full flex items-center space-x-3 px-3 py-2 text-slate-400 hover:bg-white/5 hover:text-white rounded-lg font-medium transition-colors">\n            <BarChart2 size={16} className="text-slate-500" />\n            <span>Stats</span>\n          </button>'
new_stats = """<button onClick={() => setMainTab('stats')} className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg font-medium transition-colors ${mainTab === 'stats' ? 'bg-white/10 text-white border border-white/5' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
            <BarChart2 size={16} className={mainTab === 'stats' ? "text-indigo-400" : "text-slate-500"} />
            <span>Stats</span>
          </button>"""
code = code.replace(old_stats, new_stats)

with open('frontend/src/pages/Dashboard.jsx', 'w') as f:
    f.write(code)
