import { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useGame } from './GameContext';
import MatterPanel from '../components/MatterPanel';
import MatterCard from '../components/MatterCard';
import ConflictAlert from '../components/ConflictAlert';
import { checkRuleConflict, checkNameConflict, createMatter, createSynthesisRule, isSupabaseConfigured } from '../services/supabase';
import type { Matter, ConflictCheckResult, RarityLevel } from '../types';
import { RARITY_MAP } from '../types';
import './CreativeMode.css';

export default function CreativeMode() {
  const { matters, rules, addMatter, addRule } = useGame();

  const [ingredientA, setIngredientA] = useState<Matter | null>(null);
  const [ingredientB, setIngredientB] = useState<Matter | null>(null);
  const [newName, setNewName] = useState('');
  const [rarity, setRarity] = useState<RarityLevel>(1);
  const [inventor, setInventor] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Real-time conflict detection
  const conflicts = useMemo<ConflictCheckResult[]>(() => {
    const result: ConflictCheckResult[] = [];

    if (ingredientA && ingredientB) {
      if (ingredientA.id === ingredientB.id) {
        result.push({
          hasConflict: true,
          conflictType: 'duplicate_rule',
          message: '不能使用相同的物质作为原料',
        });
      } else {
        const ruleConflict = checkRuleConflict(ingredientA.id, ingredientB.id, rules);
        if (ruleConflict.hasConflict) {
          result.push(ruleConflict);
        }
      }
    }

    if (newName.trim()) {
      const nameConflict = checkNameConflict(newName.trim(), matters);
      if (nameConflict.hasConflict) {
        result.push(nameConflict);
      }
    }

    return result;
  }, [ingredientA, ingredientB, newName, rules, matters]);

  const hasConflict = conflicts.length > 0;

  const canSubmit = useMemo(() => {
    if (!ingredientA || !ingredientB) return false;
    if (!newName.trim()) return false;
    if (ingredientA.id === ingredientB.id) return false;
    if (hasConflict) return false;
    return true;
  }, [ingredientA, ingredientB, newName, hasConflict]);

  const handleSelectMatter = useCallback(
    (matter: Matter) => {
      // Click selected item to deselect
      if (ingredientA?.id === matter.id) {
        setIngredientA(null);
        return;
      }
      if (ingredientB?.id === matter.id) {
        setIngredientB(null);
        return;
      }

      if (!ingredientA) {
        setIngredientA(matter);
      } else if (!ingredientB) {
        if (matter.id !== ingredientA.id) setIngredientB(matter);
      } else {
        // Both filled, replace A and clear B
        setIngredientA(matter);
        setIngredientB(null);
      }
    },
    [ingredientA, ingredientB]
  );

  const handleSubmit = useCallback(async () => {
    if (!canSubmit || !ingredientA || !ingredientB || !newName.trim()) return;

    // Snapshot form values before clearing
    const formName = newName.trim();
    const formRarity = rarity;
    const formInventor = inventor.trim();
    const formA = ingredientA;
    const formB = ingredientB;

    // Clear form FIRST to prevent conflict flash after matter is added
    setNewName('');
    setIngredientA(null);
    setIngredientB(null);
    setRarity(1);
    setInventor('');

    setSubmitting(true);
    setSubmitSuccess(false);

    try {
      let newMatter: Matter;

      if (isSupabaseConfigured()) {
        const created = await createMatter(formName, formRarity, formInventor || null);
        if (!created) {
          setSubmitting(false);
          return;
        }
        newMatter = created;
      } else {
        newMatter = {
          id: `local-${Date.now()}`,
          name: formName,
          rarity: formRarity,
          inventor: formInventor || null,
          is_basic: false,
          created_at: new Date().toISOString(),
        };
      }

      addMatter(newMatter);

      if (isSupabaseConfigured()) {
        const createdRule = await createSynthesisRule(formA.id, formB.id, newMatter.id);
        if (createdRule) {
          addRule(createdRule);
        }
      } else {
        addRule({
          id: `rule-${Date.now()}`,
          ingredient_a: formA.id,
          ingredient_b: formB.id,
          result: newMatter.id,
          created_at: new Date().toISOString(),
        });
      }

      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 3000);
    } finally {
      setSubmitting(false);
    }
  }, [canSubmit, ingredientA, ingredientB, newName, rarity, inventor, addMatter, addRule]);

  const selectedIds = new Set([ingredientA?.id, ingredientB?.id].filter(Boolean) as string[]);

  return (
    <div className="creative-mode">
      <header className="creative-mode__header">
        <Link to="/" className="creative-mode__back">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          返回
        </Link>
        <h1 className="creative-mode__title">创意模式</h1>
      </header>

      <div className="creative-mode__body">
        {/* Left: matter list */}
        <aside className="creative-mode__panel">
          <MatterPanel
            matters={matters}
            discoveredIds={new Set(matters.map((m) => m.id))}
            selectedId={ingredientA?.id || ingredientB?.id || null}
            selectedIds={selectedIds}
            onSelect={handleSelectMatter}
            showUndiscovered={true}
            title="全部物质"
          />
        </aside>

        {/* Middle: synthesis area */}
        <main className="creative-mode__synthesis">
          <div className="creative-mode__slots">
            <div className="creative-mode__slot">
              <span className="creative-mode__slot-label">原料 A</span>
              {ingredientA ? (
                <div className="creative-mode__slot-filled">
                  <MatterCard name={ingredientA.name} rarity={ingredientA.rarity as RarityLevel} selected />
                  <button className="creative-mode__slot-clear" onClick={() => setIngredientA(null)}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="creative-mode__slot-empty">从左侧选择</div>
              )}
            </div>

            <div className="creative-mode__plus">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="28" height="28">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </div>

            <div className="creative-mode__slot">
              <span className="creative-mode__slot-label">原料 B</span>
              {ingredientB ? (
                <div className="creative-mode__slot-filled">
                  <MatterCard name={ingredientB.name} rarity={ingredientB.rarity as RarityLevel} selected />
                  <button className="creative-mode__slot-clear" onClick={() => setIngredientB(null)}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="creative-mode__slot-empty">从左侧选择</div>
              )}
            </div>
          </div>

          <div className="creative-mode__preview">
            {ingredientA && ingredientB ? (
              <span className="creative-mode__preview-text">
                {ingredientA.name} + {ingredientB.name} = ?
              </span>
            ) : (
              <span className="creative-mode__preview-text creative-mode__preview-text--muted">
                选择两种原料开始发明
              </span>
            )}
          </div>
        </main>

        {/* Right: form */}
        <aside className="creative-mode__form">
          <h3 className="creative-mode__form-title">新物质信息</h3>

          <ConflictAlert conflicts={conflicts} />

          <div className="creative-mode__field">
            <label className="creative-mode__label">物质名称 *</label>
            <input
              className="creative-mode__input"
              type="text"
              value={newName}
              onChange={(e) => { setNewName(e.target.value); setSubmitSuccess(false); }}
              placeholder="输入新物质名称"
              maxLength={20}
            />
          </div>

          <div className="creative-mode__field">
            <label className="creative-mode__label">稀有度 *</label>
            <div className="creative-mode__rarity-grid">
              {(Object.entries(RARITY_MAP) as [string, { level: RarityLevel; name: string; color: string }][]).map(
                ([, info]) => (
                  <button
                    key={info.level}
                    className={`creative-mode__rarity-btn ${rarity === info.level ? 'creative-mode__rarity-btn--active' : ''}`}
                    style={{ '--btn-color': info.color } as React.CSSProperties}
                    onClick={() => setRarity(info.level)}
                  >
                    <span className="creative-mode__rarity-dot" style={{ background: info.color }} />
                    <span className="creative-mode__rarity-name">{info.name}</span>
                  </button>
                )
              )}
            </div>
          </div>

          <div className="creative-mode__field">
            <label className="creative-mode__label">发明人 (可选)</label>
            <input
              className="creative-mode__input"
              type="text"
              value={inventor}
              onChange={(e) => setInventor(e.target.value)}
              placeholder="你的名字"
              maxLength={30}
            />
          </div>

          <button
            className="creative-mode__submit"
            disabled={!canSubmit || submitting}
            onClick={handleSubmit}
          >
            {submitting ? '提交中...' : '提交发明'}
          </button>

          {submitSuccess && (
            <div className="creative-mode__success">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              发明成功! 新物质已加入数据库
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
