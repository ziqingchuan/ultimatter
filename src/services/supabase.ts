import { createClient } from '@supabase/supabase-js';
import type { Matter, SynthesisRule, ConflictCheckResult } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

let supabaseInstance: ReturnType<typeof createClient> | null = null;

function getSupabase() {
  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'your_supabase_url_here') {
    return null;
  }
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabaseInstance;
}

export function isSupabaseConfigured(): boolean {
  return getSupabase() !== null;
}

// ---- 数据加载 ----

export async function loadAllMatters(): Promise<Matter[]> {
  const sb = getSupabase();
  if (!sb) return [];

  const { data, error } = await sb
    .from('matters')
    .select('*')
    .order('rarity', { ascending: true });

  if (error) {
    console.error('Failed to load matters:', error);
    return [];
  }
  return (data as Matter[]) ?? [];
}

export async function loadAllRules(): Promise<SynthesisRule[]> {
  const sb = getSupabase();
  if (!sb) return [];

  const { data, error } = await sb
    .from('synthesis_rules')
    .select('*');

  if (error) {
    console.error('Failed to load synthesis rules:', error);
    return [];
  }
  return (data as SynthesisRule[]) ?? [];
}

// ---- 物质操作 ----

export async function createMatter(
  name: string,
  rarity: number,
  inventor: string | null
): Promise<Matter | null> {
  const sb = getSupabase();
  if (!sb) return null;

  const { data, error } = await sb
    .from('matters')
    .insert({ name, rarity, inventor, is_basic: false })
    .select()
    .single();

  if (error) {
    console.error('Failed to create matter:', error);
    return null;
  }
  return data as Matter;
}

// ---- 合成规则操作 ----

export async function createSynthesisRule(
  ingredientAId: string,
  ingredientBId: string,
  resultId: string
): Promise<SynthesisRule | null> {
  const sb = getSupabase();
  if (!sb) return null;

  const { data, error } = await sb
    .from('synthesis_rules')
    .insert({
      ingredient_a: ingredientAId,
      ingredient_b: ingredientBId,
      result: resultId,
    })
    .select()
    .single();

  if (error) {
    console.error('Failed to create synthesis rule:', error);
    return null;
  }
  return data as SynthesisRule;
}

// ---- 冲突检测 (本地数据) ----

export function checkRuleConflict(
  ingredientAId: string,
  ingredientBId: string,
  existingRules: SynthesisRule[]
): ConflictCheckResult {
  const conflict = existingRules.find(
    (rule) =>
      (rule.ingredient_a === ingredientAId && rule.ingredient_b === ingredientBId) ||
      (rule.ingredient_a === ingredientBId && rule.ingredient_b === ingredientAId)
  );

  if (conflict) {
    return {
      hasConflict: true,
      conflictType: 'duplicate_rule',
      message: '该原料组合已存在合成规则',
    };
  }

  return { hasConflict: false, conflictType: null, message: '' };
}

export function checkNameConflict(
  name: string,
  existingMatters: Matter[]
): ConflictCheckResult {
  const conflict = existingMatters.find(
    (m) => m.name.toLowerCase() === name.toLowerCase()
  );

  if (conflict) {
    return {
      hasConflict: true,
      conflictType: 'duplicate_name',
      message: `物质 "${name}" 已存在`,
    };
  }

  return { hasConflict: false, conflictType: null, message: '' };
}

// ---- 合成查询 (本地数据) ----

export function findSynthesisResult(
  ingredientAId: string,
  ingredientBId: string,
  rules: SynthesisRule[]
): SynthesisRule | undefined {
  return rules.find(
    (rule) =>
      (rule.ingredient_a === ingredientAId && rule.ingredient_b === ingredientBId) ||
      (rule.ingredient_a === ingredientBId && rule.ingredient_b === ingredientAId)
  );
}
