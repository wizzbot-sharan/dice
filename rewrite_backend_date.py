import re

with open('lib/dashboard-server.js', 'r') as f:
    code = f.read()

# Define the boundaries of readDevOverview
start = "async function readDevOverview(requestUrl, response, db, operator) {"
end = "    sendJson(response, 500, { ok: false, error: err.message });\n  }\n}"

# Find the exact string to replace
old_func = code[code.find(start):code.find(end) + len(end)]

new_func = """async function readDevOverview(requestUrl, response, db, operator) {
  try {
    const chatIdParam = requestUrl.searchParams.get('chatId');
    const chatId = (chatIdParam && !Number.isNaN(Number(chatIdParam))) ? Number(chatIdParam) : null;
    const isManager = Boolean(operator && operator.role === 'manager');
    const managerId = operator.operator_id || operator.id;

    // Date filter parsing
    const dateParam = requestUrl.searchParams.get('date');
    let dateFilterCreated = "";
    let dateFilterApplied = "";
    let dateFilterStatsApplied = "a.applied_at >= current_date";
    if (dateParam && /^\\d{4}-\\d{2}-\\d{2}$/.test(dateParam)) {
      dateFilterCreated = ` and date(created_at) = '${dateParam}'`;
      dateFilterApplied = ` and date(applied_at) = '${dateParam}'`;
      dateFilterStatsApplied = `date(a.applied_at) = '${dateParam}'`;
    }

    const [
      queueRes,
      sessionsRes,
      auditRes,
      appliedRes,
      statsRes,
      casRes,
      unknownQRes,
      usersRes,
    ] = await Promise.all([
      isManager
        ? db.query(`
            select q.id, q.client_id, q.telegram_chat_id, q.job_id, q.url, q.status,
                   q.worker_id, q.attempts, q.max_attempts, q.last_error,
                   q.available_at, q.locked_at, q.started_at, q.finished_at, q.created_at,
                   c.full_name, c.company_email, c.applywizz_id
            from dice_apply_queue q
            join clients_additional_info c on c.id = q.client_id
            join dice_ca_accounts ca on (ca.id::text = c.career_associate_id::text or lower(ca.email) = lower(c.career_associate_id::text))
            where ca.manager_id = $1 ${dateFilterCreated.replace('created_at', 'q.created_at')}
            order by q.created_at desc
            limit 150
          `, [managerId])
        : db.query(`
            select q.id, q.client_id, q.telegram_chat_id, q.job_id, q.url, q.status,
                   q.worker_id, q.attempts, q.max_attempts, q.last_error,
                   q.available_at, q.locked_at, q.started_at, q.finished_at, q.created_at,
                   c.full_name, c.company_email, c.applywizz_id
            from dice_apply_queue q
            left join clients_additional_info c on c.id = q.client_id
            where 1=1 ${dateFilterCreated.replace('created_at', 'q.created_at')}
            order by q.created_at desc
            limit 150
          `),
      isManager
        ? db.query(`
            select s.telegram_chat_id, s.session_started_at, s.session_deadline, s.consecutive_no_count,
                   s.next_scan_at, s.last_decision, s.last_decision_at, s.current_prompt_url,
                   s.current_prompt_sent_at, s.current_prompt_expires_at, s.newday_requested_at,
                   c.id as client_id, c.full_name, c.company_email, c.applywizz_id,
                   c.career_associate_id, ca.name as ca_name
            from dice_workflow_sessions s
            join dice_sessions ds on ds.telegram_chat_id = s.telegram_chat_id
            join clients_additional_info c on c.id = ds.client_id
            join dice_ca_accounts ca on (ca.id::text = c.career_associate_id::text or lower(ca.email) = lower(c.career_associate_id::text))
            where ca.manager_id = $1
            order by s.session_started_at desc nulls last
          `, [managerId])
        : db.query(`
            select s.telegram_chat_id, s.session_started_at, s.session_deadline, s.consecutive_no_count,
                   s.next_scan_at, s.last_decision, s.last_decision_at, s.current_prompt_url,
                   s.current_prompt_sent_at, s.current_prompt_expires_at, s.newday_requested_at,
                   c.id as client_id, c.full_name, c.company_email, c.applywizz_id,
                   c.career_associate_id, ca.name as ca_name
            from dice_workflow_sessions s
            left join dice_sessions ds on ds.telegram_chat_id = s.telegram_chat_id
            left join clients_additional_info c on c.id = ds.client_id
            left join dice_ca_accounts ca on ca.id = c.career_associate_id
            order by s.session_started_at desc nulls last
          `),
      isManager
        ? db.query(`
            select a.id, a.telegram_chat_id, a.event_type as event, a.event_details as details, a.created_at,
                   c.full_name
            from dice_workflow_audit_logs a
            join clients_additional_info c on c.telegram_chat_id = a.telegram_chat_id
            join dice_ca_accounts ca on (ca.id::text = c.career_associate_id::text or lower(ca.email) = lower(c.career_associate_id::text))
            where ca.manager_id = $1 ${dateFilterCreated.replace('created_at', 'a.created_at')}
            order by a.id desc
            limit 500
          `, [managerId])
        : db.query(`
            select a.id, a.telegram_chat_id, a.event_type as event, a.event_details as details, a.created_at,
                   c.full_name
            from dice_workflow_audit_logs a
            left join clients_additional_info c on c.telegram_chat_id = a.telegram_chat_id
            where 1=1 ${dateFilterCreated.replace('created_at', 'a.created_at')}
            order by a.id desc
            limit 500
          `),
      isManager
        ? db.query(`
            select a.id, a.client_id, a.job_url, a.status, a.status_details, a.applied_at,
                   c.full_name as client_name
            from dice_applied_jobs a
            join clients_additional_info c on c.id = a.client_id
            join dice_ca_accounts ca on (ca.id::text = c.career_associate_id::text or lower(ca.email) = lower(c.career_associate_id::text))
            where ca.manager_id = $1 ${dateFilterApplied.replace('applied_at', 'a.applied_at')}
            order by a.applied_at desc
            limit 500
          `, [managerId])
        : db.query(`
            select a.id, a.client_id, a.job_url, a.status, a.status_details, a.applied_at,
                   c.full_name as client_name
            from dice_applied_jobs a
            left join clients_additional_info c on c.id = a.client_id
            where 1=1 ${dateFilterApplied.replace('applied_at', 'a.applied_at')}
            order by a.applied_at desc
            limit 500
          `),
      isManager
        ? db.query(`
            select
              (select count(distinct c.id)::int from clients_additional_info c join dice_ca_accounts ca on (ca.id::text = c.career_associate_id::text or lower(ca.email) = lower(c.career_associate_id::text)) where ca.manager_id = $1) as total_candidates,
              (select count(distinct ds.client_id)::int from dice_sessions ds join clients_additional_info c on c.id = ds.client_id join dice_ca_accounts ca on (ca.id::text = c.career_associate_id::text or lower(ca.email) = lower(c.career_associate_id::text)) where ca.manager_id = $1) as linked_candidates,
              (select count(distinct s.telegram_chat_id)::int from dice_workflow_sessions s join dice_sessions ds on ds.telegram_chat_id = s.telegram_chat_id join clients_additional_info c on c.id = ds.client_id join dice_ca_accounts ca on (ca.id::text = c.career_associate_id::text or lower(ca.email) = lower(c.career_associate_id::text)) where s.session_deadline > now() and ca.manager_id = $1) as active_sessions,
              (select count(distinct a.id)::int from dice_applied_jobs a join clients_additional_info c on c.id = a.client_id join dice_ca_accounts ca on (ca.id::text = c.career_associate_id::text or lower(ca.email) = lower(c.career_associate_id::text)) where ${dateFilterStatsApplied} and ca.manager_id = $1) as applied_today,
              (select count(distinct a.id)::int from dice_applied_jobs a join clients_additional_info c on c.id = a.client_id join dice_ca_accounts ca on (ca.id::text = c.career_associate_id::text or lower(ca.email) = lower(c.career_associate_id::text)) where a.status in ('failed', 'external_or_failed') and ca.manager_id = $1 ${dateFilterApplied.replace('applied_at', 'a.applied_at')}) as total_failures,
              (select count(distinct q.id)::int from dice_apply_queue q join clients_additional_info c on c.id = q.client_id join dice_ca_accounts ca on (ca.id::text = c.career_associate_id::text or lower(ca.email) = lower(c.career_associate_id::text)) where q.status = 'queued' and ca.manager_id = $1 ${dateFilterCreated.replace('created_at', 'q.created_at')}) as queue_queued,
              (select count(distinct q.id)::int from dice_apply_queue q join clients_additional_info c on c.id = q.client_id join dice_ca_accounts ca on (ca.id::text = c.career_associate_id::text or lower(ca.email) = lower(c.career_associate_id::text)) where q.status = 'running' and ca.manager_id = $1 ${dateFilterCreated.replace('created_at', 'q.created_at')}) as queue_running,
              (select count(distinct q.id)::int from dice_apply_queue q join clients_additional_info c on c.id = q.client_id join dice_ca_accounts ca on (ca.id::text = c.career_associate_id::text or lower(ca.email) = lower(c.career_associate_id::text)) where q.status = 'failed' and ca.manager_id = $1 ${dateFilterCreated.replace('created_at', 'q.created_at')}) as queue_failed
          `, [managerId])
        : db.query(`
            select
              (select count(*)::int from clients_additional_info) as total_candidates,
              (select count(*)::int from dice_sessions) as linked_candidates,
              (select count(*)::int from dice_workflow_sessions where session_deadline > now()) as active_sessions,
              (select count(*)::int from dice_applied_jobs a where ${dateFilterStatsApplied}) as applied_today,
              (select count(*)::int from dice_applied_jobs a where a.status in ('failed', 'external_or_failed') ${dateFilterApplied.replace('applied_at', 'a.applied_at')}) as total_failures,
              (select count(*)::int from dice_apply_queue q where q.status = 'queued' ${dateFilterCreated.replace('created_at', 'q.created_at')}) as queue_queued,
              (select count(*)::int from dice_apply_queue q where q.status = 'running' ${dateFilterCreated.replace('created_at', 'q.created_at')}) as queue_running,
              (select count(*)::int from dice_apply_queue q where q.status = 'failed' ${dateFilterCreated.replace('created_at', 'q.created_at')}) as queue_failed
          `),
      isManager
        ? db.query(`
            select id, email, name, role, disabled, created_at
            from dice_ca_accounts
            where manager_id = $1
            order by role asc, name asc
          `, [managerId])
        : db.query(`
            select id, email, name, role, disabled, created_at
            from dice_ca_accounts
            order by role asc, name asc
          `),
      isManager
        ? db.query(`
            select q.id, q.client_id, q.question_text, q.question_type, q.options, q.answer, q.source, q.created_at,
                   c.full_name, c.company_email
            from dice_unknown_questions q
            join clients_additional_info c on c.id = q.client_id
            join dice_ca_accounts ca on (ca.id::text = c.career_associate_id::text or lower(ca.email) = lower(c.career_associate_id::text))
            where ca.manager_id = $1 ${dateFilterCreated.replace('created_at', 'q.created_at')}
            order by q.created_at desc
            limit 100
          `, [managerId]).catch(() => ({ rows: [] }))
        : db.query(`
            select q.id, q.client_id, q.question_text, q.question_type, q.options, q.answer, q.source, q.created_at,
                   c.full_name, c.company_email
            from dice_unknown_questions q
            left join clients_additional_info c on c.id = q.client_id
            where 1=1 ${dateFilterCreated.replace('created_at', 'q.created_at')}
            order by q.created_at desc
            limit 100
          `).catch(() => ({ rows: [] })),
      isManager
        ? db.query(`
            select distinct ds.telegram_chat_id, c.id as client_id, c.full_name, c.company_email, c.applywizz_id,
                   ca.name as ca_name, ws.session_deadline,
                   (select count(*)::int from dice_workflow_audit_logs al where al.telegram_chat_id = ds.telegram_chat_id and al.event_type = 'job_no' ${dateFilterCreated.replace('created_at', 'al.created_at')}) as no_count
            from dice_sessions ds
            join clients_additional_info c on c.id = ds.client_id
            join dice_ca_accounts ca on (ca.id::text = c.career_associate_id::text or lower(ca.email) = lower(c.career_associate_id::text))
            left join dice_workflow_sessions ws on ws.telegram_chat_id = ds.telegram_chat_id
            where ds.telegram_chat_id is not null and ca.manager_id = $1
            order by c.full_name asc nulls last
          `, [managerId]).catch(() => ({ rows: [] }))
        : db.query(`
            select distinct ds.telegram_chat_id, c.id as client_id, c.full_name, c.company_email, c.applywizz_id,
                   ca.name as ca_name, ws.session_deadline,
                   (select count(*)::int from dice_workflow_audit_logs al where al.telegram_chat_id = ds.telegram_chat_id and al.event_type = 'job_no' ${dateFilterCreated.replace('created_at', 'al.created_at')}) as no_count
            from dice_sessions ds
            left join clients_additional_info c on c.id = ds.client_id
            left join dice_ca_accounts ca on (ca.id::text = c.career_associate_id::text or lower(ca.email) = lower(c.career_associate_id::text))
            left join dice_workflow_sessions ws on ws.telegram_chat_id = ds.telegram_chat_id
            where ds.telegram_chat_id is not null
            order by c.full_name asc nulls last
          `).catch(() => ({ rows: [] })),
    ]);

    const os = require('os');
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
    };

    sendJson(response, 200, {
      ok: true,
      operator: {
        id: operator.operator_id || operator.id,
        email: operator.email,
        name: operator.name,
        role: operator.role,
      },
      stats: statsRes.rows[0] || {},
      system,
      queue: queueRes.rows || [],
      sessions: sessionsRes.rows || [],
      audit_logs: auditRes.rows || [],
      applied_jobs: appliedRes.rows || [],
      ca_accounts: casRes.rows || [],
      unknown_questions: unknownQRes?.rows || [],
      active_users: usersRes?.rows || [],
      selected_chat_id: chatId,
    });
  } catch (err) {
    console.error('[dev-dashboard] overview failed:', err.message);
    sendJson(response, 500, { ok: false, error: err.message });
  }
}"""

if old_func in code:
    code = code.replace(old_func, new_func)
    with open('lib/dashboard-server.js', 'w') as f:
        f.write(code)
    print("Patched successfully!")
else:
    print("Could not find old function. Check start and end strings.")

