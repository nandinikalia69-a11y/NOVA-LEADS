'use client';

import { useAuthStore } from '@/store/authStore';
import { LayoutDashboard, Users, Search, Settings } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

export function MobileDock() {
  const { user } = useAuthStore();
  const pathname = usePathname();

  if (!user || pathname === '/' || pathname === '/login' || pathname === '/register') return null;

  return (
    <motion.div 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 glass-panel rounded-full px-6 py-3 flex items-center gap-8 shadow-2xl border border-[var(--color-glass-border)]"
    >
      <Link href="/dashboard" className={`flex flex-col items-center gap-1 ${pathname === '/dashboard' ? 'text-primary' : 'text-muted-foreground'}`}>
        <LayoutDashboard className="h-5 w-5" />
      </Link>
      
      <div 
        className="flex flex-col items-center gap-1 text-muted-foreground cursor-pointer"
        onClick={() => {
          const e = new KeyboardEvent('keydown', { key: 'k', metaKey: true });
          document.dispatchEvent(e);
        }}
      >
        <div className="bg-primary/20 p-3 rounded-full -mt-8 border border-primary/30 shadow-[0_0_15px_rgba(124,58,237,0.3)]">
          <Search className="h-6 w-6 text-primary" />
        </div>
      </div>

      <Link href="/dashboard/leads" className={`flex flex-col items-center gap-1 ${pathname === '/dashboard/leads' ? 'text-accent' : 'text-muted-foreground'}`}>
        <Users className="h-5 w-5" />
      </Link>
    </motion.div>
  );
}
