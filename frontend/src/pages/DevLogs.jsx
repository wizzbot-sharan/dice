
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../dev.css';

export default function DevLogs() {
  const [logs, setLogs] = useState([]);
  const logsEndRef = useRef(null);

  useEffect(() => {
    const eventSource = new EventSource('/api/dev/stream');
    
    eventSource.addEventListener('audit_events', (e) => {
      try {
        const newLogs = JSON.parse(e.data);
        setLogs(prev => [...prev, ...newLogs].slice(-200));
      } catch (err) {
        console.error(err);
      }
    });

    return () => {
      eventSource.close();
    };
  }, []);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <>
      
  <div className="dev-app">
    
    <header className="dev-header">
      <div className="dev-header-left">
        <div className="dev-brand">
          <img src="/Applywizz logo.jpeg" alt="Applywizz Logo" className="brand-logo-img" />
          <div className="dev-brand-badge">DEV</div>
          <div className="dev-brand-info">
            <h1>Dice AutoEasyApply Admin Logs</h1>
            <span>Real-time System Observability & Automation Stream</span>
          </div>
        </div>
        <a href="/dashboard" className="dev-nav-link">← Standard Dashboard</a>
      </div>

      <div className="dev-header-right">
        <div className="stream-status" id="stream-status">
          <span className="status-dot"></span>
          <span className="status-label">SSE Stream Connecting...</span>
        </div>
        <button id="stream-toggle-btn" className="dev-btn dev-btn-sm dev-btn-outline">⏸ Pause Stream</button>
        <button id="refresh-dev-btn" className="dev-btn dev-btn-sm dev-btn-primary">↻ Refresh</button>
        <div className="dev-operator-pill" id="dev-operator-pill">
          <span className="role-badge">ADMIN</span>
          <span id="dev-operator-name">Loading...</span>
        </div>
      </div>
    </header>

    
    <section className="kpi-grid">
      <div className="kpi-card accent-blue">
        <div className="kpi-label">Total Candidates</div>
        <div className="kpi-val" id="kpi-total-candidates">—</div>
        <div className="kpi-sub" id="kpi-linked-candidates">— linked to Telegram</div>
      </div>
      <div className="kpi-card accent-green">
        <div className="kpi-label">Active 9-Hour Sessions</div>
        <div className="kpi-val" id="kpi-active-sessions">—</div>
        <div className="kpi-sub">Currently scanning for jobs</div>
      </div>
      <div className="kpi-card accent-purple">
        <div className="kpi-label">Applications prompted</div>
        <div className="kpi-val" id="kpi-applied-today">—</div>
        <div className="kpi-sub">Submitted to Dice.com</div>
      </div>
      <div className="kpi-card accent-amber">
        <div className="kpi-label">Queue Backlog</div>
        <div className="kpi-val" id="kpi-queue-active">—</div>
        <div className="kpi-sub" id="kpi-queue-breakdown">0 running • 0 queued</div>
      </div>
      <div className="kpi-card accent-red">
        <div className="kpi-label">Application Errors</div>
        <div className="kpi-val" id="kpi-errors-count">—</div>
        <div className="kpi-sub">Failed applications / skips</div>
      </div>
      <div className="kpi-card accent-cyan">
        <div className="kpi-label">System Health</div>
        <div className="kpi-val" id="kpi-uptime">—</div>
        <div className="kpi-sub" id="kpi-memory">RAM: — MB • Node: —</div>
      </div>
    </section>

    
    <nav className="dev-tabs">
      <button className="dev-tab active" data-target="tab-stream">📡 Live Event Stream <span className="tab-count"
          id="tab-count-events">0</span></button>
      <button className="dev-tab" data-target="tab-queue">⚙️ Apply Queue & Workers <span className="tab-count"
          id="tab-count-queue">0</span></button>
      <button className="dev-tab" data-target="tab-matrix">👥 Candidate Session Matrix <span className="tab-count"
          id="tab-count-sessions">0</span></button>
      <button className="dev-tab" data-target="tab-errors">❌ Error Diagnostics <span className="tab-count"
          id="tab-count-errors">0</span></button>
      <button className="dev-tab" data-target="tab-system">🏥 System Infrastructure</button>
    </nav>

    
    <main className="dev-main">
      
      <section className="dev-view active" id="tab-stream">
        <div className="view-toolbar">
          <div className="search-wrap">
            <input type="search" id="stream-search"
              placeholder="Filter by event (e.g. prompt, yes, error), candidate email, or chat ID..." />
          </div>
          <div className="filter-group">
            <select id="stream-user-filter" title="Filter logs by specific candidate">
              <option value="all">👥 All Users (Combined)</option>
            </select>
            <select id="stream-event-filter">
              <option value="all">All Event Types</option>
              <option value="job_prompt_sent">Job Prompt Sent</option>
              <option value="job_yes">Prompt Accepted (Yes)</option>
              <option value="job_no">Prompt Rejected (No)</option>
              <option value="job_missed">Prompt Missed (Timeout)</option>
              <option value="job_queued">Job Queued</option>
              <option value="automation_delay_started">Automation Delay</option>
              <option value="dice_login_started">Dice Login</option>
              <option value="next_link_scheduled">Next Scan Scheduled</option>
            </select>
            <button id="clear-stream-btn" className="dev-btn dev-btn-sm dev-btn-outline">Clear View</button>
            <label className="autoscroll-toggle">
              <input type="checkbox" id="autoscroll-chk" checked /> Auto-scroll
            </label>
          </div>
        </div>

        <div className="stream-log-container" id="stream-log-container">
          <div className="stream-empty-msg">Listening for real-time audit events and workflow updates...</div>
        </div>
      </section>

      
      <section className="dev-view" id="tab-queue">
        <div className="view-toolbar">
          <div className="toolbar-title">Active Queue & Automation Pipeline</div>
          <div className="search-wrap">
            <input type="search" id="queue-search" placeholder="Search queue by candidate, URL, or status..." />
          </div>
        </div>

        <div className="queue-grid-layout">
          
          <div className="worker-summary-panel">
            <h3>Worker Slots & Concurrency</h3>
            <div className="worker-card-grid" id="workers-card-grid">
              
            </div>
          </div>

          
          <div className="queue-table-panel">
            <h3>Durable Application Queue (<code>dice_apply_queue</code>)</h3>
            <div className="table-responsive">
              <table className="dev-table" id="queue-table">
                <thead>
                  <tr>
                    <th>Status</th>
                    <th>Candidate</th>
                    <th>Job Link</th>
                    <th>Available At (Delay)</th>
                    <th>Worker ID</th>
                    <th>Attempts</th>
                    <th>Last Error</th>
                  </tr>
                </thead>
                <tbody id="queue-table-body">
                  <tr>
                    <td colspan="7" className="text-center text-muted">No items in queue.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      
      <section className="dev-view" id="tab-matrix">
        <div className="view-toolbar">
          <div className="toolbar-title">Live Candidate 9-Hour Workflows (<code>dice_workflow_sessions</code>)</div>
          <div className="search-wrap">
            <input type="search" id="matrix-search" placeholder="Search candidates..." />
          </div>
        </div>

        <div className="table-responsive">
          <table className="dev-table" id="sessions-table">
            <thead>
              <tr>
                <th>Candidate</th>
                <th>Telegram Chat</th>
                <th>Assigned CA</th>
                <th>9-Hour Session Timer</th>
                <th>Consecutive 'No'</th>
                <th>Next Scan Schedule</th>
                <th>Last Decision</th>
                <th>Current Prompt</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="sessions-table-body">
              
            </tbody>
          </table>
        </div>
      </section>

      
      <section className="dev-view" id="tab-errors">
        <div className="view-toolbar">
          <div className="toolbar-title">Failure Log & Error Diagnostics (<code>dice_applied_jobs</code>)</div>
          <div className="search-wrap">
            <input type="search" id="errors-search" placeholder="Search error reasons, candidate, or job title..." />
          </div>
        </div>

        <div className="table-responsive">
          <table className="dev-table" id="errors-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Candidate</th>
                <th>Job Title / Company</th>
                <th>Status / Reason</th>
                <th>Target URL</th>
              </tr>
            </thead>
            <tbody id="errors-table-body">
              
            </tbody>
          </table>
        </div>
      </section>

      
      <section className="dev-view" id="tab-system">
        <div className="system-grid">
          <div className="system-card">
            <h3>Runtime Environment</h3>
            <table className="keyval-table">
              <tr>
                <td>Node Version</td>
                <td id="sys-node-ver">—</td>
              </tr>
              <tr>
                <td>Platform / OS</td>
                <td id="sys-platform">—</td>
              </tr>
              <tr>
                <td>Process Uptime</td>
                <td id="sys-uptime-long">—</td>
              </tr>
              <tr>
                <td>Browser Engine</td>
                <td id="sys-browser-mode">—</td>
              </tr>
              <tr>
                <td>Max Concurrency</td>
                <td id="sys-max-concurrency">—</td>
              </tr>
            </table>
          </div>

          <div className="system-card">
            <h3>Process Memory Usage</h3>
            <table className="keyval-table">
              <tr>
                <td>RSS Memory</td>
                <td id="sys-mem-rss">—</td>
              </tr>
              <tr>
                <td>Heap Used</td>
                <td id="sys-mem-heap-used">—</td>
              </tr>
              <tr>
                <td>Heap Total</td>
                <td id="sys-mem-heap-total">—</td>
              </tr>
            </table>
          </div>

          <div className="system-card">
            <h3>Operator & CA Accounts</h3>
            <div className="table-responsive">
              <table className="dev-table compact" id="cas-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody id="cas-table-body">
                  
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>

  
  <div className="dev-modal" id="details-modal" hidden>
    <div className="dev-modal-backdrop" id="modal-backdrop"></div>
    <div className="dev-modal-box">
      <div className="dev-modal-header">
        <h3 id="modal-title">Event Inspection Details</h3>
        <button className="dev-modal-close" id="modal-close-btn">&times;</button>
      </div>
      <div className="dev-modal-body">
        <pre id="modal-json-content"></pre>
      </div>
    </div>
  </div>

  
    </>
  );
}
