import React, { useState } from 'react';
import { ArchitectureRecord } from '../types';
import { INITIAL_ADRS } from '../data/initialData';
import { 
  FolderTree, 
  FileText, 
  Layers, 
  ShieldCheck, 
  Cpu, 
  Database, 
  Radio, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  Volume2
} from 'lucide-react';

export const ArchitectureExplorerView: React.FC = () => {
  const [selectedAdr, setSelectedAdr] = useState<ArchitectureRecord>(INITIAL_ADRS[0]);
  const [activeSection, setActiveSection] = useState<'tree' | 'flow' | 'adrs' | 'boundaries'>('flow');

  const fileTree = [
    { name: 'docs/', type: 'folder', desc: 'Architecture, engineering targets, measurement specs, equipment models' },
    { name: 'frontend/', type: 'folder', desc: 'User interface, visualization, venue maps, Simple & Pro modes' },
    { name: 'backend/ (Go)', type: 'folder', desc: 'Application orchestration, engineering engine, domain rules, storage' },
    { name: 'dsp/ (Python)', type: 'folder', desc: 'Audio capture, FFT spectrum, RTA, feedback detection, RT60 decay' },
    { name: 'database/', type: 'folder', desc: 'Local persistence, schema migrations, reference engineering seeds' },
    { name: 'configs/', type: 'folder', desc: 'Engineering tolerances, acoustic target curves, device profiles' },
    { name: 'data/', type: 'folder', desc: 'Local acoustic measurements, session history, verification snapshots' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">SoundPilot Specification</span>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs text-slate-400 font-mono">STRUCTURE.md Blueprint</span>
            </div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <FolderTree className="w-5 h-5 text-cyan-400" />
              System Architecture & Decision Records
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              "One responsibility should have one clear home. Measure first, understand context second, apply engineering rules third, and use AI only as an assistant."
            </p>
          </div>

          {/* Section Pills */}
          <div className="flex items-center rounded border border-slate-800 bg-slate-950 p-1 text-xs font-mono">
            {[
              { id: 'flow', label: 'Data Flow' },
              { id: 'boundaries', label: 'Boundary Laws' },
              { id: 'adrs', label: 'ADR Records' },
              { id: 'tree', label: 'Directory Tree' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id as any)}
                className={`px-3 py-1.5 rounded transition-colors ${
                  activeSection === tab.id
                    ? 'bg-cyan-600 text-white font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content based on selected tab */}
      {activeSection === 'flow' && (
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-6">
          <h2 className="text-base font-bold text-white font-mono flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            Core Acoustic Data Flow & Authority Chain
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-center text-xs font-mono">
            {/* Step 1 */}
            <div className="p-4 rounded bg-slate-950 border border-cyan-500/40 text-cyan-300">
              <Volume2 className="w-6 h-6 mx-auto mb-2 text-cyan-400" />
              <span className="text-[10px] text-slate-500 block uppercase">Layer 01</span>
              <span className="font-bold text-sm block mt-1">AUDIO INPUT</span>
              <p className="text-[11px] text-slate-400 mt-1">Mic, Pink Noise, Sine Sweep, USB / Dante</p>
            </div>

            {/* Step 2 */}
            <div className="p-4 rounded bg-slate-950 border border-slate-800 text-slate-200">
              <Cpu className="w-6 h-6 mx-auto mb-2 text-cyan-400" />
              <span className="text-[10px] text-slate-500 block uppercase">Layer 02</span>
              <span className="font-bold text-sm block mt-1">PYTHON DSP</span>
              <p className="text-[11px] text-slate-400 mt-1">FFT, 31-Band RTA, Peak/RMS, THD, RT60, STI</p>
            </div>

            {/* Step 3 */}
            <div className="p-4 rounded bg-slate-950 border border-slate-800 text-slate-200">
              <ShieldCheck className="w-6 h-6 mx-auto mb-2 text-emerald-400" />
              <span className="text-[10px] text-slate-500 block uppercase">Layer 03</span>
              <span className="font-bold text-sm block mt-1">GO ORCHESTRATION</span>
              <p className="text-[11px] text-slate-400 mt-1">Venue context, equipment state, local storage</p>
            </div>

            {/* Step 4 */}
            <div className="p-4 rounded bg-slate-950 border border-emerald-500/40 text-emerald-300">
              <CheckCircle2 className="w-6 h-6 mx-auto mb-2 text-emerald-400" />
              <span className="text-[10px] text-slate-500 block uppercase">Layer 04</span>
              <span className="font-bold text-sm block mt-1">ENGINEERING ENGINE</span>
              <p className="text-[11px] text-slate-400 mt-1">Tolerance evaluation, verification state, system impact</p>
            </div>

            {/* Step 5 */}
            <div className="p-4 rounded bg-slate-950 border border-purple-500/30 text-purple-300">
              <Sparkles className="w-6 h-6 mx-auto mb-2 text-purple-400" />
              <span className="text-[10px] text-slate-500 block uppercase">Layer 05 (Optional)</span>
              <span className="font-bold text-sm block mt-1">AI EXPLANATION</span>
              <p className="text-[11px] text-slate-400 mt-1">Actionable physical tuning guidance for operators</p>
            </div>
          </div>
        </div>
      )}

      {activeSection === 'boundaries' && (
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-4">
          <h2 className="text-base font-bold text-white font-mono flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            Section 47: The Four Boundary Laws of SoundPilot
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-4 rounded bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-cyan-400 font-bold text-sm">1. PYTHON DSP ENGINE</span>
              <p className="text-slate-300 italic text-sm">"What did we measure?"</p>
              <p className="text-slate-400 text-[11px] mt-1">Produces pure, objective mathematical audio features. Has zero opinion on venue aesthetics or target profiles.</p>
            </div>

            <div className="p-4 rounded bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-cyan-400 font-bold text-sm">2. GO APPLICATION LAYER</span>
              <p className="text-slate-300 italic text-sm">"What does this measurement mean in this context?"</p>
              <p className="text-slate-400 text-[11px] mt-1">Binds measurements to specific venue zones, seat locations, and active equipment signal chains.</p>
            </div>

            <div className="p-4 rounded bg-slate-950 border border-emerald-500/30 space-y-1">
              <span className="text-emerald-400 font-bold text-sm">3. ENGINEERING ENGINE</span>
              <p className="text-slate-300 italic text-sm">"Is this within the defined engineering target?"</p>
              <p className="text-slate-400 text-[11px] mt-1">Applies strict acoustic tolerances (±2dB), evaluates system-wide impact, and determines if re-verification is required.</p>
            </div>

            <div className="p-4 rounded bg-slate-950 border border-purple-500/30 space-y-1">
              <span className="text-purple-400 font-bold text-sm">4. SOUNDPILOT AI</span>
              <p className="text-slate-300 italic text-sm">"How can we explain this clearly to the user?"</p>
              <p className="text-slate-400 text-[11px] mt-1">Translates engineering conclusions into plain or pro language. Strictly forbidden from guessing raw audio measurements.</p>
            </div>
          </div>
        </div>
      )}

      {activeSection === 'adrs' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ADR List */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
            <h2 className="text-sm font-bold text-white uppercase font-mono tracking-wider mb-3">
              Architecture Decision Records
            </h2>
            <div className="space-y-2">
              {INITIAL_ADRS.map((adr) => {
                const isSelected = selectedAdr.id === adr.id;
                return (
                  <div
                    key={adr.id}
                    onClick={() => setSelectedAdr(adr)}
                    className={`p-3 rounded border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-slate-950 border-cyan-500 text-cyan-300'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-mono font-bold">
                      <span>{adr.id}</span>
                      <span className="text-[10px] text-emerald-400 uppercase">{adr.status}</span>
                    </div>
                    <p className="text-xs font-medium text-white mt-1">{adr.title}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected ADR Detail */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-xs font-mono text-cyan-400 font-bold">{selectedAdr.id}</span>
                <h3 className="text-lg font-bold text-white">{selectedAdr.title}</h3>
              </div>
              <span className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-mono font-bold">
                {selectedAdr.status}
              </span>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <div>
                <span className="text-slate-500 uppercase block mb-1">Context</span>
                <p className="text-slate-300 leading-relaxed bg-slate-950 p-3 rounded border border-slate-800">
                  {selectedAdr.context}
                </p>
              </div>

              <div>
                <span className="text-slate-500 uppercase block mb-1">Decision</span>
                <p className="text-slate-200 font-semibold leading-relaxed bg-slate-950 p-3 rounded border border-slate-800">
                  {selectedAdr.decision}
                </p>
              </div>

              <div>
                <span className="text-slate-500 uppercase block mb-1">Consequences</span>
                <p className="text-emerald-300 leading-relaxed bg-slate-950 p-3 rounded border border-slate-800">
                  {selectedAdr.consequences}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSection === 'tree' && (
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-4">
          <h2 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
            SoundPilot Directory Tree & Responsibilities
          </h2>
          <div className="space-y-2">
            {fileTree.map((item) => (
              <div key={item.name} className="p-3 bg-slate-950 border border-slate-800 rounded text-xs font-mono flex items-center justify-between">
                <span className="font-bold text-cyan-300">{item.name}</span>
                <span className="text-slate-400 text-[11px]">{item.desc}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
