import React from 'react';
import {
  TrendingUp,
  Activity,
  Award,
  ArrowRight,
  MapPin,
  Building2,
  ShieldAlert,
  Sliders,
} from 'lucide-react';
import { EconomicZone, ModelWeights } from '../types/gis';
import { ZONING_COLORS } from '../data/nationalData';

interface ZoneWatchlistSectionProps {
  zones: EconomicZone[];
  selectedZone: EconomicZone | null;
  onSelectZone: (zone: EconomicZone) => void;
  weights: ModelWeights;
  onScrollToLab: () => void;
}

export const ZoneWatchlistSection: React.FC<ZoneWatchlistSectionProps> = ({
  zones,
  selectedZone,
  onSelectZone,
  weights,
  onScrollToLab,
}) => {
  // Sort zones by dynamic weighted score
  const sortedZones = [...zones].sort((a, b) => {
    const scoreA = (a.economicActivityScore * weights.opportunity + a.infrastructureScore * weights.infrastructure) / 100;
    const scoreB = (b.economicActivityScore * weights.opportunity + b.infrastructureScore * weights.infrastructure) / 100;
    return scoreB - scoreA;
  });

  return (
    <section id="watchlist" className="w-full py-16 sm:py-20 bg-[var(--parchment)] border-b border-[var(--line)]">
      <div className="wrap space-y-8">
        {/* Section Header */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="font-mono text-xs uppercase font-bold text-[var(--muted)] mb-1">
              04 — ZONE WATCHLIST & RANKINGS
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[var(--ink)] tracking-tight font-sans">
              Candidate zones,
              <br />
              <em className="font-serif italic font-normal text-[var(--orange)]">ranked by live evidence.</em>
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-[var(--ink-soft)] max-w-md font-sans">
            Candidate economic parcels across Kenya evaluated against current model weights. Click any zone to inspect its dominant sector mix or modify its classification in the Sandwich Lab.
          </p>
        </div>

        {/* Zone Table / Card Grid */}
        <div className="bg-[var(--paper)] border border-[var(--line)] rounded-xl overflow-hidden shadow-xs divide-y divide-[var(--line)]">
          {sortedZones.map((zone, idx) => {
            const isSelected = selectedZone?.id === zone.id;
            const zoningMeta = ZONING_COLORS[zone.currentZoning];

            // Computed dynamic pilot score
            const dynamicScore = Math.min(
              99,
              Math.round(
                (zone.economicActivityScore * weights.opportunity +
                  zone.infrastructureScore * weights.infrastructure +
                  (100 - (zone.risks[0]?.severity === 'critical' ? 40 : 15)) * weights.resilience +
                  zone.growthPotentialScore * weights.inclusion) /
                  (weights.opportunity + weights.infrastructure + weights.resilience + weights.inclusion)
              )
            );

            return (
              <div
                key={zone.id}
                onClick={() => onSelectZone(zone)}
                className={`p-4 sm:p-5 flex flex-wrap lg:flex-nowrap items-center justify-between gap-4 cursor-pointer transition-all ${
                  isSelected ? 'bg-[var(--blue-light)]/20 border-l-4 border-l-[var(--blue)]' : 'hover:bg-[var(--parchment)]/50'
                }`}
              >
                {/* Left: Code, Name, Corridor & Current Zoning */}
                <div className="flex items-start space-x-3 min-w-[280px]">
                  <span className="font-mono text-xs font-bold px-2 py-1 rounded bg-[var(--paper)] border border-[var(--line)] text-[var(--muted)]">
                    #{idx + 1}
                  </span>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-bold text-sm text-[var(--ink)] hover:text-[var(--blue)] transition-colors">
                        {zone.name}
                      </h4>
                      {zone.isOpportunityZone && (
                        <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-[var(--orange-light)] text-[var(--orange)] border border-[var(--orange)]/30">
                          Priority #{zone.opportunityRank}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 text-[11px] text-[var(--muted)] font-mono mt-0.5">
                      <span>{zone.locationName}</span>
                      <span>•</span>
                      <span>{zone.county}</span>
                      <span>•</span>
                      <span className={`px-1.5 py-0.2 rounded border ${zoningMeta.badge}`}>
                        {zoningMeta.label}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Middle: Dominant Sectors */}
                <div className="hidden md:flex flex-col space-y-1 min-w-[220px]">
                  <span className="text-[10px] font-mono uppercase text-[var(--muted)] font-semibold">
                    Dominant Economic Mix
                  </span>
                  <div className="flex flex-wrap gap-1 text-[11px]">
                    {zone.dominantSectors.slice(0, 2).map((s) => (
                      <span
                        key={s.name}
                        className="px-2 py-0.5 rounded bg-[var(--parchment)] border border-[var(--line)] text-[var(--ink-soft)] font-medium"
                      >
                        {s.name} ({s.share}%)
                      </span>
                    ))}
                  </div>
                </div>

                {/* Metrics: Monthly Volume & Foot Traffic */}
                <div className="flex items-center space-x-6 font-mono text-xs">
                  <div>
                    <div className="text-[10px] text-[var(--muted)] uppercase">Monthly Volume</div>
                    <div className="font-bold text-[var(--ink)]">
                      KES {zone.monthlyTxVolumeKES >= 1000 ? `${(zone.monthlyTxVolumeKES / 1000).toFixed(1)}B` : `${zone.monthlyTxVolumeKES}M`}
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] text-[var(--muted)] uppercase">Foot Traffic</div>
                    <div className="font-bold text-[var(--ink)]">
                      {zone.footTrafficDaily.toLocaleString()}/day
                    </div>
                  </div>
                </div>

                {/* Right: Score Ring & Action Button */}
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="font-mono text-xl font-black text-[var(--blue)]">
                      {dynamicScore}
                      <span className="text-xs text-[var(--muted)] font-normal">/100</span>
                    </div>
                    <div className="text-[9px] font-mono text-[var(--muted)] uppercase">Pilot Score</div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectZone(zone);
                      onScrollToLab();
                    }}
                    className="p-2 rounded-md bg-[var(--paper)] hover:bg-[var(--blue)] hover:text-white border border-[var(--line)] text-[var(--ink)] transition-colors"
                    title="Modify in Sandwich Lab"
                  >
                    <Sliders className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
