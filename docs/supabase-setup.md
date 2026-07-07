# Supabase 配置指南

## 1. 创建 Supabase 项目

1. 访问 [Supabase](https://supabase.com) 并登录
2. 点击 "New Project" 创建新项目
3. 填写项目名称（如 `ultimatter`）和数据库密码
4. 选择离你最近的区域
5. 等待项目初始化完成

## 2. 配置环境变量

在项目根目录创建 `.env` 文件（参考 `.env.example`）：

```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

获取方式：
- 进入项目 Dashboard → Settings → API
- `VITE_SUPABASE_URL` 对应 "Project URL"
- `VITE_SUPABASE_ANON_KEY` 对应 "anon public" key

## 3. 初始化数据库

1. 进入 SQL Editor（左侧导航栏）
2. 将 `supabase-schema.sql` 的内容复制粘贴到编辑器中
3. 点击 Run 执行

这将创建：
- `matters` 表（物质数据）
- `synthesis_rules` 表（合成规则）
- RLS 策略（公开读取，认证用户可写）
- 基础合成树种子数据

## 4. RLS 说明

- **matters 表**：所有人可读，认证用户可插入
- **synthesis_rules 表**：所有人可读，认证用户可插入
- 如需开放匿名写入（方便测试），可在 SQL Editor 中执行：

```sql
ALTER TABLE matters ENABLE ROW LEVEL SECURITY;
ALTER TABLE synthesis_rules ENABLE ROW LEVEL SECURITY;

-- 允许匿名插入（测试用，生产环境建议去掉）
CREATE POLICY "Allow anonymous insert on matters" ON matters FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous insert on synthesis_rules" ON synthesis_rules FOR INSERT WITH CHECK (true);
```

## 5. 数据同步逻辑

应用启动时会从 Supabase 加载全部物质和合成规则到前端状态，后续操作：
- 基础合成：本地查询，不涉及网络请求
- 创意模式提交：写入 Supabase 后更新本地状态
- 冲突检测：实时查询本地缓存数据

## 6. 注意事项

- Supabase 免费版有 500MB 数据库限制，对本项目绰绰有余
- `anon` key 是公开的（前端可见），安全性由 RLS 保证
- 不要将 `service_role` key 放在前端代码中
