import React, { useEffect, useState } from 'react';
import {
  BookOpen,
  Compass,
  Flame,
  GitBranch,
  Layers,
  Moon,
  Sun,
} from 'lucide-react';
import {
  ArrangementMode,
  ELEMENTS,
  OrientationMode,
  TRIGRAM_LIST,
  TrigramId,
} from './data/baguaData';
import { MingpanWheel } from './components/MingpanWheel';
import { TrigramInspector } from './components/TrigramInspector';
import { YaoLab } from './components/YaoLab';
import { WuXingMatrix } from './components/WuXingMatrix';
import { KnowledgeGlossary } from './components/KnowledgeGlossary';

type ActiveTab = 'mingpan' | 'yao-lab' | 'wuxing' | 'glossary';
type ThemeMode = 'ink' | 'paper';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('mingpan');
  const [theme, setTheme] = useState<ThemeMode>('ink');
  const [arrangement, setArrangement] = useState<ArrangementMode>('houtian');
  const [orientation, setOrientation] = useState<OrientationMode>('south-up');
  const [selectedTrigram, setSelectedTrigram] = useState<TrigramId>('li');

  // Layer toggles on the Mingpan wheel
  const [showBranches, setShowBranches] = useState(true);
  const [showRelations, setShowRelations] = useState(true);
  const [showOrderPath, setShowOrderPath] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const jumpToMingpanTrigram = (id: TrigramId) => {
    setSelectedTrigram(id);
    setActiveTab('mingpan');
  };

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
                从“阴爻阳爻 → 先后天八卦 → 五行生克 → 十二地支时辰”读懂传统命盘底层坐标系
              </p>
            </div>
          </div>

          <nav className="nav-tabs" aria-label="科普模块导航">
            <button
              type="button"
              className={`nav-tab ${activeTab === 'mingpan' ? 'active' : ''}`}
              onClick={() => setActiveTab('mingpan')}
            >
              <Compass size={15} />
              基础命盘示意
            </button>
            <button
              type="button"
              className={`nav-tab ${activeTab === 'yao-lab' ? 'active' : ''}`}
              onClick={() => setActiveTab('yao-lab')}
            >
              <GitBranch size={15} />
              三爻生卦实验
            </button>
            <button
              type="button"
              className={`nav-tab ${activeTab === 'wuxing' ? 'active' : ''}`}
              onClick={() => setActiveTab('wuxing')}
            >
              <Flame size={15} />
              五行生克矩阵
            </button>
            <button
              type="button"
              className={`nav-tab ${activeTab === 'glossary' ? 'active' : ''}`}
              onClick={() => setActiveTab('glossary')}
            >
              <BookOpen size={15} />
              对照表与边界
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
            <span className="primer-pill">Step 1 · 基础盘式认知</span>
            <span>
              {activeTab === 'mingpan' &&
                '点击盘面任意卦位，可联动查看该卦的“爻画结构（初爻向心）、先/后天方位差异、对应时辰与五行生克关系”。'}
              {activeTab === 'yao-lab' &&
                '八卦并非死记硬背的符号，而是由“阴爻(- -)与阳爻(—)”自下而上三次叠加的二进制自然模型。'}
              {activeTab === 'wuxing' &&
                '如果说八卦搭建了空间的八个方位坐标，五行（木火土金水）则是驱动盘面能量循环的生克动力规则。'}
              {activeTab === 'glossary' &&
                '整理中英文标准译名、八宫对应全表，以及“科普符号认知”与“专业术数推演”的知识边界说明。'}
            </span>
          </div>
        </div>

        {/* View 1: Interactive Mingpan Explorer */}
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
                    onClick={() => setArrangement('xiantian')}
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

              {/* Layer Toggles */}
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
                  <Layers size={13} /> 盘层叠加：
                </span>
                <button
                  type="button"
                  className={`chip-toggle ${showBranches ? 'active' : ''}`}
                  onClick={() => setShowBranches((v) => !v)}
                >
                  十二地支时辰外环
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
                    ? '先天S线与四组对宫'
                    : '后天顺时针四季流转'}
                </button>
              </div>

              {/* Interactive SVG Wheel */}
              <div className="wheel-wrapper">
                <MingpanWheel
                  arrangement={arrangement}
                  orientation={orientation}
                  selectedId={selectedTrigram}
                  onSelectTrigram={setSelectedTrigram}
                  showBranches={showBranches}
                  showRelations={showRelations}
                  showOrderPath={showOrderPath}
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
                      onClick={() => setSelectedTrigram(t.id)}
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
                    ? '当前为【后天八卦】：帝出乎震(东) → 相见乎离(南) → 说言乎兑(西) → 劳乎坎(北)，呈“木→火→土→金→水”四季顺生秩序，是传统命盘（如奇门、风水罗盘、节气）的通用地盘底图。'
                    : '当前为【先天八卦】：乾南坤北“天地定位”，离东坎西“水火不相射”，按 1乾→8坤 呈对称S形分布，揭示宇宙阴阳对待的静态本源结构。'}
                </span>
                <span className="font-mono-code" style={{ opacity: 0.85 }}>
                  {orientation === 'south-up'
                    ? '朝向：上南下北 左东右西'
                    : '朝向：上北下南 左西右东'}
                </span>
              </div>
            </section>

            {/* Right: Contextual Trigram Inspector */}
            <aside>
              <TrigramInspector
                trigramId={selectedTrigram}
                arrangement={arrangement}
                onSelectTrigram={setSelectedTrigram}
              />
            </aside>
          </div>
        )}

        {/* View 2: Yao Lab */}
        {activeTab === 'yao-lab' && (
          <YaoLab onJumpToMingpan={jumpToMingpanTrigram} />
        )}

        {/* View 3: WuXing Matrix */}
        {activeTab === 'wuxing' && (
          <WuXingMatrix onJumpToTrigram={jumpToMingpanTrigram} />
        )}

        {/* View 4: Glossary & Scope */}
        {activeTab === 'glossary' && (
          <KnowledgeGlossary onJumpToTrigram={jumpToMingpanTrigram} />
        )}
      </main>

      <footer className="footer-note">
        <span>
          八卦与五行基础命盘科普示意 · Step 1（模块化数据结构，支持后续扩展六十四卦、历法干支或个人排盘层）
        </span>
        <span>
          知识参考溯源已整理于「对照表与边界」及项目{' '}
          <span className="font-mono-code">refer.md</span>
        </span>
      </footer>
    </div>
  );
};

export default App;
