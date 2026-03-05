# SaaS 出海群站自动化架构 — 完整学习笔记

> **来源**：一位月入 $30,000+ 的独立开发者分享的"一个人的 SaaS 出海群站自动化架构"
> **技术栈**：CF Pages + Workers + D1 + Astro + Monorepo
> **更新日期**：2026-03-05

---

## 目录

1. [核心思路](#一核心思路)
2. [什么是 SaaS 工具站](#二什么是-saas-工具站)
3. [技术栈 — 每个工具的角色](#三技术栈--每个工具的角色)
4. [Monorepo — 中央厨房](#四monorepo--中央厨房)
5. [Astro 群岛架构](#五astro-群岛架构)
6. [SEO 群链 — 站群互相推荐](#六seo-群链--站群互相推荐)
7. [数据库当 CMS](#七数据库当-cms)
8. [复杂工具怎么处理](#八复杂工具怎么处理)
9. [新站上线完整流程](#九新站上线完整流程)
10. [收益模型](#十收益模型)
11. [进阶架构：Astro 站群 + ShipAny 中央业务中心](#十一进阶架构astro-站群--shipany-中央业务中心)
12. [战略总结：AI 时代独立开发者的出海路线图](#十二战略总结ai-时代独立开发者的出海路线图)

---

## 一、核心思路

**用一套"店铺模板"快速复制出几十个小工具网站，靠 Google 搜索带来免费流量，用户按月付费使用工具。**

```text
找到有人搜但没人做好的工具需求
    → 从模板复制一个新站，改配置上线
    → 部署到 Cloudflare（免费）
    → 站群互相推荐，提升 Google 排名
    → 用户免费试用，想用更多就按月付费
    → 重复以上步骤，不断开新站
```

---

## 二、什么是 SaaS 工具站

就是**网上的小工具**，比如：

- 在线 PDF 转 Word
- AI 帮你写简历
- 在线图片压缩
- AI 去水印

用户免费试用，想要更多功能就**按月付费**（$5~$20/月）。这就是 SaaS（Software as a Service，软件即服务）。

**"群站"**：不是只做一个，而是同时做几十个。每个卖的工具不同，但背后的系统一样。

---

## 三、技术栈 — 每个工具的角色

### 3.1 Cloudflare 全家桶（免费的"商场"）

| 工具           | 角色                               | 类比           |
| -------------- | ---------------------------------- | -------------- |
| **CF Pages**   | 静态网站托管，把网页放到网上       | 免费的店铺铺面 |
| **CF Workers** | 轻量服务器，处理登录/支付/外链注入 | 服务员/前台接待 |
| **D1**         | 免费 SQLite 数据库，存用户/文章/配置 | 档案馆/仓库    |

> **关键：这些全免费**，不用花钱买服务器。

### 3.2 Astro（网站构建框架）

- 生成的页面是**纯 HTML**，打开极快
- Google 爬虫直接看懂，搜索排名高
- 需要交互的地方可以嵌入 React/Vue/Svelte 组件
- **类比**：店铺装修模板

### 3.3 pnpm + Turborepo（代码管理工具）

- **pnpm**：管理"公共零件"和"各个网站"之间的依赖关系
- **Turborepo**：加速构建，只重新构建改动过的部分
- **类比**：中央厨房的调度系统

---

## 四、Monorepo — 中央厨房

### 4.1 什么是 Monorepo

**Repo** = 代码仓库，存放项目代码的文件夹。

- **普通做法**：每个网站一个仓库 → 30 个站就是 30 个仓库 → 改一个 bug 要改 30 遍
- **Monorepo**：所有网站放一个仓库 → 公共代码只写一次 → 改一处全站生效

### 4.2 完整文件结构

```text
monorepo/
├── packages/                  ← 公共零件，所有网站共用
│   ├── ui/                    ← 通用界面组件
│   │   ├── LoginModal.tsx     ← 登录弹窗（所有站一样）
│   │   ├── PayButton.tsx      ← 支付按钮（所有站一样）
│   │   ├── PricingTable.tsx   ← 定价表格（所有站一样）
│   │   ├── UploadZone.tsx     ← 文件上传区域
│   │   ├── ProgressBar.tsx    ← 进度条
│   │   └── Footer.tsx         ← 页脚
│   │
│   └── core/                  ← 通用后台逻辑
│       ├── db.ts              ← D1 数据库操作（ORM，翻译官）
│       ├── auth.ts            ← 用户认证（门卫）
│       ├── billing.ts         ← 计费逻辑（免费3次，之后付费）
│       └── tool-base.ts       ← 工具基类（上传→处理→下载的通用流程）
│
└── apps/                      ← 每个网站，只放自己独有的东西
    ├── pdf-tool/              ← PDF 工具站
    │   ├── config.json        ← 站名、颜色、域名
    │   ├── logo.png
    │   └── tools/             ← ⭐ 核心工具逻辑（独有）
    │       ├── pdf-to-word.ts
    │       └── pdf-compress.ts
    │
    ├── image-tool/            ← 图片工具站
    │   ├── config.json
    │   ├── logo.png
    │   └── tools/
    │       ├── compress.ts
    │       └── remove-watermark.ts
    │
    └── ai-writer/             ← AI 写作站
        ├── config.json
        ├── logo.png
        └── tools/
            └── generate-article.ts
```

### 4.3 怎么让每个网站用上公共组件

通过 `package.json` 里的 `workspace` 依赖关联：

```json
{
  "dependencies": {
    "@my/ui": "workspace:*",
    "@my/core": "workspace:*"
  }
}
```

`workspace:*` 的意思：不去网上下载，就用同一个仓库里的那个包。

### 4.4 核心优势

- **新建站点** = 复制一个 `apps/site-n` 目录 → 改 Logo 和配置 → 上线
- **修一个 bug** = 改 `packages/` 里一个文件 → 所有站自动生效
- **不用重复劳动**：登录、支付、UI 只写一次

---

## 五、Astro 群岛架构

### 5.1 为什么不用 React/Vue 整站构建

|              | React/Vue 整站                       | Astro              |
| ------------ | ------------------------------------ | ------------------ |
| 用户打开     | 先下载大量 JS → 运行 → 才看到内容  | 直接看到 HTML 内容 |
| 加载速度     | 慢                                   | 极快               |
| Google 爬虫  | 可能看到空白页                       | 直接读懂完整内容   |
| SEO          | 差                                   | 好                 |

### 5.2 "群岛"是什么意思

整个页面是**纯 HTML**（大海），只有需要交互的小块才加载 JS（小岛）：

```text
┌─────────────────────────────────────────┐
│  整个页面：纯 HTML（大海，静态，不需要 JS） │
│                                         │
│   ┌──────────┐      ┌──────────┐       │
│   │ React 组件│      │ Vue 组件  │       │
│   │ 价格计算器 │      │ 文件上传  │       │
│   │ （小岛）   │      │ （小岛）  │       │
│   └──────────┘      └──────────┘       │
│                                         │
└─────────────────────────────────────────┘
```

- 页面 90% 是静态 HTML，不需要 JS
- 只有需要用户操作的地方（上传文件、计算价格）才加载对应的组件
- **可以混用 React、Vue、Svelte**，看到网上好用的组件直接拿来用

---

## 六、SEO 群链 — 站群互相推荐

### 6.1 Google 怎么决定排名

> 如果很多网站都放了链接指向你，Google 就认为你很重要，给你排名更高。

别人链接你 = 给你投票。票越多，排名越高。

### 6.2 群链的意思

他的 30 个站**互相放对方的链接**：

- `pdf-tool.com` 底部推荐 → `image-tool.com`、`ai-writer.com`
- `image-tool.com` 底部推荐 → `pdf-tool.com`、`ai-writer.com`
- `ai-writer.com` 底部推荐 → `pdf-tool.com`、`image-tool.com`

Google 来看：每个站都被很多其他站推荐 → 都很重要 → 排名全部上去。

> **注意**：推荐的都是**他自己的其他站**，不是别人的网站。目的是互相导流和刷权重。

### 6.3 具体怎么操作

**第一步：在 D1 数据库里建一张"推荐清单"表**

就像一个 Excel 表格：

| 编号 | 哪个站要显示 | 推荐链接指向               | 显示文字     |
| ---- | ------------ | -------------------------- | ------------ |
| 1    | pdf-tool     | `https://image-tool.com`   | 图片压缩工具 |
| 2    | pdf-tool     | `https://ai-writer.com`    | AI写作助手   |
| 3    | image-tool   | `https://pdf-tool.com`     | PDF转换器    |
| 4    | image-tool   | `https://ai-writer.com`    | AI写作助手   |
| 5    | ai-writer    | `https://pdf-tool.com`     | PDF转换器    |
| 6    | ai-writer    | `https://image-tool.com`   | 图片压缩工具 |

**第二步：用户访问时 Worker 自动拼装**

```text
用户打开 pdf-tool.com
    → CF Worker 拦截请求
    → 看到域名是 pdf-tool.com
    → 去数据库查："pdf-tool 该显示哪些推荐链接？"
    → 查到：图片压缩工具、AI写作助手
    → 把这些链接塞进页面底部
    → 返回给用户
```

用户看到的效果：页面底部自动多了"推荐工具"区域，显示其他工具站的链接。

**第三步：想改推荐链接？改数据库就行**

```sql
-- 新做了一个 video-tool.com，想让所有站都推荐它：
INSERT INTO links VALUES (7, 'pdf-tool',   'https://video-tool.com', '视频转换器');
INSERT INTO links VALUES (8, 'image-tool', 'https://video-tool.com', '视频转换器');
INSERT INTO links VALUES (9, 'ai-writer',  'https://video-tool.com', '视频转换器');

-- 加完立刻生效。不用改代码，不用重新部署。
```

### 6.4 关键点

- 推荐链接**不是写在代码里的**，是 Worker 实时从数据库读取塞进去的
- 改数据库 = 更新所有站的推荐链接，秒生效
- 同一个站的推荐链接在数据库没改之前是固定的（不是每次访问都变）

---

## 七、数据库当 CMS

### 7.1 什么是 CMS

CMS（内容管理系统）= 管理网站上的文章、图片等内容的后台系统。

市面上的付费 CMS（Contentful、Sanity）每月几十到几百美元。

### 7.2 他的做法：用 D1 替代

博客文章以 Markdown 格式存在 D1 数据库里：

| 站点       | 标题             | 内容                 | 发布日期   |
| ---------- | ---------------- | -------------------- | ---------- |
| pdf-tool   | 如何将PDF转为Word | `## 三步搞定...`     | 2024-03-01 |
| image-tool | JPG和PNG的区别   | `## 常见格式对比...` | 2024-03-02 |

Astro 构建时直接从数据库读取文章内容，渲染成网页。

> **好处**：免费、一个数据库管所有站的内容、加文章就是往数据库插一行数据。

---

## 八、复杂工具怎么处理

### 8.1 简单工具

逻辑单一，一个文件搞定，代码放在 `apps/site-n/tools/` 里。

### 8.2 复杂工具

需要拆多个文件：

```text
apps/video-editor/tools/
├── upload.ts       ← 视频上传和格式校验
├── trim.ts         ← 视频裁剪
├── subtitle.ts     ← AI 生成字幕
├── filter.ts       ← 添加滤镜
├── export.ts       ← 导出和压缩
└── pipeline.ts     ← 串联以上步骤的流程控制
```

### 8.3 超重活（需要 GPU/AI 模型）

Worker 扛不住（有 CPU 和内存限制），就把重活外包给第三方 API：

```text
用户上传 → Worker 接收（轻活）→ 调用外部 API 处理（重活）→ Worker 拿到结果返回
```

Worker 只当"调度员"，重活交给 Replicate、OpenAI、FFmpeg 云服务等。

### 8.4 关键结论

**不管工具简单还是复杂，整体架构不变：**

```text
Monorepo 中央厨房
├── 公共零件（登录、支付、UI）  ← 所有站共用
└── 各个站点（配置 + 核心工具）  ← 每个站独有

部署到 Cloudflare（Pages + Workers + D1）

站群互链（数据库管理，动态注入）
```

变的只是每个站 `tools/` 里面的内容。

---

## 九、新站上线完整流程

1. **找需求** — 用 SEO 工具查什么关键词有搜索量但竞争小
2. **复制模板** — `cp -r apps/image-tool apps/watermark-remover`
3. **改配置** — 改 `config.json` 里的站名、颜色、域名，换 Logo
4. **写核心工具逻辑** — 在 `tools/` 文件夹里写这个站独有的功能代码
5. **写博客 + 加入互链** — 往数据库插入文章，在外链表加上新站的推荐链接
6. **部署上线** — 推代码到仓库 → CF Pages 自动构建 → 网站上线

---

## 十、收益模型

| 指标       | 数值                          |
| ---------- | ----------------------------- |
| 网站数量   | 30+ 个                       |
| 服务器成本 | ≈ 0（Cloudflare 免费额度）   |
| 人力       | 1 个人                       |
| 月收入     | $30,000+                     |

**为什么能做到：**

- 每个站瞄准一个小需求 → 竞争小，容易排到 Google 前面
- 30 个站互相推荐 → Google 权重互相提升
- 纯 HTML 加载快 → Google 给更高排名
- 服务器零成本 → 收入基本就是纯利润
- 一个人管理 → 没有人力成本

---

## 基础篇总结

> **核心不在技术多复杂，而在于标准化流程 + 批量执行力。**
>
> 把建站从"每次从零开始的手工活"变成"流水线上换个标签就出厂的标准化产品"。

六个关键词：

1. **Astro 静态优先** — 快就是权重
2. **Cloudflare 零成本** — 免费托管全家桶
3. **Monorepo 一处改全站更新** — 中央厨房
4. **D1 统一管数据** — 一个后台管 N 个站
5. **站群互链刷权重** — 数据库管理，动态注入
6. **长尾流量汇聚收入** — 不靠爆款，靠量

---

## 十一、进阶架构：Astro 站群 + ShipAny 中央业务中心

> 当站群发展到一定阶段，或者手头同时有 Astro 和 **ShipAny (Next.js SaaS 脚手架)** 时，如何完美集成并且管理不同的 API？

### 11.1 核心痛点

每个工具站需要的 API 不同（有的要处理图片，有的要防机器人，有的要调用 OpenAI），如果在每个 Astro 站里都写一套鉴权和扣费逻辑，加上分别配额，代码会极度冗余且难以维护。

### 11.2 终极解决方案：API Gateway（网关）+ 中央处理模式

#### 架构分工职责表

| 系统角色              | 部署与形态                         | 职责边界                                                                   | 对应目录                |
| --------------------- | ---------------------------------- | -------------------------------------------------------------------------- | ----------------------- |
| **前店（引流小弟）** | CF Pages（全球边缘极速 HTML）      | 只负责展示界面。纯静态，不配 API Key，不处理扣费逻辑。                     | `apps/image-tool` 等    |
| **后厂（中央大脑）** | Vercel 或主服务器（Next.js 环境）  | 负责算账和干重活。统一管理账号、Stripe 扣款、保管 API Key，统筹调度资源。  | `apps/shipany-core`     |

### 11.3 核心交互流程：一次"去水印"请求的完整旅程

> 场景：一个老外在 `image-tool.com` 想要用"去水印"功能（需花 1 个金币，背后调用的是某图片处理公司的收费 API）。

**① 发起请求（Astro 的工作）**

老外点了按钮，`image-tool.com`（Astro 前端）把原图片通过 `fetch` 发送给中央大脑：
`POST https://api.yourdomain.com/v1/image/remove-watermark`，并带上登录 Token（JWT）。

**② 拦截与算账（ShipAny 的工作）**

ShipAny 后端收到请求后：
- 鉴权：判断这个老外有没有登录？
- 查钱包：数据库里有没有开通 Pro 会员？还有没有剩余的 Credit？
- 如果钱不够 → 返回错误给 Astro → Astro 弹窗"请充值"

**③ 调度重活（ShipAny 的工作）**

钱够了 → ShipAny 从 `.env` 里掏出真正的第三方 API Key → 把图片发给图片处理公司

**④ 发货并记账（ShipAny 的工作）**

图片处理完毕 → ShipAny 把用户余额**减去 1 个金币** → 把处理好的图片传回 Astro

**⑤ 收工（Astro 的工作）**

Astro 拿到处理后的图片，显示在网页上："恭喜，处理完成，点击下载！"

### 11.4 这套架构的三大优势

1. **绝对安全**：所有核心商业机密（数据库密码、第三方 API Key）**全部捏在 ShipAny 一台服务器里**。前面几十个 Astro 站是光杆司令，被黑了也无所谓。
2. **无限扩展**：新增 `color-tool` 怎么办？Astro 里花五分钟建好前端页面，ShipAny 里加一个 API 路由就完事了。
3. **统一通行证（SSO）**：在 ShipAny 注册一次，所有工具站通用同一个账户和余额。

---

## 十二、战略总结：AI 时代独立开发者的出海路线图

> 以下是对 Astro、WordPress、ShipAny 三者对比，以及如何在 AI 时代用"双轨制"策略出海搞钱的完整思考总结。

### 12.1 三大建站工具的本质区别

| 维度             | Astro（前端框架）                    | WordPress（传统 CMS）      | ShipAny（SaaS 脚手架）                        |
| ---------------- | ------------------------------------ | -------------------------- | ---------------------------------------------- |
| **本质**         | 把网页以最快速度渲染出来的底层工具   | 开箱即用的完整建站管理系统 | 为你写好了 SaaS 核心基础代码的现成项目包       |
| **技术栈**       | JS/TS + React/Vue/Svelte             | PHP + MySQL                | Next.js + Drizzle ORM + better-auth            |
| **内置功能**     | 仅前端渲染和 Markdown 解析           | 文章管理、用户系统、丰富插件 | 登录、Stripe 支付、后台管理、多语言、AI SDK    |
| **性能 / SEO**   | 🏆 极佳（零 JS 群岛架构）           | 一般（需加装缓存插件）     | 优秀（Next.js Turbopack）                      |
| **最适合场景**   | SEO 引流站群、官网落地页、文档中心   | 传统内容博客、非程序员建站 | 快速上线可收费的 AI SaaS 产品                  |

> **一句话总结**：Astro 负责"让网页飞快"，WordPress 负责"让不懂代码的人也能建站"，ShipAny 负责"让开发者几天内上线一个能收钱的 SaaS"。

### 12.2 集成方案：前店后厂架构

> **核心原则**：不要把 ShipAny 的后端逻辑强行移植到 Astro 里，而是让它们各司其职。

```text
┌──────────────────────────────────────────────────────┐
│                    用户（老外）                        │
│                        │                              │
│        Google 搜索 ──→ 点击进入免费工具                 │
│                        │                              │
│                        ▼                              │
│  ┌─────────────────────────────────┐                  │
│  │    Astro 站群（前店 · 引流门面）   │                  │
│  │                                 │                  │
│  │  image-tool.com  json-tool.com  │                  │
│  │  color-tool.com  pdf-tool.com   │                  │
│  │                                 │                  │
│  │  职责：纯静态、极速、SEO 霸榜     │                  │
│  │  不碰：数据库、API Key、支付逻辑  │                  │
│  │                                 │                  │
│  │  用户点击"升级 Pro / 登录"        │                  │
│  │         │                       │                  │
│  └─────────┼───────────────────────┘                  │
│            │  跳转链接                                 │
│            ▼                                          │
│  ┌─────────────────────────────────┐                  │
│  │  ShipAny 中央后台（后厂 · 收银台）│                  │
│  │  app.yourdomain.com             │                  │
│  │                                 │                  │
│  │  职责：                          │                  │
│  │  - 用户注册 / 登录（better-auth）│                  │
│  │  - Stripe 收款（订阅 / 一次性）  │                  │
│  │  - 调用第三方 API（保管所有 Key）  │                  │
│  │  - 数据库读写（Drizzle ORM）     │                  │
│  │  - 扣费 / 查余额 / 管理后台      │                  │
│  └─────────────────────────────────┘                  │
└──────────────────────────────────────────────────────┘
```

### 12.3 我的双轨制执行策略

根据自身情况（开发能力薄弱，依赖 AI 编程，但比圈外人懂得多），制定了"双轨并行"的务实路线：

|                  | 轨道 A：工作时间                         | 轨道 B：个人时间                           |
| ---------------- | ---------------------------------------- | ------------------------------------------ |
| **框架**         | Astro 站群                               | ShipAny (Next.js)                          |
| **目标**         | 练工程管理思维 + 积累 SEO 流量资产       | 学习完整的 SaaS 商业闭环                   |
| **产出**         | 大量免费小工具站（无登录、无支付）       | 一个精品 AI SaaS 产品（带登录、支付）      |
| **变现**         | Google AdSense 广告 + 联盟客链接         | Stripe 订阅（$10~$30/月）                  |
| **核心 KPI**     | Google 收录数量、自然搜索流量             | 付费用户数、MRR（月经常性收入）            |
| **AI 依赖度**    | 高（AI 写前端组件）                      | 极高（AI 写全栈逻辑）                      |
| **风险**         | 低（纯静态，零成本运维）                 | 中（需跑通支付链路）                       |

**两条轨道的协同效应**：

- Astro 站群积累的流量，最终可以导流给 ShipAny 的付费产品
- ShipAny 里跑通的商业模式，可以反向指导 Astro 站群的选题方向
- 两者共同构成了一个完整的"引流 → 转化 → 变现"飞轮

### 12.4 AI 时代的核心生存法则：技术为用，业务为体

> **在 AI 时代，代码会贬值，但"知道该写什么代码"永远不会贬值。**

- **业务为体（不可替代的护城河）**：对目标用户痛点的深刻理解、对商业模式的判断力、对行业趋势的嗅觉——这些是 AI 无法替代的。
- **技术为用（随时可替换的工具）**：Astro、ShipAny、Cursor、Cloudflare、Stripe——这些全是打工仔，哪个好用就用哪个，过时了就换。

**最适合自己的业务领域 = 自己比别人懂得多的东西 × 确实有人愿意为之付钱**

三个灵魂拷问：

1. 过去的工作/生活经历中，什么领域我比身边 90% 的人都懂？
2. 在这个领域里，有没有人在网上抱怨某个流程太麻烦、太贵、太慢？
3. 我能不能用 AI + Astro/ShipAny，在一个周末把一个最小可用版本做出来扔到网上测试？

> **如果三个答案都是"是"——那就是属于自己的、AI 时代别人抢不走的赛道。**

### 12.5 行动纲领

1. **80% 精力花在理解客户和行业上** — 成为领域专家
2. **20% 精力花在用 AI + 工具把解决方案做出来** — 技术执行
3. **绝不碰复杂的微服务架构** — 保持单一框架，让 AI 能高效帮你 Debug
4. **用 Astro 快速验证需求** — 低成本试错
5. **用 ShipAny 完成商业转化** — 高效收割价值
6. **持续深耕垂直领域** — 构建不可替代的认知壁垒

---

# 实战篇：从零到自动化克隆建站的完整流程

> **以下内容记录了一次真实的 Pair Programming 实战过程。**
> 从一个空的 Monorepo 开始，到最终实现"一行命令克隆新站"的全流程。
> 每一步都附有思路说明，帮助你理解"为什么这样做"。

---

## 第一阶段：项目初始化与 Monorepo 搭建

### 1.1 目标

搭建一个 pnpm Monorepo 工程，包含：

- `packages/ui` — 共享 UI 组件库（React）
- `packages/core` — 共享类型定义与业务逻辑
- `apps/image-tool` — 第一个 Astro 站点（ImageSquish，图片压缩工具）

### 1.2 关键操作

```bash
# 初始化 pnpm workspace
mkdir astro && cd astro
pnpm init
# 创建 pnpm-workspace.yaml，声明 packages/* 和 apps/*
```

`pnpm-workspace.yaml` 内容：

```yaml
packages:
  - 'packages/*'
  - 'apps/*'
```

### 1.3 创建共享包

**`packages/core/src/types.ts`** — 定义了整个群站系统的"数据协议"：

```typescript
// 姐妹站信息（用于互链）
export interface SisterSite {
  name: string;
  url: string;
  description: string;
}

// 定价方案
export interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
}

// 站点配置 — 每个站的"身份证"
export interface SiteConfig {
  name: string;
  tagline: string;
  description: string;
  themeColor: string;
  accentColor: string;
  domain: string;
  sisterSites: SisterSite[];
  pricingPlans: PricingPlan[];
}
```

**`packages/ui/src/Footer.tsx`** — 封装统一的页脚组件，所有站点共享同一个 Footer。

> **思路**：把"不会因站点不同而改变的东西"全部抽到 `packages/` 里。改一处，全量更新。

### 1.4 创建第一个站点 ImageSquish

```bash
# 使用 Astro 初始化
cd apps/image-tool
npx astro init
pnpm add @saas/core @saas/ui  # 引用 workspace 内部包
```

核心文件结构：

```
apps/image-tool/
├── site.config.ts          # 站点配置（名称、颜色、定价、姐妹站列表）
├── wrangler.toml           # Cloudflare Pages 配置
├── src/
│   ├── layouts/Layout.astro  # 全局布局（head、meta、font）
│   ├── components/Navbar.astro
│   ├── tools/ImageCompressor.tsx  # React 群岛组件
│   └── pages/
│       ├── index.astro     # 首页（Hero + Features + CTA）
│       ├── tool.astro      # 工具页
│       └── pricing.astro   # 定价页
```

> **学到的设计原则**：`site.config.ts` 是一个站点的"灵魂"。所有页面都从它读取数据（站名、描述、颜色、定价方案、姐妹站列表），而不是在 HTML 里硬编码。这样做的好处是——换一个 `site.config.ts`，整个站就变了。

---

## 第二阶段：横向复制 — 快速生成第 2、第 3 个站

### 2.1 思路

既然 `image-tool` 已经跑通了，第二个站只需要：

1. 复制目录 `cp -r apps/image-tool apps/json-tool`
2. 修改 `site.config.ts`（名称改为 JSONGenie，颜色改为绿色）
3. 替换核心工具组件（`ImageCompressor.tsx` → `JsonFormatter.tsx`）
4. 修改 `wrangler.toml`（项目名改为 `jsongenie`）

### 2.2 完成的站点

| # | 站点 ID | 名称 | 主题色 | 核心工具 |
|---|---------|------|--------|----------|
| 1 | `image-tool` | ImageSquish | 紫色 `#6366f1` | 图片压缩 |
| 2 | `json-tool` | JSONGenie | 绿色 `#10b981` | JSON 格式化 |
| 3 | `color-tool` | ColorSpark | 橙色 `#f97316` | 调色板生成 |

### 2.3 部署到 Cloudflare Pages

```bash
# 构建所有站点
pnpm -r build

# 一站一站部署
npx wrangler pages deploy apps/image-tool/dist --project-name=imagesquish
npx wrangler pages deploy apps/json-tool/dist --project-name=jsongenie
npx wrangler pages deploy apps/color-tool/dist --project-name=colorspark
```

> **每个站都独立部署到 Cloudflare Pages**，有自己的 `.pages.dev` 域名。以后绑自定义域名只需在 CF Dashboard 操作。

---

## 第三阶段：D1 数据库驱动的动态互链系统

### 3.1 问题

手动在 `site.config.ts` 里写死姐妹站列表，每新增一个站就要改所有站的代码。这完全不"自动化"。

### 3.2 解决方案

用 **Cloudflare D1**（边缘 SQLite 数据库）存储所有站点信息，通过 **Cloudflare Functions** 中间件动态注入页脚数据。

#### 步骤 1：创建 D1 数据库

```bash
npx wrangler d1 create saas-links
```

#### 步骤 2：设计表结构

```sql
CREATE TABLE sites (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  site_id TEXT UNIQUE NOT NULL,
  site_name TEXT NOT NULL,
  url TEXT NOT NULL,
  description TEXT DEFAULT '',
  theme_color TEXT DEFAULT '#6366f1'
);

-- 插入三个站
INSERT INTO sites (site_id, site_name, url, description, theme_color)
VALUES
  ('imagesquish', 'ImageSquish', 'https://imagesquish.pages.dev', '免费在线图片压缩工具', '#6366f1'),
  ('jsongenie', 'JSONGenie', 'https://jsongenie.pages.dev', '在线 JSON 格式化与校验', '#10b981'),
  ('colorspark', 'ColorSpark', 'https://colorspark.pages.dev', '专业调色板生成器', '#f97316');
```

#### 步骤 3：编写 Worker 中间件

每个站的 `functions/_middleware.ts`：

```typescript
export const onRequest: PagesFunction<{ DB: D1Database }> = async (context) => {
  const response = await context.next();
  const contentType = response.headers.get('Content-Type') || '';
  if (!contentType.includes('text/html')) return response;

  // 从 D1 查询所有站点（排除自己）
  const currentSite = 'imagesquish'; // 每站不同
  const { results } = await context.env.DB
    .prepare('SELECT * FROM sites WHERE site_id != ?')
    .bind(currentSite)
    .all();

  // 生成页脚 HTML 并注入到 </body> 前
  const footerHtml = generateFooter(results);
  const html = (await response.text()).replace('</body>', footerHtml + '</body>');
  return new Response(html, response);
};
```

> **思路**：这是"数据库当 CMS"的核心实现。新增站点只需往 D1 插一行数据，所有站点的页脚会自动出现新站链接，零代码部署。

### 3.3 配置 wrangler.toml

```toml
name = "imagesquish"
compatibility_date = "2024-01-01"

[[d1_databases]]
binding = "DB"
database_name = "saas-links"
database_id = "a4623013-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

---

## 第四阶段：SEO 博客系统

### 4.1 为什么要做博客

工具站的核心流量来自 Google 搜索。但工具页本身只有几个关键词（如"图片压缩"），远远不够。博客可以覆盖大量**长尾关键词**（如"2026年最好用的图片压缩工具对比"），形成持续的自然流量入口。

### 4.2 技术选型：Astro Content Collections

Astro 内置了 **Content Collections** 功能，可以把 Markdown 文件当作数据源：

- 写 `.md` 文件 → Astro 编译 → 输出纯静态 HTML
- 支持 Zod Schema 校验 frontmatter
- 零运行时 JS，对 SEO 极其友好

### 4.3 实现步骤

#### 步骤 1：定义内容集合 Schema

`apps/image-tool/src/content/config.ts`：

```typescript
import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    author: z.string().default('ImageSquish 团队'),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog: blogCollection };
```

#### 步骤 2：编写博客文章

`apps/image-tool/src/content/blog/best-image-compression-tools-2026.md`：

```markdown
---
title: '2026年最好用的5款免费在线图片压缩工具'
description: '对比 TinyPNG、Squoosh、ImageSquish 等在线压缩工具...'
pubDate: 2026-03-01
tags: ['图片压缩', '工具对比']
---

## 1. ImageSquish（推荐）
纯浏览器端压缩...
```

> **Markdown 最终会编译成 HTML**！Google 爬虫看到的是纯 HTML 页面，不是 Markdown。而且 Markdown 中可以直接写 HTML 标签，也可以升级到 `.mdx` 嵌入 React 组件。

#### 步骤 3：创建共享排版组件 Prose

`packages/ui/src/Prose.tsx` — 统一的深色主题 Markdown 排版样式（标题、引用、代码块、表格等），所有站共享。

#### 步骤 4：创建博客页面

**列表页** `src/pages/blog/index.astro`：

```typescript
const posts = (await getCollection('blog'))
  .filter((p) => !p.data.draft)
  .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
```

**详情页** `src/pages/blog/[slug].astro`：

```typescript
export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map((post) => ({
    params: { slug: post.id },
    props: { post },
  }));
}
```

每篇文章自动注入 **JSON-LD 结构化数据**（`BlogPosting` Schema），这是 Google 识别博客内容的标准方式。

#### 步骤 5：横向复制到三站

每个站都独立维护自己的 `src/content/blog/` 目录，但共享同一套 Prose 组件和 Content Collection Schema 模式。

### 4.4 写新文章的流程

```markdown
# 只需在 src/content/blog/ 下新建 .md 文件
---
title: "你的文章标题"
description: "SEO 描述"
pubDate: 2026-03-05
tags: ["标签1", "标签2"]
---

正文内容...
```

推送代码后 Cloudflare Pages 自动构建部署，新文章自动进入 Sitemap。

---

## 第五阶段：自动化建站脚手架

### 5.1 问题

到目前为止，创建新站的流程是：

1. `cp -r` 复制一个现有站
2. 手动改一堆文件名、颜色、标题...
3. 容易遗漏、容易出错

### 5.2 解决方案：标准模板 + CLI 生成器

#### 步骤 1：创建标准模板 `apps/.template`

从 `image-tool` 复制后，做以下处理：

- 删除所有具体的业务组件（`ImageCompressor.tsx`）
- 删除所有博客测试文章
- 将所有硬编码值替换为占位符变量

```
# site.config.ts 中：
name: '{{SITE_NAME}}',
tagline: '{{TAGLINE}}',
description: '{{DESCRIPTION}}',
themeColor: '{{THEME_COLOR_HSL}}',
accentColor: '{{THEME_COLOR_HEX}}',
domain: '{{SITE_ID}}.pages.dev',

# package.json 中：
"name": "{{SITE_ID}}",

# wrangler.toml 中：
name = "{{SITE_ID}}"

# Navbar.astro 中：
<span class="logo-icon">{{SITE_ICON}}</span>

# index.astro 中：
{{HERO_TITLE}}
{{HERO_HIGHLIGHT}}

# tool.astro 中：
{{TOOL_TITLE}}
{{TOOL_DESC}}
```

#### 步骤 2：编写 Node.js CLI 脚本

`scripts/create-site.mjs` 的核心逻辑：

```javascript
// 1. 交互式收集信息
const siteId = await question('站点英文 ID (如 pdf-tool):');
const siteName = await question('站点显示名称:');
const themeColorHex = await question('主题色 HEX:');
// ...

// 2. 复制模板
fs.cpSync(TEMPLATE_DIR, newAppDir, { recursive: true });

// 3. 全局替换占位符
replaceVariablesInDir(newAppDir, {
  SITE_ID: siteId,
  SITE_NAME: siteName,
  THEME_COLOR_HEX: themeColorHex,
  THEME_COLOR_HSL: hexToHSL(themeColorHex),
  // ...
});

// 4. 输出 D1 注册 SQL
console.log(`npx wrangler d1 execute saas-links --command="INSERT INTO sites ..."`);
```

#### 步骤 3：注册快捷命令

```json
// 根目录 package.json
{
  "scripts": {
    "generate": "node scripts/create-site.mjs"
  }
}
```

### 5.3 实际测试

运行 `pnpm run generate`，输入：

- 站点 ID: `pdf-tool`
- 名称: `PDF合并大师`
- 图标: 📄
- 主题色: `#ef4444`（红色）

**5 秒内**，`apps/pdf-tool` 自动生成，包含完整的首页、工具页、定价页、博客系统、D1 中间件、Navbar 和 Footer。`pnpm dev` 启动后即可在浏览器中预览。

---

## 流程总结：本次对话的完整路线图

```
┌──────────────────────────────────────────────────────────────┐
│  第一阶段：基础设施                                            │
│  pnpm Monorepo + packages/ui + packages/core                │
│  → 建立"中央厨房"                                             │
├──────────────────────────────────────────────────────────────┤
│  第二阶段：第一个站 + 手动复制                                   │
│  image-tool → json-tool → color-tool                        │
│  → 验证"复制 + 改配置 = 新站"的模式是否成立                      │
├──────────────────────────────────────────────────────────────┤
│  第三阶段：D1 动态互链                                         │
│  Cloudflare D1 + Worker 中间件                               │
│  → 解决"新增站点不想改老站代码"的问题                             │
├──────────────────────────────────────────────────────────────┤
│  第四阶段：SEO 博客引擎                                        │
│  Astro Content Collections + Prose 组件 + JSON-LD            │
│  → 解决"工具站关键词有限，需要长尾流量"的问题                      │
├──────────────────────────────────────────────────────────────┤
│  第五阶段：自动化脚手架                                         │
│  apps/.template + create-site.mjs CLI                        │
│  → 解决"手动复制容易出错"的问题，实现分钟级建站                     │
└──────────────────────────────────────────────────────────────┘
```

### 每个阶段解决的核心问题

| 阶段 | 解决的问题 | 关键技术 |
|------|-----------|----------|
| 基础设施 | 代码重复、改一处要改 N 处 | pnpm workspace、共享包 |
| 手动复制 | 验证群站模式可行性 | `cp -r` + 改配置 |
| D1 互链 | 新站上线后老站不需要重新部署 | Cloudflare D1 + Workers |
| 博客系统 | 长尾 SEO 流量覆盖 | Astro Content Collections |
| 自动脚手架 | 消除人工复制的出错风险 | Node.js CLI + 模板变量替换 |

### 当前项目最终结构

```
astro/                              ← Monorepo 根目录
├── pnpm-workspace.yaml
├── package.json                    ← generate 命令入口
├── schema.sql                      ← D1 建表语句
├── scripts/
│   └── create-site.mjs             ← 一键建站 CLI
├── packages/
│   ├── core/src/types.ts           ← 共享类型 (SiteConfig, BlogFrontmatter)
│   └── ui/src/
│       ├── Footer.tsx              ← 共享页脚
│       ├── Prose.tsx               ← 共享博客排版
│       └── index.ts                ← 导出入口
└── apps/
    ├── .template/                  ← 标准模板（含 {{占位符}}）
    ├── image-tool/                 ← ImageSquish（已上线）
    ├── json-tool/                  ← JSONGenie（已上线）
    ├── color-tool/                 ← ColorSpark（已上线）
    └── pdf-tool/                   ← PDF合并大师（脚手架生成的）
```

> **核心结论**：整个系统的精髓在于**"配置驱动一切"**。
> 站点之间的区别只有 `site.config.ts` 和核心工具组件。
> 其余所有东西——布局、导航、页脚、博客、定价页、SEO 标签——全部由共享包和模板提供。
> 这就是为什么能做到"分钟级克隆新站"。
