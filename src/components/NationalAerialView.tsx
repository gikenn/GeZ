import React, { useState } from 'react';
import {
  Compass,
  MapPin,
  TrendingUp,
  Activity,
  Maximize2,
  Crosshair,
  Layers,
  Sparkles,
  Info,
  Navigation,
  Eye,
  RotateCcw,
} from 'lucide-react';
import { EconomicCorridor, EconomicZone } from '../types/gis';
import { KENYA_CORRIDORS } from '../data/nationalData';

interface NationalAerialViewProps {
  selectedCorridor: EconomicCorridor;
  onSelectCorridor: (corridor: EconomicCorridor) => void;
  selectedZone: EconomicZone | null;
  onSelectZone: (zone: EconomicZone) => void;
  allZones: EconomicZone[];
  weights: { opportunity: number; infrastructure: number; resilience: number; inclusion: number };
}

interface MapNodeDef {
  id: string;
  corridorId?: string;
  name: string;
  regionLabel: string;
  topPct: number;
  leftPct: number;
  isCapital?: boolean;
  monthlyTurnover?: string;
  primarySEZ?: string;
  parcelsCount?: number;
}

const KENYA_MAP_NODES: MapNodeDef[] = [
  {
    id: 'nairobi',
    corridorId: 'corridor-nairobi',
    name: 'Nairobi',
    regionLabel: 'Capital & Financial Core',
    topPct: 61.8,
    leftPct: 45.5,
    isCapital: true,
    monthlyTurnover: 'KES 42.6B/mo',
    primarySEZ: 'Athi River EPZ & Konza Node',
    parcelsCount: 38400,
  },
  {
    id: 'mombasa',
    corridorId: 'corridor-mombasa',
    name: 'Mombasa',
    regionLabel: 'Maritime Gateway & Coastal Hub',
    topPct: 85.4,
    leftPct: 70.8,
    monthlyTurnover: 'KES 19.8B/mo',
    primarySEZ: 'Dongo Kundu Free Port SEZ',
    parcelsCount: 24200,
  },
  {
    id: 'kisumu',
    corridorId: 'corridor-kisumu',
    name: 'Kisumu',
    regionLabel: 'Lake Basin Transshipment',
    topPct: 52.8,
    leftPct: 15.2,
    monthlyTurnover: 'KES 12.8B/mo',
    primarySEZ: 'Miwani Agro-Industrial SEZ',
    parcelsCount: 16800,
  },
  {
    id: 'nakuru',
    corridorId: 'corridor-nakuru',
    name: 'Nakuru',
    regionLabel: 'Great Rift Valley Manufacturing',
    topPct: 55.8,
    leftPct: 28.8,
    monthlyTurnover: 'KES 9.4B/mo',
    primarySEZ: 'Salgaa & Naivasha Dry Port SEZ',
    parcelsCount: 14500,
  },
  {
    id: 'eldoret',
    corridorId: 'corridor-eldoret',
    name: 'Eldoret',
    regionLabel: 'North Rift Cargo & Agro-Textiles',
    topPct: 46.8,
    leftPct: 22.8,
    monthlyTurnover: 'KES 7.9B/mo',
    primarySEZ: 'Airport Cargo & Rivatex SEZ',
    parcelsCount: 11900,
  },
  {
    id: 'garissa',
    name: 'Garissa',
    regionLabel: 'Northeastern Transit Gateway',
    topPct: 55.2,
    leftPct: 71.0,
    monthlyTurnover: 'KES 3.2B/mo',
    primarySEZ: 'River Tana Livestock Assembly',
    parcelsCount: 4200,
  },
  {
    id: 'malindi',
    name: 'Malindi',
    regionLabel: 'North Coast Eco-Tourism & Maritime',
    topPct: 66.8,
    leftPct: 85.5,
    monthlyTurnover: 'KES 4.1B/mo',
    primarySEZ: 'Fisheries & Marine Sanctuary',
    parcelsCount: 6800,
  },
  {
    id: 'naivasha',
    corridorId: 'corridor-nakuru',
    name: 'Naivasha',
    regionLabel: 'Geothermal Energy & SGR Inland Port',
    topPct: 63.6,
    leftPct: 38.0,
    monthlyTurnover: 'KES 5.8B/mo',
    primarySEZ: 'Naivasha Special Economic Zone',
    parcelsCount: 8200,
  },
];

export const NationalAerialView: React.FC<NationalAerialViewProps> = ({
  selectedCorridor,
  onSelectCorridor,
  selectedZone,
  onSelectZone,
  allZones,
}) => {
  const [activeOverlay, setActiveOverlay] = useState<'corridors' | 'turnover' | 'parcels'>('corridors');
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  const activeNode =
    KENYA_MAP_NODES.find((n) => n.corridorId === selectedCorridor.id) || KENYA_MAP_NODES[0];
  const zonesInCorridor = allZones.filter((z) => z.corridorId === selectedCorridor.id);

  const handleNodeClick = (node: MapNodeDef) => {
    if (node.corridorId) {
      const c = KENYA_CORRIDORS.find((item) => item.id === node.corridorId);
      if (c) onSelectCorridor(c);
    }
  };

  return (
    <div className="relative w-full rounded-xl border border-[var(--line)] bg-[var(--paper)] overflow-hidden shadow-xs">
      {/* Top Bar: Regional Map Header */}
      <div className="flex flex-wrap items-center justify-between px-4 py-3 border-b border-[var(--line)] bg-[var(--parchment)]/80 text-xs">
        <div className="flex items-center space-x-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--orange)]" />
          <div className="flex flex-col">
            <span className="font-mono text-xs font-bold text-[var(--ink)] uppercase tracking-wider">
              REGIONAL DISPLAY MAP / REPUBLIC OF KENYA
            </span>
            <span className="font-mono text-[10px] text-[var(--muted)]">
              Grounded in National Transport Corridors & Economic Clusters
            </span>
          </div>
        </div>

        {/* Overlay Switches */}
        <div className="flex items-center space-x-1.5 mt-1 sm:mt-0 font-mono text-[11px]">
          <button
            onClick={() => setActiveOverlay('corridors')}
            className={`px-2 py-0.5 rounded border transition-colors ${
              activeOverlay === 'corridors'
                ? 'bg-[var(--blue-light)] border-[var(--blue)] text-[var(--blue)] font-bold'
                : 'bg-[var(--paper)] border-[var(--line)] text-[var(--muted)] hover:text-[var(--ink)]'
            }`}
          >
            Corridors
          </button>

          <button
            onClick={() => setActiveOverlay('turnover')}
            className={`px-2 py-0.5 rounded border transition-colors ${
              activeOverlay === 'turnover'
                ? 'bg-[var(--orange-light)] border-[var(--orange)] text-[var(--orange)] font-bold'
                : 'bg-[var(--paper)] border-[var(--line)] text-[var(--muted)] hover:text-[var(--ink)]'
            }`}
          >
            Turnover
          </button>

          <button
            onClick={() => setActiveOverlay('parcels')}
            className={`px-2 py-0.5 rounded border transition-colors ${
              activeOverlay === 'parcels'
                ? 'bg-[var(--sage-light)] border-[var(--sage)] text-[var(--sage)] font-bold'
                : 'bg-[var(--paper)] border-[var(--line)] text-[var(--muted)] hover:text-[var(--ink)]'
            }`}
          >
            Parcels
          </button>
        </div>
      </div>

      {/* Main Map Canvas Area */}
      <div className="relative w-full min-h-[480px] sm:min-h-[560px] bg-[#f5f5f3] flex items-center justify-center p-2 sm:p-4 select-none overflow-hidden">
        {/* Subtle background coordinate grid */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle, #8d887a 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />

        {/* Map Container Framing the Reference Google Maps Style Kenya Map */}
        <div className="relative max-w-[420px] sm:max-w-[480px] w-full rounded-lg overflow-hidden border border-[var(--line)] shadow-sm bg-white">
          <img
            src="/kenya-display-map.jpg"
            alt="Reference Regional Display Map of Kenya"
            className="w-full h-auto object-contain block"
          />

          {/* Golden Highway Pulsing Vector Overlays */}
          {activeOverlay === 'corridors' && (
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 100 133"
              preserveAspectRatio="none"
            >
              {/* Mombasa (70.8, 113.6) -> Nairobi (45.5, 82.2) */}
              <line
                x1="70.8"
                y1="113.6"
                x2="45.5"
                y2="82.2"
                stroke="#d97706"
                strokeWidth="1.6"
                strokeLinecap="round"
                opacity="0.8"
              />
              {/* Nairobi (45.5, 82.2) -> Naivasha (38.0, 84.6) -> Nakuru (28.8, 74.2) */}
              <line
                x1="45.5"
                y1="82.2"
                x2="38.0"
                y2="84.6"
                stroke="#d97706"
                strokeWidth="1.6"
                strokeLinecap="round"
                opacity="0.8"
              />
              <line
                x1="38.0"
                y1="84.6"
                x2="28.8"
                y2="74.2"
                stroke="#d97706"
                strokeWidth="1.6"
                strokeLinecap="round"
                opacity="0.8"
              />
              {/* Nakuru (28.8, 74.2) -> Kisumu (15.2, 70.2) */}
              <line
                x1="28.8"
                y1="74.2"
                x2="15.2"
                y2="70.2"
                stroke="#d97706"
                strokeWidth="1.6"
                strokeLinecap="round"
                opacity="0.8"
              />
              {/* Nakuru (28.8, 74.2) -> Eldoret (22.8, 62.2) */}
              <line
                x1="28.8"
                y1="74.2"
                x2="22.8"
                y2="62.2"
                stroke="#d97706"
                strokeWidth="1.6"
                strokeLinecap="round"
                opacity="0.8"
              />
              {/* Nairobi -> Garissa (71.0, 73.4) */}
              <line
                x1="45.5"
                y1="82.2"
                x2="71.0"
                y2="73.4"
                stroke="#d97706"
                strokeWidth="1.3"
                strokeDasharray="2,2"
                opacity="0.6"
              />
              {/* Mombasa -> Malindi (85.5, 88.8) */}
              <line
                x1="70.8"
                y1="113.6"
                x2="85.5"
                y2="88.8"
                stroke="#d97706"
                strokeWidth="1.3"
                strokeDasharray="2,2"
                opacity="0.6"
              />
            </svg>
          )}

          {/* Interactive City Nodes on Top of Reference Map */}
          {KENYA_MAP_NODES.map((node) => {
            const isSelectedCorridor = node.corridorId && selectedCorridor.id === node.corridorId;
            const isHovered = hoveredNodeId === node.id;

            return (
              <div
                key={node.id}
                style={{ top: `${node.topPct}%`, left: `${node.leftPct}%` }}
                onMouseEnter={() => setHoveredNodeId(node.id)}
                onMouseLeave={() => setHoveredNodeId(null)}
                onClick={() => handleNodeClick(node)}
                className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group transition-all duration-200 ${
                  isSelectedCorridor ? 'scale-110 z-30' : 'hover:scale-105'
                }`}
              >
                {/* Visual Target Ring / Double Ring Pin */}
                <div className="relative flex items-center justify-center">
                  {/* Ping Animation on Selected Node */}
                  {isSelectedCorridor && (
                    <span className="absolute w-7 h-7 rounded-full bg-[var(--orange)] opacity-50 animate-ping" />
                  )}

                  {/* Outer circle badge */}
                  <div
                    className={`flex items-center justify-center rounded-full transition-all ${
                      node.isCapital
                        ? 'w-5 h-5 bg-black border-2 border-white shadow-md'
                        : isSelectedCorridor
                        ? 'w-4 h-4 bg-[var(--orange)] border-2 border-white shadow-md'
                        : 'w-3.5 h-3.5 bg-white border-2 border-black shadow-xs hover:border-[var(--orange)]'
                    }`}
                  >
                    {/* Inner Target Center Dot */}
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        node.isCapital
                          ? 'bg-white'
                          : isSelectedCorridor
                          ? 'bg-white'
                          : 'bg-black'
                      }`}
                    />
                  </div>
                </div>

                {/* Floating Tooltip Pill Badge on Active/Hover */}
                {(isSelectedCorridor || isHovered) && (
                  <div className="absolute left-1/2 -translate-x-1/2 mt-1 whitespace-nowrap bg-[var(--ink)] text-white text-[10px] font-mono font-semibold px-2 py-0.5 rounded shadow-lg border border-[var(--line)] pointer-events-none z-40">
                    <div className="flex items-center space-x-1">
                      <span className="font-bold text-[var(--paper)]">{node.name}</span>
                      {node.monthlyTurnover && activeOverlay === 'turnover' && (
                        <span className="text-[var(--orange-light)]">({node.monthlyTurnover})</span>
                      )}
                      {node.parcelsCount && activeOverlay === 'parcels' && (
                        <span className="text-[var(--blue-light)]">
                          ({node.parcelsCount.toLocaleString()} parcels)
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Google Maps Style Bottom Left Reticle Control Button */}
          <button
            onClick={() => {
              const nairobi = KENYA_CORRIDORS.find((c) => c.id === 'corridor-nairobi');
              if (nairobi) onSelectCorridor(nairobi);
            }}
            title="Center view on Nairobi Capital Hub"
            className="absolute bottom-3 left-3 w-8 h-8 rounded-full bg-white/95 border border-[var(--line)] shadow-md flex items-center justify-center text-[var(--ink-soft)] hover:text-[var(--ink)] hover:scale-105 transition-all"
          >
            <Crosshair className="w-4 h-4 text-[var(--blue)]" />
          </button>

          {/* Google Maps Style Bottom Right Scale & Legend */}
          <div className="absolute bottom-2.5 right-3 flex items-center space-x-2 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded border border-[var(--line)]/70 text-[9px] font-mono text-[var(--muted)] pointer-events-none">
            <span className="font-semibold text-[var(--ink-soft)]">200 km</span>
            <div className="w-8 border-b-2 border-[var(--ink)]" />
            <span>↑ N</span>
          </div>
        </div>

        {/* Selected Region Highlights Card (Floating Top Right) */}
        <div className="absolute top-4 right-4 hidden md:flex flex-col space-y-1.5 bg-[var(--paper)]/95 backdrop-blur-xs border border-[var(--line)] rounded-lg p-3 shadow-xs max-w-xs text-xs">
          <div className="flex items-center justify-between font-mono text-[10px] text-[var(--muted)]">
            <span>SELECTED REGION</span>
            <span className="font-bold text-[var(--orange)]">{selectedCorridor.code}</span>
          </div>
          <h4 className="font-bold text-sm text-[var(--ink)]">{selectedCorridor.name}</h4>
          <p className="text-[11px] text-[var(--ink-soft)] leading-relaxed">
            {activeNode.primarySEZ} • <strong>{selectedCorridor.monthlyTurnoverKES}</strong> tracked volume.
          </p>
          <div className="pt-1 text-[10px] font-mono text-[var(--blue)] font-semibold flex items-center space-x-1">
            <MapPin className="w-3 h-3 text-[var(--blue)]" />
            <span>{zonesInCorridor.length} Candidate Economic Parcels</span>
          </div>
        </div>

        {/* Quick Location Pills (Floating Bottom Left) */}
        <div className="absolute bottom-4 left-4 hidden lg:flex items-center space-x-1.5 bg-[var(--paper)]/95 backdrop-blur-xs border border-[var(--line)] rounded-lg p-1.5 shadow-xs text-xs">
          {KENYA_CORRIDORS.map((c) => {
            const isSelected = selectedCorridor.id === c.id;
            return (
              <button
                key={c.id}
                onClick={() => onSelectCorridor(c)}
                className={`px-2 py-0.5 rounded font-mono text-[10px] transition-colors ${
                  isSelected
                    ? 'bg-[var(--blue)] text-white font-bold'
                    : 'text-[var(--ink-soft)] hover:bg-[var(--parchment)]'
                }`}
              >
                {c.name.split(' ')[0]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Corridor Live Snapshot Bar */}
      <div className="p-3.5 bg-[var(--paper)] border-t border-[var(--line)] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center space-x-3">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[var(--orange-light)] text-[var(--orange)] border border-[var(--orange)]/30">
            {selectedCorridor.code}
          </span>
          <div>
            <h4 className="font-bold text-xs text-[var(--ink)] font-sans">{selectedCorridor.name}</h4>
            <span className="text-[10px] text-[var(--muted)]">{selectedCorridor.primaryHighway}</span>
          </div>
        </div>

        <div className="flex items-center space-x-4 text-[11px]">
          <div>
            <span className="text-[var(--muted)]">Monthly POS:</span>{' '}
            <strong className="text-[var(--ink)]">{selectedCorridor.monthlyTurnoverKES}</strong>
          </div>
          <div>
            <span className="text-[var(--muted)]">Parcels:</span>{' '}
            <strong className="text-[var(--blue)]">{selectedCorridor.totalParcels.toLocaleString()}</strong>
          </div>
          <div>
            <span className="text-[var(--muted)]">Clusters:</span>{' '}
            <strong className="text-[var(--sage)]">{selectedCorridor.highGrowthClusters} nodes</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
