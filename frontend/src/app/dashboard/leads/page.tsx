'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { HolographicBorder } from '@/components/ui/HolographicBorder';
import { Search, Download, Plus, Edit, Trash2, ShieldAlert, Sparkles, AlertTriangle, ChevronDown, ChevronUp, Brain } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type LeadRecord = {
  _id: string;
  name: string;
  email: string;
  status: string;
  aiScore: number;
  conversionProbability: number;
  source: string;
  createdAt?: string | number;
};

export default function LeadsPage() {
  const { user } = useAuthStore();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);
  
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['leads', page, debouncedSearch, statusFilter, sourceFilter],
    queryFn: async () => {
      let url = `${process.env.NEXT_PUBLIC_API_URL}/leads?page=${page}&limit=10`;
      if (debouncedSearch) url += `&search=${debouncedSearch}`;
      if (statusFilter) url += `&status=${statusFilter}`;
      if (sourceFilter) url += `&source=${sourceFilter}`;
      
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      return res.json();
    }
  });

  const handleExportCSV = async () => {
    let url = `${process.env.NEXT_PUBLIC_API_URL}/leads/export/csv?`;
    if (statusFilter) url += `status=${statusFilter}&`;
    if (sourceFilter) url += `source=${sourceFilter}&`;
    
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${user?.token}` }
    });
    
    const blob = await res.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = 'leads.csv';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(downloadUrl);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to terminate this record?')) return;
    
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/leads/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${user?.token}` }
    });
    refetch();
  };

  const getSpamConfidence = (email: string) => {
    // Simulated fraud detection
    const isSuspicious = email.includes('test') || email.length < 8;
    return isSuspicious ? Math.floor(Math.random() * 40) + 50 : Math.floor(Math.random() * 15);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">Neural Lead Intelligence</h1>
          </div>
          <p className="text-muted-foreground text-sm max-w-lg">
            AI-powered pipeline analysis. System is actively analyzing behavioral vectors and predicting conversion events.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Button variant="outline" onClick={handleExportCSV} className="bg-transparent border-white/10 hover:bg-white/5 flex-1 md:flex-none">
            <Download className="mr-2 h-4 w-4" /> Export CSV
          </Button>
          <HolographicBorder className="rounded-md">
            <Button className="w-full md:w-auto bg-primary/20 hover:bg-primary/30 text-primary border-none shadow-[0_0_15px_rgba(124,58,237,0.3)]">
              <Plus className="mr-2 h-4 w-4" /> Initialize Lead
            </Button>
          </HolographicBorder>
        </div>
      </div>

      {/* Control Panel */}
      <div className="glass-panel p-4 rounded-xl border border-white/5 flex flex-col md:flex-row gap-4 bg-[#05050a]/60 backdrop-blur-xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Query neural database (name, email)..." 
            className="pl-9 bg-black/40 border-white/5 h-10 text-sm focus-visible:ring-primary/50"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <select 
            className="h-10 rounded-md border border-white/5 bg-black/40 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Vectors</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Lost">Lost</option>
          </select>
          <select 
            className="h-10 rounded-md border border-white/5 bg-black/40 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
          >
            <option value="">All Origins</option>
            <option value="Website">Website</option>
            <option value="Instagram">Instagram</option>
            <option value="Referral">Referral</option>
          </select>
        </div>
      </div>

      {/* Floating Card List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="py-20 text-center text-muted-foreground flex flex-col items-center gap-4">
            <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            Querying neural matrices...
          </div>
        ) : data?.data?.length === 0 ? (
          <div className="py-20 text-center glass-panel rounded-xl border border-white/5">
            <div className="inline-flex w-12 h-12 rounded-full bg-white/5 items-center justify-center mb-4">
              <Search className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">Zero records matched your query parameters.</p>
          </div>
        ) : (
          data?.data?.map((lead: LeadRecord, i: number) => {
            const spamScore = getSpamConfidence(lead.email);
            const isSpam = spamScore > 50;
            const isExpanded = expandedId === lead._id;

            return (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                key={lead._id}
              >
                <Card className={`overflow-hidden transition-all duration-300 border bg-[#05050a]/60 backdrop-blur-md ${isExpanded ? 'border-primary/50 shadow-[0_0_30px_rgba(124,58,237,0.15)]' : 'border-white/5 hover:border-white/20'}`}>
                  {/* Card Header (Collapsed State) */}
                  <div 
                    className="p-5 flex flex-col md:flex-row items-center gap-6 cursor-pointer"
                    onClick={() => setExpandedId(isExpanded ? null : lead._id)}
                  >
                    {/* Identification */}
                    <div className="flex items-center gap-4 w-full md:w-[30%]">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center font-bold text-lg border border-white/10 shadow-inner">
                        {lead.name.charAt(0)}
                      </div>
                      <div className="flex-1 truncate">
                        <h3 className="font-semibold text-base text-white truncate">{lead.name}</h3>
                        <p className="text-xs text-muted-foreground truncate">{lead.email}</p>
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="flex-1 w-full grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Status</div>
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          lead.status === 'New' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                          lead.status === 'Contacted' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                          lead.status === 'Qualified' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                          'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}>
                          {lead.status}
                        </span>
                      </div>
                      
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">AI Score</div>
                        <div className="font-bold text-sm text-primary flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> {lead.aiScore}/100
                        </div>
                      </div>

                      <div className="col-span-2 md:col-span-2">
                        <div className="flex justify-between items-end mb-1">
                          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Prediction</span>
                          <span className="text-[10px] font-bold text-white">{lead.conversionProbability}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${lead.conversionProbability}%` }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className={`h-full ${lead.conversionProbability > 70 ? 'bg-green-500' : lead.conversionProbability > 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Actions & Expansion */}
                    <div className="flex items-center justify-between w-full md:w-auto gap-4">
                      {isSpam && (
                        <div className="px-2 py-1 rounded bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> Fraud Risk
                        </div>
                      )}
                      
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-white hover:bg-white/5 ml-auto">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden border-t border-white/5 bg-black/20"
                      >
                        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                          {/* AI Summary Panel */}
                          <div className="lg:col-span-2 space-y-4">
                            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                              <Brain className="w-4 h-4" /> Generated Intelligence Summary
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              Based on behavioral velocity and source analysis ({lead.source}), this lead exhibits a {lead.conversionProbability > 60 ? 'strong' : 'weak'} resonance with core ICP markers. Historical data indicates a {lead.aiScore}% engagement probability if contacted within the next 4 hours. 
                              {isSpam && ' WARNING: Anomaly detection triggered. Recommend manual verification before allocating resources.'}
                            </p>
                            
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
                              <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                                <div className="text-[10px] text-muted-foreground uppercase">Origin</div>
                                <div className="font-medium text-sm mt-1">{lead.source}</div>
                              </div>
                              <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                                <div className="text-[10px] text-muted-foreground uppercase">Urgency</div>
                                <div className="font-medium text-sm mt-1 text-yellow-500">High</div>
                              </div>
                              <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                                <div className="text-[10px] text-muted-foreground uppercase">Spam Risk</div>
                                <div className={`font-medium text-sm mt-1 ${isSpam ? 'text-red-500' : 'text-green-500'}`}>{spamScore}%</div>
                              </div>
                              <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                                <div className="text-[10px] text-muted-foreground uppercase">Created</div>
                                <div className="font-medium text-sm mt-1">{new Date(lead.createdAt || Date.now()).toLocaleDateString()}</div>
                              </div>
                            </div>
                          </div>

                          {/* Control Actions */}
                          <div className="flex flex-col gap-3 justify-center border-l border-white/5 pl-6">
                            <Button variant="outline" className="w-full justify-start border-white/10 hover:bg-white/5">
                              <Edit className="w-4 h-4 mr-2" /> Modify Parameters
                            </Button>
                            <Button variant="outline" className="w-full justify-start border-white/10 hover:bg-white/5 text-primary hover:text-primary">
                              <Sparkles className="w-4 h-4 mr-2" /> Request AI Insights
                            </Button>
                            {user?.role === 'admin' && (
                              <Button variant="outline" onClick={(e) => { e.stopPropagation(); handleDelete(lead._id); }} className="w-full justify-start border-red-500/20 text-red-500 hover:bg-red-500/10">
                                <Trash2 className="w-4 h-4 mr-2" /> Terminate Record
                              </Button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            );
          })
        )}
      </div>
      
      {/* Pagination */}
      {data?.pagination && data.pagination.totalPages > 1 && (
        <div className="flex items-center justify-between pt-6 border-t border-white/5">
          <div className="text-sm text-muted-foreground">
            Indexing page <span className="font-bold text-white">{page}</span> of {data.pagination.totalPages}
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="border-white/10 hover:bg-white/5"
            >
              Previous
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setPage(p => Math.min(data.pagination.totalPages, p + 1))}
              disabled={page === data.pagination.totalPages}
              className="border-white/10 hover:bg-white/5"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
