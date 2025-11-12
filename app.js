(function(){
  const stage = document.getElementById('stage');
  const captions = document.getElementById('captions');
  const sIntro = document.getElementById('scene-intro');
  const sDef   = document.getElementById('scene-definition');
  const sCats  = document.getElementById('scene-categories');
  const sAdv   = document.getElementById('scene-advantages');

  const btnPlay = document.getElementById('btn-play');
  const btnReplay = document.getElementById('btn-replay');
  const btnMute = document.getElementById('btn-mute');

  let muted = false;
  let speaking = false;
  let cancelled = false;

  const brand = {
    red: '#E23D28', orange: '#FF7A1A', white: '#FFFFFF'
  };

  function show(el){ el.classList.remove('hidden'); el.classList.add('visible'); el.setAttribute('aria-hidden','false'); }
  function hide(el){ el.classList.add('hidden'); el.classList.remove('visible'); el.setAttribute('aria-hidden','true'); }
  function setCaption(text){ captions.textContent = text || ''; }

  function clearScenes(){ [sIntro,sDef,sCats,sAdv].forEach(hide); setCaption(''); }

  function wait(ms){ return new Promise(res=> setTimeout(res, ms)); }

  function speak(text, opts={}){
    if (muted || !('speechSynthesis' in window)) { setCaption(text); return Promise.resolve(); }
    return new Promise((resolve)=>{
      const utter = new SpeechSynthesisUtterance(text);
      utter.rate = opts.rate ?? 1.02;
      utter.pitch = opts.pitch ?? 1.0;
      utter.volume = opts.volume ?? 1.0;
      utter.lang = 'en-US';
      speaking = true;
      utter.onend = ()=>{ speaking = false; resolve(); };
      try {
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utter);
      } catch(_e){
        // fallback to captions only
        resolve();
      }
    });
  }

  async function playSequence(){
    cancelled = false;
    clearScenes();

    // Scene 1: Intro (0 - 4.5s)
    show(sIntro);
    setCaption('Discover smarter ways to grow your wealth beyond traditional investments.');
    await speak('Discover smarter ways to grow your wealth beyond traditional investments.', { rate: 1.03 });
    if (cancelled) return;
    await wait(900);

    // Scene 2: Definition (4.5s - 9s)
    hide(sIntro); show(sDef); setCaption('Alternative Investment Funds are privately pooled investment vehicles.');
    await speak('Alternative Investment Funds are privately pooled investment vehicles that offer access to exclusive, high-growth opportunities across global markets.', { rate: 1.02 });
    if (cancelled) return;
    await wait(600);

    // Scene 3: Categories (9s - 15s)
    hide(sDef); show(sCats);
    setCaption('Category One: Venture Capital, SME, and Social Impact Funds.');
    await speak('Category One: Venture Capital, S M E, and Social Impact Funds.', { rate: 1.04 });
    if (cancelled) return; await wait(300);
    setCaption('Category Two: Private Equity and Debt Funds.');
    await speak('Category Two: Private Equity and Debt Funds.', { rate: 1.04 });
    if (cancelled) return; await wait(300);
    setCaption('Category Three: Hedge Funds and advanced strategies.');
    await speak('Category Three: Hedge Funds and advanced strategies.', { rate: 1.04 });
    if (cancelled) return; await wait(500);

    // Scene 4: Advantages (15s - 20s)
    hide(sCats); show(sAdv);
    setCaption('Diversification: Broaden exposure beyond public markets.');
    await speak('Key advantages include diversification to broaden exposure beyond public markets, expert management, and intelligent wealth creation.', { rate: 1.03 });
    if (cancelled) return; await wait(1300);

    // Outro pulse
    setCaption('Accred Alts ? Navigate alternative investments with confidence.');
    await wait(800);
    setCaption('');
  }

  function stopAll(){
    cancelled = true;
    try { window.speechSynthesis && window.speechSynthesis.cancel(); } catch(_e){}
  }

  btnPlay.addEventListener('click', ()=>{ stopAll(); playSequence(); });
  btnReplay.addEventListener('click', ()=>{ stopAll(); clearScenes(); playSequence(); });
  btnMute.addEventListener('click', ()=>{
    muted = !muted;
    btnMute.textContent = muted ? 'Unmute' : 'Mute';
    if (muted) { try { window.speechSynthesis.cancel(); } catch(_e){} }
  });

  // Auto-fit: ensure crisp rendering on mobile tall viewports
  function fit(){
    // Stage naturally uses aspect-ratio; no special logic needed
  }
  window.addEventListener('resize', fit);
  fit();

  // Start with intro visible but paused until user taps Play (for audio policy)
  clearScenes();
  show(sIntro);
  setCaption('Tap Play to start the experience.');
})();
