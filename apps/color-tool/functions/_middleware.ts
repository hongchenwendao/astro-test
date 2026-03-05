// Cloudflare Pages Functions 中间件
// 拦截 HTML 请求，从 D1 查询互链数据，用 HTMLRewriter 动态注入到 Footer

interface Env {
  DB: D1Database;
}

interface LinkRow {
  site_name: string;
  url: string;
  description: string;
  icon: string;
}

const CURRENT_SITE = 'https://colorspark.pages.dev';

export const onRequest: PagesFunction<Env> = async (context) => {
  const response = await context.next();

  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('text/html')) {
    return response;
  }

  try {
    const { results } = await context.env.DB.prepare(
      'SELECT site_name, url, description, icon FROM links WHERE url != ?'
    ).bind(CURRENT_SITE).all<LinkRow>();

    if (!results || results.length === 0) {
      return response;
    }

    const linksHtml = results.map(link =>
      `<a href="${link.url}" target="_blank" rel="noopener" style="display:flex;align-items:center;gap:8px;padding:8px 16px;background:rgba(255,255,255,0.05);border-radius:8px;border:1px solid rgba(255,255,255,0.1);transition:all 0.2s;text-decoration:none;color:#e2e8f0;" onmouseover="this.style.background='rgba(255,255,255,0.1)';this.style.transform='translateY(-2px)'" onmouseout="this.style.background='rgba(255,255,255,0.05)';this.style.transform='none'">
        <span style="font-size:1.2em">${link.icon}</span>
        <span>
          <strong style="display:block;font-size:0.9em">${link.site_name}</strong>
          <small style="opacity:0.7;font-size:0.75em">${link.description}</small>
        </span>
      </a>`
    ).join('');

    const injectedHtml = `
      <div style="display:flex;flex-wrap:wrap;gap:12px;justify-content:center;">
        ${linksHtml}
      </div>`;

    return new HTMLRewriter()
      .on('#dynamic-sister-sites', {
        element(el) {
          el.setInnerContent(injectedHtml, { html: true });
        }
      })
      .transform(response);

  } catch (e) {
    console.error('D1 query failed:', e);
    return response;
  }
};
