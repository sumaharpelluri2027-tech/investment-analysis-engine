import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ReferenceLine,
} from 'recharts';

export interface OpportunityPoint {
  id: string;
  name: string;
  ticker: string;
  confidence: number; // % (0-100)
  expectedRoi: number; // % (0-50)
  arr: string;
  verdict: 'BUY' | 'HOLD' | 'PASS';
  sector: string;
  isPrimaryTarget?: boolean;
}

const OPPORTUNITY_DATA: OpportunityPoint[] = [
  {
    id: 'ntg',
    name: 'Nexus Technologies Group',
    ticker: 'NTG',
    confidence: 94,
    expectedRoi: 38.5,
    arr: '$42.5M',
    verdict: 'BUY',
    sector: 'Enterprise SaaS & AI',
    isPrimaryTarget: true,
  },
  {
    id: 'csl',
    name: 'CloudScale Logic',
    ticker: 'CSL',
    confidence: 96,
    expectedRoi: 42.0,
    arr: '$64.2M',
    verdict: 'BUY',
    sector: 'Cloud Optimization',
  },
  {
    id: 'csai',
    name: 'CyberShield AI',
    ticker: 'CSAI',
    confidence: 89,
    expectedRoi: 34.0,
    arr: '$28.1M',
    verdict: 'BUY',
    sector: 'Cybersecurity',
  },
  {
    id: 'fb',
    name: 'Frontier Bio AI',
    ticker: 'FBA',
    confidence: 62,
    expectedRoi: 46.0,
    arr: '$12.0M',
    verdict: 'HOLD',
    sector: 'HealthTech & Bio',
  },
  {
    id: 'dpa',
    name: 'DataPulse Analytics',
    ticker: 'DPA',
    confidence: 76,
    expectedRoi: 18.2,
    arr: '$19.4M',
    verdict: 'HOLD',
    sector: 'Data Infrastructure',
  },
  {
    id: 'aqh',
    name: 'Apex Quantum Health',
    ticker: 'AQH',
    confidence: 72,
    expectedRoi: 14.5,
    arr: '$55.0M',
    verdict: 'HOLD',
    sector: 'HealthTech',
  },
  {
    id: 'lsc',
    name: 'Legacy Software Corp',
    ticker: 'LSC',
    confidence: 54,
    expectedRoi: 8.0,
    arr: '$32.0M',
    verdict: 'PASS',
    sector: 'Legacy Tech',
  },
];

interface RiskRewardMatrixProps {
  onSelectEntity?: (name: string) => void;
}

export const RiskRewardMatrix: React.FC<RiskRewardMatrixProps> = ({ onSelectEntity }) => {
  const [selectedEntity, setSelectedEntity] = useState<OpportunityPoint>(OPPORTUNITY_DATA[0]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data: OpportunityPoint = payload[0].payload;
      return (
        <div className="bg-[#141820]/95 backdrop-blur-md border border-[#4edea3]/40 p-3.5 rounded-xl shadow-2xl font-[#Geist] text-xs space-y-2 min-w-[220px] z-50">
          <div className="flex items-center justify-between border-b border-[#1E293B] pb-2">
            <div>
              <span className="font-bold text-[#e2e2e2] text-sm block">{data.name}</span>
              <span className="text-[10px] text-[#909095]">{data.ticker} • {data.sector}</span>
            </div>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                data.verdict === 'BUY'
                  ? 'bg-[#4edea3]/20 text-[#4edea3] border border-[#4edea3]/40'
                  : data.verdict === 'HOLD'
                  ? 'bg-[#FBBC05]/20 text-[#FBBC05] border border-[#FBBC05]/40'
                  : 'bg-[#ffb4ab]/20 text-[#ffb4ab] border border-[#ffb4ab]/40'
              }`}
            >
              {data.verdict}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
            <div>
              <span className="text-[#909095] block">AI Confidence:</span>
              <span className="font-bold text-[#4edea3]">{data.confidence}%</span>
            </div>
            <div>
              <span className="text-[#909095] block">Expected 3Yr ROI:</span>
              <span className="font-bold text-[#6ffbbe]">+{data.expectedRoi}%</span>
            </div>
            <div>
              <span className="text-[#909095] block">Current ARR:</span>
              <span className="font-bold text-[#e2e2e2]">{data.arr}</span>
            </div>
            <div>
              <span className="text-[#909095] block">Matrix Position:</span>
              <span className="font-bold text-[#c6c6cb]">
                {data.confidence >= 75 && data.expectedRoi >= 25
                  ? 'Prime Buy'
                  : data.confidence < 75 && data.expectedRoi >= 25
                  ? 'Speculative'
                  : data.confidence >= 75 && data.expectedRoi < 25
                  ? 'Stable Yield'
                  : 'Pass / Avoid'}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-panel rounded-xl p-6 space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4edea3] text-lg">grid_view</span>
            <h3 className="text-lg font-[#Hanken Grotesk] font-bold text-[#e2e2e2]">
              Risk vs. Reward Positioning Matrix (2x2)
            </h3>
          </div>
          <p className="text-body-md font-[#Inter] text-[#c6c6cb] mt-0.5">
            Plotting portfolio opportunities across Gemini AI Model Confidence vs. Expected 3-Year ROI
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-[#Geist] text-[#909095]">Quadrant Key:</span>
          <span className="px-2 py-1 rounded bg-[#4edea3]/10 text-[#4edea3] text-[10px] font-[#Geist] font-semibold border border-[#4edea3]/20">
            Prime Buy (&gt;75% Conf, &gt;25% ROI)
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Matrix Visualization Chart */}
        <div className="lg:col-span-8 h-80 w-full relative">
          {/* Quadrant Background Overlay Labels */}
          <div className="absolute inset-0 pointer-events-none grid grid-cols-2 grid-rows-2 font-[#Geist] text-[10px] font-bold uppercase tracking-wider p-8">
            <div className="text-[#FBBC05]/30 p-2 flex items-start justify-start">
              High Risk / Speculative (High ROI, Low Conf)
            </div>
            <div className="text-[#4edea3]/40 p-2 flex items-start justify-end text-right">
              ★ PRIME TARGET OPPORTUNITIES (BUY)
            </div>
            <div className="text-[#ffb4ab]/30 p-2 flex items-end justify-start">
              PASS / HIGH FRICTION (Low ROI, Low Conf)
            </div>
            <div className="text-[#4285F4]/30 p-2 flex items-end justify-end text-right">
              SAFE YIELD / STABLE (Low ROI, High Conf)
            </div>
          </div>

          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 30, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
              <XAxis
                type="number"
                dataKey="confidence"
                name="AI Confidence"
                unit="%"
                domain={[40, 100]}
                stroke="#909095"
                tick={{ fill: '#c6c6cb', fontSize: 11 }}
                label={{
                  value: 'Gemini AI Confidence Score (%) →',
                  position: 'bottom',
                  offset: 15,
                  fill: '#909095',
                  fontSize: 11,
                }}
              />
              <YAxis
                type="number"
                dataKey="expectedRoi"
                name="Expected 3Yr ROI"
                unit="%"
                domain={[0, 50]}
                stroke="#909095"
                tick={{ fill: '#c6c6cb', fontSize: 11 }}
                label={{
                  value: 'Expected 3-Year ROI (%) ↑',
                  angle: -90,
                  position: 'insideLeft',
                  offset: 10,
                  fill: '#909095',
                  fontSize: 11,
                }}
              />
              <ZAxis type="number" range={[180, 400]} />

              {/* 2x2 Quadrant Dividers */}
              <ReferenceLine x={75} stroke="#4edea3" strokeDasharray="4 4" opacity={0.6} />
              <ReferenceLine y={25} stroke="#4edea3" strokeDasharray="4 4" opacity={0.6} />

              <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />

              <Scatter
                name="Opportunities"
                data={OPPORTUNITY_DATA}
                onClick={(node) => {
                  if (node && node.payload) {
                    setSelectedEntity(node.payload);
                    if (onSelectEntity) onSelectEntity(node.payload.name);
                  }
                }}
                className="cursor-pointer"
              >
                {OPPORTUNITY_DATA.map((entry, index) => {
                  let fill = '#FBBC05'; // Hold / Speculative
                  if (entry.verdict === 'BUY') fill = '#4edea3';
                  if (entry.verdict === 'PASS') fill = '#ffb4ab';

                  const isSelected = selectedEntity.id === entry.id;

                  return (
                    <Cell
                      key={`cell-${index}`}
                      fill={fill}
                      stroke={isSelected || entry.isPrimaryTarget ? '#ffffff' : fill}
                      strokeWidth={isSelected || entry.isPrimaryTarget ? 3 : 1}
                      className="transition-all duration-200 hover:scale-125"
                    />
                  );
                })}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* Selected Entity Inspector Side Panel */}
        <div className="lg:col-span-4 bg-[#0b0e14] border border-[#1E293B] rounded-xl p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-[#1E293B] pb-3">
            <div>
              <span className="font-[#Geist] text-[10px] text-[#4edea3] uppercase font-bold tracking-wider">
                Active Selection
              </span>
              <h4 className="font-[#Hanken Grotesk] font-bold text-lg text-[#e2e2e2]">
                {selectedEntity.name}
              </h4>
            </div>
            <span
              className={`px-2.5 py-0.5 rounded text-xs font-bold uppercase ${
                selectedEntity.verdict === 'BUY'
                  ? 'bg-[#4edea3]/20 text-[#4edea3] border border-[#4edea3]/40'
                  : selectedEntity.verdict === 'HOLD'
                  ? 'bg-[#FBBC05]/20 text-[#FBBC05] border border-[#FBBC05]/40'
                  : 'bg-[#ffb4ab]/20 text-[#ffb4ab] border border-[#ffb4ab]/40'
              }`}
            >
              {selectedEntity.verdict}
            </span>
          </div>

          <div className="space-y-2 text-xs font-[#Geist]">
            <div className="flex justify-between py-1 border-b border-[#1E293B]/50">
              <span className="text-[#909095]">Ticker & Sector:</span>
              <span className="text-[#e2e2e2] font-semibold">{selectedEntity.ticker} • {selectedEntity.sector}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#1E293B]/50">
              <span className="text-[#909095]">Model Confidence:</span>
              <span className="text-[#4edea3] font-bold">{selectedEntity.confidence}%</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#1E293B]/50">
              <span className="text-[#909095]">Expected 3-Yr ROI:</span>
              <span className="text-[#6ffbbe] font-bold">+{selectedEntity.expectedRoi}%</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[#909095]">Current ARR:</span>
              <span className="text-[#e2e2e2] font-semibold">{selectedEntity.arr}</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => onSelectEntity && onSelectEntity(selectedEntity.name)}
              className="w-full bg-[#282a2b] hover:bg-[#4edea3] hover:text-[#003824] text-[#e2e2e2] font-[#Hanken Grotesk] font-bold text-xs py-2.5 px-4 rounded transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Load Full Institutional Dossier</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
