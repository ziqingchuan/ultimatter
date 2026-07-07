import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useGame } from './GameContext';
import MatterCard from '../components/MatterCard';
import MatterPanel from '../components/MatterPanel';
import SynthesisSlot from '../components/SynthesisSlot';
import { findSynthesisResult } from '../services/supabase';
import type { Matter, RarityLevel } from '../types';
import './BasicMode.css';

export default function BasicMode() {
  const { matters, rules, discoveredIds, addDiscovered, getMatterById } = useGame();
  const [slotA, setSlotA] = useState<Matter | null>(null);
  const [slotB, setSlotB] = useState<Matter | null>(null);
  const [result, setResult] = useState<Matter | null>(null);
  const [noResult, setNoResult] = useState(false);
  const [synthesizing, setSynthesizing] = useState(false);

  const discoveredMatters = matters.filter((m) => discoveredIds.has(m.id));

  const handleSelectMatter = useCallback(
    (matter: Matter) => {
      // Click selected item to deselect
      if (slotA?.id === matter.id) {
        setSlotA(null);
        setResult(null);
        setNoResult(false);
        return;
      }
      if (slotB?.id === matter.id) {
        setSlotB(null);
        setResult(null);
        setNoResult(false);
        return;
      }

      if (!slotA) {
        setSlotA(matter);
      } else if (!slotB) {
        if (matter.id === slotA.id) return;
        setSlotB(matter);
      } else {
        setSlotA(matter);
        setSlotB(null);
        setResult(null);
        setNoResult(false);
      }
    },
    [slotA, slotB]
  );

  const handleSynthesize = useCallback(() => {
    if (!slotA || !slotB) return;

    setSynthesizing(true);
    setResult(null);
    setNoResult(false);

    setTimeout(() => {
      const rule = findSynthesisResult(slotA.id, slotB.id, rules);
      if (rule) {
        const resultMatter = getMatterById(rule.result);
        if (resultMatter) {
          setResult(resultMatter);
          addDiscovered(resultMatter.id);
        }
      } else {
        setNoResult(true);
      }
      setSynthesizing(false);
    }, 600);
  }, [slotA, slotB, rules, getMatterById, addDiscovered]);

  const handleReset = useCallback(() => {
    setSlotA(null);
    setSlotB(null);
    setResult(null);
    setNoResult(false);
  }, []);

  const canSynthesize = slotA && slotB && !synthesizing;
  const selectedIds = new Set([slotA?.id, slotB?.id].filter(Boolean) as string[]);

  return (
    <div className="basic-mode">
      <header className="basic-mode__header">
        <Link to="/" className="basic-mode__back">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          返回
        </Link>
        <h1 className="basic-mode__title">基础合成</h1>
        <div className="basic-mode__stats">
          {discoveredMatters.length} / {matters.length}
        </div>
      </header>

      <div className="basic-mode__body">
        <aside className="basic-mode__panel">
          <MatterPanel
            matters={matters}
            discoveredIds={discoveredIds}
            selectedId={slotA?.id || slotB?.id || null}
            selectedIds={selectedIds}
            onSelect={handleSelectMatter}
            title="已发现物质"
          />
        </aside>

        <main className="basic-mode__synthesis">
          <div className="basic-mode__slots">
            <SynthesisSlot
              matter={slotA}
              label="原料 A"
              onClear={() => { setSlotA(null); setResult(null); setNoResult(false); }}
            />

            <div className="basic-mode__plus">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="28" height="28">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </div>

            <SynthesisSlot
              matter={slotB}
              label="原料 B"
              onClear={() => { setSlotB(null); setResult(null); setNoResult(false); }}
            />
          </div>

          <div className="basic-mode__actions">
            <button
              className="basic-mode__btn basic-mode__btn--synth"
              disabled={!canSynthesize}
              onClick={handleSynthesize}
            >
              {synthesizing ? '合成中...' : '合成'}
            </button>
            <button className="basic-mode__btn basic-mode__btn--reset" onClick={handleReset}>
              重置
            </button>
          </div>

          {result && (
            <div className="basic-mode__result">
              <div className="basic-mode__result-label">合成成功!</div>
              <div className="basic-mode__result-card">
                <MatterCard name={result.name} rarity={result.rarity as RarityLevel} size="lg" />
              </div>
            </div>
          )}

          {noResult && (
            <div className="basic-mode__no-result">
              <p>未发现合成路径</p>
              <Link to="/creative" className="basic-mode__creative-link">
                前往创意模式发明新规则
              </Link>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
