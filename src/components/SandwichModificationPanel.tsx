import React, { useState } from 'react';
import {
  Sliders,
  Sparkles,
  Info,
  CheckCircle2,
  TrendingUp,
  Activity,
  ArrowRight,
  RotateCcw,
  Layers,
  MapPin,
  Building2,
  FileCheck2,
  HelpCircle,
} from 'lucide-react';
import {
  EconomicCorridor,
  EconomicZone,
  ZoningCategory,
  ModelWeights,
  ScenarioResult,
} from '../types/gis';
import { KENYA_CORRIDORS, ZONING_COLORS } from '../data/nationalData';

interface SandwichModificationPanelProps {
  corridors: EconomicCorridor[];
  selectedCorridor: EconomicCorridor;
  onSelectCorridor: (corridor: EconomicCorridor) => void;
  zonesInCorridor: EconomicZone[];
  selectedZone: EconomicZone | null;
  onSelectZone: (zone: EconomicZone) => void;
  weights: ModelWeights;
  onChangeWeights: (newWeights: ModelWeights) => void;
  onApplyModification: (result: ScenarioResult) => void;
  onOpenExportModal: () => void;
}

const AVAILABLE_ZONING_CATEGORIES: { id: ZoningCategory; label: string; desc: string }[] = [
  { id: 'mixed_use', label: 'Mixed-Use (Commercial / Residential)', desc: 'Ground-floor retail, professional chambers, and multi-story apartments.' },
  { id: 'commercial_core', label: 'Commercial Core (CBD High Density)', desc: 'Tier-1 banks, financial headquarters, corporate towers (FAR 4.5+).' },
  { id: 'industrial_heavy_sez', label: 'Agro-Industrial Special Economic Zone (SEZ)', desc: 'Export processing, bonded warehousing, tax holidays, heavy manufacturing.' },
  { id: 'industrial_light', label: 'Light Industrial & Transshipment Logistics', desc: 'Cold storage, courier dispatch, auto spares, distribution logistics.' },
  { id: 'commercial_subcenter', label: 'Commercial Sub-Center', desc: 'Hardware, retail strips, and decentralized service nodes.' },
  { id: 'residential_high', label: 'Residential (High-Density Planned)', desc: 'Multi-family apartments with required municipal sewer linkage.' },
  { id: 'agricultural_periurban', label: 'Agricultural Peri-Urban & Grain Mills', desc: 'Irrigation schemes, farm aggregation silos, cooperative centers.' },
  { id: 'protected_wetland', label: 'Protected Wetland / Ecological Buffer', desc: 'Strict environmental preservation with zero concrete foundations.' },
];

export const SandwichModificationPanel: React.FC<SandwichModificationPanelProps> = ({
  corridors,
  selectedCorridor,
  onSelectCorridor,
  zonesInCorridor,
  selectedZone,
  onSelectZone,
  weights,
  onChangeWeights,
  onApplyModification,
  onOpenExportModal,
}) => {
  const currentZone = selectedZone || zonesInCorridor[0];

  // Modification states inside the sandwich fillings
  const [targetZoning, setTargetZoning] = useState<ZoningCategory>('mixed_use');
  const [densityFAR, setDensityFAR] = useState<number>(1.8); // 1.0 to 3.5
  const [cipGrantMillionKES, setCipGrantMillionKES] = useState<number>(45); // KES 10M to 150M

  // Layer switches
  const [layerSwitches, setLayerSwitches] = useState<{ economic: boolean; infra: boolean; hazards: boolean }>({
    economic: true,
    infra: true,
    hazards: true,
  });

  const toggleLayerSwitch = (key: keyof typeof layerSwitches) => {
    setLayerSwitches((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Dynamic simulation formula based on weights, target zoning, and density
  const baseScore = currentZone ? currentZone.economicActivityScore : 75;
  const growthBase = currentZone ? currentZone.growthPotentialScore : 82;

  // Compute calculated pilot score
  const weightFactor =
    (weights.opportunity * 0.4 +
      weights.infrastructure * 0.25 +
      weights.resilience * 0.2 +
      weights.inclusion * 0.15) /
    25;

  let zoningBoost = 6;
  if (targetZoning === 'mixed_use') zoningBoost = 14;
  else if (targetZoning === 'commercial_core') zoningBoost = 18;
  else if (targetZoning === 'industrial_heavy_sez') zoningBoost = 22;
  else if (targetZoning === 'protected_wetland') zoningBoost = -10;

  const simulatedScore = Math.min(
    99,
    Math.max(35, Math.round(baseScore * 0.5 + growthBase * 0.3 + zoningBoost * (densityFAR / 1.5) + weightFactor * 2))
  );

  const scoreDelta = simulatedScore - baseScore;
  const projectedRevenueDelta = Math.round(
    ((currentZone ? currentZone.monthlyTxVolumeKES : 1200) * 12 * 0.02 * (simulatedScore / baseScore)) * 1000000
  );

  const handleApply = () => {
    if (!currentZone) return;
    const result: ScenarioResult = {
      zoneId: currentZone.id,
      originalZoning: currentZone.currentZoning,
      simulatedZoning: targetZoning,
      economicActivityBefore: baseScore,
      economicActivityAfter: simulatedScore,
      accessibilityBefore: currentZone.infrastructureScore,
      accessibilityAfter: Math.min(98, currentZone.infrastructureScore + 10),
      populationServedBefore: currentZone.daytimePopulation,
      populationServedAfter: Math.round(currentZone.daytimePopulation * (densityFAR / 1.2)),
      investmentSuitabilityBefore: Math.round((baseScore + growthBase) / 2),
      investmentSuitabilityAfter: Math.min(99, Math.round((simulatedScore + growthBase + 10) / 2)),
      estimatedTaxRevenueAnnualDeltaKES: projectedRevenueDelta,
      infrastructureStrainRisk: densityFAR > 2.2 ? 'High' : 'Moderate',
      executiveSummary: `Reclassifying ${currentZone.name} to ${ZONING_COLORS[targetZoning].label} within the ${selectedCorridor.name} stimulates localized transaction velocity and unlocks structured private capital deployment under Kenya PLUPA 2019.`,
      actionChecklist: [
        'County Assembly spatial reclassification gazettement under PLUPA Section 61.',
        `Deploy KES ${cipGrantMillionKES}M CIP infrastructure grant for feeder water & 33kV lines.`,
        'Enforce mandatory off-street logistics bays and pedestrian arcade covenants.',
      ],
    };
    onApplyModification(result);
  };

  return (
    <div className="w-full bg-[var(--paper)] border border-[var(--line)] rounded-xl shadow-xs overflow-hidden text-[var(--ink)]">
      {/* ========================================================================= */}
      {/* TOP BUN: Context, Target Corridor & Geography Header                     */}
      {/* ========================================================================= */}
      <div className="p-4 sm:p-5 border-b border-[var(--line)] bg-[var(--parchment)]/80">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center space-x-2">
            <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--muted)] font-bold">
              MODIFICATION SANDWICH PANEL
            </span>
            <span className="font-mono text-[10px] text-[var(--orange)] bg-[var(--orange-light)] px-2 py-0.5 rounded border border-[var(--orange)]/30 font-semibold">
              SANDWICH SPEC V2.4
            </span>
          </div>

          <div className="flex items-center space-x-1.5 text-[11px] font-mono text-[var(--ink-soft)]">
            <span className="status-dot" />
            <span>live model updating</span>
          </div>
        </div>

        {/* Top Bun Selections: Corridor and Target Zone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {/* Corridor Selection */}
          <div>
            <label className="block text-[11px] font-mono uppercase text-[var(--muted)] font-semibold mb-1">
              1. Select Strategic Economic Corridor
            </label>
            <select
              value={selectedCorridor.id}
              onChange={(e) => {
                const found = corridors.find((c) => c.id === e.target.value);
                if (found) onSelectCorridor(found);
              }}
              className="w-full bg-[var(--paper)] border border-[var(--line)] rounded-md px-3 py-2 text-xs font-semibold text-[var(--ink)] focus:outline-none focus:border-[var(--blue)] focus:ring-1 focus:ring-[var(--blue)]"
            >
              {corridors.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} — {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Candidate Zone Selection */}
          <div>
            <label className="block text-[11px] font-mono uppercase text-[var(--muted)] font-semibold mb-1">
              2. Select Target Candidate Zone
            </label>
            <select
              value={currentZone ? currentZone.id : ''}
              onChange={(e) => {
                const found = zonesInCorridor.find((z) => z.id === e.target.value);
                if (found) onSelectZone(found);
              }}
              className="w-full bg-[var(--paper)] border border-[var(--line)] rounded-md px-3 py-2 text-xs font-semibold text-[var(--ink)] focus:outline-none focus:border-[var(--blue)] focus:ring-1 focus:ring-[var(--blue)]"
            >
              {zonesInCorridor.map((z) => (
                <option key={z.id} value={z.id}>
                  {z.name} ({ZONING_COLORS[z.currentZoning].label})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Decision Question Statement */}
        <div className="mt-3 pt-3 border-t border-[var(--line)]/60 text-xs text-[var(--ink-soft)] flex items-center space-x-2">
          <HelpCircle className="w-3.5 h-3.5 text-[var(--blue)] flex-shrink-0" />
          <span>
            <strong>Decision Target:</strong> Where should capital incentives, rezoning, and utility upgrades be directed along the {selectedCorridor.name}?
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* FILLING LAYERS: Stacked Slices (Zoning, Model Weights, Density & Switches) */}
      {/* ========================================================================= */}
      <div className="p-4 sm:p-5 space-y-5 bg-[var(--paper)]">
        {/* Layer 1: Proposed Reclassification Slice */}
        <div className="border border-[var(--line)] rounded-lg p-3.5 bg-[var(--parchment)]/40 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase font-bold text-[var(--ink)] flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-[var(--orange)]" />
              <span>LAYER 01 — RECLASSIFICATION SLICE</span>
            </span>
            <span className="text-[10px] text-[var(--muted)] font-mono">PLUPA Statutory Code</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {AVAILABLE_ZONING_CATEGORIES.slice(0, 4).map((cat) => {
              const isSelected = targetZoning === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setTargetZoning(cat.id)}
                  className={`p-2 rounded text-left border transition-all text-xs ${
                    isSelected
                      ? 'border-[var(--orange)] bg-[var(--paper)] shadow-xs font-semibold text-[var(--ink)]'
                      : 'border-[var(--line)] bg-[var(--paper)]/60 hover:bg-[var(--paper)] text-[var(--ink-soft)]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold">{cat.label.split('(')[0]}</span>
                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[var(--orange)]" />}
                  </div>
                  <p className="text-[10px] text-[var(--muted)] mt-0.5 truncate">{cat.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Layer 2: Model Weights Slice */}
        <div className="border border-[var(--line)] rounded-lg p-3.5 bg-[var(--parchment)]/40 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase font-bold text-[var(--ink)] flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-[var(--blue)]" />
              <span>LAYER 02 — MODEL WEIGHTS & TRADE-OFFS</span>
            </span>
            <span className="text-[10px] text-[var(--blue)] font-mono font-semibold">TUNE THE TRADE-OFFS</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Opportunity Weight */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="font-medium text-[var(--ink)]">Opportunity & POS Turnover</span>
                <span className="font-mono font-bold text-[var(--blue)]">{weights.opportunity}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={weights.opportunity}
                onChange={(e) => onChangeWeights({ ...weights, opportunity: parseInt(e.target.value, 10) })}
                className="w-full h-1 bg-[var(--line)] rounded-lg appearance-none cursor-pointer accent-[var(--blue)]"
              />
            </div>

            {/* Infrastructure Readiness */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="font-medium text-[var(--ink)]">Infrastructure Access</span>
                <span className="font-mono font-bold text-[var(--blue)]">{weights.infrastructure}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={weights.infrastructure}
                onChange={(e) => onChangeWeights({ ...weights, infrastructure: parseInt(e.target.value, 10) })}
                className="w-full h-1 bg-[var(--line)] rounded-lg appearance-none cursor-pointer accent-[var(--blue)]"
              />
            </div>

            {/* Climate Resilience */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="font-medium text-[var(--ink)]">Climate Resilience & Hazard Buffer</span>
                <span className="font-mono font-bold text-[var(--sage)]">{weights.resilience}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={weights.resilience}
                onChange={(e) => onChangeWeights({ ...weights, resilience: parseInt(e.target.value, 10) })}
                className="w-full h-1 bg-[var(--line)] rounded-lg appearance-none cursor-pointer accent-[var(--sage)]"
              />
            </div>

            {/* Social Inclusion */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="font-medium text-[var(--ink)]">Commuter Density & Inclusion</span>
                <span className="font-mono font-bold text-[var(--orange)]">{weights.inclusion}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={weights.inclusion}
                onChange={(e) => onChangeWeights({ ...weights, inclusion: parseInt(e.target.value, 10) })}
                className="w-full h-1 bg-[var(--line)] rounded-lg appearance-none cursor-pointer accent-[var(--orange)]"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-[var(--line)]/60 text-[11px] text-[var(--muted)] flex items-center space-x-1.5 font-mono">
            <Info className="w-3.5 h-3.5 text-[var(--muted)]" />
            <span>Weights change the ranking logic, not the underlying evidence.</span>
          </div>
        </div>

        {/* Layer 3: Density & Capital Allocation Slice */}
        <div className="border border-[var(--line)] rounded-lg p-3.5 bg-[var(--parchment)]/40 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase font-bold text-[var(--ink)] flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-[var(--sage)]" />
              <span>LAYER 03 — DENSITY MULTIPLIER & CIP GRANT</span>
            </span>
            <span className="text-[10px] text-[var(--sage)] font-mono font-semibold">FISCAL SCALING</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="font-medium text-[var(--ink)]">Floor Area Ratio (FAR):</span>
                <span className="font-mono font-bold text-[var(--ink)]">{densityFAR}x Base</span>
              </div>
              <input
                type="range"
                min="10"
                max="35"
                value={Math.round(densityFAR * 10)}
                onChange={(e) => setDensityFAR(parseInt(e.target.value, 10) / 10)}
                className="w-full h-1 bg-[var(--line)] rounded-lg appearance-none cursor-pointer accent-[var(--sage)]"
              />
            </div>

            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="font-medium text-[var(--ink)]">County CIP Grant:</span>
                <span className="font-mono font-bold text-[var(--ink)]">KES {cipGrantMillionKES} Million</span>
              </div>
              <input
                type="range"
                min="10"
                max="150"
                value={cipGrantMillionKES}
                onChange={(e) => setCipGrantMillionKES(parseInt(e.target.value, 10))}
                className="w-full h-1 bg-[var(--line)] rounded-lg appearance-none cursor-pointer accent-[var(--sage)]"
              />
            </div>
          </div>
        </div>

        {/* Layer 4: Map Layer Switches (Chips) */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <span className="font-mono text-[10px] uppercase text-[var(--muted)] font-bold">
            MAP LAYER SWITCHES
          </span>
          <div className="flex items-center space-x-2 text-xs">
            <button
              onClick={() => toggleLayerSwitch('economic')}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded border font-mono text-[10px] font-semibold transition-colors ${
                layerSwitches.economic
                  ? 'bg-[var(--blue-light)] border-[var(--blue)] text-[var(--blue)]'
                  : 'bg-[var(--paper)] border-[var(--line)] text-[var(--muted)]'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--blue)]" />
              <span>ECONOMIC SIGNALS {layerSwitches.economic ? 'ON' : 'OFF'}</span>
            </button>

            <button
              onClick={() => toggleLayerSwitch('infra')}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded border font-mono text-[10px] font-semibold transition-colors ${
                layerSwitches.infra
                  ? 'bg-[var(--sage-light)] border-[var(--sage)] text-[var(--sage)]'
                  : 'bg-[var(--paper)] border-[var(--line)] text-[var(--muted)]'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--sage)]" />
              <span>INFRASTRUCTURE {layerSwitches.infra ? 'ON' : 'OFF'}</span>
            </button>

            <button
              onClick={() => toggleLayerSwitch('hazards')}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded border font-mono text-[10px] font-semibold transition-colors ${
                layerSwitches.hazards
                  ? 'bg-[var(--orange-light)] border-[var(--orange)] text-[var(--orange)]'
                  : 'bg-[var(--paper)] border-[var(--line)] text-[var(--muted)]'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--orange)]" />
              <span>HAZARD OVERLAY {layerSwitches.hazards ? 'ON' : 'OFF'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* BOTTOM BUN: Impact Summary, Score Ring & Action Execution                 */}
      {/* ========================================================================= */}
      <div className="p-4 sm:p-5 border-t border-[var(--line)] bg-[var(--parchment)]/90 flex flex-wrap items-center justify-between gap-4">
        {/* Score Ring Display */}
        <div className="flex items-center space-x-4">
          <div
            className="score-ring"
            style={{ '--score': `${simulatedScore * 3.6}deg` } as React.CSSProperties}
          >
            <div className="score-ring-inner">
              <span className="font-mono text-xl font-black text-[var(--ink)] leading-none">
                {simulatedScore}
              </span>
              <span className="text-[9px] font-mono uppercase text-[var(--muted)] mt-0.5">/ 100</span>
            </div>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h4 className="font-bold text-sm text-[var(--ink)]">Pilot Score: {simulatedScore}</h4>
              <span
                className={`font-mono text-xs font-bold px-1.5 py-0.5 rounded ${
                  scoreDelta >= 0
                    ? 'bg-[var(--sage-light)] text-[var(--sage)]'
                    : 'bg-[var(--orange-light)] text-[var(--orange)]'
                }`}
              >
                {scoreDelta >= 0 ? `+${scoreDelta}` : scoreDelta}
              </span>
            </div>
            <p className="text-[11px] text-[var(--ink-soft)] font-mono mt-0.5">
              Projected Fiscal Yield: <strong>+KES {(projectedRevenueDelta / 1000000).toFixed(0)}M / yr</strong>
            </p>
            <p className="text-[10px] text-[var(--muted)]">
              Before: {baseScore} / 100 • Strain Risk: {densityFAR > 2.2 ? 'High' : 'Moderate'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2.5">
          <button
            onClick={onOpenExportModal}
            className="px-3.5 py-2 rounded-md bg-[var(--paper)] hover:bg-[var(--line)]/50 text-[var(--ink)] border border-[var(--line)] text-xs font-medium transition-colors"
          >
            Export Dossier
          </button>

          <button
            onClick={handleApply}
            className="px-4 py-2 rounded-md bg-[var(--blue)] hover:bg-[#155465] text-white text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-xs"
          >
            <span>Apply Modification</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
