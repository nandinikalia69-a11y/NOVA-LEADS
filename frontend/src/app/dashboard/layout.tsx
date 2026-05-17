'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Activity, Settings, LogOut, Hexagon, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Command Center', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Lead Intel', href: '/dashboard/leads', icon: Users },
    { name: 'System Status', href: '/dashboard/status', icon: Activity },
    { name: 'Protocols', href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background flex text-foreground selection:bg-primary/30">
      
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-primary/20 bg-black/40 backdrop-blur-xl flex flex-col relative z-20">
        
        {/* Logo Area */}
        <div className="h-20 flex items-center px-6 border-b border-primary/20">
          <Hexagon className="w-8 h-8 text-primary animate-[spin_10s_linear_infinite]" />
          <div className="ml-3">
            <div className="font-display font-bold text-xl tracking-widest text-glow text-white">SERVICEHIVE</div>
            <div className="text-[9px] text-primary/70 tracking-[0.2em] font-mono uppercase">Data Vault OS</div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-8 space-y-2">
          <div className="text-[10px] uppercase font-mono text-primary/50 tracking-widest mb-4 px-2">Access Grid</div>
          
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <div className={`relative px-4 py-3 flex items-center group cursor-pointer angled-border transition-all duration-300 ${isActive ? 'bg-primary/10 text-primary border-l-2 border-primary' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}>
                  {isActive && (
                    <motion.div 
                      layoutId="activeNav"
                      className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent z-0"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    />
                  )}
                  <item.icon className={`w-5 h-5 mr-3 relative z-10 ${isActive ? 'text-primary' : 'text-white/40 group-hover:text-primary/70'}`} />
                  <span className="font-mono text-sm tracking-wide relative z-10">{item.name}</span>
                </div>
              </Link>
            )
          })}
        </nav>

        {/* Bottom Status / Logout */}
        <div className="p-4 border-t border-primary/20 space-y-4">
          <div className="vault-panel p-3 text-xs font-mono">
            <div className="flex items-center gap-2 mb-2 text-accent">
              <ShieldAlert className="w-4 h-4" />
              <span className="tracking-widest">DEFCON 4</span>
            </div>
            <div className="w-full bg-black h-1 mt-1">
              <div className="w-3/4 bg-primary h-full shadow-[0_0_10px_#ffb703]"></div>
            </div>
          </div>
          
          <Link href="/">
            <div className="flex items-center px-4 py-2 text-sm font-mono text-white/50 hover:text-accent transition-colors cursor-pointer group">
              <LogOut className="w-4 h-4 mr-2 group-hover:text-accent" />
              Disconnect
            </div>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Top Header */}
        <header className="h-16 border-b border-primary/10 flex items-center justify-between px-8 bg-black/20 backdrop-blur-md relative z-20">
          <div className="flex items-center text-xs font-mono text-primary/60 tracking-widest">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse mr-2"></span>
            UPLINK ESTABLISHED
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm font-bold text-white tracking-widest font-display">OPR-7749</div>
              <div className="text-[10px] text-primary/70 font-mono">SYS ADMIN</div>
            </div>
            <div className="w-10 h-10 angled-border bg-primary/20 border border-primary/50 flex items-center justify-center neon-glow">
              <Hexagon className="w-6 h-6 text-primary" />
            </div>
          </div>
        </header>

        {/* Page Content Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-8 relative z-10 scanlines">
          {children}
        </div>
      </main>

    </div>
  );
}
