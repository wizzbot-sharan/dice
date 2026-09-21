import re

with open('frontend/src/pages/Dashboard.jsx', 'r') as f:
    code = f.read()

old_logo_html = """<div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center font-bold text-white shadow-sm">
              AW
            </div>
            <span className="font-semibold text-white tracking-wide truncate">AutoEasyApply</span>"""

new_logo_html = """<img src="/Applywizz logo.jpeg" alt="Applywizz Logo" className="w-8 h-8 rounded-lg object-cover shadow-sm" />
            <span className="font-semibold text-white tracking-wide truncate">DICE AutoEasyApply</span>"""

code = code.replace(old_logo_html, new_logo_html)

with open('frontend/src/pages/Dashboard.jsx', 'w') as f:
    f.write(code)
