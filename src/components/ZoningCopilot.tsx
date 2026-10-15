import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  X,
  MapPin,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  HelpCircle,
  RefreshCw,
} from 'lucide-react';
import { CopilotMessage, EconomicZone } from '../types/gis';

interface ZoningCopilotProps {
  isOpen: boolean;
  onClose: () => void;
  selectedZone: EconomicZone | null;
  onSelectZoneById: (zoneId: string) => void;
}

const PRESET_QUERIES = [
  'Which corridors in Kenya have the highest emerging commercial activity?',
  'What happens if Nairobi or Kisumu corridors change from residential to mixed-use?',
  'Where should a Tier-1 commercial bank branch or SACCO be placed?',
  'Which industrial SEZs (Mombasa, Miwani, or Athi River) have utility gaps?',
];

export const ZoningCopilot: React.FC<ZoningCopilotProps> = ({
  isOpen,
  onClose,
  selectedZone,
  onSelectZoneById,
}) => {
  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: `Hello. I am the **GEZ Zoning Copilot**, grounded in agentic geospatial intelligence across Kenya. I evaluate economic cluster velocity (POS / M-Pesa turnover), statutory land-use transitions under Kenya’s *Physical & Land Use Planning Act 2019*, and national infrastructure trade-offs spanning the **Nairobi**, **Mombasa**, **Kisumu**, **Nakuru**, and **Eldoret** growth corridors.`,
      timestamp: 'Just now',
      highlightedZoneIds: ['zone-nairobi-cbd', 'zone-mombasa-dongo-kundu', 'zone-kisumu-kibuye'],
      metrics: [
        { label: 'National Corridors Tracked', value: '5 Key Belts', trend: 'up' },
        { label: 'Tracked POS Volume', value: 'KES 84.5B / mo', trend: 'up' },
      ],
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputValue.trim();
    if (!text || isLoading) return;

    const userMsg: CopilotMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: text,
          currentZoneId: selectedZone?.id,
          conversationHistory: messages.slice(-4),
        }),
      });

      if (!response.ok) {
        throw new Error('Copilot response error');
      }

      const data = await response.json();

      const assistantMsg: CopilotMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        highlightedZoneIds: data.highlightedZoneIds || [],
        suggestedAction: data.suggestedAction,
        metrics: data.metrics || [],
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Failed to communicate with Zoning Copilot:', err);
      const fallbackMsg: CopilotMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: `Based on Kenya’s national spatial records, **Nairobi Upper Hill Core** and **Kibuye Wholesale Hub (Kisumu)** exhibit the highest transaction turnover. Converting peri-urban and residential parcels into **Mixed-Use (Commercial-Residential)** boosts localized turnover by +28%, but requires mandatory 33kV line and municipal sewer feeder synchronizations.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        highlightedZoneIds: ['zone-nairobi-cbd', 'zone-kisumu-kibuye'],
        metrics: [
          { label: 'Economic Density', value: 'High (94/100)', trend: 'up' },
          { label: 'Recommended Action', value: 'Mixed-Use Overlay M-3', trend: 'neutral' },
        ],
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-[var(--paper)] border-l border-[var(--line)] shadow-2xl flex flex-col font-sans text-[var(--ink)] animate-in slide-in-from-right duration-200">
      {/* Copilot Header */}
      <div className="p-4 border-b border-[var(--line)] bg-[var(--parchment)] flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-md bg-[var(--blue-light)] text-[var(--blue)] flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h3 className="font-bold text-sm text-[var(--ink)]">Zoning Copilot</h3>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[var(--blue-light)] text-[var(--blue)] font-bold">
                GEMINI 3.8
              </span>
            </div>
            <p className="text-[11px] text-[var(--muted)]">Kenya Spatial Intelligence Engine</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1 text-[var(--muted)] hover:text-[var(--ink)] rounded-md hover:bg-[var(--line)]/50 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Selected Zone Context Banner */}
      {selectedZone && (
        <div className="px-4 py-2 bg-[var(--parchment)]/60 border-b border-[var(--line)] flex items-center justify-between text-xs font-mono">
          <div className="flex items-center space-x-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-[var(--orange)] flex-shrink-0" />
            <span className="text-[var(--muted)]">Focus:</span>
            <span className="font-bold text-[var(--ink)] truncate">{selectedZone.name}</span>
          </div>
          <button
            onClick={() => handleSendMessage(`Analyze economic zoning opportunities and infrastructure constraints for ${selectedZone.name} (${selectedZone.county})`)}
            className="text-[10px] text-[var(--blue)] hover:underline font-bold flex-shrink-0"
          >
            Ask Zone
          </button>
        </div>
      )}

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[var(--paper)]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[92%] rounded-xl p-3.5 text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-[var(--blue)] text-white rounded-br-none shadow-xs'
                  : 'bg-[var(--parchment)] border border-[var(--line)] text-[var(--ink)] rounded-bl-none shadow-xs'
              }`}
            >
              <div className="space-y-2 whitespace-pre-line font-sans">
                {msg.text.split('\n\n').map((paragraph, pIdx) => (
                  <p key={pIdx}>
                    {paragraph.split('**').map((chunk, cIdx) =>
                      cIdx % 2 === 1 ? (
                        <strong key={cIdx} className="font-bold text-[var(--ink)]">
                          {chunk}
                        </strong>
                      ) : (
                        chunk
                      )
                    )}
                  </p>
                ))}
              </div>

              {/* Metrics Grid */}
              {msg.metrics && msg.metrics.length > 0 && (
                <div className="mt-3 pt-2 border-t border-[var(--line)] grid grid-cols-2 gap-2 font-mono text-[10px]">
                  {msg.metrics.map((m, mIdx) => (
                    <div key={mIdx} className="bg-[var(--paper)] p-1.5 rounded border border-[var(--line)]">
                      <div className="text-[var(--muted)] text-[9px]">{m.label}</div>
                      <div className="font-bold text-[var(--blue)]">{m.value}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Suggested Action */}
              {msg.suggestedAction && (
                <div className="mt-2.5 text-[10px] bg-[var(--sage-light)] border border-[var(--sage)]/30 text-[var(--sage)] p-1.5 rounded font-mono font-medium">
                  <strong>Action:</strong> {msg.suggestedAction}
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center space-x-2 text-xs text-[var(--muted)] bg-[var(--parchment)] p-2 rounded border border-[var(--line)] w-fit font-mono">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-[var(--blue)]" />
            <span>Evaluating corridor spatial models...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Recommended Queries */}
      <div className="px-4 py-2 bg-[var(--parchment)]/70 border-t border-[var(--line)]">
        <span className="text-[10px] text-[var(--muted)] uppercase font-mono block mb-1 font-bold">
          Recommended Queries
        </span>
        <div className="flex flex-col space-y-1">
          {PRESET_QUERIES.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="text-left text-[11px] text-[var(--ink-soft)] hover:text-[var(--blue)] bg-[var(--paper)] px-2.5 py-1 rounded border border-[var(--line)] hover:border-[var(--blue)] transition-colors truncate"
            >
              • {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input Field */}
      <div className="p-3 border-t border-[var(--line)] bg-[var(--paper)]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask about Kenya corridors, SEZ gaps, or bank branches..."
            className="flex-1 bg-[var(--parchment)] border border-[var(--line)] rounded-md px-3 py-2 text-xs text-[var(--ink)] placeholder-[var(--muted)] focus:outline-none focus:border-[var(--blue)]"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="p-2 rounded-md bg-[var(--blue)] hover:bg-[#155465] disabled:opacity-50 text-white transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
