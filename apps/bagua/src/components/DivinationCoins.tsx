import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  Coins,
  FastForward,
  RotateCcw,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import {
  ELEMENTS,
  TrigramId,
  YaoBit,
  findTrigramByYaos,
} from '../data/baguaData';
import { findHexagram } from '../data/hexagramsData';

interface DivinationCoinsProps {
  onJumpToMingpan: (id: TrigramId) => void;
}

type CoinFace = 2 | 3; // 2 = 字面(阴), 3 = 背面(阳)
type YaoSum = 6 | 7 | 8 | 9;

interface CastLine {
  index: number; // 0..5 (初爻..上爻)
  coins: [CoinFace, CoinFace, CoinFace];
  sum: YaoSum;
  baseBit: YaoBit; // 本卦爻 (0阴 / 1阳)
  changedBit: YaoBit; // 变卦爻
  isMoving: boolean;
  label: string; // 老阴/少阳/少阴/老阳
}

const YAO_TITLES = ['初爻', '二爻', '三爻', '四爻', '五爻', '上爻'];

function interpretSum(sum: YaoSum): {
  baseBit: YaoBit;
  changedBit: YaoBit;
  isMoving: boolean;
  label: string;
} {
  switch (sum) {
    case 6:
      return { baseBit: 0, changedBit: 1, isMoving: true, label: '老阴 ×（动）' };
    case 7:
      return { baseBit: 1, changedBit: 1, isMoving: false, label: '少阳（静）' };
    case 8:
      return { baseBit: 0, changedBit: 0, isMoving: false, label: '少阴（静）' };
    case 9:
      return { baseBit: 1, changedBit: 0, isMoving: true, label: '老阳 ○（动）' };
  }
}

function randomCoin(): CoinFace {
  return Math.random() < 0.5 ? 2 : 3;
}

interface CoinAnimState {
  lift: number; // 0..1 vertical jump
  rotX: number; // degrees
  rotZ: number; // degrees
  scale: number;
}

const IDLE_COINS: [CoinAnimState, CoinAnimState, CoinAnimState] = [
  { lift: 0, rotX: 0, rotZ: -6, scale: 1 },
  { lift: 0, rotX: 0, rotZ: 2, scale: 1 },
  { lift: 0, rotX: 0, rotZ: 7, scale: 1 },
];

export const DivinationCoins: React.FC<DivinationCoinsProps> = ({
  onJumpToMingpan,
}) => {
  const [question, setQuestion] = useState('');
  const [lines, setLines] = useState<CastLine[]>([]);
  const [displayFaces, setDisplayFaces] = useState<
    [CoinFace, CoinFace, CoinFace]
  >([3, 2, 3]);
  const [coinAnims, setCoinAnims] =
    useState<[CoinAnimState, CoinAnimState, CoinAnimState]>(IDLE_COINS);
  const [isTossing, setIsTossing] = useState(false);
  const [isAutoCasting, setIsAutoCasting] = useState(false);

  const rafRef = useRef<number | null>(null);
  const autoTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      if (autoTimerRef.current !== null) window.clearTimeout(autoTimerRef.current);
    };
  }, []);

  const tossOnce = (onDone?: (nextCount: number) => void) => {
    if (isTossing || lines.length >= 6) return;
    setIsTossing(true);

    const finalCoins: [CoinFace, CoinFace, CoinFace] = [
      randomCoin(),
      randomCoin(),
      randomCoin(),
    ];
    const startTime = performance.now();
    const duration = 760;
    const offsets = [0, 55, 110]; // 三枚铜钱错峰落地

    const step = (now: number) => {
      let allFinished = true;
      const nextAnims: CoinAnimState[] = [0, 1, 2].map((i) => {
        const localT = Math.max(0, Math.min(1, (now - startTime - offsets[i]) / (duration - offsets[i])));
        if (localT < 1) allFinished = false;

        // 抛物线弹起 + 落盘微弹
        let lift = 0;
        if (localT < 0.78) {
          const u = localT / 0.78;
          lift = Math.sin(u * Math.PI);
        } else {
          const u = (localT - 0.78) / 0.22;
          lift = Math.sin(u * Math.PI) * 0.16;
        }

        const spins = 3 + i * 0.5;
        const rotX = localT < 1 ? localT * 360 * spins : 0;
        const rotZ =
          localT < 1
            ? Math.sin(localT * Math.PI * 3 + i) * 18
            : i === 0
            ? -5
            : i === 1
            ? 2
            : 6;
        const scale = 1 + lift * 0.14;
        return { lift, rotX, rotZ, scale };
      });

      setCoinAnims(nextAnims as [CoinAnimState, CoinAnimState, CoinAnimState]);

      // 空中翻转时交替闪烁正反面
      if (!allFinished) {
        setDisplayFaces([
          Math.floor((now - startTime) / 75) % 2 === 0 ? 3 : 2,
          Math.floor((now - startTime) / 85 + 1) % 2 === 0 ? 3 : 2,
          Math.floor((now - startTime) / 70) % 2 === 0 ? 3 : 2,
        ]);
        rafRef.current = requestAnimationFrame(step);
      } else {
        setDisplayFaces(finalCoins);
        setCoinAnims(IDLE_COINS);
        const sum = (finalCoins[0] + finalCoins[1] + finalCoins[2]) as YaoSum;
        const meta = interpretSum(sum);
        setLines((prev) => {
          if (prev.length >= 6) return prev;
          const next = [
            ...prev,
            {
              index: prev.length,
              coins: finalCoins,
              sum,
              ...meta,
            },
          ];
          if (onDone) onDone(next.length);
          return next;
        });
        setIsTossing(false);
      }
    };

    rafRef.current = requestAnimationFrame(step);
  };

  // 自动连掷六爻
  useEffect(() => {
    if (!isAutoCasting) return;
    if (lines.length >= 6) {
      setIsAutoCasting(false);
      return;
    }
    if (!isTossing) {
      autoTimerRef.current = window.setTimeout(() => {
        tossOnce();
      }, 220);
    }
    return () => {
      if (autoTimerRef.current !== null) window.clearTimeout(autoTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAutoCasting, isTossing, lines.length]);

  const resetAll = () => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    if (autoTimerRef.current !== null) window.clearTimeout(autoTimerRef.current);
    setIsTossing(false);
    setIsAutoCasting(false);
    setLines([]);
    setCoinAnims(IDLE_COINS);
  };

  const isComplete = lines.length === 6;

  // 解卦计算
  const result = (() => {
    if (!isComplete) return null;
    const lowerBase = findTrigramByYaos([
      lines[0].baseBit,
      lines[1].baseBit,
      lines[2].baseBit,
    ]);
    const upperBase = findTrigramByYaos([
      lines[3].baseBit,
      lines[4].baseBit,
      lines[5].baseBit,
    ]);
    const baseHex = findHexagram(upperBase.id, lowerBase.id);

    const movingLines = lines.filter((l) => l.isMoving);
    const hasMoving = movingLines.length > 0;
    const lowerChanged = findTrigramByYaos([
      lines[0].changedBit,
      lines[1].changedBit,
      lines[2].changedBit,
    ]);
    const upperChanged = findTrigramByYaos([
      lines[3].changedBit,
      lines[4].changedBit,
      lines[5].changedBit,
    ]);
    const changedHex = findHexagram(upperChanged.id, lowerChanged.id);

    // 上下经卦五行关系（外卦 vs 内卦）
    const upEl = ELEMENTS[upperBase.element];
    const lowEl = ELEMENTS[lowerBase.element];
    let wxRelation = '';
    if (upEl.id === lowEl.id) {
      wxRelation = `上下皆属${upEl.name}（比和同气），内外步调一致、气息共振。`;
    } else if (lowEl.generates === upEl.id) {
      wxRelation = `下卦${lowerBase.name}(${lowEl.name}) 生 上卦${upperBase.name}(${upEl.name})，内在根基持续滋养外在显现。`;
    } else if (upEl.generates === lowEl.id) {
      wxRelation = `上卦${upperBase.name}(${upEl.name}) 生 下卦${lowerBase.name}(${lowEl.name})，外部环境回馈滋养内在。`;
    } else if (lowEl.overcomes === upEl.id) {
      wxRelation = `下卦${lowerBase.name}(${lowEl.name}) 克 上卦${upperBase.name}(${upEl.name})，内在主动突破、主导外部局势。`;
    } else {
      wxRelation = `上卦${upperBase.name}(${upEl.name}) 克 下卦${lowerBase.name}(${lowEl.name})，外部条件形成规矩与考验，宜审慎应对。`;
    }

    return {
      baseHex,
      upperBase,
      lowerBase,
      movingLines,
      hasMoving,
      changedHex,
      wxRelation,
    };
  })();

  return (
    <div className="divination-grid">
      {/* Left: Coin Toss Interactive Stage */}
      <section className="panel-card lab-card">
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 12,
            flexWrap: 'wrap',
          }}
        >
          <div>
            <span className="primer-pill">
              <Coins size={13} /> 传统三钱起卦 · 自下而上
            </span>
            <h2
              className="font-serif-classical"
              style={{ margin: '8px 0 4px', fontSize: '1.38rem' }}
            >
              六爻铜钱卜卦交互演示
            </h2>
            <p className="section-body" style={{ fontSize: '0.84rem' }}>
              点击铜钱或按钮连续摇卦 <strong>6 次</strong>（自初爻至上爻）。正面字面记{' '}
              <span className="font-mono-code">2(阴)</span>，背面云纹记{' '}
              <span className="font-mono-code">3(阳)</span>。
            </p>
          </div>
          <button type="button" className="chip-toggle" onClick={resetAll}>
            <RotateCcw size={13} /> 重新起卦
          </button>
        </div>

        {/* Optional Question Input */}
        <div className="divination-input-row">
          <input
            type="text"
            className="divination-input"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="可选：写下此刻想推演或思考的主题（仅本地展示，不上传）"
            maxLength={40}
          />
        </div>

        {/* Interactive Coin Tray */}
        <div
          className="coin-tray"
          onClick={() => {
            if (!isTossing && !isAutoCasting && !isComplete) tossOnce();
          }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if ((e.key === 'Enter' || e.key === ' ') && !isTossing && !isComplete) {
              e.preventDefault();
              tossOnce();
            }
          }}
          aria-label="点击掷出三枚铜钱"
        >
          <div className="coin-tray-ring" aria-hidden="true" />

          <div className="coins-row">
            {[0, 1, 2].map((idx) => {
              const anim = coinAnims[idx];
              const face = displayFaces[idx];
              const isBackYang = face === 3;
              return (
                <div
                  key={idx}
                  className="coin-slot"
                  style={{
                    transform: `translateY(${(-anim.lift * 58).toFixed(1)}px) scale(${anim.scale.toFixed(3)}) rotateZ(${anim.rotZ.toFixed(1)}deg)`,
                  }}
                >
                  <div
                    className={`ancient-coin ${isBackYang ? 'is-yang' : 'is-yin'}`}
                    style={{
                      transform: `perspective(420px) rotateX(${anim.rotX.toFixed(1)}deg)`,
                    }}
                  >
                    <svg
                      viewBox="0 0 100 100"
                      className="coin-svg"
                      aria-hidden="true"
                    >
                      <defs>
                        <radialGradient id={`coinGrad-${idx}`} cx="35%" cy="30%" r="70%">
                          <stop
                            offset="0%"
                            stopColor={isBackYang ? '#f0d592' : '#d6b36c'}
                          />
                          <stop
                            offset="65%"
                            stopColor={isBackYang ? '#b88a3c' : '#8e6b32'}
                          />
                          <stop offset="100%" stopColor="#5d431b" />
                        </radialGradient>
                      </defs>
                      {/* Outer bronze rim */}
                      <circle
                        cx="50"
                        cy="50"
                        r="47"
                        fill={`url(#coinGrad-${idx})`}
                        stroke="var(--accent-gold)"
                        strokeWidth="2.5"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="rgba(255,245,214,0.45)"
                        strokeWidth="1.2"
                      />
                      {/* Center square hole */}
                      <rect
                        x="38"
                        y="38"
                        width="24"
                        height="24"
                        rx="2"
                        fill="var(--bg-elevated)"
                        stroke="rgba(255,236,184,0.75)"
                        strokeWidth="2"
                      />
                      {!isBackYang ? (
                        /* 正面：汉字面（阴 = 2） */
                        <g
                          fill="#2b1c07"
                          fontSize="13.5"
                          fontWeight="800"
                          className="font-serif-classical"
                          textAnchor="middle"
                          dominantBaseline="central"
                        >
                          <text x="50" y="21">通</text>
                          <text x="50" y="79">宝</text>
                          <text x="21" y="50">易</text>
                          <text x="79" y="50">象</text>
                        </g>
                      ) : (
                        /* 背面：阳纹（阳 = 3） */
                        <g
                          stroke="#3a260a"
                          strokeWidth="2.2"
                          fill="none"
                          strokeLinecap="round"
                        >
                          <path d="M 38 22 Q 50 14 62 22" />
                          <path d="M 38 78 Q 50 86 62 78" />
                          <circle cx="22" cy="50" r="4" fill="#3a260a" />
                          <circle cx="78" cy="50" r="4" fill="#3a260a" />
                        </g>
                      )}
                    </svg>
                  </div>
                  <span className="coin-face-caption font-mono-code">
                    {isBackYang ? '背 · 阳(3)' : '字 · 阴(2)'}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="coin-tray-hint">
            {isComplete
              ? '六爻已齐，请查看右侧解卦结果'
              : isTossing
              ? `正在摇第 ${lines.length + 1} 爻（${YAO_TITLES[lines.length]}）...`
              : `点击盘面或下方按钮，掷第 ${lines.length + 1} 爻（${YAO_TITLES[lines.length]}）`}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="divination-actions">
          <button
            type="button"
            className="primary-cast-btn"
            disabled={isTossing || isAutoCasting || isComplete}
            onClick={() => tossOnce()}
          >
            <Coins size={16} />
            {isComplete
              ? '六爻已成'
              : `掷第 ${lines.length + 1} 爻（${YAO_TITLES[lines.length]}）`}
          </button>

          <button
            type="button"
            className="chip-toggle active"
            disabled={isAutoCasting || isComplete}
            onClick={() => setIsAutoCasting(true)}
            style={{ opacity: isComplete ? 0.45 : 1 }}
          >
            <FastForward size={14} /> 一键连掷六爻
          </button>
        </div>

        {/* Rule Reference Pills */}
        <div className="coin-rules-strip">
          <span>
            <strong>6</strong>（三字）= 老阴 ×
          </span>
          <span>
            <strong>7</strong>（两字一背）= 少阳
          </span>
          <span>
            <strong>8</strong>（一字两背）= 少阴
          </span>
          <span>
            <strong>9</strong>（三背）= 老阳 ○
          </span>
        </div>
      </section>

      {/* Right: Live 6-Yao Stack & Hexagram Interpretation */}
      <aside className="panel-card lab-card">
        <div>
          <span className="primer-pill">
            <Sparkles size={13} /> 成卦与解卦推演
          </span>
          <h3
            className="font-serif-classical"
            style={{ margin: '8px 0 4px', fontSize: '1.25rem' }}
          >
            六爻叠加（初爻在下 → 上爻在顶）
          </h3>
        </div>

        {/* 6-Line Visual Stack (Bottom to Top) */}
        <div className="hexagram-stack-box">
          {[5, 4, 3, 2, 1, 0].map((idx) => {
            const line = lines[idx];
            const isUpperBoundary = idx === 3;
            return (
              <div
                key={idx}
                className={`hex-line-row ${
                  isUpperBoundary ? 'with-divider' : ''
                }`}
              >
                <span className="hex-line-pos">{YAO_TITLES[idx]}</span>
                <div className="hex-line-graphic">
                  {!line ? (
                    <span className="hex-line-placeholder" />
                  ) : line.baseBit === 1 ? (
                    <span
                      className={`hex-bar-yang ${
                        line.isMoving ? 'is-moving' : ''
                      }`}
                    />
                  ) : (
                    <>
                      <span
                        className={`hex-bar-yin ${
                          line.isMoving ? 'is-moving' : ''
                        }`}
                      />
                      <span
                        className={`hex-bar-yin ${
                          line.isMoving ? 'is-moving' : ''
                        }`}
                      />
                    </>
                  )}
                </div>
                <span className="hex-line-meta font-mono-code">
                  {line ? `${line.sum} · ${line.label}` : '待掷'}
                </span>
              </div>
            );
          })}
        </div>

        {/* Interpretation Panel once 6 lines are cast */}
        {!result ? (
          <div className="quote-box">
            <strong>起卦进度：{lines.length} / 6 爻。</strong>
            前三爻组成<strong>下卦（内卦）</strong>，后三爻组成<strong>上卦（外卦）</strong>。六爻全部掷出后，将自动匹配《周易》六十四卦、分析上下卦五行生克，并在出现老阳(9)/老阴(6)时推演<strong>变卦（之卦）</strong>。
          </div>
        ) : (
          <div className="divination-result-stack">
            {question.trim() && (
              <div className="attr-item">
                <div className="attr-label">本次占问主题</div>
                <div className="attr-value">{question.trim()}</div>
              </div>
            )}

            {/* Main Hexagram + Optional Changed Hexagram */}
            <div className="hex-result-hero">
              <div className="hex-card-mini main">
                <div className="hex-card-tag">本卦 · 第 {result.baseHex.number} 卦</div>
                <div className="hex-card-symbol">{result.baseHex.symbol}</div>
                <div className="hex-card-name font-serif-classical">
                  {result.baseHex.fullName}
                </div>
                <div className="hex-card-trend">{result.baseHex.trend}</div>
              </div>

              {result.hasMoving && (
                <>
                  <div className="hex-transform-arrow">
                    <ArrowRight size={18} />
                    <span>{result.movingLines.length} 动爻</span>
                  </div>
                  <div className="hex-card-mini changed">
                    <div className="hex-card-tag">
                      变卦（之卦）· 第 {result.changedHex.number} 卦
                    </div>
                    <div className="hex-card-symbol">
                      {result.changedHex.symbol}
                    </div>
                    <div className="hex-card-name font-serif-classical">
                      {result.changedHex.fullName}
                    </div>
                    <div className="hex-card-trend">
                      {result.changedHex.trend}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Trigram Composition & Jump to Mingpan */}
            <div className="attr-grid">
              <button
                type="button"
                className="attr-item clickable-attr"
                onClick={() => onJumpToMingpan(result.upperBase.id)}
              >
                <div className="attr-label">上卦（外卦 · 环境）</div>
                <div className="attr-value">
                  {result.upperBase.symbol} {result.upperBase.name}（
                  {result.upperBase.nature} ·{' '}
                  {ELEMENTS[result.upperBase.element].name}）
                </div>
              </button>
              <button
                type="button"
                className="attr-item clickable-attr"
                onClick={() => onJumpToMingpan(result.lowerBase.id)}
              >
                <div className="attr-label">下卦（内卦 · 自身）</div>
                <div className="attr-value">
                  {result.lowerBase.symbol} {result.lowerBase.name}（
                  {result.lowerBase.nature} ·{' '}
                  {ELEMENTS[result.lowerBase.element].name}）
                </div>
              </button>
            </div>

            <div className="quote-box">
              <strong>卦辞要义：</strong>
              {result.baseHex.judgment}
            </div>

            <div className="section-block">
              <h4 className="section-heading">白话启发与行动参考</h4>
              <p className="section-body">{result.baseHex.advice}</p>
            </div>

            <div className="section-block">
              <h4 className="section-heading">上下经卦五行联动</h4>
              <p className="section-body">{result.wxRelation}</p>
            </div>

            {result.hasMoving && (
              <div className="section-block">
                <h4 className="section-heading">
                  变卦趋势（{result.changedHex.fullName}）
                </h4>
                <p className="section-body">
                  动爻位于{' '}
                  <strong>
                    {result.movingLines
                      .map((l) => YAO_TITLES[l.index])
                      .join('、')}
                  </strong>
                  。事情演变倾向于「{result.changedHex.trend}」：
                  {result.changedHex.advice}
                </p>
              </div>
            )}

            <div className="misconception-box" style={{ fontSize: '0.78rem' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontWeight: 600,
                  marginBottom: 2,
                  color: 'var(--accent-vermilion)',
                }}
              >
                <ShieldAlert size={14} /> 科普说明
              </div>
              本模块演示传统“三钱六爻起卦法”与《周易》六十四卦对应机制，旨在作为文化体验与多角度反思工具，不构成现实决策的宿命论断。
            </div>
          </div>
        )}
      </aside>
    </div>
  );
};
