with open('index.js', 'r') as f:
    code = f.read()

code = code.replace("    // Scanner Phase: Dump all new jobs into the preflight queue", "    unhandledUrlFound = jobs.length > 0;\n    // Scanner Phase: Dump all new jobs into the preflight queue")

with open('index.js', 'w') as f:
    f.write(code)
