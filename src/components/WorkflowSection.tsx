import React from 'react';
import {
  HelpCircle,
  Layers,
  Sliders,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export const WorkflowSection: React.FC = () => {
  return (
    <section id="workflow" className="w-full py-16 sm:py-20 bg-[var(--paper)] border-b border-[var(--line)]">
      <div className="wrap space-y-10">
        {/* Section Header */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="font-mono text-xs uppercase font-bold text-[var(--muted)] mb-1">
              01 — HOW IT WORKS
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[var(--ink)] tracking-tight font-sans">
              From a planning question
              <br />
              <em className="font-serif italic font-normal text-[var(--blue)]">to an accountable zone.</em>
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-[var(--ink-soft)] max-w-md font-sans">
            Planning is still drawing with yesterday’s map. GEZ turns fragmented datasets into a living decision layer with transparent trade-offs.
          </p>
        </div>

        {/* 4-Step Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Step 1 */}
          <div className="border border-[var(--line)] rounded-xl p-5 bg-[var(--parchment)]/50 space-y-3 relative">
            <span className="font-mono text-xs font-bold text-[var(--blue)] px-2 py-0.5 rounded bg-[var(--blue-light)]">
              STEP 01
            </span>
            <h3 className="font-bold text-base text-[var(--ink)]">
              Frame the Decision
            </h3>
            <p className="text-xs text-[var(--ink-soft)] leading-relaxed">
              Define the corridor dilemma in plain language: where should a new agro-industrial SEZ, wholesale logistics hub, or commercial bank branch be placed?
            </p>
          </div>

          {/* Step 2 */}
          <div className="border border-[var(--line)] rounded-xl p-5 bg-[var(--parchment)]/50 space-y-3 relative">
            <span className="font-mono text-xs font-bold text-[var(--sage)] px-2 py-0.5 rounded bg-[var(--sage-light)]">
              STEP 02
            </span>
            <h3 className="font-bold text-base text-[var(--ink)]">
              Assemble Multi-Layered Signals
            </h3>
            <p className="text-xs text-[var(--ink-soft)] leading-relaxed">
              Ingest real-world data: Safaricom M-Pesa till density, KPLC 33kV three-phase power lines, KeNHA dual carriageways, and NEMA flood risk buffers.
            </p>
          </div>

          {/* Step 3 */}
          <div className="border border-[var(--line)] rounded-xl p-5 bg-[var(--parchment)]/50 space-y-3 relative">
            <span className="font-mono text-xs font-bold text-[var(--orange)] px-2 py-0.5 rounded bg-[var(--orange-light)]">
              STEP 03
            </span>
            <h3 className="font-bold text-base text-[var(--ink)]">
              Tune the Trade-offs Openly
            </h3>
            <p className="text-xs text-[var(--ink-soft)] leading-relaxed">
              Use the Sandwich Modification Form to move weights between economic velocity, infrastructure readiness, climate resilience, and commuter access.
            </p>
          </div>

          {/* Step 4 */}
          <div className="border border-[var(--line)] rounded-xl p-5 bg-[var(--parchment)]/50 space-y-3 relative">
            <span className="font-mono text-xs font-bold text-[#8f6899] px-2 py-0.5 rounded bg-[#ecdff2]">
              STEP 04
            </span>
            <h3 className="font-bold text-base text-[var(--ink)]">
              Deliver an Accountable Zone
            </h3>
            <p className="text-xs text-[var(--ink-soft)] leading-relaxed">
              Generate a defensible spatial zone package with statutory references (PLUPA 2019), before-and-after fiscal yield, and full audit provenance.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
