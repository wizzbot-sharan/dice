import re

with open('frontend/src/pages/DevLogs.jsx', 'r') as f:
    code = f.read()

# 1. Add sidebarWidth state
code = code.replace("const [logSearch, setLogSearch] = useState('');", "const [logSearch, setLogSearch] = useState('');\n  const [sidebarWidth, setSidebarWidth] = useState(256);\n  const isResizing = useRef(false);\n\n  const startResizing = React.useCallback(() => {\n    isResizing.current = true;\n    document.body.style.cursor = 'col-resize';\n    document.body.style.userSelect = 'none';\n  }, []);\n\n  const stopResizing = React.useCallback(() => {\n    isResizing.current = false;\n    document.body.style.cursor = 'default';\n    document.body.style.userSelect = '';\n  }, []);\n\n  const resize = React.useCallback((mouseMoveEvent) => {\n    if (isResizing.current) {\n      const newWidth = mouseMoveEvent.clientX;\n      if (newWidth >= 150 && newWidth <= 600) {\n        setSidebarWidth(newWidth);\n      }\n    }\n  }, []);\n\n  useEffect(() => {\n    window.addEventListener('mousemove', resize);\n    window.addEventListener('mouseup', stopResizing);\n    return () => {\n      window.removeEventListener('mousemove', resize);\n      window.removeEventListener('mouseup', stopResizing);\n    };\n  }, [resize, stopResizing]);")

# 2. Replace the sidebar div to use sidebarWidth and add the resize handle
old_sidebar = """<div className="w-64 bg-[#0a0a0a] border-r border-white/5 p-4 flex flex-col gap-2 shrink-0">"""
new_sidebar = """<div className="bg-[#0a0a0a] border-r border-white/5 flex shrink-0 relative group" style={{ width: sidebarWidth }}>
          <div className="p-4 flex flex-col gap-2 w-full h-full overflow-hidden">"""

code = code.replace(old_sidebar, new_sidebar)

# 3. Add the resizer bar at the end of the sidebar div
# We need to find the end of the sidebar div which is right before `<div className="flex-1 bg-black p-6`
resizer = """          </div>
          {/* Draggable Handle */}
          <div 
            className="absolute top-0 right-0 w-1.5 h-full cursor-col-resize hover:bg-white/10 active:bg-white/20 transition-colors z-10"
            onMouseDown={startResizing}
          />
        </div>"""

code = code.replace("""        </div>\n\n        <div className="flex-1 bg-black p-6""", resizer + "\n\n        <div className=\"flex-1 bg-black p-6")

with open('frontend/src/pages/DevLogs.jsx', 'w') as f:
    f.write(code)

