import re

with open('frontend/src/pages/DevPreview.jsx', 'r') as f:
    code = f.read()

code = code.replace("const { operator } = useAuth();", "const operator = { role: 'admin' }; // Mocked for preview")
code = code.replace("if (!operator || (operator.role !== 'admin' && operator.role !== 'manager')) {\n    return <Navigate to=\"/\" />;\n  }", "")
code = code.replace("import { useAuth } from '../context/AuthContext';", "")
code = code.replace("import { Navigate } from 'react-router-dom';", "")

with open('frontend/src/pages/DevPreview.jsx', 'w') as f:
    f.write(code)

