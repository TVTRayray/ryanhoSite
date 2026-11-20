import React from 'react';
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

export const TrigramInspector: React.FC<TrigramInspectorProps> = ({
  trigramId,
  arrangement,
  onSelectTrigram,
}) => {
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
      items: sameElementTrigrams,
      color: el.color,
    },
    {
      label: `生我者（${ELEMENTS[el.generatedBy].name}生${el.name}）`,
      items: generatedByTrigrams,
      color: '#4E9F76',
    },
    {
      label: `我生者（${el.name}生${ELEMENTS[el.generates].name}）`,
      items: generatesTrigrams,
      color: '#61B58B',
    },
    {
      label: `克我者（${ELEMENTS[el.overcomeBy].name}克${el.name}）`,
      items: overcomeByTrigrams,
      color: '#D4573B',
    },
    {
      label: `我克者（${el.name}克${ELEMENTS[el.overcomes].name}）`,
      items: overcomesTrigrams,
      color: '#C79B46',
    },
  ];

  const yaoNames = ['初爻（内/下）', '二爻（中）', '上爻（外/上）'];

  return (
    <div className="panel-card inspector-card">
      {/* Hero Header */}
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
                {t.pinyin} / {t.englishName}
              </span>
            </div>
            <p className="inspector-mnemonic">
              口诀：{t.mnemonic} · {t.trait}
            </p>
          </div>
        </div>
        <span
          className="element-badge"
          style={{ color: el.color, background: el.softBg }}
        >
          五行属{el.name}
        </span>
      </div>

      {/* Yao Structure Breakdown */}
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
                {bit === 1 ? '阳爻（—）刚健主动' : '阴爻（- -）柔顺含蓄'}
              </div>
            ))}
          <div style={{ marginTop: 3, color: 'var(--accent-gold)' }}>
            注：在圆形命盘中“初爻向心、上爻向外”。
          </div>
        </div>
      </div>

      {/* Key Coordinates Matrix */}
      <div className="attr-grid">
        <div className="attr-item">
          <div className="attr-label">
            {arrangement === 'xiantian' ? '先天八卦方位 / 序数' : '后天八卦方位 / 洛书数'}
          </div>
          <div className="attr-value">
            {arrangement === 'xiantian'
              ? `${t.xiantian.direction}（${t.xiantian.directionEn}）· 第 ${t.xiantian.number} 数`
              : `${t.houtian.direction}（${t.houtian.directionEn}）· 洛书 ${t.houtian.luoshuNumber}`}
          </div>
        </div>
        <div className="attr-item">
          <div className="attr-label">对应地支与日辰（后天盘）</div>
          <div className="attr-value">
            {t.earthlyBranches.join(' · ')}（{t.timeWindow}）
          </div>
        </div>
        <div className="attr-item">
          <div className="attr-label">家庭伦理象喻</div>
          <div className="attr-value">{t.familyRole}</div>
        </div>
        <div className="attr-item">
          <div className="attr-label">后天节律时令</div>
          <div className="attr-value">{t.houtian.season}</div>
        </div>
      </div>

      {/* Classical Quote */}
      <div className="quote-box">
        <strong>《说卦传》定位：</strong>
        {t.houtian.shuoGuaQuote}
      </div>

      {/* Core Meaning */}
      <div className="section-block">
        <h3 className="section-heading">
          <Sparkles size={15} />
          命盘核心意象
        </h3>
        <p className="section-body">{t.summary}</p>
      </div>

      {/* XianTian vs HouTian Comparison */}
      <div className="section-block">
        <h3 className="section-heading">
          <Compass size={15} />
          先天（体）与后天（用）为何移位？
        </h3>
        <p className="section-body">{t.xiantianVsHoutianNote}</p>
      </div>

      {/* WuXing Relations on the Mingpan */}
      <div className="section-block">
        <h3 className="section-heading">
          <Layers size={15} />
          在盘中的五行生克关系（点击可跳转）
        </h3>
        <div className="relation-chips">
          {relationGroups.map((group) => (
            <div className="relation-row" key={group.label}>
              <span style={{ color: group.color, fontWeight: 600 }}>
                {group.label}
              </span>
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

      {/* Common Misconception */}
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
          常见误区辨析
        </div>
        {t.commonMisconception}
      </div>
    </div>
  );
};
