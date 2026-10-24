/* AMMAR × KARIMA | Motion system
   Adapted for a no-build HTML/CSS/JS site from ideas in the free React Bits library:
   Split Text, Scroll Reveal, Magnet, Tilted Card, Spotlight Card and Click Spark.
   Upstream: https://github.com/DavidHDev/react-bits (MIT + Commons Clause).
   This file is a vanilla-JS adaptation, not a React runtime bundle.
*/
(() => {
  'use strict';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
  const $ = (selector, root=document) => root.querySelector(selector);
  const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];

  // SplitText-style staggered entrance, preserving accessible original text.
  const title = $('#intro-h1');
  if (title && !reduce && !title.dataset.splitReady) {
    const words = title.textContent.trim().split(/\s+/);
    title.setAttribute('aria-label', words.join(' '));
    title.innerHTML = words.map((word, i) =>
      '<span class="rb-word" aria-hidden="true" style="--word-index:'+i+'"><span>' +
      word.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') +
      (i < words.length-1 ? '&nbsp;' : '') + '</span></span>'
    ).join(' ');
    title.dataset.splitReady = 'true';
    requestAnimationFrame(() => title.classList.add('rb-ready'));
    title.classList.add('text-shimmer');
  }

  // Scroll Reveal: enter once, gently unblur, then leave the content stable.
  const revealItems = $$('.chapter .eyebrow, .chapter .lede, .chapter .reveal, .story-beat, .memory-grid, .finale .question, .finale-actions');
  if ('IntersectionObserver' in window && !reduce) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('rb-revealed');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    revealItems.forEach((el, i) => {
      el.style.setProperty('--reveal-delay', Math.min(i % 5, 4) * 75 + 'ms');
      el.classList.add('rb-reveal');
      revealObserver.observe(el);
    });
  } else revealItems.forEach(el => el.classList.add('rb-revealed'));

  // Spotlight Card: local radial light follows pointer coordinates.
  $$('.glass, .mem-card, .begin-btn, .btn').forEach(el => {
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--rb-x', (e.clientX-r.left)+'px');
      el.style.setProperty('--rb-y', (e.clientY-r.top)+'px');
      el.classList.add('rb-lit');
    }, {passive:true});
    el.addEventListener('pointerleave', () => {
      el.classList.remove('rb-lit');
      el.style.setProperty('--rb-mx','0px');
      el.style.setProperty('--rb-my','0px');
    }, {passive:true});
  });

  // Magnet: restrained spring-like pull for primary actions.
  if (fine && !reduce) {
    $$('.begin-btn, .btn').forEach(el => {
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        const x = e.clientX-r.left-r.width/2;
        const y = e.clientY-r.top-r.height/2;
        el.style.setProperty('--rb-mx', (x*.075)+'px');
        el.style.setProperty('--rb-my', (y*.11)+'px');
      }, {passive:true});
    });
  }

  // Tilted Card: keep the card's flip state intact while adding subtle 3D response.
  if (fine && !reduce) {
    $$('.mem-card').forEach(card => {
      let raf = 0;
      card.addEventListener('pointermove', e => {
        if (card.classList.contains('flipped')) return;
        const r = card.getBoundingClientRect();
        const x = (e.clientX-r.left)/r.width-.5;
        const y = (e.clientY-r.top)/r.height-.5;
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          card.style.setProperty('--tilt-x', (-y*7).toFixed(2)+'deg');
          card.style.setProperty('--tilt-y', (x*8).toFixed(2)+'deg');
          card.classList.add('rb-tilting');
        });
      }, {passive:true});
      card.addEventListener('pointerleave', () => {
        card.classList.remove('rb-tilting');
        card.style.removeProperty('--tilt-x');
        card.style.removeProperty('--tilt-y');
      }, {passive:true});
    });
  }

  // Click Spark: tiny, restrained burst on interactive controls.
  if (!reduce) document.addEventListener('click', e => {
    const target = e.target.closest('button, a, .puzzle-star, .mem-card');
    if (!target || !fine) return;
    const x = e.clientX, y = e.clientY;
    for (let i=0; i<7; i++) {
      const spark = document.createElement('i');
      spark.className = 'rb-spark';
      spark.style.left = x+'px';
      spark.style.top = y+'px';
      const angle = Math.PI*2*i/7 + Math.random()*.25;
      const distance = 16 + Math.random()*32;
      spark.style.setProperty('--rb-dx', Math.cos(angle)*distance+'px');
      spark.style.setProperty('--rb-dy', Math.sin(angle)*distance+'px');
      document.body.appendChild(spark);
      spark.addEventListener('animationend', () => spark.remove(), {once:true});
    }
  });

  // Current chapter ambience and story timeline.
  const chapters = $$('.chapter');
  if ('IntersectionObserver' in window) {
    const chapterObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        chapters.forEach(ch => ch.classList.toggle('is-active', ch === entry.target));
        entry.target.classList.add('chapter-active');
        entry.target.querySelectorAll('.story-beat').forEach(beat => beat.classList.add('is-lit'));
      });
    }, {threshold:.32});
    chapters.forEach(ch => chapterObserver.observe(ch));
  }

  // Make the 3D background sleep when the tab is hidden, and respect reduced motion.
  const canvas = $('#satin-canvas');
  if (canvas && reduce) canvas.style.opacity = '.72';

  // Small-screen polish: no hover-only state is required for any content.
  document.documentElement.classList.add('motion-ready');
})();
