import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
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

// 五行圆周角度：木(左上/东) -> 火(正上/南) -> 土(右上/中枢) -> 金(右下/西) -> 水(左下/北)
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
  const current = ELEMENTS[selectedEl];

  return (
    <div className="wuxing-grid">
      {/* Left: Interactive Pentagram SVG */}
      <div className="panel-card lab-card">
        <div>
          <span className="primer-pill">五行相生相克 · 动力模型</span>
          <h2
            className="font-serif-classical"
            style={{ margin: '10px 0 6px', fontSize: '1.35rem' }}
          >
            外环相生 · 内星相克交互图谱
          </h2>
          <p className="section-body">
            “生”代表滋养推动（顺时针外圈），“克”代表制约平衡（五角星内线）。命盘看重的是<strong>生克制化的动态平衡</strong>，而非单看某一行多少。
          </p>
        </div>

        <svg
          viewBox="0 0 400 385"
          style={{ width: '100%', maxWidth: 440, margin: '0 auto' }}
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

          {/* 相生外环（实线绿） */}
          {ELEMENT_ORDER.map((id) => {
            const from = NODE_POSITIONS[id];
            const targetId = ELEMENTS[id].generates;
            const to = NODE_POSITIONS[targetId];
            const dx = to.x - from.x;
            const dy = to.y - from.y;
            const len = Math.hypot(dx, dy);
            const pad = 34;
            const x1 = from.x + (dx / len) * pad;
            const y1 = from.y + (dy / len) * pad;
            const x2 = to.x - (dx / len) * pad;
            const y2 = to.y - (dy / len) * pad;
            const highlight = id === selectedEl || targetId === selectedEl;
            return (
              <line
                key={`s-${id}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#4E9F76"
                strokeWidth={highlight ? '2.4' : '1.2'}
                strokeOpacity={highlight ? 0.95 : 0.35}
                markerEnd="url(#wxSheng)"
              />
            );
          })}

          {/* 相克内星（虚线朱红） */}
          {ELEMENT_ORDER.map((id) => {
            const from = NODE_POSITIONS[id];
            const targetId = ELEMENTS[id].overcomes;
            const to = NODE_POSITIONS[targetId];
            const dx = to.x - from.x;
            const dy = to.y - from.y;
            const len = Math.hypot(dx, dy);
            const pad = 34;
            const x1 = from.x + (dx / len) * pad;
            const y1 = from.y + (dy / len) * pad;
            const x2 = to.x - (dx / len) * pad;
            const y2 = to.y - (dy / len) * pad;
            const highlight = id === selectedEl || targetId === selectedEl;
            return (
              <line
                key={`k-${id}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#D4573B"
                strokeWidth={highlight ? '2.1' : '1.1'}
                strokeDasharray="5 4"
                strokeOpacity={highlight ? 0.9 : 0.32}
                markerEnd="url(#wxKe)"
              />
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
                  r={isSelected ? 33 : 29}
                  fill="var(--bg-surface)"
                  stroke={el.color}
                  strokeWidth={isSelected ? '3' : '1.6'}
                />
                <circle r={isSelected ? 29 : 25} fill={el.softBg} />
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
