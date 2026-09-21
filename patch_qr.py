import re

with open('frontend/src/pages/Dashboard.jsx', 'r') as f:
    code = f.read()

old_qr_section = """<div className="w-40 h-40 bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 rounded-xl font-medium">
                  [ QR Code ]
                </div>"""
new_qr_section = '<img src="/BotDice.png" alt="Telegram Bot QR Code" className="w-40 h-40 object-cover rounded-xl" />'
code = code.replace(old_qr_section, new_qr_section)

old_input = 'value="t.me/ApplywizzBot?start=admin"'
new_input = 'value={data?.telegram_bot_url || "t.me/dice_apply_bot"}'
code = code.replace(old_input, new_input)

# Let's also make the copy button actually copy the link
old_btn = '<button className="p-3 bg-white text-black hover:bg-slate-200 rounded-xl transition-colors shadow-sm">\n                    <LinkIcon size={16} />\n                  </button>'
new_btn = """<button 
                    onClick={() => {
                      navigator.clipboard.writeText(data?.telegram_bot_url || "t.me/dice_apply_bot");
                      alert('Link copied to clipboard!');
                    }}
                    className="p-3 bg-white text-black hover:bg-slate-200 rounded-xl transition-colors shadow-sm"
                  >
                    <LinkIcon size={16} />
                  </button>"""
code = code.replace(old_btn, new_btn)

with open('frontend/src/pages/Dashboard.jsx', 'w') as f:
    f.write(code)
