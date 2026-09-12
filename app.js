// App Lock landing interactions - restrained motion budget
(function(){
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var yr = document.getElementById('yr'); if(yr) yr.textContent = new Date().getFullYear();

  // Reveal on scroll (allowed: fade + 16px, once) — first so later blocks can't kill it
  var els = document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window && !reduce){
    var io = new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } }); }, {threshold:.15});
    els.forEach(function(el){ io.observe(el); });
  } else { els.forEach(function(el){ el.classList.add('in'); }); }

  // Mobile menu
  var t = document.querySelector('.nav-toggle'), m = document.getElementById('mobileMenu');
  if(t && m){ t.addEventListener('click', function(){
    var open = m.hidden; m.hidden = !open;
    t.setAttribute('aria-expanded', String(open)); t.textContent = open ? '×' : '+';
  }); m.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', function(){ m.hidden = true; t.textContent='+'; t.setAttribute('aria-expanded','false'); }); }); }

  // Marquee pause (single instance)
  var mq = document.querySelector('.marquee'), mp = document.getElementById('marqueePause');
  if(mp && mq){ mp.addEventListener('click', function(){
    var p = mq.classList.toggle('paused');
    mp.setAttribute('aria-pressed', String(p)); mp.textContent = p ? '▶' : 'II';
  }); mq.addEventListener('mouseenter', function(){ if(!reduce) mq.classList.add('paused'); });
    mq.addEventListener('mouseleave', function(){ if(!reduce && mp.getAttribute('aria-pressed')!=='true') mq.classList.remove('paused'); }); }

  // Sticky mid CTA after 600px
  var sticky = document.getElementById('stickyCta');
  function onScroll(){ if(!sticky) return; var y = window.scrollY || 0; var nearEnd = (window.innerHeight + y) > (document.body.scrollHeight - 700);
    sticky.hidden = !(y > 600 && !nearEnd); }
  window.addEventListener('scroll', onScroll, {passive:true}); onScroll();

  // Lenis smooth (desktop, no reduced motion, no touch) — synced with GSAP ticker
  try{
    var isTouch = window.matchMedia('(pointer: coarse)').matches;
    if(!reduce && !isTouch && window.Lenis){
      var lenis = new Lenis({ lerp: 0.14 });
      if(window.gsap){
        if(window.ScrollTrigger) lenis.on('scroll', function(){ window.ScrollTrigger.update(); });
        gsap.ticker.add(function(time){ lenis.raf(time * 1000); });
        gsap.ticker.lagSmoothing(0);
      } else {
        (function raf(time){ lenis.raf(time); requestAnimationFrame(raf); })(performance.now());
      }
      document.querySelectorAll('a[href^="#"]').forEach(function(a){
        a.addEventListener('click', function(ev){
          var id = a.getAttribute('href'); if(id.length < 2) return;
          var target = document.querySelector(id); if(!target) return;
          ev.preventDefault(); lenis.scrollTo(target, {offset:-70});
        });
      });
    }
  }catch(e){}

  // Hero-only parallax + entrance (GSAP if present, hero only per budget)
  try{
    if(!reduce && window.gsap && window.ScrollTrigger){
      gsap.registerPlugin(ScrollTrigger);
      gsap.from('.hero-stickers .sticker', {scale:.6, opacity:0, duration:.5, stagger:.08, ease:'back.out(1.6)', delay:.3, clearProps:'transform,opacity'});
      if(!window.matchMedia('(pointer: coarse)').matches){ gsap.to('#heroPhone', {y:-40, ease:'none', scrollTrigger:{trigger:'.hero', start:'top top', end:'bottom top', scrub:1}}); }
    }
  }catch(e){}

  // Hero stickers gentle float (hero only, no touch)
  if(!reduce && !window.matchMedia('(pointer: coarse)').matches){
    var floats = document.querySelectorAll('.hero-stickers .sticker');
    floats.forEach(function(s, i){
      var rot = s.classList.contains('s-mint') ? '2deg' : s.classList.contains('s-ember') ? '-2deg' : '-3deg';
      var amp = 8, dur = 2800 + i*500, start = null;
      function step(ts){ if(!start) start = ts; var p = (ts-start)/dur;
        s.style.transform = 'translateY(' + (Math.sin(p*Math.PI*2)*amp).toFixed(1) + 'px) rotate(' + rot + ')';
        requestAnimationFrame(step); }
      setTimeout(function(){ requestAnimationFrame(step); }, 900);
    });
  }
})();
