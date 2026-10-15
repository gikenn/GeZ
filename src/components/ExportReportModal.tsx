import React from 'react';
import {
  X,
  Printer,
  Download,
  Building2,
  FileCheck2,
  MapPin,
  TrendingUp,
  ShieldAlert,
  Activity,
  CheckCircle2,
} from 'lucide-react';
import { EconomicZone, ScenarioResult } from '../types/gis';
import { ALL_KENYA_ZONES, ZONING_COLORS } from '../data/nationalData';

interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  zone: EconomicZone | null;
  activeScenario: ScenarioResult | null;
}

export const ExportReportModal: React.FC<ExportReportModalProps> = ({
  isOpen,
  onClose,
  zone: initialZone,
  activeScenario,
}) => {
  if (!isOpen) return null;

  const zone = initialZone || ALL_KENYA_ZONES[0];
  const zoningMeta = ZONING_COLORS[zone.currentZoning];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-[var(--paper)] border border-[var(--line)] rounded-xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-[var(--ink)]">
        {/* Modal Header (Hidden on print) */}
        <div className="px-6 py-4 border-b border-[var(--line)] bg-[var(--parchment)] flex items-center justify-between no-print">
          <div className="flex items-center space-x-2.5">
            <FileCheck2 className="w-5 h-5 text-[var(--blue)]" />
            <div>
              <h2 className="text-sm font-bold text-[var(--ink)]">
                National Spatial Intelligence Dossier
              </h2>
              <p className="text-[11px] text-[var(--muted)]">
                PDF Executive Summary • Kenya Geospatial Economic Zoning
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-[var(--blue)] hover:bg-[#155465] text-white text-xs font-mono font-semibold transition-all shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-[var(--muted)] hover:text-[var(--ink)] rounded-md hover:bg-[var(--line)]/50 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Document Container */}
        <div className="flex-1 overflow-y-auto p-8 bg-[var(--parchment)]/40 print:bg-white print:text-black print:p-0">
          <div className="max-w-2xl mx-auto bg-[var(--paper)] print:bg-white border border-[var(--line)] print:border-none p-6 sm:p-8 rounded-xl space-y-6 text-[var(--ink)] print:text-black shadow-xs">
            {/* Kenya National Header */}
            <div className="border-b border-[var(--line)] pb-5">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-[10px] uppercase tracking-widest font-mono text-[var(--blue)] font-bold">
                    REPUBLIC OF KENYA • NATIONAL SPATIAL PLATFORM
                  </div>
                  <h1 className="text-xl font-black text-[var(--ink)] print:text-black mt-1 font-sans">
                    GEOSPATIAL ECONOMIC ZONING (GEZ) DOSSIER
                  </h1>
                  <p className="text-xs text-[var(--muted)] mt-0.5 font-sans">
                    Physical and Land Use Planning Act 2019 (PLUPA) Statutory Framework
                  </p>
                </div>
                <div className="text-right text-[10px] font-mono text-[var(--muted)]">
                  <div>REF: GEZ-KEN-{zone.id.toUpperCase()}-2026</div>
                  <div>DATE: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                  <div>CRS: EPSG:4326 (WGS84)</div>
                </div>
              </div>
            </div>

            {/* Target Geography Profile */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-base font-bold text-[var(--ink)] print:text-black flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-[var(--orange)]" />
                  <span>{zone.name}</span>
                </h2>
                <span className="text-xs font-mono font-medium px-2 py-0.5 rounded border border-[var(--line)] bg-[var(--parchment)] text-[var(--ink)]">
                  {zoningMeta.label}
                </span>
              </div>
              <p className="text-xs text-[var(--ink-soft)] leading-relaxed font-sans">
                {zone.summary}
              </p>
              <div className="mt-2 text-[11px] font-mono text-[var(--muted)]">
                Location: {zone.locationName} • County: {zone.county} • Area: {zone.areaSqKm} km²
              </div>
            </div>

            {/* Spatial Metrics Table */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
              <div className="bg-[var(--parchment)] p-2.5 rounded border border-[var(--line)]">
                <div className="text-[9px] uppercase text-[var(--muted)]">Activity Score</div>
                <div className="text-base font-bold text-[var(--blue)]">{zone.economicActivityScore} / 100</div>
              </div>
              <div className="bg-[var(--parchment)] p-2.5 rounded border border-[var(--line)]">
                <div className="text-[9px] uppercase text-[var(--muted)]">Growth Score</div>
                <div className="text-base font-bold text-[var(--sage)]">{zone.growthPotentialScore} / 100</div>
              </div>
              <div className="bg-[var(--parchment)] p-2.5 rounded border border-[var(--line)]">
                <div className="text-[9px] uppercase text-[var(--muted)]">Monthly Volume</div>
                <div className="text-base font-bold text-[var(--ink)]">
                  KES {zone.monthlyTxVolumeKES >= 1000 ? `${(zone.monthlyTxVolumeKES / 1000).toFixed(1)}B` : `${zone.monthlyTxVolumeKES}M`}
                </div>
              </div>
              <div className="bg-[var(--parchment)] p-2.5 rounded border border-[var(--line)]">
                <div className="text-[9px] uppercase text-[var(--muted)]">Foot Traffic</div>
                <div className="text-base font-bold text-[var(--orange)]">
                  {zone.footTrafficDaily.toLocaleString()} / day
                </div>
              </div>
            </div>

            {/* Dominant Sectors & Infrastructure */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-[var(--parchment)]/50 p-3.5 rounded-lg border border-[var(--line)] space-y-2">
                <div className="font-semibold text-[var(--ink)] flex items-center space-x-1.5">
                  <Activity className="w-3.5 h-3.5 text-[var(--blue)]" />
                  <span>Dominant Business Mix (POS Density)</span>
                </div>
                <div className="space-y-1.5">
                  {zone.dominantSectors.map((s) => (
                    <div key={s.name} className="flex justify-between items-center text-[11px]">
                      <span className="text-[var(--ink-soft)]">{s.name}</span>
                      <span className="font-mono font-semibold text-[var(--ink)]">{s.share}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[var(--parchment)]/50 p-3.5 rounded-lg border border-[var(--line)] space-y-2">
                <div className="font-semibold text-[var(--ink)] flex items-center space-x-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[var(--sage)]" />
                  <span>Infrastructure Audit</span>
                </div>
                <div className="space-y-1 text-[11px] font-mono text-[var(--ink-soft)]">
                  <div>• Grid: {zone.infrastructure.powerGrid}</div>
                  <div>• Water: {zone.infrastructure.waterAccess}</div>
                  <div>• Road: {zone.infrastructure.roadType}</div>
                  <div>• Distance to Referral Hospital: {zone.infrastructure.distanceToHospitalKm} km</div>
                  <div>• Fiber Optic Trunk: {zone.infrastructure.fiberOpticBroadband ? 'Connected' : 'Pending Extension'}</div>
                </div>
              </div>
            </div>

            {/* Active Scenario Simulation Results (If simulated) */}
            {activeScenario && (
              <div className="bg-[var(--blue-light)]/20 border border-[var(--blue)]/40 p-4 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-xs text-[var(--blue)] uppercase font-mono tracking-wider">
                    Simulated Rezoning Scenario Impact
                  </div>
                  <span className="text-[10px] font-mono text-[var(--ink)] font-semibold">
                    {ZONING_COLORS[activeScenario.originalZoning].label} → {ZONING_COLORS[activeScenario.simulatedZoning].label}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                  <div className="bg-[var(--paper)] p-2 rounded border border-[var(--line)]">
                    <div className="text-[9px] text-[var(--muted)]">Economic Velocity</div>
                    <div className="text-sm font-bold text-[var(--blue)]">
                      {activeScenario.economicActivityBefore} → {activeScenario.economicActivityAfter}
                    </div>
                  </div>
                  <div className="bg-[var(--paper)] p-2 rounded border border-[var(--line)]">
                    <div className="text-[9px] text-[var(--muted)]">Population Served</div>
                    <div className="text-sm font-bold text-[var(--sage)]">
                      {activeScenario.populationServedAfter.toLocaleString()}
                    </div>
                  </div>
                  <div className="bg-[var(--paper)] p-2 rounded border border-[var(--line)]">
                    <div className="text-[9px] text-[var(--muted)]">Fiscal Delta</div>
                    <div className="text-sm font-bold text-[var(--orange)]">
                      +{(activeScenario.estimatedTaxRevenueAnnualDeltaKES / 1000000).toFixed(0)}M KES/yr
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-[var(--ink-soft)] font-sans leading-relaxed">
                  {activeScenario.executiveSummary}
                </p>
              </div>
            )}

            {/* Risk & Constraints */}
            <div>
              <h3 className="text-xs font-bold text-[var(--ink)] flex items-center space-x-1.5 mb-2">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                <span>Physical Constraints & Disaster Risk Assessment</span>
              </h3>
              <div className="space-y-1.5 text-[11px]">
                {zone.risks.map((r, idx) => (
                  <div key={idx} className="bg-[var(--parchment)] p-2 rounded border border-[var(--line)] flex justify-between items-start">
                    <div>
                      <span className="font-semibold text-[var(--ink)]">{r.title}:</span>{' '}
                      <span className="text-[var(--ink-soft)]">{r.description}</span>
                    </div>
                    <span className="text-[9px] font-mono uppercase px-1 py-0.5 rounded bg-rose-100 text-rose-700 ml-2 flex-shrink-0">
                      {r.severity}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Statutory Action Recommendation */}
            <div className="bg-[var(--sage-light)]/40 border border-[var(--sage)]/40 p-3.5 rounded-lg text-xs">
              <span className="text-[9px] font-mono uppercase tracking-widest text-[var(--sage)] font-bold block mb-1">
                Statutory Physical Planning Recommendation (PLUPA 2019)
              </span>
              <p className="text-[var(--ink)] font-medium">
                {zone.recommendedZoningAction}
              </p>
            </div>

            {/* Sign-off Stamps */}
            <div className="pt-4 border-t border-[var(--line)] flex justify-between items-end text-[10px] font-mono text-[var(--muted)]">
              <div>
                <div>PREPARED BY: GEZ Agentic Spatial Intelligence</div>
                <div>APPROVED FOR COUNTY GAZETTING REVIEW</div>
              </div>
              <div className="text-right">
                <div className="w-28 border-b border-[var(--line)] mb-1" />
                <div>Director of Physical Planning</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
