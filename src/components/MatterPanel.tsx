import { useState, useMemo } from 'react';
import type { Matter } from '../types';
import { RARITY_MAP, type RarityLevel } from '../types';
import MatterCard from './MatterCard';
import SearchBar from './SearchBar';
import './MatterPanel.css';

interface MatterPanelProps {
  matters: Matter[];
  discoveredIds: Set<string>;
  selectedId: string | null;
  selectedIds?: Set<string>;
  onSelect: (matter: Matter) => void;
  showUndiscovered?: boolean;
  title?: string;
}

export default function MatterPanel({
  matters,
  discoveredIds,
  selectedId,
  selectedIds,
  onSelect,
  showUndiscovered = false,
  title = '物质列表',
}: MatterPanelProps) {
  const [search, setSearch] = useState('');

  const filteredMatters = useMemo(() => {
    let list = matters;
    if (!showUndiscovered) {
      list = list.filter((m) => discoveredIds.has(m.id));
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((m) => m.name.toLowerCase().includes(q));
    }
    return list;
  }, [matters, discoveredIds, showUndiscovered, search]);

  const grouped = useMemo(() => {
    const map = new Map<RarityLevel, Matter[]>();
    for (const m of filteredMatters) {
      const r = m.rarity as RarityLevel;
      if (!map.has(r)) map.set(r, []);
      map.get(r)!.push(m);
    }
    return map;
  }, [filteredMatters]);

  const sortedGroups = useMemo(() => {
    return Array.from(grouped.entries()).sort(([a], [b]) => a - b);
  }, [grouped]);

  const isSelected = (id: string) => {
    if (selectedIds) return selectedIds.has(id);
    return id === selectedId;
  };

  return (
    <div className="matter-panel">
      <div className="matter-panel__header">
        <h3 className="matter-panel__title">{title}</h3>
        <span className="matter-panel__count">{filteredMatters.length}</span>
      </div>
      <div className="matter-panel__search">
        <SearchBar onSearch={setSearch} />
      </div>
      <div className="matter-panel__list">
        {sortedGroups.map(([rarity, items]) => (
          <div key={rarity} className="matter-panel__group">
            <div className="matter-panel__group-header">
              <span
                className="matter-panel__group-dot"
                style={{ background: RARITY_MAP[rarity].color }}
              />
              <span className="matter-panel__group-label">{RARITY_MAP[rarity].name}</span>
              <span className="matter-panel__group-count">{items.length}</span>
            </div>
            <div className="matter-panel__group-items">
              {items.map((m) => (
                <MatterCard
                  key={m.id}
                  name={m.name}
                  rarity={m.rarity as RarityLevel}
                  selected={isSelected(m.id)}
                  discovered={showUndiscovered || discoveredIds.has(m.id)}
                  size="sm"
                  onClick={() => onSelect(m)}
                />
              ))}
            </div>
          </div>
        ))}
        {filteredMatters.length === 0 && (
          <div className="matter-panel__empty">
            {search ? '未找到匹配的物质' : '暂无已发现的物质'}
          </div>
        )}
      </div>
    </div>
  );
}
