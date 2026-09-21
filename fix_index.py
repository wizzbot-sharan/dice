with open('index.js', 'r') as f:
    code = f.read()

code = code.replace("let promptText = 'New Job Passed Pre-Flight:\n';", "let promptText = 'New Job Passed Pre-Flight:\\n';")
code = code.replace("promptText += `Link: ${url}\n\nDo you want to apply?`;", "promptText += `Link: ${url}\\n\\nDo you want to apply?`;")

with open('index.js', 'w') as f:
    f.write(code)
