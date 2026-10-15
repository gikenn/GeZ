export type ZoningCategory =
  | 'residential_low'
  | 'residential_high'
  | 'commercial_core'
  | 'commercial_subcenter'
  | 'mixed_use'
  | 'industrial_light'
  | 'industrial_heavy_sez'
  | 'agricultural_periurban'
  | 'protected_wetland';

export interface DominantSector {
  name: string;
  share: number; // percentage 0 - 100
  color: string;
}

export interface InfrastructureAccess {
  powerGrid: 'Reliable 33kV' | '11kV Feeder (Moderate)' | 'Unstable' | 'Off-Grid';
  waterAccess: string;
  roadType: string;
  distanceToHospitalKm: number;
  distanceToMajorMarketKm: number;
  fiberOpticBroadband: boolean;
  sanitationSewerConnected: boolean;
}

export interface ZoneRisk {
  type: 'flood_risk' | 'utility_deficit' | 'road_bottleneck' | 'planning_conflict' | 'informal_tenure';
  severity: 'low' | 'moderate' | 'high' | 'critical';
  title: string;
  description: string;
}

export interface EconomicZone {
  id: string;
  corridorId?: string;
  name: string;
  locationName?: string;
  county?: string;
  subcounty?: string;
  ward?: string;
  currentZoning: ZoningCategory;
  areaSqKm: number;
  center: [number, number]; // [lat, lng]
  coordinates: [number, number][]; // Polygon ring
  economicActivityScore: number; // 0-100
  growthPotentialScore: number; // 0-100
  monthlyTxVolumeKES: number; // in Millions KES
  txVelocityPerHour: number;
  dominantSectors: DominantSector[];
  populationDensity: number; // per sq km
  daytimePopulation: number;
  nighttimePopulation: number;
  footTrafficDaily: number;
  infrastructureScore: number; // 0-100
  infrastructure: InfrastructureAccess;
  risks: ZoneRisk[];
  recommendedZoningAction: string;
  isOpportunityZone: boolean;
  opportunityRank?: number;
  summary: string;
}

export interface EconomicCorridor {
  id: string;
  code: string;
  name: string;
  region: string;
  description: string;
  center: [number, number]; // lat, lng
  zoomLevel: number;
  primaryHighway: string;
  monthlyTurnoverKES: string;
  totalParcels: number;
  highGrowthClusters: number;
  keyOpportunity: string;
}

export interface ModelWeights {
  opportunity: number; // 0 - 100
  infrastructure: number; // 0 - 100
  resilience: number; // 0 - 100
  inclusion: number; // 0 - 100
}

export interface ScenarioResult {
  zoneId: string;
  originalZoning: ZoningCategory;
  simulatedZoning: ZoningCategory;
  economicActivityBefore: number;
  economicActivityAfter: number;
  accessibilityBefore: number;
  accessibilityAfter: number;
  populationServedBefore: number;
  populationServedAfter: number;
  investmentSuitabilityBefore: number;
  investmentSuitabilityAfter: number;
  estimatedTaxRevenueAnnualDeltaKES: number;
  infrastructureStrainRisk: 'Low' | 'Moderate' | 'High';
  executiveSummary: string;
  actionChecklist: string[];
}

export interface CopilotMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  highlightedZoneIds?: string[];
  suggestedAction?: string;
  metrics?: {
    label: string;
    value: string;
    trend?: 'up' | 'down' | 'neutral';
  }[];
}

export interface EconomicClusterPoint {
  id: string;
  name: string;
  lat: number;
  lng: number;
  clusterType: 'Retail & POS Hub' | 'Agri-Logistics' | 'Cross-border Trade' | 'Financial & Tech Services' | 'Port & Marine' | 'Industrial Park';
  growthScore: number;
  activityScore: number;
  monthlyTxMillionKES: number;
  activeAgentsCount: number;
  radiusMeters: number;
}

export interface InfrastructurePoint {
  id: string;
  name: string;
  type: 'road_arterial' | 'power_substation' | 'water_treatment' | 'health_facility' | 'education_hub' | 'market_terminal' | 'port_airport';
  categoryLabel: string;
  lat: number;
  lng: number;
  capacityOrClass: string;
  operator: string;
  status: 'operational' | 'under_expansion' | 'deficit';
}

export interface RiskPolygon {
  id: string;
  name: string;
  riskType: 'flash_flood' | 'grid_overload' | 'road_choke_point' | 'informal_settlement_friction';
  severity: 'moderate' | 'high' | 'critical';
  coordinates: [number, number][];
  description: string;
  mitigationRequired: string;
}

export interface HeatmapPoint {
  lat: number;
  lng: number;
  intensity: number;
  label: string;
}

export interface LayerVisibilityState {
  economicHeatmap: boolean;
  economicClusters: boolean;
  landUseZoning: boolean;
  infrastructure: boolean;
  populationFootTraffic: boolean;
  opportunityZones: boolean;
  riskLayers: boolean;
}

export interface LayerOpacityState {
  economicHeatmap: number;
  economicClusters: number;
  landUseZoning: number;
  infrastructure: number;
  populationFootTraffic: number;
  opportunityZones: number;
  riskLayers: number;
}
