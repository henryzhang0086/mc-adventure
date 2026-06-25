/* ============================================================
   极简静态开发服务器 (零依赖) — 本地调试用
   用法: node server.mjs   (npm start)   然后浏览器打开 http://localhost:8080
   端口可用环境变量 PORT 覆盖。
   ============================================================ */
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join, normalize, extname } from 'node:path';

const ROOT = dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 8080;
const MIME = {
  '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8',
  '.css':'text/css; charset=utf-8', '.json':'application/json; charset=utf-8',
  '.png':'image/png', '.jpg':'image/jpeg', '.svg':'image/svg+xml', '.ico':'image/x-icon',
};

const server = createServer(async (req, res) => {
  try{
    let urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
    if(urlPath === '/') urlPath = '/index.html';
    // 防目录穿越: 规范化后必须仍在 ROOT 内
    const filePath = normalize(join(ROOT, urlPath));
    if(!filePath.startsWith(ROOT)){ res.writeHead(403); res.end('Forbidden'); return; }
    const data = await readFile(filePath);
    res.writeHead(200, { 'Content-Type': MIME[extname(filePath).toLowerCase()] || 'application/octet-stream' });
    res.end(data);
  }catch(e){
    res.writeHead(404, { 'Content-Type':'text/plain; charset=utf-8' });
    res.end('404 Not Found');
  }
});

server.listen(PORT, () => {
  console.log(`MC 大冒险 开发服务器: http://localhost:${PORT}`);
  console.log('按 Ctrl+C 停止');
});
