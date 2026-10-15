import React, { useState } from 'react';
import {
  Layers,
  Search,
  Eye,
  EyeOff,
  Sliders,
  ChevronDown,
  ChevronRight,
  Flame,
  Building,
  MapPin,
  ShieldAlert,
  Users,
  Compass,
  Zap,
  Activity,
  Award,
} from 'lucide-react';
import { LayerVisibilityState, LayerOpacityState, ZoningCategory } from '../types/gis';
import { ZONING_COLORS } from '../data/kisumuData';

interface SidebarLayersProps {
  layers: LayerVisibilityState;
  opacities: LayerOpacityState;
  onToggleLayer: (layerKey: keyof LayerVisibilityState) => void;
  onChangeOpacity: (layerKey: keyof LayerOpacityState, value: number) => void;
  onFlyToLocation: (lat: number, lng: number, zoom: number) => void;
  onSelectZoneById: (zoneId: string) => void;
}

interface LayerItemDef {
  key: keyof LayerVisibilityState;
  title: string;
  badge: string;
  description: string;
  icon: React.ReactNode;
  legendType: 'heatmap' | 'clusters' | 'zoning' | 'infrastructure' | 'population' | 'opportunities' | 'risks';
}

const LAYER_DEFINITIONS: LayerItemDef[] = [
  {
    key: 'economicHeatmap',
    title: '1. Economic Activity Heatmap',
    badge: 'M-Pesa / POS',
    description: 'Simulated POS & mobile-money transaction density across commercial corridors.',
    icon: <Flame className="w-4 h-4 text-amber-400" />,
    legendType: 'heatmap',
  },
  {
    key: 'economicClusters',
    title: '2. Emerging Economic Clusters',
    badge: 'Growth Scores',
    description: 'Commercial hotspots clustered by monthly transaction velocity and agent count.',
    icon: <Activity className="w-4 h-4 text-emerald-400" />,
    legendType: 'clusters',
  },
  {
    key: 'landUseZoning',
    title: '3. Land Use / Zoning',
    badge: 'County Masterplan',
    description: 'Residential, Commercial, Industrial, Mixed-Use, Agricultural, and Protected Wetland.',
    icon: <Building className="w-4 h-4 text-purple-400" />,
    legendType: 'zoning',
  },
  {
    key: 'infrastructure',
    title: '4. Infrastructure & Utilities',
    badge: 'Power / Water / Health',
    description: 'High-voltage substations, KIWASCO water treatment, hospitals, ports, and highways.',
    icon: <Zap className="w-4 h-4 text-blue-400" />,
    legendType: 'infrastructure',
  },
  {
    key: 'populationFootTraffic',
    title: '5. Population & Foot Traffic',
    badge: 'Mobility Density',
    description: 'Daytime commuter concentration, nighttime residents, and pedestrian corridors.',
    icon: <Users className="w-4 h-4 text-cyan-400" />,
    legendType: 'population',
  },
  {
    key: 'opportunityZones',
    title: '6. Investment Opportunity Zones',
    badge: 'Ranked 1-6',
    description: 'High-potential zones prioritized for public-private partnerships and capital deployment.',
    icon: <Award className="w-4 h-4 text-yellow-400" />,
    legendType: 'opportunities',
  },
  {
    key: 'riskLayers',
    title: '7. Risk & Hazard Layers',
    badge: 'Flood / Grid Deficit',
    description: 'Lake Victoria flood plains, acute utility gaps, and planning choke points.',
    icon: <ShieldAlert className="w-4 h-4 text-rose-400" />,
    legendType: 'risks',
  },
];

export const SidebarLayers: React.FC<SidebarLayersProps> = ({
  layers,
  opacities,
  onToggleLayer,
  onChangeOpacity,
  onFlyToLocation,
  onSelectZoneById,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedLegends, setExpandedLegends] = useState<Record<string, boolean>>({
    landUseZoning: true,
    economicClusters: true,
  });

  const toggleLegend = (key: string) => {
    setExpandedLegends((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const filteredLayers = LAYER_DEFINITIONS.filter(
    (l) =>
      l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.badge.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside className="w-80 h-full bg-slate-950/95 border-r border-slate-800/80 flex flex-col z-30 select-none text-slate-200 overflow-hidden shadow-2xl">
      {/* Search Header */}
      <div className="p-3 border-b border-slate-800/80 bg-slate-900/50">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-300 uppercase tracking-wider">
            <Layers className="w-4 h-4 text-emerald-400" />
            <span>Map Layers & Legends</span>
          </div>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
            {Object.values(layers).filter(Boolean).length} / 7 active
          </span>
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Filter layers or attributes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-700/80 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/50 font-sans"
          />
        </div>
      </div>

      {/* Layer List Scrollable */}
      <div className="flex-1 overflow-y-auto px-2.5 py-2 space-y-2 divide-y divide-slate-800/40">
        {filteredLayers.map((layer) => {
          const isVisible = layers[layer.key];
          const opacity = opacities[layer.key];
          const isLegendOpen = !!expandedLegends[layer.key];

          return (
            <div
              key={layer.key}
              className={`pt-2 rounded-lg transition-all ${
                isVisible ? 'bg-slate-900/40 border border-slate-800/60 p-2' : 'p-2 opacity-70 hover:opacity-100'
              }`}
            >
              {/* Layer Title Row */}
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-2 flex-1 pr-2">
                  <div className="mt-0.5">{layer.icon}</div>
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <h3 className="text-xs font-semibold text-slate-200">{layer.title}</h3>
                    </div>
                    <span className="inline-block text-[9px] uppercase tracking-wider px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-mono mt-0.5">
                      {layer.badge}
                    </span>
                  </div>
                </div>

                {/* Visibility Toggle Button */}
                <button
                  onClick={() => onToggleLayer(layer.key)}
                  className={`p-1.5 rounded-md transition-colors ${
                    isVisible
                      ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                      : 'bg-slate-800 text-slate-500 hover:bg-slate-700 hover:text-slate-300'
                  }`}
                  title={isVisible ? 'Hide layer' : 'Show layer'}
                >
                  {isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>
              </div>

              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed pl-6">{layer.description}</p>

              {/* Opacity Slider (visible when layer is active) */}
              {isVisible && (
                <div className="mt-2.5 pl-6 pr-1 flex items-center space-x-2">
                  <Sliders className="w-3 h-3 text-slate-500" />
                  <span className="text-[10px] text-slate-400 font-mono w-12">
                    {Math.round(opacity * 100)}%
                  </span>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={Math.round(opacity * 100)}
                    onChange={(e) => onChangeOpacity(layer.key, parseInt(e.target.value, 10) / 100)}
                    className="flex-1 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>
              )}

              {/* Legend Expander */}
              <div className="mt-2 pl-6">
                <button
                  onClick={() => toggleLegend(layer.key)}
                  className="flex items-center space-x-1 text-[11px] text-slate-400 hover:text-slate-200 font-medium transition-colors"
                >
                  {isLegendOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                  <span>Layer Legend</span>
                </button>

                {isLegendOpen && (
                  <div className="mt-1.5 bg-slate-950/80 p-2 rounded-md border border-slate-800/80 text-[10px] space-y-1">
                    {layer.legendType === 'heatmap' && (
                      <div>
                        <div className="h-2 w-full rounded bg-gradient-to-r from-blue-600 via-amber-400 to-rose-600" />
                        <div className="flex justify-between text-[9px] font-mono text-slate-400 mt-0.5">
                          <span>Low Velocity</span>
                          <span>High M-Pesa POS Density</span>
                        </div>
                      </div>
                    )}

                    {layer.legendType === 'clusters' && (
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-500/30" />
                          <span className="text-slate-300">Growth Score &gt; 90 (High Velocity Hub)</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 ring-2 ring-cyan-500/30" />
                          <span className="text-slate-300">Growth Score 75 - 90 (Emerging Strip)</span>
                        </div>
                      </div>
                    )}

                    {layer.legendType === 'zoning' && (
                      <div className="grid grid-cols-1 gap-1">
                        {(Object.keys(ZONING_COLORS) as (keyof typeof ZONING_COLORS)[]).map((cat) => (
                          <div key={String(cat)} className="flex items-center space-x-2">
                            <span
                              className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                              style={{ backgroundColor: ZONING_COLORS[cat].bg }}
                            />
                            <span className="text-slate-300 truncate">{ZONING_COLORS[cat].label}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {layer.legendType === 'infrastructure' && (
                      <div className="grid grid-cols-2 gap-1 text-[10px]">
                        <div className="flex items-center space-x-1.5">
                          <span className="w-2 h-2 rounded-full bg-yellow-400" />
                          <span>Power Substation</span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <span className="w-2 h-2 rounded-full bg-blue-400" />
                          <span>Water Treatment</span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <span className="w-2 h-2 rounded-full bg-rose-400" />
                          <span>Level 5/6 Hospital</span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <span className="w-2 h-2 rounded-full bg-indigo-400" />
                          <span>Port / Airport</span>
                        </div>
                      </div>
                    )}

                    {layer.legendType === 'population' && (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-slate-300">
                          <span>Peak Daytime:</span>
                          <span className="font-mono text-cyan-300">&gt; 10,000 / sq km</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-300">
                          <span>Nighttime Resident:</span>
                          <span className="font-mono text-purple-300">&gt; 14,000 / sq km</span>
                        </div>
                      </div>
                    )}

                    {layer.legendType === 'opportunities' && (
                      <div className="space-y-1">
                        <div className="flex items-center space-x-1.5">
                          <span className="px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] font-mono">
                            #1 Priority
                          </span>
                          <span>Miwani Industrial SEZ</span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <span className="px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] font-mono">
                            #2 Priority
                          </span>
                          <span>Kisumu Port & Marine Basin</span>
                        </div>
                      </div>
                    )}

                    {layer.legendType === 'risks' && (
                      <div className="space-y-1">
                        <div className="flex items-center space-x-1.5">
                          <span className="w-2 h-2 rounded-sm bg-rose-500" />
                          <span>Severe Flash Flood Inundation</span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <span className="w-2 h-2 rounded-sm bg-amber-500" />
                          <span>Overpass Traffic Choke Point</span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <span className="w-2 h-2 rounded-sm bg-purple-500" />
                          <span>High-Voltage Grid Deficit</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Spatial Bookmarks for Kisumu */}
      <div className="p-2.5 border-t border-slate-800/80 bg-slate-900/60">
        <div className="flex items-center space-x-1.5 text-[11px] font-semibold text-slate-300 mb-1.5">
          <Compass className="w-3.5 h-3.5 text-emerald-400" />
          <span>Quick Spatial Bookmarks</span>
        </div>
        <div className="grid grid-cols-2 gap-1 text-[10px]">
          <button
            onClick={() => {
              onFlyToLocation(-0.1030, 34.7525, 14);
              onSelectZoneById('zone-cbd');
            }}
            className="px-2 py-1 bg-slate-800/70 hover:bg-slate-700 rounded text-slate-300 hover:text-white transition-colors text-left truncate border border-slate-700/50"
          >
            Kisumu CBD
          </button>
          <button
            onClick={() => {
              onFlyToLocation(-0.0980, 34.7670, 15);
              onSelectZoneById('zone-kibuye');
            }}
            className="px-2 py-1 bg-slate-800/70 hover:bg-slate-700 rounded text-slate-300 hover:text-white transition-colors text-left truncate border border-slate-700/50"
          >
            Kibuye Market
          </button>
          <button
            onClick={() => {
              onFlyToLocation(-0.0860, 34.7740, 15);
              onSelectZoneById('zone-kondele');
            }}
            className="px-2 py-1 bg-slate-800/70 hover:bg-slate-700 rounded text-slate-300 hover:text-white transition-colors text-left truncate border border-slate-700/50"
          >
            Kondele Strip
          </button>
          <button
            onClick={() => {
              onFlyToLocation(-0.1060, 34.7380, 14);
              onSelectZoneById('zone-port-pier');
            }}
            className="px-2 py-1 bg-slate-800/70 hover:bg-slate-700 rounded text-slate-300 hover:text-white transition-colors text-left truncate border border-slate-700/50"
          >
            Kisumu Port & Pier
          </button>
          <button
            onClick={() => {
              onFlyToLocation(-0.0380, 34.9350, 13);
              onSelectZoneById('zone-miwani-sez');
            }}
            className="px-2 py-1 bg-slate-800/70 hover:bg-slate-700 rounded text-slate-300 hover:text-white transition-colors text-left truncate border border-slate-700/50 text-amber-300 font-medium"
          >
            Miwani SEZ (#1)
          </button>
          <button
            onClick={() => {
              onFlyToLocation(-0.1740, 34.9190, 13);
              onSelectZoneById('zone-ahero');
            }}
            className="px-2 py-1 bg-slate-800/70 hover:bg-slate-700 rounded text-slate-300 hover:text-white transition-colors text-left truncate border border-slate-700/50"
          >
            Ahero Junction
          </button>
        </div>
      </div>
    </aside>
  );
};
