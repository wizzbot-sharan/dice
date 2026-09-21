import re

with open('frontend/src/pages/Dashboard.jsx', 'r') as f:
    code = f.read()

# Replace specific hex colors
code = code.replace('bg-[#141414]', 'bg-[#000000]')
code = code.replace('bg-[#1a1a1a]', 'bg-[#111111]')
code = code.replace('bg-[#0a0a0a]', 'bg-[#000000]') # Some headers were #0a0a0a
code = code.replace('bg-[#111111]', 'bg-[#0a0a0a]') # Main elements to dark gray
code = code.replace('bg-[#000000]', 'bg-black')

# tone down borders
code = code.replace('border-white/10', 'border-white/5')
code = code.replace('hover:border-white/20', 'hover:border-white/10')

# Indigo specific cleanup
code = code.replace('bg-indigo-500/10 text-indigo-400 border-indigo-500/20', 'bg-white/10 text-white border-white/10')
code = code.replace('bg-indigo-500/20 text-indigo-400', 'bg-white/10 text-white')
code = code.replace('text-indigo-400', 'text-white')
code = code.replace('text-indigo-300', 'text-zinc-300')
code = code.replace('bg-indigo-900/10', 'bg-zinc-900/30')
code = code.replace('border-indigo-500/20', 'border-white/5')
code = code.replace('bg-indigo-500/10', 'bg-white/5')

# The text-indigo-400/70 and text-indigo-400 font-light (for "Remaining" session)
code = code.replace('text-indigo-400/70', 'text-zinc-500')
code = code.replace('text-indigo-400 font-light', 'text-white font-light')

# Replace text-slate with text-zinc just for a cleaner cool-gray tone (optional, but looks better for monochrome)
code = code.replace('text-slate-', 'text-zinc-')

with open('frontend/src/pages/Dashboard.jsx', 'w') as f:
    f.write(code)
