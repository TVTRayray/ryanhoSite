import React from 'react';
import { BookOpen, Compass, ExternalLink, ShieldCheck } from 'lucide-react';
import {
  ELEMENTS,
  REFERENCE_SOURCES,
  SCOPE_DISTINCTIONS,
  TRIGRAM_LIST,
  TrigramId,
} from '../data/baguaData';

interface KnowledgeGlossaryProps {
  onJumpToTrigram: (id: TrigramId) => void;
}

export const KnowledgeGlossary: React.FC<KnowledgeGlossaryProps> = ({
  onJumpToTrigram,
}) => {
  return (
    <div className="glossary-stack">
      {/* 1. Complete Bilingual Reference Table */}
      <div className="panel-card lab-card">
        <div>
          <span className="primer-pill">中英文对照总表 · 知识对齐</span>
          <h2
            className="font-serif-classical"
            style={{ margin: '10px 0 6px', fontSize: '1.35rem' }}
          >
            八卦基础命盘全览表（点击任意卦名跳转至交互盘）
          </h2>
          <p className="section-body">
            结合参考资料中的百科结构化对照表，整理八个经卦的符号、中英文译名、五行、先/后天方位与对应十二地支时辰：
          </p>
        </div>

        <div className="table-scroll">
          <table className="bagua-table">
            <thead>
              <tr>
                <th>卦象</th>
                <th>卦名 / 拼音</th>
                <th>英文直译 / 义项</th>
                <th>口诀</th>
                <th>自然意象</th>
                <th>五行</th>
                <th>先天方位(数)</th>
                <th>后天方位(洛书)</th>
                <th>配属地支时辰</th>
              </tr>
            </thead>
            <tbody>
              {TRIGRAM_LIST.map((t) => {
                const el = ELEMENTS[t.element];
                return (
                  <tr key={t.id}>
                    <td style={{ fontSize: '1.45rem', color: el.color }}>
                      {t.symbol}
                    </td>
                    <td>
                      <button
                        type="button"
                        className="mini-trigram-btn"
                        onClick={() => onJumpToTrigram(t.id)}
                      >
                        <strong>{t.name}</strong> {t.pinyin}
                      </button>
                    </td>
                    <td>{t.englishName}</td>
                    <td>{t.mnemonic}</td>
                    <td>
                      {t.nature}（{t.natureEn}）
                    </td>
                    <td style={{ color: el.color, fontWeight: 700 }}>
                      {el.name}（{el.english}）
                    </td>
                    <td>
                      {t.xiantian.direction}（{t.xiantian.number}）
                    </td>
                    <td>
                      {t.houtian.direction}（{t.houtian.luoshuNumber}）
                    </td>
                    <td className="font-mono-code" style={{ fontSize: '0.8rem' }}>
                      {t.earthlyBranches.join('/')} · {t.timeWindow}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Scope & Boundary Clarification */}
      <div className="panel-card lab-card">
        <div>
          <span className="primer-pill">
            <ShieldCheck size={13} /> 科普边界与方法论
          </span>
          <h2
            className="font-serif-classical"
            style={{ margin: '10px 0 6px', fontSize: '1.35rem' }}
          >
            先分清“基础命盘结构”与“具体术数体系”
          </h2>
          <p className="section-body">
            初学者最容易把“八卦哲学符号”、“历法时空坐标”与“算命占卜术数”混为一谈。把层次拆清，后续深入任何分支才不会走偏：
          </p>
        </div>

        <div className="scope-grid">
          {SCOPE_DISTINCTIONS.map((block) => (
            <div className="ref-card" key={block.title}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 8,
                }}
              >
                <strong style={{ fontSize: '0.96rem' }}>{block.title}</strong>
                <span className="primer-pill">{block.badge}</span>
              </div>
              <ul
                style={{
                  margin: '6px 0 0',
                  paddingLeft: 18,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                  fontSize: '0.85rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.55,
                }}
              >
                {block.points.map((pt, i) => (
                  <li key={i}>{pt}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="quote-box" style={{ display: 'flex', gap: 10 }}>
          <Compass size={18} style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <strong>如何阅读传统命盘？记住三条铁律：</strong>
            ① 默认<strong>上南下北、左东右西</strong>（与古代帝王坐北朝南面南而立一致）；
            ② 八卦爻画遵循<strong>初爻向心、上爻向外</strong>；
            ③ 先天八卦讲<strong>宇宙体量对待</strong>，后天八卦讲<strong>地球四季与日辰流转</strong>。
          </div>
        </div>
      </div>

      {/* 3. Curated References from refer.md */}
      <div className="panel-card lab-card">
        <div>
          <span className="primer-pill">
            <BookOpen size={13} /> 知识来源溯源（来自 refer.md）
          </span>
          <h2
            className="font-serif-classical"
            style={{ margin: '10px 0 6px', fontSize: '1.35rem' }}
          >
            本站科普参考资料索引
          </h2>
        </div>

        <div className="ref-grid">
          {REFERENCE_SOURCES.map((ref) => (
            <div className="ref-card" key={ref.url}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 8,
                }}
              >
                <span
                  style={{
                    fontSize: '0.74rem',
                    color: 'var(--accent-gold)',
                    fontWeight: 600,
                  }}
                >
                  {ref.category}
                </span>
                <ExternalLink size={14} color="var(--text-muted)" />
              </div>
              <a
                href={ref.url}
                target="_blank"
                rel="noreferrer"
                style={{ fontWeight: 600, fontSize: '0.92rem' }}
              >
                {ref.title}
              </a>
              <p
                style={{
                  margin: 0,
                  fontSize: '0.82rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.5,
                }}
              >
                {ref.usage}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
