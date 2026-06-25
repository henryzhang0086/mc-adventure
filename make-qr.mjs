/* 生成游戏公网链接的二维码 — PNG / SVG / 终端 ASCII
   用法: node make-qr.mjs [url]   默认用 GitHub Pages 地址 */
import QRCode from 'qrcode';
import { writeFileSync } from 'node:fs';

const url = process.argv[2] || 'https://henryzhang0086.github.io/mc-adventure/';

await QRCode.toFile('qr-code.png', url, { width: 600, margin: 2,
  color: { dark: '#0a2e14', light: '#ffffff' } });
const svg = await QRCode.toString(url, { type: 'svg', margin: 2,
  color: { dark: '#0a2e14', light: '#ffffff' } });
writeFileSync('qr-code.svg', svg);
const ascii = await QRCode.toString(url, { type: 'terminal', small: true });

console.log(ascii);
console.log('扫码即玩 →  ' + url);
console.log('已生成: qr-code.png (600px) / qr-code.svg (矢量, 可无限放大打印)');
