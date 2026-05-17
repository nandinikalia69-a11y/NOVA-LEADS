'use client';

import { useEffect, useState } from 'react';
import { Command } from 'cmdk';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, LayoutDashboard, Users, Settings, LogOut, Sparkles } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { user, logout } = useAuthStore();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  if (!user) return null;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Palette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 m-auto h-[400px] w-full max-w-lg md:top-[20%]"
            style={{ top: 'max(20%, calc(50% - 200px))', bottom: 'auto' }}
          >
            <div className="rounded-xl border border-[var(--color-glass-border)] bg-[#0a0a0a]/90 shadow-2xl overflow-hidden backdrop-blur-xl">
              <Command className="w-full">
                <div className="flex items-center border-b border-[var(--color-glass-border)] px-3">
                  <Search className="mr-2 h-5 w-5 text-muted-foreground shrink-0" />
                  <Command.Input 
                    autoFocus
                    placeholder="Type a command or search..." 
                    className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground text-foreground"
                  />
                </div>
                
                <Command.List className="max-h-[300px] overflow-y-auto p-2">
                  <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
                    No results found.
                  </Command.Empty>

                  <Command.Group heading="Suggestions" className="text-xs font-medium text-muted-foreground px-2 py-1.5">
                    <Command.Item 
                      onSelect={() => { router.push('/dashboard/leads'); setOpen(false); }}
                      className="flex items-center gap-2 px-2 py-2 text-sm text-foreground hover:bg-[var(--color-glass)] rounded-md cursor-pointer mt-1 data-[selected=true]:bg-[var(--color-glass)]"
                    >
                      <Sparkles className="h-4 w-4 text-primary" />
                      <span>Ask AI about a lead</span>
                    </Command.Item>
                  </Command.Group>

                  <Command.Separator className="h-px bg-[var(--color-glass-border)] my-2" />

                  <Command.Group heading="Navigation" className="text-xs font-medium text-muted-foreground px-2 py-1.5">
                    <Command.Item 
                      onSelect={() => { router.push('/dashboard'); setOpen(false); }}
                      className="flex items-center gap-2 px-2 py-2 text-sm text-foreground hover:bg-[var(--color-glass)] rounded-md cursor-pointer mt-1 data-[selected=true]:bg-[var(--color-glass)]"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      <span>Analytics Dashboard</span>
                    </Command.Item>
                    <Command.Item 
                      onSelect={() => { router.push('/dashboard/leads'); setOpen(false); }}
                      className="flex items-center gap-2 px-2 py-2 text-sm text-foreground hover:bg-[var(--color-glass)] rounded-md cursor-pointer mt-1 data-[selected=true]:bg-[var(--color-glass)]"
                    >
                      <Users className="h-4 w-4" />
                      <span>Lead Intelligence</span>
                    </Command.Item>
                    {user.role === 'admin' && (
                      <Command.Item 
                        onSelect={() => { router.push('/dashboard/settings'); setOpen(false); }}
                        className="flex items-center gap-2 px-2 py-2 text-sm text-foreground hover:bg-[var(--color-glass)] rounded-md cursor-pointer mt-1 data-[selected=true]:bg-[var(--color-glass)]"
                      >
                        <Settings className="h-4 w-4" />
                        <span>System Settings</span>
                      </Command.Item>
                    )}
                  </Command.Group>

                  <Command.Separator className="h-px bg-[var(--color-glass-border)] my-2" />

                  <Command.Group heading="Account" className="text-xs font-medium text-muted-foreground px-2 py-1.5">
                    <Command.Item 
                      onSelect={() => { logout(); router.push('/'); setOpen(false); }}
                      className="flex items-center gap-2 px-2 py-2 text-sm text-red-500 hover:bg-red-500/10 rounded-md cursor-pointer mt-1 data-[selected=true]:bg-red-500/10 data-[selected=true]:text-red-500"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </Command.Item>
                  </Command.Group>
                </Command.List>
              </Command>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
