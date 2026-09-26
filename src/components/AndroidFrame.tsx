import React from 'react';
import { Smartphone, Monitor, Wifi, BatteryMedium, Signal, Camera } from 'lucide-react';

interface AndroidFrameProps {
  children: React.ReactNode;
  isMobileMode: boolean;
  onToggleMode: (mobile: boolean) => void;
  onOpenScreenshots: () => void;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({
  children,
  isMobileMode,
  onToggleMode,
  onOpenScreenshots,
}) => {
  return (
    <div className="min-h-screen bg-[#060911] text-slate-100 flex flex-col items-center overflow-x-hidden w-full">
      {/* Viewport Mode Switcher Header */}
      <div className="w-full border-b border-slate-800/80 bg-[#090d16]/95 backdrop-blur-md px-3 sm:px-4 py-2 flex items-center justify-between text-xs sticky top-0 z-50">
        <div className="flex items-center gap-1.5 truncate mr-2">
          <span className="font-bold text-amber-400">SeriesRadar</span>
          <span className="text-slate-600 hidden xs:inline">·</span>
          <span className="text-slate-400 truncate hidden xs:inline">Serien-Planung & Release-Tracker</span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={onOpenScreenshots}
            className="flex items-center gap-1 px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg text-[11px] shadow-sm shadow-amber-950/40 transition-all"
            title="Screenshots der App ansehen und als PNG speichern"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Screenshots speichern</span>
          </button>

          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-0.5">
            <button
              onClick={() => onToggleMode(true)}
              className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium transition-all ${
                isMobileMode
                  ? 'bg-slate-800 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Android Smartphone Vorschau"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Smartphone</span>
            </button>
            <button
              onClick={() => onToggleMode(false)}
              className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium transition-all ${
                !isMobileMode
                  ? 'bg-slate-800 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Desktop Übersicht"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Desktop</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {isMobileMode ? (
        <div className="w-full flex-1 flex justify-center py-2 sm:py-6 px-1 sm:px-4 overflow-x-hidden">
          {/* Simulated Android Device (Fluid responsive on real phones, frame on desktop) */}
          <div
            id="android-phone-device"
            className="w-full max-w-[410px] h-[calc(100vh-50px)] sm:h-[840px] max-h-[92vh] bg-[#090d16] rounded-2xl sm:rounded-[40px] border-0 sm:border-[6px] border-slate-800 shadow-2xl shadow-black/80 flex flex-col relative overflow-hidden ring-1 ring-slate-800/80"
          >
            {/* Top Camera Punch Hole (Desktop view only) */}
            <div className="hidden sm:flex absolute top-2 left-1/2 -translate-x-1/2 z-40 items-center justify-center pointer-events-none">
              <div className="w-3 h-3 rounded-full bg-slate-950 ring-1 ring-slate-800/80" />
            </div>

            {/* Android Status Bar */}
            <div className="h-6 w-full px-4 sm:px-6 flex items-center justify-between text-[11px] font-mono-numbers text-slate-400 select-none bg-[#090d16] shrink-0 z-30 pt-0.5">
              <span className="font-semibold text-slate-300 text-[10px]">10:42</span>
              <div className="flex items-center gap-1.5 text-slate-400">
                <Signal className="w-3 h-3" />
                <Wifi className="w-3 h-3" />
                <BatteryMedium className="w-3.5 h-3.5 text-slate-300" />
              </div>
            </div>

            {/* App Screen Content Inside Android Frame */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col relative bg-[#090d16] w-full min-w-0">
              {children}
            </div>

            {/* Android Gesture Navigation Bar Pill */}
            <div className="h-4 w-full bg-[#090d16] flex items-center justify-center shrink-0 z-30 pb-1">
              <div className="w-28 h-1 bg-slate-700/60 rounded-full" />
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-5 flex-1 flex flex-col min-w-0">
          {children}
        </div>
      )}
    </div>
  );
};
