import React from 'react';

export const SiteFooter: React.FC = () => {
  return (
    <footer className="w-full border-t border-[var(--line)] bg-[var(--paper)] py-12 text-xs text-[var(--ink-soft)] font-mono">
      <div className="wrap flex flex-wrap items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-bold text-sm text-[var(--ink)]">GEZ</span>
            <span className="text-[var(--line)]">•</span>
            <span>Geospatial Economic Zoning</span>
          </div>
          <p className="text-[11px] text-[var(--muted)] mt-1 font-sans">
            Agentic spatial intelligence for accountable growth across Kenya.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-5 text-[11px]">
          <span>47 Counties Monitored</span>
          <span>•</span>
          <span>5 Economic Corridors</span>
          <span>•</span>
          <span>PLUPA 2019 Compliant</span>
          <span>•</span>
          <span>EPSG:4326 Datum</span>
        </div>

        <div className="text-[10px] text-[var(--muted)]">
          © {new Date().getFullYear()} GEZ — Geospatial Economic Zoning Platform.
        </div>
      </div>
    </footer>
  );
};
