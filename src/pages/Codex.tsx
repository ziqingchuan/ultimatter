import { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useGame } from './GameContext';
import MatterCard from '../components/MatterCard';
import SearchBar from '../components/SearchBar';
import RaritySelect from '../components/RaritySelect';
import { RARITY_MAP, type RarityLevel, type Matter, type SynthesisRule } from '../types';
import './Codex.css';

interface TreeNode {
  matter: Matter;
  children: TreeNode[];
}

function buildTree(matter: Matter, rules: SynthesisRule[], matterMap: Map<string, Matter>, visited: Set<string>): TreeNode | null {
  if (visited.has(matter.id)) return null;
  visited.add(matter.id);
  const node: TreeNode = { matter, children: [] };
  if (matter.is_basic) return node;
  const rule = rules.find((r) => r.result === matter.id);
  if (!rule) return node;
  const a = matterMap.get(rule.ingredient_a);
  const b = matterMap.get(rule.ingredient_b);
  if (a && b) {
    const childA = buildTree(a, rules, matterMap, new Set(visited));
    const childB = buildTree(b, rules, matterMap, new Set(visited));
    if (childA) node.children.push(childA);
    if (childB) node.children.push(childB);
  }
  return node;
}

function FileTree({ node, discoveredIds, depth }: { node: TreeNode; discoveredIds: Set<string>; depth: number }) {
  const isDiscovered = discoveredIds.has(node.matter.id);
  const rarity = node.matter.rarity as RarityLevel;
  const color = RARITY_MAP[rarity].color;
  const isLeaf = node.children.length === 0;

  return (
    <div className="ftree">
      <div className="ftree__row" style={{ paddingLeft: depth * 20 }}>
        {depth > 0 && <span className="ftree__indent-line" />}
        <span className={`ftree__icon ${isDiscovered ? '' : 'ftree__icon--locked'}`}>
          {isLeaf ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
              <circle cx="12" cy="12" r="4" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
              <path d="M3 7h18M3 12h18M3 17h18" />
            </svg>
          )}
        </span>
        <span
          className="ftree__dot"
          style={{
            background: isDiscovered ? color : '#222',
            boxShadow: isDiscovered ? `0 0 6px ${color}` : 'none',
          }}
        />
        <span className={`ftree__name ${isDiscovered ? '' : 'ftree__name--locked'}`}>
          {isDiscovered ? node.matter.name : '???'}
        </span>
        {isDiscovered && (
          <span className="ftree__rarity" style={{ color }}>
            {RARITY_MAP[rarity].name}
          </span>
        )}
      </div>
      {node.children.map((child) => (
        <FileTree key={child.matter.id} node={child} discoveredIds={discoveredIds} depth={depth + 1} />
      ))}
    </div>
  );
}

export default function Codex() {
  const { matters, rules, discoveredIds, getMatterById } = useGame();
  const [search, setSearch] = useState('');
  const [filterRarity, setFilterRarity] = useState<RarityLevel | null>(null);
  const [selectedMatterId, setSelectedMatterId] = useState<string | null>(null);

  const matterMap = useMemo(() => {
    const map = new Map<string, Matter>();
    for (const m of matters) map.set(m.id, m);
    return map;
  }, [matters]);

  const filtered = useMemo(() => {
    let list = matters;
    if (filterRarity !== null) {
      list = list.filter((m) => m.rarity === filterRarity);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((m) => m.name.toLowerCase().includes(q));
    }
    return list.sort((a, b) => a.rarity - b.rarity || a.name.localeCompare(b.name));
  }, [matters, filterRarity, search]);

  const grouped = useMemo(() => {
    const map = new Map<RarityLevel, typeof filtered>();
    for (const m of filtered) {
      const r = m.rarity as RarityLevel;
      if (!map.has(r)) map.set(r, []);
      map.get(r)!.push(m);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a - b);
  }, [filtered]);

  const discoveredCount = matters.filter((m) => discoveredIds.has(m.id)).length;

  const selectedMatter = selectedMatterId ? getMatterById(selectedMatterId) ?? null : null;

  const tree = useMemo(() => {
    if (!selectedMatter || selectedMatter.is_basic) return null;
    return buildTree(selectedMatter, rules, matterMap, new Set());
  }, [selectedMatter, rules, matterMap]);

  const handleSelect = useCallback((m: Matter) => {
    setSelectedMatterId((prev) => prev === m.id ? null : m.id);
  }, []);

  const rarityOptions = useMemo(() => [
    { value: '', label: '全部稀有度', color: undefined },
    ...(Object.entries(RARITY_MAP) as [string, { level: RarityLevel; name: string; color: string }][]).map(
      ([, info]) => ({
        value: String(info.level),
        label: `${info.name} (Lv.${info.level})`,
        color: info.color,
      })
    ),
  ], []);

  return (
    <div className="codex">
      <header className="codex__header">
        <Link to="/" className="codex__back">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          返回
        </Link>
        <h1 className="codex__title">物质图鉴</h1>
        <div className="codex__stats">
          {discoveredCount} / {matters.length}
        </div>
      </header>

      <div className="codex__body">
        {/* Left: all matters */}
        <div className="codex__left">
          <div className="codex__toolbar">
            <div className="codex__search">
              <SearchBar onSearch={setSearch} placeholder="搜索物质..." />
            </div>
            <RaritySelect
              options={rarityOptions}
              value={filterRarity !== null ? String(filterRarity) : ''}
              onChange={(v) => setFilterRarity(v === '' ? null : (Number(v) as RarityLevel))}
              placeholder="全部稀有度"
            />
          </div>

          <div className="codex__list">
            {grouped.map(([rarity, items]) => (
              <div key={rarity} className="codex__group">
                <div className="codex__group-header">
                  <span className="codex__group-dot" style={{ background: RARITY_MAP[rarity].color }} />
                  <span className="codex__group-label">{RARITY_MAP[rarity].name}</span>
                  <span className="codex__group-count">{items.length}</span>
                </div>
                <div className="codex__group-grid">
                  {items.map((m) => (
                    <div key={m.id} className="codex__card-wrapper">
                      <MatterCard
                        name={m.name}
                        rarity={m.rarity as RarityLevel}
                        discovered={discoveredIds.has(m.id)}
                        selected={m.id === selectedMatterId}
                        onClick={() => handleSelect(m)}
                      />
                      {m.inventor && discoveredIds.has(m.id) && (
                        <span className="codex__inventor">by {m.inventor}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="codex__empty">
                {search ? '未找到匹配的物质' : '暂无物质'}
              </div>
            )}
          </div>
        </div>

        {/* Right: synthesis tree */}
        <div className="codex__right">
          {selectedMatter ? (
            <>
              <div className="codex__tree-header">
                <span
                  className="codex__tree-dot"
                  style={{
                    background: RARITY_MAP[selectedMatter.rarity as RarityLevel].color,
                    boxShadow: `0 0 8px ${RARITY_MAP[selectedMatter.rarity as RarityLevel].color}`,
                  }}
                />
                <span className="codex__tree-title">{selectedMatter.name}</span>
                <span className="codex__tree-rarity" style={{ color: RARITY_MAP[selectedMatter.rarity as RarityLevel].color }}>
                  {RARITY_MAP[selectedMatter.rarity as RarityLevel].name}
                </span>
              </div>
              {selectedMatter.inventor && (
                <div className="codex__tree-inventor">发明人: {selectedMatter.inventor}</div>
              )}
              {selectedMatter.is_basic ? (
                <div className="codex__tree-basic">基础物质，无需合成</div>
              ) : tree ? (
                <div className="codex__tree-scroll">
                  <FileTree node={tree} discoveredIds={discoveredIds} depth={0} />
                </div>
              ) : null}
            </>
          ) : (
            <div className="codex__tree-placeholder">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="48" height="48">
                <circle cx="12" cy="12" r="3" />
                <line x1="12" y1="3" x2="12" y2="9" />
                <line x1="12" y1="15" x2="12" y2="21" />
                <line x1="3" y1="12" x2="9" y2="12" />
                <line x1="15" y1="12" x2="21" y2="12" />
              </svg>
              <span>选择物质查看合成树</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
