import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=path.resolve(fileURLToPath(new URL('..',import.meta.url)));
const diagram=fs.readFileSync(path.join(root,'static/figures/graphical-abstract.svg'),'utf8');
const inner=diagram.slice(diagram.indexOf('>')+1,diagram.lastIndexOf('</svg>'));
const svg=`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1200" height="630" viewBox="0 0 1200 630">
<rect width="1200" height="630" fill="#fbfbfd"/><rect x="0" y="0" width="1200" height="10" fill="#002d72"/>
<text x="52" y="64" fill="#002d72" font-family="Arial,sans-serif" font-size="22" font-weight="bold">SOLARIS · IEEE TRANSACTIONS ON SMART GRID · 2026</text>
<text x="52" y="120" fill="#1a1f2b" font-family="Georgia,serif" font-size="38">End-to-End Battery Dispatch</text>
<text x="52" y="166" fill="#1a1f2b" font-family="Georgia,serif" font-size="38">with Exact Rainflow Degradation</text>
<text x="52" y="205" fill="#5b6470" font-family="Arial,sans-serif" font-size="23">Mixed-Integer Differentiable Predictive Control</text>
<g transform="translate(250 225) scale(.92)">${inner}</g>
<text x="52" y="596" fill="#002d72" font-family="Arial,sans-serif" font-size="20">Battery-MI-DPC · Paper, code, and notebook</text>
</svg>\n`;
fs.writeFileSync(path.join(root,'static/og.svg'),svg);
console.log('Generated website/static/og.svg (1200 × 630). Export PNG with Inkscape.');
