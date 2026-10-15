import React from 'react';
import {
  Activity,
  Zap,
  Users,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export const DataLayersSection: React.FC = () => {
  return (
    <section id="layers" className="w-full py-16 sm:py-20 bg-[var(--parchment)] border-b border-[var(--line)]">
      <div className="wrap space-y-10">
        {/* Section Heading */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="font-mono text-xs uppercase font-bold text-[var(--muted)] mb-1">
              02 — DATA LAYERS & EVIDENCE
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[var(--ink)] tracking-tight font-sans">
              The map is not the answer.
              <br />
              <em className="font-serif italic font-normal text-[var(--sage)]">It is where evidence begins to disagree.</em>
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-[var(--ink-soft)] max-w-md font-sans">
            A shared evidence layer helps county planners, local authorities, commercial banks, and small enterprises ask the same question: what should happen here next?
          </p>
        </div>

        {/* 4 Core Evidence Layers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Layer 1: Economic Signals */}
          <div className="bg-[var(--paper)] border border-[var(--line)] rounded-xl p-6 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-[var(--blue)] px-2 py-0.5 rounded bg-[var(--blue-light)]">
                LAYER A
              </span>
              <span className="font-mono text-xs text-[var(--muted)]">PostGIS POS Velocity</span>
            </div>
            <h3 className="text-lg font-bold text-[var(--ink)] flex items-center space-x-2">
              <Activity className="w-4 h-4 text-[var(--blue)]" />
              <span>Economic Signals & Mobile-Money Density</span>
            </h3>
            <p className="text-xs text-[var(--ink-soft)] leading-relaxed">
              Real-time aggregation of retail point-of-sale volume, Safaricom M-Pesa till density, agency banking clusters, and commercial trade turnover across Kenya’s 5 primary growth corridors.
            </p>
            <div className="pt-2 text-[11px] font-mono text-[var(--blue)] font-semibold">
              Tracked Volume: KES 84.5B / mo across 47 Counties
            </div>
          </div>

          {/* Layer 2: Infrastructure Networks */}
          <div className="bg-[var(--paper)] border border-[var(--line)] rounded-xl p-6 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-[var(--sage)] px-2 py-0.5 rounded bg-[var(--sage-light)]">
                LAYER B
              </span>
              <span className="font-mono text-xs text-[var(--muted)]">Utility Spatial Grid</span>
            </div>
            <h3 className="text-lg font-bold text-[var(--ink)] flex items-center space-x-2">
              <Zap className="w-4 h-4 text-[var(--sage)]" />
              <span>Infrastructure Access & Utility Capacity</span>
            </h3>
            <p className="text-xs text-[var(--ink-soft)] leading-relaxed">
              Spatial inventory of KPLC 33kV/132kV bulk step-down substations, municipal treated water trunk conduits, SGR container freight sidings, KeNHA dual carriageways, and fiber optics.
            </p>
            <div className="pt-2 text-[11px] font-mono text-[var(--sage)] font-semibold">
              Verified Utility Nodes: 1,480 Substations & Water Mains
            </div>
          </div>

          {/* Layer 3: Demographics & Foot Traffic */}
          <div className="bg-[var(--paper)] border border-[var(--line)] rounded-xl p-6 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-[var(--orange)] px-2 py-0.5 rounded bg-[var(--orange-light)]">
                LAYER C
              </span>
              <span className="font-mono text-xs text-[var(--muted)]">Mobility Telemetry</span>
            </div>
            <h3 className="text-lg font-bold text-[var(--ink)] flex items-center space-x-2">
              <Users className="w-4 h-4 text-[var(--orange)]" />
              <span>Demographic Mobility & Commuter Vectors</span>
            </h3>
            <p className="text-xs text-[var(--ink-soft)] leading-relaxed">
              Daytime worker influx versus nighttime resident density, matatu passenger transfer interchanges, pedestrian walkway congestion, and school/health catchment radii.
            </p>
            <div className="pt-2 text-[11px] font-mono text-[var(--orange)] font-semibold">
              Daily Monitored Foot Traffic: 1.8M Pedestrians
            </div>
          </div>

          {/* Layer 4: Environmental Hazards */}
          <div className="bg-[var(--paper)] border border-[var(--line)] rounded-xl p-6 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-rose-700 px-2 py-0.5 rounded bg-rose-100">
                LAYER D
              </span>
              <span className="font-mono text-xs text-[var(--muted)]">Hydrology & Hazards</span>
            </div>
            <h3 className="text-lg font-bold text-[var(--ink)] flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>Climate Resilience & Hazard Constraints</span>
            </h3>
            <p className="text-xs text-[var(--ink-soft)] leading-relaxed">
              100-year flood inundation zones, statutory 100m lake/river riparian buffers (NEMA), geological fault lines in the Great Rift Valley, and grid transmission deficit polygons.
            </p>
            <div className="pt-2 text-[11px] font-mono text-rose-700 font-semibold">
              Protected Wetland & Buffer: 34 Eco-Zones Mapped
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
