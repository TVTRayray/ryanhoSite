import React, { useState } from 'react';
import { ArrowRight, RotateCcw } from 'lucide-react';
import {
  ELEMENTS,
  TRIGRAM_LIST,
  TrigramId,
  YaoBit,
  findTrigramByYaos,
} from '../data/baguaData';

interface YaoLabProps {
  onJumpToMingpan: (id: TrigramId) => void;
}

export const YaoLab: React.FC<YaoLabProps> = ({ onJumpToMingpan }) => {
  const [yaos, setYaos] = useState<[YaoBit, YaoBit, YaoBit]>([1, 0, 1]);

  const toggleYao = (index: 0 | 1 | 2) => {
    setYaos((prev) => {
      const next: [YaoBit, YaoBit, YaoBit] = [...prev] as [
        YaoBit,
        YaoBit,
        YaoBit,
      ];
      next[index] = next[index] === 1 ? 0 : 1;
      return next;
    });
  };

  const matched = findTrigramByYaos(yaos);
  const el = ELEMENTS[matched.element];

  // 四象判定：由初爻与二爻组合而成
  const getSiXiang = (y0: YaoBit, y1: YaoBit) => {
    if (y0 === 1 && y1 === 1) return { symbol: '⚌', name: '太阳（老阳）' };
    if (y0 === 1 && y1 === 0) return { symbol: '⚍', name: '少阴' };
    if (y0 === 0 && y1 === 1) return { symbol: '⚎', name: '少阳' };
    return { symbol: '⚏', name: '太阴（老阴）' };
  };

  const liangYi = yaos[0] === 1 ? '阳仪（—）' : '阴仪（- -）';
  const siXiang = getSiXiang(yaos[0], yaos[1]);

  return (
    <div className="lab-grid">
      {/* Left: Interactive Yao Switcher */}
      <div className="panel-card lab-card">
        <div>
          <span className="primer-pill">互动实验 · 三爻成卦</span>
          <h2
            className="font-serif-classical"
            style={{ margin: '10px 0 6px', fontSize: '1.35rem' }}
          >
            点击翻动阴爻与阳爻，推演八卦生成
          </h2>
          <p className="section-body">
            《易传》云：“易有太极，是生两仪，两仪生四象，四象生八卦。”
            画卦须<strong>自下而上</strong>（先定初爻、次定二爻、后定上爻）。
          </p>
        </div>

        <div className="interactive-yao-builder">
          {[0, 1, 2].map((idx) => {
            const bit = yaos[idx];
            const labels = [
              '初爻（底座 · 内）',
              '二爻（中位 · 人）',
              '上爻（顶层 · 外）',
            ];
            return (
              <div className="yao-toggle-row" key={idx}>
                <span className="yao-pos-label">{labels[idx]}</span>
                <button
                  type="button"
                  className="yao-interactive-bar"
                  onClick={() => toggleYao(idx as 0 | 1 | 2)}
                  aria-label={`切换${labels[idx]}`}
                >
                  {bit === 1 ? (
                    <span className="bar-solid" />
                  ) : (
                    <>
                      <span className="bar-broken" />
                      <span className="bar-broken" />
                    </>
                  )}
                </button>
                <span
                  className="font-mono-code"
                  style={{
                    width: 48,
                    fontSize: '0.82rem',
                    color:
                      bit === 1
                        ? 'var(--accent-gold)'
                        : 'var(--text-secondary)',
                  }}
                >
                  {bit === 1 ? '1 阳' : '0 阴'}
                </span>
              </div>
            );
          })}
        </div>

        {/* Live Result Card */}
        <div
          style={{
            padding: 18,
            borderRadius: 14,
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-strong)',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span
                style={{
                  fontSize: '2.6rem',
                  lineHeight: 1,
                  color: el.color,
                }}
              >
                {matched.symbol}
              </span>
              <div>
                <div
                  className="font-serif-classical"
                  style={{ fontSize: '1.3rem', fontWeight: 700 }}
                >
                  {matched.name}卦 · {matched.nature}（{matched.mnemonic}）
                </div>
                <div
                  style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}
                >
                  五行：{el.name} · 先天数 {matched.xiantian.number} · 洛书数{' '}
                  {matched.houtian.luoshuNumber}
                </div>
              </div>
            </div>
            <button
              type="button"
              className="chip-toggle active"
              onClick={() => onJumpToMingpan(matched.id)}
            >
              在命盘中定位 <ArrowRight size={14} />
            </button>
          </div>

          <div
            style={{
              fontSize: '0.83rem',
              color: 'var(--text-secondary)',
              paddingTop: 10,
              borderTop: '1px solid var(--border-subtle)',
            }}
          >
            <strong>推演路径：</strong> 太极 → {liangYi} → {siXiang.symbol}{' '}
            {siXiang.name} → <strong>{matched.symbol} {matched.name}</strong>
          </div>
          <p className="section-body" style={{ fontSize: '0.84rem' }}>
            {matched.summary}
          </p>
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button
            type="button"
            className="chip-toggle"
            onClick={() => setYaos([1, 1, 1])}
          >
            <RotateCcw size={13} /> 复位纯阳乾卦
          </button>
          <button
            type="button"
            className="chip-toggle"
            onClick={() => setYaos([0, 0, 0])}
          >
            纯阴坤卦
          </button>
          <button
            type="button"
            className="chip-toggle"
            onClick={() => setYaos([0, 1, 0])}
          >
            水坎（中满）
          </button>
          <button
            type="button"
            className="chip-toggle"
            onClick={() => setYaos([1, 0, 1])}
          >
            火离（中虚）
          </button>
        </div>
      </div>

      {/* Right: Cosmological Derivation Tree */}
      <div className="panel-card lab-card">
        <div>
          <span className="primer-pill">伏羲八卦次序 · 二进制衍生</span>
          <h2
            className="font-serif-classical"
            style={{ margin: '10px 0 6px', fontSize: '1.35rem' }}
          >
            一生二、二生四、四生八的层级树
          </h2>
          <p className="section-body">
            每一层均在下方已有的根基上叠加一爻（2¹ → 2² → 2³）。点击任意节点可直接载入左侧实验器：
          </p>
        </div>

        <div className="derivation-tree">
          <div className="tree-level">
            <div className="tree-level-title">第一层 · 两仪（2¹ = 2）</div>
            <div className="tree-nodes cols-2">
              <div
                className={`tree-node ${yaos[0] === 1 ? 'highlight' : ''}`}
                style={{ cursor: 'pointer' }}
                onClick={() => setYaos([1, yaos[1], yaos[2]])}
              >
                <strong>— 阳仪</strong>
                <div style={{ fontSize: '0.74rem' }}>初爻为阳</div>
              </div>
              <div
                className={`tree-node ${yaos[0] === 0 ? 'highlight' : ''}`}
                style={{ cursor: 'pointer' }}
                onClick={() => setYaos([0, yaos[1], yaos[2]])}
              >
                <strong>- - 阴仪</strong>
                <div style={{ fontSize: '0.74rem' }}>初爻为阴</div>
              </div>
            </div>
          </div>

          <div className="tree-level">
            <div className="tree-level-title">第二层 · 四象（2² = 4）</div>
            <div className="tree-nodes cols-4">
              {[
                { label: '⚌ 太阳', bits: [1, 1] as [YaoBit, YaoBit] },
                { label: '⚍ 少阴', bits: [1, 0] as [YaoBit, YaoBit] },
                { label: '⚎ 少阳', bits: [0, 1] as [YaoBit, YaoBit] },
                { label: '⚏ 太阴', bits: [0, 0] as [YaoBit, YaoBit] },
              ].map((sx) => {
                const active = yaos[0] === sx.bits[0] && yaos[1] === sx.bits[1];
                return (
                  <div
                    key={sx.label}
                    className={`tree-node ${active ? 'highlight' : ''}`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => setYaos([sx.bits[0], sx.bits[1], yaos[2]])}
                  >
                    <strong>{sx.label}</strong>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="tree-level">
            <div className="tree-level-title">
              第三层 · 伏羲先天八卦次序（2³ = 8）
            </div>
            <div className="tree-nodes cols-8">
              {TRIGRAM_LIST.map((t) => {
                const active = matched.id === t.id;
                return (
                  <div
                    key={t.id}
                    className={`tree-node ${active ? 'highlight' : ''}`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => setYaos([...t.yaos])}
                  >
                    <div style={{ fontSize: '1.35rem', lineHeight: 1.2 }}>
                      {t.symbol}
                    </div>
                    <div style={{ fontWeight: 700 }}>{t.name}</div>
                    <div
                      className="font-mono-code"
                      style={{ fontSize: '0.7rem', opacity: 0.8 }}
                    >
                      {t.xiantian.number} · {t.nature}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
