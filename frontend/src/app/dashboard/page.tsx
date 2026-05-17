'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, ChevronRight, Activity, Flame, ShieldAlert, Cpu } from 'lucide-react';

// Mock Data Types
type Lead = {
  id: string;
  name: string;
  company: string;
  status: 'HOT' | 'WARM' | 'COLD';
  score: number;
};

export default function LeadsDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Simulate data fetching
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setLoading(true);
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Uncomment below to test Error State
        // throw new Error("Connection to Vault Database Lost. Uplink Failed.");

        // Uncomment below to test Empty State
        // setLeads([]);
        // return;

        setLeads([
          { id: 'LD-001', name: 'Evelyn Sterling', company: 'Quantum Dynamics', status: 'HOT', score: 98 },
          { id: 'LD-002', name: 'Marcus Vance', company: 'Aegis Security', status: 'WARM', score: 74 },
          { id: 'LD-003', name: 'Sarah Chen', company: 'Nexus Core', status: 'HOT', score: 92 },
          { id: 'LD-004', name: 'James Holden', company: 'Rocinante Logistics', status: 'COLD', score: 32 },
        ]);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  // Filter leads
  const filteredLeads = leads.filter(l => 
    l.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    l.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-display font-bold text-white tracking-widest text-glow mb-2">
            LEAD INTELLIGENCE
          </h1>
          <p className="text-primary/60 font-mono text-sm tracking-widest">
            <Activity className="w-4 h-4 inline mr-2 text-primary animate-pulse" />
            LIVE PIPELINE ANALYSIS
          </p>
        </div>
        
        <div className="flex gap-4">
          <div className="relative vault-panel angled-border flex items-center">
            <Search className="w-4 h-4 text-primary/50 absolute left-3" />
            <input 
              type="text"
              placeholder="Search Target..."
              className="bg-transparent border-none text-white text-sm font-mono pl-10 pr-4 py-2 focus:outline-none focus:ring-0 placeholder:text-white/30"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="vault-panel angled-border bg-primary text-black font-bold px-6 py-2 uppercase tracking-widest text-sm hover:bg-white hover:text-black transition-colors neon-glow flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Target
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full">
        <AnimatePresence mode="wait">
          
          {/* Loading State */}
          {loading && (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
            >
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="vault-panel angled-border p-6 h-40 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                  <div className="w-1/3 h-4 bg-primary/20 rounded mb-4" />
                  <div className="w-2/3 h-6 bg-primary/20 rounded mb-6" />
                  <div className="w-full h-1 bg-primary/10 rounded" />
                </div>
              ))}
            </motion.div>
          )}

          {/* Error State */}
          {!loading && error && (
            <motion.div 
              key="error"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full flex flex-col items-center justify-center p-20 vault-panel angled-border border-accent shadow-[0_0_30px_rgba(255,0,84,0.3)] bg-accent/5"
            >
              <ShieldAlert className="w-20 h-20 text-accent mb-6 animate-pulse" />
              <h2 className="text-3xl font-display font-bold text-accent tracking-widest mb-2">SYSTEM FAILURE</h2>
              <p className="font-mono text-white/70 tracking-widest">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-8 border border-accent text-accent px-8 py-3 angled-border font-mono tracking-widest hover:bg-accent hover:text-white transition-colors"
              >
                REBOOT SEQUENCE
              </button>
            </motion.div>
          )}

          {/* Empty State */}
          {!loading && !error && leads.length === 0 && (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full flex flex-col items-center justify-center p-20 vault-panel angled-border opacity-70"
            >
              <Cpu className="w-20 h-20 text-primary/30 mb-6" />
              <h2 className="text-2xl font-display font-bold text-white tracking-widest mb-2">NO TARGETS ACQUIRED</h2>
              <p className="font-mono text-white/50 tracking-widest">Awaiting data injection from external nodes.</p>
            </motion.div>
          )}

          {/* Data Grid */}
          {!loading && !error && filteredLeads.length > 0 && (
            <motion.div 
              key="data"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
            >
              {filteredLeads.map((lead, index) => (
                <motion.div
                  key={lead.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="vault-panel angled-border p-6 relative group cursor-pointer hover:neon-glow border-primary/30 transition-all duration-300"
                >
                  <div className="absolute top-0 right-0 w-12 h-12 bg-primary/10 [clip-path:polygon(100%_0,100%_100%,0_0)] z-0" />
                  
                  <div className="flex justify-between items-start mb-6 relative z-10">
                    <div>
                      <div className="text-[10px] font-mono text-primary/70 tracking-widest mb-1">{lead.id}</div>
                      <h3 className="text-xl font-display font-bold text-white group-hover:text-primary transition-colors">{lead.name}</h3>
                      <p className="text-sm font-mono text-white/50">{lead.company}</p>
                    </div>
                    
                    <div className={`
                      flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold tracking-wider border
                      ${lead.status === 'HOT' ? 'bg-accent/20 text-accent border-accent/50' : 
                        lead.status === 'WARM' ? 'bg-primary/20 text-primary border-primary/50' : 
                        'bg-blue-500/20 text-blue-400 border-blue-500/50'}
                    `}>
                      {lead.status === 'HOT' && <Flame className="w-3 h-3" />}
                      {lead.status}
                    </div>
                  </div>

                  <div className="space-y-2 relative z-10">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-white/60">Match Score</span>
                      <span className="text-white font-bold">{lead.score}%</span>
                    </div>
                    <div className="w-full bg-black h-2 rounded-full overflow-hidden border border-white/10">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${lead.score}%` }}
                        transition={{ duration: 1, delay: 0.5 + (index * 0.1) }}
                        className={`h-full ${
                          lead.score >= 90 ? 'bg-accent shadow-[0_0_10px_#ff0054]' :
                          lead.score >= 60 ? 'bg-primary shadow-[0_0_10px_#ffb703]' :
                          'bg-blue-500'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Hover reveal action */}
                  <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 duration-300">
                    <ChevronRight className="w-6 h-6 text-primary" />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

        </AnimatePresence>
      </div>
      
      {/* Decorative Shimmer Keyframe */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}} />
    </div>
  );
}
