import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ChevronRight,
  TrendingUp,
  MapPin,
  CheckCircle2,
  Compass,
} from 'lucide-react';

interface HeroSectionProps {
  onScrollToLab: () => void;
  onScrollToWorkflow: () => void;
  onOpenIntakeModal: () => void;
}

const WALKTHROUGH_STEPS = [
  {
    step: '01',
    title: 'Frame one corridor question',
    desc: 'Ask in plain language: where should the next agro-processing hub, wholesale market, or transport link go?',
    tag: 'QUESTION INTAKE',
  },
  {
    step: '02',
    title: 'Assemble real-world evidence',
    desc: 'Aggregate high-velocity POS turnover, M-Pesa till density, 3-phase grid power lines, and flood plain hydrology.',
    tag: 'EVIDENCE HARVEST',
  },
  {
    step: '03',
    title: 'Tune trade-offs with open weights',
    desc: 'Adjust weights for opportunity, infrastructure readiness, climate resilience, and social inclusion.',
    tag: 'SANDWICH LAB',
  },
  {
    step: '04',
    title: 'Return a defensible spatial zone',
    desc: 'Publish an audit trail that county assemblies, commercial banks, and developers can sign off on with confidence.',
    tag: 'STATUTORY AUDIT',
  },
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  onScrollToLab,
  onScrollToWorkflow,
  onOpenIntakeModal,
}) => {
  const [activeWalkthrough, setActiveWalkthrough] = useState(0);

  return (
    <section className="relative w-full border-b border-[var(--line)] bg-[var(--parchment)] pt-12 pb-16 sm:py-20 overflow-hidden">
      <div className="wrap">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Editorial Headline & Copy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-[var(--line)] bg-[var(--paper)] text-xs font-mono text-[var(--ink-soft)]">
              <Sparkles className="w-3.5 h-3.5 text-[var(--blue)]" />
              <span>Agentic spatial intelligence for accountable growth</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-[var(--ink)] tracking-tight leading-[1.08] font-sans">
              Turn place data
              <br />
              into <em className="font-serif italic font-normal text-[var(--blue)]">decisions</em>
              <br />
              people can defend.
            </h1>

            <p className="text-base sm:text-lg text-[var(--ink-soft)] max-w-xl leading-relaxed">
              GEZ is a living spatial decision platform for planners, investors, and local authorities across Kenya — turning changing signals into aerial models, scores, scenarios, and an evidence trail.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onScrollToLab}
                className="px-5 py-3 rounded-md bg-[var(--blue)] hover:bg-[#155465] text-white text-xs sm:text-sm font-mono font-semibold transition-all shadow-sm flex items-center space-x-2"
              >
                <span>See the zoning lab</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onScrollToWorkflow}
                className="px-4 py-3 rounded-md border border-[var(--line)] bg-[var(--paper)] hover:bg-[var(--line)]/40 text-xs sm:text-sm font-mono text-[var(--ink)] transition-colors flex items-center space-x-1.5"
              >
                <span>↓ See how it works</span>
              </button>
            </div>

            {/* Micro footnote */}
            <div className="pt-6 border-t border-[var(--line)]/70 text-[11px] font-mono text-[var(--muted)] flex items-center space-x-2">
              <span>07°18′S · 34°49′E</span>
              <span>/</span>
              <span>national economic corridor view</span>
              <span>/</span>
              <span>v0.1</span>
            </div>
          </div>

          {/* Right Column: Walkthrough Interactive Card */}
          <div className="lg:col-span-5">
            <div className="bg-[var(--paper)] border border-[var(--line)] rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
                <span className="font-mono text-xs uppercase font-bold text-[var(--muted)]">
                  PRODUCT OVERVIEW
                </span>
                <span className="font-mono text-xs text-[var(--blue)] font-bold">
                  0{activeWalkthrough + 1} / 04
                </span>
              </div>

              <div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[var(--blue-light)] text-[var(--blue)] uppercase">
                  {WALKTHROUGH_STEPS[activeWalkthrough].tag}
                </span>
                <h3 className="text-lg font-bold text-[var(--ink)] mt-2">
                  {WALKTHROUGH_STEPS[activeWalkthrough].title}
                </h3>
                <p className="text-xs text-[var(--ink-soft)] leading-relaxed mt-1.5">
                  {WALKTHROUGH_STEPS[activeWalkthrough].desc}
                </p>
              </div>

              {/* 4 dots / step buttons */}
              <div className="grid grid-cols-4 gap-2 pt-2">
                {WALKTHROUGH_STEPS.map((s, idx) => (
                  <button
                    key={s.step}
                    onClick={() => setActiveWalkthrough(idx)}
                    className={`p-2 rounded text-left border transition-all text-xs font-mono ${
                      activeWalkthrough === idx
                        ? 'border-[var(--blue)] bg-[var(--blue-light)]/40 font-bold text-[var(--blue)]'
                        : 'border-[var(--line)] bg-[var(--paper)] text-[var(--muted)] hover:border-[var(--muted)]'
                    }`}
                  >
                    <div>{s.step}</div>
                  </button>
                ))}
              </div>

              <div className="pt-2">
                <button
                  onClick={onOpenIntakeModal}
                  className="w-full py-2 px-3 rounded-md bg-[var(--parchment)] hover:bg-[var(--line)]/60 text-xs font-mono font-medium text-[var(--ink)] border border-[var(--line)] flex items-center justify-center space-x-1.5 transition-colors"
                >
                  <span>Request a custom corridor evaluation</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
