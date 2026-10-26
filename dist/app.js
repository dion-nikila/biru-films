(() => {
  'use strict';
  const root = document.documentElement;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const motionButton = document.querySelector('#motion-toggle');
  let preference = null;
  try { preference = localStorage.getItem('biru-motion'); } catch {}
  let motion = !reduced.matches && preference !== 'off';
  const applyMotion = () => {
    root.classList.toggle('no-motion', !motion);
    motionButton.setAttribute('aria-pressed', String(motion));
    motionButton.querySelector('span').textContent = motion ? 'ON' : 'OFF';
    motionButton.disabled = reduced.matches;
    motionButton.title = reduced.matches ? 'Reduced motion is enabled in your system settings' : 'Toggle website motion';
  };
  applyMotion();
  motionButton.addEventListener('click', () => {
    motion = !motion;
    try { localStorage.setItem('biru-motion', motion ? 'on' : 'off'); } catch {}
    applyMotion();
    queueUpdate();
  });
  reduced.addEventListener('change', event => { if (event.matches) {motion = false;applyMotion();queueUpdate();} });

  // Content remains visible without JavaScript; reveal styles activate only after observers exist.
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {entry.target.classList.add('seen');observer.unobserve(entry.target);}
    });
  }, {threshold: .12, rootMargin: '0px 0px -3% 0px'});
  const headline = document.querySelector('.word-reveal');
  let wordIndex = 0;
  const splitWords = node => {
    [...node.childNodes].forEach(child => {
      if (child.nodeType === Node.TEXT_NODE) {
        const fragment = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach(word => {
          if (!word.trim()) { fragment.append(document.createTextNode(word)); return; }
          const span = document.createElement('span');span.className='word';span.textContent=word;
          span.style.setProperty('--word-index', wordIndex++);fragment.append(span);
        });
        child.replaceWith(fragment);
      } else if (child.nodeType === Node.ELEMENT_NODE && child.tagName !== 'BR') splitWords(child);
    });
  };
  splitWords(headline);
  document.querySelectorAll('.reveal,.word-reveal').forEach(el=>observer.observe(el));
  root.classList.add('motion-ready');

  const hero = document.querySelector('.hero');
  const film = document.querySelector('.film-expand');
  const filmCanvas = document.querySelector('.film-canvas');
  const filmType = document.querySelector('.middle-type');
  const poster = document.querySelector('.poster-composition');
  const studio = document.querySelector('.studio');
  const studioOrbit = document.querySelector('.studio-orbit');
  const study = document.querySelector('.study-viewport');
  const progress = document.querySelector('.page-progress');
  const header = document.querySelector('.site-header');
  const studySection = document.querySelector('.frame-study');
  const timecode = document.querySelector('.film-timecode');
  const clamp = (n,lo=0,hi=1)=>Math.max(lo,Math.min(hi,n));
  let scheduled = false;
  let lastScroll = 0;
  function update() {
    scheduled = false;
    const height = window.innerHeight;
    const scroll = window.scrollY;
    const max = document.documentElement.scrollHeight-height;
    progress.style.transform = `scaleX(${max>0?clamp(scroll/max):0})`;
    const delta = scroll-lastScroll;
    const menuOpen = document.querySelector('.menu-button').getAttribute('aria-expanded')==='true';
    if(scroll<180||menuOpen) header.classList.remove('header-hidden');
    else if(delta>3) header.classList.add('header-hidden');
    else if(delta< -3) header.classList.remove('header-hidden');
    header.classList.toggle('header-scrolled',scroll>40);
    header.classList.toggle('header-dark',[film,studySection].some(el=>{const r=el.getBoundingClientRect();return r.top<80&&r.bottom>80;}));
    lastScroll=scroll;
    if (!motion) return;
    const heroRect=hero.getBoundingClientRect();
    if (heroRect.bottom>0) hero.style.setProperty('--scroll',clamp(-heroRect.top/heroRect.height));
    const filmRect=film.getBoundingClientRect();
    if (filmRect.top<height && filmRect.bottom>0) {
      const entering=clamp((height-filmRect.top)/(height*.8));
      const active=clamp(-filmRect.top/Math.max(1,filmRect.height-height));
      const mobile=window.innerWidth<=760;
      filmCanvas.style.setProperty('--film-inset',`${(1-entering)*(mobile?6:12)}%`);
      filmCanvas.style.setProperty('--film-side',`${(1-entering)*(mobile?4:8)}%`);
      filmType.style.setProperty('--film-shift',`${active*(mobile?-20:-35)}px`);
      poster.style.setProperty('--poster-rotate',`${6-active*10}deg`);
      const frames=Math.floor(active*24*60),seconds=Math.floor(frames/24);
      timecode.textContent=`00 : ${String(Math.floor(seconds/60)).padStart(2,'0')} : ${String(seconds%60).padStart(2,'0')} : ${String(frames%24).padStart(2,'0')}`;
    }
    const studioRect=studio.getBoundingClientRect();
    if(studioRect.top<height&&studioRect.bottom>0)studioOrbit.style.setProperty('--studio-rotate',`${(height-studioRect.top)*.035}deg`);
    const studyRect=study.getBoundingClientRect();
    if(studyRect.top<height&&studyRect.bottom>0)study.style.setProperty('--study-parallax',`${(height/2-studyRect.top-studyRect.height/2)*.035}px`);
  }
  function queueUpdate() {if(!scheduled){scheduled=true;requestAnimationFrame(update);}}
  window.addEventListener('scroll',queueUpdate,{passive:true});
  window.addEventListener('resize',queueUpdate,{passive:true});
  window.addEventListener('load',queueUpdate);
  if(document.fonts)document.fonts.ready.then(queueUpdate);
  queueUpdate();

  hero.addEventListener('pointermove',event=>{
    if(!motion||!finePointer.matches)return;
    const r=hero.getBoundingClientRect();
    hero.style.setProperty('--mx',(event.clientX/r.width-.5).toFixed(2));
    hero.style.setProperty('--my',((event.clientY-r.top)/r.height-.5).toFixed(2));
  },{passive:true});
  hero.addEventListener('pointerleave',()=>{hero.style.setProperty('--mx',0);hero.style.setProperty('--my',0);});

  const menuButton=document.querySelector('.menu-button');
  const mobileNav=document.querySelector('.mobile-nav');
  let lastFocus=null;
  function closeMenu(restore=true){
    menuButton.setAttribute('aria-expanded','false');mobileNav.classList.remove('open');mobileNav.inert=true;
    document.body.classList.remove('locked');
    header.classList.remove('menu-open');
    queueUpdate();
    if(restore)menuButton.focus({preventScroll:true});
  }
  menuButton.addEventListener('click',()=>{
    const open=menuButton.getAttribute('aria-expanded')==='true';
    if(open){closeMenu();return;}
    menuButton.setAttribute('aria-expanded','true');mobileNav.inert=false;mobileNav.classList.add('open');
    header.classList.add('menu-open');header.classList.remove('header-hidden');
    document.body.classList.add('locked');mobileNav.querySelector('a').focus({preventScroll:true});
  });
  mobileNav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>closeMenu(false)));
  window.matchMedia('(min-width:761px)').addEventListener('change',event=>{if(event.matches)closeMenu(false);});
  document.addEventListener('keydown',event=>{
    if(menuButton.getAttribute('aria-expanded')!=='true')return;
    if(event.key==='Escape'){event.preventDefault();closeMenu();}
    if(event.key==='Tab'){
      const links=[menuButton,...mobileNav.querySelectorAll('a')];
      const first=links[0],last=links[links.length-1];
      if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
      else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
    }
  });

  const ratioLabels={wide:'2.39 : 1',screen:'16 : 9',classic:'4 : 3'};
  document.querySelectorAll('.ratio-buttons button').forEach(button=>button.addEventListener('click',()=>{
    study.dataset.ratio=button.dataset.ratio;
    document.querySelector('#ratio-label').textContent=ratioLabels[button.dataset.ratio];
    document.querySelectorAll('.ratio-buttons button').forEach(other=>other.setAttribute('aria-pressed',String(other===button)));
  }));

  const films={
    choice:{title:'The Choice',video:'CZ9Tlg5j8os',note:'Directed by Diyan Kinigama.'},
    eath:{title:'Eat-h Other',video:'TiKAbPvgdYM',note:'A film experiment by Biru Films.'}
  };
  const dialog=document.querySelector('#film-dialog');
  document.querySelectorAll('[data-film]').forEach(button=>button.addEventListener('click',()=>{
    const selected=films[button.dataset.film];lastFocus=button;
    document.querySelector('#dialog-title').textContent=selected.title;
    document.querySelector('#dialog-note').textContent=selected.note;
    document.querySelector('#dialog-external').href=`https://www.youtube.com/watch?v=${selected.video}`;
    const iframe=document.createElement('iframe');
    iframe.title=`${selected.title} — Biru Films`;
    iframe.src=`https://www.youtube-nocookie.com/embed/${selected.video}?rel=0`;
    iframe.allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen';
    iframe.allowFullscreen=true;iframe.referrerPolicy='strict-origin-when-cross-origin';
    document.querySelector('.video-mount').replaceChildren(iframe);
    dialog.showModal();document.body.classList.add('locked');
    document.querySelector('.dialog-close').focus({preventScroll:true});
  }));
  document.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',event=>{
    const r=dialog.getBoundingClientRect();
    if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();
  });
  dialog.addEventListener('close',()=>{
    document.querySelector('.video-mount').replaceChildren();document.body.classList.remove('locked');
    if(lastFocus)lastFocus.focus({preventScroll:true});
  });

  const cursor=document.querySelector('.link-cursor');
  document.querySelectorAll('.project').forEach(project=>{
    project.addEventListener('pointerenter',()=>{if(motion&&finePointer.matches)cursor.classList.add('active');});
    project.addEventListener('pointerleave',()=>cursor.classList.remove('active'));
    project.addEventListener('pointermove',event=>{cursor.style.left=`${event.clientX}px`;cursor.style.top=`${event.clientY}px`;},{passive:true});
    project.addEventListener('click',()=>cursor.classList.remove('active'));
  });
  document.addEventListener('visibilitychange',()=>{if(document.hidden)cursor.classList.remove('active');});
})();
