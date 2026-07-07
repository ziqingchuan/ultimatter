# Ultimatter 项目任务计划

- [x] Task 1: 项目脚手架与基础设施搭建
    - 1.1: 使用 Vite 初始化 React + TypeScript 项目
    - 1.2: 安装依赖（@supabase/supabase-js, react-router-dom）
    - 1.3: 配置 tsconfig、vite.config
    - 1.4: 创建 .env.example 环境变量模板
    - 1.5: 创建全局暗色科技风 CSS 基础样式（变量、reset、字体）

- [x] Task 2: Supabase 配置文档与 SQL 脚本
    - 2.1: 编写 docs/supabase-setup.md（连接配置、环境变量说明、项目创建步骤）
    - 2.2: 编写 docs/supabase-schema.sql（建表、索引、RLS 策略、基础数据插入）

- [x] Task 3: TypeScript 类型定义与基础合成树数据
    - 3.1: 创建 src/types/index.ts（Matter, SynthesisRule, RarityLevel 等类型）
    - 3.2: 创建 src/data/baseTree.ts（基础物质定义 + 合成规则定义）

- [x] Task 4: Supabase 客户端封装与 API 服务层
    - 4.1: 创建 src/services/supabase.ts（客户端初始化、连接检测）
    - 4.2: 封装物质 CRUD 操作（getAllMatters, createMatter）
    - 4.3: 封装合成规则查询与创建操作（findRule, createRule, checkConflict）
    - 4.4: 实现初始化数据同步逻辑（从 Supabase 加载全量数据到本地状态）

- [x] Task 5: 通用 UI 组件开发
    - 5.1: 开发 MatterCard 物质卡片组件（稀有度背景色、发光边框、名称展示）
    - 5.2: 开发 SearchBar 搜索组件（支持物质名称模糊搜索）
    - 5.3: 开发 SynthesisSlot 合成槽组件（拖拽/点击放入物质、清空操作）
    - 5.4: 开发 MatterPanel 物质面板组件（按稀有度分组、搜索筛选、滚动列表）
    - 5.5: 开发 ConflictAlert 冲突提示组件（规则冲突、重名冲突的实时提示）

- [x] Task 6: 首页开发
    - 6.1: 创建 App.tsx 路由配置（Home, BasicMode, CreativeMode, Codex）
    - 6.2: 开发 Home 首页（游戏标题动画、模式选择入口卡片、背景粒子效果）

- [x] Task 7: 基础合成模式页开发
    - 7.1: 页面布局（左侧物质面板、中间合成台、右侧历史记录）
    - 7.2: 实现物质选择与合成槽交互（点击选择、拖拽放入）
    - 7.3: 实现合成逻辑（查询规则、展示结果、失败提示跳转创意模式）
    - 7.4: 实现已发现物质状态管理
    - 7.5: 实现合成历史记录
    - 7.6: 添加合成成功动画效果

- [x] Task 8: 创意模式页开发
    - 8.1: 页面布局（原料选择区、信息填写区、实时校验区、提交按钮）
    - 8.2: 实现原料选择器（搜索、选择、实时冲突检测）
    - 8.3: 实现新物质信息表单（名称、稀有度、发明人）
    - 8.4: 实现实时冲突检测（原料组合已有结果、物质重名）
    - 8.5: 实现提交逻辑（校验通过后写入 Supabase、更新本地状态）
    - 8.6: 添加提交成功反馈动画

- [x] Task 9: 物质图鉴页开发
    - 9.1: 页面布局（全部物质展示、稀有度筛选、搜索）
    - 9.2: 实现物质卡片网格展示
    - 9.3: 实现已发现/未发现状态区分

- [x] Task 10: 整体联调与优化
    - 10.1: 路由切换与全局状态同步测试
    - 10.2: 创意模式提交后基础模式立即可用新物质验证
    - 10.3: 冲突检测边界情况测试（自身合成、空输入等）
    - 10.4: UI 细节打磨（响应式适配、动画流畅度、交互反馈）
