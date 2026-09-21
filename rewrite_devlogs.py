import re

with open('frontend/src/pages/DevLogs.jsx', 'w') as f:
    f.write("""import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';

export default function DevLogs() {
  const { operator, loading } = useAuth();
  
  const [activeTab, setActiveTab] = useState('logs');
  const [overview, setOverview] = useState(null);
  const [logs, setLogs] = useState([]);
  const [isAutoScroll, setIsAutoScroll] = useState(true);
  
  const logsEndRef = useRef(null);

  useEffect(() => {
    // Change document title and favicon dynamically for Dev Logs
    const originalTitle = document.title;
    const favicon = document.querySelector("link[rel~='icon']");
    const originalFavicon = favicon ? favicon.href : '/Applywizz_logo.jpeg';
    
    document.title = "DevLogs";
    if (favicon) favicon.href = "/code.png";
    
    return () => {
      document.title = originalTitle;
      if (favicon) favicon.href = originalFavicon;
    };
  }, []);

  useEffect(() => {
    if (loading || !operator || (operator.role !== 'admin' && operator.role !== 'manager')) return;

    // Fetch initial overview
    fetch('/api/dev/overview')
      .then(res => res.json())
      .then(data => setOverview(data))
      .catch(err => console.error('Failed to fetch dev overview:', err));

    // Connect SSE
    const es = new EventSource('/api/dev/stream');
    
    es.addEventListener('audit_events', (e) => {
      try {
        const newEvents = JSON.parse(e.data);
        setLogs(prev => [...prev, ...newEvents].slice(-200));
      } catch (err) {}
    });
    
    return () => es.close();
  }, [operator, loading]);

  useEffect(() => {
    if (isAutoScroll && activeTab === 'logs') {
      logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isAutoScroll, activeTab]);

  if (loading) return <div className="h-screen bg-black flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div></div>;
  if (!operator || (operator.role !== 'admin' && operator.role !== 'manager')) return <Navigate to="/" />;

  // Derived stats
  const totalUsers = overview?.users?.length || 0;
  const jobsSent = overview?.global_stats?.prompts?.total || 0;
  const yesCount = overview?.global_stats?.prompts?.yes || 0;
  const noCount = overview?.global_stats?.prompts?.no || 0;
  const missedCount = overview?.global_stats?.prompts?.missed || 0;

  return (
    <div className="flex flex-col h-screen bg-black text-slate-200 font-sans overflow-hidden">
      
      {/* 1. TOP HEADER / NAV BAR */}
      <div className="bg-[#0a0a0a] border-b border-white/5 px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-6">
          <Link to="/" className="text-white hover:text-emerald-400 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </Link>
          <span className="text-white font-semibold text-lg flex items-center space-x-2">
            <img src="/code.png" alt="Code Logo" className="w-5 h-5 rounded" onError={(e) => e.target.style.display='none'} />
            <span>Dice AutoEasyApply Admin Logs</span>
          </span>
          <div className="h-5 w-px bg-white/10"></div>
          
          {/* Global Filters */}
          <div className="flex space-x-3">
            <select className="bg-black border border-white/10 text-white text-sm rounded-lg px-4 py-1.5 outline-none focus:border-white/20 transition-colors">
              <option>All CAs</option>
            </select>
            <select className="bg-black border border-white/10 text-white text-sm rounded-lg px-4 py-1.5 outline-none focus:border-white/20 transition-colors">
              <option>All Candidates</option>
            </select>
          </div>
        </div>
        
        <div className="flex space-x-4 items-center">
          <span className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-md border border-emerald-500/20 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> SYSTEM HEALTHY
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
        
        {/* Left Sidebar Pane (Sections) */}
        <div className="w-64 bg-[#0a0a0a] border-r border-white/5 p-4 flex flex-col gap-2 shrink-0">
          <button 
            onClick={() => setActiveTab('logs')}
            className={`w-full text-left px-4 py-3 rounded-xl transition-all text-sm font-medium ${activeTab === 'logs' ? 'bg-white text-black shadow-sm' : 'text-zinc-400 hover:bg-white/5 hover:text-white'}`}
          >
            Live Logs
          </button>
          <button 
            onClick={() => setActiveTab('workers')}
            className={`w-full text-left px-4 py-3 rounded-xl transition-all text-sm font-medium ${activeTab === 'workers' ? 'bg-white text-black shadow-sm' : 'text-zinc-400 hover:bg-white/5 hover:text-white'}`}
          >
            Apply Workers
          </button>
          <button 
            onClick={() => setActiveTab('errors')}
            className={`w-full text-left px-4 py-3 rounded-xl transition-all text-sm font-medium ${activeTab === 'errors' ? 'bg-white text-black shadow-sm' : 'text-zinc-400 hover:bg-white/5 hover:text-white'}`}
          >
            Error Diagnostics
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`w-full text-left px-4 py-3 rounded-xl transition-all text-sm font-medium ${activeTab === 'users' ? 'bg-white text-black shadow-sm' : 'text-zinc-400 hover:bg-white/5 hover:text-white'}`}
          >
            Telegram Users
          </button>
          <button 
            onClick={() => setActiveTab('health')}
            className={`w-full text-left px-4 py-3 rounded-xl transition-all text-sm font-medium ${activeTab === 'health' ? 'bg-white text-black shadow-sm' : 'text-zinc-400 hover:bg-white/5 hover:text-white'}`}
          >
            System Health
          </button>
        </div>

        {/* Right Content Area (Dynamic based on selected section) */}
        <div className="flex-1 bg-black p-6 overflow-y-auto custom-scrollbar">
          
          {activeTab === 'logs' && (
            <div className="h-full flex flex-col">
              <div className="flex justify-between items-center mb-4 shrink-0">
                <h3 className="text-white text-lg font-medium">Live Audit Stream</h3>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2 text-sm text-zinc-400 cursor-pointer">
                    <input type="checkbox" checked={isAutoScroll} onChange={e => setIsAutoScroll(e.target.checked)} className="accent-white" />
                    <span>Auto-scroll</span>
                  </label>
                  <input type="text" placeholder="Grep logs..." className="bg-[#0a0a0a] border border-white/5 text-sm text-white px-3 py-1.5 rounded-lg outline-none focus:border-white/20 w-64" />
                </div>
              </div>
              <div className="flex-1 bg-[#050505] border border-white/5 rounded-2xl p-6 font-mono text-xs overflow-y-auto custom-scrollbar shadow-inner">
                <div className="space-y-2">
                  {logs.length === 0 ? (
                    <div className="text-zinc-500 italic">Waiting for real-time audit events...</div>
                  ) : (
                    logs.map((log, idx) => {
                      const time = new Date(log.created_at).toLocaleTimeString();
                      const isError = log.event.includes('error') || log.event.includes('fail');
                      return (
                        <div key={idx} className={`flex gap-4 p-1.5 rounded transition-colors break-words ${isError ? 'bg-rose-500/5 text-rose-300' : 'text-zinc-400 hover:bg-white/5'}`}>
                          <span className="text-zinc-600 shrink-0 w-16">{time}</span>
                          <span className={`${isError ? 'text-rose-400' : 'text-indigo-400'} shrink-0 w-24 font-bold`}>[{log.event.toUpperCase()}]</span>
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
            <div>
              <h3 className="text-white text-lg font-medium mb-6">Apply Workers & Queue Status</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6">
                  <h4 className="text-zinc-400 font-medium mb-4">Active Workers</h4>
                  <div className="space-y-3">
                    <div className="text-zinc-500 text-sm">Workers dynamically spin up based on queue load in the background.</div>
                  </div>
                </div>
                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6">
                  <h4 className="text-zinc-400 font-medium mb-4">Jobs Queued for Playwright</h4>
                  <div className="space-y-3">
                    {(!overview?.queue || overview.queue.length === 0) ? (
                      <div className="text-zinc-500 text-sm">Queue is empty.</div>
                    ) : (
                      overview.queue.map(q => (
                        <div key={q.id} className="p-3 bg-black rounded-xl border border-white/5">
                          <div className="text-sm text-white font-medium mb-1">Queue ID: {q.id}</div>
                          <div className="text-xs text-zinc-500 truncate">Target: {q.url}</div>
                          <div className="text-xs text-blue-400 mt-1">Status: {q.status}</div>
                        </div>
                      ))
                    )}
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
                    <tr>
                      <th className="px-6 py-4 font-medium">Timestamp</th>
                      <th className="px-6 py-4 font-medium">Candidate</th>
                      <th className="px-6 py-4 font-medium">Reason</th>
                      <th className="px-6 py-4 font-medium">Job URL</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {(!overview?.failures || overview.failures.length === 0) ? (
                      <tr><td colSpan="4" className="px-6 py-4 text-zinc-500 text-center">No recent application failures.</td></tr>
                    ) : (
                      overview.failures.map(err => (
                        <tr key={err.id}>
                          <td className="px-6 py-4 text-zinc-400 whitespace-nowrap">{new Date(err.applied_at).toLocaleTimeString()}</td>
                          <td className="px-6 py-4 text-white">{err.client_name || err.client_id}</td>
                          <td className="px-6 py-4 text-rose-400">{err.status_details || err.status}</td>
                          <td className="px-6 py-4"><a href={err.job_url} target="_blank" rel="noreferrer" className="text-xs px-3 py-1 bg-white/10 text-white rounded hover:bg-white/20 transition">View Link</a></td>
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
              <h3 className="text-white text-lg font-medium mb-6">Telegram Users & Workflows</h3>
              <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-black text-zinc-500 text-xs uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4 font-medium">Candidate</th>
                      <th className="px-6 py-4 font-medium">Email</th>
                      <th className="px-6 py-4 font-medium">CA ID</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {(!overview?.users || overview.users.length === 0) ? (
                      <tr><td colSpan="3" className="px-6 py-4 text-zinc-500 text-center">No users found.</td></tr>
                    ) : (
                      overview.users.map(u => (
                        <tr key={u.id}>
                          <td className="px-6 py-4 text-white font-medium">{u.full_name}</td>
                          <td className="px-6 py-4 text-zinc-400">{u.company_email}</td>
                          <td className="px-6 py-4 text-zinc-500">{u.career_associate_id}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'health' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-white text-lg font-medium">System Health</h3>
                <span className="text-[10px] text-zinc-500 border border-white/10 px-3 py-1 rounded-full bg-black uppercase tracking-wider font-bold">Node runtime</span>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6">
                  <h4 className="text-zinc-400 font-medium mb-6">Node Memory Usage</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white font-medium">RSS Memory</span>
                      <span className="text-zinc-400 font-mono">{overview?.system?.memory?.rss || '?'} MB</span>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/5 flex justify-between text-xs text-zinc-500">
                      <span>Status: <span className="text-emerald-500 font-bold">Healthy</span></span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6">
                  <h4 className="text-zinc-400 font-medium mb-4">Node Runtime Environment</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-black p-4 rounded-xl border border-white/5">
                      <div className="text-xs text-zinc-500 mb-1">Node Version</div>
                      <div className="text-sm font-mono text-white">{overview?.system?.nodeVersion || 'v22.x'}</div>
                    </div>
                    <div className="bg-black p-4 rounded-xl border border-white/5">
                      <div className="text-xs text-zinc-500 mb-1">Process Uptime</div>
                      <div className="text-sm font-mono text-white">{overview?.system?.uptimeLong || '?'}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
""");
