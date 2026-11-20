import React, { useEffect, useState } from 'react';
import { ArrowRight, Pause, Play } from 'lucide-react';
import {
  ELEMENT_ORDER,
  ELEMENTS,
  ElementId,
  TRIGRAMS,
  TrigramId,
} from '../data/baguaData';

interface WuXingMatrixProps {
  onJumpToTrigram: (id: TrigramId) => void;
}

const NODE_POSITIONS: Record<ElementId, { x: number; y: number }> = {
  fire: { x: 200, y: 52 },
  earth: { x: 342, y: 155 },
  metal: { x: 288, y: 320 },
  water: { x: 112, y: 320 },
  wood: { x: 58, y: 155 },
};

export const WuXingMatrix: React.FC<WuXingMatrixProps> = ({
  onJumpToTrigram,
}) => {
  const [selectedEl, setSelectedEl] = useState<ElementId>('wood');
  const [flowEnabled, setFlowEnabled] = useState(true);
  const [pulsePhase, setPulsePhase] = useState(0); // 0..1

  // JS requestAnimationFrame energy flow along generates/overcomes edges
  useEffect(() => {
    if (!flowEnabled) return;
    let rafId = 0;
    const start = performance.now();
    const tick = (now: number) => {
      setPulsePhase(((now - start) % 2400) / 2400);
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [flowEnabled]);

  const current = ELEMENTS[selectedEl];

  const getEdgeSegment = (fromId: ElementId, toId: ElementId) => {
    const from = NODE_POSITIONS[fromId];
    const to = NODE_POSITIONS[toId];
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const len = Math.hypot(dx, dy);
    const pad = 34;
    return {
      x1: from.x + (dx / len) * pad,
      y1: from.y + (dy / len) * pad,
      x2: to.x - (dx / len) * pad,
      y2: to.y - (dy / len) * pad,
    };
  };

  return (
    <div className="wuxing-grid">
      {/* Left: Interactive Pentagram SVG with animated flow particles */}
      <div className="panel-card lab-card">
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 10,
            flexWrap: 'wrap',
          }}
        >
          <div>
            <span className="primer-pill">五行相生相克 · 动态流转</span>
            <h2
              className="font-serif-classical"
              style={{ margin: '10px 0 6px', fontSize: '1.35rem' }}
            >
              外环相生 · 内星相克能量流
            </h2>
          </div>
          <button
            type="button"
            className={`chip-toggle ${flowEnabled ? 'active' : ''}`}
            onClick={() => setFlowEnabled((v) => !v)}
          >
            {flowEnabled ? <Pause size={13} /> : <Play size={13} />}
            {flowEnabled ? '暂停能量流' : '开启能量流'}
          </button>
        </div>

        <p className="section-body">
          点击任意五行圆环，“绿实线”表示滋养相生，“红虚线”表示制约相克，光点代表能量流向：
        </p>

        <svg
          viewBox="0 0 400 385"
          style={{ width: '100%', maxWidth: 430, margin: '0 auto' }}
          role="img"
          aria-label="五行相生相克五角星图"
        >
          <defs>
            <marker
              id="wxSheng"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#4E9F76" />
            </marker>
            <marker
              id="wxKe"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="5.5"
              markerHeight="5.5"
              orient="auto"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#D4573B" />
            </marker>
          </defs>

          <circle
            cx="200"
            cy="205"
            r="148"
            fill="none"
            stroke="var(--ring-divider)"
            strokeDasharray="4 4"
          />

          {/* 相生外环 */}
          {ELEMENT_ORDER.map((id) => {
            const targetId = ELEMENTS[id].generates;
            const seg = getEdgeSegment(id, targetId);
            const highlight = id === selectedEl || targetId === selectedEl;
            const px = seg.x1 + (seg.x2 - seg.x1) * pulsePhase;
            const py = seg.y1 + (seg.y2 - seg.y1) * pulsePhase;
            return (
              <g key={`s-${id}`}>
                <line
                  x1={seg.x1}
                  y1={seg.y1}
                  x2={seg.x2}
                  y2={seg.y2}
                  stroke="#4E9F76"
                  strokeWidth={highlight ? '2.4' : '1.2'}
                  strokeOpacity={highlight ? 0.95 : 0.32}
                  markerEnd="url(#wxSheng)"
                />
                {flowEnabled && highlight && (
                  <circle cx={px} cy={py} r="4.2" fill="#68C896" />
                )}
              </g>
            );
          })}

          {/* 相克内星 */}
          {ELEMENT_ORDER.map((id) => {
            const targetId = ELEMENTS[id].overcomes;
            const seg = getEdgeSegment(id, targetId);
            const highlight = id === selectedEl || targetId === selectedEl;
            const px = seg.x1 + (seg.x2 - seg.x1) * pulsePhase;
            const py = seg.y1 + (seg.y2 - seg.y1) * pulsePhase;
            return (
              <g key={`k-${id}`}>
                <line
                  x1={seg.x1}
                  y1={seg.y1}
                  x2={seg.x2}
                  y2={seg.y2}
                  stroke="#D4573B"
                  strokeWidth={highlight ? '2.1' : '1.1'}
                  strokeDasharray="5 4"
                  strokeOpacity={highlight ? 0.9 : 0.3}
                  markerEnd="url(#wxKe)"
                />
                {flowEnabled && highlight && (
                  <circle cx={px} cy={py} r="3.6" fill="#EB6B4D" />
                )}
              </g>
            );
          })}

          {/* Five Element Nodes */}
          {ELEMENT_ORDER.map((id) => {
            const el = ELEMENTS[id];
            const pos = NODE_POSITIONS[id];
            const isSelected = id === selectedEl;
            return (
              <g
                key={id}
                transform={`translate(${pos.x}, ${pos.y})`}
                onClick={() => setSelectedEl(id)}
                style={{ cursor: 'pointer' }}
              >
                <circle
                  r={isSelected ? 34 : 29}
                  fill="var(--bg-surface)"
                  stroke={el.color}
                  strokeWidth={isSelected ? '3' : '1.6'}
                />
                <circle r={isSelected ? 30 : 25} fill={el.softBg} />
                <text
                  y="-3"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={el.color}
                  fontSize="18"
                  fontWeight="700"
                  className="font-serif-classical"
                >
                  {el.name}
                </text>
                <text
                  y="14"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="var(--text-secondary)"
                  fontSize="9"
                >
                  {el.english}
                </text>
              </g>
            );
          })}

          <text
            x="200"
            y="206"
            textAnchor="middle"
            fill="var(--text-muted)"
            fontSize="10.5"
          >
            绿实线：相生 · 红虚线：相克
          </text>
        </svg>
      </div>

      {/* Right: Selected Element Details & 8-to-5 Mapping */}
      <div className="panel-card lab-card">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: 14,
          }}
        >
          <div>
            <h2
              className="font-serif-classical"
              style={{ margin: 0, fontSize: '1.5rem', color: current.color }}
            >
              {current.name}行 · {current.pinyin}（{current.english}）
            </h2>
            <p
              style={{
                margin: '4px 0 0',
                fontSize: '0.86rem',
                color: 'var(--text-secondary)',
              }}
            >
              {current.nature} · 五德属“{current.virtue}”
            </p>
          </div>
          <span
            className="element-badge"
            style={{ color: current.color, background: current.softBg }}
          >
            {current.traditionalColor}
          </span>
        </div>

        <div className="attr-grid">
          <div className="attr-item">
            <div className="attr-label">主位方位</div>
            <div className="attr-value">{current.direction}</div>
          </div>
          <div className="attr-item">
            <div className="attr-label">主时节令</div>
            <div className="attr-value">{current.season}</div>
          </div>
          <div className="attr-item">
            <div className="attr-label">传统五脏对应（中医科普）</div>
            <div className="attr-value">{current.organ}</div>
          </div>
          <div className="attr-item">
            <div className="attr-label">生克四向</div>
            <div className="attr-value" style={{ fontSize: '0.82rem' }}>
              {ELEMENTS[current.generatedBy].name}生我 → 我生
              {ELEMENTS[current.generates].name} / 克
              {ELEMENTS[current.overcomes].name}
            </div>
          </div>
        </div>

        <div className="section-block">
          <h3 className="section-heading">五行本质解读</h3>
          <p className="section-body">{current.summary}</p>
        </div>

        <div className="section-block">
          <h3 className="section-heading">八卦如何配入五行？（八宫归五行）</h3>
          <p className="section-body">{current.mingpanMeaning}</p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 4 }}>
            {current.trigrams.map((tId) => {
              const t = TRIGRAMS[tId];
              return (
                <button
                  key={tId}
                  type="button"
                  className="chip-toggle active"
                  onClick={() => onJumpToTrigram(tId)}
                >
                  {t.symbol} {t.name}卦（{t.nature} · {t.houtian.direction}）
                  <ArrowRight size={13} />
                </button>
              );
            })}
          </div>
        </div>

        <div className="quote-box">
          <strong>为何“八卦只有五种五行”？</strong>
          金（乾兑）、木（震巽）、土（坤艮）各分阴阳两卦，而水（坎）与火（离）各居南北极位、独成一宫——这正是传统“阴阳互根、水火既济”的空间结构体现。
        </div>
      </div>
    </div>
  );
};
