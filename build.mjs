/* ============================================================
   构建脚本 — 把 index.html + game.js 内联成单文件可分发版本
   用法: node build.mjs   (npm run build)
   产物:
     dist/index.html              页面外壳 (引用 game.js, 适合静态托管)
     dist/game.js                 游戏逻辑
     dist/MC大冒险-单文件版.html   单文件 (双击即玩, 零依赖)
     MC大冒险-单文件版.html        同步根目录单文件版本
   ============================================================ */
import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = dirname(fileURLToPath(import.meta.url));
const DIST = join(ROOT, 'dist');

function read(p){ return readFileSync(join(ROOT, p), 'utf8'); }

const html = read('index.html');
const js   = read('game.js');

// 校验占位
const tag = '<script src="game.js"></script>';
if(!html.includes(tag)){
  console.error('✗ 构建失败: index.html 中找不到 ' + tag);
  process.exit(1);
}

// 单文件: 内联 game.js + 头部说明
const banner = `<!-- MC 大冒险 单文件版 — 由 build.mjs 自动生成, 请勿手改; 改 game.js / index.html 后重新 npm run build -->\n`;
const inlined = banner + html.replace(tag, `<script>\n${js}\n</script>`);

mkdirSync(DIST, { recursive: true });
writeFileSync(join(DIST, 'index.html'), html);
writeFileSync(join(DIST, 'game.js'), js);
writeFileSync(join(DIST, 'MC大冒险-单文件版.html'), inlined);
writeFileSync(join(ROOT, 'MC大冒险-单文件版.html'), inlined);

const kb = (s) => (Buffer.byteLength(s, 'utf8') / 1024).toFixed(1) + ' KB';
console.log('✓ 构建完成');
console.log('  dist/index.html              ' + kb(html));
console.log('  dist/game.js                 ' + kb(js));
console.log('  dist/MC大冒险-单文件版.html   ' + kb(inlined));
console.log('  MC大冒险-单文件版.html (同步)  ' + kb(inlined));
