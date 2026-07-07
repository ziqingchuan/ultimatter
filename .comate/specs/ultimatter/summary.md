# Ultimatter 项目构建总结

## 项目概述

Ultimatter（终质合成）是一个物质合成游戏，使用 React + Vite + TypeScript 构建，数据库使用 Supabase。项目已完成全部 10 个任务，TypeScript 编译和 Vite 生产构建均通过。

## 已完成任务

### 1. 项目脚手架与基础设施
- Vite + React + TypeScript 项目初始化
- 安装 @supabase/supabase-js, react-router-dom
- 配置路径别名 (@/ -> src/)
- 创建全局暗色科技风 CSS 变量体系
- 创建 .env.example 环境变量模板

### 2. Supabase 配置文档与 SQL
- `docs/supabase-setup.md`: 连接配置指南、环境变量说明、RLS 策略说明
- `docs/supabase-schema.sql`: 完整建表 SQL（matters + synthesis_rules）、索引、RLS 策略、基础合成树种子数据（36个物质 + 31条合成规则）

### 3. TypeScript 类型与基础合成树
- `src/types/index.ts`: Matter, SynthesisRule, RarityLevel, RARITY_MAP 等类型定义
- `src/data/baseTree.ts`: 8个基础物质 + 28个合成物质的本地数据，31条合成规则

### 4. Supabase 客户端与服务层
- `src/services/supabase.ts`: 客户端初始化、数据加载、CRUD 操作
- 冲突检测函数: checkRuleConflict, checkNameConflict
- 合成查询函数: findSynthesisResult
- 优雅降级：Supabase 未配置时自动使用本地数据

### 5. 通用 UI 组件
- **MatterCard**: 物质卡片，支持稀有度背景色、发光边框、终极特殊渐变边框
- **SearchBar**: 搜索输入框，带图标和清除按钮
- **SynthesisSlot**: 合成槽，支持放置/清除物质
- **MatterPanel**: 物质面板，按稀有度分组、搜索筛选
- **ConflictAlert**: 冲突提示组件，显示规则/名称冲突

### 6. 首页
- 游戏标题渐变动画
- 粒子背景效果
- 三张模式入口卡片（基础合成/创意模式/物质图鉴）

### 7. 基础合成模式
- 三栏布局：左侧物质面板 / 中间合成台 / 右侧历史记录
- 点击选择物质放入合成槽
- 合成成功/失败反馈，失败时引导至创意模式
- 合成历史记录

### 8. 创意模式
- 三栏布局：原料选择 / 表单填写 / 物质列表
- 实时冲突检测（原料组合已有结果、物质重名、相同物质）
- 稀有度10级选择器
- 提交后写入 Supabase 或本地状态

### 9. 物质图鉴
- 按稀有度分组的网格展示
- 稀有度筛选标签栏
- 搜索功能
- 已发现/未发现状态切换
- 发明人显示

### 10. 整体联调与优化
- TypeScript 编译零错误
- Vite 生产构建成功（CSS 21KB, JS 259KB gzip 80KB）
- 清理了 Vite 默认模板文件
- 添加 Inter 字体和中文页面标题

## 关键设计决策

1. **离线降级**: Supabase 未配置时自动使用本地基础合成树数据，确保游戏可玩
2. **实时冲突检测**: 创意模式中选择原料和输入名称时立即检测冲突，而非提交后
3. **合成规则双向匹配**: A+B 和 B+A 都能匹配同一规则
4. **稀有度视觉层次**: 10个等级各有独特配色，终极(10)等级有动态渐变边框
5. **无 emoji**: 所有物质仅文字展示，UI 中不含任何 emoji

## 启动方式

```bash
cd 终质合成
npm run dev
```

## Supabase 配置

1. 参考 `docs/supabase-setup.md`
2. 在 `.env` 中填入 Supabase URL 和 anon key
3. 在 SQL Editor 中执行 `docs/supabase-schema.sql`
