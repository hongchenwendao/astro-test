import type { SiteConfig } from '@saas/core';

const siteConfig: SiteConfig = {
  name: 'PDF合并大师',
  tagline: '免费在线 PDF 合并工具',
  description: '最好用的免费无损在线 PDF 合并工具，保护隐私安全。',
  themeColor: '0 84% 60%',
  accentColor: '#ef4444',
  domain: 'pdf-tool.pages.dev',

  // 姐妹站 — 互链 SEO
  sisterSites: [
    {
      name: 'JSONGenie',
      url: 'https://jsongenie.dev',
      description: '免费在线 JSON 格式化工具',
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
    {
      name: 'ScreenCapture',
      url: 'https://screencapture.tools',
      description: '浏览器端录屏工具',
    },
  ],

  // 定价方案
  pricingPlans: [
    {
      name: '免费版',
      price: '$0',
      period: '',
      description: '适合偶尔使用',
      features: [
        '每天 5 张图片',
        '单张最大 5MB',
        '支持 JPEG 和 PNG',
        '浏览器端压缩',
      ],
      cta: '免费开始',
    },
    {
      name: '专业版',
      price: '$9',
      period: '月',
      description: '适合设计师和内容创作者',
      features: [
        '无限图片数量',
        '单张最大 50MB',
        '全格式支持 (WebP, AVIF, SVG)',
        '批量压缩',
        'API 接口',
        '优先客服支持',
      ],
      cta: '免费试用',
      highlighted: true,
    },
    {
      name: '企业版',
      price: '$29',
      period: '月',
      description: '适合团队和企业',
      features: [
        '专业版全部功能',
        '无限文件大小',
        '团队协作',
        '自定义 API 集成',
        'SLA 保障',
        '专属客服',
      ],
      cta: '联系销售',
    },
  ],
};

export default siteConfig;
