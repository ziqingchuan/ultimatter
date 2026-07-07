-- ============================================
-- Ultimatter Database Schema
-- ============================================

-- 物质表
CREATE TABLE IF NOT EXISTS matters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  rarity SMALLINT NOT NULL CHECK (rarity >= 1 AND rarity <= 10),
  inventor TEXT,
  is_basic BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 合成规则表
CREATE TABLE IF NOT EXISTS synthesis_rules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ingredient_a UUID NOT NULL REFERENCES matters(id) ON DELETE CASCADE,
  ingredient_b UUID NOT NULL REFERENCES matters(id) ON DELETE CASCADE,
  result UUID NOT NULL REFERENCES matters(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(ingredient_a, ingredient_b)
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_matters_rarity ON matters(rarity);
CREATE INDEX IF NOT EXISTS idx_matters_name ON matters(name);
CREATE INDEX IF NOT EXISTS idx_synthesis_rules_ingredient_a ON synthesis_rules(ingredient_a);
CREATE INDEX IF NOT EXISTS idx_synthesis_rules_ingredient_b ON synthesis_rules(ingredient_b);
CREATE INDEX IF NOT EXISTS idx_synthesis_rules_result ON synthesis_rules(result);

-- ============================================
-- RLS (Row Level Security)
-- ============================================

ALTER TABLE matters ENABLE ROW LEVEL SECURITY;
ALTER TABLE synthesis_rules ENABLE ROW LEVEL SECURITY;

-- 公开读取
CREATE POLICY "Allow public read on matters" ON matters FOR SELECT USING (true);
CREATE POLICY "Allow public read on synthesis_rules" ON synthesis_rules FOR SELECT USING (true);

-- 允许插入（匿名用户也可写入，便于创意模式）
CREATE POLICY "Allow insert on matters" ON matters FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow insert on synthesis_rules" ON synthesis_rules FOR INSERT WITH CHECK (true);

-- ============================================
-- 基础合成树种子数据
-- ============================================

-- 基础物质 (is_basic = true)
INSERT INTO matters (name, rarity, is_basic) VALUES
  ('火', 1, true),
  ('水', 1, true),
  ('土', 1, true),
  ('风', 1, true),
  ('石', 2, true),
  ('木', 2, true),
  ('铁', 2, true),
  ('冰', 2, true);

-- 第一层合成结果
INSERT INTO matters (name, rarity, is_basic) VALUES
  ('蒸汽', 2, false),
  ('岩浆', 3, false),
  ('炭', 2, false),
  ('石灰', 3, false),
  ('泥', 2, false),
  ('云', 2, false),
  ('沙', 2, false),
  ('雪', 3, false),
  ('钢', 3, false),
  ('霜', 2, false);

-- 第一层合成规则
INSERT INTO synthesis_rules (ingredient_a, ingredient_b, result)
SELECT a.id, b.id, r.id FROM matters a, matters b, matters r
WHERE a.name = '火' AND b.name = '水' AND r.name = '蒸汽'
UNION ALL
SELECT a.id, b.id, r.id FROM matters a, matters b, matters r
WHERE a.name = '火' AND b.name = '土' AND r.name = '岩浆'
UNION ALL
SELECT a.id, b.id, r.id FROM matters a, matters b, matters r
WHERE a.name = '火' AND b.name = '木' AND r.name = '炭'
UNION ALL
SELECT a.id, b.id, r.id FROM matters a, matters b, matters r
WHERE a.name = '火' AND b.name = '石' AND r.name = '石灰'
UNION ALL
SELECT a.id, b.id, r.id FROM matters a, matters b, matters r
WHERE a.name = '水' AND b.name = '土' AND r.name = '泥'
UNION ALL
SELECT a.id, b.id, r.id FROM matters a, matters b, matters r
WHERE a.name = '水' AND b.name = '风' AND r.name = '云'
UNION ALL
SELECT a.id, b.id, r.id FROM matters a, matters b, matters r
WHERE a.name = '土' AND b.name = '风' AND r.name = '沙'
UNION ALL
SELECT a.id, b.id, r.id FROM matters a, matters b, matters r
WHERE a.name = '水' AND b.name = '冰' AND r.name = '雪'
UNION ALL
SELECT a.id, b.id, r.id FROM matters a, matters b, matters r
WHERE a.name = '铁' AND b.name = '火' AND r.name = '钢'
UNION ALL
SELECT a.id, b.id, r.id FROM matters a, matters b, matters r
WHERE a.name = '风' AND b.name = '冰' AND r.name = '霜';

-- 第二层合成结果
INSERT INTO matters (name, rarity, is_basic) VALUES
  ('玻璃', 4, false),
  ('砖', 3, false),
  ('黑曜石', 4, false),
  ('煤', 3, false),
  ('雨', 3, false),
  ('雾', 3, false),
  ('水泥', 4, false),
  ('冰晶', 4, false),
  ('盐', 3, false),
  ('铜', 4, false);

-- 第二层合成规则
INSERT INTO synthesis_rules (ingredient_a, ingredient_b, result)
SELECT a.id, b.id, r.id FROM matters a, matters b, matters r
WHERE a.name = '沙' AND b.name = '火' AND r.name = '玻璃'
UNION ALL
SELECT a.id, b.id, r.id FROM matters a, matters b, matters r
WHERE a.name = '泥' AND b.name = '火' AND r.name = '砖'
UNION ALL
SELECT a.id, b.id, r.id FROM matters a, matters b, matters r
WHERE a.name = '岩浆' AND b.name = '水' AND r.name = '黑曜石'
UNION ALL
SELECT a.id, b.id, r.id FROM matters a, matters b, matters r
WHERE a.name = '炭' AND b.name = '土' AND r.name = '煤'
UNION ALL
SELECT a.id, b.id, r.id FROM matters a, matters b, matters r
WHERE a.name = '云' AND b.name = '水' AND r.name = '雨'
UNION ALL
SELECT a.id, b.id, r.id FROM matters a, matters b, matters r
WHERE a.name = '蒸汽' AND b.name = '风' AND r.name = '雾'
UNION ALL
SELECT a.id, b.id, r.id FROM matters a, matters b, matters r
WHERE a.name = '石灰' AND b.name = '沙' AND r.name = '水泥'
UNION ALL
SELECT a.id, b.id, r.id FROM matters a, matters b, matters r
WHERE a.name = '雪' AND b.name = '风' AND r.name = '冰晶'
UNION ALL
SELECT a.id, b.id, r.id FROM matters a, matters b, matters r
WHERE a.name = '石' AND b.name = '水' AND r.name = '盐'
UNION ALL
SELECT a.id, b.id, r.id FROM matters a, matters b, matters r
WHERE a.name = '岩浆' AND b.name = '炭' AND r.name = '铜';

-- 第三层合成结果
INSERT INTO matters (name, rarity, is_basic) VALUES
  ('水晶', 5, false),
  ('陶', 4, false),
  ('硫', 4, false),
  ('大理石', 4, false),
  ('碱', 4, false),
  ('墨', 4, false),
  ('铸铁', 4, false),
  ('纸', 5, false);

-- 第三层合成规则
INSERT INTO synthesis_rules (ingredient_a, ingredient_b, result)
SELECT a.id, b.id, r.id FROM matters a, matters b, matters r
WHERE a.name = '玻璃' AND b.name = '冰晶' AND r.name = '水晶'
UNION ALL
SELECT a.id, b.id, r.id FROM matters a, matters b, matters r
WHERE a.name = '泥' AND b.name = '沙' AND r.name = '陶'
UNION ALL
SELECT a.id, b.id, r.id FROM matters a, matters b, matters r
WHERE a.name = '岩浆' AND b.name = '雨' AND r.name = '硫'
UNION ALL
SELECT a.id, b.id, r.id FROM matters a, matters b, matters r
WHERE a.name = '石灰' AND b.name = '水' AND r.name = '大理石'
UNION ALL
SELECT a.id, b.id, r.id FROM matters a, matters b, matters r
WHERE a.name = '盐' AND b.name = '石灰' AND r.name = '碱'
UNION ALL
SELECT a.id, b.id, r.id FROM matters a, matters b, matters r
WHERE a.name = '炭' AND b.name = '水' AND r.name = '墨'
UNION ALL
SELECT a.id, b.id, r.id FROM matters a, matters b, matters r
WHERE a.name = '钢' AND b.name = '炭' AND r.name = '铸铁'
UNION ALL
SELECT a.id, b.id, r.id FROM matters a, matters b, matters r
WHERE a.name = '木' AND b.name = '石灰' AND r.name = '纸';

-- 第四层合成结果
INSERT INTO matters (name, rarity, is_basic) VALUES
  ('红宝石', 6, false),
  ('蓝宝石', 6, false),
  ('翡翠', 6, false),
  ('青铜', 5, false),
  ('焦油', 4, false),
  ('瓷', 5, false);

-- 第四层合成规则
INSERT INTO synthesis_rules (ingredient_a, ingredient_b, result)
SELECT a.id, b.id, r.id FROM matters a, matters b, matters r
WHERE a.name = '水晶' AND b.name = '岩浆' AND r.name = '红宝石'
UNION ALL
SELECT a.id, b.id, r.id FROM matters a, matters b, matters r
WHERE a.name = '水晶' AND b.name = '冰' AND r.name = '蓝宝石'
UNION ALL
SELECT a.id, b.id, r.id FROM matters a, matters b, matters r
WHERE a.name = '大理石' AND b.name = '铜' AND r.name = '翡翠'
UNION ALL
SELECT a.id, b.id, r.id FROM matters a, matters b, matters r
WHERE a.name = '钢' AND b.name = '铜' AND r.name = '青铜'
UNION ALL
SELECT a.id, b.id, r.id FROM matters a, matters b, matters r
WHERE a.name = '煤' AND b.name = '蒸汽' AND r.name = '焦油'
UNION ALL
SELECT a.id, b.id, r.id FROM matters a, matters b, matters r
WHERE a.name = '陶' AND b.name = '冰晶' AND r.name = '瓷';

-- 第五层合成结果
INSERT INTO matters (name, rarity, is_basic) VALUES
  ('钻石', 8, false),
  ('玛瑙', 7, false),
  ('钨', 7, false);

-- 第五层合成规则
INSERT INTO synthesis_rules (ingredient_a, ingredient_b, result)
SELECT a.id, b.id, r.id FROM matters a, matters b, matters r
WHERE a.name = '红宝石' AND b.name = '蓝宝石' AND r.name = '钻石'
UNION ALL
SELECT a.id, b.id, r.id FROM matters a, matters b, matters r
WHERE a.name = '翡翠' AND b.name = '大理石' AND r.name = '玛瑙'
UNION ALL
SELECT a.id, b.id, r.id FROM matters a, matters b, matters r
WHERE a.name = '铸铁' AND b.name = '碱' AND r.name = '钨';

-- 第六层合成结果
INSERT INTO matters (name, rarity, is_basic) VALUES
  ('秘银', 9, false),
  ('星陨铁', 9, false);

-- 第六层合成规则
INSERT INTO synthesis_rules (ingredient_a, ingredient_b, result)
SELECT a.id, b.id, r.id FROM matters a, matters b, matters r
WHERE a.name = '青铜' AND b.name = '钨' AND r.name = '秘银'
UNION ALL
SELECT a.id, b.id, r.id FROM matters a, matters b, matters r
WHERE a.name = '钢' AND b.name = '钻石' AND r.name = '星陨铁';

-- 第七层合成结果
INSERT INTO matters (name, rarity, is_basic) VALUES
  ('元晶', 10, false);

-- 第七层合成规则
INSERT INTO synthesis_rules (ingredient_a, ingredient_b, result)
SELECT a.id, b.id, r.id FROM matters a, matters b, matters r
WHERE a.name = '秘银' AND b.name = '星陨铁' AND r.name = '元晶';
