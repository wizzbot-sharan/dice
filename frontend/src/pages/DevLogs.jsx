import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';

export default function DevLogs() {
  const { operator, loading } = useAuth();
  
  const [activeTab, setActiveTab] = useState('logs');
  const [overview, setOverview] = useState(null);
  const [dashData, setDashData] = useState(null);
  const [logs, setLogs] = useState([]);
  const [isAutoScroll, setIsAutoScroll] = useState(true);
  const [selectedCA, setSelectedCA] = useState('ALL');
  const [selectedCandidate, setSelectedCandidate] = useState('ALL');
  const [selectedDate, setSelectedDate] = useState(new Date().toLocaleDateString('en-CA'));
  const [logSearch, setLogSearch] = useState('');
  const [sidebarWidth, setSidebarWidth] = useState(256);
  const [isArchiving, setIsArchiving] = useState(false);
  const [archiveResult, setArchiveResult] = useState(null);
  const isResizing = useRef(false);

  const handleRefreshJobs = async () => {
    if (isArchiving) return;
    if (!window.confirm('Shift jobs older than 24 hours to dice_archived_jobs and clean up active scraped jobs?')) {
      return;
    }
    setIsArchiving(true);
    setArchiveResult(null);
    try {
      const res = await fetch('/api/dev/archive-jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (data.ok) {
        setArchiveResult(`Archived ${data.archived_count} job${data.archived_count === 1 ? '' : 's'}`);
        fetch(`/api/dev/overview?date=${selectedDate}`)
          .then(r => r.json())
          .then(d => setOverview(d))
          .catch(() => {});
      } else {
        setArchiveResult(`Failed: ${data.error || 'Unknown error'}`);
      }
    } catch (err) {
      setArchiveResult(`Error: ${err.message}`);
    } finally {
      setIsArchiving(false);
      setTimeout(() => setArchiveResult(null), 5000);
    }
  };

  const startResizing = React.useCallback(() => {
    isResizing.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, []);

  const stopResizing = React.useCallback(() => {
    isResizing.current = false;
    document.body.style.cursor = 'default';
    document.body.style.userSelect = '';
  }, []);

  const resize = React.useCallback((mouseMoveEvent) => {
    if (isResizing.current) {
      const newWidth = mouseMoveEvent.clientX;
      if (newWidth >= 150 && newWidth <= 600) {
        setSidebarWidth(newWidth);
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', resize);
    window.addEventListener('mouseup', stopResizing);
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [resize, stopResizing]);
  
  const logsEndRef = useRef(null);

  useEffect(() => {
    const originalTitle = document.title;
    const favicon = document.querySelector("link[rel~='icon']");
    const originalFavicon = favicon ? favicon.href : '/Applywizz_logo.jpeg';
    
    document.title = "DevLogs";
    if (favicon) favicon.href = "/code.png?v=" + new Date().getTime();
    
    return () => {
      document.title = originalTitle;
      if (favicon) favicon.href = originalFavicon;
    };
  }, []);

  useEffect(() => {
    if (loading || !operator || (operator.role !== 'admin' && operator.role !== 'manager')) return;

    const tzName = Intl.DateTimeFormat().resolvedOptions().timeZone;
    fetch(`/api/dev/overview?date=${selectedDate}`)
      .then(res => res.json())
      .then(data => setOverview(data))
      .catch(err => console.error('Failed to fetch dev overview:', err));
      
    fetch(`/api/dashboard?date=${selectedDate}&timezone=browser&timezone_name=${encodeURIComponent(tzName)}`)
      .then(res => res.json())
      .then(data => setDashData(data))
      .catch(err => console.error('Failed to fetch dashboard data:', err));

    const es = new EventSource('/api/dev/stream');
    
    es.addEventListener('audit_events', (e) => {
      try {
        const newEvents = JSON.parse(e.data);
        setLogs(prev => [...prev, ...newEvents].slice(-300));
      } catch (err) {}
    });
    
    return () => es.close();
  }, [operator, loading, selectedDate]);

  useEffect(() => {
    if (isAutoScroll && activeTab === 'logs') {
      logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isAutoScroll, activeTab]);

  if (loading) return <div className="h-screen bg-black flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div></div>;
  if (!operator || (operator.role !== 'admin' && operator.role !== 'manager')) return <Navigate to="/" />;

  // Global filters
  const uniqueCAs = useMemo(() => Array.from(new Set((overview?.ca_accounts || []).map(ca => ca.name))).filter(Boolean), [overview]);
  
  // Apply filters to data
  const filteredUsers = useMemo(() => {
    let u = overview?.active_users || [];
    if (selectedCA !== 'ALL') u = u.filter(x => (x.ca_name || 'Unassigned') === selectedCA);
    if (selectedCandidate !== 'ALL') u = u.filter(x => String(x.telegram_chat_id) === selectedCandidate);
    return u;
  }, [overview, selectedCA, selectedCandidate]);

  const filteredQueue = useMemo(() => {
    let q = overview?.queue || [];
    if (selectedCandidate !== 'ALL') q = q.filter(x => String(x.telegram_chat_id) === selectedCandidate);
    return q;
  }, [overview, selectedCandidate]);

  const filteredErrors = useMemo(() => {
    let e = overview?.applied_jobs?.filter(j => j.status === 'failed') || [];
    if (selectedCandidate !== 'ALL') e = e.filter(x => String(x.telegram_chat_id) === selectedCandidate);
    return e;
  }, [overview, selectedCandidate]);

  const filteredLogs = useMemo(() => {
    let l = logs;
    if (selectedCandidate !== 'ALL') l = l.filter(x => String(x.telegram_chat_id) === selectedCandidate);
    if (logSearch) {
      const lowerSearch = logSearch.toLowerCase();
      l = l.filter(x => 
        (x.event || '').toLowerCase().includes(lowerSearch) || 
        (typeof x.details === 'string' ? x.details : JSON.stringify(x.details)).toLowerCase().includes(lowerSearch) ||
        (x.full_name || '').toLowerCase().includes(lowerSearch)
      );
    }
    return l;
  }, [logs, selectedCandidate, logSearch]);

  const totalUsers = overview?.stats?.linked_candidates || 0;
  const jobsSent = dashData?.global_stats?.prompts?.total || 0;
  const yesCount = dashData?.global_stats?.prompts?.accepted || 0;
  const noCount = dashData?.global_stats?.prompts?.rejected || 0;
  const missedCount = dashData?.global_stats?.prompts?.skipped || 0;

  const getSessionStatus = (deadline) => {
    if (!deadline) return <span className="text-zinc-500">Not Started</span>;
    const deadlineTime = new Date(deadline).getTime();
    const now = Date.now();
    if (deadlineTime < now) {
      return <span className="text-rose-400">Expired</span>;
    }
    
    const diffMs = deadlineTime - now;
    const h = Math.floor(diffMs / 3600000);
    const m = Math.floor((diffMs % 3600000) / 60000);
    return <span className="text-emerald-400 font-medium">{h}h {m}m</span>;
  };

  return (
    <div className="flex flex-col h-screen bg-black text-slate-200 font-sans overflow-hidden">
      
      {/* 1. TOP HEADER / NAV BAR */}
      <div className="bg-[#0a0a0a] border-b border-white/5 px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-6">
          <Link to="/" className="text-white hover:text-emerald-400 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </Link>
          <span className="text-white font-semibold text-lg">Dice AutoEasyApply Admin Logs</span>
          <div className="h-5 w-px bg-white/10"></div>
          
          <div className="flex space-x-3 items-center">
            <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} onClick={e => e.target.showPicker && e.target.showPicker()} className="bg-black border border-white/10 text-white text-sm rounded-lg px-4 py-1.5 outline-none focus:border-white/20 transition-colors cursor-pointer" style={{ colorScheme: 'dark' }} />
            <select value={selectedCA} onChange={e => { setSelectedCA(e.target.value); setSelectedCandidate('ALL'); }} className="bg-black border border-white/10 text-white text-sm rounded-lg px-4 py-1.5 outline-none focus:border-white/20 transition-colors">
              <option value="ALL">All CAs</option>
              {uniqueCAs.map(ca => <option key={ca} value={ca}>{ca}</option>)}
            </select>
            <select value={selectedCandidate} onChange={e => setSelectedCandidate(e.target.value)} className="bg-black border border-white/10 text-white text-sm rounded-lg px-4 py-1.5 outline-none focus:border-white/20 transition-colors">
              <option value="ALL">All Candidates</option>
              {overview?.active_users?.filter(u => selectedCA === 'ALL' || (u.ca_name || 'Unassigned') === selectedCA).map(u => (
                <option key={u.telegram_chat_id} value={u.telegram_chat_id}>{u.full_name || u.company_email}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="flex space-x-4 items-center">
          <span className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-md border border-emerald-500/20 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> CONNECTED
          </span>
        </div>
      </div>
      
      {/* 2. FIXED STATS ROW (Under Nav Bar) */}
      <div className="bg-[#050505] border-b border-white/5 px-6 py-4 shrink-0 flex gap-4 overflow-x-auto custom-scrollbar">
        <div className="bg-[#0a0a0a] border border-white/5 p-4 rounded-xl flex-1 min-w-[150px]">
          <div className="text-zinc-500 text-xs mb-1 uppercase tracking-wider font-bold">Telegram Users</div>
          <div className="text-white text-2xl font-semibold">{totalUsers}</div>
        </div>
        <div className="bg-[#0a0a0a] border border-white/5 p-4 rounded-xl flex-1 min-w-[150px]">
          <div className="text-zinc-500 text-xs mb-1 uppercase tracking-wider font-bold">Active Sessions</div>
          <div className="text-white text-2xl font-semibold">{overview?.stats?.active_sessions || 0}</div>
        </div>
        <div className="bg-[#0a0a0a] border border-white/5 p-4 rounded-xl flex-1 min-w-[150px]">
          <div className="text-zinc-500 text-xs mb-1 uppercase tracking-wider font-bold">Jobs Sent</div>
          <div className="text-blue-400 text-2xl font-semibold">{jobsSent}</div>
        </div>
        <div className="bg-[#0a0a0a] border border-white/5 p-4 rounded-xl flex-1 min-w-[150px]">
          <div className="text-emerald-500/70 text-xs mb-1 uppercase tracking-wider font-bold">Yes (Approved)</div>
          <div className="text-emerald-400 text-2xl font-semibold">{yesCount}</div>
        </div>
        <div className="bg-[#0a0a0a] border border-white/5 p-4 rounded-xl flex-1 min-w-[150px]">
          <div className="text-rose-500/70 text-xs mb-1 uppercase tracking-wider font-bold">No (Rejected)</div>
          <div className="text-rose-400 text-2xl font-semibold">{noCount}</div>
        </div>
        <div className="bg-[#0a0a0a] border border-white/5 p-4 rounded-xl flex-1 min-w-[150px]">
          <div className="text-amber-500/70 text-xs mb-1 uppercase tracking-wider font-bold">Missed (Timeout)</div>
          <div className="text-amber-400 text-2xl font-semibold">{missedCount}</div>
        </div>
      </div>

      {/* 3. L-SHAPE SPLIT LAYOUT */}
      <div className="flex-1 flex overflow-hidden">
        
        <div className="bg-[#0a0a0a] border-r border-white/5 flex shrink-0 relative group" style={{ width: sidebarWidth }}>
          <div className="p-4 flex flex-col gap-2 w-full h-full overflow-hidden">
          <button onClick={() => setActiveTab('logs')} className={`w-full text-left px-4 py-3 rounded-xl transition-all text-sm font-medium ${activeTab === 'logs' ? 'bg-white text-black shadow-sm' : 'text-zinc-400 hover:bg-white/5 hover:text-white'}`}>Live Logs</button>
          <button onClick={() => setActiveTab('workers')} className={`w-full text-left px-4 py-3 rounded-xl transition-all text-sm font-medium ${activeTab === 'workers' ? 'bg-white text-black shadow-sm' : 'text-zinc-400 hover:bg-white/5 hover:text-white'}`}>Apply Workers</button>
          <button onClick={() => setActiveTab('errors')} className={`w-full text-left px-4 py-3 rounded-xl transition-all text-sm font-medium ${activeTab === 'errors' ? 'bg-white text-black shadow-sm' : 'text-zinc-400 hover:bg-white/5 hover:text-white'}`}>Error Diagnostics</button>
          <button onClick={() => setActiveTab('users')} className={`w-full text-left px-4 py-3 rounded-xl transition-all text-sm font-medium ${activeTab === 'users' ? 'bg-white text-black shadow-sm' : 'text-zinc-400 hover:bg-white/5 hover:text-white'}`}>Telegram Users</button>

          {operator?.role === 'admin' && (
            <div className="mt-auto pt-3 border-t border-white/5 shrink-0">
              <button
                type="button"
                disabled={isArchiving}
                onClick={handleRefreshJobs}
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 text-xs font-semibold tracking-wide transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <svg className={`w-3.5 h-3.5 ${isArchiving ? 'animate-spin' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>{isArchiving ? 'Refreshing...' : 'Refresh jobs'}</span>
              </button>
              {archiveResult && (
                <p className="mt-1.5 text-[11px] text-center text-emerald-400 truncate" title={archiveResult}>
                  {archiveResult}
                </p>
              )}
            </div>
          )}
          </div>
          {/* Draggable Handle */}
          <div 
            className="absolute top-0 right-0 w-1.5 h-full cursor-col-resize hover:bg-white/10 active:bg-white/20 transition-colors z-10"
            onMouseDown={startResizing}
          />
        </div>

        <div className="flex-1 bg-black p-6 overflow-y-auto custom-scrollbar">
          
          {activeTab === 'logs' && (
            <div className="h-full flex flex-col">
              <div className="flex justify-between items-center mb-4 shrink-0">
                <h3 className="text-white text-lg font-medium">Live Audit Stream {selectedCandidate !== 'ALL' ? '(Filtered)' : ''}</h3>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2 text-sm text-zinc-400 cursor-pointer">
                    <input type="checkbox" checked={isAutoScroll} onChange={e => setIsAutoScroll(e.target.checked)} className="accent-white" />
                    <span>Auto-scroll</span>
                  </label>
                  <input type="text" value={logSearch} onChange={e => setLogSearch(e.target.value)} placeholder="Grep logs..." className="bg-[#0a0a0a] border border-white/5 text-sm text-white px-3 py-1.5 rounded-lg outline-none focus:border-white/20 w-64" />
                </div>
              </div>
              <div className="flex-1 bg-[#050505] border border-white/5 rounded-2xl p-6 font-mono text-xs overflow-y-auto custom-scrollbar shadow-inner">
                <div className="space-y-2">
                  {filteredLogs.length === 0 ? (
                    <div className="text-zinc-500 italic">Waiting for events...</div>
                  ) : (
                    filteredLogs.map((log, idx) => {
                      const time = new Date(log.created_at).toLocaleTimeString();
                      const isError = (log.event || '').includes('error') || (log.event || '').includes('fail');
                      return (
                        <div key={idx} className={`flex gap-4 p-1.5 rounded transition-colors break-words ${isError ? 'bg-rose-500/5 text-rose-300' : 'text-zinc-400 hover:bg-white/5'}`}>
                          <span className="text-zinc-600 shrink-0 w-16">{time}</span>
                          <span className={`${isError ? 'text-rose-400' : 'text-indigo-400'} shrink-0 whitespace-nowrap min-w-[6rem] font-bold`}>[{(log.event || 'EVENT').toUpperCase()}]</span>
                          <span className={isError ? 'text-rose-300' : 'text-zinc-300'}>
                            {log.full_name ? <span className="font-semibold text-white mr-2">{log.full_name}:</span> : null}
                            {typeof log.details === 'object' ? JSON.stringify(log.details) : String(log.details || '')}
                          </span>
                        </div>
                      );
                    })
                  )}
                  <div ref={logsEndRef} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'workers' && (
            <div className="h-full flex flex-col">
              <h3 className="text-white text-lg font-medium mb-6 shrink-0">Apply Workers & Queue Status {selectedCandidate !== 'ALL' ? '(Filtered)' : ''}</h3>
              
              {/* TOP: Active Workers (Horizontal Scroll) */}
              <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 mb-6 shrink-0">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-zinc-400 font-medium">Active Worker Processes</h4>
                  <span className="text-xs font-mono text-zinc-500">{overview?.stats?.queue_running || 0} Online</span>
                </div>
                
                <div className="flex space-x-4 overflow-x-auto custom-scrollbar pb-2">
                  {(!filteredQueue || filteredQueue.filter(q => q.status === 'running').length === 0) ? (
                    <div className="text-zinc-500 text-sm italic">No workers currently processing jobs. Queue is idle.</div>
                  ) : (
                    filteredQueue.filter(q => q.status === 'running').map(q => (
                      <div key={q.id} className="min-w-[250px] bg-black border border-white/5 p-4 rounded-xl flex-shrink-0">
                        <div className="flex justify-between items-center mb-3">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                            <span className="text-sm text-white font-mono">{q.worker_id || `worker-${q.id.substring(0,6)}`}</span>
                          </div>
                          <span className="text-[10px] uppercase font-bold tracking-wide bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20">Busy</span>
                        </div>
                        <div className="text-xs text-zinc-400 truncate">Processing: <span className="text-white">{q.full_name || q.client_id}</span></div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* BOTTOM: Queue (Fills remaining space) */}
              <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
                
                {/* PREFLIGHT COLUMN */}
                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 flex-1 flex flex-col min-h-0">
                  <div className="flex justify-between items-center mb-4 shrink-0">
                    <h4 className="text-zinc-400 font-medium">Preflight Status</h4>
                    <span className="text-xs font-mono text-zinc-500">{filteredQueue.filter(q => ['preflight_queued', 'preflight_running', 'preflight_passed', 'prompt_sent'].includes(q.status)).length} Jobs</span>
                  </div>
                  <div className="space-y-3 overflow-y-auto custom-scrollbar flex-1 pr-2">
                    {(() => {
                      const preflightJobs = filteredQueue.filter(q => ['preflight_queued', 'preflight_running', 'preflight_passed', 'prompt_sent'].includes(q.status));
                      if (preflightJobs.length === 0) return <div className="text-zinc-500 text-sm italic">No preflight jobs.</div>;
                      return preflightJobs.map(q => (
                        <div key={q.id} className="p-4 bg-black rounded-xl border border-white/5 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                          <div className="min-w-0 flex-1">
                             <div className="text-sm text-white font-medium mb-1">{q.full_name || q.client_id}</div>
                             <div className="text-xs text-zinc-400 truncate" title={q.url}>{q.url}</div>
                             {q.last_error && <div className="mt-2 text-xs text-rose-300 italic truncate" title={q.last_error}>{q.last_error}</div>}
                          </div>
                          
                          <div className="flex flex-col items-end shrink-0">
                             <div className="text-xs text-zinc-500 mb-2">Attempt {q.attempts}/{q.max_attempts}</div>
                             <div className={`text-[10px] px-2.5 py-1 inline-block rounded font-bold uppercase tracking-wider ${
                               q.status === 'failed' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 
                               q.status.includes('running') ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                               q.status === 'completed' || q.status === 'preflight_passed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                               'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20'
                             }`}>
                               {q.status}
                             </div>
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                </div>

                {/* APPLICATION COLUMN */}
                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 flex-1 flex flex-col min-h-0">
                  <div className="flex justify-between items-center mb-4 shrink-0">
                    <h4 className="text-zinc-400 font-medium">Application Automation Status</h4>
                    <span className="text-xs font-mono text-zinc-500">{filteredQueue.filter(q => ['queued', 'running', 'completed', 'failed'].includes(q.status)).length} Jobs</span>
                  </div>
                  <div className="space-y-3 overflow-y-auto custom-scrollbar flex-1 pr-2">
                    {(() => {
                      const appJobs = filteredQueue.filter(q => ['queued', 'running', 'completed', 'failed'].includes(q.status));
                      if (appJobs.length === 0) return <div className="text-zinc-500 text-sm italic">No application jobs.</div>;
                      return appJobs.map(q => (
                        <div key={q.id} className="p-4 bg-black rounded-xl border border-white/5 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                          <div className="min-w-0 flex-1">
                             <div className="text-sm text-white font-medium mb-1">{q.full_name || q.client_id}</div>
                             <div className="text-xs text-zinc-400 truncate" title={q.url}>{q.url}</div>
                             {q.last_error && <div className="mt-2 text-xs text-rose-300 italic truncate" title={q.last_error}>{q.last_error}</div>}
                          </div>
                          
                          <div className="flex flex-col items-end shrink-0">
                             <div className="text-xs text-zinc-500 mb-2">Attempt {q.attempts}/{q.max_attempts}</div>
                             <div className={`text-[10px] px-2.5 py-1 inline-block rounded font-bold uppercase tracking-wider ${
                               q.status === 'failed' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 
                               q.status === 'running' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                               q.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                               'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20'
                             }`}>
                               {q.status}
                             </div>
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                </div>

              </div>
            </div>
          )}

          {activeTab === 'errors' && (
            <div>
              <h3 className="text-white text-lg font-medium mb-6">Error Diagnostics {selectedCandidate !== 'ALL' ? '(Filtered)' : ''}</h3>
              <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-black text-zinc-500 text-xs uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4 font-medium">Timestamp</th>
                      <th className="px-6 py-4 font-medium">Candidate</th>
                      <th className="px-6 py-4 font-medium w-1/2">Failure Reason</th>
                      <th className="px-6 py-4 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredErrors.length === 0 ? (
                      <tr><td colSpan="4" className="px-6 py-4 text-zinc-500 text-center">No recent application failures.</td></tr>
                    ) : (
                      filteredErrors.map(err => (
                        <tr key={err.id}>
                          <td className="px-6 py-4 text-zinc-400 whitespace-nowrap">{new Date(err.applied_at).toLocaleTimeString()}</td>
                          <td className="px-6 py-4 text-white font-medium whitespace-nowrap">{err.client_name || err.client_id}</td>
                          <td className="px-6 py-4 text-rose-400 break-words">{err.reason || err.status_details || err.status}</td>
                          <td className="px-6 py-4 whitespace-nowrap"><a href={err.url || err.job_url} target="_blank" rel="noreferrer" className="text-xs px-3 py-1 bg-white/10 text-white rounded hover:bg-white/20 transition">View Job</a></td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div>
              <h3 className="text-white text-lg font-medium mb-6">Telegram Users & Workflows {selectedCA !== 'ALL' ? `(CA: ${selectedCA})` : ''}</h3>
              <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-black text-zinc-500 text-xs uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4 font-medium">Candidate Name</th>
                      <th className="px-6 py-4 font-medium">Email</th>
                      <th className="px-6 py-4 font-medium">CA Name</th>
                      <th className="px-6 py-4 font-medium text-center">Total NOs (Today)</th>
                      <th className="px-6 py-4 font-medium">9-Hour Window</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredUsers.length === 0 ? (
                      <tr><td colSpan="5" className="px-6 py-4 text-zinc-500 text-center">No users found.</td></tr>
                    ) : (
                      filteredUsers.map(u => (
                        <tr key={u.client_id}>
                          <td className="px-6 py-4 text-white font-medium">{u.full_name || 'N/A'}</td>
                          <td className="px-6 py-4 text-zinc-400">{u.company_email}</td>
                          <td className="px-6 py-4 text-zinc-400">{u.ca_name || 'Unassigned'}</td>
                          <td className="px-6 py-4 text-center text-zinc-300 font-mono bg-white/5">{u.no_count || 0}</td>
                          <td className="px-6 py-4">{getSessionStatus(u.session_deadline)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}


        </div>
      </div>
    </div>
  );
}
