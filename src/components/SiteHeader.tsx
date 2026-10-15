import React from 'react';
import {
  Compass,
  FileCheck2,
  Sparkles,
  Layers,
  ArrowRight,
  Menu,
  X,
} from 'lucide-react';

interface SiteHeaderProps {
  onOpenIntakeModal: () => void;
  onOpenExportModal: () => void;
  onToggleCopilot: () => void;
  isCopilotOpen: boolean;
  activeSection: string;
  onNavigateSection: (sectionId: string) => void;
}

export const SiteHeader: React.FC<SiteHeaderProps> = ({
  onOpenIntakeModal,
  onOpenExportModal,
  onToggleCopilot,
  isCopilotOpen,
  activeSection,
  onNavigateSection,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--line)] bg-[var(--paper)]/95 backdrop-blur-md">
      <div className="wrap flex items-center justify-between h-16">
        {/* Brand Lockup */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <span className="font-mono text-sm font-black px-2 py-0.5 rounded bg-[var(--blue)] text-white tracking-wider">
              GEZ
            </span>
            <div className="flex flex-col">
              <span className="font-bold text-sm text-[var(--ink)] leading-none tracking-tight">
                GEOSPATIAL ECONOMIC ZONING
              </span>
              <span className="font-mono text-[9px] text-[var(--muted)] uppercase tracking-wider mt-0.5">
                National Economic Corridors • Spatial Zoning Platform
              </span>
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-6 text-xs font-mono">
          <button
            onClick={() => onNavigateSection('workflow')}
            className={`transition-colors hover:text-[var(--ink)] ${
              activeSection === 'workflow' ? 'text-[var(--blue)] font-bold' : 'text-[var(--ink-soft)]'
            }`}
          >
            01 — HOW IT WORKS
          </button>

          <button
            onClick={() => onNavigateSection('layers')}
            className={`transition-colors hover:text-[var(--ink)] ${
              activeSection === 'layers' ? 'text-[var(--blue)] font-bold' : 'text-[var(--ink-soft)]'
            }`}
          >
            02 — DATA LAYERS
          </button>

          <button
            onClick={() => onNavigateSection('lab')}
            className={`transition-colors hover:text-[var(--ink)] ${
              activeSection === 'lab' ? 'text-[var(--blue)] font-bold' : 'text-[var(--ink-soft)]'
            }`}
          >
            03 — ZONING LAB
          </button>

          <button
            onClick={() => onNavigateSection('watchlist')}
            className={`transition-colors hover:text-[var(--ink)] ${
              activeSection === 'watchlist' ? 'text-[var(--blue)] font-bold' : 'text-[var(--ink-soft)]'
            }`}
          >
            04 — WATCHLIST
          </button>

          {/* Zoning Copilot Gemini Trigger */}
          <button
            onClick={onToggleCopilot}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded transition-all border ${
              isCopilotOpen
                ? 'bg-[var(--blue-light)] text-[var(--blue)] border-[var(--blue)]'
                : 'text-[var(--ink-soft)] border-transparent hover:border-[var(--line)]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[var(--blue)]" />
            <span>ZONING COPILOT</span>
          </button>
        </nav>

        {/* Action CTAs */}
        <div className="hidden sm:flex items-center space-x-2.5">
          <button
            onClick={onOpenExportModal}
            className="px-3 py-1.5 rounded-md border border-[var(--line)] bg-[var(--paper)] hover:bg-[var(--line)]/40 text-xs font-mono text-[var(--ink)] transition-colors"
          >
            Export Dossier
          </button>

          <button
            onClick={onOpenIntakeModal}
            className="px-3.5 py-1.5 rounded-md bg-[var(--orange)] hover:bg-[#d6652a] text-white text-xs font-mono font-medium transition-all shadow-xs flex items-center space-x-1"
          >
            <span>Request a corridor pilot</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-1.5 text-[var(--ink-soft)] hover:text-[var(--ink)]"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-[var(--line)] bg-[var(--paper)] px-4 py-3 space-y-2 text-xs font-mono">
          <button
            onClick={() => {
              onNavigateSection('workflow');
              setIsMobileMenuOpen(false);
            }}
            className="block w-full text-left py-1 text-[var(--ink-soft)]"
          >
            01 — HOW IT WORKS
          </button>
          <button
            onClick={() => {
              onNavigateSection('layers');
              setIsMobileMenuOpen(false);
            }}
            className="block w-full text-left py-1 text-[var(--ink-soft)]"
          >
            02 — DATA LAYERS
          </button>
          <button
            onClick={() => {
              onNavigateSection('lab');
              setIsMobileMenuOpen(false);
            }}
            className="block w-full text-left py-1 text-[var(--ink-soft)]"
          >
            03 — ZONING LAB
          </button>
          <button
            onClick={() => {
              onNavigateSection('watchlist');
              setIsMobileMenuOpen(false);
            }}
            className="block w-full text-left py-1 text-[var(--ink-soft)]"
          >
            04 — WATCHLIST
          </button>
          <div className="pt-2 flex flex-col space-y-2">
            <button
              onClick={() => {
                onToggleCopilot();
                setIsMobileMenuOpen(false);
              }}
              className="w-full py-1.5 text-center rounded bg-[var(--blue-light)] text-[var(--blue)] font-bold"
            >
              Zoning Copilot AI
            </button>
            <button
              onClick={() => {
                onOpenIntakeModal();
                setIsMobileMenuOpen(false);
              }}
              className="w-full py-1.5 text-center rounded bg-[var(--orange)] text-white font-bold"
            >
              Request a corridor pilot
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
