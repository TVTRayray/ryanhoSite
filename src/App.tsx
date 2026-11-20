import React, { useEffect, useState } from 'react';
import {
  BookOpen,
  Coins,
  Compass,
  GitBranch,
  GraduationCap,
  Layers,
  Moon,
  Pause,
  Play,
  Sun,
} from 'lucide-react';
import {
  ArrangementMode,
  EARTHLY_BRANCHES,
  ELEMENTS,
  OrientationMode,
  TRIGRAM_LIST,
  TrigramId,
} from './data/baguaData';
import { FoundationsPrimer } from './components/FoundationsPrimer';
import { MingpanWheel } from './components/MingpanWheel';
import { TrigramInspector } from './components/TrigramInspector';
import { WorkshopHub } from './components/WorkshopHub';
import { DivinationCoins } from './components/DivinationCoins';
import { KnowledgeGlossary } from './components/KnowledgeGlossary';

type ActiveTab =
  | 'foundations'
  | 'mingpan'
  | 'workshop'
  | 'divination'
  | 'glossary';
type ThemeMode = 'ink' | 'paper';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('foundations');
  const [theme, setTheme] = useState<ThemeMode>('ink');
  const [arrangement, setArrangement] = useState<ArrangementMode>('houtian');
  const [orientation, setOrientation] = useState<OrientationMode>('south-up');
  const [selectedTrigram, setSelectedTrigram] = useState<TrigramId>('li');

  // Layer toggles on the Mingpan wheel
  const [showBranches, setShowBranches] = useState(true);
  const [showRelations, setShowRelations] = useState(true);
  const [showOrderPath, setShowOrderPath] = useState(false);

  // 十二时辰巡盘演示状态
  const [isTimePlaying, setIsTimePlaying] = useState(false);
  const [activeBranchIndex, setActiveBranchIndex] = useState<number | null>(
    null
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    if (!isTimePlaying) return;
    const timer = window.setInterval(() => {
      setActiveBranchIndex((prev) => {
        const nextIdx = prev === null ? 6 : (prev + 1) % EARTHLY_BRANCHES.length; // 从子时(索引6)起顺流
        setSelectedTrigram(EARTHLY_BRANCHES[nextIdx].trigramId);
        return nextIdx;
      });
    }, 1150);
    return () => window.clearInterval(timer);
  }, [isTimePlaying]);

  const toggleTimeTour = () => {
    if (!isTimePlaying) {
      setArrangement('houtian');
      setShowBranches(true);
      const startIdx = activeBranchIndex ?? 6; // 子时起
      setActiveBranchIndex(startIdx);
      setSelectedTrigram(EARTHLY_BRANCHES[startIdx].trigramId);
      setIsTimePlaying(true);
    } else {
      setIsTimePlaying(false);
    }
  };

  const handleManualSelectTrigram = (id: TrigramId) => {
    setIsTimePlaying(false);
    setActiveBranchIndex(null);
    setSelectedTrigram(id);
  };

  const jumpToMingpanTrigram = (id?: TrigramId) => {
    setIsTimePlaying(false);
    setActiveBranchIndex(null);
    if (id) setSelectedTrigram(id);
    setActiveTab('mingpan');
  };

  const activeBranch =
    activeBranchIndex !== null ? EARTHLY_BRANCHES[activeBranchIndex] : null;

  return (
    <div className="app-shell">
      {/* Top Navigation */}
      <header className="top-header">
        <div className="top-header-inner">
          <div className="brand-group">
            <div className="brand-seal font-serif-classical" aria-hidden="true">
              卦
            </div>
            <div>
              <h1 className="brand-title font-serif-classical">
                八卦基础命盘 · 阴阳五行科普图鉴
              </h1>
              <p className="brand-subtitle">
                五步渐进式科普：基础入门 → 交互命盘 → 爻变五行 → 六爻铜钱卜卦 → 对照总表
              </p>
            </div>
          </div>

          <nav className="nav-tabs" aria-label="科普学习路径">
            <button
              type="button"
              className={`nav-tab ${activeTab === 'foundations' ? 'active' : ''}`}
              onClick={() => setActiveTab('foundations')}
            >
              <GraduationCap size={15} />
              1. 基础入门
            </button>
            <button
              type="button"
              className={`nav-tab ${activeTab === 'mingpan' ? 'active' : ''}`}
              onClick={() => setActiveTab('mingpan')}
            >
              <Compass size={15} />
              2. 交互命盘
            </button>
            <button
              type="button"
              className={`nav-tab ${activeTab === 'workshop' ? 'active' : ''}`}
              onClick={() => setActiveTab('workshop')}
            >
              <GitBranch size={15} />
              3. 规律推演
            </button>
            <button
              type="button"
              className={`nav-tab ${activeTab === 'divination' ? 'active' : ''}`}
              onClick={() => setActiveTab('divination')}
            >
              <Coins size={15} />
              4. 铜钱卜卦
            </button>
            <button
              type="button"
              className={`nav-tab ${activeTab === 'glossary' ? 'active' : ''}`}
              onClick={() => setActiveTab('glossary')}
            >
              <BookOpen size={15} />
              5. 总表与边界
            </button>
          </nav>

          <div className="header-actions">
            <button
              type="button"
              className="theme-toggle"
              onClick={() =>
                setTheme((prev) => (prev === 'ink' ? 'paper' : 'ink'))
              }
              title="切换玄夜星盘 / 宣纸墨韵主题"
            >
              {theme === 'ink' ? <Sun size={15} /> : <Moon size={15} />}
              {theme === 'ink' ? '宣纸素本' : '玄夜星盘'}
            </button>
          </div>
        </div>
      </header>

      <main className="main-content">
        {/* Educational Context Strip */}
        <div className="primer-banner">
          <div className="primer-banner-text">
            <span className="primer-pill">
              {activeTab === 'foundations' && '第 1 站 · 零基础入门'}
              {activeTab === 'mingpan' && '第 2 站 · 命盘全景实操'}
              {activeTab === 'workshop' && '第 3 站 · 底层数理推演'}
              {activeTab === 'divination' && '第 4 站 · 六爻铜钱占卜'}
              {activeTab === 'glossary' && '第 5 站 · 体系边界与索引'}
            </span>
            <span>
              {activeTab === 'foundations' &&
                '先用四节互动微课建立直觉：阴阳消长、洛书九宫（和为15）、八卦口诀与“坐北朝南”读盘规则。'}
              {activeTab === 'mingpan' &&
                '试着切换“先天 ↔ 后天”观看八宫平滑移位动画，或开启“十二时辰流转演示”观察日辰如何沿盘行进。'}
              {activeTab === 'workshop' &&
                '动手翻动三根爻画观察二进制生卦，并在动态粒子流中理解五行相生相克的能量循环。'}
              {activeTab === 'divination' &&
                '体验传统“三钱六爻起卦法”：点击掷出三枚铜钱六次，自下而上成六十四别卦，并自动推演动爻与变卦。'}
              {activeTab === 'glossary' &&
                '完整中英文对照检索表，以及“通用命盘科普”与“专业术数推演”的知识边界声明。'}
            </span>
          </div>
        </div>

        {/* View 1: Foundations Primer */}
        {activeTab === 'foundations' && (
          <FoundationsPrimer onGoToMingpan={jumpToMingpanTrigram} />
        )}

        {/* View 2: Interactive Mingpan Explorer */}
        {activeTab === 'mingpan' && (
          <div className="explorer-grid">
            <section className="panel-card chart-stage">
              <div className="chart-toolbar">
                {/* Arrangement Mode */}
                <div className="segmented-control" role="group" aria-label="盘式切换">
                  <button
                    type="button"
                    className={`segmented-btn ${
                      arrangement === 'houtian' ? 'active' : ''
                    }`}
                    onClick={() => setArrangement('houtian')}
                  >
                    后天八卦（文王 · 流行）
                  </button>
                  <button
                    type="button"
                    className={`segmented-btn ${
                      arrangement === 'xiantian' ? 'active' : ''
                    }`}
                    onClick={() => {
                      setIsTimePlaying(false);
                      setActiveBranchIndex(null);
                      setArrangement('xiantian');
                    }}
                  >
                    先天八卦（伏羲 · 对待）
                  </button>
                </div>

                {/* Orientation Switch */}
                <div className="segmented-control" role="group" aria-label="方位朝向">
                  <button
                    type="button"
                    className={`segmented-btn ${
                      orientation === 'south-up' ? 'active' : ''
                    }`}
                    onClick={() => setOrientation('south-up')}
                  >
                    古法：上南下北
                  </button>
                  <button
                    type="button"
                    className={`segmented-btn ${
                      orientation === 'north-up' ? 'active' : ''
                    }`}
                    onClick={() => setOrientation('north-up')}
                  >
                    现代：上北下南
                  </button>
                </div>
              </div>

              {/* Layer Toggles & Time Tour */}
              <div className="layer-toggles">
                <span
                  style={{
                    fontSize: '0.78rem',
                    color: 'var(--text-muted)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <Layers size={13} /> 盘层与演示：
                </span>
                <button
                  type="button"
                  className={`chip-toggle ${isTimePlaying ? 'active' : ''}`}
                  onClick={toggleTimeTour}
                >
                  {isTimePlaying ? <Pause size={13} /> : <Play size={13} />}
                  {isTimePlaying ? '暂停时辰流转' : '十二时辰流转演示'}
                </button>
                <button
                  type="button"
                  className={`chip-toggle ${showBranches ? 'active' : ''}`}
                  onClick={() => setShowBranches((v) => !v)}
                >
                  十二地支外环
                </button>
                <button
                  type="button"
                  className={`chip-toggle ${showRelations ? 'active' : ''}`}
                  onClick={() => setShowRelations((v) => !v)}
                >
                  五行生克光轨
                </button>
                <button
                  type="button"
                  className={`chip-toggle ${showOrderPath ? 'active' : ''}`}
                  onClick={() => setShowOrderPath((v) => !v)}
                >
                  {arrangement === 'xiantian'
                    ? '先天S线与对宫'
                    : '后天四季流转'}
                </button>
              </div>

              {activeBranch && (
                <div className="time-tour-banner">
                  <span>
                    正在演示十二时辰顺流：<strong>{activeBranch.name}时</strong>（
                    {activeBranch.hourLabel} · {activeBranch.timeRange}）
                  </span>
                  <span style={{ color: 'var(--accent-gold)' }}>
                    归属后天宫位：{TRIGRAM_LIST.find((t) => t.id === activeBranch.trigramId)?.name}卦
                  </span>
                </div>
              )}

              {/* Interactive SVG Wheel */}
              <div className="wheel-wrapper">
                <MingpanWheel
                  arrangement={arrangement}
                  orientation={orientation}
                  selectedId={selectedTrigram}
                  onSelectTrigram={handleManualSelectTrigram}
                  showBranches={showBranches}
                  showRelations={showRelations}
                  showOrderPath={showOrderPath}
                  activeBranchIndex={activeBranchIndex}
                />
              </div>

              {/* Quick Selector Strip */}
              <div className="trigram-quick-strip">
                {TRIGRAM_LIST.map((t) => {
                  const el = ELEMENTS[t.element];
                  return (
                    <button
                      key={t.id}
                      type="button"
                      className={`quick-tri-btn ${
                        selectedTrigram === t.id ? 'active' : ''
                      }`}
                      onClick={() => handleManualSelectTrigram(t.id)}
                    >
                      <span style={{ fontSize: '1.25rem', color: el.color }}>
                        {t.symbol}
                      </span>
                      <span
                        className="font-serif-classical"
                        style={{ fontSize: '0.84rem', fontWeight: 700 }}
                      >
                        {t.name}
                      </span>
                      <span style={{ fontSize: '0.68rem', opacity: 0.78 }}>
                        {t.nature} · {el.name}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Dynamic Explanation Bar */}
              <div className="wheel-caption-bar">
                <span>
                  {arrangement === 'houtian'
                    ? '【后天八卦】按“帝出乎震 → 相见乎离 → 说言乎兑 → 劳乎坎”顺时针推进，将空间方位与春夏秋冬四季、十二时辰融为一体。'
                    : '【先天八卦】乾南坤北“天地定位”，离东坎西“水火不相射”，按 1乾→8坤 对称分布，揭示宇宙阴阳对待的静态本源。'}
                </span>
                <span className="font-mono-code" style={{ opacity: 0.85 }}>
                  {orientation === 'south-up'
                    ? '上南下北 左东右西'
                    : '上北下南 左西右东'}
                </span>
              </div>
            </section>

            {/* Right: Focused Tabbed Trigram Inspector */}
            <aside>
              <TrigramInspector
                trigramId={selectedTrigram}
                arrangement={arrangement}
                onSelectTrigram={handleManualSelectTrigram}
              />
            </aside>
          </div>
        )}

        {/* View 3: Workshop Hub (Yao Lab + WuXing Matrix) */}
        {activeTab === 'workshop' && (
          <WorkshopHub onJumpToMingpan={jumpToMingpanTrigram} />
        )}

        {/* View 4: Six-Yao Coin Divination */}
        {activeTab === 'divination' && (
          <DivinationCoins onJumpToMingpan={jumpToMingpanTrigram} />
        )}

        {/* View 5: Glossary & Scope */}
        {activeTab === 'glossary' && (
          <KnowledgeGlossary onJumpToTrigram={jumpToMingpanTrigram} />
        )}
      </main>

      <footer className="footer-note">
        <span>
          八卦与五行基础命盘科普示意 · 六十四卦铜钱卜卦互动版
        </span>
        <span>
          参考资料索引详见「5. 总表与边界」及{' '}
          <span className="font-mono-code">refer.md</span>
        </span>
      </footer>
    </div>
  );
};

export default App;
