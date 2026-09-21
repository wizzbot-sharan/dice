import re

with open('frontend/src/App.jsx', 'r') as f:
    code = f.read()

# Add import
code = code.replace("import DesignPreview from './pages/DesignPreview';", "import DesignPreview from './pages/DesignPreview';\nimport DevPreview from './pages/DevPreview';")

# Add route
code = code.replace('<Route path="/preview" element={<DesignPreview />} />', '<Route path="/preview" element={<DesignPreview />} />\n          <Route path="/dev-preview" element={<DevPreview />} />')

with open('frontend/src/App.jsx', 'w') as f:
    f.write(code)

