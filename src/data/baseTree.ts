import type { RarityLevel } from '../types';

export interface BaseMatterDef {
  name: string;
  rarity: RarityLevel;
  is_basic: boolean;
}

export interface BaseRuleDef {
  ingredientA: string;
  ingredientB: string;
  result: string;
}

export const BASE_MATTERS: BaseMatterDef[] = [
  // === 基础物质 ===
  { name: '火', rarity: 1, is_basic: true },
  { name: '水', rarity: 1, is_basic: true },
  { name: '土', rarity: 1, is_basic: true },
  { name: '风', rarity: 1, is_basic: true },
  { name: '石', rarity: 2, is_basic: true },
  { name: '木', rarity: 2, is_basic: true },
  { name: '铁', rarity: 2, is_basic: true },
  { name: '冰', rarity: 2, is_basic: true },

  // === 第一层：元素组合 ===
  { name: '蒸汽', rarity: 2, is_basic: false },    // 自然
  { name: '岩浆', rarity: 3, is_basic: false },    // 自然
  { name: '炭', rarity: 2, is_basic: false },      // 有机
  { name: '石灰', rarity: 3, is_basic: false },    // 矿物
  { name: '泥', rarity: 2, is_basic: false },      // 自然
  { name: '云', rarity: 2, is_basic: false },      // 自然
  { name: '沙', rarity: 2, is_basic: false },      // 矿物
  { name: '雪', rarity: 3, is_basic: false },      // 自然
  { name: '钢', rarity: 3, is_basic: false },      // 金属
  { name: '霜', rarity: 2, is_basic: false },      // 自然

  // === 第二层：初加工 ===
  { name: '玻璃', rarity: 4, is_basic: false },    // 材料
  { name: '砖', rarity: 3, is_basic: false },      // 材料
  { name: '黑曜石', rarity: 4, is_basic: false },  // 矿石
  { name: '煤', rarity: 3, is_basic: false },      // 有机
  { name: '雨', rarity: 3, is_basic: false },      // 自然
  { name: '雾', rarity: 3, is_basic: false },      // 自然
  { name: '水泥', rarity: 4, is_basic: false },    // 材料
  { name: '冰晶', rarity: 4, is_basic: false },    // 矿物
  { name: '盐', rarity: 3, is_basic: false },      // 矿物
  { name: '铜', rarity: 4, is_basic: false },      // 金属

  // === 第三层：精加工 ===
  { name: '水晶', rarity: 5, is_basic: false },    // 宝石
  { name: '陶', rarity: 4, is_basic: false },      // 材料
  { name: '硫', rarity: 4, is_basic: false },      // 矿物
  { name: '大理石', rarity: 4, is_basic: false },  // 矿石
  { name: '碱', rarity: 4, is_basic: false },      // 矿物
  { name: '墨', rarity: 4, is_basic: false },      // 材料
  { name: '铸铁', rarity: 4, is_basic: false },    // 金属
  { name: '纸', rarity: 5, is_basic: false },      // 材料

  // === 第四层：高级合成 ===
  { name: '红宝石', rarity: 6, is_basic: false },  // 宝石
  { name: '蓝宝石', rarity: 6, is_basic: false },  // 宝石
  { name: '翡翠', rarity: 6, is_basic: false },    // 宝石
  { name: '青铜', rarity: 5, is_basic: false },    // 金属
  { name: '焦油', rarity: 4, is_basic: false },    // 有机
  { name: '瓷', rarity: 5, is_basic: false },      // 材料

  // === 第五层：稀有物质 ===
  { name: '钻石', rarity: 8, is_basic: false },    // 宝石
  { name: '玛瑙', rarity: 7, is_basic: false },    // 宝石
  { name: '钨', rarity: 7, is_basic: false },      // 金属

  // === 第六层：传说金属 ===
  { name: '秘银', rarity: 9, is_basic: false },    // 金属
  { name: '星陨铁', rarity: 9, is_basic: false },  // 金属

  // === 第七层：终极物质 ===
  { name: '元晶', rarity: 10, is_basic: false },   // 宝石
];

export const BASE_RULES: BaseRuleDef[] = [
  // === 第一层：元素互合 ===
  { ingredientA: '火', ingredientB: '水', result: '蒸汽' },
  { ingredientA: '火', ingredientB: '土', result: '岩浆' },
  { ingredientA: '火', ingredientB: '木', result: '炭' },
  { ingredientA: '火', ingredientB: '石', result: '石灰' },
  { ingredientA: '水', ingredientB: '土', result: '泥' },
  { ingredientA: '水', ingredientB: '风', result: '云' },
  { ingredientA: '土', ingredientB: '风', result: '沙' },
  { ingredientA: '水', ingredientB: '冰', result: '雪' },
  { ingredientA: '铁', ingredientB: '火', result: '钢' },
  { ingredientA: '风', ingredientB: '冰', result: '霜' },

  // === 第二层：初加工 ===
  { ingredientA: '沙', ingredientB: '火', result: '玻璃' },
  { ingredientA: '泥', ingredientB: '火', result: '砖' },
  { ingredientA: '岩浆', ingredientB: '水', result: '黑曜石' },
  { ingredientA: '炭', ingredientB: '土', result: '煤' },
  { ingredientA: '云', ingredientB: '水', result: '雨' },
  { ingredientA: '蒸汽', ingredientB: '风', result: '雾' },
  { ingredientA: '石灰', ingredientB: '沙', result: '水泥' },
  { ingredientA: '雪', ingredientB: '风', result: '冰晶' },
  { ingredientA: '石', ingredientB: '水', result: '盐' },
  { ingredientA: '岩浆', ingredientB: '炭', result: '铜' },

  // === 第三层：精加工 ===
  { ingredientA: '玻璃', ingredientB: '冰晶', result: '水晶' },
  { ingredientA: '泥', ingredientB: '沙', result: '陶' },
  { ingredientA: '岩浆', ingredientB: '雨', result: '硫' },
  { ingredientA: '石灰', ingredientB: '水', result: '大理石' },
  { ingredientA: '盐', ingredientB: '石灰', result: '碱' },
  { ingredientA: '炭', ingredientB: '水', result: '墨' },
  { ingredientA: '钢', ingredientB: '炭', result: '铸铁' },
  { ingredientA: '木', ingredientB: '石灰', result: '纸' },

  // === 第四层：高级合成 ===
  { ingredientA: '水晶', ingredientB: '岩浆', result: '红宝石' },
  { ingredientA: '水晶', ingredientB: '冰', result: '蓝宝石' },
  { ingredientA: '大理石', ingredientB: '铜', result: '翡翠' },
  { ingredientA: '钢', ingredientB: '铜', result: '青铜' },
  { ingredientA: '煤', ingredientB: '蒸汽', result: '焦油' },
  { ingredientA: '陶', ingredientB: '冰晶', result: '瓷' },

  // === 第五层：稀有物质 ===
  { ingredientA: '红宝石', ingredientB: '蓝宝石', result: '钻石' },
  { ingredientA: '翡翠', ingredientB: '大理石', result: '玛瑙' },
  { ingredientA: '铸铁', ingredientB: '碱', result: '钨' },

  // === 第六层：传说金属 ===
  { ingredientA: '青铜', ingredientB: '钨', result: '秘银' },
  { ingredientA: '钢', ingredientB: '钻石', result: '星陨铁' },

  // === 第七层：终极物质 ===
  { ingredientA: '秘银', ingredientB: '星陨铁', result: '元晶' },
];
