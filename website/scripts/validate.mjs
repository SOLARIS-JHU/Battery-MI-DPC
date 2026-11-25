import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
import assert from 'node:assert/strict';

const root=path.resolve(fileURLToPath(new URL('..',import.meta.url)));
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const body=html.replace(/<script\b[\s\S]*?<\/script>/gi,'');
const errors=[];
const check=(ok,message)=>{if(!ok)errors.push(message);};
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);}
function localReference(file,ref){
  if(/^(https?:|mailto:|data:|#|\/\/)/.test(ref))return;
  const target=path.resolve(path.dirname(file),decodeURIComponent(ref.split(/[?#]/)[0]));
  check(target.startsWith(root+path.sep)&&fs.existsSync(target),`Missing/escaping local reference: ${path.relative(root,file)} → ${ref}`);
}
for(const m of html.matchAll(/\b(?:href|src|data)="([^"]+)"/g))localReference(path.join(root,'index.html'),m[1]);
const ids=[...body.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
check(new Set(ids).size===ids.length,'Duplicate HTML IDs');
for(const m of body.matchAll(/\bhref="#([^"]+)"/g))check(ids.includes(m[1]),`Broken anchor #${m[1]}`);
for(const m of body.matchAll(/<img\b[^>]*>/g))check(/\balt="[^"]*"/.test(m[0]),'Image missing alt text');
for(const m of body.matchAll(/<button\b[^>]*>/g))check(/type="button"/.test(m[0]),'Button missing type');
for(const id of ['copy-bibtex','bibtex','copy-status','abstract-animation','toggle-animation','restart-animation'])check(ids.includes(id),`Interaction target missing: ${id}`);
check(html.includes('prefers-reduced-motion')||fs.readFileSync(path.join(root,'main.js'),'utf8').includes('prefers-reduced-motion'),'Reduced motion handling missing');
for(const meta of ['name="description"','rel="canonical"','property="og:image"','name="twitter:card"','name="citation_title"','name="citation_doi"','name="citation_journal_title"'])check(html.includes(meta),`Missing metadata: ${meta}`);
check((html.match(/name="citation_author"/g)||[]).length===4,'Expected four citation authors');
const structured=JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
check(structured.author.length===4,'Structured author count mismatch');
check(structured.identifier==='10.1109/TSG.2026.3737375','Wrong DOI');
check(structured.url==='https://solaris-jhu.github.io/Battery-MI-DPC/','Wrong canonical project URL');
const bib=body.match(/<code id="bibtex">([\s\S]*?)<\/code>/)[1].trim();
check(bib===fs.readFileSync(path.join(root,'citation.bib'),'utf8').trim(),'Visible and downloadable BibTeX differ');
const katex=createRequire(import.meta.url)(path.join(root,'static/vendor/katex/katex.min.js'));
let equations=0;
for(const m of body.matchAll(/\$\$([\s\S]*?)\$\$|\\\(([\s\S]*?)\\\)/g)){
  try{katex.renderToString((m[1]??m[2]).replaceAll('&amp;','&'),{throwOnError:true,displayMode:!!m[1]});equations++;}
  catch(e){errors.push(`Math parse error: ${e.message}`);}
}
let svgCount=0;
for(const file of walk(path.join(root,'static'))){
  if(file.endsWith('.css')){
    const css=fs.readFileSync(file,'utf8');
    for(const m of css.matchAll(/url\(["']?([^"')]+)["']?\)/g))localReference(file,m[1]);
  }
  if(file.endsWith('.svg')){
    svgCount++;const svg=fs.readFileSync(file,'utf8');
    check(!/<script\b|\bon\w+\s*=/.test(svg),`Unexpected active script in ${file}`);
    const svgIds=[...svg.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
    check(new Set(svgIds).size===svgIds.length,`Duplicate SVG IDs in ${file}`);
    for(const m of svg.matchAll(/(?:href="#|url\(#)([^"\)]+)/g))check(svgIds.includes(m[1]),`Broken SVG reference ${m[1]} in ${file}`);
  }
}
const motion=fs.readFileSync(path.join(root,'static/figures/graphical-abstract-animated.svg'),'utf8');
check((motion.match(/<animate /g)||[]).length===29,'Animation tracks changed');
check(motion.includes('@media(prefers-reduced-motion:reduce)'),'SVG reduced-motion fallback missing');
check(fs.existsSync(path.join(root,'static/og.png')),'Social preview PNG missing');
check(!/TODO|PLACEHOLDER|\[PAPER\]|\[CODE URL\]/.test(body),'Placeholder text found');
for(const error of errors)console.error('FAIL:',error);
assert.equal(errors.length,0,`${errors.length} website validation errors`);
console.log(`Website validation passed: ${equations} math expressions; ${svgCount} SVGs; local references, metadata, citation, accessibility hooks, and animation structure.`);
