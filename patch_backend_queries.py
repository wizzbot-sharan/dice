import re

with open('lib/dashboard-server.js', 'r') as f:
    code = f.read()

# Update active_users query for Managers
old_manager_users_query = """            select distinct ds.telegram_chat_id, c.id as client_id, c.full_name, c.company_email, c.applywizz_id
            from dice_sessions ds
            join clients_additional_info c on c.id = ds.client_id
            join dice_ca_accounts ca on (ca.id::text = c.career_associate_id::text or lower(ca.email) = lower(c.career_associate_id::text))
            where ds.telegram_chat_id is not null and ca.manager_id = $1
            order by c.full_name asc nulls last"""

new_manager_users_query = """            select distinct ds.telegram_chat_id, c.id as client_id, c.full_name, c.company_email, c.applywizz_id,
                   ca.name as ca_name, ws.session_deadline,
                   (select count(*)::int from dice_workflow_audit_logs al where al.telegram_chat_id = ds.telegram_chat_id and al.event_type = 'job_no') as no_count
            from dice_sessions ds
            join clients_additional_info c on c.id = ds.client_id
            join dice_ca_accounts ca on (ca.id::text = c.career_associate_id::text or lower(ca.email) = lower(c.career_associate_id::text))
            left join dice_workflow_sessions ws on ws.telegram_chat_id = ds.telegram_chat_id
            where ds.telegram_chat_id is not null and ca.manager_id = $1
            order by c.full_name asc nulls last"""

code = code.replace(old_manager_users_query, new_manager_users_query)

# Update active_users query for Admins
old_admin_users_query = """            select distinct ds.telegram_chat_id, c.id as client_id, c.full_name, c.company_email, c.applywizz_id
            from dice_sessions ds
            left join clients_additional_info c on c.id = ds.client_id
            where ds.telegram_chat_id is not null
            order by c.full_name asc nulls last"""

new_admin_users_query = """            select distinct ds.telegram_chat_id, c.id as client_id, c.full_name, c.company_email, c.applywizz_id,
                   ca.name as ca_name, ws.session_deadline,
                   (select count(*)::int from dice_workflow_audit_logs al where al.telegram_chat_id = ds.telegram_chat_id and al.event_type = 'job_no') as no_count
            from dice_sessions ds
            left join clients_additional_info c on c.id = ds.client_id
            left join dice_ca_accounts ca on (ca.id::text = c.career_associate_id::text or lower(ca.email) = lower(c.career_associate_id::text))
            left join dice_workflow_sessions ws on ws.telegram_chat_id = ds.telegram_chat_id
            where ds.telegram_chat_id is not null
            order by c.full_name asc nulls last"""

code = code.replace(old_admin_users_query, new_admin_users_query)

# Add OS metrics to `const system = {`
old_system_block = """    const mem = process.memoryUsage();
    const system = {
      uptime_seconds: Math.floor(process.uptime()),
      node_version: process.version,
      memory: {
        rss_mb: Math.round(mem.rss / 1024 / 1024),
        heap_used_mb: Math.round(mem.heapUsed / 1024 / 1024),
        heap_total_mb: Math.round(mem.heapTotal / 1024 / 1024),
      },
      browser_mode: process.env.USE_BROWSERBASE === 'true' ? 'Browserbase Cloud' : 'Local Chromium (Playwright)',
      max_concurrency: Number(process.env.BROWSERBASE_MAX_CONCURRENT || 20),
    };"""

new_system_block = """    const os = require('os');
    const mem = process.memoryUsage();
    const totalOsMem = os.totalmem();
    const freeOsMem = os.freemem();
    const system = {
      uptime_seconds: Math.floor(process.uptime()),
      node_version: process.version,
      memory: {
        rss_mb: Math.round(mem.rss / 1024 / 1024),
        heap_used_mb: Math.round(mem.heapUsed / 1024 / 1024),
        heap_total_mb: Math.round(mem.heapTotal / 1024 / 1024),
        os_total_mb: Math.round(totalOsMem / 1024 / 1024),
        os_used_mb: Math.round((totalOsMem - freeOsMem) / 1024 / 1024),
      },
      cpu: {
        load_avg: os.loadavg(),
        cores: os.cpus().length,
      },
      browser_mode: process.env.USE_BROWSERBASE === 'true' ? 'Browserbase Cloud' : 'Local Chromium (Playwright)',
      max_concurrency: Number(process.env.BROWSERBASE_MAX_CONCURRENT || 20),
    };"""

code = code.replace(old_system_block, new_system_block)

with open('lib/dashboard-server.js', 'w') as f:
    f.write(code)

