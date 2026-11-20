import React, { useState } from 'react';
import { Flame, GitBranch } from 'lucide-react';
import { TrigramId } from '../data/baguaData';
import { YaoLab } from './YaoLab';
import { WuXingMatrix } from './WuXingMatrix';

interface WorkshopHubProps {
  onJumpToMingpan: (id: TrigramId) => void;
}

export const WorkshopHub: React.FC<WorkshopHubProps> = ({
  onJumpToMingpan,
}) => {
  const [subMode, setSubMode] = useState<'yao' | 'wuxing'>('yao');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div
        className="panel-card"
        style={{
          padding: '12px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          flexWrap: 'wrap',
        }}
      >
        <div className="segmented-control" role="tablist" aria-label="底层推演规律">
          <button
            type="button"
            role="tab"
            aria-selected={subMode === 'yao'}
            className={`segmented-btn ${subMode === 'yao' ? 'active' : ''}`}
            onClick={() => setSubMode('yao')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
          >
            <GitBranch size={14} /> 规律 A · 三爻生卦（二进制衍生）
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={subMode === 'wuxing'}
            className={`segmented-btn ${subMode === 'wuxing' ? 'active' : ''}`}
            onClick={() => setSubMode('wuxing')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
          >
            <Flame size={14} /> 规律 B · 五行相生相克（能量循环）
          </button>
        </div>

        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {subMode === 'yao'
            ? '先理解三画卦如何从阴/阳两爻生成'
            : '再理解八宫如何通过五行生克发生互动'}
        </span>
      </div>

      {subMode === 'yao' ? (
        <YaoLab onJumpToMingpan={onJumpToMingpan} />
      ) : (
        <WuXingMatrix onJumpToTrigram={onJumpToMingpan} />
      )}
    </div>
  );
};
