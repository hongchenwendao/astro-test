  /** 姐妹站点 — 用于站群互链 */
export interface SisterSite {
  name: string;
  url: string;
  description: string;
}

/** 定价方案 */
export interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
}

/** 站点配置 */
export interface SiteConfig {
  /** 站点名称 */
  name: string;
  /** 标语 */
  tagline: string;
  /** SEO 描述 */
  description: string;
  /** 主题色 (HSL format for CSS) */
  themeColor: string;
  /** 强调色 */
  accentColor: string;
  /** 域名 */
  domain: string;
  /** 姐妹站清单（互链） */
  sisterSites: SisterSite[];
  /** 定价方案 */
  /** 定价方案 */
  pricingPlans: PricingPlan[];
}

/** 博客文章前置数据 */
export interface BlogFrontmatter {
  /** 文章标题 */
  title: string;
  /** 文章描述（用于 SEO） */
  description: string;
  /** 发布日期 */
  pubDate: Date;
  /** 作者（可选） */
  author?: string;
  /** 封面图 URL（可选） */
  cover?: string;
  /** 标签（可选） */
  tags?: string[];
  /** 是否为草稿 */
  draft?: boolean;
}
