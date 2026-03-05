import type { SiteConfig } from '@saas/core';

const siteConfig: SiteConfig = {
  name: 'JSONGenie',
  tagline: '一键格式化、校验、压缩你的 JSON',
  description:
    '免费在线 JSON 格式化工具。美化 JSON、语法检查、压缩混淆、树状查看。纯浏览器端处理，数据不上传。',
  themeColor: '160 84% 39%',
  accentColor: '#10b981',
  domain: 'jsongenie.dev',

  // 姐妹站 — 互链 SEO
  sisterSites: [
    {
      name: 'ImageSquish',
      url: 'https://imagesquish.com',
      description: '免费在线图片压缩工具',
    },
    {
      name: 'ColorSpark',
      url: 'https://colorspark.dev',
      description: '免费在线调色板工具',
    },
    {
      name: 'PDFGear',
      url: 'https://pdfgear.com',
      description: '免费 PDF 转换编辑器',
    },
    {
      name: 'AIWriterPro',
      url: 'https://aiwriterpro.com',
      description: 'AI 智能写作助手',
    },
    {
      name: 'VideoTrimmer',
      url: 'https://videotrimmer.app',
      description: '在线视频裁剪工具',
    },
  ],

  // 定价方案
  pricingPlans: [
    {
      name: '免费版',
      price: '$0',
      period: '',
      description: '适合日常开发使用',
      features: [
        '无限次格式化',
        'JSON 语法校验',
        '压缩 / 美化',
        '最大 1MB 文件',
      ],
      cta: '免费使用',
    },
    {
      name: '专业版',
      price: '$7',
      period: '月',
      description: '适合团队协作和大型项目',
      features: [
        '免费版全部功能',
        'JSON ↔ YAML 转换',
        'JSON Schema 校验',
        '最大 50MB 文件',
        'API 接口',
        '历史记录保存',
      ],
      cta: '免费试用',
      highlighted: true,
    },
    {
      name: '企业版',
      price: '$19',
      period: '月',
      description: '适合企业级数据处理',
      features: [
        '专业版全部功能',
        '无限文件大小',
        '团队共享工作区',
        '私有部署方案',
        'SLA 保障',
        '专属技术支持',
      ],
      cta: '联系销售',
    },
  ],
};

export default siteConfig;
