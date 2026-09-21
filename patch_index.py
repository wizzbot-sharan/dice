import re

with open('frontend/index.html', 'r') as f:
    code = f.read()

# Change favicon
code = code.replace('<link rel="icon" type="image/svg+xml" href="/favicon.svg" />', '<link rel="icon" type="image/jpeg" href="/Applywizz_logo.jpeg" />')

# Change title
code = code.replace('<title>frontend</title>', '<title>Dice Autoapply</title>')

with open('frontend/index.html', 'w') as f:
    f.write(code)

