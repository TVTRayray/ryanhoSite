import React, { useEffect, useRef, useState } from 'react';
import {
  ArrangementMode,
  EARTHLY_BRANCHES,
  ELEMENTS,
  OrientationMode,
  TRIGRAM_LIST,
  TRIGRAMS,
  TrigramId,
  XIANTIAN_PAIRS,
} from '../data/baguaData';

interface MingpanWheelProps {
  arrangement: ArrangementMode;
  orientation: OrientationMode;
  selectedId: TrigramId;
  onSelectTrigram: (id: TrigramId) => void;
  showBranches: boolean;
  showRelations: boolean;
  showOrderPath: boolean;
  activeBranchIndex: number | null;
}

function polar(deg: number, radius: number): { x: number; y: number } {
  const rad = (deg * Math.PI) / 180;
  return {
    x: radius * Math.sin(rad),
    y: -radius * Math.cos(rad),
  };
}

function sectorPath(
  startDeg: number,
  endDeg: number,
  innerR: number,
  outerR: number
): string {
  const p1 = polar(startDeg, outerR);
  const p2 = polar(endDeg, outerR);
  const p3 = polar(endDeg, innerR);
  const p4 = polar(startDeg, innerR);
  const largeArc = endDeg - startDeg > 180 ? 1 : 0;
  return [
    `M ${p1.x.toFixed(2)} ${p1.y.toFixed(2)}`,
    `A ${outerR} ${outerR} 0 ${largeArc} 1 ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`,
    `L ${p3.x.toFixed(2)} ${p3.y.toFixed(2)}`,
    `A ${innerR} ${innerR} 0 ${largeArc} 0 ${p4.x.toFixed(2)} ${p4.y.toFixed(2)}`,
    'Z',
  ].join(' ');
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function shortestAngleLerp(from: number, to: number, t: number): number {
  const diff = ((((to - from) % 360) + 540) % 360) - 180;
  return (from + diff * t + 360) % 360;
}

function computeTargetAngles(
  arrangement: ArrangementMode,
  orientation: OrientationMode
): Record<TrigramId, number> {
  const offset = orientation === 'south-up' ? 0 : 180;
  const result = {} as Record<TrigramId, number>;
  for (const t of TRIGRAM_LIST) {
    const base =
      arrangement === 'xiantian'
        ? t.xiantian.angleSouthUp
        : t.houtian.angleSouthUp;
    result[t.id] = (base + offset) % 360;
  }
  return result;
}

function getCardinalLabels(orientation: OrientationMode) {
  const offset = orientation === 'south-up' ? 0 : 180;
  return [
    { deg: (0 + offset) % 360, zh: '南', en: 'S' },
    { deg: (45 + offset) % 360, zh: '西南', en: 'SW' },
    { deg: (90 + offset) % 360, zh: '西', en: 'W' },
    { deg: (135 + offset) % 360, zh: '西北', en: 'NW' },
    { deg: (180 + offset) % 360, zh: '北', en: 'N' },
    { deg: (225 + offset) % 360, zh: '东北', en: 'NE' },
    { deg: (270 + offset) % 360, zh: '东', en: 'E' },
    { deg: (315 + offset) % 360, zh: '东南', en: 'SE' },
  ];
}

export const MingpanWheel: React.FC<MingpanWheelProps> = ({
  arrangement,
  orientation,
  selectedId,
  onSelectTrigram,
  showBranches,
  showRelations,
  showOrderPath,
  activeBranchIndex,
}) => {
  const offset = orientation === 'south-up' ? 0 : 180;

  // JS requestAnimationFrame smooth angular morph when switching 先天↔后天 or 上南↔上北
  const [angles, setAngles] = useState<Record<TrigramId, number>>(() =>
    computeTargetAngles(arrangement, orientation)
  );
  const currentAnglesRef = useRef<Record<TrigramId, number>>(angles);

  useEffect(() => {
    const startAngles = { ...currentAnglesRef.current };
    const targetAngles = computeTargetAngles(arrangement, orientation);
    const startTime = performance.now();
    const duration = 680;
    let rafId = 0;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const eased = easeOutCubic(progress);

      const next = {} as Record<TrigramId, number>;
      for (const t of TRIGRAM_LIST) {
        next[t.id] = shortestAngleLerp(
          startAngles[t.id],
          targetAngles[t.id],
          eased
        );
      }
      currentAnglesRef.current = next;
      setAngles(next);

      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      }
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [arrangement, orientation]);

  const selectedTrigram = TRIGRAMS[selectedId];
  const selectedEl = ELEMENTS[selectedTrigram.element];

  const xiantianOrder: TrigramId[] = [
    'qian',
    'dui',
    'li',
    'zhen',
    'xun',
    'kan',
    'gen',
    'kun',
  ];

  const houtianCycle: TrigramId[] = [
    'zhen',
    'xun',
    'li',
    'kun',
    'dui',
    'qian',
    'kan',
    'gen',
  ];

  const orderSequence =
    arrangement === 'xiantian' ? xiantianOrder : houtianCycle;

  const pathPoints = orderSequence.map((id) => polar(angles[id], 124));
  const orderPolyline =
    arrangement === 'xiantian'
      ? pathPoints
          .map(
            (p, idx) =>
              `${idx === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`
          )
          .join(' ')
      : pathPoints
          .map(
            (p, idx) =>
              `${idx === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`
          )
          .join(' ') + ' Z';

  const cardinalLabels = getCardinalLabels(orientation);

  const sweepDeg =
    activeBranchIndex !== null
      ? (EARTHLY_BRANCHES[activeBranchIndex].angleSouthUp + offset) % 360
      : null;

  return (
    <svg
      viewBox="-345 -345 690 690"
      className="wheel-svg"
      role="img"
      aria-label="交互式八卦基础命盘"
    >
      <defs>
        <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--accent-gold)" stopOpacity="0.18" />
          <stop offset="70%" stopColor="var(--accent-gold)" stopOpacity="0.03" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>
        <marker
          id="arrowGold"
          viewBox="0 0 10 10"
          refX="7"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 1 L 10 5 L 0 9 z" fill="var(--accent-gold)" />
        </marker>
        <marker
          id="arrowJade"
          viewBox="0 0 10 10"
          refX="7"
          refY="5"
          markerWidth="5.5"
          markerHeight="5.5"
          orient="auto-start-reverse"
        >
          <path d="M 0 1 L 10 5 L 0 9 z" fill="#4E9F76" />
        </marker>
        <marker
          id="arrowVermilion"
          viewBox="0 0 10 10"
          refX="7"
          refY="5"
          markerWidth="5.5"
          markerHeight="5.5"
          orient="auto-start-reverse"
        >
          <path d="M 0 1 L 10 5 L 0 9 z" fill="#D4573B" />
        </marker>
      </defs>

      <circle cx="0" cy="0" r="245" fill="url(#coreGlow)" />

      {/* Outer astrolabe bezel ticks */}
      <circle
        cx="0"
        cy="0"
        r="328"
        fill="none"
        stroke="var(--ring-divider)"
        strokeWidth="1"
      />
      <circle
        cx="0"
        cy="0"
        r="298"
        fill="none"
        stroke="var(--ring-divider)"
        strokeWidth="1"
      />
      {Array.from({ length: 24 }).map((_, i) => {
        const deg = i * 15;
        const inner = i % 3 === 0 ? 292 : 295;
        const p1 = polar(deg, inner);
        const p2 = polar(deg, 300);
        return (
          <line
            key={deg}
            x1={p1.x}
            y1={p1.y}
            x2={p2.x}
            y2={p2.y}
            stroke="var(--ring-divider)"
            strokeWidth={i % 3 === 0 ? '1.3' : '0.8'}
          />
        );
      })}

      {/* Outer Cardinal Directions */}
      {cardinalLabels.map((c) => {
        const pos = polar(c.deg, 314);
        const isMain = c.zh.length === 1;
        return (
          <g key={c.zh} transform={`translate(${pos.x}, ${pos.y})`}>
            <text
              textAnchor="middle"
              dominantBaseline="central"
              fill={isMain ? 'var(--accent-gold)' : 'var(--text-muted)'}
              fontSize={isMain ? '13.5' : '10.5'}
              fontWeight={isMain ? '700' : '500'}
              className="font-serif-classical"
            >
              {c.zh}
              <tspan
                fontSize="9"
                fill="var(--text-muted)"
                dx="2"
                className="font-mono-code"
              >
                {c.en}
              </tspan>
            </text>
          </g>
        );
      })}

      {/* Optional 12 Earthly Branches Ring */}
      {showBranches && (
        <g opacity={arrangement === 'xiantian' ? 0.45 : 1}>
          <circle
            cx="0"
            cy="0"
            r="250"
            fill="none"
            stroke="var(--ring-divider)"
            strokeWidth="1"
          />
          {EARTHLY_BRANCHES.map((b, idx) => {
            const deg = (b.angleSouthUp + offset) % 360;
            const dPath = sectorPath(deg - 15, deg + 15, 250, 296);
            const isActiveBranch = activeBranchIndex === idx;
            const isLinkedToSelected = b.trigramId === selectedId;
            const elColor = ELEMENTS[b.element].color;
            const posMain = polar(deg, 279);
            const posSub = polar(deg, 261);
            return (
              <g
                key={b.name}
                style={{ cursor: 'pointer' }}
                onClick={() => onSelectTrigram(b.trigramId)}
              >
                <path
                  d={dPath}
                  fill={
                    isActiveBranch
                      ? 'var(--accent-vermilion-soft)'
                      : isLinkedToSelected
                      ? 'var(--sector-active)'
                      : 'transparent'
                  }
                  stroke={
                    isActiveBranch
                      ? 'var(--accent-vermilion)'
                      : 'var(--ring-divider)'
                  }
                  strokeWidth={isActiveBranch ? '1.6' : '0.7'}
                />
                <text
                  x={posMain.x}
                  y={posMain.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={
                    isActiveBranch
                      ? 'var(--accent-vermilion)'
                      : isLinkedToSelected
                      ? 'var(--accent-gold)'
                      : 'var(--text-primary)'
                  }
                  fontSize="13"
                  fontWeight={isLinkedToSelected || isActiveBranch ? '700' : '500'}
                  className="font-serif-classical"
                >
                  {b.name}
                </text>
                <text
                  x={posSub.x}
                  y={posSub.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={elColor}
                  fontSize="8.5"
                  className="font-mono-code"
                >
                  {b.timeRange.split('–')[0]}
                </text>
              </g>
            );
          })}
        </g>
      )}

      {/* Main Bagua Trigram Sectors (animated angles!) */}
      <g>
        <circle
          cx="0"
          cy="0"
          r="246"
          fill="none"
          stroke="var(--border-strong)"
          strokeWidth="1.2"
        />
        <circle
          cx="0"
          cy="0"
          r="148"
          fill="none"
          stroke="var(--border-strong)"
          strokeWidth="1.2"
        />
        <circle
          cx="0"
          cy="0"
          r="102"
          fill="none"
          stroke="var(--ring-divider)"
          strokeWidth="1"
        />

        {TRIGRAM_LIST.map((t) => {
          const deg = angles[t.id];
          const isSelected = t.id === selectedId;
          const el = ELEMENTS[t.element];
          const outerPath = sectorPath(deg - 22.5, deg + 22.5, 148, 246);
          const innerElementPath = sectorPath(deg - 22.5, deg + 22.5, 102, 148);

          let relationTag: { label: string; color: string } | null = null;
          if (!isSelected && showRelations) {
            if (t.element === selectedTrigram.element) {
              relationTag = { label: '同气', color: el.color };
            } else if (selectedEl.generates === t.element) {
              relationTag = { label: '我生', color: '#4E9F76' };
            } else if (selectedEl.generatedBy === t.element) {
              relationTag = { label: '生我', color: '#61B58B' };
            } else if (selectedEl.overcomes === t.element) {
              relationTag = { label: '我克', color: '#C79B46' };
            } else if (selectedEl.overcomeBy === t.element) {
              relationTag = { label: '克我', color: '#D4573B' };
            }
          }

          const titlePos = polar(deg, 224);
          const numValue =
            arrangement === 'xiantian'
              ? t.xiantian.number
              : t.houtian.luoshuNumber;
          const elPos = polar(deg, 125);

          return (
            <g
              key={t.id}
              onClick={() => onSelectTrigram(t.id)}
              style={{ cursor: 'pointer' }}
            >
              <path
                d={outerPath}
                fill={
                  isSelected ? 'var(--sector-active)' : 'var(--bg-surface)'
                }
                fillOpacity={isSelected ? 1 : 0.76}
                stroke={
                  isSelected ? 'var(--accent-gold)' : 'var(--ring-divider)'
                }
                strokeWidth={isSelected ? '1.8' : '0.9'}
              />

              <path
                d={innerElementPath}
                fill={el.softBg}
                fillOpacity={isSelected ? 1 : 0.65}
                stroke="var(--ring-divider)"
                strokeWidth="0.8"
              />

              <g transform={`translate(${titlePos.x}, ${titlePos.y})`}>
                <text
                  textAnchor="middle"
                  dominantBaseline="central"
                  y="-6"
                  fill={isSelected ? 'var(--accent-gold)' : 'var(--text-primary)'}
                  fontSize="16"
                  fontWeight="700"
                  className="font-serif-classical"
                >
                  {t.name}
                  <tspan
                    fontSize="10.5"
                    fill="var(--text-muted)"
                    dx="3"
                    className="font-mono-code"
                  >
                    {numValue}
                  </tspan>
                </text>
                <text
                  textAnchor="middle"
                  dominantBaseline="central"
                  y="10"
                  fill="var(--text-secondary)"
                  fontSize="10"
                >
                  {t.nature} · {t.pinyin}
                </text>
              </g>

              <g transform={`rotate(${deg})`}>
                {t.yaos.map((bit, idx) => {
                  const rY = -(162 + idx * 14);
                  const barColor =
                    bit === 1
                      ? isSelected
                        ? 'var(--accent-gold)'
                        : 'var(--text-primary)'
                      : isSelected
                      ? 'var(--accent-vermilion)'
                      : 'var(--text-secondary)';
                  return bit === 1 ? (
                    <rect
                      key={idx}
                      x={-21}
                      y={rY - 3}
                      width={42}
                      height={5.6}
                      rx={2}
                      fill={barColor}
                    />
                  ) : (
                    <g key={idx}>
                      <rect
                        x={-21}
                        y={rY - 3}
                        width={17.5}
                        height={5.6}
                        rx={2}
                        fill={barColor}
                      />
                      <rect
                        x={3.5}
                        y={rY - 3}
                        width={17.5}
                        height={5.6}
                        rx={2}
                        fill={barColor}
                      />
                    </g>
                  );
                })}
              </g>

              <g transform={`translate(${elPos.x}, ${elPos.y})`}>
                <text
                  textAnchor="middle"
                  dominantBaseline="central"
                  y={relationTag ? -6 : 0}
                  fill={el.color}
                  fontSize="13"
                  fontWeight="700"
                  className="font-serif-classical"
                >
                  {el.name}
                </text>
                {relationTag && (
                  <text
                    textAnchor="middle"
                    dominantBaseline="central"
                    y="9"
                    fill={relationTag.color}
                    fontSize="9.5"
                    fontWeight="600"
                  >
                    {relationTag.label}
                  </text>
                )}
              </g>
            </g>
          );
        })}
      </g>

      {/* Optional Order Path */}
      {showOrderPath && (
        <g pointerEvents="none">
          <path
            d={orderPolyline}
            fill="none"
            stroke="var(--accent-gold)"
            strokeWidth="1.8"
            strokeDasharray="5 4"
            strokeOpacity="0.82"
            markerEnd="url(#arrowGold)"
          />
          {arrangement === 'xiantian' &&
            XIANTIAN_PAIRS.map((pair) => {
              const pA = polar(angles[pair.a], 94);
              const pB = polar(angles[pair.b], 94);
              const activePair =
                pair.a === selectedId || pair.b === selectedId;
              return (
                <line
                  key={pair.title}
                  x1={pA.x}
                  y1={pA.y}
                  x2={pB.x}
                  y2={pB.y}
                  stroke={
                    activePair ? 'var(--accent-vermilion)' : 'var(--ring-divider)'
                  }
                  strokeWidth={activePair ? '1.8' : '0.9'}
                  strokeDasharray="3 3"
                />
              );
            })}
        </g>
      )}

      {/* Optional WuXing Relation Arcs */}
      {showRelations && (
        <g pointerEvents="none">
          {TRIGRAM_LIST.filter((t) => t.id !== selectedId).map((target) => {
            const isGen = selectedEl.generates === target.element;
            const isOver = selectedEl.overcomes === target.element;
            if (!isGen && !isOver) return null;
            const pFrom = polar(angles[selectedId], 96);
            const pTo = polar(angles[target.id], 96);
            return (
              <path
                key={target.id}
                d={`M ${pFrom.x.toFixed(1)} ${pFrom.y.toFixed(1)} Q 0 0 ${pTo.x.toFixed(1)} ${pTo.y.toFixed(1)}`}
                fill="none"
                stroke={isGen ? '#4E9F76' : '#D4573B'}
                strokeWidth="1.5"
                strokeOpacity="0.72"
                markerEnd={isGen ? 'url(#arrowJade)' : 'url(#arrowVermilion)'}
              />
            );
          })}
        </g>
      )}

      {/* Active Earthly Branch Sweep Pointer during 时辰流转演示 */}
      {sweepDeg !== null && (
        <g pointerEvents="none">
          {(() => {
            const pInner = polar(sweepDeg, 66);
            const pOuter = polar(sweepDeg, 294);
            return (
              <line
                x1={pInner.x}
                y1={pInner.y}
                x2={pOuter.x}
                y2={pOuter.y}
                stroke="var(--accent-vermilion)"
                strokeWidth="2.2"
                strokeDasharray="4 3"
                strokeOpacity="0.9"
              />
            );
          })()}
        </g>
      )}

      {/* Center Taiji & LuoShu Five Core */}
      <g>
        <circle
          cx="0"
          cy="0"
          r="66"
          fill="var(--bg-surface)"
          stroke="var(--accent-gold)"
          strokeWidth="1.6"
        />
        <circle
          cx="0"
          cy="0"
          r="58"
          fill="none"
          stroke="var(--ring-divider)"
          strokeWidth="0.9"
          strokeDasharray="2 3"
        />
        <g transform="scale(0.42)">
          <circle
            cx="0"
            cy="0"
            r="90"
            fill="var(--taiji-yang)"
            stroke="var(--accent-gold)"
            strokeWidth="3"
          />
          <path
            d="M 0 -90 A 90 90 0 0 1 0 90 A 45 45 0 0 1 0 0 A 45 45 0 0 0 0 -90 Z"
            fill="var(--taiji-yin)"
          />
          <circle cx="0" cy="-45" r="13" fill="var(--taiji-yin)" />
          <circle cx="0" cy="45" r="13" fill="var(--taiji-yang)" />
        </g>
        <text
          x="0"
          y="50"
          textAnchor="middle"
          fill="var(--accent-gold)"
          fontSize="9.5"
          fontWeight="600"
          className="font-serif-classical"
        >
          {arrangement === 'xiantian' ? '先天为体' : '中五 · 后天为用'}
        </text>
      </g>
    </svg>
  );
};
