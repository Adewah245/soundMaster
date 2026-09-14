import React, { useState } from 'react';
import { ConnectionDevice, EquipmentItem, SignalChainNode } from '../types';
import { 
  Layers, 
  Cpu, 
  Wifi, 
  Radio, 
  CheckCircle2, 
  AlertCircle, 
  VolumeX, 
  Volume2, 
  ArrowRight, 
  Sliders,
  Server
} from 'lucide-react';

interface EquipmentViewProps {
  equipment: EquipmentItem[];
  signalChain: SignalChainNode[];
  connections: ConnectionDevice[];
  onToggleMuteNode: (nodeId: string) => void;
}

export const EquipmentView: React.FC<EquipmentViewProps> = ({
  equipment,
  signalChain,
  connections,
  onToggleMuteNode
}) => {
  const [selectedEq, setSelectedEq] = useState<EquipmentItem | null>(equipment[0] || null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-400" />
              Electroacoustic Equipment & Signal Topology
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              End-to-end signal integrity tracking from physical transducers to power amplification stages.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              All 6 Signal Nodes Locked
            </span>
          </div>
        </div>
      </div>

      {/* Signal Chain Interactive Flowchart */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
        <h2 className="text-sm font-bold text-white uppercase font-mono tracking-wider mb-4 flex items-center gap-2">
          <Cpu className="w-4 h-4 text-cyan-400" />
          Active Audio Signal Flow
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-3 relative">
          {signalChain.map((node, idx) => {
            const eq = equipment.find(e => e.id === node.equipmentId);
            return (
              <div
                key={node.id}
                className={`p-3.5 rounded border flex flex-col justify-between transition-all ${
                  node.isMuted
                    ? 'bg-rose-950/30 border-rose-800/80 opacity-70'
                    : 'bg-slate-950 border-slate-800 hover:border-cyan-500/50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">
                      Stage 0{node.order}
                    </span>
                    <button
                      onClick={() => onToggleMuteNode(node.id)}
                      className={`p-1 rounded ${
                        node.isMuted ? 'text-rose-400 bg-rose-950' : 'text-slate-400 hover:text-slate-200'
                      }`}
                      title={node.isMuted ? 'Unmute Node' : 'Mute Node'}
                    >
                      {node.isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <h3 className="text-xs font-bold text-white leading-snug">{node.name}</h3>
                  <p className="text-[10px] font-mono text-slate-400 mt-0.5 truncate">{eq?.model || 'Generic Device'}</p>
                </div>

                <div className="mt-4 pt-2 border-t border-slate-800/80 text-[11px] font-mono flex items-center justify-between">
                  <span className="text-slate-500">In: {node.inputLevelDb}dB</span>
                  <span className={node.outputLevelDb > 0 ? 'text-amber-400 font-bold' : 'text-slate-300'}>
                    Out: {node.outputLevelDb}dB
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Equipment Inventory & Network Adapters */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Equipment Roster */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
              <Server className="w-4 h-4 text-cyan-400" />
              Registered Equipment Inventory ({equipment.length})
            </h2>
            <span className="text-xs font-mono text-slate-400">Lake LM44 • Powersoft X8 • d&b SL</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[420px] overflow-y-auto pr-1 scrollbar-thin">
            {equipment.map((item) => {
              const isSelected = selectedEq?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedEq(item)}
                  className={`p-3 rounded border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-950 border-cyan-500/60 ring-1 ring-cyan-500/20'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 uppercase">{item.category}</span>
                      <h3 className="text-xs font-bold text-white">{item.name}</h3>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                      {item.status.toUpperCase()}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{item.model}</p>

                  <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span>{item.manufacturer}</span>
                    <span className="uppercase text-cyan-400">{item.connectionType.replace('_', ' ')}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Connectivity Adapters & Protocols */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2 mb-2">
              <Wifi className="w-4 h-4 text-cyan-400" />
              Hardware Adapters & Ports
            </h2>
            <p className="text-xs text-slate-400 mb-4">
              Manufacturer-independent connection protocol bridge.
            </p>

            <div className="space-y-3">
              {connections.map((dev) => (
                <div key={dev.id} className="p-3 bg-slate-950 border border-slate-800 rounded text-xs font-mono space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{dev.name}</span>
                    <span className="text-emerald-400 text-[10px] uppercase">{dev.status}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400 text-[11px]">
                    <span>{dev.protocol}</span>
                    <span className="text-cyan-400">{dev.latencyMs} ms latency</span>
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Rate: {dev.sampleRateKhz}kHz • Buffer: {dev.bufferSize} spls
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] font-mono text-slate-500">
            Section 26: Device-specific protocols are isolated in adapter modules to prevent manufacturer lock-in.
          </div>
        </div>
      </div>
    </div>
  );
};
