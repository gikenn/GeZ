import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import {
  EconomicZone,
  EconomicClusterPoint,
  InfrastructurePoint,
  RiskPolygon,
  HeatmapPoint,
  LayerVisibilityState,
  LayerOpacityState,
  ScenarioResult,
} from '../types/gis';
import {
  KISUMU_ZONES,
  KISUMU_CLUSTERS,
  KISUMU_INFRASTRUCTURE,
  KISUMU_RISKS,
  KISUMU_HEATMAP_POINTS,
  ZONING_COLORS,
} from '../data/kisumuData';

interface MapComponentProps {
  layers: LayerVisibilityState;
  opacities: LayerOpacityState;
  selectedZone: EconomicZone | null;
  onSelectZone: (zone: EconomicZone) => void;
  highlightedZoneIds: string[];
  activeScenario: ScenarioResult | null;
  flyToTarget: { lat: number; lng: number; zoom: number; timestamp: number } | null;
}

export const MapComponent: React.FC<MapComponentProps> = ({
  layers,
  opacities,
  selectedZone,
  onSelectZone,
  highlightedZoneIds,
  activeScenario,
  flyToTarget,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  // Layer groups refs to easily add/clear features without recreating the map
  const zoneLayersGroupRef = useRef<L.FeatureGroup | null>(null);
  const clusterLayersGroupRef = useRef<L.FeatureGroup | null>(null);
  const heatmapGroupRef = useRef<L.FeatureGroup | null>(null);
  const infraGroupRef = useRef<L.FeatureGroup | null>(null);
  const popGroupRef = useRef<L.FeatureGroup | null>(null);
  const oppGroupRef = useRef<L.FeatureGroup | null>(null);
  const riskGroupRef = useRef<L.FeatureGroup | null>(null);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Default coordinates: Kisumu County Center [-0.0917, 34.7680]
    const map = L.map(mapContainerRef.current, {
      center: [-0.0917, 34.7680],
      zoom: 13,
      minZoom: 10,
      maxZoom: 18,
      zoomControl: false,
    });

    // Dark GIS Basemap (CartoDB Dark Matter)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions" target="_blank">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    // Zoom control at bottom right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Scale control at bottom left
    L.control.scale({ imperial: false, position: 'bottomleft' }).addTo(map);

    // Create feature groups
    zoneLayersGroupRef.current = L.featureGroup().addTo(map);
    riskGroupRef.current = L.featureGroup().addTo(map);
    heatmapGroupRef.current = L.featureGroup().addTo(map);
    popGroupRef.current = L.featureGroup().addTo(map);
    oppGroupRef.current = L.featureGroup().addTo(map);
    infraGroupRef.current = L.featureGroup().addTo(map);
    clusterLayersGroupRef.current = L.featureGroup().addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Handle flyTo triggers
  useEffect(() => {
    if (!mapInstanceRef.current || !flyToTarget) return;
    mapInstanceRef.current.flyTo([flyToTarget.lat, flyToTarget.lng], flyToTarget.zoom, {
      duration: 1.2,
      easeLinearity: 0.25,
    });
  }, [flyToTarget]);

  // Render & Update Land Use / Zoning polygons
  useEffect(() => {
    const group = zoneLayersGroupRef.current;
    if (!group) return;
    group.clearLayers();

    if (!layers.landUseZoning) return;

    KISUMU_ZONES.forEach((zone) => {
      const isSelected = selectedZone?.id === zone.id;
      const isHighlighted = highlightedZoneIds.includes(zone.id);

      // Check if active scenario modifies this zone's zoning
      const isSimulated = activeScenario && activeScenario.zoneId === zone.id;
      const displayZoning = isSimulated ? activeScenario.simulatedZoning : zone.currentZoning;
      const zoningMeta = ZONING_COLORS[displayZoning];

      const polygon = L.polygon(zone.coordinates, {
        color: isSelected ? '#38bdf8' : isHighlighted ? '#10b981' : isSimulated ? '#a855f7' : zoningMeta.border,
        weight: isSelected ? 3.5 : isHighlighted ? 3 : isSimulated ? 3 : 1.5,
        fillColor: isSimulated ? '#a855f7' : zoningMeta.bg,
        fillOpacity: (isSelected ? 0.65 : 0.35) * opacities.landUseZoning,
        dashArray: isSimulated ? '6, 6' : undefined,
      });

      // Hover and Click events
      polygon.on({
        mouseover: (e) => {
          const layer = e.target;
          layer.setStyle({
            weight: 3,
            fillOpacity: 0.65 * opacities.landUseZoning,
          });
        },
        mouseout: (e) => {
          const layer = e.target;
          if (selectedZone?.id !== zone.id && !highlightedZoneIds.includes(zone.id)) {
            layer.setStyle({
              weight: isSimulated ? 3 : 1.5,
              fillOpacity: 0.35 * opacities.landUseZoning,
            });
          }
        },
        click: () => {
          onSelectZone(zone);
        },
      });

      // Rich tooltip on hover
      polygon.bindTooltip(
        `<div style="font-family: inherit; font-size: 11px; color: #f1f5f9; background: #090d16; padding: 6px 9px; border-radius: 6px; border: 1px solid #334155;">
          <div style="font-weight: 700; color: #38bdf8;">${zone.name}</div>
          <div style="font-size: 10px; color: #94a3b8;">${zoningMeta.label}</div>
          <div style="font-size: 10px; color: #10b981; margin-top: 2px;">Activity: ${zone.economicActivityScore}/100 • KES ${zone.monthlyTxVolumeKES >= 1000 ? `${(zone.monthlyTxVolumeKES / 1000).toFixed(1)}B` : `${zone.monthlyTxVolumeKES}M`}/mo</div>
          ${isSimulated ? '<div style="font-size: 10px; color: #c084fc; font-weight: 600;">[Simulated Rezoning Active]</div>' : ''}
        </div>`,
        { sticky: true, opacity: 0.95 }
      );

      polygon.addTo(group);
    });
  }, [layers.landUseZoning, opacities.landUseZoning, selectedZone, highlightedZoneIds, activeScenario, onSelectZone]);

  // Render & Update Emerging Economic Clusters
  useEffect(() => {
    const group = clusterLayersGroupRef.current;
    if (!group) return;
    group.clearLayers();

    if (!layers.economicClusters) return;

    KISUMU_CLUSTERS.forEach((cluster) => {
      const isHighGrowth = cluster.growthScore >= 90;
      const markerColor = isHighGrowth ? '#10b981' : '#06b6d4';

      const customIcon = L.divIcon({
        className: 'custom-cluster-marker',
        html: `
          <div style="
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 32px;
            height: 32px;
          ">
            <div style="
              position: absolute;
              width: 100%;
              height: 100%;
              border-radius: 50%;
              background: ${markerColor};
              opacity: 0.25;
              animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
            "></div>
            <div style="
              width: 22px;
              height: 22px;
              border-radius: 50%;
              background: #090d16;
              border: 2px solid ${markerColor};
              display: flex;
              align-items: center;
              justify-content: center;
              font-family: monospace;
              font-size: 10px;
              font-weight: 800;
              color: ${markerColor};
              box-shadow: 0 0 10px ${markerColor}66;
            ">
              ${cluster.growthScore}
            </div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker([cluster.lat, cluster.lng], { icon: customIcon });

      marker.bindPopup(
        `<div style="font-family: inherit; font-size: 12px; color: #f8fafc; background: #020617; padding: 10px; border-radius: 8px; border: 1px solid #1e293b; min-width: 190px;">
          <div style="font-weight: 800; font-size: 13px; color: #38bdf8;">${cluster.name}</div>
          <div style="font-size: 10px; color: #94a3b8; margin-bottom: 6px;">${cluster.clusterType}</div>
          <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 3px;">
            <span style="color: #64748b;">Growth Score:</span>
            <span style="font-weight: bold; color: #10b981;">${cluster.growthScore}/100</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 3px;">
            <span style="color: #64748b;">Turnover:</span>
            <span style="font-weight: bold; color: #f1f5f9;">KES ${cluster.monthlyTxMillionKES}M/mo</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 11px;">
            <span style="color: #64748b;">M-Pesa Agents:</span>
            <span style="font-weight: bold; color: #38bdf8;">${cluster.activeAgentsCount} active</span>
          </div>
        </div>`
      );

      marker.addTo(group);
    });
  }, [layers.economicClusters, opacities.economicClusters]);

  // Render & Update Economic Activity Heatmap
  useEffect(() => {
    const group = heatmapGroupRef.current;
    if (!group) return;
    group.clearLayers();

    if (!layers.economicHeatmap) return;

    KISUMU_HEATMAP_POINTS.forEach((pt) => {
      const radius = 180 + pt.intensity * 260;
      const color = pt.intensity > 0.9 ? '#ef4444' : pt.intensity > 0.8 ? '#f97316' : '#eab308';

      const circle = L.circle([pt.lat, pt.lng], {
        radius,
        color: color,
        weight: 1,
        fillColor: color,
        fillOpacity: pt.intensity * 0.45 * opacities.economicHeatmap,
      });

      circle.bindTooltip(
        `<div style="font-size: 10px; font-family: inherit; color: #f8fafc; background: #020617; padding: 4px 6px; border-radius: 4px; border: 1px solid #334155;">
          ${pt.label}<br/><span style="color: #38bdf8;">Tx Density: ${Math.round(pt.intensity * 100)}%</span>
        </div>`,
        { sticky: true }
      );

      circle.addTo(group);
    });
  }, [layers.economicHeatmap, opacities.economicHeatmap]);

  // Render & Update Infrastructure Points
  useEffect(() => {
    const group = infraGroupRef.current;
    if (!group) return;
    group.clearLayers();

    if (!layers.infrastructure) return;

    KISUMU_INFRASTRUCTURE.forEach((item) => {
      let iconColor = '#3b82f6';
      let iconSymbol = '⚡';

      if (item.type === 'power_substation') {
        iconColor = '#eab308';
        iconSymbol = '⚡';
      } else if (item.type === 'water_treatment') {
        iconColor = '#06b6d4';
        iconSymbol = '💧';
      } else if (item.type === 'health_facility') {
        iconColor = '#ef4444';
        iconSymbol = '🏥';
      } else if (item.type === 'education_hub') {
        iconColor = '#8b5cf6';
        iconSymbol = '🎓';
      } else if (item.type === 'market_terminal') {
        iconColor = '#10b981';
        iconSymbol = '🏬';
      } else if (item.type === 'port_airport') {
        iconColor = '#f59e0b';
        iconSymbol = '⚓';
      }

      const customIcon = L.divIcon({
        className: 'infra-marker',
        html: `
          <div style="
            width: 24px;
            height: 24px;
            border-radius: 6px;
            background: #0f172a;
            border: 1.5px solid ${iconColor};
            color: #ffffff;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            box-shadow: 0 0 8px ${iconColor}88;
            opacity: ${opacities.infrastructure};
          ">
            ${iconSymbol}
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const marker = L.marker([item.lat, item.lng], { icon: customIcon });

      marker.bindPopup(
        `<div style="font-family: inherit; font-size: 11px; color: #f8fafc; background: #020617; padding: 8px 10px; border-radius: 6px; border: 1px solid #1e293b; min-width: 180px;">
          <div style="font-weight: 700; color: ${iconColor}; font-size: 12px;">${item.name}</div>
          <div style="font-size: 10px; color: #94a3b8; margin-bottom: 4px;">${item.categoryLabel}</div>
          <div style="font-size: 10px; color: #cbd5e1;"><strong>Capacity:</strong> ${item.capacityOrClass}</div>
          <div style="font-size: 10px; color: #cbd5e1;"><strong>Agency:</strong> ${item.operator}</div>
        </div>`
      );

      marker.addTo(group);
    });
  }, [layers.infrastructure, opacities.infrastructure]);

  // Render & Update Population & Foot Traffic
  useEffect(() => {
    const group = popGroupRef.current;
    if (!group) return;
    group.clearLayers();

    if (!layers.populationFootTraffic) return;

    KISUMU_ZONES.forEach((zone) => {
      // Density representation using circular pulses
      const popRadius = Math.sqrt(zone.daytimePopulation) * 6;
      const circle = L.circle(zone.center, {
        radius: popRadius,
        color: '#06b6d4',
        weight: 1,
        fillColor: '#06b6d4',
        fillOpacity: 0.18 * opacities.populationFootTraffic,
        dashArray: '3, 4',
      });

      circle.bindTooltip(
        `<div style="font-size: 10px; font-family: inherit; color: #f8fafc; background: #020617; padding: 4px 6px; border-radius: 4px; border: 1px solid #06b6d4;">
          <strong>${zone.name}</strong><br/>
          Daytime: ${zone.daytimePopulation.toLocaleString()} people<br/>
          Foot Traffic: ${zone.footTrafficDaily.toLocaleString()}/day
        </div>`,
        { sticky: true }
      );

      circle.addTo(group);
    });
  }, [layers.populationFootTraffic, opacities.populationFootTraffic]);

  // Render & Update Investment Opportunity Zones
  useEffect(() => {
    const group = oppGroupRef.current;
    if (!group) return;
    group.clearLayers();

    if (!layers.opportunityZones) return;

    KISUMU_ZONES.filter((z) => z.isOpportunityZone).forEach((zone) => {
      const oppIcon = L.divIcon({
        className: 'opp-zone-badge',
        html: `
          <div style="
            display: inline-flex;
            align-items: center;
            background: #f59e0b;
            color: #020617;
            font-family: monospace;
            font-size: 10px;
            font-weight: 800;
            padding: 2px 6px;
            border-radius: 12px;
            border: 1.5px solid #ffffff;
            box-shadow: 0 0 12px rgba(245, 158, 11, 0.6);
            white-space: nowrap;
            opacity: ${opacities.opportunityZones};
          ">
            ★ Opportunity #${zone.opportunityRank}
          </div>
        `,
        iconSize: [90, 20],
        iconAnchor: [45, 10],
      });

      const marker = L.marker(zone.center, { icon: oppIcon });
      marker.on('click', () => onSelectZone(zone));
      marker.addTo(group);
    });
  }, [layers.opportunityZones, opacities.opportunityZones, onSelectZone]);

  // Render & Update Risk Layers
  useEffect(() => {
    const group = riskGroupRef.current;
    if (!group) return;
    group.clearLayers();

    if (!layers.riskLayers) return;

    KISUMU_RISKS.forEach((risk) => {
      const riskColor = risk.severity === 'critical' ? '#ef4444' : '#f59e0b';

      const polygon = L.polygon(risk.coordinates, {
        color: riskColor,
        weight: 2,
        fillColor: riskColor,
        fillOpacity: 0.3 * opacities.riskLayers,
        dashArray: '5, 5',
      });

      polygon.bindTooltip(
        `<div style="font-family: inherit; font-size: 11px; color: #fecdd3; background: #020617; padding: 6px 9px; border-radius: 6px; border: 1px solid #e11d48; max-width: 220px;">
          <div style="font-weight: bold; color: #f43f5e;">⚠️ ${risk.name}</div>
          <div style="font-size: 10px; color: #cbd5e1; margin-top: 2px;">${risk.description}</div>
        </div>`,
        { sticky: true }
      );

      polygon.addTo(group);
    });
  }, [layers.riskLayers, opacities.riskLayers]);

  return (
    <div className="relative w-full h-full bg-slate-950 overflow-hidden">
      {/* Leaflet map container */}
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Floating Spatial Attribution & Coordinate HUD */}
      <div className="absolute bottom-2 left-16 z-20 pointer-events-none hidden md:flex items-center space-x-3 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-md border border-slate-800 text-[10px] font-mono text-slate-400">
        <span className="flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>WGS84 • UTM 36N</span>
        </span>
        <span>•</span>
        <span>Elevation: 1,131m (Lake Victoria Datum)</span>
        <span>•</span>
        <span className="text-slate-300">Kisumu County CIDP III Spatial Model</span>
      </div>
    </div>
  );
};
