import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

export interface SectorRiskCell {
  sector: string;
  category: string;
  densityScore: number; // 0 - 100
  riskCount: number;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  topFactor: string;
  trend6mo: number[]; // 6-month historical moving average trajectory
}

const SECTORS = [
  'Enterprise SaaS & AI',
  'Cloud Infrastructure',
  'Cybersecurity & SecOps',
  'FinTech & Payments',
  'HealthTech & Bio',
  'Data Analytics',
];

const RISK_CATEGORIES = [
  'Pipeline & Sales Friction',
  'Procurement & Security',
  'Valuation Compression',
  'Talent & Vesting Cliffs',
  'Customer Concentration',
];

const MONTH_LABELS = ['M1 (May)', 'M2 (Jun)', 'M3 (Jul)', 'M4 (Aug)', 'M5 (Sep)', 'Current (Oct)'];

const HEATMAP_DATA: SectorRiskCell[] = [
  // Enterprise SaaS & AI
  { sector: 'Enterprise SaaS & AI', category: 'Pipeline & Sales Friction', densityScore: 78, riskCount: 4, severity: 'High', topFactor: 'Enterprise close cycle expanded from 45 to 62 days in Q3', trend6mo: [52, 58, 63, 68, 72, 78] },
  { sector: 'Enterprise SaaS & AI', category: 'Procurement & Security', densityScore: 42, riskCount: 2, severity: 'Medium', topFactor: 'Secondary SOC2 Type II audit delays for government deals', trend6mo: [35, 38, 36, 40, 41, 42] },
  { sector: 'Enterprise SaaS & AI', category: 'Valuation Compression', densityScore: 25, riskCount: 1, severity: 'Low', topFactor: 'ARR growth at 34.8% cushions multiple compression', trend6mo: [40, 36, 32, 28, 26, 25] },
  { sector: 'Enterprise SaaS & AI', category: 'Talent & Vesting Cliffs', densityScore: 88, riskCount: 5, severity: 'Critical', topFactor: 'VP Engineering & Lead Architect vesting cliff Q4 2026', trend6mo: [60, 68, 74, 80, 84, 88] },
  { sector: 'Enterprise SaaS & AI', category: 'Customer Concentration', densityScore: 30, riskCount: 1, severity: 'Low', topFactor: 'Top 3 customers account for 18.5% ARR (safe <25%)', trend6mo: [25, 28, 27, 29, 30, 30] },

  // Cloud Infrastructure
  { sector: 'Cloud Infrastructure', category: 'Pipeline & Sales Friction', densityScore: 35, riskCount: 2, severity: 'Low', topFactor: 'Hyperscaler co-sell programs accelerating pipeline', trend6mo: [45, 42, 40, 38, 36, 35] },
  { sector: 'Cloud Infrastructure', category: 'Procurement & Security', densityScore: 65, riskCount: 3, severity: 'Medium', topFactor: 'ISO 27001 renewal pending for European region', trend6mo: [50, 52, 55, 58, 62, 65] },
  { sector: 'Cloud Infrastructure', category: 'Valuation Compression', densityScore: 50, riskCount: 2, severity: 'Medium', topFactor: 'Hardware expenditure margin pressures in Q2', trend6mo: [42, 45, 46, 48, 49, 50] },
  { sector: 'Cloud Infrastructure', category: 'Talent & Vesting Cliffs', densityScore: 40, riskCount: 2, severity: 'Medium', topFactor: 'DevOps team expansion competition in US-East', trend6mo: [30, 32, 35, 38, 39, 40] },
  { sector: 'Cloud Infrastructure', category: 'Customer Concentration', densityScore: 72, riskCount: 4, severity: 'High', topFactor: 'Largest cloud host provider generates 28% of usage volume', trend6mo: [55, 60, 64, 68, 70, 72] },

  // Cybersecurity & SecOps
  { sector: 'Cybersecurity & SecOps', category: 'Pipeline & Sales Friction', densityScore: 20, riskCount: 1, severity: 'Low', topFactor: 'CISO urgency driving fast 30-day proof-of-concept cycles', trend6mo: [32, 28, 25, 22, 21, 20] },
  { sector: 'Cybersecurity & SecOps', category: 'Procurement & Security', densityScore: 15, riskCount: 1, severity: 'Low', topFactor: 'FedRAMP Moderate clearance achieved ahead of schedule', trend6mo: [28, 25, 20, 18, 16, 15] },
  { sector: 'Cybersecurity & SecOps', category: 'Valuation Compression', densityScore: 60, riskCount: 3, severity: 'Medium', topFactor: 'Public peer multiples pulled back from 12x to 8.5x', trend6mo: [75, 72, 68, 65, 62, 60] },
  { sector: 'Cybersecurity & SecOps', category: 'Talent & Vesting Cliffs', densityScore: 55, riskCount: 3, severity: 'Medium', topFactor: 'SecOps threat intelligence research staff turnover', trend6mo: [45, 48, 50, 52, 54, 55] },
  { sector: 'Cybersecurity & SecOps', category: 'Customer Concentration', densityScore: 22, riskCount: 1, severity: 'Low', topFactor: 'Broad enterprise distribution across 295 accounts', trend6mo: [20, 21, 22, 21, 22, 22] },

  // FinTech & Payments
  { sector: 'FinTech & Payments', category: 'Pipeline & Sales Friction', densityScore: 82, riskCount: 4, severity: 'Critical', topFactor: 'Banking partner underwriting delays on new credit corridors', trend6mo: [62, 68, 72, 76, 79, 82] },
  { sector: 'FinTech & Payments', category: 'Procurement & Security', densityScore: 92, riskCount: 6, severity: 'Critical', topFactor: 'PCI-DSS v4.0 compliance overhaul required by Q1', trend6mo: [75, 80, 84, 88, 90, 92] },
  { sector: 'FinTech & Payments', category: 'Valuation Compression', densityScore: 70, riskCount: 4, severity: 'High', topFactor: 'Interest rate sensitivity impacting transaction yield margins', trend6mo: [55, 58, 62, 65, 68, 70] },
  { sector: 'FinTech & Payments', category: 'Talent & Vesting Cliffs', densityScore: 32, riskCount: 2, severity: 'Low', topFactor: 'Stable engineering team retention with low attrition', trend6mo: [40, 38, 36, 34, 33, 32] },
  { sector: 'FinTech & Payments', category: 'Customer Concentration', densityScore: 48, riskCount: 2, severity: 'Medium', topFactor: 'Top payment gateway processor handles 34% volume', trend6mo: [40, 42, 44, 45, 46, 48] },

  // HealthTech & Bio
  { sector: 'HealthTech & Bio', category: 'Pipeline & Sales Friction', densityScore: 95, riskCount: 7, severity: 'Critical', topFactor: 'FDA SAMD clearance timeline extended by 6 months', trend6mo: [70, 76, 82, 88, 92, 95] },
  { sector: 'HealthTech & Bio', category: 'Procurement & Security', densityScore: 85, riskCount: 5, severity: 'Critical', topFactor: 'HIPAA Business Associate Agreement audits for health systems', trend6mo: [68, 72, 78, 81, 83, 85] },
  { sector: 'HealthTech & Bio', category: 'Valuation Compression', densityScore: 78, riskCount: 4, severity: 'High', topFactor: 'Biotech seed capital drawdown extending runway requirements', trend6mo: [60, 65, 70, 74, 76, 78] },
  { sector: 'HealthTech & Bio', category: 'Talent & Vesting Cliffs', densityScore: 68, riskCount: 3, severity: 'High', topFactor: 'Chief Medical Officer transition planned for late FY26', trend6mo: [50, 54, 58, 62, 65, 68] },
  { sector: 'HealthTech & Bio', category: 'Customer Concentration', densityScore: 80, riskCount: 5, severity: 'High', topFactor: 'Single major hospital network accounts for 42% revenue', trend6mo: [65, 70, 73, 76, 78, 80] },

  // Data Analytics
  { sector: 'Data Analytics', category: 'Pipeline & Sales Friction', densityScore: 45, riskCount: 2, severity: 'Medium', topFactor: 'Data warehouse migration inertia in mid-market accounts', trend6mo: [38, 40, 41, 42, 44, 45] },
  { sector: 'Data Analytics', category: 'Procurement & Security', densityScore: 30, riskCount: 1, severity: 'Low', topFactor: 'Standard GDPR / CCPA data residency compliance in place', trend6mo: [32, 31, 30, 30, 30, 30] },
  { sector: 'Data Analytics', category: 'Valuation Compression', densityScore: 38, riskCount: 2, severity: 'Low', topFactor: 'Sustained 28% YoY growth supporting current 7.5x multiple', trend6mo: [45, 42, 40, 39, 38, 38] },
  { sector: 'Data Analytics', category: 'Talent & Vesting Cliffs', densityScore: 42, riskCount: 2, severity: 'Medium', topFactor: 'Data science talent hiring lead times averaging 50 days', trend6mo: [35, 36, 38, 40, 41, 42] },
  { sector: 'Data Analytics', category: 'Customer Concentration', densityScore: 28, riskCount: 1, severity: 'Low', topFactor: 'Balanced ARR distribution across financial & retail clients', trend6mo: [30, 29, 28, 28, 28, 28] },
];

export const SectorRiskHeatmap: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedCell, setSelectedCell] = useState<SectorRiskCell | null>(HEATMAP_DATA[3]); // Default: SaaS Talent risk
  const [hoveredCell, setHoveredCell] = useState<SectorRiskCell | null>(null);
  const [filterSeverity, setFilterSeverity] = useState<'All' | 'Critical' | 'High' | 'Medium' | 'Low'>('All');
  const [showTrendLines, setShowTrendLines] = useState<boolean>(true);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    // Get container dimensions
    const containerWidth = containerRef.current.clientWidth || 700;
    const margin = { top: 80, right: 30, bottom: 40, left: 160 };
    const width = Math.max(containerWidth - margin.left - margin.right, 420);
    const height = 320;

    // Clear previous SVG contents
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    svg
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom);

    // Defs for gradients & filters
    const defs = svg.append('defs');

    const trendGradient = defs
      .append('linearGradient')
      .attr('id', 'trend-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    trendGradient.append('stop').attr('offset', '0%').attr('stop-color', '#ffffff').attr('stop-opacity', '0.4');
    trendGradient.append('stop').attr('offset', '100%').attr('stop-color', '#ffffff').attr('stop-opacity', '0.0');

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // D3 Scales
    const xScale = d3
      .scaleBand()
      .range([0, width])
      .domain(RISK_CATEGORIES)
      .padding(0.08);

    const yScale = d3
      .scaleBand()
      .range([0, height])
      .domain(SECTORS)
      .padding(0.08);

    // Color Interpolator: Green (Low) -> Amber (Med/High) -> Bright Red/Coral (Critical)
    const colorScale = d3
      .scaleSequential<string>()
      .domain([0, 100])
      .interpolator(d3.interpolateRgbBasis(['#0d2b1f', '#2a4d29', '#735114', '#9e3223', '#d93838']));

    // X Axis (Top Labels)
    const xAxis = g.append('g').call(d3.axisTop(xScale).tickSize(0));

    xAxis.select('.domain').remove();

    xAxis
      .selectAll('text')
      .style('fill', '#c6c6cb')
      .style('font-size', '10px')
      .style('font-family', 'Geist, sans-serif')
      .style('font-weight', '600')
      .attr('transform', 'rotate(-25)')
      .style('text-anchor', 'start')
      .attr('dx', '0.5em')
      .attr('dy', '-0.2em');

    // Y Axis (Left Sector Labels)
    const yAxis = g.append('g').call(d3.axisLeft(yScale).tickSize(0));

    yAxis.select('.domain').remove();

    yAxis
      .selectAll('text')
      .style('fill', '#e2e2e2')
      .style('font-size', '11px')
      .style('font-family', 'Geist, sans-serif')
      .style('font-weight', '600')
      .attr('dx', '-0.5em');

    // Filtered Cells
    const displayedData = filterSeverity === 'All'
      ? HEATMAP_DATA
      : HEATMAP_DATA.filter((d) => d.severity === filterSeverity);

    // Draw Heatmap Cells
    g.selectAll('.cell')
      .data(displayedData)
      .enter()
      .append('rect')
      .attr('class', 'cell')
      .attr('x', (d) => xScale(d.category) || 0)
      .attr('y', (d) => yScale(d.sector) || 0)
      .attr('width', xScale.bandwidth())
      .attr('height', yScale.bandwidth())
      .attr('rx', 6)
      .attr('ry', 6)
      .style('fill', (d) => colorScale(d.densityScore))
      .style('stroke', (d) =>
        selectedCell && selectedCell.sector === d.sector && selectedCell.category === d.category
          ? '#4edea3'
          : '#1E293B'
      )
      .style('stroke-width', (d) =>
        selectedCell && selectedCell.sector === d.sector && selectedCell.category === d.category
          ? 2.5
          : 1
      )
      .style('cursor', 'pointer')
      .style('transition', 'all 0.2s ease')
      .on('mouseover', (event, d) => {
        setHoveredCell(d);
        d3.select(event.currentTarget)
          .style('stroke', '#ffffff')
          .style('stroke-width', 2);
      })
      .on('mouseout', (event, d) => {
        setHoveredCell(null);
        d3.select(event.currentTarget)
          .style('stroke', selectedCell && selectedCell.sector === d.sector && selectedCell.category === d.category ? '#4edea3' : '#1E293B')
          .style('stroke-width', selectedCell && selectedCell.sector === d.sector && selectedCell.category === d.category ? 2.5 : 1);
      })
      .on('click', (event, d) => {
        setSelectedCell(d);
      });

    // Draw 6-Month Moving Average Historical Trend Lines if Enabled
    if (showTrendLines) {
      displayedData.forEach((d) => {
        const cellX = xScale(d.category) || 0;
        const cellY = yScale(d.sector) || 0;
        const bw = xScale.bandwidth();
        const bh = yScale.bandwidth();

        // Local Scales for cell sparkline overlay
        const subX = d3.scaleLinear().domain([0, 5]).range([cellX + 8, cellX + bw - 8]);
        const subY = d3.scaleLinear().domain([0, 100]).range([cellY + bh - 8, cellY + 8]);

        const areaGen = d3
          .area<number>()
          .x((_, i) => subX(i))
          .y0(cellY + bh - 6)
          .y1((val) => subY(val))
          .curve(d3.curveMonotoneX);

        const lineGen = d3
          .line<number>()
          .x((_, i) => subX(i))
          .y((val) => subY(val))
          .curve(d3.curveMonotoneX);

        // Sub Area Fill
        g.append('path')
          .datum(d.trend6mo)
          .attr('d', areaGen)
          .style('fill', 'url(#trend-gradient)')
          .style('opacity', 0.2)
          .style('pointer-events', 'none');

        // Sub Trend Line Path
        g.append('path')
          .datum(d.trend6mo)
          .attr('d', lineGen)
          .style('fill', 'none')
          .style('stroke', '#ffffff')
          .style('stroke-width', 1.8)
          .style('stroke-linecap', 'round')
          .style('pointer-events', 'none')
          .style('filter', 'drop-shadow(0px 1px 2px rgba(0,0,0,0.6))');

        // End Node Circle Dot
        const lastVal = d.trend6mo[5];
        g.append('circle')
          .attr('cx', subX(5))
          .attr('cy', subY(lastVal))
          .attr('r', 2.5)
          .style('fill', '#4edea3')
          .style('stroke', '#ffffff')
          .style('stroke-width', 1)
          .style('pointer-events', 'none');
      });
    }

    // Add cell numeric text overlay
    g.selectAll('.cell-text')
      .data(displayedData)
      .enter()
      .append('text')
      .attr('class', 'cell-text')
      .attr('x', (d) => (xScale(d.category) || 0) + xScale.bandwidth() / 2)
      .attr('y', (d) => (yScale(d.sector) || 0) + (showTrendLines ? 12 : yScale.bandwidth() / 2 + 4))
      .attr('text-anchor', 'middle')
      .style('fill', '#ffffff')
      .style('font-size', '10px')
      .style('font-family', 'Geist, sans-serif')
      .style('font-weight', '700')
      .style('pointer-events', 'none')
      .text((d) => `${d.densityScore}`);

  }, [filterSeverity, selectedCell, showTrendLines]);

  // Handle Window Resize
  useEffect(() => {
    const handleResize = () => {
      setFilterSeverity((prev) => prev);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const criticalCount = HEATMAP_DATA.filter((d) => d.severity === 'Critical').length;
  const highCount = HEATMAP_DATA.filter((d) => d.severity === 'High').length;
  const mediumCount = HEATMAP_DATA.filter((d) => d.severity === 'Medium').length;
  const lowCount = HEATMAP_DATA.filter((d) => d.severity === 'Low').length;

  const currentCell = hoveredCell || selectedCell;
  const trendDiff = currentCell
    ? currentCell.trend6mo[5] - currentCell.trend6mo[0]
    : 0;

  return (
    <div className="glass-panel rounded-xl p-6 space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E293B] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4edea3] text-lg">grid_on</span>
            <h3 className="text-lg font-[#Hanken Grotesk] font-bold text-[#e2e2e2]">
              D3 Cross-Sector Risk Density Heatmap
            </h3>
            <span className="px-2 py-0.5 rounded bg-[#4edea3]/10 text-[#4edea3] border border-[#4edea3]/20 font-[#Geist] text-[10px] font-semibold">
              D3 Engine v2.4
            </span>
          </div>
          <p className="text-body-md font-[#Inter] text-[#c6c6cb] mt-0.5">
            Identify risk concentrations, density clusters, and 6-month historical moving averages
          </p>
        </div>

        {/* Action Controls: Severity Filters + Trend Line Toggle */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Trend Line Overlay Toggle Button */}
          <button
            onClick={() => setShowTrendLines((prev) => !prev)}
            className={`px-3 py-1.5 rounded text-xs font-[#Geist] font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              showTrendLines
                ? 'bg-[#4285F4] text-white shadow-md border border-[#4285F4]'
                : 'bg-[#0b0e14] border border-[#1E293B] text-[#c6c6cb] hover:text-[#e2e2e2]'
            }`}
            title="Toggle 6-month moving average trend lines on heatmap cells"
          >
            <span className="material-symbols-outlined text-sm">show_chart</span>
            <span>6-Mo Moving Avg Lines: {showTrendLines ? 'ON' : 'OFF'}</span>
          </button>

          {/* Severity Filter Controls */}
          <div className="flex items-center gap-1 bg-[#0b0e14] p-1 rounded-lg border border-[#1E293B]">
            {(['All', 'Critical', 'High', 'Medium', 'Low'] as const).map((sev) => (
              <button
                key={sev}
                onClick={() => setFilterSeverity(sev)}
                className={`px-2.5 py-1 rounded text-xs font-[#Geist] font-semibold transition-all cursor-pointer ${
                  filterSeverity === sev
                    ? 'bg-[#4edea3] text-[#003824] shadow'
                    : 'text-[#c6c6cb] hover:text-[#e2e2e2]'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Density Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#0b0e14] border border-[#d93838]/40 rounded-lg p-3">
          <div className="flex justify-between items-center">
            <span className="text-[10px] uppercase tracking-wider text-[#909095] block font-[#Geist]">
              Critical Density Clusters
            </span>
            <span className="w-2 h-2 rounded-full bg-[#d93838] animate-pulse"></span>
          </div>
          <span className="text-xl font-bold text-[#ffb4ab] font-[#Hanken Grotesk]">
            {criticalCount} Sectors
          </span>
          <span className="text-[10px] text-[#c6c6cb] block">Score &gt;80/100 Vulnerability</span>
        </div>

        <div className="bg-[#0b0e14] border border-[#9e3223]/40 rounded-lg p-3">
          <span className="text-[10px] uppercase tracking-wider text-[#909095] block font-[#Geist]">
            High Vulnerability
          </span>
          <span className="text-xl font-bold text-[#FBBC05] font-[#Hanken Grotesk]">
            {highCount} Sectors
          </span>
          <span className="text-[10px] text-[#c6c6cb] block">Score 65-79 Vulnerability</span>
        </div>

        <div className="bg-[#0b0e14] border border-[#735114]/40 rounded-lg p-3">
          <span className="text-[10px] uppercase tracking-wider text-[#909095] block font-[#Geist]">
            Moderate Monitor
          </span>
          <span className="text-xl font-bold text-[#e2e2e2] font-[#Hanken Grotesk]">
            {mediumCount} Sectors
          </span>
          <span className="text-[10px] text-[#c6c6cb] block">Score 40-64 Vulnerability</span>
        </div>

        <div className="bg-[#0b0e14] border border-[#4edea3]/40 rounded-lg p-3">
          <span className="text-[10px] uppercase tracking-wider text-[#909095] block font-[#Geist]">
            Low Risk Safe Zones
          </span>
          <span className="text-xl font-bold text-[#4edea3] font-[#Hanken Grotesk]">
            {lowCount} Sectors
          </span>
          <span className="text-[10px] text-[#c6c6cb] block">Score &lt;40 Vulnerability</span>
        </div>
      </div>

      {/* Main Heatmap Visual & Inspector Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* D3 Heatmap SVG Container */}
        <div ref={containerRef} className="lg:col-span-8 overflow-x-auto custom-scrollbar relative bg-[#0b0e14] p-4 rounded-xl border border-[#1E293B]">
          <svg ref={svgRef} className="w-full h-auto min-w-[500px]" />

          {/* Color Gradient Scale Legend & Trend Indicator Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between text-[10px] font-[#Geist] text-[#909095] pt-3 border-t border-[#1E293B]/60 mt-2 gap-2">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span>Low Risk (0)</span>
              <div className="h-2 w-32 rounded-full bg-gradient-to-r from-[#0d2b1f] via-[#735114] to-[#d93838]"></div>
              <span>Critical (100)</span>
            </div>

            {showTrendLines && (
              <div className="flex items-center gap-2 text-[#4285F4] font-semibold">
                <span className="w-4 h-0.5 bg-[#ffffff] rounded inline-block shadow"></span>
                <span>White Line: 6-Mo Moving Average Trajectory</span>
              </div>
            )}
          </div>
        </div>

        {/* Selected / Hovered Cell Inspector Side Panel */}
        <div className="lg:col-span-4 bg-[#0b0e14] border border-[#1E293B] rounded-xl p-5 space-y-4">
          <div className="border-b border-[#1E293B] pb-3">
            <span className="text-[10px] text-[#4edea3] font-bold uppercase tracking-wider font-[#Geist] block">
              Cell Telemetry & Evolution
            </span>
            <h4 className="font-[#Hanken Grotesk] font-bold text-base text-[#e2e2e2] mt-0.5">
              {currentCell?.sector || 'Select a Cell'}
            </h4>
            <span className="text-xs text-[#909095] block">
              Domain: {currentCell?.category}
            </span>
          </div>

          {currentCell ? (
            <div className="space-y-3 font-[#Geist] text-xs">
              <div className="flex justify-between items-center py-1 border-b border-[#1E293B]/60">
                <span className="text-[#909095]">Current Density Score:</span>
                <span className="font-bold text-sm text-[#e2e2e2]">
                  {currentCell.densityScore} / 100
                </span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-[#1E293B]/60">
                <span className="text-[#909095]">6-Mo Trajectory Shift:</span>
                <span
                  className={`font-bold flex items-center gap-1 ${
                    trendDiff > 0
                      ? 'text-[#ffb4ab]'
                      : trendDiff < 0
                      ? 'text-[#4edea3]'
                      : 'text-[#c6c6cb]'
                  }`}
                >
                  {trendDiff > 0 ? `+${trendDiff} pts (Expanding)` : trendDiff < 0 ? `${trendDiff} pts (Improving)` : 'Stable'}
                </span>
              </div>

              {/* 6-Month Trajectory Timeline Sparkline Breakdown */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[#909095] text-[10px] uppercase font-bold tracking-wider block">
                  6-Month Moving Average Breakdown:
                </span>
                <div className="grid grid-cols-6 gap-1 bg-[#141820] p-2 rounded border border-[#1E293B] text-center">
                  {currentCell.trend6mo.map((val, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="h-10 bg-[#0b0e14] rounded flex items-end justify-center p-0.5">
                        <div
                          className={`w-full rounded-sm transition-all ${
                            val >= 80 ? 'bg-[#d93838]' : val >= 60 ? 'bg-[#FBBC05]' : 'bg-[#4edea3]'
                          }`}
                          style={{ height: `${val}%` }}
                        />
                      </div>
                      <span className="text-[9px] text-[#909095] block font-mono">
                        {val}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-[8px] text-[#909095] px-1 font-mono">
                  <span>May</span>
                  <span>Jun</span>
                  <span>Jul</span>
                  <span>Aug</span>
                  <span>Sep</span>
                  <span>Oct</span>
                </div>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-[#1E293B]/60 pt-1">
                <span className="text-[#909095]">Severity Level:</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    currentCell.severity === 'Critical'
                      ? 'bg-[#d93838]/20 text-[#ffb4ab] border border-[#d93838]/40'
                      : currentCell.severity === 'High'
                      ? 'bg-[#FBBC05]/20 text-[#FBBC05] border border-[#FBBC05]/40'
                      : currentCell.severity === 'Medium'
                      ? 'bg-[#4285F4]/20 text-[#4285F4] border border-[#4285F4]/40'
                      : 'bg-[#4edea3]/20 text-[#4edea3] border border-[#4edea3]/40'
                  }`}
                >
                  {currentCell.severity}
                </span>
              </div>

              <div className="space-y-1 pt-1">
                <span className="text-[#909095] text-[10px] uppercase font-bold tracking-wider block">
                  Primary Audit Risk Driver:
                </span>
                <p className="p-2.5 rounded bg-[#141820] border border-[#1E293B] text-[11px] text-[#e2e2e2] leading-relaxed font-[#Inter]">
                  "{currentCell.topFactor}"
                </p>
              </div>

              <div className="pt-1">
                <div className="p-2 rounded bg-[#4edea3]/10 border border-[#4edea3]/20 text-[10px] text-[#4edea3] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-xs">verified</span>
                  <span>Mapped with 6-Mo Moving Average Interpolation</span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-[#909095] text-center py-6 font-[#Geist]">
              Click or hover over any sector cell in the D3 matrix to inspect risk drivers.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
