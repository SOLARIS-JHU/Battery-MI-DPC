/* Battery-MI-DPC website interactions. */
'use strict';
document.addEventListener('DOMContentLoaded', () => {
  if (typeof renderMathInElement === 'function') {
    renderMathInElement(document.body, {
      delimiters: [{left:'$$',right:'$$',display:true},{left:'\\(',right:'\\)',display:false}],
      throwOnError: false
    });
  }
  const copy = document.getElementById('copy-bibtex');
  copy.addEventListener('click', async () => {
    const text = document.getElementById('bibtex').textContent;
    const status = document.getElementById('copy-status');
    try {
      await navigator.clipboard.writeText(text);
      status.textContent = 'Citation copied.';
    } catch {
      const range = document.createRange();
      range.selectNodeContents(document.getElementById('bibtex'));
      const selection = window.getSelection();
      selection.removeAllRanges(); selection.addRange(range);
      status.textContent = 'Citation selected. Use your browser’s Copy command.';
    }
  });
  const object = document.getElementById('abstract-animation');
  const toggle = document.getElementById('toggle-animation');
  const restart = document.getElementById('restart-animation');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let svg;
  function sync() {
    if (!svg) return;
    if (motion.matches) svg.pauseAnimations();
    toggle.disabled = motion.matches;
    restart.disabled = motion.matches;
    toggle.textContent = motion.matches ? 'Reduced motion enabled' : svg.animationsPaused() ? 'Play animation' : 'Pause animation';
  }
  function connect() {
    try {
      svg = object.contentDocument?.documentElement;
      if (!svg || typeof svg.pauseAnimations !== 'function') return;
      toggle.disabled = false; restart.disabled = false; sync();
    } catch { /* The static fallback and full-size link remain available. */ }
  }
  object.addEventListener('load',connect); connect();
  toggle.addEventListener('click',()=>{if(!svg)return;svg.animationsPaused()?svg.unpauseAnimations():svg.pauseAnimations();sync();});
  restart.addEventListener('click',()=>{if(!svg)return;svg.setCurrentTime(0);svg.unpauseAnimations();sync();});
  motion.addEventListener('change',sync);
});
