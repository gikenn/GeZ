import React, { useState } from 'react';
import { X, CheckCircle2, Send, ArrowRight, ShieldCheck } from 'lucide-react';

interface PilotIntakeModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCorridorName?: string;
}

export const PilotIntakeModal: React.FC<PilotIntakeModalProps> = ({
  isOpen,
  onClose,
  defaultCorridorName = 'Nairobi Metropolis & Thika Corridor',
}) => {
  const [name, setName] = useState('');
  const [organization, setOrganization] = useState('');
  const [email, setEmail] = useState('');
  const [geography, setGeography] = useState(defaultCorridorName);
  const [decisionQuestion, setDecisionQuestion] = useState(
    'Evaluating optimal location for a multi-tenant agro-logistics and cold storage hub along the transit corridor.'
  );
  const [agreed, setAgreed] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-[var(--paper)] border border-[var(--line)] rounded-xl w-full max-w-xl shadow-xl overflow-hidden text-[var(--ink)]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[var(--line)] bg-[var(--parchment)] flex items-center justify-between">
          <div>
            <span className="font-mono text-[10px] uppercase font-bold text-[var(--orange)]">
              05 — PILOT PATH
            </span>
            <h3 className="font-bold text-base text-[var(--ink)]">CORRIDOR PILOT INTAKE</h3>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-[var(--muted)] hover:text-[var(--ink)] rounded-md hover:bg-[var(--line)]/50 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[var(--sage-light)] text-[var(--sage)] mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-lg text-[var(--ink)]">Pilot Request Submitted</h4>
            <p className="text-xs text-[var(--ink-soft)] max-w-sm mx-auto leading-relaxed">
              We’ve received your corridor details for <strong>{geography}</strong>. The GEZ geospatial team will prepare the initial evidence pack and reach out to {email || 'your email'} within 24 hours.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="px-5 py-2 rounded-md bg-[var(--blue)] text-white text-xs font-mono font-semibold"
            >
              Return to Platform
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            <p className="text-[var(--ink-soft)] text-xs leading-relaxed">
              We’ll review the corridor, decision question, and data context, then follow up with a pilot evidence conversation.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block font-mono text-[11px] text-[var(--muted)] font-semibold mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Eng. Kevin Omondi"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[var(--paper)] border border-[var(--line)] rounded-md px-3 py-2 text-xs text-[var(--ink)] focus:outline-none focus:border-[var(--blue)]"
                />
              </div>

              <div>
                <label className="block font-mono text-[11px] text-[var(--muted)] font-semibold mb-1">
                  Organization / Entity
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. County Directorate of Lands / Commercial Bank"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  className="w-full bg-[var(--paper)] border border-[var(--line)] rounded-md px-3 py-2 text-xs text-[var(--ink)] focus:outline-none focus:border-[var(--blue)]"
                />
              </div>
            </div>

            <div>
              <label className="block font-mono text-[11px] text-[var(--muted)] font-semibold mb-1">
                Official Email
              </label>
              <input
                type="email"
                required
                placeholder="name@organization.or.ke"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[var(--paper)] border border-[var(--line)] rounded-md px-3 py-2 text-xs text-[var(--ink)] focus:outline-none focus:border-[var(--blue)]"
              />
            </div>

            <div>
              <label className="block font-mono text-[11px] text-[var(--muted)] font-semibold mb-1">
                Pilot Geography (City, Corridor, Basin, or Region)
              </label>
              <input
                type="text"
                required
                value={geography}
                onChange={(e) => setGeography(e.target.value)}
                className="w-full bg-[var(--paper)] border border-[var(--line)] rounded-md px-3 py-2 text-xs text-[var(--ink)] focus:outline-none focus:border-[var(--blue)]"
              />
            </div>

            <div>
              <label className="block font-mono text-[11px] text-[var(--muted)] font-semibold mb-1">
                What decision should the pilot help you make?
              </label>
              <textarea
                rows={3}
                required
                value={decisionQuestion}
                onChange={(e) => setDecisionQuestion(e.target.value)}
                className="w-full bg-[var(--paper)] border border-[var(--line)] rounded-md px-3 py-2 text-xs text-[var(--ink)] focus:outline-none focus:border-[var(--blue)] leading-relaxed"
              />
            </div>

            <div className="flex items-start space-x-2 pt-1">
              <input
                type="checkbox"
                id="consent"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 rounded border-[var(--line)] text-[var(--blue)] focus:ring-0"
              />
              <label htmlFor="consent" className="text-[11px] text-[var(--ink-soft)] leading-snug">
                I agree that GEZ can use these details to follow up about a corridor pilot. Your details stay with the pilot team.
              </label>
            </div>

            <div className="pt-3 border-t border-[var(--line)] flex items-center justify-between">
              <span className="text-[10px] font-mono text-[var(--muted)] flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[var(--sage)]" />
                <span>CONFIDENTIAL PILOT PROGRAM</span>
              </span>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3.5 py-1.5 rounded-md border border-[var(--line)] text-xs text-[var(--ink-soft)] hover:text-[var(--ink)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!agreed}
                  className="px-4 py-1.5 rounded-md bg-[var(--orange)] hover:bg-[#d6652a] disabled:opacity-50 text-white font-mono font-medium text-xs flex items-center space-x-1.5 shadow-xs"
                >
                  <span>Send pilot request</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
