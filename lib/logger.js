const { createPool } = require('./azure');

const clientCache = new Map();
const jobCache = new Map();

const CLIENT_CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes
const JOB_CACHE_TTL_MS = 30 * 60 * 1000;    // 30 minutes

/**
 * Gets a clean prefix for logging like `[John Doe | AWL-1234]`.
 * @param {string|number|object} idOrObj Either chatId, clientId, or { chatId, clientId }
 * @returns {Promise<string>} e.g. `[John Doe | AWL-1234]` or `[User 123456]`
 */
async function getClientPrefix(idOrObj) {
  let chatId = null;
  let clientId = null;

  if (idOrObj && typeof idOrObj === 'object') {
    chatId = idOrObj.chatId || idOrObj.telegram_chat_id || idOrObj.telegramChatId || null;
    clientId = idOrObj.clientId || idOrObj.client_id || null;
  } else if (typeof idOrObj === 'string' && idOrObj.includes('-') && idOrObj.length > 20) {
    clientId = idOrObj;
  } else if (idOrObj) {
    chatId = String(idOrObj);
  }

  const cacheKey = clientId ? `client:${clientId}` : chatId ? `chat:${chatId}` : null;
  if (!cacheKey) {
    return '[Unknown User]';
  }

  const now = Date.now();
  if (clientCache.has(cacheKey)) {
    const entry = clientCache.get(cacheKey);
    if (entry && entry.expiresAt > now) {
      return entry.prefix;
    }
    clientCache.delete(cacheKey);
  }

  let prefix = null;
  try {
    const pool = createPool();
    let row = null;

    if (clientId) {
      const res = await pool.query(
        'SELECT full_name, applywizz_id FROM clients_additional_info WHERE id = $1 LIMIT 1',
        [clientId]
      );
      if (res.rows && res.rows.length > 0) {
        row = res.rows[0];
      }
    }

    if (!row && chatId) {
      const res = await pool.query(
        `SELECT c.full_name, c.applywizz_id, c.id as client_id
         FROM dice_sessions s
         JOIN clients_additional_info c ON c.id = s.client_id
         WHERE s.telegram_chat_id = $1::text
         LIMIT 1`,
        [String(chatId)]
      );
      if (res.rows && res.rows.length > 0) {
        row = res.rows[0];
        if (row.client_id) {
          const crossPrefix = row.full_name && row.applywizz_id
            ? `[${row.full_name.trim()} | ${row.applywizz_id.trim()}]`
            : row.full_name
            ? `[${row.full_name.trim()}]`
            : row.applywizz_id
            ? `[${row.applywizz_id.trim()}]`
            : null;
          if (crossPrefix) {
            clientCache.set(`client:${row.client_id}`, {
              prefix: crossPrefix,
              expiresAt: now + CLIENT_CACHE_TTL_MS,
            });
          }
        }
      }
    }

    if (row) {
      const name = (row.full_name || '').trim();
      const awlId = (row.applywizz_id || '').trim();
      if (name && awlId) {
        prefix = `[${name} | ${awlId}]`;
      } else if (name) {
        prefix = `[${name}]`;
      } else if (awlId) {
        prefix = `[${awlId}]`;
      }
    }
  } catch (err) {
    // Fall back to default on error
  }

  if (!prefix) {
    prefix = chatId ? `[User ${chatId}]` : clientId ? `[Client ${clientId.slice(0, 8)}]` : '[Unknown User]';
  }

  clientCache.set(cacheKey, { prefix, expiresAt: now + CLIENT_CACHE_TTL_MS });
  return prefix;
}

/**
 * Gets a clean display string for a job like `Google - Software Engineer`.
 * @param {string|object} jobOrUrl A URL, jobId, or job object
 * @returns {Promise<string>} e.g. `Google - Software Engineer` or fallback URL
 */
async function getJobDisplay(jobOrUrl) {
  if (!jobOrUrl) return 'Unknown Job';

  let url = null;
  let jobId = null;
  let title = null;
  let company = null;

  if (typeof jobOrUrl === 'object') {
    url = jobOrUrl.url || null;
    jobId = jobOrUrl.id || jobOrUrl.job_id || null;
    title = jobOrUrl.title || jobOrUrl.job_title || null;
    company = jobOrUrl.company || jobOrUrl.company_name || null;
  } else if (typeof jobOrUrl === 'string') {
    if (jobOrUrl.startsWith('http')) {
      url = jobOrUrl;
    } else {
      jobId = jobOrUrl;
    }
  }

  if (title) {
    return company ? `${company.trim()} - ${title.trim()}` : title.trim();
  }

  const cacheKey = url ? `url:${url}` : jobId ? `job:${jobId}` : null;
  const now = Date.now();
  if (cacheKey && jobCache.has(cacheKey)) {
    const entry = jobCache.get(cacheKey);
    if (entry && entry.expiresAt > now) {
      return entry.display;
    }
    jobCache.delete(cacheKey);
  }

  let display = null;
  try {
    const pool = createPool();
    let res = null;
    if (url) {
      res = await pool.query(
        'SELECT title, company FROM dice_scraped_jobs WHERE url = $1 LIMIT 1',
        [url]
      );
    } else if (jobId) {
      res = await pool.query(
        'SELECT title, company FROM dice_scraped_jobs WHERE id = $1 LIMIT 1',
        [jobId]
      );
    }

    if (res && res.rows && res.rows.length > 0) {
      const row = res.rows[0];
      const t = (row.title || '').trim();
      const c = (row.company || '').trim();
      if (t && c) {
        display = `${c} - ${t}`;
      } else if (t) {
        display = t;
      }
    }
  } catch (err) {
    // Fall back to default on error
  }

  if (!display) {
    display = url || (jobId ? `Job ${jobId}` : 'Unknown Job');
  }

  if (cacheKey) {
    jobCache.set(cacheKey, { display, expiresAt: now + JOB_CACHE_TTL_MS });
  }

  return display;
}

module.exports = {
  getClientPrefix,
  getJobDisplay,
};
