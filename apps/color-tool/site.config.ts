import type { SiteConfig } from '@saas/core';

const siteConfig: SiteConfig = {
  name: 'ColorSpark',
  tagline: '一键生成专业配色方案',
  description:
    '免费在线调色板工具。颜色格式转换、调色板生成、对比度检测。设计师和开发者的配色利器。',
  themeColor: '25 95% 53%',
  accentColor: '#f97316',
  domain: 'colorspark.dev',

  sisterSites: [
    {
      name: 'ImageSquish',
      url: 'https://imagesquish.com',
      description: '免费在线图片压缩工具',
    },
    {
      name: 'JSONGenie',
      url: 'https://jsongenie.dev',
      description: '免费在线 JSON 格式化工具',
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
  ],

  pricingPlans: [
    {
      name: '免费版',
      price: '$0',
      period: '',
      description: '适合个人设计项目',
      features: [
        '无限颜色转换',
        '调色板生成',
        '对比度检测',
        '最多保存 5 个配色方案',
      ],
      cta: '免费使用',
    },
    {
      name: '专业版',
      price: '$5',
      period: '月',
      description: '适合设计师和团队',
      features: [
        '免费版全部功能',
        '无限保存配色方案',
        '从图片提取配色',
        '色盲模拟测试',
        'Figma / Sketch 插件',
        'CSS / Tailwind 导出',
      ],
      cta: '免费试用',
      highlighted: true,
    },
    {
      name: '团队版',
      price: '$15',
      period: '月',
      description: '适合设计团队协作',
      features: [
        '专业版全部功能',
        '团队配色资产库',
        '设计系统集成',
        'API 接口',
        'SLA 保障',
        '专属客服',
      ],
      cta: '联系销售',
    },
  ],
};

export default siteConfig;
