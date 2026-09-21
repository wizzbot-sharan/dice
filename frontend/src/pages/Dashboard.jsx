import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { QrCode, Link as LinkIcon, RefreshCw, ChevronDown, ChevronUp, LogOut, Check, X, Calendar, Globe, Menu, ChevronLeft, LayoutDashboard, BarChart2, Terminal } from 'lucide-react';

export default function Dashboard() {

  const { operator, logout } = useAuth();
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  const [showTelegramModal, setShowTelegramModal] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [expandedCandidate, setExpandedCandidate] = useState(null);
  const [candidateTab, setCandidateTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [mainTab, setMainTab] = useState('dashboard');
  const [expandedCAs, setExpandedCAs] = useState({});
  const toggleCA = (caName) => setExpandedCAs(prev => ({ ...prev, [caName]: !prev[caName] }));

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTimezone, setSelectedTimezone] = useState('UTC');
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    fetchDashboard();
  }, [selectedDate, selectedTimezone]);

  const fetchDashboard = async () => {
    try {
      const res = await axios.get(`/api/dashboard?date=${selectedDate}&timezone=${selectedTimezone}&timezone_name=${selectedTimezone}`);
      setData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleGlobalSync = async () => {
    setIsSyncing(true);
    try {
      await axios.post('/api/sync-mappings');
      await fetchDashboard();
    } catch (err) {
      console.error(err);
    }
    setIsSyncing(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const toggleCandidate = (id, isLinked) => {
    if (!isLinked) return;
    setExpandedCandidate(expandedCandidate === id ? null : id);
    setCandidateTab('dashboard');
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const caGroups = {};
  if (data?.users) {
    data.users.forEach(u => {
      const caName = u.ca_name || 'Unassigned';
      if (!caGroups[caName]) caGroups[caName] = [];
      caGroups[caName].push(u);
    });
  }

  return (
    <div className="flex h-screen bg-black text-zinc-200 font-sans overflow-hidden">
      
      {/* --- Notion-style Collapsible Left Sidebar --- */}
      <aside 
        className={`relative flex flex-col bg-[#0a0a0a] border-r border-white/5 transition-all duration-300 ease-in-out z-40
          ${isSidebarOpen ? 'w-64 px-4' : 'w-0 px-0 opacity-0 overflow-hidden'}
        `}
      >
        {/* Top Section (Left Stuff) */}
        <div className="pt-6 pb-4 border-b border-white/5 flex items-center justify-between min-w-[224px]">
          <div className="flex items-center space-x-3">
            <img src="/Applywizz_logo.jpeg" alt="Applywizz Logo" className="w-8 h-8 rounded-lg object-cover shadow-sm shrink-0" />
            <span className="font-semibold text-white tracking-wide truncate">DICE AutoEasyApply</span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="text-zinc-500 hover:text-white p-1 rounded-md hover:bg-white/5 transition-colors shrink-0"
          >
            <ChevronLeft size={18} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 space-y-1 min-w-[224px]">
          <button onClick={() => setMainTab('dashboard')} className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg font-medium transition-colors ${mainTab === 'dashboard' ? 'bg-white/10 text-white border border-white/5' : 'text-zinc-400 hover:bg-white/5 hover:text-white'}`}>
            <LayoutDashboard size={16} className={mainTab === 'dashboard' ? "text-white" : "text-zinc-500"} />
            <span>Dashboard</span>
          </button>
          <button onClick={() => setMainTab('stats')} className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg font-medium transition-colors ${mainTab === 'stats' ? 'bg-white/10 text-white border border-white/5' : 'text-zinc-400 hover:bg-white/5 hover:text-white'}`}>
            <BarChart2 size={16} className={mainTab === 'stats' ? "text-white" : "text-zinc-500"} />
            <span>Stats</span>
          </button>
        </nav>

        {/* Bottom Section (Right Stuff) */}
        <div className="pb-6 pt-4 border-t border-white/5 space-y-2 min-w-[224px]">
          <Link to="/dev" target="_blank" className="w-full flex items-center space-x-3 px-3 py-2 text-zinc-300 hover:bg-white/5 hover:text-white rounded-lg text-sm font-medium transition-colors">
            <Terminal size={16} className="text-purple-400" />
            <span>Dev Logs</span>
          </Link>

          <button 
            onClick={() => setShowTelegramModal(true)}
            className="w-full flex items-center space-x-3 px-3 py-2 text-zinc-300 hover:bg-white/5 hover:text-white rounded-lg text-sm font-medium transition-colors"
          >
            <QrCode size={16} className="text-blue-400" />
            <span>Telegram Link</span>
          </button>
          
          <div className="relative mt-2 pt-2 border-t border-white/5">
            <button 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="w-full flex items-center space-x-3 px-2 py-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-tr from-slate-700 to-slate-600 rounded-full flex items-center justify-center border border-white/5 shrink-0">
                <span className="font-semibold text-white text-xs">{operator?.name?.[0]?.toUpperCase() || 'O'}</span>
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm text-white font-medium truncate">{operator?.name || operator?.email || 'Operator'}</p>
                <p className="text-xs text-zinc-500 truncate capitalize">{operator?.role || 'Manager'}</p>
              </div>
            </button>
            
            {showProfileMenu && (
              <div className="absolute bottom-full left-0 mb-2 w-full bg-[#0a0a0a] border border-white/5 rounded-xl shadow-2xl py-1 z-50 overflow-hidden">
                <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-white/5 flex items-center space-x-2 transition-colors m-1 rounded-lg">
                  <LogOut size={16} />
                  <span>Log out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* --- Main Content Area --- */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        
        {/* Top Control Bar */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-white/5 shrink-0 bg-black relative z-30">
          <div className="flex items-center min-w-[40px] flex-1">
            {!isSidebarOpen && (
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="text-zinc-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <Menu size={20} />
              </button>
            )}
          </div>
          
          {/* Centered Date/Timezone with hover animation */}
          <div className="flex items-center justify-center shrink-0">
            <div className="flex items-center bg-[#0a0a0a] px-5 py-2 rounded-full border border-white/5 shadow-sm hover:border-white/10 hover:shadow-md transition-all duration-300 ease-out group">
              <div className="flex items-center space-x-2">
                <Calendar size={14} className="text-zinc-500 group-hover:text-white transition-colors shrink-0" />
                <input 
                  type="date" 
                  value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-transparent border-none text-zinc-300 text-sm focus:ring-0 outline-none cursor-pointer p-0 w-[110px]"
                />
              </div>
              <div className="w-px h-4 bg-white/10 mx-3 sm:mx-4 shrink-0"></div>
              <div className="flex items-center space-x-2">
                <Globe size={14} className="text-zinc-500 group-hover:text-white transition-colors shrink-0" />
                <select value={selectedTimezone} onChange={(e) => setSelectedTimezone(e.target.value)} className="bg-transparent border-none text-zinc-300 text-sm focus:ring-0 outline-none cursor-pointer p-0 min-w-[110px]">
                  <option>Browser local</option>
                  <option>UTC</option>
                </select>
              </div>
            </div>
          </div>

          <div className="min-w-[40px] flex-1"></div> {/* Spacer for flex balance */}
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 lg:px-12 relative z-20">
          {mainTab === 'dashboard' && (
<div className="max-w-4xl mx-auto">
            
            {/* === GLOBAL ADMIN HEADER === */}
            <div className="mb-12 p-8 bg-gradient-to-br from-[#1a1a1a] to-[#111111] border border-white/5 rounded-3xl flex items-center justify-between shadow-lg">
              <div>
                <h1 className="text-3xl font-semibold text-white mb-2 tracking-tight">Admin Overview</h1>
                <p className="text-zinc-400 text-sm">Managing all CAs and candidates</p>
              </div>
              <button onClick={handleGlobalSync} disabled={isSyncing} className={`flex items-center space-x-2 px-6 py-2.5 bg-white text-black hover:bg-slate-200 font-semibold rounded-full shadow-sm transition-colors ${isSyncing ? "opacity-50" : ""}`}>
                <RefreshCw size={16} className={isSyncing ? "animate-spin" : ""} />
                <span>{isSyncing ? "Syncing..." : "Global Sync"}</span>
              </button>
            </div>

            
            {/* Dynamic CA Groups */}
            {(operator?.role === 'admin' || operator?.role === 'manager') ? (
              Object.entries(caGroups).map(([caName, candidates]) => {
                const isCaExpanded = expandedCAs[caName];
                const totalCandidates = candidates.length;
                const connectedCandidates = candidates.filter(c => c.telegram_chat_id).length;
                const activeSessions = candidates.filter(c => c.session?.session_deadline && new Date(c.session.session_deadline).getTime() > Date.now()).length;

                return (
                  <div key={caName} className="mb-6">
                    {/* CA Header Button */}
                    <button 
                      onClick={() => toggleCA(caName)}
                      className="w-full text-left bg-[#0a0a0a] hover:bg-white/5 border border-white/5 rounded-2xl px-6 py-5 flex items-center justify-between transition-colors shadow-sm group"
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-lg transition-colors ${isCaExpanded ? 'bg-white/10 text-white' : 'bg-white/5 text-zinc-400 group-hover:text-zinc-300'}`}>
                          {isCaExpanded ? <ChevronDown size={20} /> : <ChevronLeft size={20} className="rotate-180" />}
                        </div>
                        <h2 className="text-xl font-medium text-white flex items-center space-x-2">
                          <span>{caName}</span>
                        </h2>
                      </div>

                      <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-2">
                          <div className="px-3 py-1 bg-white/5 text-zinc-400 text-sm font-medium rounded-full">
                            <span className="text-white mr-1">{totalCandidates}</span> Total
                          </div>
                          <div className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-sm font-medium rounded-full flex items-center space-x-1.5">
                            <Check size={12} strokeWidth={3} />
                            <span><span className="text-emerald-300 mr-1">{connectedCandidates}</span> Connected</span>
                          </div>
                          <div className="px-3 py-1 bg-blue-500/10 text-blue-400 text-sm font-medium rounded-full flex items-center space-x-1.5">
                            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></div>
                            <span><span className="text-blue-300 mr-1">{activeSessions}</span> Active</span>
                          </div>
                        </div>
                      </div>
                    </button>

                    {/* CA Candidates List (Collapsible) */}
                    {isCaExpanded && (
                      <div className="mt-4 pl-4 space-y-4 border-l-2 border-white/5 ml-6">
                        {candidates.map((user) => {
                          const isLinked = Boolean(user.telegram_chat_id);
                          const isExpanded = expandedCandidate === user.id;

                          return (
                            <div key={user.id} className={`bg-[#0a0a0a] border rounded-2xl overflow-hidden shadow-sm transition-all ${isLinked ? 'border-white/5 hover:border-white/10' : 'border-white/5 opacity-60'}`}>
                              <div 
                                onClick={() => toggleCandidate(user.id, isLinked)}
                                className={`px-6 py-4 flex items-center justify-between transition-colors ${isLinked ? 'cursor-pointer hover:bg-white/5' : 'cursor-default'}`}
                              >
                                <div className="flex items-center space-x-4">
                                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border ${isLinked ? 'bg-white/10 text-white border-white/10' : 'bg-white/5 text-zinc-300 border-white/5'}`}>
                                    {getInitials(user.full_name || user.company_email)}
                                  </div>
                                  <div>
                                    <h2 className="text-base font-medium text-white tracking-wide">{user.full_name || user.company_email || 'Unknown'}</h2>
                                    <p className="text-xs text-zinc-500 font-mono mt-0.5">{user.applywizz_id || user.id}</p>
                                  </div>
                                </div>
                                
                                <div className="flex items-center space-x-6">
                                  {isLinked ? (
                                    <span className="text-emerald-400 text-xs font-medium flex items-center space-x-2">
                                      <span>Telegram</span>
                                      <div className="bg-emerald-500/20 p-1 rounded-full">
                                        <Check size={12} strokeWidth={3} />
                                      </div>
                                    </span>
                                  ) : (
                                    <span className="text-red-400 text-xs font-medium flex items-center space-x-2">
                                      <span>Telegram</span>
                                      <div className="bg-red-500/20 p-1 rounded-full">
                                        <X size={12} strokeWidth={3} />
                                      </div>
                                    </span>
                                  )}
                                  
                                  {isLinked && (
                                    isExpanded ? <ChevronUp size={16} className="text-zinc-500" /> : <ChevronDown size={16} className="text-zinc-500" />
                                  )}
                                </div>
                              </div>

                              {isExpanded && (
                                <div className="bg-black border-t border-white/5">
                                  <div className="flex space-x-6 px-8 pt-4 border-b border-white/5">
                                    <button 
                                      onClick={(e) => { e.stopPropagation(); setCandidateTab('dashboard'); }}
                                      className={`pb-3 text-sm font-medium transition-colors ${candidateTab === 'dashboard' ? 'text-white border-b-2 border-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                                    >
                                      Dashboard
                                    </button>
                                    <button 
                                      onClick={(e) => { e.stopPropagation(); setCandidateTab('jobs'); }}
                                      className={`pb-3 text-sm font-medium transition-colors ${candidateTab === 'jobs' ? 'text-white border-b-2 border-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                                    >
                                      Jobs (Prompts)
                                    </button>
                                  </div>

                                  <div className="px-8 pb-8 pt-6">
                                    {candidateTab === 'dashboard' && (
                                      <div className="animate-in fade-in duration-300">
                                        <div className="grid grid-cols-3 gap-5 mb-10">
                                          <div className="bg-black p-5 rounded-2xl border border-white/5">
                                            <p className="text-xs text-zinc-500 font-medium mb-2 uppercase tracking-widest">Window Start</p>
                                            <p className="text-2xl font-mono text-white font-light">{user.session?.window_start_time || '--:--'}</p>
                                          </div>
                                          <div className="bg-black p-5 rounded-2xl border border-white/5">
                                            <p className="text-xs text-zinc-500 font-medium mb-2 uppercase tracking-widest">Window End</p>
                                            <p className="text-2xl font-mono text-white font-light">{user.session?.window_end_time || '--:--'}</p>
                                          </div>
                                          <div className="bg-zinc-900/30 p-5 rounded-2xl border border-white/5">
                                            <p className="text-xs text-white/70 font-medium mb-2 uppercase tracking-widest">Remaining</p>
                                            <p className="text-2xl font-mono text-white font-light">--</p>
                                          </div>
                                        </div>

                                        <div>
                                          <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-4">Applications Queue</h3>
                                          <div className="grid grid-cols-1 gap-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                                            {user.queue && user.queue.length > 0 ? user.queue.map((q, i) => (
                                              <div key={i} className="bg-black rounded-xl p-4 border border-white/5 flex justify-between items-center">
                                                <div>
                                                  <div className="space-x-2 mb-1.5">
                                                    <span className="px-2.5 py-0.5 bg-blue-500/10 text-blue-400 text-[11px] font-medium rounded-full">
                                                      {q.company || 'Company'}
                                                    </span>
                                                    <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 text-[11px] font-medium rounded-full">
                                                      {q.status}
                                                    </span>
                                                  </div>
                                                  <h4 className="text-white font-medium text-base">{q.job_title}</h4>
                                                </div>
                                                <a href={q.job_url} target="_blank" rel="noreferrer" className="text-white hover:text-zinc-300 text-sm font-medium px-4 py-1.5 bg-white/5 rounded-lg transition-colors">
                                                  View ↗
                                                </a>
                                              </div>
                                            )) : (
                                              <p className="text-zinc-500 text-sm">No items in queue.</p>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    )}

                                    {candidateTab === 'jobs' && (
                                      <div className="animate-in fade-in duration-300">
                                        <div className="grid grid-cols-4 gap-4 mb-8">
                                          <div className="bg-black p-4 rounded-xl border border-white/5">
                                            <p className="text-xs text-zinc-500 mb-1">Total</p>
                                            <p className="text-xl text-yellow-400 font-medium">{user.prompts_summary?.total || 0}</p>
                                          </div>
                                          <div className="bg-black p-4 rounded-xl border border-white/5">
                                            <p className="text-xs text-zinc-500 mb-1">Accepted</p>
                                            <p className="text-xl text-emerald-400 font-medium">{user.prompts_summary?.accepted || 0}</p>
                                          </div>
                                          <div className="bg-black p-4 rounded-xl border border-white/5">
                                            <p className="text-xs text-zinc-500 mb-1">Rejected</p>
                                            <p className="text-xl text-red-400 font-medium">{user.prompts_summary?.rejected || 0}</p>
                                          </div>
                                          <div className="bg-black p-4 rounded-xl border border-white/5">
                                            <p className="text-xs text-zinc-500 mb-1">Skipped</p>
                                            <p className="text-xl text-blue-400 font-medium">{user.prompts_summary?.skipped || 0}</p>
                                          </div>
                                        </div>

                                        <div>
                                          <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-4">Prompts Telemetry</h3>
                                          <div className="bg-black rounded-xl border border-white/5 divide-y divide-white/5 max-h-[500px] custom-scrollbar overflow-y-auto">
                                            {user.prompt_events && user.prompt_events.length > 0 ? user.prompt_events.map((p, i) => (
                                              <div key={i} className="px-5 py-3 flex items-center justify-between text-sm">
                                                <div className="flex items-center space-x-4">
                                                  <span className="text-zinc-500 font-mono text-xs">{new Date(p.sent_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                                  <span className="px-2 py-0.5 bg-white/10 text-white text-[11px] uppercase rounded">{p.decision || 'pending'}</span>
                                                  <span className="text-zinc-300 max-w-[200px] truncate">{p.job_title}</span>
                                                </div>
                                                <span className="text-zinc-600 text-[11px] truncate">t.me</span>
                                              </div>
                                            )) : (
                                              <p className="text-zinc-500 text-sm p-4">No prompts telemetry.</p>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="space-y-4">
                <div className="mb-6 flex items-center space-x-2">
                  <div className="px-3 py-1 bg-white/5 text-zinc-400 text-sm font-medium rounded-full">
                    <span className="text-white mr-1">{data?.users?.length || 0}</span> Total Candidates
                  </div>
                  <div className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-sm font-medium rounded-full flex items-center space-x-1.5">
                    <Check size={12} strokeWidth={3} />
                    <span><span className="text-emerald-300 mr-1">{data?.users?.filter(c => c.telegram_chat_id).length || 0}</span> Connected</span>
                  </div>
                  <div className="px-3 py-1 bg-blue-500/10 text-blue-400 text-sm font-medium rounded-full flex items-center space-x-1.5">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></div>
                    <span><span className="text-blue-300 mr-1">{data?.users?.filter(c => c.session?.session_deadline && new Date(c.session.session_deadline).getTime() > Date.now()).length || 0}</span> Active</span>
                  </div>
                </div>
                {data?.users?.map((user) => {
                  const isLinked = Boolean(user.telegram_chat_id);
                  const isExpanded = expandedCandidate === user.id;

                  return (
                    <div key={user.id} className={`bg-[#0a0a0a] border rounded-2xl overflow-hidden shadow-sm transition-all ${isLinked ? 'border-white/5 hover:border-white/10' : 'border-white/5 opacity-60'}`}>
                      <div 
                        onClick={() => toggleCandidate(user.id, isLinked)}
                        className={`px-6 py-4 flex items-center justify-between transition-colors ${isLinked ? 'cursor-pointer hover:bg-white/5' : 'cursor-default'}`}
                      >
                        <div className="flex items-center space-x-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border ${isLinked ? 'bg-white/10 text-white border-white/10' : 'bg-white/5 text-zinc-300 border-white/5'}`}>
                            {getInitials(user.full_name || user.company_email)}
                          </div>
                          <div>
                            <h2 className="text-base font-medium text-white tracking-wide">{user.full_name || user.company_email || 'Unknown'}</h2>
                            <p className="text-xs text-zinc-500 font-mono mt-0.5">{user.applywizz_id || user.id}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-6">
                          {isLinked ? (
                            <span className="text-emerald-400 text-xs font-medium flex items-center space-x-2">
                              <span>Telegram</span>
                              <div className="bg-emerald-500/20 p-1 rounded-full">
                                <Check size={12} strokeWidth={3} />
                              </div>
                            </span>
                          ) : (
                            <span className="text-red-400 text-xs font-medium flex items-center space-x-2">
                              <span>Telegram</span>
                              <div className="bg-red-500/20 p-1 rounded-full">
                                <X size={12} strokeWidth={3} />
                              </div>
                            </span>
                          )}
                          
                          {isLinked && (
                            isExpanded ? <ChevronUp size={16} className="text-zinc-500" /> : <ChevronDown size={16} className="text-zinc-500" />
                          )}
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="bg-black border-t border-white/5">
                          <div className="flex space-x-6 px-8 pt-4 border-b border-white/5">
                            <button 
                              onClick={(e) => { e.stopPropagation(); setCandidateTab('dashboard'); }}
                              className={`pb-3 text-sm font-medium transition-colors ${candidateTab === 'dashboard' ? 'text-white border-b-2 border-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                            >
                              Dashboard
                            </button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); setCandidateTab('jobs'); }}
                              className={`pb-3 text-sm font-medium transition-colors ${candidateTab === 'jobs' ? 'text-white border-b-2 border-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                            >
                              Jobs (Prompts)
                            </button>
                          </div>

                          <div className="px-8 pb-8 pt-6">
                            {candidateTab === 'dashboard' && (
                              <div className="animate-in fade-in duration-300">
                                <div className="grid grid-cols-3 gap-5 mb-10">
                                  <div className="bg-black p-5 rounded-2xl border border-white/5">
                                    <p className="text-xs text-zinc-500 font-medium mb-2 uppercase tracking-widest">Window Start</p>
                                    <p className="text-2xl font-mono text-white font-light">{user.session?.window_start_time || '--:--'}</p>
                                  </div>
                                  <div className="bg-black p-5 rounded-2xl border border-white/5">
                                    <p className="text-xs text-zinc-500 font-medium mb-2 uppercase tracking-widest">Window End</p>
                                    <p className="text-2xl font-mono text-white font-light">{user.session?.window_end_time || '--:--'}</p>
                                  </div>
                                  <div className="bg-zinc-900/30 p-5 rounded-2xl border border-white/5">
                                    <p className="text-xs text-white/70 font-medium mb-2 uppercase tracking-widest">Remaining</p>
                                    <p className="text-2xl font-mono text-white font-light">--</p>
                                  </div>
                                </div>

                                <div>
                                  <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-4">Applications Queue</h3>
                                  <div className="grid grid-cols-1 gap-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                                    {user.queue && user.queue.length > 0 ? user.queue.map((q, i) => (
                                      <div key={i} className="bg-black rounded-xl p-4 border border-white/5 flex justify-between items-center">
                                        <div>
                                          <div className="space-x-2 mb-1.5">
                                            <span className="px-2.5 py-0.5 bg-blue-500/10 text-blue-400 text-[11px] font-medium rounded-full">
                                              {q.company || 'Company'}
                                            </span>
                                            <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 text-[11px] font-medium rounded-full">
                                              {q.status}
                                            </span>
                                          </div>
                                          <h4 className="text-white font-medium text-base">{q.job_title}</h4>
                                        </div>
                                        <a href={q.job_url} target="_blank" rel="noreferrer" className="text-white hover:text-zinc-300 text-sm font-medium px-4 py-1.5 bg-white/5 rounded-lg transition-colors">
                                          View ↗
                                        </a>
                                      </div>
                                    )) : (
                                      <p className="text-zinc-500 text-sm">No items in queue.</p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}

                            {candidateTab === 'jobs' && (
                              <div className="animate-in fade-in duration-300">
                                <div className="grid grid-cols-4 gap-4 mb-8">
                                  <div className="bg-black p-4 rounded-xl border border-white/5">
                                    <p className="text-xs text-zinc-500 mb-1">Total</p>
                                    <p className="text-xl text-yellow-400 font-medium">{user.prompts_summary?.total || 0}</p>
                                  </div>
                                  <div className="bg-black p-4 rounded-xl border border-white/5">
                                    <p className="text-xs text-zinc-500 mb-1">Accepted</p>
                                    <p className="text-xl text-emerald-400 font-medium">{user.prompts_summary?.accepted || 0}</p>
                                  </div>
                                  <div className="bg-black p-4 rounded-xl border border-white/5">
                                    <p className="text-xs text-zinc-500 mb-1">Rejected</p>
                                    <p className="text-xl text-red-400 font-medium">{user.prompts_summary?.rejected || 0}</p>
                                  </div>
                                  <div className="bg-black p-4 rounded-xl border border-white/5">
                                    <p className="text-xs text-zinc-500 mb-1">Skipped</p>
                                    <p className="text-xl text-blue-400 font-medium">{user.prompts_summary?.skipped || 0}</p>
                                  </div>
                                </div>

                                <div>
                                  <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-4">Prompts Telemetry</h3>
                                  <div className="bg-black rounded-xl border border-white/5 divide-y divide-white/5 max-h-[500px] custom-scrollbar overflow-y-auto">
                                    {user.prompt_events && user.prompt_events.length > 0 ? user.prompt_events.map((p, i) => (
                                      <div key={i} className="px-5 py-3 flex items-center justify-between text-sm">
                                        <div className="flex items-center space-x-4">
                                          <span className="text-zinc-500 font-mono text-xs">{new Date(p.sent_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                          <span className="px-2 py-0.5 bg-white/10 text-white text-[11px] uppercase rounded">{p.decision || 'pending'}</span>
                                          <span className="text-zinc-300 max-w-[200px] truncate">{p.job_title}</span>
                                        </div>
                                        <span className="text-zinc-600 text-[11px] truncate">t.me</span>
                                      </div>
                                    )) : (
                                      <p className="text-zinc-500 text-sm p-4">No prompts telemetry.</p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

          </div>
          )}

          {mainTab === 'stats' && data && (
            <div className="max-w-6xl mx-auto animate-in fade-in duration-300">
              <h1 className="text-3xl font-semibold text-white tracking-tight mb-8">Applications Status</h1>

              {/* Global Stats Grid */}
              <div className="grid grid-cols-5 gap-4 mb-12">
                <div className="bg-[#0a0a0a] border border-white/5 p-5 rounded-2xl shadow-sm">
                  <p className="text-[10px] text-zinc-500 font-bold mb-2 uppercase tracking-widest">Total Candidates</p>
                  <p className="text-3xl font-medium text-white">{data.global_stats?.total_candidates || 0}</p>
                  <p className="text-xs text-zinc-500 mt-2">Ingested & registered</p>
                </div>
                <div className="bg-[#0a0a0a] border border-white/5 p-5 rounded-2xl shadow-sm border-b-2 border-b-blue-500/50">
                  <p className="text-[10px] text-zinc-500 font-bold mb-2 uppercase tracking-widest">Total Applications</p>
                  <p className="text-3xl font-medium text-blue-400">{data.global_stats?.total_applications || 0}</p>
                  <p className="text-xs text-zinc-500 mt-2">Processed jobs</p>
                </div>
                <div className="bg-[#0a0a0a] border border-white/5 p-5 rounded-2xl shadow-sm border-b-2 border-b-emerald-500/50">
                  <p className="text-[10px] text-zinc-500 font-bold mb-2 uppercase tracking-widest">Accepted (Yes)</p>
                  <p className="text-3xl font-medium text-emerald-400">{data.global_stats?.prompts?.accepted || 0}</p>
                  <p className="text-xs text-zinc-500 mt-2">User approved</p>
                </div>
                <div className="bg-[#0a0a0a] border border-white/5 p-5 rounded-2xl shadow-sm border-b-2 border-b-red-500/50">
                  <p className="text-[10px] text-zinc-500 font-bold mb-2 uppercase tracking-widest">Rejected (No)</p>
                  <p className="text-3xl font-medium text-red-400">{data.global_stats?.prompts?.rejected || 0}</p>
                  <p className="text-xs text-zinc-500 mt-2">User declined</p>
                </div>
                <div className="bg-[#0a0a0a] border border-white/5 p-5 rounded-2xl shadow-sm border-b-2 border-b-slate-500/50">
                  <p className="text-[10px] text-zinc-500 font-bold mb-2 uppercase tracking-widest">Skipped / Expired</p>
                  <p className="text-3xl font-medium text-zinc-400">{data.global_stats?.prompts?.skipped || 0}</p>
                  <p className="text-xs text-zinc-500 mt-2">Timed out</p>
                </div>
              </div>

              {/* CA Stats Grid (Only if multiple CAs exist) */}
              {(operator?.role === 'admin' || operator?.role === 'manager') && data.ca_stats && data.ca_stats.length > 0 && (
                <div className="mb-12 bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden shadow-sm">
                  <div className="px-6 py-5 border-b border-white/5">
                    <h3 className="text-lg font-medium text-white">Career Associate Directory</h3>
                  </div>
                  <div className="overflow-x-auto max-h-[600px] overflow-y-auto custom-scrollbar">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                      <thead className="bg-black text-zinc-500 text-xs uppercase tracking-wider sticky top-0 z-10 shadow-sm">
                        <tr>
                          <th className="px-6 py-4 font-medium">CA Email / ID</th>
                          <th className="px-6 py-4 font-medium">Total Clients</th>
                          <th className="px-6 py-4 font-medium">Active Sessions</th>
                          <th className="px-6 py-4 font-medium">Jobs Prompted</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {data.ca_stats.map((ca, idx) => (
                          <tr key={idx} className="hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4 text-white font-medium">
                              <strong>{ca.ca_name || ca.ca_email || 'Unassigned'}</strong>
                            </td>
                            <td className="px-6 py-4 text-white">
                              {ca.total_clients || 0}
                            </td>
                            <td className="px-6 py-4 text-zinc-300">
                              {ca.active_sessions || 0}
                            </td>
                            <td className="px-6 py-4">
                              <span className="px-3 py-1 bg-blue-500/10 text-blue-400 font-medium rounded-full">
                                {ca.applied_today || 0}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Master Jobs Directory */}
              <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden shadow-sm">
                <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between">
                  <h3 className="text-lg font-medium text-white">Master Jobs Directory</h3>
                  {/* Search placeholder for future implementation */}
                  <div className="bg-black/20 border border-white/5 rounded-lg px-3 py-1.5 flex items-center">
                    <span className="text-zinc-500 text-sm">Search not implemented</span>
                  </div>
                </div>
                <div className="overflow-x-auto max-h-[600px] overflow-y-auto custom-scrollbar">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-black text-zinc-500 text-xs uppercase tracking-wider sticky top-0 z-10 shadow-sm">
                      <tr>
                        <th className="px-6 py-4 font-medium">Candidate</th>
                        <th className="px-6 py-4 font-medium">AWL-ID</th>
                        <th className="px-6 py-4 font-medium">Job Title / Company</th>
                        <th className="px-6 py-4 font-medium">Status</th>
                        <th className="px-6 py-4 font-medium">Applied At</th>
                        <th className="px-6 py-4 font-medium text-right">Link</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {data.global_stats?.all_applications?.slice(0, 50).map((app, idx) => (
                        <tr key={idx} className="hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4 text-white font-medium">{app.client_name || app.client_email || 'Unknown'}</td>
                          <td className="px-6 py-4 text-zinc-400 font-mono text-xs">{app.applywizz_id || '--'}</td>
                          <td className="px-6 py-4">
                            <p className="text-white">{app.job_title}</p>
                            <p className="text-zinc-500 text-xs mt-0.5">{app.company}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-2.5 py-1 bg-white/10 text-zinc-300 text-[10px] uppercase font-bold rounded-full">
                              {app.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-zinc-400 text-xs">
                            {app.applied_at ? new Date(app.applied_at).toLocaleString() : '--'}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <a href={app.job_url} target="_blank" rel="noreferrer" className="text-white hover:text-zinc-300 text-xs font-medium px-3 py-1.5 bg-white/5 rounded-lg transition-colors">
                              View ↗
                            </a>
                          </td>
                        </tr>
                      ))}
                      {(!data.global_stats?.all_applications || data.global_stats.all_applications.length === 0) && (
                        <tr>
                          <td colSpan="6" className="px-6 py-8 text-center text-zinc-500">No applications found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Telegram Modal */}
      {showTelegramModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[100] p-4">
          <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl max-w-sm w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-5 border-b border-white/5 flex justify-between items-center bg-white/5">
              <h3 className="font-medium text-white tracking-wide">Telegram Connection</h3>
              <button onClick={() => setShowTelegramModal(false)} className="text-zinc-500 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-8 flex flex-col items-center space-y-8">
              <div className="bg-white p-3 rounded-2xl shadow-inner">
                <img src="/BotDice.png" alt="Telegram Bot QR Code" className="w-40 h-40 object-cover rounded-xl" />
              </div>
              <div className="w-full">
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-3 text-center">Or share invite link</p>
                <div className="flex items-center space-x-2">
                  <input 
                    readOnly 
                    value={data?.telegram_bot_url || "t.me/dice_apply_bot"} 
                    className="flex-1 bg-[#0a0a0a] border border-white/5 rounded-xl px-4 py-3 text-sm text-zinc-300 outline-none font-mono"
                  />
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(data?.telegram_bot_url || "t.me/dice_apply_bot");
                      alert('Link copied to clipboard!');
                    }}
                    className="p-3 bg-white text-black hover:bg-slate-200 rounded-xl transition-colors shadow-sm"
                  >
                    <LinkIcon size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
