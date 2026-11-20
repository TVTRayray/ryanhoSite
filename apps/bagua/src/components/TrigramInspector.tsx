import React, { useState } from 'react';
import { AlertCircle, Compass, Layers, Sparkles } from 'lucide-react';
import {
  ArrangementMode,
  ELEMENTS,
  TRIGRAM_LIST,
  TRIGRAMS,
  TrigramId,
} from '../data/baguaData';

interface TrigramInspectorProps {
  trigramId: TrigramId;
  arrangement: ArrangementMode;
  onSelectTrigram: (id: TrigramId) => void;
}

type InspectorTab = 'essence' | 'spacetime' | 'relations';

export const TrigramInspector: React.FC<TrigramInspectorProps> = ({
  trigramId,
  arrangement,
  onSelectTrigram,
}) => {
  const [tab, setTab] = useState<InspectorTab>('essence');
  const t = TRIGRAMS[trigramId];
  const el = ELEMENTS[t.element];

  const sameElementTrigrams = TRIGRAM_LIST.filter(
    (other) => other.id !== t.id && other.element === t.element
  );
  const generatedByTrigrams = TRIGRAM_LIST.filter(
    (other) => other.element === el.generatedBy
  );
  const generatesTrigrams = TRIGRAM_LIST.filter(
    (other) => other.element === el.generates
  );
  const overcomeByTrigrams = TRIGRAM_LIST.filter(
    (other) => other.element === el.overcomeBy
  );
  const overcomesTrigrams = TRIGRAM_LIST.filter(
    (other) => other.element === el.overcomes
  );

  const relationGroups = [
    {
      label: `同气比和（${el.name}）`,
      hint: '气息共振',
      items: sameElementTrigrams,
      color: el.color,
    },
    {
      label: `生我者（${ELEMENTS[el.generatedBy].name}生${el.name}）`,
      hint: '能量滋养源',
      items: generatedByTrigrams,
      color: 'var(--el-wood)',
    },
    {
      label: `我生者（${el.name}生${ELEMENTS[el.generates].name}）`,
      hint: '向外显发',
      items: generatesTrigrams,
      color: 'var(--el-wood-bright)',
    },
    {
      label: `克我者（${ELEMENTS[el.overcomeBy].name}克${el.name}）`,
      hint: '规则制约',
      items: overcomeByTrigrams,
      color: 'var(--el-fire)',
    },
    {
      label: `我克者（${el.name}克${ELEMENTS[el.overcomes].name}）`,
      hint: '主动驾驭',
      items: overcomesTrigrams,
      color: 'var(--el-earth)',
    },
  ];

  const yaoNames = ['初爻（内/下）', '二爻（中）', '上爻（外/上）'];

  return (
    <div className="panel-card inspector-card">
      {/* Compact Hero Header */}
      <div className="inspector-hero">
        <div className="trigram-emblem-box">
          <div className="trigram-glyph-badge" style={{ color: el.color }}>
            {t.symbol}
          </div>
          <div>
            <div className="inspector-title-row">
              <h2 className="inspector-title font-serif-classical">
                {t.name}卦 · {t.nature}
              </h2>
              <span className="inspector-pinyin font-mono-code">
                {t.pinyin}
              </span>
            </div>
            <p className="inspector-mnemonic">
              {t.mnemonic} · {t.trait}
            </p>
          </div>
        </div>
        <span
          className="element-badge"
          style={{ color: el.color, background: el.softBg }}
        >
          属{el.name}
        </span>
      </div>

      {/* Focused Sub-Tabs to prevent visual clutter */}
      <div className="inspector-subtabs" role="tablist" aria-label="卦象解析维度">
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'essence'}
          className={`inspector-subtab ${tab === 'essence' ? 'active' : ''}`}
          onClick={() => setTab('essence')}
        >
          <Sparkles size={14} /> 本体与象喻
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'spacetime'}
          className={`inspector-subtab ${tab === 'spacetime' ? 'active' : ''}`}
          onClick={() => setTab('spacetime')}
        >
          <Compass size={14} /> 时空与先/后天
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'relations'}
          className={`inspector-subtab ${tab === 'relations' ? 'active' : ''}`}
          onClick={() => setTab('relations')}
        >
          <Layers size={14} /> 五行生克网
        </button>
      </div>

      {/* Tab 1: Essence & Yao */}
      {tab === 'essence' && (
        <div className="inspector-tab-body">
          <div className="yao-breakdown-box">
            <div className="yao-stack" aria-label="三爻由下至上结构">
              {t.yaos.map((bit, idx) => (
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
            <div className="yao-meta-list">
              {t.yaos
                .map((bit, idx) => ({ bit, idx }))
                .reverse()
                .map(({ bit, idx }) => (
                  <div key={idx}>
                    <strong>{yaoNames[idx]}：</strong>
                    {bit === 1 ? '阳爻（—）' : '阴爻（- -）'}
                  </div>
                ))}
              <div style={{ marginTop: 3, color: 'var(--accent-gold)' }}>
                口诀释义：{t.mnemonicExplain}
              </div>
            </div>
          </div>

          <div className="attr-grid">
            <div className="attr-item">
              <div className="attr-label">家庭人伦角色</div>
              <div className="attr-value">{t.familyRole}</div>
            </div>
            <div className="attr-item">
              <div className="attr-label">英文通用译名</div>
              <div className="attr-value" style={{ fontSize: '0.84rem' }}>
                {t.englishName}
              </div>
            </div>
          </div>

          <div className="section-block">
            <h3 className="section-heading">核心象义解读</h3>
            <p className="section-body">{t.summary}</p>
          </div>

          <div className="misconception-box">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontWeight: 600,
                marginBottom: 4,
                color: 'var(--accent-vermilion)',
              }}
            >
              <AlertCircle size={15} />
              初学者常见误区
            </div>
            {t.commonMisconception}
          </div>
        </div>
      )}

      {/* Tab 2: Space-Time & XianTian vs HouTian */}
      {tab === 'spacetime' && (
        <div className="inspector-tab-body">
          <div className="attr-grid">
            <div className="attr-item">
              <div className="attr-label">先天八卦（体）</div>
              <div className="attr-value">
                {t.xiantian.direction} · 第 {t.xiantian.number} 数
              </div>
            </div>
            <div className="attr-item">
              <div className="attr-label">后天八卦（用）</div>
              <div className="attr-value">
                {t.houtian.direction} · 洛书 {t.houtian.luoshuNumber}
              </div>
            </div>
            <div className="attr-item">
              <div className="attr-label">对应地支与日辰</div>
              <div className="attr-value">
                {t.earthlyBranches.join(' · ')}（{t.timeWindow}）
              </div>
            </div>
            <div className="attr-item">
              <div className="attr-label">季节节令</div>
              <div className="attr-value">{t.houtian.season}</div>
            </div>
          </div>

          <div className="quote-box">
            <strong>《说卦传》定位：</strong>
            {t.houtian.shuoGuaQuote}
          </div>

          <div className="section-block">
            <h3 className="section-heading">
              为什么在“{arrangement === 'xiantian' ? '先天盘' : '后天盘'}”中居此位？
            </h3>
            <p className="section-body">{t.xiantianVsHoutianNote}</p>
          </div>
        </div>
      )}

      {/* Tab 3: WuXing Relations */}
      {tab === 'relations' && (
        <div className="inspector-tab-body">
          <p className="section-body" style={{ fontSize: '0.84rem' }}>
            以当前选中的<strong>{t.name}卦（五行属{el.name}）</strong>为中心，盘内其余七宫按生克法则形成五类能量联系（点击任意卦名可切换视角）：
          </p>
          <div className="relation-chips">
            {relationGroups.map((group) => (
              <div className="relation-row" key={group.label}>
                <div>
                  <div style={{ color: group.color, fontWeight: 600 }}>
                    {group.label}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    {group.hint}
                  </div>
                </div>
                <div className="relation-trigram-btns">
                  {group.items.length === 0 ? (
                    <span style={{ color: 'var(--text-muted)' }}>独居一宫</span>
                  ) : (
                    group.items.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        className="mini-trigram-btn"
                        onClick={() => onSelectTrigram(item.id)}
                      >
                        <span>{item.symbol}</span>
                        <span>{item.name}</span>
                      </button>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
