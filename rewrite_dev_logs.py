import os

new_code = """import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';

export default function DevLogs() {
  const { operator, loading } = useAuth();
  
  const [activeTab, setActiveTab] = useState('allStats');
  const [overview, setOverview] = useState(null);
  const [logs, setLogs] = useState([]);
  const [isAutoScroll, setIsAutoScroll] = useState(true);
  
  // Shared Filters
  const [dateFrom, setDateFrom] = useState(new Date().toLocaleDateString('en-CA'));
  const [dateTo, setDateTo] = useState(new Date().toLocaleDateString('en-CA'));
  const [selectedCAGroup, setSelectedCAGroup] = useState('ALL');
  const [selectedCandidate, setSelectedCandidate] = useState('ALL');
  const [logSearch, setLogSearch] = useState('');
  const [sidebarWidth, setSidebarWidth] = useState(256);
  const [isArchiving, setIsArchiving] = useState(false);
  const [archiveResult, setArchiveResult] = useState(null);
  
  // All Stats Specific
  const [withCA, setWithCA] = useState(false);
  const [expandedCAs, setExpandedCAs] = useState({});
  const [allClients, setAllClients] = useState([]);
  const [caList, setCaList] = useState([]);
  
  // Popup
  const [selectedClientForPopup, setSelectedClientForPopup] = useState(null);
  const [popupStats, setPopupStats] = useState(null);
  const [popupJobs, setPopupJobs] = useState([]);
  const [popupJobFilter, setPopupJobFilter] = useState('ALL');
  const [isPopupLoading, setIsPopupLoading] = useState(false);
  
  const isResizing = useRef(false);
  const logsEndRef = useRef(null);
  const eventSourceRef = useRef(null);

  // Resize handler
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

  // Tab Title & Favicon
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

  // Fetch Static Metadata (Clients & CAs)
  useEffect(() => {
    if (loading || !operator || (operator.role !== 'admin' && operator.role !== 'manager')) return;
    fetch('/api/dev/all-clients')
      .then(res => res.json())
      .then(data => { if (data.ok) setAllClients(data.clients); })
      .catch(console.error);
      
    fetch('/api/dev/ca-list')
      .then(res => res.json())
      .then(data => { if (data.ok) setCaList(data.ca_accounts); })
      .catch(console.error);
  }, [operator, loading]);

  // Fetch Overview Data & Manage SSE on Date/Auth change
  useEffect(() => {
    if (loading || !operator || (operator.role !== 'admin' && operator.role !== 'manager')) return;
    if (!dateFrom || !dateTo) return;

    fetch(`/api/dev/overview?dateFrom=${dateFrom}&dateTo=${dateTo}`)
      .then(res => res.json())
      .then(data => setOverview(data))
      .catch(console.error);

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }
    const es = new EventSource(`/api/dev/stream?dateFrom=${dateFrom}&dateTo=${dateTo}`);
    eventSourceRef.current = es;
    
    es.addEventListener('audit_events', (e) => {
      try {
        const newEvents = JSON.parse(e.data);
        setLogs(prev => [...prev, ...newEvents].slice(-300));
      } catch (err) {}
    });
    
    es.addEventListener('stats_update', (e) => {
      try {
        const liveStats = JSON.parse(e.data);
        setOverview(prev => prev ? { ...prev, stats: { ...prev.stats, ...liveStats } } : null);
      } catch (err) {}
    });
    
    return () => {
      es.close();
    };
  }, [operator, loading, dateFrom, dateTo]);

  useEffect(() => {
    if (isAutoScroll && activeTab === 'logs') {
      logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isAutoScroll, activeTab]);

  const handleRefreshJobs = async () => {
    if (isArchiving) return;
    if (!window.confirm('Shift jobs older than 24 hours to dice_archived_jobs and clean up active scraped jobs?')) return;
    setIsArchiving(true);
    setArchiveResult(null);
    try {
      const res = await fetch('/api/dev/archive-jobs', { method: 'POST' });
      const data = await res.json();
      if (data.ok) {
        setArchiveResult(`Archived ${data.archived_count} jobs`);
        fetch(`/api/dev/overview?dateFrom=${dateFrom}&dateTo=${dateTo}`).then(r => r.json()).then(d => setOverview(d));
      } else setArchiveResult(`Failed: ${data.error}`);
    } catch (err) {
      setArchiveResult(`Error: ${err.message}`);
    } finally {
      setIsArchiving(false);
      setTimeout(() => setArchiveResult(null), 5000);
    }
  };

  const handleClientClick = async (client) => {
    setSelectedClientForPopup(client);
    setPopupJobFilter('ALL');
    setPopupStats(null);
    setPopupJobs([]);
    setIsPopupLoading(true);
    try {
      const res = await fetch(`/api/dev/client-stats?clientId=${client.client_id}&dateFrom=${dateFrom}&dateTo=${dateTo}`);
      const data = await res.json();
      if (data.ok) {
        setPopupStats(data.stats);
        setPopupJobs(data.jobs);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsPopupLoading(false);
    }
  };
  
  const closePopup = () => {
    setSelectedClientForPopup(null);
  };

  const toggleCAGroup = (caName) => {
    setExpandedCAs(prev => ({ ...prev, [caName]: !prev[caName] }));
  };

  if (loading) return <div className="h-screen bg-black flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div></div>;
  if (!operator || (operator.role !== 'admin' && operator.role !== 'manager')) return <Navigate to="/" />;

  // Filtered lists for dropdowns and views
  let caOptions = [];
  if (operator.role === 'admin') {
    const managers = [...new Set(caList.filter(ca => ca.manager_id).map(ca => ca.manager_name))].filter(Boolean);
    caOptions = [
      { label: 'All CAs', value: 'ALL' },
      { label: 'Admin (All)', value: 'ADMIN' },
      ...managers.map(m => ({ label: `Manager (${m})`, value: `MANAGER:${m}` })),
      ...caList.map(ca => ({ label: ca.name || ca.email, value: `CA:${ca.id}` }))
    ];
  } else {
    caOptions = [
      { label: 'All My CAs', value: 'ALL' },
      ...caList.map(ca => ({ label: ca.name || ca.email, value: `CA:${ca.id}` }))
    ];
  }

  // Filter allClients based on selected CA group for candidate dropdown
  const allowedClients = allClients.filter(c => {
    if (selectedCAGroup === 'ALL') return true;
    if (selectedCAGroup === 'ADMIN') return true;
    if (selectedCAGroup.startsWith('MANAGER:')) {
      const mName = selectedCAGroup.split(':')[1];
      const caMatches = caList.filter(ca => ca.manager_name === mName).map(ca => ca.id);
      return caMatches.includes(c.ca_id);
    }
    if (selectedCAGroup.startsWith('CA:')) {
      const caId = parseInt(selectedCAGroup.split(':')[1]);
      return c.ca_id === caId;
    }
    return true;
  });

  const uniqueCandidates = allowedClients;

  // Global filters for legacy tabs
  const filteredQueue = useMemo(() => {
    let q = overview?.queue || [];
    if (selectedCandidate !== 'ALL') q = q.filter(x => String(x.telegram_chat_id) === selectedCandidate);
    return q;
  }, [overview, selectedCandidate]);

  const filteredErrors = useMemo(() => {
    let e = overview?.applied_jobs?.filter(j => ['failed', 'preflight_failed', 'apply_failed'].includes(j.status)) || [];
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

  const filteredUsers = useMemo(() => {
    let u = overview?.active_users || [];
    if (selectedCandidate !== 'ALL') u = u.filter(x => String(x.telegram_chat_id) === selectedCandidate);
    return u;
  }, [overview, selectedCandidate]);

  // Derived stats
  const totalUsers = overview?.stats?.total_candidates || 0;
  const jobsSent = overview?.stats?.jobs_sent || 0;
  const yesCount = overview?.stats?.jobs_yes || 0;
  const noCount = overview?.stats?.jobs_no || 0;
  const missedCount = overview?.stats?.jobs_missed || 0;

  const getSessionStatus = (deadline) => {
    if (!deadline) return <span className="text-zinc-500">Not Started</span>;
    const deadlineTime = new Date(deadline).getTime();
    const now = Date.now();
    if (deadlineTime < now) return <span className="text-rose-400">Expired</span>;
    const diffMs = deadlineTime - now;
    const h = Math.floor(diffMs / 3600000);
    const m = Math.floor((diffMs % 3600000) / 60000);
    return <span className="text-emerald-400 font-medium">{h}h {m}m</span>;
  };

  // Group clients by CA for 'With CA' view
  const groupedClients = useMemo(() => {
    const groups = {};
    allowedClients.forEach(c => {
      const caName = c.ca_name || 'Unassigned';
      if (!groups[caName]) groups[caName] = [];
      groups[caName].push(c);
    });
    return groups;
  }, [allowedClients]);

  // Popup filtered jobs
  const filteredPopupJobs = useMemo(() => {
    if (popupJobFilter === 'ALL') return popupJobs;
    if (popupJobFilter === 'completed') return popupJobs.filter(j => j.status === 'completed');
    if (popupJobFilter === 'apply_failed') return popupJobs.filter(j => j.status === 'apply_failed');
    if (popupJobFilter === 'missed') return popupJobs.filter(j => j.status === 'skipped' || j.status === 'timeout');
    if (popupJobFilter === 'rejected') return popupJobs.filter(j => j.status === 'rejected');
    return popupJobs;
  }, [popupJobs, popupJobFilter]);

  return (
    <div className="flex flex-col h-screen bg-black text-slate-200 font-sans overflow-hidden">
      
      {/* 1. TOP HEADER / NAV BAR */}
      <div className="bg-[#0a0a0a] border-b border-white/5 px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-6">
          <Link to="/" className="text-white hover:text-emerald-400 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </Link>
          <span className="text-white font-semibold text-lg">Dice AutoEasyApply Admin Logs</span>
        </div>
        <div className="flex space-x-4 items-center">
          <span className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-md border border-emerald-500/20 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> CONNECTED
          </span>
        </div>
      </div>
      
      {/* 2. FIXED STATS ROW */}
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
          <div className="text-zinc-500 text-xs mb-1 uppercase tracking-wider font-bold">Successful Apps</div>
          <div className="text-white text-2xl font-semibold">{overview?.stats?.completed_today || 0}</div>
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

      {/* 3. SHARED FILTER BAR */}
      <div className="bg-[#0a0a0a] border-b border-white/5 px-6 py-3 shrink-0 flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <span className="text-xs text-zinc-500 font-medium">From:</span>
          <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="bg-black border border-white/10 text-white text-sm rounded-md px-3 py-1 outline-none focus:border-white/20 transition-colors" style={{ colorScheme: 'dark' }} />
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-zinc-500 font-medium">To:</span>
          <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="bg-black border border-white/10 text-white text-sm rounded-md px-3 py-1 outline-none focus:border-white/20 transition-colors" style={{ colorScheme: 'dark' }} />
        </div>
        <div className="h-4 w-px bg-white/10 mx-2"></div>
        
        <select value={selectedCAGroup} onChange={e => { setSelectedCAGroup(e.target.value); setSelectedCandidate('ALL'); }} className="bg-black border border-white/10 text-white text-sm rounded-md px-3 py-1 outline-none focus:border-white/20 w-48">
          {caOptions.map((opt, i) => <option key={i} value={opt.value}>{opt.label}</option>)}
        </select>
        
        <select value={selectedCandidate} onChange={e => setSelectedCandidate(e.target.value)} className="bg-black border border-white/10 text-white text-sm rounded-md px-3 py-1 outline-none focus:border-white/20 w-48">
          <option value="ALL">All Candidates ({uniqueCandidates.length})</option>
          {uniqueCandidates.map(u => (
            <option key={u.telegram_chat_id || u.client_id} value={u.telegram_chat_id}>{u.full_name || u.company_email}</option>
          ))}
        </select>
      </div>

      {/* 4. SPLIT LAYOUT */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT SIDEBAR */}
        <div className="bg-[#0a0a0a] border-r border-white/5 flex shrink-0 relative group" style={{ width: sidebarWidth }}>
          <div className="p-4 flex flex-col gap-2 w-full h-full overflow-hidden">
            <button onClick={() => setActiveTab('allStats')} className={`w-full text-left px-4 py-3 rounded-xl transition-all text-sm font-medium ${activeTab === 'allStats' ? 'bg-white text-black shadow-sm' : 'text-zinc-400 hover:bg-white/5 hover:text-white'} flex justify-between items-center`}>
              All Stats
              {activeTab !== 'allStats' && <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full">NEW</span>}
            </button>
            <button onClick={() => setActiveTab('logs')} className={`w-full text-left px-4 py-3 rounded-xl transition-all text-sm font-medium ${activeTab === 'logs' ? 'bg-white text-black shadow-sm' : 'text-zinc-400 hover:bg-white/5 hover:text-white'}`}>Live Logs</button>
            <button onClick={() => setActiveTab('workers')} className={`w-full text-left px-4 py-3 rounded-xl transition-all text-sm font-medium ${activeTab === 'workers' ? 'bg-white text-black shadow-sm' : 'text-zinc-400 hover:bg-white/5 hover:text-white'}`}>Apply Workers</button>
            <button onClick={() => setActiveTab('errors')} className={`w-full text-left px-4 py-3 rounded-xl transition-all text-sm font-medium ${activeTab === 'errors' ? 'bg-white text-black shadow-sm' : 'text-zinc-400 hover:bg-white/5 hover:text-white'}`}>Error Diagnostics</button>
            <button onClick={() => setActiveTab('users')} className={`w-full text-left px-4 py-3 rounded-xl transition-all text-sm font-medium ${activeTab === 'users' ? 'bg-white text-black shadow-sm' : 'text-zinc-400 hover:bg-white/5 hover:text-white'}`}>Telegram Users</button>

            {operator?.role === 'admin' && (
              <div className="mt-auto pt-3 border-t border-white/5 shrink-0">
                <button type="button" disabled={isArchiving} onClick={handleRefreshJobs} className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 text-xs font-semibold tracking-wide transition-all disabled:opacity-50 cursor-pointer">
                  {isArchiving ? 'Refreshing...' : 'Refresh jobs'}
                </button>
                {archiveResult && <p className="mt-1.5 text-[11px] text-center text-emerald-400 truncate">{archiveResult}</p>}
              </div>
            )}
          </div>
          <div className="absolute top-0 right-0 w-1.5 h-full cursor-col-resize hover:bg-white/10 z-10" onMouseDown={startResizing} />
        </div>

        {/* RIGHT PANE CONTENT */}
        <div className="flex-1 bg-black p-6 overflow-y-auto custom-scrollbar relative">
          
          {activeTab === 'allStats' && (
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center mb-6 shrink-0">
                <h3 className="text-white text-lg font-medium">All Candidates &amp; Workflows</h3>
                <div className="flex bg-white/5 p-1 rounded-lg border border-white/10 text-sm">
                  <button onClick={() => setWithCA(true)} className={`px-4 py-1.5 rounded-md font-medium transition ${withCA ? 'bg-white text-black shadow' : 'text-zinc-400 hover:text-white'}`}>With CA</button>
                  <button onClick={() => setWithCA(false)} className={`px-4 py-1.5 rounded-md font-medium transition ${!withCA ? 'bg-white text-black shadow' : 'text-zinc-400 hover:text-white'}`}>Without CA</button>
                </div>
              </div>

              {!withCA ? (
                // WITHOUT CA: Flat table
                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-black text-zinc-500 text-xs uppercase tracking-wider border-b border-white/5">
                      <tr>
                        <th className="px-6 py-4 font-medium">Candidate</th>
                        <th className="px-6 py-4 font-medium">Email</th>
                        <th className="px-6 py-4 font-medium">CA Name</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {allowedClients.length === 0 ? (
                        <tr><td colSpan="3" className="px-6 py-4 text-center text-zinc-500">No candidates found in this group.</td></tr>
                      ) : allowedClients.map(c => (
                        <tr key={c.client_id} onClick={() => handleClientClick(c)} className="hover:bg-white/5 transition cursor-pointer">
                          <td className="px-6 py-4 text-white font-medium">{c.full_name || 'N/A'}</td>
                          <td className="px-6 py-4 text-zinc-400">{c.company_email}</td>
                          <td className="px-6 py-4 text-zinc-400">{c.ca_name}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                // WITH CA: Accordion
                <div className="space-y-4">
                  {Object.entries(groupedClients).map(([caName, clients]) => (
                    <div key={caName} className="bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden">
                      <div onClick={() => toggleCAGroup(caName)} className="flex justify-between items-center p-4 bg-white/5 border-b border-white/5 cursor-pointer hover:bg-white/10 transition">
                        <div className="flex items-center space-x-3">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`text-zinc-400 transition-transform ${expandedCAs[caName] ? '' : '-rotate-90'}`}><path d="m6 9 6 6 6-6"/></svg>
                          <h4 className="text-white font-medium">{caName}</h4>
                        </div>
                        <span className="text-xs text-zinc-500 font-mono">{clients.length} Candidates</span>
                      </div>
                      
                      {expandedCAs[caName] && (
                        <table className="w-full text-left text-sm">
                          <tbody className="divide-y divide-white/5">
                            {clients.map(c => (
                              <tr key={c.client_id} onClick={() => handleClientClick(c)} className="hover:bg-white/5 transition cursor-pointer">
                                <td className="px-10 py-3 text-white font-medium">{c.full_name || 'N/A'}</td>
                                <td className="px-6 py-3 text-zinc-400">{c.company_email}</td>
                                <td className="px-6 py-3 text-right">
                                  <button className="text-xs px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded hover:bg-emerald-500/20 transition">View Stats →</button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  ))}
                  {Object.keys(groupedClients).length === 0 && <div className="text-zinc-500 text-center py-8">No CA groups found.</div>}
                </div>
              )}
            </div>
          )}

          {/* OTHER TABS OMITTED FOR BREVITY BUT KEPT EXACTLY THE SAME... */}
          {activeTab === 'logs' && (
            <div className="h-full flex flex-col">
              <div className="flex justify-between items-center mb-4 shrink-0">
                <h3 className="text-white text-lg font-medium">Live Audit Stream</h3>
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
                  {filteredLogs.length === 0 ? <div className="text-zinc-500 italic">Waiting for events...</div> : filteredLogs.map((log, idx) => {
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
                  })}
                  <div ref={logsEndRef} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'workers' && (
            <div className="h-full flex flex-col">
              <h3 className="text-white text-lg font-medium mb-6 shrink-0">Apply Workers & Queue Status</h3>
              <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 mb-6 shrink-0">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-zinc-400 font-medium">Active Worker Processes</h4>
                  <span className="text-xs font-mono text-zinc-500">{overview?.stats?.queue_running || 0} Online</span>
                </div>
                <div className="flex space-x-4 overflow-x-auto custom-scrollbar pb-2">
                  {(!filteredQueue || filteredQueue.filter(q => q.status === 'running').length === 0) ? (
                    <div className="text-zinc-500 text-sm italic">No workers currently processing jobs. Queue is idle.</div>
                  ) : filteredQueue.filter(q => q.status === 'running').map(q => (
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
                  ))}
                </div>
              </div>
              <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 flex-1 flex flex-col min-h-0">
                  <div className="flex justify-between items-center mb-4 shrink-0">
                    <h4 className="text-zinc-400 font-medium">Preflight Status</h4>
                    <span className="text-xs font-mono text-zinc-500">{filteredQueue.filter(q => ['preflight_queued', 'preflight_running', 'preflight_passed', 'preflight_failed', 'prompt_sent'].includes(q.status)).length} Jobs</span>
                  </div>
                  <div className="space-y-3 overflow-y-auto custom-scrollbar flex-1 pr-2">
                    {(() => {
                      const preflightJobs = filteredQueue.filter(q => ['preflight_queued', 'preflight_running', 'preflight_passed', 'preflight_failed', 'prompt_sent'].includes(q.status));
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
                             <div className={`text-[10px] px-2.5 py-1 inline-block rounded font-bold uppercase tracking-wider ${q.status === 'preflight_failed' || q.status === 'failed' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : q.status.includes('running') ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : q.status === 'completed' || q.status === 'preflight_passed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20'}`}>{q.status}</div>
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 flex-1 flex flex-col min-h-0">
                  <div className="flex justify-between items-center mb-4 shrink-0">
                    <h4 className="text-zinc-400 font-medium">Application Automation Status</h4>
                    <span className="text-xs font-mono text-zinc-500">{filteredQueue.filter(q => ['queued', 'running', 'completed', 'apply_failed', 'failed'].includes(q.status)).length} Jobs</span>
                  </div>
                  <div className="space-y-3 overflow-y-auto custom-scrollbar flex-1 pr-2">
                    {(() => {
                      const appJobs = filteredQueue.filter(q => ['queued', 'running', 'completed', 'apply_failed', 'failed'].includes(q.status));
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
                             <div className={`text-[10px] px-2.5 py-1 inline-block rounded font-bold uppercase tracking-wider ${q.status === 'apply_failed' || q.status === 'failed' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : q.status === 'running' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : q.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20'}`}>{q.status}</div>
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
              <h3 className="text-white text-lg font-medium mb-6">Error Diagnostics</h3>
              <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-black text-zinc-500 text-xs uppercase tracking-wider">
                    <tr><th className="px-6 py-4 font-medium">Timestamp</th><th className="px-6 py-4 font-medium">Candidate</th><th className="px-6 py-4 font-medium">Fail</th><th className="px-6 py-4 font-medium w-1/2">Reason</th><th className="px-6 py-4 font-medium">Action</th></tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredErrors.length === 0 ? <tr><td colSpan="5" className="px-6 py-4 text-zinc-500 text-center">No recent application failures.</td></tr> : filteredErrors.map(err => (
                      <tr key={err.id}>
                        <td className="px-6 py-4 text-zinc-400 whitespace-nowrap">{new Date(err.applied_at).toLocaleTimeString()}</td>
                        <td className="px-6 py-4 text-white font-medium whitespace-nowrap">{err.client_name || err.client_id}</td>
                        <td className="px-6 py-4"><span className="px-2 py-1 text-[10px] uppercase font-bold tracking-wider rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">{err.status}</span></td>
                        <td className="px-6 py-4 text-rose-400 break-words">{err.reason || err.status_details}</td>
                        <td className="px-6 py-4 whitespace-nowrap"><a href={err.url || err.job_url} target="_blank" rel="noreferrer" className="text-xs px-3 py-1 bg-white/10 text-white rounded hover:bg-white/20 transition">View Job</a></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div>
              <h3 className="text-white text-lg font-medium mb-6">Telegram Users & Workflows</h3>
              <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-black text-zinc-500 text-xs uppercase tracking-wider">
                    <tr><th className="px-6 py-4 font-medium">Candidate Name</th><th className="px-6 py-4 font-medium">Email</th><th className="px-6 py-4 font-medium">CA Name</th><th className="px-6 py-4 font-medium text-center">Total NOs (Today)</th><th className="px-6 py-4 font-medium">9-Hour Window</th></tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredUsers.length === 0 ? <tr><td colSpan="5" className="px-6 py-4 text-zinc-500 text-center">No users found.</td></tr> : filteredUsers.map(u => (
                      <tr key={u.client_id}>
                        <td className="px-6 py-4 text-white font-medium">{u.full_name || 'N/A'}</td>
                        <td className="px-6 py-4 text-zinc-400">{u.company_email}</td>
                        <td className="px-6 py-4 text-zinc-400">{u.ca_name || 'Unassigned'}</td>
                        <td className="px-6 py-4 text-center text-zinc-300 font-mono bg-white/5">{u.no_count || 0}</td>
                        <td className="px-6 py-4">{getSessionStatus(u.session_deadline)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* 5. POPUP */}
      {selectedClientForPopup && (
        <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-8" onClick={(e) => { if (e.target === e.currentTarget) closePopup(); }}>
          <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl w-full max-w-5xl h-[85vh] shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-white/10 shrink-0">
              <div>
                <h2 className="text-xl font-semibold text-white">{selectedClientForPopup.full_name}</h2>
                <div className="text-sm text-zinc-400 mt-1 flex space-x-3 items-center">
                  <span>{selectedClientForPopup.company_email}</span>
                  <span className="w-1 h-1 rounded-full bg-white/20"></span>
                  <span>CA: {selectedClientForPopup.ca_name}</span>
                  <span className="w-1 h-1 rounded-full bg-white/20"></span>
                  <span className="text-emerald-400">{dateFrom} — {dateTo}</span>
                </div>
              </div>
              <button onClick={closePopup} className="p-2 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>

            {isPopupLoading ? (
              <div className="flex-1 flex items-center justify-center text-zinc-500">Loading stats...</div>
            ) : (
              <>
                <div className="p-6 border-b border-white/5 flex gap-4 shrink-0 bg-black/30 overflow-x-auto">
                  <div className="bg-[#050505] border border-white/5 p-4 rounded-xl flex-1 min-w-[120px]">
                    <div className="text-emerald-500/70 text-[10px] mb-1 uppercase tracking-wider font-bold">Successfully Applied</div>
                    <div className="text-white text-2xl font-semibold">{popupStats?.completed_count || 0}</div>
                  </div>
                  <div className="bg-[#050505] border border-white/5 p-4 rounded-xl flex-1 min-w-[120px]">
                    <div className="text-zinc-500 text-[10px] mb-1 uppercase tracking-wider font-bold">Jobs Sent</div>
                    <div className="text-blue-400 text-2xl font-semibold">{popupStats?.jobs_sent_count || 0}</div>
                  </div>
                  <div className="bg-[#050505] border border-white/5 p-4 rounded-xl flex-1 min-w-[120px]">
                    <div className="text-zinc-500 text-[10px] mb-1 uppercase tracking-wider font-bold">YES</div>
                    <div className="text-emerald-400 text-2xl font-semibold">{popupStats?.yes_count || 0}</div>
                  </div>
                  <div className="bg-[#050505] border border-white/5 p-4 rounded-xl flex-1 min-w-[120px]">
                    <div className="text-zinc-500 text-[10px] mb-1 uppercase tracking-wider font-bold">NO</div>
                    <div className="text-rose-400 text-2xl font-semibold">{popupStats?.no_count || 0}</div>
                  </div>
                  <div className="bg-[#050505] border border-white/5 p-4 rounded-xl flex-1 min-w-[120px]">
                    <div className="text-zinc-500 text-[10px] mb-1 uppercase tracking-wider font-bold">SKIPPED</div>
                    <div className="text-amber-400 text-2xl font-semibold">{popupStats?.skipped_count || 0}</div>
                  </div>
                </div>

                <div className="flex-1 flex flex-col overflow-hidden">
                  <div className="p-4 border-b border-white/5 flex space-x-2 shrink-0 overflow-x-auto">
                    {['ALL', 'completed', 'missed', 'rejected', 'apply_failed'].map(f => (
                      <button key={f} onClick={() => setPopupJobFilter(f)} className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition ${popupJobFilter === f ? 'bg-white/10 text-white' : 'text-zinc-400 hover:bg-white/5'}`}>
                        {f === 'ALL' ? 'All Jobs' : f.charAt(0).toUpperCase() + f.slice(1).replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                  
                  <div className="overflow-y-auto flex-1 custom-scrollbar">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-[#050505] text-zinc-500 text-xs uppercase tracking-wider sticky top-0 border-b border-white/5 shadow-sm">
                        <tr>
                          <th className="px-6 py-3 font-medium">Job Name (Company)</th>
                          <th className="px-6 py-3 font-medium">URL</th>
                          <th className="px-6 py-3 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {filteredPopupJobs.length === 0 ? (
                          <tr><td colSpan="3" className="px-6 py-4 text-zinc-500 text-center">No jobs found for this filter.</td></tr>
                        ) : filteredPopupJobs.map((job, idx) => (
                          <tr key={idx} className="hover:bg-white/5">
                            <td className="px-6 py-4 text-white font-medium">{job.job_name}</td>
                            <td className="px-6 py-4"><a href={job.url} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline text-xs max-w-xs block truncate" title={job.url}>{job.url}</a></td>
                            <td className="px-6 py-4">
                              <span className={`px-2.5 py-1 text-[10px] uppercase font-bold rounded ${job.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : job.status === 'apply_failed' || job.status === 'rejected' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : job.status === 'skipped' || job.status === 'timeout' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'} border`}>
                                {job.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
"""

with open("frontend/src/pages/DevLogs.jsx", "w") as f:
    f.write(new_code)
