import React from 'react';
import {
  X,
  TrendingUp,
  Activity,
  Users,
  Building,
  Zap,
  Droplet,
  Truck,
  ShieldAlert,
  ArrowRight,
  Sliders,
  Download,
  AlertTriangle,
  CheckCircle2,
  Share2,
  ExternalLink,
  Award,
} from 'lucide-react';
import { EconomicZone } from '../types/gis';
import { ZONING_COLORS } from '../data/kisumuData';

interface ZoneDetailPanelProps {
  zone: EconomicZone | null;
  onClose: () => void;
  onOpenScenarioModal: (zone: EconomicZone) => void;
  onOpenExportModal: () => void;
}

export const ZoneDetailPanel: React.FC<ZoneDetailPanelProps> = ({
  zone,
  onClose,
  onOpenScenarioModal,
  onOpenExportModal,
}) => {
  if (!zone) return null;

  const zoningMeta = ZONING_COLORS[zone.currentZoning];

  return (
    <aside className="w-96 h-full bg-slate-950/95 border-l border-slate-800/80 flex flex-col z-30 select-none text-slate-200 overflow-hidden shadow-2xl backdrop-blur-md">
      {/* Header */}
      <div className="p-4 border-b border-slate-800/80 bg-slate-900/60 relative">
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 p-1 text-slate-400 hover:text-white rounded-md bg-slate-800/60 hover:bg-slate-700 transition-colors"
          title="Close details"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center space-x-2">
          <span
            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: zoningMeta.bg }}
          />
          <span className="text-[10px] font-mono tracking-wider uppercase text-slate-400">
            {zone.subcounty || zone.locationName || zone.county} {zone.ward ? `• ${zone.ward}` : ''}
          </span>
        </div>

        <h2 className="text-base font-bold text-white mt-1 leading-snug">{zone.name}</h2>

        <div className="flex items-center space-x-2 mt-2">
          <span className={`text-[10px] font-medium px-2 py-0.5 rounded border ${zoningMeta.badge}`}>
            {zoningMeta.label}
          </span>
          {zone.isOpportunityZone && (
            <span className="flex items-center space-x-1 text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
              <Award className="w-3 h-3 text-amber-400" />
              <span>Priority #{zone.opportunityRank} SEZ</span>
            </span>
          )}
        </div>
      </div>

      {/* Scrollable Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Executive Summary */}
        <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/50 p-3 rounded-lg border border-slate-800/70 font-sans">
          {zone.summary}
        </p>

        {/* Primary Scores Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800/80 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-mono text-slate-400">Activity Score</span>
              <Activity className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <div className="flex items-baseline space-x-1 mt-1">
              <span className="text-2xl font-black text-blue-400">{zone.economicActivityScore}</span>
              <span className="text-xs text-slate-500 font-mono">/ 100</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-blue-500 h-full rounded-full"
                style={{ width: `${zone.economicActivityScore}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1.5 font-mono">
              KES {zone.monthlyTxVolumeKES >= 1000 ? `${(zone.monthlyTxVolumeKES / 1000).toFixed(2)}B` : `${zone.monthlyTxVolumeKES}M`} / mo
            </p>
          </div>

          <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800/80 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-mono text-slate-400">Growth Potential</span>
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="flex items-baseline space-x-1 mt-1">
              <span className="text-2xl font-black text-emerald-400">{zone.growthPotentialScore}</span>
              <span className="text-xs text-slate-500 font-mono">/ 100</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full"
                style={{ width: `${zone.growthPotentialScore}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1.5 font-mono">
              {zone.txVelocityPerHour.toLocaleString()} Tx / hr
            </p>
          </div>
        </div>

        {/* Dominant Business Categories */}
        <div className="bg-slate-900/60 p-3.5 rounded-lg border border-slate-800/70">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-200">Dominant Business Mix</span>
            <span className="text-[10px] text-slate-400 font-mono">PostGIS POS Analytics</span>
          </div>

          <div className="space-y-2">
            {zone.dominantSectors.map((sector) => (
              <div key={sector.name} className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-300 truncate pr-2">{sector.name}</span>
                  <span className="font-mono font-medium text-slate-200">{sector.share}%</span>
                </div>
                <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${sector.share}%`, backgroundColor: sector.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Population & Mobility */}
        <div className="bg-slate-900/60 p-3.5 rounded-lg border border-slate-800/70">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-200">
              <Users className="w-3.5 h-3.5 text-cyan-400" />
              <span>Demographics & Foot Traffic</span>
            </div>
            <span className="text-[10px] font-mono text-cyan-400">
              {zone.footTrafficDaily.toLocaleString()} / day
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] mb-2 font-mono">
            <div className="bg-slate-950/70 p-2 rounded border border-slate-800">
              <div className="text-slate-500 text-[10px]">Daytime Population</div>
              <div className="text-slate-200 font-bold text-sm">
                {zone.daytimePopulation.toLocaleString()}
              </div>
            </div>
            <div className="bg-slate-950/70 p-2 rounded border border-slate-800">
              <div className="text-slate-500 text-[10px]">Nighttime Population</div>
              <div className="text-slate-200 font-bold text-sm">
                {zone.nighttimePopulation.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1">
            <span>Population Density:</span>
            <span className="font-mono text-slate-200">{zone.populationDensity.toLocaleString()} / km²</span>
          </div>
        </div>

        {/* Infrastructure Access Summary */}
        <div className="bg-slate-900/60 p-3.5 rounded-lg border border-slate-800/70">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-200">
              <Building className="w-3.5 h-3.5 text-indigo-400" />
              <span>Infrastructure Access Audit</span>
            </div>
            <span className="text-[10px] font-mono text-indigo-300">
              Score: {zone.infrastructureScore}/100
            </span>
          </div>

          <div className="space-y-2 text-[11px]">
            <div className="flex items-center justify-between bg-slate-950/60 p-1.5 rounded">
              <span className="text-slate-400 flex items-center space-x-1.5">
                <Zap className="w-3 h-3 text-yellow-400" />
                <span>Power Grid:</span>
              </span>
              <span className="font-mono text-slate-200">{zone.infrastructure.powerGrid}</span>
            </div>

            <div className="flex items-center justify-between bg-slate-950/60 p-1.5 rounded">
              <span className="text-slate-400 flex items-center space-x-1.5">
                <Droplet className="w-3 h-3 text-blue-400" />
                <span>Water Supply:</span>
              </span>
              <span className="font-mono text-slate-200">{zone.infrastructure.waterAccess}</span>
            </div>

            <div className="flex items-center justify-between bg-slate-950/60 p-1.5 rounded">
              <span className="text-slate-400 flex items-center space-x-1.5">
                <Truck className="w-3 h-3 text-emerald-400" />
                <span>Road Classification:</span>
              </span>
              <span className="font-mono text-slate-200">{zone.infrastructure.roadType}</span>
            </div>

            <div className="grid grid-cols-2 gap-1.5 pt-1 text-[10px]">
              <div className="flex items-center space-x-1 text-slate-300">
                {zone.infrastructure.fiberOpticBroadband ? (
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-3 h-3 text-amber-400" />
                )}
                <span>Fiber Optic Trunk</span>
              </div>
              <div className="flex items-center space-x-1 text-slate-300">
                {zone.infrastructure.sanitationSewerConnected ? (
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-3 h-3 text-amber-400" />
                )}
                <span>KIWASCO Sewer Line</span>
              </div>
            </div>
          </div>
        </div>

        {/* Risks & Planning Constraints */}
        <div className="bg-slate-900/60 p-3.5 rounded-lg border border-slate-800/70">
          <div className="flex items-center space-x-1.5 text-xs font-semibold text-rose-300 mb-2">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span>Risks & Physical Constraints</span>
          </div>

          <div className="space-y-2">
            {zone.risks.map((risk, idx) => (
              <div
                key={idx}
                className="bg-slate-950/80 p-2.5 rounded border border-rose-900/40 text-[11px]"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-200">{risk.title}</span>
                  <span
                    className={`text-[9px] uppercase font-mono px-1 py-0.2 rounded ${
                      risk.severity === 'critical'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        : risk.severity === 'high'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                    }`}
                  >
                    {risk.severity}
                  </span>
                </div>
                <p className="text-slate-400 text-[10px] mt-1 leading-relaxed">{risk.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Zoning Action */}
        <div className="bg-emerald-950/30 p-3.5 rounded-lg border border-emerald-500/40">
          <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 block mb-1">
            Recommended Zoning Action
          </span>
          <p className="text-xs font-medium text-emerald-200 leading-snug">
            {zone.recommendedZoningAction}
          </p>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-900/80 space-y-2">
        <button
          onClick={() => onOpenScenarioModal(zone)}
          className="w-full py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center justify-center space-x-2 transition-all shadow-md hover:shadow-indigo-500/20"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Simulate Rezoning Scenario</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={onOpenExportModal}
          className="w-full py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center justify-center space-x-1.5 transition-colors border border-slate-700"
        >
          <Download className="w-3.5 h-3.5 text-slate-400" />
          <span>Export Zone Dossier (PDF Brief)</span>
        </button>
      </div>
    </aside>
  );
};
