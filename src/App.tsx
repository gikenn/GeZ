import React, { useState } from 'react';
import { SiteHeader } from './components/SiteHeader';
import { HeroSection } from './components/HeroSection';
import { WorkflowSection } from './components/WorkflowSection';
import { DataLayersSection } from './components/DataLayersSection';
import { NationalAerialView } from './components/NationalAerialView';
import { SandwichModificationPanel } from './components/SandwichModificationPanel';
import { ZoneWatchlistSection } from './components/ZoneWatchlistSection';
import { SiteFooter } from './components/SiteFooter';
import { ZoningCopilot } from './components/ZoningCopilot';
import { PilotIntakeModal } from './components/PilotIntakeModal';
import { ExportReportModal } from './components/ExportReportModal';
import {
  EconomicCorridor,
  EconomicZone,
  ModelWeights,
  ScenarioResult,
} from './types/gis';
import {
  KENYA_CORRIDORS,
  ALL_KENYA_ZONES,
  DEFAULT_WEIGHTS,
} from './data/nationalData';

export default function App() {
  // Active Corridor & Zone Selection
  const [selectedCorridor, setSelectedCorridor] = useState<EconomicCorridor>(KENYA_CORRIDORS[0]);
  const zonesInCorridor = ALL_KENYA_ZONES.filter((z) => z.corridorId === selectedCorridor.id);
  const [selectedZone, setSelectedZone] = useState<EconomicZone | null>(ALL_KENYA_ZONES[0]);

  // Model Weights
  const [weights, setWeights] = useState<ModelWeights>(DEFAULT_WEIGHTS);

  // Active Simulated Scenario
  const [activeScenario, setActiveScenario] = useState<ScenarioResult | null>(null);

  // Modals & Panels State
  const [isCopilotOpen, setIsCopilotOpen] = useState<boolean>(false);
  const [isIntakeModalOpen, setIsIntakeModalOpen] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>('lab');

  // Handle corridor switch
  const handleSelectCorridor = (corridor: EconomicCorridor) => {
    setSelectedCorridor(corridor);
    const firstZone = ALL_KENYA_ZONES.find((z) => z.corridorId === corridor.id);
    if (firstZone) setSelectedZone(firstZone);
  };

  // Handle zone switch
  const handleSelectZone = (zone: EconomicZone) => {
    setSelectedZone(zone);
    const matchingCorridor = KENYA_CORRIDORS.find((c) => c.id === zone.corridorId);
    if (matchingCorridor && matchingCorridor.id !== selectedCorridor.id) {
      setSelectedCorridor(matchingCorridor);
    }
  };

  // Navigation scroll helper
  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen w-full bg-[var(--parchment)] text-[var(--ink)] flex flex-col font-sans select-none antialiased">
      {/* Top Navigation Bar */}
      <SiteHeader
        onOpenIntakeModal={() => setIsIntakeModalOpen(true)}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        onToggleCopilot={() => setIsCopilotOpen((prev) => !prev)}
        isCopilotOpen={isCopilotOpen}
        activeSection={activeSection}
        onNavigateSection={scrollToSection}
      />

      {/* Hero Section */}
      <HeroSection
        onScrollToLab={() => scrollToSection('lab')}
        onScrollToWorkflow={() => scrollToSection('workflow')}
        onOpenIntakeModal={() => setIsIntakeModalOpen(true)}
      />

      {/* 01 — HOW IT WORKS */}
      <WorkflowSection />

      {/* 02 — DATA LAYERS */}
      <DataLayersSection />

      {/* 03 — ZONING LAB (SANDWICH MODIFICATION PANEL + AERIAL COUNTRY VIEW) */}
      <section id="lab" className="w-full py-16 sm:py-20 bg-[var(--parchment)] border-b border-[var(--line)]">
        <div className="wrap space-y-8">
          {/* Section Heading */}
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="font-mono text-xs uppercase font-bold text-[var(--muted)] mb-1">
                03 — ZONING LAB & SIMULATION
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[var(--ink)] tracking-tight font-sans">
                Tune the trade-offs.
                <br />
                <em className="font-serif italic font-normal text-[var(--orange)]">Keep the decision human.</em>
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-[var(--ink-soft)] max-w-md font-sans">
              Move the weights and modify zoning slices to see how a pilot score changes. This is an illustrative sandbox grounded in Kenya spatial data, not an investment forecast.
            </p>
          </div>

          {/* Grid Layout: Sandwich Modification Form (Left) & General Aerial View of Country (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: The Sandwich Form */}
            <div className="lg:col-span-6 w-full">
              <SandwichModificationPanel
                corridors={KENYA_CORRIDORS}
                selectedCorridor={selectedCorridor}
                onSelectCorridor={handleSelectCorridor}
                zonesInCorridor={zonesInCorridor}
                selectedZone={selectedZone}
                onSelectZone={handleSelectZone}
                weights={weights}
                onChangeWeights={setWeights}
                onApplyModification={(result) => {
                  setActiveScenario(result);
                }}
                onOpenExportModal={() => setIsExportModalOpen(true)}
              />
            </div>

            {/* Right: General Aerial View of the Country */}
            <div className="lg:col-span-6 w-full space-y-4">
              <NationalAerialView
                selectedCorridor={selectedCorridor}
                onSelectCorridor={handleSelectCorridor}
                selectedZone={selectedZone}
                onSelectZone={handleSelectZone}
                allZones={ALL_KENYA_ZONES}
                weights={weights}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 04 — ZONE WATCHLIST */}
      <ZoneWatchlistSection
        zones={ALL_KENYA_ZONES}
        selectedZone={selectedZone}
        onSelectZone={handleSelectZone}
        weights={weights}
        onScrollToLab={() => scrollToSection('lab')}
      />

      {/* Site Footer */}
      <SiteFooter />

      {/* Zoning Copilot Drawer */}
      <ZoningCopilot
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        selectedZone={selectedZone}
        onSelectZoneById={(id) => {
          const found = ALL_KENYA_ZONES.find((z) => z.id === id);
          if (found) handleSelectZone(found);
        }}
      />

      {/* Pilot Intake Modal */}
      <PilotIntakeModal
        isOpen={isIntakeModalOpen}
        onClose={() => setIsIntakeModalOpen(false)}
        defaultCorridorName={selectedCorridor.name}
      />

      {/* Export Report Dossier Modal */}
      <ExportReportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        zone={selectedZone}
        activeScenario={activeScenario}
      />
    </div>
  );
}
