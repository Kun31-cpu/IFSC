import React, { useState, useEffect } from "react";
import { Wifi, Battery, Signal, ArrowLeft, RotateCcw, Smartphone, Laptop } from "lucide-react";

interface AndroidSimulatorProps {
  children: React.ReactNode;
  isSimulatorActive: boolean;
  onToggleSimulator: () => void;
  isDarkMode: boolean;
}

export const AndroidSimulator: React.FC<AndroidSimulatorProps> = ({
  children,
  isSimulatorActive,
  onToggleSimulator,
  isDarkMode,
}) => {
  const [timeString, setTimeString] = useState("04:43 AM");

  useEffect(() => {
    // Basic clocks updater to keep the status bar time lively
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours ? hours : 12; // block zero hour
      setTimeString(`${hours}:${minutes} ${ampm}`);
    };
    
    updateTime();
    const interval = setInterval(updateTime, 15000);
    return () => clearInterval(interval);
  }, []);

  if (!isSimulatorActive) {
    return (
      <div className="w-full h-full animate-fade-up">
        {children}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-2 lg:p-6 w-full min-h-[85vh] animate-fade-up">
      {/* Device Frame Wrapper Container */}
      <div className="relative mx-auto w-full max-w-[400px] bg-zinc-950 rounded-[55px] p-3.5 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] border-4 border-zinc-800 ring-10 ring-zinc-900/10 flex flex-col overflow-hidden transition-all duration-500 hover:shadow-[0_30px_60px_-10px_rgba(0,0,0,0.6)]">
        
        {/* Sleek Camera Punch Hole */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-zinc-900 rounded-full z-50 border-2 border-zinc-950 flex items-center justify-center">
          <div className="w-1 h-1 bg-blue-900 rounded-full opacity-40"></div>
        </div>

        {/* Ear Speaker Bezel Detail */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-1 bg-zinc-800 rounded-full z-50"></div>

        {/* Android Display Screen Canvas */}
        <div className="w-full rounded-[42px] bg-zinc-50 dark:bg-zinc-950 overflow-hidden flex flex-col h-[740px] relative border border-zinc-900/20 shadow-inner select-none">
          
          {/* Status Bar */}
          <div className="h-9 px-6 bg-transparent flex items-center justify-between text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 z-40 select-none pointer-events-none mt-1">
            <span className="font-sans tracking-tight">{timeString}</span>
            <div className="flex items-center gap-1.5">
              <Signal size={12} className="text-zinc-700 dark:text-zinc-300" />
              <div className="text-[10px] uppercase font-bold tracking-tighter">5G</div>
              <Wifi size={12} className="text-zinc-700 dark:text-zinc-300" />
              <div className="flex items-center gap-0.5">
                <span className="text-[9px]">98%</span>
                <Battery size={13} className="text-emerald-500 fill-emerald-500" />
              </div>
            </div>
          </div>

          {/* Active Application Context Container */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden relative flex flex-col text-sm h-full pb-10">
            {children}
          </div>

          {/* Physical Bottom Android Soft Keys Navigation */}
          <div className="absolute bottom-0 inset-x-0 h-10 bg-zinc-50/90 dark:bg-zinc-950/95 backdrop-blur-md flex items-center justify-around text-zinc-400 dark:text-zinc-500 border-t border-zinc-100 dark:border-zinc-900 z-40 select-none pb-1.5">
            {/* Back Arrow Key Button */}
            <button 
              className="p-1.5 hover:text-zinc-800 dark:hover:text-zinc-100 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors"
              title="Android Back"
              id="android-back-btn"
            >
              <ArrowLeft size={16} />
            </button>
            {/* Home Pill Button */}
            <button 
              className="w-12 h-3.5 bg-zinc-300 dark:bg-zinc-700 rounded-full hover:bg-zinc-400 dark:hover:bg-zinc-600 transition-colors"
              title="Android Home"
              id="android-home-btn"
            >
              <div className="sr-only">Home</div>
            </button>
            {/* Overview Box Button */}
            <button 
              className="p-2 hover:text-zinc-800 dark:hover:text-zinc-100 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors flex items-center justify-center"
              title="Android Recents"
              id="android-recents-btn"
            >
              <div className="w-3.5 h-3.5 border-2 border-zinc-400 dark:border-zinc-500 rounded-sm"></div>
            </button>
          </div>
        </div>
      </div>

      <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-4 font-medium flex items-center gap-1">
        <Smartphone size={12} />
        Live Android APK Sandbox Simulation
      </p>
    </div>
  );
};
