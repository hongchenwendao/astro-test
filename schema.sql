-- 站群互链表
CREATE TABLE IF NOT EXISTS links (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  site_name TEXT NOT NULL,       -- 显示名称，如 "ImageSquish"
  url TEXT NOT NULL,             -- 目标 URL
  description TEXT NOT NULL,     -- 简短描述
  icon TEXT DEFAULT '🔗',       -- 显示图标（emoji）
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 初始数据：三个站互相推荐
INSERT INTO links (site_name, url, description, icon) VALUES
  ('ImageSquish', 'https://imagesquish.pages.dev', '免费在线图片压缩工具', '🖼️'),
  ('JSONGenie', 'https://jsongenie.pages.dev', '在线 JSON 格式化与校验', '📋'),
  ('ColorSpark', 'https://colorspark.pages.dev', '专业调色板生成器', '🎨');
