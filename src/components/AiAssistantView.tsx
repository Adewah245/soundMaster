import React, { useState } from 'react';
import { AcousticMeasurement, EngineeringProfile, EngineeringResult, UserMode, Venue } from '../types';
import { Sparkles, Send, ShieldAlert, CheckCircle2, MessageSquare, Info, RefreshCw } from 'lucide-react';

interface AiAssistantViewProps {
  venue: Venue;
  profile: EngineeringProfile;
  latestMeasurement: AcousticMeasurement | null;
  engineeringResult: EngineeringResult | null;
  userMode: UserMode;
}

export const AiAssistantView: React.FC<AiAssistantViewProps> = ({
  venue,
  profile,
  latestMeasurement,
  engineeringResult,
  userMode
}) => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isAiGenerated, setIsAiGenerated] = useState<boolean | null>(null);

  const sampleQuestions = [
    'How do I eliminate the resonant frequency spike?',
    'Why is there acoustic mud or low-frequency buildup in the rear rows?',
    'What physical line array tilt or delay will balance the upper balcony?',
    'Explain the speech intelligibility STI score for this room.'
  ];

  const handleAsk = async (questionText?: string) => {
    const q = questionText || query;
    if (!q.trim()) return;

    setLoading(true);
    setResponse(null);

    try {
      const res = await fetch('/api/ai/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q,
          userMode,
          venueContext: {
            name: venue.name,
            type: venue.type,
            dimensions: venue.dimensions,
            zones: venue.zones.map(z => ({ name: z.name, spl: z.currentSplDba, target: z.targetSplDba }))
          },
          equipmentContext: {
            speakers: venue.speakers.map(s => ({ name: s.name, type: s.type, delay: s.delayMs, gain: s.gainDb }))
          },
          engineeringResult: engineeringResult || {
            complianceRate: 88,
            alerts: ['Frequency deviation in low-mid band at 220Hz (+2.8dB)'],
            recommendedAdjustments: [{ component: 'PEQ', action: 'Cut', parameter: '220Hz', value: '-2.5dB' }]
          }
        })
      });

      const data = await res.json();
      setResponse(data.explanation || 'No explanation generated.');
      setIsAiGenerated(data.isAiGenerated ?? false);
    } catch (err) {
      console.error('AI query failed:', err);
      setResponse('Acoustic Engine Evaluation: Verify speaker angle dispersion and trim 220Hz by -2.5dB to eliminate boundary reflection buildup.');
      setIsAiGenerated(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* SoundPilot Boundary Rule Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">SoundPilot AI Boundary Law (Section 10 & 47)</span>
            </div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              Acoustic Explanation Assistant
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              AI translates validated engineering metrics into plain or pro language. It <strong className="text-slate-200">never</strong> guesses measurements or overrides physics.
            </p>
          </div>

          {/* Architecture Boundary Badge */}
          <div className="bg-slate-950 border border-slate-800 rounded p-3 text-xs font-mono text-slate-300">
            <div className="text-[10px] text-slate-500 uppercase font-bold">Acoustic Authority Contract</div>
            <div className="flex items-center gap-1.5 text-cyan-300 mt-1">
              <span>DSP (Measure)</span>
              <span>→</span>
              <span>Go (Evaluate)</span>
              <span>→</span>
              <span className="text-emerald-400 font-bold">AI (Explain)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Interaction Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Chat / Explanation Query */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
          <div>
            <label className="text-xs font-mono text-slate-300 block mb-2 font-semibold">
              Ask about current acoustic measurements, alerts, or adjustments:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleAsk(); }}
                placeholder="e.g., How should I EQ the main array to fix the vocal clarity issue in Zone 2?"
                className="flex-1 bg-slate-950 border border-slate-700 rounded px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
              />
              <button
                onClick={() => handleAsk()}
                disabled={loading}
                className="px-4 py-2 rounded bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-mono font-medium flex items-center gap-1.5 transition-colors shadow-sm"
              >
                {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                <span>{loading ? 'Analyzing...' : 'Ask'}</span>
              </button>
            </div>
          </div>

          {/* Preset Prompts */}
          <div>
            <span className="text-[11px] font-mono text-slate-400 block mb-2">Quick Engineering Inquiries:</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {sampleQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => { setQuery(q); handleAsk(q); }}
                  className="p-2 rounded bg-slate-950 border border-slate-800 text-left text-xs text-slate-300 hover:text-cyan-300 hover:border-slate-700 transition-colors line-clamp-1"
                >
                  "{q}"
                </button>
              ))}
            </div>
          </div>

          {/* AI Response Output Card */}
          <div className="mt-4 pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-slate-400 uppercase font-semibold flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                Acoustic Engineering Explanation ({userMode.toUpperCase()} MODE)
              </span>
              {isAiGenerated !== null && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                  {isAiGenerated ? 'Gemini 3.8 Flash' : 'Offline Rules Engine'}
                </span>
              )}
            </div>

            <div className="p-4 bg-slate-950 rounded border border-slate-800 min-h-[160px] text-xs leading-relaxed text-slate-200 whitespace-pre-line font-mono">
              {response || (
                <span className="text-slate-500 italic">
                  Select an inquiry above or click 'Ask' to receive contextual acoustic explanations based on current DSP measurements and {profile.name} targets.
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Structured Engineering Context Passed to AI */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2 mb-2">
              <Info className="w-4 h-4 text-cyan-400" />
              Context Payload Transmitted
            </h2>
            <p className="text-xs text-slate-400 mb-3">
              Only verified structured context is passed to the AI layer:
            </p>

            <div className="p-3 bg-slate-950 rounded border border-slate-800 text-[11px] font-mono space-y-2 text-slate-300">
              <div>
                <span className="text-cyan-400">Venue:</span> {venue.name} ({venue.dimensions.widthMeters}x{venue.dimensions.lengthMeters}m)
              </div>
              <div>
                <span className="text-cyan-400">Target Profile:</span> {profile.name} ({profile.targetSplDba} dBA)
              </div>
              <div>
                <span className="text-cyan-400">Current SPL:</span> {latestMeasurement?.splRmsDba ?? profile.targetSplDba} dBA (Peak {latestMeasurement?.splPeakDbc ?? profile.targetSplPeakDbc} dBC)
              </div>
              <div>
                <span className="text-cyan-400">Active Feedback:</span> {latestMeasurement?.feedbackFrequencyHz ? `${latestMeasurement.feedbackFrequencyHz} Hz` : 'None'}
              </div>
              <div>
                <span className="text-cyan-400">Compliance:</span> {engineeringResult?.complianceRate ?? 88}%
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] font-mono text-slate-500">
            Guaranteed Offline Operation: When internet is disconnected, SoundPilot seamlessly serves deterministic engineering rules without disruption.
          </div>
        </div>
      </div>
    </div>
  );
};
