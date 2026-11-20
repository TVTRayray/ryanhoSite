import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Compass,
  Pause,
  Play,
  Sparkles,
} from 'lucide-react';
import {
  BAGUA_FAMILY,
  ELEMENTS,
  LUOSHU_CELLS,
  LUOSHU_LINES,
  MINGPAN_ANATOMY_STEPS,
  TRIGRAM_LIST,
  TRIGRAMS,
  TrigramId,
  YINYANG_PRINCIPLES,
} from '../data/baguaData';

interface FoundationsPrimerProps {
  onGoToMingpan: (id?: TrigramId) => void;
}

type LessonIndex = 0 | 1 | 2 | 3;

const LESSONS = [
  { id: 0, badge: '第一课', title: '阴阳之道与太极消长' },
  { id: 1, badge: '第二课', title: '洛书九宫与数字规律' },
  { id: 2, badge: '第三课', title: '取象口诀与父母六子' },
  { id: 3, badge: '第四课', title: '读懂命盘的三把钥匙' },
] as const;

// 洛书 1→9 飞宫轨迹坐标（3x3 中心点）
const LUOSHU_PATH_COORDS: Record<number, { x: number; y: number }> = {
  4: { x: 55, y: 55 },
  9: { x: 165, y: 55 },
  2: { x: 275, y: 55 },
  3: { x: 55, y: 165 },
  5: { x: 165, y: 165 },
  7: { x: 275, y: 165 },
  8: { x: 55, y: 275 },
  1: { x: 165, y: 275 },
  6: { x: 275, y: 275 },
};

export const FoundationsPrimer: React.FC<FoundationsPrimerProps> = ({
  onGoToMingpan,
}) => {
  const [lesson, setLesson] = useState<LessonIndex>(0);

  // Lesson 1: JS-driven Taiji rotation & Yin-Yang balance wave
  const [taijiAngle, setTaijiAngle] = useState(0);
  const [isTaijiPlaying, setIsTaijiPlaying] = useState(true);
  const [yangRatio, setYangRatio] = useState(50); // 15..85
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (lesson !== 0 || !isTaijiPlaying) return;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = now - last;
      last = now;
      setTaijiAngle((a) => (a + dt * 0.025) % 360);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [lesson, isTaijiPlaying]);

  // Lesson 2: LuoShu line highlight & 1->9 flight path animation
  const [activeLineIdx, setActiveLineIdx] = useState<number>(4); // 中竖 9+5+1
  const [showLuoShuFlight, setShowLuoShuFlight] = useState(true);
  const [flightStep, setFlightStep] = useState(9);

  useEffect(() => {
    if (lesson !== 1 || !showLuoShuFlight) return;
    const timer = window.setInterval(() => {
      setFlightStep((prev) => (prev >= 9 ? 1 : prev + 1));
    }, 650);
    return () => window.clearInterval(timer);
  }, [lesson, showLuoShuFlight]);

  // Lesson 3: Focused mnemonic trigram
  const [focusTrigram, setFocusTrigram] = useState<TrigramId>('qian');

  // Lesson 4: Concentric layer reveal & South-up compass rotation
  const [activeLayer, setActiveLayer] = useState<number>(4);
  const [demoSouthUp, setDemoSouthUp] = useState(true);

  const getSeasonCue = (ratio: number) => {
    if (ratio >= 72) return '盛夏 / 正午（阳极生阴之机）';
    if (ratio >= 55) return '春夏之交（阳气升腾为主）';
    if (ratio >= 45) return '春分 / 秋分（阴阳均平流转）';
    if (ratio >= 28) return '秋冬之交（阴气收敛为主）';
    return '深冬 / 子夜（阴极一阳初动）';
  };

  const activeLineNums = LUOSHU_LINES[activeLineIdx].nums;
  const flightPoints = Array.from({ length: flightStep }, (_, i) => i + 1)
    .map((n) => `${LUOSHU_PATH_COORDS[n].x},${LUOSHU_PATH_COORDS[n].y}`)
    .join(' ');

  return (
    <div className="primer-shell">
      {/* Top 4-Step Progress Stepper */}
      <div className="panel-card lesson-stepper-card">
        <div className="lesson-stepper">
          {LESSONS.map((item) => {
            const isActive = lesson === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={`lesson-step-btn ${isActive ? 'active' : ''}`}
                onClick={() => setLesson(item.id)}
              >
                <span className="lesson-step-badge">{item.badge}</span>
                <span className="lesson-step-title">{item.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Lesson 1: Taiji & Yin-Yang */}
      {lesson === 0 && (
        <div className="lesson-grid">
          <div className="panel-card lab-card">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
                flexWrap: 'wrap',
              }}
            >
              <div>
                <span className="primer-pill">第一课 · 宇宙底层二元</span>
                <h2
                  className="font-serif-classical"
                  style={{ margin: '8px 0 4px', fontSize: '1.35rem' }}
                >
                  太极流转与“阴阳消长”互动演示
                </h2>
              </div>
              <button
                type="button"
                className={`chip-toggle ${isTaijiPlaying ? 'active' : ''}`}
                onClick={() => setIsTaijiPlaying((v) => !v)}
              >
                {isTaijiPlaying ? <Pause size={13} /> : <Play size={13} />}
                {isTaijiPlaying ? '暂停太极流转' : '启动太极流转'}
              </button>
            </div>

            <div className="taiji-stage">
              <svg
                viewBox="-130 -130 260 260"
                style={{ width: 220, height: 220, display: 'block' }}
                role="img"
                aria-label="动态旋转太极图"
              >
                <circle
                  cx="0"
                  cy="0"
                  r="116"
                  fill="none"
                  stroke="var(--ring-divider)"
                  strokeDasharray="4 4"
                />
                <g transform={`rotate(${taijiAngle.toFixed(2)})`}>
                  <circle
                    cx="0"
                    cy="0"
                    r="96"
                    fill="var(--taiji-yang)"
                    stroke="var(--accent-gold)"
                    strokeWidth="2.5"
                  />
                  <path
                    d="M 0 -96 A 96 96 0 0 1 0 96 A 48 48 0 0 1 0 0 A 48 48 0 0 0 0 -96 Z"
                    fill="var(--taiji-yin)"
                  />
                  {/* 阴中有阳、阳中有阴（鱼眼随消长比例微调） */}
                  <circle
                    cx="0"
                    cy="-48"
                    r={8 + (yangRatio / 100) * 9}
                    fill="var(--taiji-yin)"
                  />
                  <circle
                    cx="0"
                    cy="48"
                    r={8 + ((100 - yangRatio) / 100) * 9}
                    fill="var(--taiji-yang)"
                  />
                </g>
              </svg>

              <div className="yin-yang-slider-box">
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.84rem',
                    fontWeight: 600,
                  }}
                >
                  <span style={{ color: 'var(--accent-gold)' }}>
                    阳气（动 / 明 / 热）：{yangRatio}%
                  </span>
                  <span style={{ color: 'var(--text-secondary)' }}>
                    阴气（静 / 暗 / 寒）：{100 - yangRatio}%
                  </span>
                </div>
                <input
                  type="range"
                  min={15}
                  max={85}
                  value={yangRatio}
                  onChange={(e) => setYangRatio(Number(e.target.value))}
                  className="gold-range"
                  aria-label="阴阳消长比例滑块"
                />
                <div className="balance-bar-track">
                  <div
                    className="balance-bar-yang"
                    style={{ width: `${yangRatio}%` }}
                  />
                </div>
                <div
                  style={{
                    fontSize: '0.82rem',
                    color: 'var(--accent-gold)',
                    textAlign: 'center',
                  }}
                >
                  当前节律状态：{getSeasonCue(yangRatio)}
                </div>
              </div>
            </div>
          </div>

          <div className="panel-card lab-card">
            <div>
              <h3
                className="font-serif-classical"
                style={{ margin: '0 0 8px', fontSize: '1.2rem' }}
              >
                先破除一个最大误区：阴阳 ≠ 好坏善恶
              </h3>
              <p className="section-body">
                在传统命盘里，“阳”代表显发、扩张、温热、刚健；“阴”代表收敛、承载、沉潜、柔顺。就像白天与黑夜、吸气与呼气，缺一不可。
              </p>
            </div>

            <div className="principle-grid">
              {YINYANG_PRINCIPLES.map((p) => (
                <div className="attr-item" key={p.title}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'baseline',
                      marginBottom: 4,
                    }}
                  >
                    <strong
                      className="font-serif-classical"
                      style={{ color: 'var(--accent-gold)', fontSize: '1rem' }}
                    >
                      {p.title}
                    </strong>
                    <span
                      className="font-mono-code"
                      style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}
                    >
                      {p.en}
                    </span>
                  </div>
                  <p
                    style={{
                      margin: '0 0 6px',
                      fontSize: '0.82rem',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.55,
                    }}
                  >
                    {p.desc}
                  </p>
                  <div
                    style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}
                  >
                    例：{p.example}
                  </div>
                </div>
              ))}
            </div>

            <div className="quote-box">
              <strong>与命盘的连接：</strong>
              将太极中的阳记为实线 <span className="font-mono-code">—</span>（阳爻），阴记为断线{' '}
              <span className="font-mono-code">- -</span>（阴爻），叠放三次，便诞生了标定天地万象的“八卦”。
            </div>
          </div>
        </div>
      )}

      {/* Lesson 2: LuoShu Magic Square */}
      {lesson === 1 && (
        <div className="lesson-grid">
          <div className="panel-card lab-card">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 10,
                flexWrap: 'wrap',
              }}
            >
              <div>
                <span className="primer-pill">第二课 · 空间数字骨架</span>
                <h2
                  className="font-serif-classical"
                  style={{ margin: '8px 0 4px', fontSize: '1.35rem' }}
                >
                  洛书九宫格与“1→9 飞宫轨迹”
                </h2>
              </div>
              <button
                type="button"
                className={`chip-toggle ${showLuoShuFlight ? 'active' : ''}`}
                onClick={() => setShowLuoShuFlight((v) => !v)}
              >
                {showLuoShuFlight ? <Pause size={13} /> : <Play size={13} />}
                {showLuoShuFlight ? '暂停 1→9 轨迹' : '播放 1→9 轨迹'}
              </button>
            </div>

            <div className="luoshu-svg-wrap">
              <svg
                viewBox="0 0 330 330"
                style={{ width: '100%', maxWidth: 330, display: 'block' }}
                role="img"
                aria-label="洛书九宫格互动图"
              >
                {/* 3x3 Cells */}
                {LUOSHU_CELLS.map((cell) => {
                  const x = 10 + cell.col * 105;
                  const y = 10 + cell.row * 105;
                  const isInActiveLine = activeLineNums.includes(cell.num);
                  const isCurrentFlight =
                    showLuoShuFlight && cell.num === flightStep;
                  const elColor = ELEMENTS[cell.element].color;
                  const tri = cell.trigramId ? TRIGRAMS[cell.trigramId] : null;
                  return (
                    <g key={cell.num}>
                      <rect
                        x={x}
                        y={y}
                        width={96}
                        height={96}
                        rx={12}
                        fill={
                          isCurrentFlight
                            ? 'var(--sector-active)'
                            : isInActiveLine
                            ? 'var(--accent-gold-dim)'
                            : 'var(--bg-elevated)'
                        }
                        stroke={
                          isCurrentFlight
                            ? 'var(--accent-vermilion)'
                            : isInActiveLine
                            ? 'var(--accent-gold)'
                            : 'var(--border-subtle)'
                        }
                        strokeWidth={isCurrentFlight ? 2.2 : 1.2}
                      />
                      <text
                        x={x + 48}
                        y={y + 34}
                        textAnchor="middle"
                        fill={elColor}
                        fontSize="24"
                        fontWeight="700"
                        className="font-serif-classical"
                      >
                        {cell.num}
                      </text>
                      <text
                        x={x + 48}
                        y={y + 58}
                        textAnchor="middle"
                        fill="var(--text-primary)"
                        fontSize="12.5"
                        fontWeight="600"
                      >
                        {tri ? `${tri.symbol} ${tri.name}` : '中五土'}
                      </text>
                      <text
                        x={x + 48}
                        y={y + 78}
                        textAnchor="middle"
                        fill="var(--text-muted)"
                        fontSize="10"
                      >
                        {cell.direction}
                      </text>
                    </g>
                  );
                })}

                {/* 1->9 Flight Path Overlay */}
                {showLuoShuFlight && flightStep > 1 && (
                  <g pointerEvents="none">
                    <polyline
                      points={flightPoints}
                      fill="none"
                      stroke="var(--accent-vermilion)"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeOpacity="0.82"
                    />
                    <circle
                      cx={LUOSHU_PATH_COORDS[flightStep].x}
                      cy={LUOSHU_PATH_COORDS[flightStep].y}
                      r="7"
                      fill="var(--accent-vermilion)"
                    />
                  </g>
                )}
              </svg>
            </div>
          </div>

          <div className="panel-card lab-card">
            <div>
              <h3
                className="font-serif-classical"
                style={{ margin: '0 0 8px', fontSize: '1.2rem' }}
              >
                “戴九履一，左三右七，二四为肩，六八为足”
              </h3>
              <p className="section-body">
                相传大禹治水时见神龟背甲数字排列（洛书），是世界上最早的三阶幻方。它的神奇之处在于：<strong>任意横、竖、斜三条连线相加恒等于 15</strong>，体现出空间各方位能量的绝对平衡。
              </p>
            </div>

            <div>
              <div className="section-heading" style={{ marginBottom: 8 }}>
                点击验证八条“和为 15”的平衡轴线：
              </div>
              <div className="luoshu-lines-grid">
                {LUOSHU_LINES.map((line, idx) => (
                  <button
                    key={line.label}
                    type="button"
                    className={`chip-toggle ${
                      activeLineIdx === idx ? 'active' : ''
                    }`}
                    onClick={() => setActiveLineIdx(idx)}
                  >
                    {line.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="quote-box">
              <strong>为什么命盘里也有数字 1–9？</strong>
              后天八卦直接套用了洛书九宫格：<strong>9 离居南、1 坎居北、3 震居东、7 兑居西</strong>，数字 5 留给中央（太极皇极土），其余四数填补四隅。
            </div>
          </div>
        </div>
      )}

      {/* Lesson 3: Mnemonics & Bagua Family */}
      {lesson === 2 && (
        <div className="lesson-grid">
          <div className="panel-card lab-card">
            <div>
              <span className="primer-pill">第三课 · 见形识卦</span>
              <h2
                className="font-serif-classical"
                style={{ margin: '8px 0 4px', fontSize: '1.35rem' }}
              >
                朱熹《八卦取象歌》快速记形
              </h2>
              <p className="section-body">
                点击下方任意卦牌，观察三根爻画的“连与断”如何在脑海里形成画面：
              </p>
            </div>

            <div className="mnemonic-cards-grid">
              {TRIGRAM_LIST.map((t) => {
                const active = focusTrigram === t.id;
                const el = ELEMENTS[t.element];
                return (
                  <button
                    key={t.id}
                    type="button"
                    className={`mnemonic-tile ${active ? 'active' : ''}`}
                    onClick={() => setFocusTrigram(t.id)}
                  >
                    <div
                      style={{
                        fontSize: '1.8rem',
                        lineHeight: 1,
                        color: el.color,
                      }}
                    >
                      {t.symbol}
                    </div>
                    <div
                      className="font-serif-classical"
                      style={{ fontWeight: 700, fontSize: '1rem' }}
                    >
                      {t.mnemonic}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                      {t.nature} · 属{el.name}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Trigram Animated Yao Breakdown */}
            <div className="yao-breakdown-box">
              <div className="yao-stack">
                {TRIGRAMS[focusTrigram].yaos.map((bit, idx) => (
                  <div className="yao-line-row" key={idx}>
                    <div className="yao-bar">
                      {bit === 1 ? (
                        <span className="yao-seg-yang" />
                      ) : (
                        <>
                          <span className="yao-seg-yin" />
                          <span className="yao-seg-yin" />
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <div
                  className="font-serif-classical"
                  style={{
                    fontSize: '1.08rem',
                    fontWeight: 700,
                    marginBottom: 4,
                  }}
                >
                  {TRIGRAMS[focusTrigram].name}卦（{TRIGRAMS[focusTrigram].mnemonic}）
                </div>
                <p className="section-body" style={{ fontSize: '0.84rem' }}>
                  {TRIGRAMS[focusTrigram].mnemonicExplain}
                </p>
              </div>
            </div>
          </div>

          <div className="panel-card lab-card">
            <div>
              <span className="primer-pill">索卦法则 · 家庭人伦象喻</span>
              <h3
                className="font-serif-classical"
                style={{ margin: '8px 0 6px', fontSize: '1.25rem' }}
              >
                乾父坤母如何生出“六子八卦”？
              </h3>
              <p className="section-body">
                古人把八卦拟人化为一个大家庭，规律口诀是<strong>“阳卦多阴，阴卦多阳（以少者为主）”</strong>：
              </p>
            </div>

            <div className="family-tree-box">
              <div className="family-row">
                {BAGUA_FAMILY.parents.map((p) => {
                  const t = TRIGRAMS[p.id];
                  return (
                    <div
                      key={p.id}
                      className="family-node parent"
                      onClick={() => setFocusTrigram(p.id)}
                    >
                      <span style={{ fontSize: '1.6rem' }}>{t.symbol}</span>
                      <strong>{p.title}</strong>
                      <span>{p.desc}</span>
                    </div>
                  );
                })}
              </div>

              <div className="family-subgrid">
                <div className="family-col">
                  <div className="family-col-title">三男（阳爻少，取阳为主）</div>
                  {BAGUA_FAMILY.sons.map((s) => {
                    const t = TRIGRAMS[s.id];
                    return (
                      <div
                        key={s.id}
                        className={`family-node ${
                          focusTrigram === s.id ? 'active' : ''
                        }`}
                        onClick={() => setFocusTrigram(s.id)}
                      >
                        <span style={{ fontSize: '1.35rem' }}>{t.symbol}</span>
                        <div>
                          <strong>{s.title}</strong>
                          <div>{s.rule}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="family-col">
                  <div className="family-col-title">三女（阴爻少，取阴为主）</div>
                  {BAGUA_FAMILY.daughters.map((d) => {
                    const t = TRIGRAMS[d.id];
                    return (
                      <div
                        key={d.id}
                        className={`family-node ${
                          focusTrigram === d.id ? 'active' : ''
                        }`}
                        onClick={() => setFocusTrigram(d.id)}
                      >
                        <span style={{ fontSize: '1.35rem' }}>{t.symbol}</span>
                        <div>
                          <strong>{d.title}</strong>
                          <div>{d.rule}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lesson 4: 3 Keys to Reading a Mingpan */}
      {lesson === 3 && (
        <div className="lesson-grid">
          <div className="panel-card lab-card">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 10,
                flexWrap: 'wrap',
              }}
            >
              <div>
                <span className="primer-pill">第四课 · 盘面结构拆解</span>
                <h2
                  className="font-serif-classical"
                  style={{ margin: '8px 0 4px', fontSize: '1.35rem' }}
                >
                  命盘同心圆逐层拆解示意
                </h2>
              </div>
              <button
                type="button"
                className="chip-toggle active"
                onClick={() => setDemoSouthUp((v) => !v)}
              >
                <Compass size={13} />
                {demoSouthUp ? '古法：上南下北' : '现代：上北下南'}
              </button>
            </div>

            <div className="anatomy-svg-box">
              <svg
                viewBox="-175 -175 350 350"
                style={{ width: '100%', maxWidth: 320, display: 'block' }}
                role="img"
                aria-label="命盘四层同心圆拆解图"
              >
                {/* Layer 4: Earthly Branches */}
                <circle
                  cx="0"
                  cy="0"
                  r="146"
                  fill={
                    activeLayer === 4
                      ? 'var(--accent-gold-dim)'
                      : 'var(--bg-elevated)'
                  }
                  stroke={
                    activeLayer >= 4
                      ? 'var(--accent-gold)'
                      : 'var(--border-subtle)'
                  }
                  strokeWidth={activeLayer === 4 ? 2.2 : 1}
                  style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                  onClick={() => setActiveLayer(4)}
                />
                <text
                  x="0"
                  y="-126"
                  textAnchor="middle"
                  fill="var(--text-secondary)"
                  fontSize="11"
                >
                  4. 十二地支时辰环（子午卯酉）
                </text>

                {/* Layer 3: Bagua */}
                <circle
                  cx="0"
                  cy="0"
                  r="112"
                  fill={
                    activeLayer === 3
                      ? 'var(--sector-active)'
                      : 'var(--bg-surface)'
                  }
                  stroke={
                    activeLayer >= 3
                      ? 'var(--accent-gold)'
                      : 'var(--border-subtle)'
                  }
                  strokeWidth={activeLayer === 3 ? 2.2 : 1}
                  style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                  onClick={() => setActiveLayer(3)}
                />
                <text
                  x="0"
                  y="-92"
                  textAnchor="middle"
                  fill="var(--text-primary)"
                  fontSize="11"
                  fontWeight="600"
                >
                  3. 八宫卦象环（初爻向心）
                </text>

                {/* Layer 2: WuXing */}
                <circle
                  cx="0"
                  cy="0"
                  r="76"
                  fill={
                    activeLayer === 2
                      ? 'rgba(78, 159, 118, 0.2)'
                      : 'var(--bg-elevated)'
                  }
                  stroke={
                    activeLayer >= 2 ? '#4E9F76' : 'var(--border-subtle)'
                  }
                  strokeWidth={activeLayer === 2 ? 2.2 : 1}
                  style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                  onClick={() => setActiveLayer(2)}
                />
                <text
                  x="0"
                  y="-55"
                  textAnchor="middle"
                  fill="#4E9F76"
                  fontSize="10.5"
                  fontWeight="600"
                >
                  2. 五行生克环
                </text>

                {/* Layer 1: Taiji Core */}
                <circle
                  cx="0"
                  cy="0"
                  r="40"
                  fill={
                    activeLayer === 1
                      ? 'var(--accent-vermilion-soft)'
                      : 'var(--bg-surface)'
                  }
                  stroke="var(--accent-vermilion)"
                  strokeWidth={activeLayer === 1 ? 2.4 : 1.4}
                  style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                  onClick={() => setActiveLayer(1)}
                />
                <text
                  x="0"
                  y="4"
                  textAnchor="middle"
                  fill="var(--accent-gold)"
                  fontSize="11"
                  fontWeight="700"
                  className="font-serif-classical"
                >
                  1. 太极中五
                </text>

                {/* Cardinal Compass Indicators */}
                <g
                  style={{
                    transform: `rotate(${demoSouthUp ? 0 : 180}deg)`,
                    transition: 'transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)',
                  }}
                >
                  <text
                    x="0"
                    y="-156"
                    textAnchor="middle"
                    fill="var(--accent-vermilion)"
                    fontSize="12"
                    fontWeight="700"
                  >
                    南 · 离火(夏)
                  </text>
                  <text
                    x="0"
                    y="164"
                    textAnchor="middle"
                    fill="#4E86B8"
                    fontSize="12"
                    fontWeight="700"
                  >
                    北 · 坎水(冬)
                  </text>
                  <text
                    x="-158"
                    y="4"
                    textAnchor="middle"
                    fill="#4E9F76"
                    fontSize="11"
                    fontWeight="700"
                  >
                    东
                  </text>
                  <text
                    x="158"
                    y="4"
                    textAnchor="middle"
                    fill="#9BAEC4"
                    fontSize="11"
                    fontWeight="700"
                  >
                    西
                  </text>
                </g>
              </svg>
            </div>
          </div>

          <div className="panel-card lab-card">
            <div>
              <h3
                className="font-serif-classical"
                style={{ margin: '0 0 8px', fontSize: '1.2rem' }}
              >
                点击左侧圆环，读懂传统命盘的三把钥匙
              </h3>
              <p className="section-body">
                所有看似复杂的中国传统盘式（罗盘、奇门、紫微、玄空），底层几乎都共用这套“四圈同心”的时空坐标系：
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {MINGPAN_ANATOMY_STEPS.map((item) => {
                const active = activeLayer === item.layer;
                return (
                  <button
                    key={item.layer}
                    type="button"
                    className={`anatomy-step-card ${active ? 'active' : ''}`}
                    onClick={() => setActiveLayer(item.layer)}
                  >
                    <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>
                      {item.name}
                    </div>
                    <div
                      style={{
                        fontSize: '0.82rem',
                        color: 'var(--text-secondary)',
                        marginTop: 3,
                        lineHeight: 1.5,
                      }}
                    >
                      {item.desc}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="quote-box">
              <strong>第一把钥匙（朝向）：</strong>古代圣贤“坐北朝南”观测天象，故南离火在上方、北坎水在下方、东震木在左、西兑金在右。
              <br />
              <strong>第二把钥匙（爻向）：</strong>圆盘上的三画卦永远<strong>初爻朝内（圆心）、上爻朝外</strong>。
            </div>
          </div>
        </div>
      )}

      {/* Bottom Lesson Navigation Footer */}
      <div className="panel-card lesson-footer-bar">
        <button
          type="button"
          className="chip-toggle"
          disabled={lesson === 0}
          onClick={() => setLesson((prev) => Math.max(0, prev - 1) as LessonIndex)}
          style={{ opacity: lesson === 0 ? 0.45 : 1 }}
        >
          <ChevronLeft size={15} /> 上一课
        </button>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {lesson < 3 ? (
            <button
              type="button"
              className="chip-toggle active"
              onClick={() =>
                setLesson((prev) => Math.min(3, prev + 1) as LessonIndex)
              }
            >
              下一课：{LESSONS[lesson + 1].title} <ChevronRight size={15} />
            </button>
          ) : (
            <button
              type="button"
              className="chip-toggle active"
              onClick={() => onGoToMingpan('li')}
            >
              <Sparkles size={14} /> 已掌握入门，进入完整交互命盘{' '}
              <ArrowRight size={15} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
