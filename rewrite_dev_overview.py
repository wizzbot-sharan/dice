import re

with open('lib/dashboard-server.js', 'r') as f:
    code = f.read()

start_idx = code.find("async function readDevOverview(requestUrl, response, db, operator) {")
if start_idx == -1:
    print("Could not find readDevOverview")
    exit(1)

brace_count = 0
in_func = False
end_idx = -1
for i in range(start_idx, len(code)):
    if code[i] == '{':
        brace_count += 1
        in_func = True
    elif code[i] == '}':
        brace_count -= 1
        if in_func and brace_count == 0:
            end_idx = i + 1
            break

new_read_dev = r"""async function readDevOverview(requestUrl, response, db, operator) {
  const date = requestUrl.searchParams.get('date');
  const timezone = requestUrl.searchParams.get('timezone') || 'UTC';
  
  const hasManagerFilter = operator && operator.role === 'manager';
  const hasOperatorFilter = operator && operator.role === 'operator';
  const operatorId = operator ? operator.operator_id : null;

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date || '')) return sendJson(response, 400, { error: 'date must be YYYY-MM-DD.' });

  const timezoneName = timezone === 'browser'
    ? requestUrl.searchParams.get('timezone_name')
    : DASHBOARD_TIMEZONES[timezone];
  if (!timezoneName || !isSupportedTimezone(timezoneName)) {
    return sendJson(response, 400, { error: 'A valid browser timezone is required.' });
  }

  const zone = timezoneName;
  const bounds = await db.query(
    `select ($1::date::timestamp at time zone $2) as start_at,
            (($1::date + interval '1 day')::timestamp at time zone $2) as end_at`,
    [date, zone]
  );
  const { start_at: startAt, end_at: endAt } = bounds.rows[0];

  const [
    audits,
    applications,
    queue,
    stats,
  ] = await Promise.all([
    hasManagerFilter
      ? db.query(`
          select a.id, a.telegram_chat_id, a.event_type as event, a.event_details as details, a.created_at,
                 c.full_name, c.client_id
          from dice_workflow_audit_logs a
          join clients_additional_info c on c.telegram_chat_id = a.telegram_chat_id
          join dice_ca_accounts ca on (ca.id::text = c.career_associate_id::text or lower(ca.email) = lower(c.career_associate_id::text))
          where a.created_at >= $1 and a.created_at < $2
            and ca.manager_id = $3
          order by a.created_at desc`, [startAt, endAt, operatorId])
      : hasOperatorFilter
        ? db.query(`
            select a.id, a.telegram_chat_id, a.event_type as event, a.event_details as details, a.created_at,
                   c.full_name, c.client_id
            from dice_workflow_audit_logs a
            join clients_additional_info c on c.telegram_chat_id = a.telegram_chat_id
            where a.created_at >= $1 and a.created_at < $2
              and c.career_associate_id = $3
            order by a.created_at desc`, [startAt, endAt, operatorId])
        : db.query(`
            select a.id, a.telegram_chat_id, a.event_type as event, a.event_details as details, a.created_at,
                   c.full_name, c.client_id
            from dice_workflow_audit_logs a
            left join clients_additional_info c on c.telegram_chat_id = a.telegram_chat_id
            where a.created_at >= $1 and a.created_at < $2
            order by a.created_at desc`, [startAt, endAt]),

    hasManagerFilter
      ? db.query(`
          select a.id, a.client_id, a.telegram_chat_id, a.job_id, a.url, a.job_name, a.status, a.reason, a.applied_at,
                 c.full_name
          from dice_applied_jobs a
          join clients_additional_info c on c.id = a.client_id
          join dice_ca_accounts ca on (ca.id::text = c.career_associate_id::text or lower(ca.email) = lower(c.career_associate_id::text))
          where a.applied_at >= $1 and a.applied_at < $2
            and ca.manager_id = $3
          order by a.applied_at desc`, [startAt, endAt, operatorId])
      : hasOperatorFilter
        ? db.query(`
            select a.id, a.client_id, a.telegram_chat_id, a.job_id, a.url, a.job_name, a.status, a.reason, a.applied_at,
                   c.full_name
            from dice_applied_jobs a
            join clients_additional_info c on c.id = a.client_id
            where a.applied_at >= $1 and a.applied_at < $2
              and c.career_associate_id = $3
            order by a.applied_at desc`, [startAt, endAt, operatorId])
        : db.query(`
            select a.id, a.client_id, a.telegram_chat_id, a.job_id, a.url, a.job_name, a.status, a.reason, a.applied_at,
                   c.full_name
            from dice_applied_jobs a
            left join clients_additional_info c on c.id = a.client_id
            where a.applied_at >= $1 and a.applied_at < $2
            order by a.applied_at desc`, [startAt, endAt]),

    hasManagerFilter
      ? db.query(`
          select q.id, q.client_id, q.telegram_chat_id, q.job_id, q.url, q.status, q.worker_id, q.available_at,
                 q.created_at, q.started_at, q.finished_at, q.attempts, q.max_attempts, q.last_error,
                 c.full_name
          from dice_apply_queue q
          join clients_additional_info c on c.id = q.client_id
          join dice_ca_accounts ca on (ca.id::text = c.career_associate_id::text or lower(ca.email) = lower(c.career_associate_id::text))
          where q.created_at >= $1 and q.created_at < $2
            and ca.manager_id = $3
          order by q.created_at desc`, [startAt, endAt, operatorId])
      : hasOperatorFilter
        ? db.query(`
            select q.id, q.client_id, q.telegram_chat_id, q.job_id, q.url, q.status, q.worker_id, q.available_at,
                   q.created_at, q.started_at, q.finished_at, q.attempts, q.max_attempts, q.last_error,
                   c.full_name
            from dice_apply_queue q
            join clients_additional_info c on c.id = q.client_id
            where q.created_at >= $1 and q.created_at < $2
              and c.career_associate_id = $3
            order by q.created_at desc`, [startAt, endAt, operatorId])
        : db.query(`
            select q.id, q.client_id, q.telegram_chat_id, q.job_id, q.url, q.status, q.worker_id, q.available_at,
                   q.created_at, q.started_at, q.finished_at, q.attempts, q.max_attempts, q.last_error,
                   c.full_name
            from dice_apply_queue q
            left join clients_additional_info c on c.id = q.client_id
            where q.created_at >= $1 and q.created_at < $2
            order by q.created_at desc`, [startAt, endAt]),

    hasManagerFilter
      ? db.query(`
          select 
            (select count(distinct c.id)::int from clients_additional_info c join dice_ca_accounts ca on (ca.id::text = c.career_associate_id::text or lower(ca.email) = lower(c.career_associate_id::text)) where ca.manager_id = $1) as total_candidates
        `, [operatorId])
      : hasOperatorFilter
        ? db.query(`
            select count(distinct c.id)::int as total_candidates
            from clients_additional_info c
            where c.career_associate_id = $1
          `, [operatorId])
        : db.query(`
            select count(*)::int as total_candidates
            from clients_additional_info
          `)
  ]);

  const totalCandidatesCount = stats.rows[0]?.total_candidates || 0;

  sendJson(response, 200, {
    date,
    timezone,
    timezone_name: timezoneName,
    telegram_bot_url: process.env.TELEGRAM_BOT_URL || 'https://t.me/dice_apply_bot',
    start_at: startAt,
    end_at: endAt,
    total_candidates: totalCandidatesCount,
    
    // Flat Arrays that DevLogs.jsx expects
    logs: audits.rows,
    applied_jobs: applications.rows,
    queue: queue.rows,
    
    operator: operator ? {
      id: operator.operator_id,
      email: operator.email,
      name: operator.name,
      role: operator.role,
    } : null,
  });
}"""

code = code[:start_idx] + new_read_dev + code[end_idx:]

with open('lib/dashboard-server.js', 'w') as f:
    f.write(code)

print("Rewrote readDevOverview successfully.")
