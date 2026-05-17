'use client';

import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Shield, Fingerprint, Cpu, Lock, Unlock } from 'lucide-react';

export default function VaultLogin() {
  const router = useRouter();
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  
  const handleUnlock = (e: FormEvent) => {
    e.preventDefault();
    setIsUnlocking(true);
    
    // Simulate authentication and unlock sequence
    setTimeout(() => {
      setIsUnlocked(true);
      
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    }, 1500);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 flex items-center justify-center opacity-20 pointer-events-none">
        <div className="w-[800px] h-[800px] rounded-full border-[1px] border-primary/30 animate-[spin_60s_linear_infinite] border-dashed" />
        <div className="absolute w-[600px] h-[600px] rounded-full border-[1px] border-primary/50 animate-[spin_40s_linear_infinite_reverse]" />
      </div>

      <div className="relative z-10 w-full max-w-md p-8">
        <motion.div 
          className="vault-panel angled-border p-10 flex flex-col items-center relative overflow-hidden"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Decorative Corner Elements */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary/60 m-2" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary/60 m-2" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary/60 m-2" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary/60 m-2" />

          {/* Hexagonal Vault Lock */}
          <div className="relative mb-10 w-32 h-32 flex items-center justify-center">
            {/* Outer Hexagon Ring */}
            <motion.svg
              viewBox="0 0 100 100"
              className="absolute inset-0 w-full h-full text-primary/30"
              animate={{ rotate: isUnlocking ? 180 : 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            >
              <polygon points="50 3, 93 25, 93 75, 50 97, 7 75, 7 25" fill="none" stroke="currentColor" strokeWidth="2" />
            </motion.svg>
            
            {/* Inner Hexagon - Solid */}
            <motion.svg
              viewBox="0 0 100 100"
              className="absolute w-24 h-24 text-primary"
              animate={{ 
                rotate: isUnlocking ? -90 : 0,
                scale: isUnlocked ? 1.2 : 1,
                opacity: isUnlocked ? 0 : 1
              }}
              transition={{ duration: 1, ease: "easeInOut" }}
            >
              <polygon points="50 5, 89 27.5, 89 72.5, 50 95, 11 72.5, 11 27.5" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1" className={isUnlocking ? "neon-glow text-glow" : ""} />
            </motion.svg>

            {/* Lock Icon */}
            <AnimatePresence mode="wait">
              {!isUnlocked ? (
                <motion.div
                  key="lock"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  className="z-10 text-primary"
                >
                  {isUnlocking ? <Cpu className="w-10 h-10 animate-pulse" /> : <Lock className="w-10 h-10" />}
                </motion.div>
              ) : (
                <motion.div
                  key="unlock"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="z-10 text-primary text-glow"
                >
                  <Unlock className="w-12 h-12" />
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Glow effect when unlocking */}
            {isUnlocking && (
              <motion.div 
                className="absolute inset-0 bg-primary/20 rounded-full blur-xl"
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0] }}
                transition={{ duration: 1.5 }}
              />
            )}
          </div>

          <div className="text-center mb-8 w-full">
            <h1 className="text-3xl font-display font-bold text-white tracking-widest text-glow mb-1">
              SERVICEHIVE
            </h1>
            <div className="text-primary/80 text-xs tracking-[0.3em] uppercase font-semibold">
              Data Vault Access
            </div>
          </div>

          <form onSubmit={handleUnlock} className="w-full space-y-5">
            <div className="space-y-1">
              <label className="text-[10px] uppercase text-primary/70 tracking-widest font-semibold ml-1">Agent ID</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-primary/50">
                  <Shield className="w-4 h-4" />
                </div>
                <input 
                  type="text" 
                  disabled={isUnlocking}
                  className="w-full bg-black/40 border border-primary/30 rounded-none text-white pl-10 px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-colors placeholder:text-white/20 text-sm font-mono"
                  placeholder="OPR-7749"
                  defaultValue="OPR-7749"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase text-primary/70 tracking-widest font-semibold ml-1">Clearance Code</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-primary/50">
                  <Fingerprint className="w-4 h-4" />
                </div>
                <input 
                  type="password" 
                  disabled={isUnlocking}
                  className="w-full bg-black/40 border border-primary/30 rounded-none text-white pl-10 px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-colors placeholder:text-white/20 text-sm font-mono tracking-widest"
                  placeholder="••••••••"
                  defaultValue="hive2026"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isUnlocking}
              className="w-full relative group mt-6 bg-primary text-black font-bold py-3 uppercase tracking-widest text-sm hover:bg-primary-hover transition-colors overflow-hidden angled-border-lg"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isUnlocking ? 'Authenticating...' : 'Initialize Uplink'}
              </span>
              <div className="absolute inset-0 h-full w-0 bg-white/20 group-hover:w-full transition-all duration-300 ease-out z-0" />
            </button>
          </form>
          
          {/* Status Indicator */}
          <div className="mt-6 w-full flex items-center justify-between text-[10px] font-mono text-primary/50">
            <span className="flex items-center gap-1">
              <span className={`w-1.5 h-1.5 rounded-full ${isUnlocking ? 'bg-accent animate-pulse' : 'bg-primary'}`}></span>
              SYS.SECURE
            </span>
            <span>v2.0.4 // ENCRYPTED</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
