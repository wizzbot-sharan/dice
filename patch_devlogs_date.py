import re

with open('frontend/src/pages/DevLogs.jsx', 'r') as f:
    code = f.read()

# 1. Add selectedDate state
code = code.replace(
    "const [selectedCandidate, setSelectedCandidate] = useState('ALL');",
    "const [selectedCandidate, setSelectedCandidate] = useState('ALL');\n  const [selectedDate, setSelectedDate] = useState(new Date().toLocaleDateString('en-CA'));"
)

# 2. Update fetching logic to include date parameter
old_fetch = """    fetch('/api/dev/overview')
      .then(res => res.json())
      .then(data => setOverview(data))
      .catch(err => console.error('Failed to fetch dev overview:', err));
      
    fetch('/api/dashboard')
      .then(res => res.json())
      .then(data => setDashData(data))
      .catch(err => console.error('Failed to fetch dashboard data:', err));"""

new_fetch = """    const tzName = Intl.DateTimeFormat().resolvedOptions().timeZone;
    fetch(`/api/dev/overview?date=${selectedDate}`)
      .then(res => res.json())
      .then(data => setOverview(data))
      .catch(err => console.error('Failed to fetch dev overview:', err));
      
    fetch(`/api/dashboard?date=${selectedDate}&timezone=browser&timezone_name=${encodeURIComponent(tzName)}`)
      .then(res => res.json())
      .then(data => setDashData(data))
      .catch(err => console.error('Failed to fetch dashboard data:', err));"""

# Note: The dependency array of useEffect needs `selectedDate`.
code = code.replace(old_fetch, new_fetch)
code = code.replace("}, [operator, loading]);", "}, [operator, loading, selectedDate]);")

# 3. Add Date Picker in the Header next to the Dropdowns
old_header_filters = """          <div className="flex space-x-3">
            <select value={selectedCA}"""

new_header_filters = """          <div className="flex space-x-3 items-center">
            <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="bg-black border border-white/10 text-white text-sm rounded-lg px-4 py-1.5 outline-none focus:border-white/20 transition-colors" />
            <select value={selectedCA}"""

code = code.replace(old_header_filters, new_header_filters)

# 4. Make sure CA dropdown uses `ca.name` correctly, it currently does:
# `uniqueCAs = ... overview?.active_users?.map(u => u.ca_name)`
# I want to change it to overview?.ca_accounts?.map
old_uniqueCAs = "const uniqueCAs = useMemo(() => Array.from(new Set(overview?.active_users?.map(u => u.ca_name || 'Unassigned'))).filter(Boolean), [overview]);"
new_uniqueCAs = "const uniqueCAs = useMemo(() => Array.from(new Set((overview?.ca_accounts || []).map(ca => ca.name))).filter(Boolean), [overview]);"
code = code.replace(old_uniqueCAs, new_uniqueCAs)

# Write back
with open('frontend/src/pages/DevLogs.jsx', 'w') as f:
    f.write(code)

