#!/usr/bin/env node
/**
 * Reproduce a self-contained SMIL version of SOLARIS's v11-rainflow animation.
 * Run from any working directory: node scripts/generate-graphical-abstract.mjs
 * No package installation is required. The input SVG remains unmodified.
 *
 * Geometry source: SOLARIS-JHU/solaris-website, main,
 *   static/images/papers/v13/arxiv-2609.12968.svg
 *   Git blob SHA: 1033abd7a78f4b237eb325ce2abdb8a46a470fd8
 * Animation source: static/js/paper-abstracts-v13.js, v11-rainflow updater.
 * The verbatim updater below is evaluated against a small attribute recorder,
 * not a browser. Its piecewise-linear and piecewise-constant outputs are
 * translated at their analytical knots, without interpolating discrete states.
 * This is the existing explanatory animation, not reported experiment data.
 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const input = path.join(root, 'figs', 'battery-midpc-graphical-abstract.svg');
const output = path.join(root, 'figs', 'battery-midpc-graphical-abstract-animated.svg');
const original = fs.readFileSync(input, 'utf8');
const prefix = 'v11-rainflow-';
const duration = 12;
const activeDuration = 10;
const sourceBlob = crypto.createHash('sha1')
  .update(`blob ${Buffer.byteLength(original)}\0`).update(original).digest('hex');
assert.equal(sourceBlob, '1033abd7a78f4b237eb325ce2abdb8a46a470fd8',
  'The source SVG changed; review the animation against the new source first.');

// Verbatim original updater (1306 characters; no browser or page dependencies).
const originalUpdaterSource = String.raw`(svg,t)=>{
const $=n=>svg.querySelector('#v11-rainflow-'+n),set=(n,o)=>{const e=$(n);if(e)Object.entries(o).forEach(([k,v])=>e.setAttribute(k,v))},clamp=x=>Math.max(0,Math.min(1,x)),q=clamp((t%12)/10),P=a=>'M'+a.map(p=>p.join(' ')).join(' L');
const E=[0.5,0.65,0.82,0.7,0.58,0.68,0.75,0.55,0.3,0.42,0.62,0.5],C=[[0.17000000000000004,1,4,6,8],[0.31999999999999995,0.5,0,2,8],[0.52,0.5,2,8,11],[0.32,0.5,8,10,11],[0.12,0.5,10,11,11]],A=[[315,151.5],[349,133.35000000000002],[383,112.54],[417,130.3],[451,148.06],[485,136.56],[519,129.05],[553,157.45],[587,192.5],[621,178.33999999999997],[655,153.54000000000002],[689,171.3]],w=q*(E.length-1),i=Math.min(E.length-2,Math.floor(w)),u=w-i,e=E[i]+u*(E[i+1]-E[i]);set('socpoint',{cx:315+w*34,cy:218-133*e+w*1.8});let mode=E[i+1]>E[i]?0:2;for(let j=0;j<3;j++)set('mode'+j,{opacity:j===mode?1:.22});set('power',{width:46*Math.abs(E[i+1]-E[i])/.25});for(let j=0;j<C.length;j++){const visible=w>=C[j][4]-.001,active=visible&&w<C[j][4]+1;set('cycle'+j,{opacity:visible?(active?1:.6):.08,'stroke-width':active?2.6:1.6});set('pair'+j,{opacity:visible?1:.08})}for(let j=0;j<8;j++){let row=Math.floor(j/4),col=j%4,xx=41+col*20,yy=40+row*54-col*4.2,h=28*e;set('cell-'+j,{points:[[xx+3,yy+37-h],[xx+12,yy+35-h],[xx+12,yy+35],[xx+3,yy+37]].map(p=>p.join(',')).join(' ')})}
}`;
const update = vm.runInNewContext(`(${originalUpdaterSource})`, Object.freeze({}));
const ids = new Set([...original.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]));
function snapshot(t) {
  const attributes = {};
  update({querySelector(selector) {
    assert(selector.startsWith('#'));
    const id = selector.slice(1);
    assert(ids.has(id), `Updater target does not exist: ${id}`);
    return {setAttribute(name, value) {
      attributes[`${id}|${name}`] = String(value);
    }};
  }}, t);
  return attributes;
}

const linearTimes = [...Array.from({length: 12}, (_, k) => k * activeDuration / 11), duration];
// Exact cycle visibility thresholds: w >= endIndex - .001. The first two
// cycles become inactive at w = 9. Remaining cycles stay active through hold.
const discreteTimes = [...new Set([...linearTimes,
  (8 - .001) * activeDuration / 11,
  (11 - .001) * activeDuration / 11])].sort((a, b) => a - b);
const first = snapshot(0);
const tracks = Object.keys(first).map(key => {
  const [id, attribute] = key.split('|');
  const mode = attribute === 'cx' || attribute === 'cy' || attribute === 'points' ? 'linear' : 'discrete';
  const times = mode === 'linear' ? linearTimes : discreteTimes;
  // Sampling an infinitesimal distance to the right selects the intended
  // right-continuous state at a discrete knot despite binary roundoff in t/10.
  const values = times.map(t => snapshot(t === duration ? duration - 1e-8 :
    mode === 'discrete' ? t + 1e-8 : t)[key]);
  return {id, attribute, key, mode, times, values};
});
assert.equal(tracks.length, 29);
function xml(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}
const animations = tracks.map(track =>
  `<animate href="#${track.id}" attributeName="${track.attribute}" dur="12s" repeatCount="indefinite" calcMode="${track.mode}" keyTimes="${track.times.map(t => t / duration).join(';')}" values="${track.values.map(xml).join(';')}"/>`).join('\n');

const outer = original.match(/^<svg\b[^>]*>/)?.[0];
assert(outer && original.trimEnd().endsWith('</svg>'));
const inner = original.slice(outer.length, original.lastIndexOf('</svg>'));
const defs = [...inner.matchAll(/<defs\b[^>]*>[\s\S]*?<\/defs>/g)].map(m => m[0]);
const title = inner.match(/<title\b[^>]*>[\s\S]*?<\/title>/)?.[0] || '';
const body = inner.replace(/<defs\b[^>]*>[\s\S]*?<\/defs>/g, '').replace(title, '');
const bodyIds = new Set([...body.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]));
// Share immutable gradient/glyph definitions; prefix only the still scene's
// IDs and its references to those IDs. Both visible scenes preserve geometry.
const still = body.replace(/\bid="([^"]+)"/g, (_, id) => `id="still-${id}"`)
  .replace(/(\b(?:xlink:)?href=")#([^"]+)(")/g,
    (_, before, id, after) => `${before}#${bodyIds.has(id) ? 'still-' : ''}${id}${after}`)
  .replace(/url\(#([^)]+)\)/g, (_, id) => `url(#${bodyIds.has(id) ? 'still-' : ''}${id})`);
const result = `${outer}\n${title}\n` +
  '<!-- SOLARIS v11-rainflow: 10 seconds of source animation, 2 seconds hold. -->\n' +
  '<style>.rainflow-still{display:none}.rainflow-motion{display:inline}' +
  '@media(prefers-reduced-motion:reduce){.rainflow-still{display:inline}.rainflow-motion{display:none}}</style>\n' +
  defs.join('\n') + '\n' +
  `<g class="rainflow-still" id="rainflow-static-fallback">${still}</g>\n` +
  `<g class="rainflow-motion" id="rainflow-animated-scene">${body}\n${animations}</g>\n</svg>\n`;

// Structural checks: IDs are unique, every reference is local and resolves,
// and no script/event/external-resource dependency was introduced.
const outputIds = [...result.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
assert.equal(new Set(outputIds).size, outputIds.length, 'Duplicate SVG IDs');
const outputIdSet = new Set(outputIds);
const refs = [...result.matchAll(/\b(?:xlink:)?href="([^"]+)"/g)].map(m => m[1]);
assert(refs.every(ref => ref.startsWith('#') && outputIdSet.has(ref.slice(1))),
  'Unresolved or external href');
for (const match of result.matchAll(/url\(#([^)]+)\)/g)) assert(outputIdSet.has(match[1]));
assert(!/<script|\bon\w+\s*=|@import/i.test(result));
assert.equal((result.match(/<animate\s/g) || []).length, 29);
for (const track of tracks) {
  assert.equal(track.times.length, track.values.length);
  assert.equal(track.times[0], 0);
  assert.equal(track.times.at(-1), 12);
  assert(track.times.every((t, i) => i === 0 || t > track.times[i - 1]));
}

// Evaluate emitted SMIL tracks numerically (including serialized keyTimes),
// and compare all 29 attributes to the untouched original JavaScript routine.
function numbers(value) { return value.trim().split(/[ ,]+/).map(Number); }
function evaluate(track, t) {
  t = ((t % duration) + duration) % duration;
  const times = track.times.map(k => Number(String(k / duration)) * duration);
  let index = 0;
  while (index + 1 < times.length && t >= times[index + 1]) index++;
  if (track.mode === 'discrete' || index === times.length - 1) return numbers(track.values[index]);
  const a = numbers(track.values[index]), b = numbers(track.values[index + 1]);
  const fraction = (t - times[index]) / (times[index + 1] - times[index]);
  return a.map((v, k) => v + fraction * (b[k] - v));
}
const edges = discreteTimes.filter(t => t > 0 && t < duration);
const sampleTimes = [0, .13, 1.73, 4.7, 6.25, 7.4, 8.5, 9.5, 10, 10.8, 11.9, 12, 14.1, 24,
  ...edges.flatMap(t => [t - 1e-6, t - 1e-8, t + 1e-8, t + 1e-6]),
  12 - 1e-8, 12 + 1e-8];
let compared = 0;
for (const t of sampleTimes) {
  const expected = snapshot(t);
  for (const track of tracks) {
    const a = evaluate(track, t), b = numbers(expected[track.key]);
    assert.equal(a.length, b.length);
    for (let i = 0; i < a.length; i++) assert(Math.abs(a[i] - b[i]) < 1e-9,
      `Mismatch at ${t}s: ${track.key}[${i}]: SMIL=${a[i]}, source=${b[i]}`);
    compared++;
  }
}
fs.writeFileSync(output, result, 'utf8');
console.log(JSON.stringify({output, inputGitBlob: sourceBlob, width:760, height:392,
  animationTracks: tracks.length, periodSeconds:duration, activeSeconds:activeDuration,
  sampleTimes:sampleTimes.length, attributeComparisons:compared,
  allInternalReferencesResolved:true, reducedMotion:'unchanged static source scene',
  bytes:Buffer.byteLength(result)}, null, 2));
