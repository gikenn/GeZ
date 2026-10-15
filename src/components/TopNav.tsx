import React from 'react';
import {
  Layers,
  Sparkles,
  TrendingUp,
  Download,
  Sliders,
  RefreshCw,
  Compass,
  Cpu,
  Building2,
  FileCheck2,
} from 'lucide-react';
import { EconomicZone } from '../types/gis';

interface TopNavProps {
  selectedZone: EconomicZone | null;
  onOpenScenarioModal: () => void;
  onOpenExportModal: () => void;
  onToggleCopilot: () => void;
  isCopilotOpen: boolean;
  onResetView: () => void;
  activeLayerCount: number;
}

export const TopNav: React.FC<TopNavProps> = ({
  selectedZone,
  onOpenScenarioModal,
  onOpenExportModal,
  onToggleCopilot,
  isCopilotOpen,
  onResetView,
  activeLayerCount,
}) => {
  return (
    <header className="h-14 bg-slate-950/95 backdrop-blur-md border-b border-slate-800/80 px-4 flex items-center justify-between z-40 select-none text-slate-100">
      {/* Brand & County Identity */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2.5">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 font-black tracking-tight text-sm shadow-[0_0_12px_rgba(16,185,129,0.25)]">
            <span>GEZ</span>
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-bold text-sm tracking-wide text-slate-100 font-sans">
                GEZ <span className="text-slate-400 font-normal">| Geospatial Economic Zoning</span>
              </h1>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Kisumu County
              </span>
            </div>
            <p className="text-[11px] text-slate-400 flex items-center space-x-2 font-mono">
              <span>0.0917° S, 34.7680° E</span>
              <span>•</span>
              <span className="text-slate-500">PostGIS Engine 2.4</span>
            </p>
          </div>
        </div>
      </div>

      {/* Live Geospatial Tickers (Fintech/Govtech) */}
      <div className="hidden lg:flex items-center space-x-5 text-xs font-mono">
        <div className="flex items-center space-x-2 bg-slate-900/90 px-2.5 py-1 rounded-md border border-slate-800">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-slate-400">Tracked M-Pesa Vol:</span>
          <span className="text-emerald-400 font-semibold">KES 12.8B / mo</span>
        </div>

        <div className="flex items-center space-x-2 bg-slate-900/90 px-2.5 py-1 rounded-md border border-slate-800">
          <Building2 className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-slate-400">Opportunity Zones:</span>
          <span className="text-blue-400 font-semibold">6 Priority SEZs</span>
        </div>

        <div className="flex items-center space-x-2 bg-slate-900/90 px-2.5 py-1 rounded-md border border-slate-800">
          <Layers className="w-3.5 h-3.5 text-purple-400" />
          <span className="text-slate-400">Active Layers:</span>
          <span className="text-purple-400 font-semibold">{activeLayerCount} / 7</span>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center space-x-2">
        <button
          onClick={onResetView}
          title="Reset map view to Kisumu County"
          className="p-1.5 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-colors border border-transparent hover:border-slate-700"
        >
          <RefreshCw className="w-4 h-4" />
        </button>

        {/* Scenario Simulator */}
        <button
          onClick={onOpenScenarioModal}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 text-xs font-medium transition-all shadow-sm"
        >
          <Sliders className="w-3.5 h-3.5 text-indigo-400" />
          <span>Scenario Simulator</span>
          {selectedZone && (
            <span className="hidden sm:inline-block max-w-[90px] truncate text-[10px] text-indigo-200 bg-indigo-500/20 px-1 py-0.5 rounded">
              {selectedZone.name.split(' ')[0]}
            </span>
          )}
        </button>

        {/* Export Insight Report */}
        <button
          onClick={onOpenExportModal}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700/80 text-slate-200 border border-slate-700 text-xs font-medium transition-all shadow-sm"
        >
          <Download className="w-3.5 h-3.5 text-slate-300" />
          <span className="hidden sm:inline">Export Insight</span>
          <span className="sm:hidden">Export</span>
        </button>

        {/* Zoning Copilot AI Toggle */}
        <button
          onClick={onToggleCopilot}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border shadow-sm ${
            isCopilotOpen
              ? 'bg-emerald-500/25 text-emerald-300 border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
              : 'bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 border-emerald-500/30'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span>Zoning Copilot</span>
        </button>
      </div>
    </header>
  );
};
