import { useState } from 'react';
import { QrCode, Link as LinkIcon, RefreshCw, ChevronDown, ChevronUp, LogOut, Check, X, Calendar, Globe, Menu, ChevronLeft, LayoutDashboard, BarChart2, Terminal } from 'lucide-react';

export default function DesignPreview() {
  const [showTelegramModal, setShowTelegramModal] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [expandedCandidate, setExpandedCandidate] = useState(1);
  const [candidateTab, setCandidateTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleCandidate = (id, isLinked) => {
    if (!isLinked) return;
    setExpandedCandidate(expandedCandidate === id ? null : id);
    setCandidateTab('dashboard');
  };

  return (
    <div className="flex h-screen bg-[#000000] text-slate-200 font-sans overflow-hidden">
      
      {/* --- Notion-style Collapsible Left Sidebar --- */}
      <aside 
        className={`relative flex flex-col bg-[#111111] border-r border-white/10 transition-all duration-300 ease-in-out z-40
          ${isSidebarOpen ? 'w-64 px-4' : 'w-0 px-0 opacity-0 overflow-hidden'}
        `}
      >
        {/* Top Section (Left Stuff) */}
        <div className="pt-6 pb-4 border-b border-white/5 flex items-center justify-between min-w-[224px]">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-sm shrink-0">
              AW
            </div>
            <span className="font-semibold text-white tracking-wide truncate">AutoEasyApply</span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="text-slate-500 hover:text-white p-1 rounded-md hover:bg-white/5 transition-colors shrink-0"
          >
            <ChevronLeft size={18} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 space-y-1 min-w-[224px]">
          <button className="w-full flex items-center space-x-3 px-3 py-2 bg-white/10 text-white rounded-lg font-medium transition-colors border border-white/5">
            <LayoutDashboard size={16} className="text-indigo-400" />
            <span>Dashboard</span>
          </button>
          <button className="w-full flex items-center space-x-3 px-3 py-2 text-slate-400 hover:bg-white/5 hover:text-white rounded-lg font-medium transition-colors">
            <BarChart2 size={16} className="text-slate-500" />
            <span>Stats</span>
          </button>
        </nav>

        {/* Bottom Section (Right Stuff) */}
        <div className="pb-6 pt-4 border-t border-white/5 space-y-2 min-w-[224px]">
          <button className="w-full flex items-center space-x-3 px-3 py-2 text-slate-300 hover:bg-white/5 hover:text-white rounded-lg text-sm font-medium transition-colors">
            <Terminal size={16} className="text-purple-400" />
            <span>Dev Logs</span>
          </button>

          <button 
            onClick={() => setShowTelegramModal(true)}
            className="w-full flex items-center space-x-3 px-3 py-2 text-slate-300 hover:bg-white/5 hover:text-white rounded-lg text-sm font-medium transition-colors"
          >
            <QrCode size={16} className="text-blue-400" />
            <span>Telegram Link</span>
          </button>
          
          <div className="relative mt-2 pt-2 border-t border-white/5">
            <button 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="w-full flex items-center space-x-3 px-2 py-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-tr from-slate-700 to-slate-600 rounded-full flex items-center justify-center border border-white/10 shrink-0">
                <span className="font-semibold text-white text-xs">S</span>
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm text-white font-medium truncate">sharan</p>
                <p className="text-xs text-slate-500 truncate">Admin</p>
              </div>
            </button>
            
            {showProfileMenu && (
              <div className="absolute bottom-full left-0 mb-2 w-full bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl py-1 z-50 overflow-hidden">
                <button className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-white/5 flex items-center space-x-2 transition-colors m-1 rounded-lg">
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
        <header className="flex items-center justify-between px-6 py-4 border-b border-white/5 shrink-0 bg-[#0a0a0a] relative z-30">
          <div className="flex items-center min-w-[40px] flex-1">
            {!isSidebarOpen && (
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <Menu size={20} />
              </button>
            )}
          </div>
          
          {/* Centered Date/Timezone with hover animation */}
          <div className="flex items-center justify-center shrink-0">
            <div className="flex items-center bg-[#111111] px-5 py-2 rounded-full border border-white/10 shadow-sm hover:border-white/20 hover:shadow-md transition-all duration-300 ease-out group">
              <div className="flex items-center space-x-2">
                <Calendar size={14} className="text-slate-500 group-hover:text-indigo-400 transition-colors shrink-0" />
                <input 
                  type="date" 
                  defaultValue="2026-09-21"
                  className="bg-transparent border-none text-slate-300 text-sm focus:ring-0 outline-none cursor-pointer p-0 w-[110px]"
                />
              </div>
              <div className="w-px h-4 bg-white/10 mx-3 sm:mx-4 shrink-0"></div>
              <div className="flex items-center space-x-2">
                <Globe size={14} className="text-slate-500 group-hover:text-indigo-400 transition-colors shrink-0" />
                <select className="bg-transparent border-none text-slate-300 text-sm focus:ring-0 outline-none cursor-pointer p-0 min-w-[110px]">
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
          <div className="max-w-4xl mx-auto">
            
            {/* === GLOBAL ADMIN HEADER === */}
            <div className="mb-12 p-8 bg-gradient-to-br from-[#1a1a1a] to-[#111111] border border-white/10 rounded-3xl flex items-center justify-between shadow-lg">
              <div>
                <h1 className="text-3xl font-semibold text-white mb-2 tracking-tight">Admin Overview</h1>
                <p className="text-slate-400 text-sm">Managing all CAs and candidates</p>
              </div>
              <button className="flex items-center space-x-2 px-6 py-2.5 bg-white text-black hover:bg-slate-200 font-semibold rounded-full shadow-sm transition-colors">
                <RefreshCw size={16} />
                <span>Global Sync</span>
              </button>
            </div>

            {/* === CA GROUP 1 === */}
            <div className="mb-16">
              <div className="mb-8 pb-3 border-b border-white/10">
                <h2 className="text-xl font-medium text-white flex items-center space-x-3">
                  <span className="text-indigo-400">★</span>
                  <span>Global Recruiters LLC</span>
                </h2>
              </div>

              {/* Spaced out Candidate List */}
              <div className="space-y-6">
                
                {/* Candidate 1 (Expanded) */}
                <div className="bg-[#111111] border border-white/10 rounded-2xl overflow-hidden shadow-md transition-all">
                  {/* Card Header */}
                  <div 
                    onClick={() => toggleCandidate(1, true)}
                    className="px-6 py-5 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center space-x-5">
                      <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-full flex items-center justify-center font-bold border border-indigo-500/20 text-lg">
                        VC
                      </div>
                      <div>
                        <h2 className="text-lg font-medium text-white tracking-wide">Vamshi Challagundla</h2>
                        <p className="text-sm text-slate-500 font-mono mt-0.5">AWL-6451</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-8">
                      <span className="text-emerald-400 text-sm font-medium flex items-center space-x-2">
                        <span>Telegram</span>
                        <div className="bg-emerald-500/20 p-1 rounded-full">
                          <Check size={14} strokeWidth={3} />
                        </div>
                      </span>
                      {expandedCandidate === 1 ? <ChevronUp className="text-slate-500" /> : <ChevronDown className="text-slate-500" />}
                    </div>
                  </div>

                  {/* Expanded Body */}
                  {expandedCandidate === 1 && (
                    <div className="bg-[#0a0a0a] border-t border-white/5">
                      {/* Internal Sub-Navigation (Dashboard / Jobs) */}
                      <div className="flex space-x-6 px-8 pt-4 border-b border-white/5">
                        <button 
                          onClick={(e) => { e.stopPropagation(); setCandidateTab('dashboard'); }}
                          className={`pb-3 text-sm font-medium transition-colors ${candidateTab === 'dashboard' ? 'text-white border-b-2 border-white' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                          Dashboard
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); setCandidateTab('jobs'); }}
                          className={`pb-3 text-sm font-medium transition-colors ${candidateTab === 'jobs' ? 'text-white border-b-2 border-white' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                          Jobs (Prompts)
                        </button>
                      </div>

                      <div className="px-8 pb-8 pt-6">
                        {/* DASHBOARD TAB CONTENT */}
                        {candidateTab === 'dashboard' && (
                          <div className="animate-in fade-in duration-300">
                            {/* Metrics Row */}
                            <div className="grid grid-cols-3 gap-5 mb-10">
                              <div className="bg-[#141414] p-5 rounded-2xl border border-white/5">
                                <p className="text-xs text-slate-500 font-medium mb-2 uppercase tracking-widest">Window Start</p>
                                <p className="text-2xl font-mono text-white font-light">09:00 AM</p>
                              </div>
                              <div className="bg-[#141414] p-5 rounded-2xl border border-white/5">
                                <p className="text-xs text-slate-500 font-medium mb-2 uppercase tracking-widest">Window End</p>
                                <p className="text-2xl font-mono text-white font-light">06:00 PM</p>
                              </div>
                              <div className="bg-indigo-900/10 p-5 rounded-2xl border border-indigo-500/20">
                                <p className="text-xs text-indigo-400/70 font-medium mb-2 uppercase tracking-widest">Remaining</p>
                                <p className="text-2xl font-mono text-indigo-400 font-light">04h 30m</p>
                              </div>
                            </div>

                            {/* Applications Section */}
                            <div>
                              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">Applications Queue</h3>
                              <div className="grid grid-cols-1 gap-4">
                                <div className="bg-[#141414] rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-colors flex justify-between items-center">
                                  <div>
                                    <div className="space-x-3 mb-2">
                                      <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-xs font-medium rounded-full">
                                        TechCorp Inc.
                                      </span>
                                      <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-medium rounded-full">
                                        Applied
                                      </span>
                                    </div>
                                    <h4 className="text-white font-medium text-lg">Senior Software Engineer</h4>
                                  </div>
                                  <button className="text-indigo-400 hover:text-indigo-300 text-sm font-medium px-4 py-2 bg-indigo-500/10 rounded-lg transition-colors">
                                    View ↗
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* JOBS TAB CONTENT */}
                        {candidateTab === 'jobs' && (
                          <div className="animate-in fade-in duration-300">
                            {/* Prompts Stats Row */}
                            <div className="grid grid-cols-4 gap-4 mb-8">
                              <div className="bg-[#141414] p-4 rounded-2xl border border-white/5">
                                <p className="text-xs text-slate-500 mb-1">Total Prompts</p>
                                <p className="text-xl text-yellow-400 font-medium">12</p>
                              </div>
                              <div className="bg-[#141414] p-4 rounded-2xl border border-white/5">
                                <p className="text-xs text-slate-500 mb-1">Accepted</p>
                                <p className="text-xl text-emerald-400 font-medium">8</p>
                              </div>
                              <div className="bg-[#141414] p-4 rounded-2xl border border-white/5">
                                <p className="text-xs text-slate-500 mb-1">Rejected</p>
                                <p className="text-xl text-red-400 font-medium">3</p>
                              </div>
                              <div className="bg-[#141414] p-4 rounded-2xl border border-white/5">
                                <p className="text-xs text-slate-500 mb-1">Skipped</p>
                                <p className="text-xl text-blue-400 font-medium">1</p>
                              </div>
                            </div>

                            {/* Dummy Telemetry List */}
                            <div>
                              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">Prompts Telemetry</h3>
                              <div className="bg-[#141414] rounded-xl border border-white/5 divide-y divide-white/5">
                                <div className="px-5 py-3 flex items-center justify-between text-sm">
                                  <div className="flex items-center space-x-4">
                                    <span className="text-slate-500 font-mono text-xs">10:45 AM</span>
                                    <span className="px-2 py-0.5 bg-yellow-500/10 text-yellow-400 text-xs rounded">job_prompt_sent</span>
                                    <span className="text-slate-300">React Developer</span>
                                  </div>
                                  <span className="text-slate-600">t.me/...</span>
                                </div>
                                <div className="px-5 py-3 flex items-center justify-between text-sm">
                                  <div className="flex items-center space-x-4">
                                    <span className="text-slate-500 font-mono text-xs">10:30 AM</span>
                                    <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-xs rounded">job_yes</span>
                                    <span className="text-slate-300">Senior Software Engineer</span>
                                  </div>
                                  <span className="text-slate-600">t.me/...</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Candidate 2 (Collapsed - Not Linked) */}
                <div className="bg-[#111111] border border-white/10 rounded-2xl overflow-hidden shadow-sm transition-all hover:border-white/20">
                  <div 
                    onClick={() => toggleCandidate(2, false)}
                    className="px-6 py-5 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div className="flex items-center space-x-5 opacity-60">
                      <div className="w-12 h-12 bg-white/5 text-slate-300 rounded-full flex items-center justify-center font-bold text-lg border border-white/10">
                        SR
                      </div>
                      <div>
                        <h2 className="text-lg font-medium text-white tracking-wide">Sruthi Reddy</h2>
                        <p className="text-sm text-slate-500 font-mono mt-0.5">AWL-8992</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-8 opacity-60">
                      <span className="text-red-400 text-sm font-medium flex items-center space-x-2">
                        <span>Telegram</span>
                        <div className="bg-red-500/20 p-1 rounded-full">
                          <X size={14} strokeWidth={3} />
                        </div>
                      </span>
                      <ChevronDown className="text-slate-600" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* === CA GROUP 2 === */}
            <div className="mb-16">
              <div className="mb-8 pb-3 border-b border-white/10">
                <h2 className="text-xl font-medium text-white flex items-center space-x-3">
                  <span className="text-pink-400">★</span>
                  <span>TechTalent Partners</span>
                </h2>
              </div>

              <div className="space-y-6">
                <div className="bg-[#111111] border border-white/10 rounded-2xl overflow-hidden shadow-sm transition-all hover:border-white/20">
                  <div 
                    onClick={() => toggleCandidate(3, true)}
                    className="px-6 py-5 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center space-x-5">
                      <div className="w-12 h-12 bg-pink-500/10 text-pink-400 rounded-full flex items-center justify-center font-bold border border-pink-500/20 text-lg">
                        NJ
                      </div>
                      <div>
                        <h2 className="text-lg font-medium text-white tracking-wide">Nagasai Jampana</h2>
                        <p className="text-sm text-slate-500 font-mono mt-0.5">AWL-3312</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-8">
                      <span className="text-emerald-400 text-sm font-medium flex items-center space-x-2">
                        <span>Telegram</span>
                        <div className="bg-emerald-500/20 p-1 rounded-full">
                          <Check size={14} strokeWidth={3} />
                        </div>
                      </span>
                      {expandedCandidate === 3 ? <ChevronUp className="text-slate-500" /> : <ChevronDown className="text-slate-500" />}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Telegram Modal */}
      {showTelegramModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[100] p-4">
          <div className="bg-[#111111] border border-white/10 rounded-3xl max-w-sm w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-5 border-b border-white/5 flex justify-between items-center bg-white/5">
              <h3 className="font-medium text-white tracking-wide">Telegram Connection</h3>
              <button onClick={() => setShowTelegramModal(false)} className="text-slate-500 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-8 flex flex-col items-center space-y-8">
              <div className="bg-white p-3 rounded-2xl shadow-inner">
                <div className="w-40 h-40 bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 rounded-xl font-medium">
                  [ QR Code ]
                </div>
              </div>
              <div className="w-full">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3 text-center">Or share invite link</p>
                <div className="flex items-center space-x-2">
                  <input 
                    readOnly 
                    value="t.me/ApplywizzBot?start=admin" 
                    className="flex-1 bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-300 outline-none font-mono"
                  />
                  <button className="p-3 bg-white text-black hover:bg-slate-200 rounded-xl transition-colors shadow-sm">
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
