import re

with open('lib/dashboard-server.js', 'r') as f:
    code = f.read()

# Add getRailwayMetrics helper
helper = """
async function getRailwayMetrics() {
  const token = process.env.RAILWAY_API_TOKEN;
  const projectId = process.env.RAILWAY_PROJECT_ID;
  const envId = process.env.RAILWAY_ENVIRONMENT_ID;
  const serviceId = process.env.RAILWAY_SERVICE_ID;
  
  if (!token || !projectId || !envId || !serviceId) return null;
  
  const query = `
    query($projectId: String!, $environmentId: String!, $serviceId: String!, $startDate: DateTime!, $endDate: DateTime!) {
      metrics(projectId: $projectId, environmentId: $environmentId, serviceId: $serviceId, startDate: $startDate, endDate: $endDate, measurements: [CPU_USAGE, MEMORY_USAGE_GB]) {
        name
        values {
          timestamp
          value
        }
      }
    }
  `;
  
  const start = new Date(Date.now() - 15 * 60 * 1000).toISOString();
  const end = new Date().toISOString();
  
  try {
    const res = await fetch('https://backboard.railway.app/graphql/v2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        query,
        variables: { projectId, environmentId: envId, serviceId, startDate: start, endDate: end }
      })
    });
    const json = await res.json();
    if (json.data && json.data.metrics) {
      const cpuData = json.data.metrics.find(m => m.name === 'CPU_USAGE')?.values || [];
      const memData = json.data.metrics.find(m => m.name === 'MEMORY_USAGE_GB')?.values || [];
      
      const cpuCurrent = cpuData.length ? cpuData[cpuData.length - 1].value : 0;
      const memCurrentGb = memData.length ? memData[memData.length - 1].value : 0;
      
      return {
        cpu_percent: cpuCurrent * 100,
        mem_mb: memCurrentGb * 1024,
      };
    }
    return null;
  } catch (err) {
    console.error('Railway metrics error:', err.message);
    return null;
  }
}
"""

if "async function getRailwayMetrics" not in code:
    code = code.replace("async function readDevOverview", helper + "\nasync function readDevOverview")

# Update system block in readDevOverview
old_sys = """    const mem = process.memoryUsage();
    const totalOsMem = os.totalmem();
    const freeOsMem = os.freemem();
    const system = {"""

new_sys = """    const railwayMetrics = await getRailwayMetrics();
    const mem = process.memoryUsage();
    const totalOsMem = os.totalmem();
    const freeOsMem = os.freemem();
    const system = {
      railway: railwayMetrics,"""

if "railway: railwayMetrics" not in code:
    code = code.replace(old_sys, new_sys)

with open('lib/dashboard-server.js', 'w') as f:
    f.write(code)

