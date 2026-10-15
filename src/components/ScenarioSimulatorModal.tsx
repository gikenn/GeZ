import React, { useState, useEffect } from 'react';
import {
  X,
  Sliders,
  TrendingUp,
  Activity,
  Users,
  Compass,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  FileText,
  RotateCcw,
} from 'lucide-react';
import { EconomicZone, ZoningCategory, ScenarioResult } from '../types/gis';
import { KISUMU_ZONES, ZONING_COLORS } from '../data/kisumuData';

interface ScenarioSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  zone: EconomicZone | null;
  onApplyScenario: (result: ScenarioResult) => void;
}

const AVAILABLE_ZONING_OPTIONS: { id: ZoningCategory; label: string; description: string }[] = [
  { id: 'mixed_use', label: 'Mixed-Use (Commercial / Residential)', description: 'Ground floor retail, professional chambers, and multi-story apartments.' },
  { id: 'commercial_core', label: 'Commercial Core (CBD Tier-1)', description: 'Maximum Floor Area Ratio (FAR 4.5+), banking towers, corporate HQs.' },
  { id: 'commercial_subcenter', label: 'Commercial Sub-Center', description: 'Secondary commercial strip with hardware, auto-repair, and retail stalls.' },
  { id: 'industrial_light', label: 'Light Industrial & Logistics Hub', description: 'Warehousing, cold storage, courier transshipment, light assembly.' },
  { id: 'industrial_heavy_sez', label: 'Agro-Industrial Special Economic Zone (SEZ)', description: 'Manufacturing, export processing, tax holidays, bulk container yards.' },
  { id: 'residential_high', label: 'Residential (High Density Planned)', description: 'Multi-family residential blocks with mandated municipal sewer and storm drains.' },
  { id: 'residential_low', label: 'Residential (Low Density Gated)', description: 'Single family villas with green buffer requirements and low FAR.' },
  { id: 'agricultural_periurban', label: 'Agricultural Peri-Urban & Agro-Processing', description: 'Paddy irrigation, farm assembly cooperatives, greenhouse clusters.' },
  { id: 'protected_wetland', label: 'Protected Wetland / Ecological Buffer', description: 'Strict environmental preservation with zero concrete foundations allowed.' },
];

export const ScenarioSimulatorModal: React.FC<ScenarioSimulatorModalProps> = ({
  isOpen,
  onClose,
  zone: initialZone,
  onApplyScenario,
}) => {
  const [selectedZoneId, setSelectedZoneId] = useState<string>(initialZone?.id || KISUMU_ZONES[0].id);
  const currentZone = KISUMU_ZONES.find((z) => z.id === selectedZoneId) || initialZone || KISUMU_ZONES[0];

  const [targetZoning, setTargetZoning] = useState<ZoningCategory>('mixed_use');
  const [densityMultiplier, setDensityMultiplier] = useState<number>(1.5); // 1.0 to 2.5
  const [infrastructureInvestmentKES, setInfrastructureInvestmentKES] = useState<number>(45000000); // 45M KES

  useEffect(() => {
    if (initialZone) {
      setSelectedZoneId(initialZone.id);
      // Default target to mixed_use unless it's already mixed_use
      if (initialZone.currentZoning === 'mixed_use') {
        setTargetZoning('commercial_core');
      } else if (initialZone.currentZoning === 'residential_low' || initialZone.currentZoning === 'residential_high') {
        setTargetZoning('mixed_use');
      } else if (initialZone.currentZoning === 'agricultural_periurban') {
        setTargetZoning('industrial_heavy_sez');
      } else {
        setTargetZoning('mixed_use');
      }
    }
  }, [initialZone]);

  if (!isOpen) return null;

  // Calculate dynamic scenario impact based on selected zone, current zoning, target zoning, and density
  const isTargetSame = currentZone.currentZoning === targetZoning;
  
  // Baseline scores
  const ecoBefore = currentZone.economicActivityScore;
  const accessBefore = currentZone.infrastructureScore;
  const popServedBefore = currentZone.daytimePopulation;
  const investBefore = Math.round((currentZone.growthPotentialScore + currentZone.economicActivityScore) / 2);

  // Dynamic Delta Computation
  let ecoDelta = 0;
  let accessDelta = 0;
  let popMultiplier = 1.0;
  let investDelta = 0;
  let strainRisk: 'Low' | 'Moderate' | 'High' = 'Moderate';
  let plainExplanation = '';
  let checklist: string[] = [];
  let revenueDeltaKES = 0;

  if (targetZoning === 'mixed_use') {
    ecoDelta = +16 * (densityMultiplier / 1.5);
    accessDelta = +8;
    popMultiplier = 1.45 * (densityMultiplier / 1.5);
    investDelta = +18;
    strainRisk = densityMultiplier > 1.8 ? 'High' : 'Moderate';
    plainExplanation = `Reclassifying **${currentZone.name}** to **Mixed-Use** unlocks vertical multi-tenant development. Ground-floor storefronts activate foot traffic, while upper-floor professional chambers and apartments increase the 24-hour economic multiplier. Driven by M-Pesa merchant turnover, local revenue collection expands rapidly.`;
    checklist = [
      'Publish statutory 14-day public participation notice under Physical and Land Use Planning Act 2019.',
      'Mandate KIWASCO water/sewer line capacity expansion prior to occupancy certificates.',
      'Enforce minimum 3.0m pedestrian sidewalk reservation and off-street delivery bays.',
    ];
    revenueDeltaKES = Math.round(currentZone.monthlyTxVolumeKES * 12 * 0.02 * 1000000 * 1.35);
  } else if (targetZoning === 'commercial_core') {
    ecoDelta = +22 * (densityMultiplier / 1.5);
    accessDelta = +12;
    popMultiplier = 1.7 * (densityMultiplier / 1.5);
    investDelta = +24;
    strainRisk = 'High';
    plainExplanation = `Designating **${currentZone.name}** as a **Commercial Core (CBD Expansion)** creates institutional-grade capacity for Tier-1 commercial banks, fintech hubs, and corporate high-rises. Floor Area Ratio (FAR) expands from standard limits up to 4.5. This directly diverts severe congestion away from the historic colonial CBD.`;
    checklist = [
      'Gazette Transit-Oriented Development (TOD) overlay along primary arterial roads.',
      'Deploy smart metered curbside parking management system.',
      'Mandate underground stormwater surge retention cisterns for plots exceeding 0.25 acres.',
    ];
    revenueDeltaKES = Math.round(currentZone.monthlyTxVolumeKES * 12 * 0.03 * 1000000 * 1.5);
  } else if (targetZoning === 'industrial_heavy_sez') {
    ecoDelta = +28;
    accessDelta = +10;
    popMultiplier = 1.9;
    investDelta = +32;
    strainRisk = 'High';
    plainExplanation = `Transitioning to an **Agro-Industrial Special Economic Zone** unlocks national tax exemptions, customs bond incentives, and export logistics. Western Kenya produce (sugar, tea, horticulture, fish) can be processed on-site. Requires substantial high-voltage 33kV substation capital works.`;
    checklist = [
      'Coordinate with Special Economic Zones Authority (SEZA) for Kenya national gazettement.',
      'Execute tripartite agreement with KETRACO and Kenya Power for dedicated 33kV industrial feeder.',
      'Conduct comprehensive NEMA Environmental and Social Impact Assessment (ESIA) for effluent discharge.',
    ];
    revenueDeltaKES = 380000000;
  } else if (targetZoning === 'commercial_subcenter') {
    ecoDelta = +14;
    accessDelta = +6;
    popMultiplier = 1.3;
    investDelta = +12;
    strainRisk = 'Moderate';
    plainExplanation = `Formalizing **Commercial Sub-Center** status organizes informal retail, motor spares, and hardware yards into structured commercial corridors with clear vehicular ingress and egress.`;
    checklist = [
      'Demarcate formal boda-boda and matatu staging bays.',
      'Pave service lanes with interlocking concrete paving blocks to eliminate dust and muddy run-off.',
      'Enforce solid waste recycling collection covenants for trade associations.',
    ];
    revenueDeltaKES = Math.round(currentZone.monthlyTxVolumeKES * 12 * 0.015 * 1000000);
  } else if (targetZoning === 'protected_wetland') {
    ecoDelta = -18;
    accessDelta = -5;
    popMultiplier = 0.5;
    investDelta = +15; // Eco tourism investment
    strainRisk = 'Low';
    plainExplanation = `Reverting to **Protected Wetland / Ecological Buffer** halts unauthorized concrete encroachment, preserving Lake Victoria's natural bio-filtration and shoreline fish spawning habitats. Fosters sustainable eco-tourism while lowering flood disaster exposure.`;
    checklist = [
      'Erect NEMA boundary beacons along statutory 100m riparian reserve.',
      'Revoke unauthorized commercial development permits in low-lying flood channels.',
      'Support community eco-tourism concessions (boardwalks, birding observatories).',
    ];
    revenueDeltaKES = 25000000;
  } else {
    ecoDelta = +8;
    accessDelta = +4;
    popMultiplier = 1.15;
    investDelta = +10;
    strainRisk = 'Low';
    plainExplanation = `Standard zoning adjustment optimizing density and local land-rate productivity in alignment with the Kisumu County Spatial Plan (2022-2032).`;
    checklist = [
      'Standard physical planning development permission review.',
      'Verify building line setbacks and road reservation compliance.',
    ];
    revenueDeltaKES = 45000000;
  }

  const ecoAfter = Math.min(100, Math.max(10, Math.round(ecoBefore + ecoDelta)));
  const accessAfter = Math.min(100, Math.max(10, Math.round(accessBefore + accessDelta)));
  const popServedAfter = Math.round(popServedBefore * popMultiplier);
  const investAfter = Math.min(100, Math.max(10, Math.round(investBefore + investDelta)));

  const handleApply = () => {
    const result: ScenarioResult = {
      zoneId: currentZone.id,
      originalZoning: currentZone.currentZoning,
      simulatedZoning: targetZoning,
      economicActivityBefore: ecoBefore,
      economicActivityAfter: ecoAfter,
      accessibilityBefore: accessBefore,
      accessibilityAfter: accessAfter,
      populationServedBefore: popServedBefore,
      populationServedAfter: popServedAfter,
      investmentSuitabilityBefore: investBefore,
      investmentSuitabilityAfter: investAfter,
      estimatedTaxRevenueAnnualDeltaKES: revenueDeltaKES,
      infrastructureStrainRisk: strainRisk,
      executiveSummary: plainExplanation,
      actionChecklist: checklist,
    };
    onApplyScenario(result);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <span>Spatial Scenario Simulator</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                  PLUPA 2019 Compliant
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Model policy interventions, rezoning impacts, and fiscal revenue projections for Kisumu
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Controls Bar: Select Zone & Target Zoning */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Target Geographic Zone
              </label>
              <select
                value={selectedZoneId}
                onChange={(e) => setSelectedZoneId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              >
                {KISUMU_ZONES.map((z) => (
                  <option key={z.id} value={z.id}>
                    {z.name} ({ZONING_COLORS[z.currentZoning].label})
                  </option>
                ))}
              </select>
              <div className="flex items-center space-x-2 mt-2 text-[11px] text-slate-400">
                <span>Current Status:</span>
                <span className={`px-2 py-0.5 rounded text-[10px] border ${ZONING_COLORS[currentZone.currentZoning].badge}`}>
                  {ZONING_COLORS[currentZone.currentZoning].label}
                </span>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Proposed Reclassification Zoning
              </label>
              <select
                value={targetZoning}
                onChange={(e) => setTargetZoning(e.target.value as ZoningCategory)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              >
                {AVAILABLE_ZONING_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-indigo-300/90 mt-2 font-sans">
                {AVAILABLE_ZONING_OPTIONS.find((o) => o.id === targetZoning)?.description}
              </p>
            </div>
          </div>

          {/* Density & Infrastructure Leverage Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-900/40 p-4 rounded-xl border border-slate-800/80">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-medium text-slate-300">Floor Area Ratio (FAR) Density:</span>
                <span className="font-mono text-xs text-indigo-400 font-bold">{densityMultiplier}x Standard</span>
              </div>
              <input
                type="range"
                min="10"
                max="25"
                value={Math.round(densityMultiplier * 10)}
                onChange={(e) => setDensityMultiplier(parseInt(e.target.value, 10) / 10)}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                <span>Low FAR (1.0x)</span>
                <span>Balanced (1.5x)</span>
                <span>High Vertical (2.5x)</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-medium text-slate-300">County CIP Infrastructure Grant:</span>
                <span className="font-mono text-xs text-emerald-400 font-bold">
                  KES {(infrastructureInvestmentKES / 1000000).toFixed(0)} Million
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={Math.round(infrastructureInvestmentKES / 1000000)}
                onChange={(e) => setInfrastructureInvestmentKES(parseInt(e.target.value, 10) * 1000000)}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                <span>KES 10M</span>
                <span>KES 50M</span>
                <span>KES 100M</span>
              </div>
            </div>
          </div>

          {/* Simulated Impact: Before vs After Radar & Bar Comparisons */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 font-mono">
              Simulated Performance Impact (Before vs After)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Economic Activity */}
              <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 relative">
                <span className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                  Economic Activity
                </span>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-400 line-through font-mono">{ecoBefore}</div>
                    <div className="text-xl font-black text-blue-400 font-mono">{ecoAfter} / 100</div>
                  </div>
                  <span
                    className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                      ecoAfter >= ecoBefore ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                    }`}
                  >
                    {ecoAfter >= ecoBefore ? `+${ecoAfter - ecoBefore}` : ecoAfter - ecoBefore}
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2.5 overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${ecoAfter}%` }}
                  />
                </div>
              </div>

              {/* Infrastructure Accessibility */}
              <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 relative">
                <span className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                  Accessibility Score
                </span>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-400 line-through font-mono">{accessBefore}</div>
                    <div className="text-xl font-black text-purple-400 font-mono">{accessAfter} / 100</div>
                  </div>
                  <span
                    className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                      accessAfter >= accessBefore ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                    }`}
                  >
                    {accessAfter >= accessBefore ? `+${accessAfter - accessBefore}` : accessAfter - accessBefore}
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2.5 overflow-hidden">
                  <div
                    className="h-full bg-purple-500 rounded-full transition-all duration-500"
                    style={{ width: `${accessAfter}%` }}
                  />
                </div>
              </div>

              {/* Population Served */}
              <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 relative">
                <span className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                  Population Served
                </span>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-400 line-through font-mono">
                      {popServedBefore.toLocaleString()}
                    </div>
                    <div className="text-xl font-black text-cyan-400 font-mono">
                      {popServedAfter.toLocaleString()}
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                    +{Math.round(((popServedAfter - popServedBefore) / popServedBefore) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2.5 overflow-hidden">
                  <div
                    className="h-full bg-cyan-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (popServedAfter / (popServedBefore * 2)) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Investment Suitability */}
              <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 relative">
                <span className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                  Investment Suitability
                </span>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-400 line-through font-mono">{investBefore}</div>
                    <div className="text-xl font-black text-emerald-400 font-mono">{investAfter} / 100</div>
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                    +{investAfter - investBefore}
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2.5 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${investAfter}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Plain-Language Explanation */}
          <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 text-xs leading-relaxed space-y-2">
            <div className="flex items-center space-x-2 text-indigo-400 font-semibold">
              <FileText className="w-4 h-4" />
              <span>Spatial Economic Planner Assessment</span>
            </div>
            <p className="text-slate-300 font-sans">
              {plainExplanation.split('**').map((part, idx) =>
                idx % 2 === 1 ? (
                  <strong key={idx} className="text-white font-semibold">
                    {part}
                  </strong>
                ) : (
                  part
                )
              )}
            </p>
          </div>

          {/* Fiscal Impact & Risk Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-emerald-950/20 border border-emerald-500/40 p-4 rounded-xl">
              <span className="text-[10px] uppercase font-mono text-emerald-400 block mb-1">
                Projected County Fiscal Yield
              </span>
              <div className="text-xl font-black text-emerald-300 font-mono">
                +KES {(revenueDeltaKES / 1000000).toFixed(1)} Million / Year
              </div>
              <p className="text-[11px] text-emerald-200/80 mt-1">
                Derived from revised unimproved site values (USV), single business permits (SBP), and outdoor advertising concessions.
              </p>
            </div>

            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
              <span className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                Infrastructure Strain Assessment
              </span>
              <div className="flex items-center space-x-2">
                <span
                  className={`text-sm font-bold font-mono px-2 py-0.5 rounded ${
                    strainRisk === 'High'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      : strainRisk === 'Moderate'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  }`}
                >
                  {strainRisk} Strain Risk
                </span>
                <span className="text-xs text-slate-400">Requires KIWASCO & KPLC synchronization</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Simulated peak sewer discharge expands by ~35%. County CIP grant of KES {(infrastructureInvestmentKES / 1000000).toFixed(0)}M will offset 70% of network upgrade costs.
              </p>
            </div>
          </div>

          {/* Action Checklist */}
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            <h4 className="text-xs font-semibold text-slate-200 mb-2.5 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>County Statutory Implementation Roadmap</span>
            </h4>
            <div className="space-y-2">
              {checklist.map((item, idx) => (
                <div key={idx} className="flex items-start space-x-2 text-xs text-slate-300">
                  <span className="w-4 h-4 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-mono text-emerald-400 flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between">
          <button
            onClick={() => {
              setTargetZoning('mixed_use');
              setDensityMultiplier(1.5);
              setInfrastructureInvestmentKES(45000000);
            }}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
            >
              Cancel
            </button>

            <button
              onClick={handleApply}
              className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center space-x-2 transition-all shadow-lg hover:shadow-indigo-500/25"
            >
              <span>Apply Scenario to Map View</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
