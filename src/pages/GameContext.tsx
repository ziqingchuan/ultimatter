import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { Matter, SynthesisRule } from '../types';
import { BASE_MATTERS, BASE_RULES } from '../data/baseTree';
import { loadAllMatters, loadAllRules, isSupabaseConfigured } from '../services/supabase';

const STORAGE_KEY_DISCOVERED = 'ultimatter_discovered';
const STORAGE_KEY_CUSTOM_MATTERS = 'ultimatter_custom_matters';
const STORAGE_KEY_CUSTOM_RULES = 'ultimatter_custom_rules';

interface GameState {
  matters: Matter[];
  rules: SynthesisRule[];
  discoveredIds: Set<string>;
  loading: boolean;
  addDiscovered: (id: string) => void;
  addMatter: (matter: Matter) => void;
  addRule: (rule: SynthesisRule) => void;
  getMatterById: (id: string) => Matter | undefined;
  getMatterByName: (name: string) => Matter | undefined;
}

const GameContext = createContext<GameState | null>(null);

export function useGame(): GameState {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T;
  } catch { /* ignore */ }
  return fallback;
}

function saveToStorage(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch { /* ignore */ }
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [matters, setMatters] = useState<Matter[]>([]);
  const [rules, setRules] = useState<SynthesisRule[]>([]);
  const [discoveredIds, setDiscoveredIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      // Build base tree first
      const localMatters: Matter[] = BASE_MATTERS.map((m, i) => ({
        id: `local-${i}`,
        name: m.name,
        rarity: m.rarity,
        inventor: null,
        is_basic: m.is_basic,
        created_at: new Date().toISOString(),
      }));
      const nameToId = new Map(localMatters.map((m) => [m.name, m.id]));
      const localRules: SynthesisRule[] = BASE_RULES.map((r, i) => ({
        id: `rule-${i}`,
        ingredient_a: nameToId.get(r.ingredientA)!,
        ingredient_b: nameToId.get(r.ingredientB)!,
        result: nameToId.get(r.result)!,
        created_at: new Date().toISOString(),
      }));

      // Load custom matters/rules from localStorage
      const customMatters: Matter[] = loadFromStorage<Matter[]>(STORAGE_KEY_CUSTOM_MATTERS, []);
      const customRules: SynthesisRule[] = loadFromStorage<SynthesisRule[]>(STORAGE_KEY_CUSTOM_RULES, []);

      let allMatters = [...localMatters];
      let allRules = [...localRules];

      // If Supabase configured, try loading from DB
      if (isSupabaseConfigured()) {
        const [dbMatters, dbRules] = await Promise.all([
          loadAllMatters(),
          loadAllRules(),
        ]);
        if (dbMatters.length > 0) {
          allMatters = dbMatters;
          allRules = dbRules;
        }
      }

      // Merge custom matters (not already present)
      for (const cm of customMatters) {
        if (!allMatters.some((m) => m.id === cm.id || m.name === cm.name)) {
          allMatters.push(cm);
        }
      }
      for (const cr of customRules) {
        if (!allRules.some((r) => r.id === cr.id)) {
          allRules.push(cr);
        }
      }

      setMatters(allMatters);
      setRules(allRules);

      // Load discovered IDs from localStorage
      const savedDiscovered = loadFromStorage<string[]>(STORAGE_KEY_DISCOVERED, []);
      const basicIds = new Set(
        allMatters.filter((m) => m.is_basic).map((m) => m.id)
      );
      const merged = new Set([...basicIds, ...savedDiscovered]);
      setDiscoveredIds(merged);

      setLoading(false);
    }
    init();
  }, []);

  const addDiscovered = useCallback((id: string) => {
    setDiscoveredIds((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      saveToStorage(STORAGE_KEY_DISCOVERED, Array.from(next));
      return next;
    });
  }, []);

  const addMatter = useCallback((matter: Matter) => {
    setMatters((prev) => {
      if (prev.some((m) => m.id === matter.id || m.name === matter.name)) return prev;
      const next = [...prev, matter];
      // Persist custom matters
      const existing = loadFromStorage<Matter[]>(STORAGE_KEY_CUSTOM_MATTERS, []);
      if (!existing.some((m) => m.id === matter.id)) {
        existing.push(matter);
        saveToStorage(STORAGE_KEY_CUSTOM_MATTERS, existing);
      }
      return next;
    });
  }, []);

  const addRule = useCallback((rule: SynthesisRule) => {
    setRules((prev) => {
      const next = [...prev, rule];
      const existing = loadFromStorage<SynthesisRule[]>(STORAGE_KEY_CUSTOM_RULES, []);
      if (!existing.some((r) => r.id === rule.id)) {
        existing.push(rule);
        saveToStorage(STORAGE_KEY_CUSTOM_RULES, existing);
      }
      return next;
    });
  }, []);

  const getMatterById = useCallback(
    (id: string) => matters.find((m) => m.id === id),
    [matters]
  );

  const getMatterByName = useCallback(
    (name: string) => matters.find((m) => m.name === name),
    [matters]
  );

  return (
    <GameContext.Provider
      value={{
        matters,
        rules,
        discoveredIds,
        loading,
        addDiscovered,
        addMatter,
        addRule,
        getMatterById,
        getMatterByName,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}
