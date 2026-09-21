import re

with open('frontend/src/pages/Dashboard.jsx', 'r') as f:
    code = f.read()

# Let's replace the whole block by finding the wrapper
pattern = r'<div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-sm shrink-0">\s*AW\s*</div>\s*<span className="font-semibold text-white tracking-wide truncate">AutoEasyApply</span>'

new_logo = """<img src="/Applywizz logo.jpeg" alt="Applywizz Logo" className="w-8 h-8 rounded-lg object-cover shadow-sm shrink-0" />
            <span className="font-semibold text-white tracking-wide truncate">DICE AutoEasyApply</span>"""

code = re.sub(pattern, new_logo, code)

with open('frontend/src/pages/Dashboard.jsx', 'w') as f:
    f.write(code)
