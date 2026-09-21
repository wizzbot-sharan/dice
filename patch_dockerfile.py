with open('Dockerfile', 'r') as f:
    content = f.read()

# Add RUN npm run build after COPY . .
if 'RUN npm run build' not in content:
    content = content.replace('COPY . .', 'COPY . .\n\nRUN npm run build')

with open('Dockerfile', 'w') as f:
    f.write(content)
