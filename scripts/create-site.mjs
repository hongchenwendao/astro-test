import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.join(__dirname, '..');
const APPS_DIR = path.join(ROOT_DIR, 'apps');
const TEMPLATE_DIR = path.join(APPS_DIR, '.template');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query, defaultVal) => {
  return new Promise((resolve) => {
    rl.question(`\x1b[36m${query}\x1b[0m ${defaultVal ? `[${defaultVal}] ` : ''}`, (answer) => {
      resolve(answer.trim() || defaultVal);
    });
  });
};

// Helper: Hex to HSL
function hexToHSL(hex) {
  let r = 0, g = 0, b = 0;
  if (hex.length == 4) {
    r = "0x" + hex[1] + hex[1];
    g = "0x" + hex[2] + hex[2];
    b = "0x" + hex[3] + hex[3];
  } else if (hex.length == 7) {
    r = "0x" + hex[1] + hex[2];
    g = "0x" + hex[3] + hex[4];
    b = "0x" + hex[5] + hex[6];
  }
  r /= 255; g /= 255; b /= 255;
  let cmin = Math.min(r,g,b), cmax = Math.max(r,g,b), delta = cmax - cmin, h = 0, s = 0, l = 0;
  if (delta == 0) h = 0;
  else if (cmax == r) h = ((g - b) / delta) % 6;
  else if (cmax == g) h = (b - r) / delta + 2;
  else h = (r - g) / delta + 4;
  h = Math.round(h * 60);
  if (h < 0) h += 360;
  l = (cmax + cmin) / 2;
  s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);
  return `${h} ${Math.round(s)}% ${Math.round(l)}%`;
}

// 递归遍历文件替换内容
function replaceVariablesInDir(dirPath, variables) {
  const files = fs.readdirSync(dirPath);
  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceVariablesInDir(fullPath, variables);
    } else {
      let content = fs.readFileSync(fullPath, 'utf8');
      let isModified = false;
      for (const [key, value] of Object.entries(variables)) {
        const placeholder = `{{${key}}}`;
        if (content.includes(placeholder)) {
          content = content.replace(new RegExp(placeholder, 'g'), value);
          isModified = true;
        }
      }
      if (isModified) {
        fs.writeFileSync(fullPath, content, 'utf8');
      }
    }
  }
}

async function main() {
  console.log('\n🚀 \x1b[35mSaaS 出海群站 - 一键建站脚手架\x1b[0m\n');

  const siteId = await question('站点英文 ID (如 pdf-tool):');
  if (!siteId) {
    console.error('站点 ID 不能为空');
    process.exit(1);
  }

  const newAppDir = path.join(APPS_DIR, siteId);
  if (fs.existsSync(newAppDir)) {
    console.error(`目录 ${siteId} 已存在！`);
    process.exit(1);
  }

  const siteName = await question('站点显示名称 (如 PDF工具箱):');
  const tagline = await question('Slogan (如 在线处理你的文档):', '免费在线工具');
  const description = await question('SEO 描述:', '最好用的免费在线工具，在浏览器中处理您的所有数据。');
  const siteIcon = await question('Logo Emoji (如 📄):', '✨');
  const themeColorHex = await question('主题色 HEX (如 #ef4444):', '#6366f1');
  const themeColorHsl = hexToHSL(themeColorHex);

  const heroTitle = await question('Hero 标题 (如 免费合并):', siteName);
  const heroHighlight = await question('Hero 高亮词 (如 PDF 文件):', '免费在线工具');
  
  const toolTitle = await question('核心工具区标题 (如 PDF 合并器):', siteName);
  const toolDesc = await question('核心工具区描述:', description);

  console.log('\n\x1b[36m>>> 开始生成站点...\x1b[0m');

  // 1. 复制模板
  fs.cpSync(TEMPLATE_DIR, newAppDir, { recursive: true });

  // 2. 准备替换变量
  const variables = {
    SITE_ID: siteId,
    SITE_NAME: siteName,
    TAGLINE: tagline,
    DESCRIPTION: description,
    SITE_ICON: siteIcon,
    THEME_COLOR_HEX: themeColorHex,
    THEME_COLOR_HSL: themeColorHsl,
    HERO_TITLE: heroTitle,
    HERO_HIGHLIGHT: heroHighlight,
    TOOL_TITLE: toolTitle,
    TOOL_DESC: toolDesc,
  };

  // 3. 执行替换
  replaceVariablesInDir(newAppDir, variables);

  console.log(`\x1b[32m✔ 站点 ${siteName} (${siteId}) 创建成功！\x1b[0m\n`);

  // 4. 打印后续步骤和 SQL
  console.log('\x1b[33m======== 关联 D1 数据库 ========\x1b[0m');
  console.log('请在终端执行以下命令将新站点加入互链网络：');
  console.log(`\x1b[32m
npx wrangler d1 execute saas-links --command="INSERT INTO sites (site_id, site_name, url, description, theme_color) VALUES ('${siteId}', '${siteName}', 'https://${siteId}.pages.dev', '${description}', '${themeColorHex}');"
\x1b[0m`);

  console.log('\x1b[33m======== 开始开发 ========\x1b[0m');
  console.log(`cd apps/${siteId}`);
  console.log(`pnpm run dev\n`);

  rl.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
