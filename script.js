/* ═══════════════════════════════════════════════════════════════
   SHRIYAAVERSE — script.js  v2
   Landing → Scroll-based experience with corner clips
═══════════════════════════════════════════════════════════════ */

/* ─────────────────────────────────────────────────────────────
   AUDIO TIMELINE
   Each entry = one moment card on the scroll page.
   `time` triggers clip playback when audio reaches that second.
   ───────────────────────────────────────────────────────────── */
const audioTimeline = [
  { time: 2  },   // moment 0 — A Maharashtrian Baddie
  { time: 8  },   // moment 1 — Future Netaji Energy
  { time: 14 },   // moment 2 — Sporty
  { time: 20 },   // moment 3 — Dancefloor Slayer
  { time: 26 },   // moment 4 — Fashionista
  { time: 32 },   // moment 5 — Papa Ki Pari
];

/* ─────────────────────────────────────────────────────────────
   DOM
   ───────────────────────────────────────────────────────────── */
const landing        = document.getElementById('landing');
const enterBtn       = document.getElementById('enter-btn');
const transitionVeil = document.getElementById('transition-veil');
const experience     = document.getElementById('experience');
const mainAudio      = document.getElementById('main-audio');
const starCanvas     = document.getElementById('starfield');
const lpEl           = document.getElementById('landing-particles');
const meteorsEl      = document.getElementById('meteors');

/* ─────────────────────────────────────────────────────────────
   STARFIELD
   ───────────────────────────────────────────────────────────── */
(function initStarfield() {
  const ctx = starCanvas.getContext('2d');
  const stars = [];
  const N = 300;
  const COLORS = ['#e8c97a','#f0a0b8','#c5a8e8','#ffffff','#88c8f0'];

  function resize() {
    starCanvas.width  = window.innerWidth;
    starCanvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  for (let i = 0; i < N; i++) {
    stars.push({
      x:  Math.random() * starCanvas.width,
      y:  Math.random() * starCanvas.height,
      r:  Math.random() * 1.6 + .2,
      a:  Math.random(),
      da: (Math.random() * .009 + .002) * (Math.random() < .5 ? 1 : -1),
      c:  COLORS[Math.floor(Math.random() * COLORS.length)]
    });
  }

  (function draw() {
    ctx.clearRect(0, 0, starCanvas.width, starCanvas.height);
    for (const s of stars) {
      s.a += s.da;
      if (s.a <= 0 || s.a >= 1) s.da *= -1;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = s.c;
      ctx.globalAlpha = s.a;
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  })();
})();

/* ─────────────────────────────────────────────────────────────
   LANDING PARTICLES
   ───────────────────────────────────────────────────────────── */
(function initParticles() {
  const COLS = ['#e8c97a','#f0a0b8','#c5a8e8','#88c8f0'];
  for (let i = 0; i < 35; i++) {
    const p   = document.createElement('div');
    const sz  = Math.random() * 3.5 + .8;
    const col = COLS[Math.floor(Math.random() * COLS.length)];
    const dur = Math.random() * 16 + 8;
    const del = Math.random() * 14;
    const lx  = (Math.random() - .5) * 100;
    p.className = 'lp';
    p.style.cssText = `
      left:${Math.random()*100}%;bottom:-8px;
      width:${sz}px;height:${sz}px;
      background:${col};
      box-shadow:0 0 ${sz*4}px 1px ${col};
      --lx:${lx}px;
      animation-duration:${dur}s;animation-delay:${del}s;
    `;
    lpEl.appendChild(p);
  }
})();

/* ─────────────────────────────────────────────────────────────
   METEORS on landing
   ───────────────────────────────────────────────────────────── */
function spawnMeteor() {
  const m = document.createElement('div');
  m.className = 'meteor';
  const len = Math.random() * 200 + 80;
  const top = Math.random() * 60;
  const left = Math.random() * 70 - 10;
  const dur = Math.random() * 1.2 + .7;
  m.style.cssText = `
    width:${len}px;
    top:${top}%;left:${left}%;
    transform:rotate(${25 + Math.random()*15}deg);
    animation-duration:${dur}s;
  `;
  meteorsEl.appendChild(m);
  setTimeout(() => m.remove(), dur * 1000 + 200);
}
setInterval(spawnMeteor, 2200);
setTimeout(spawnMeteor, 400);

/* ─────────────────────────────────────────────────────────────
   ENTER BUTTON
   ───────────────────────────────────────────────────────────── */
enterBtn.addEventListener('click', () => {
  enterBtn.disabled = true;

  landing.classList.add('exiting');

  setTimeout(() => {
    transitionVeil.classList.add('burst');
  }, 280);

  setTimeout(() => {
    landing.style.display = 'none';
    experience.classList.remove('hidden');
    initExperience();
  }, 860);
});

/* ─────────────────────────────────────────────────────────────
   INIT EXPERIENCE
   ───────────────────────────────────────────────────────────── */
function initExperience() {
  /* Play audio (user gesture already satisfied) */
  mainAudio.currentTime = 0;
  mainAudio.play().catch(() => {});

  /* Start scroll observer for moment cards */
  initScrollReveal();

  /* Start audio-sync for video clip playback */
  startAudioSync();
}

/* ─────────────────────────────────────────────────────────────
   SCROLL REVEAL — IntersectionObserver
   Clips slide in from their corner when scrolled into view
   ───────────────────────────────────────────────────────────── */
function initScrollReveal() {
  const moments = document.querySelectorAll('.moment');

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const m = entry.target;
        const clipWrap = m.querySelector('.moment-clip-wrap');
        const textWrap = m.querySelector('.moment-text-wrap');
        const vid      = m.querySelector('.moment-clip');

        clipWrap.classList.add('visible');
        textWrap.classList.add('visible');

        /* Play the clip when visible */
        if (vid) vid.play().catch(() => {});
      } else {
        /* Pause when scrolled away (optional — clips stay visible) */
        const vid = entry.target.querySelector('.moment-clip');
        if (vid) vid.pause();
      }
    });
  }, {
    threshold: 0.25   /* reveal when 25% visible */
  });

  moments.forEach(m => io.observe(m));
}

/* ─────────────────────────────────────────────────────────────
   AUDIO SYNC — triggers clip play in sync with audio
   (additional layer on top of scroll-trigger)
   ───────────────────────────────────────────────────────────── */
let audioTriggered = new Array(audioTimeline.length).fill(false);

function startAudioSync() {
  const clips = document.querySelectorAll('.moment-clip');

  function loop() {
    const t = mainAudio.currentTime;

    audioTimeline.forEach((entry, i) => {
      if (!audioTriggered[i] && t >= entry.time) {
        audioTriggered[i] = true;
        if (clips[i]) {
          clips[i].currentTime = 0;
          clips[i].play().catch(() => {});
        }
      }
    });

    if (!mainAudio.ended) requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
}

/* ─────────────────────────────────────────────────────────────
   FINALE SECTION — fade in on scroll
   ───────────────────────────────────────────────────────────── */
(function initFinale() {
  const finale = document.getElementById('finale');
  if (!finale) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        finale.style.opacity = '1';
        finale.style.transform = 'none';
        spawnFinaleStars(finale.querySelector('.finale-stars'));
      }
    });
  }, { threshold: 0.15 });

  finale.style.opacity = '0';
  finale.style.transform = 'translateY(30px)';
  finale.style.transition = 'opacity 1.2s ease, transform 1.2s ease';
  io.observe(finale);
})();

function spawnFinaleStars(container) {
  if (!container || container.dataset.done) return;
  container.dataset.done = '1';
  const COLS = ['#e8c97a','#f0a0b8','#c5a8e8'];
  for (let i = 0; i < 60; i++) {
    const s = document.createElement('div');
    const sz = Math.random() * 2 + .5;
    s.style.cssText = `
      position:absolute;
      border-radius:50%;
      width:${sz}px;height:${sz}px;
      top:${Math.random()*100}%;left:${Math.random()*100}%;
      background:${COLS[Math.floor(Math.random()*COLS.length)]};
      opacity:${Math.random()*.6+.1};
      animation:starTwinkle ${Math.random()*3+2}s ease-in-out ${Math.random()*2}s infinite alternate;
    `;
    container.appendChild(s);
  }
  if (!document.getElementById('star-twinkle-kf')) {
    const st = document.createElement('style');
    st.id = 'star-twinkle-kf';
    st.textContent = '@keyframes starTwinkle{from{opacity:.1}to{opacity:.8}}';
    document.head.appendChild(st);
  }
}

/* ─────────────────────────────────────────────────────────────
   EXPERIENCE PAGE — parallax tilt on mouse move
   ───────────────────────────────────────────────────────────── */
document.addEventListener('mousemove', (e) => {
  if (experience.classList.contains('hidden')) return;
  const nx = (e.clientX / window.innerWidth  - .5) * 10;
  const ny = (e.clientY / window.innerHeight - .5) * 6;
  const bg = document.getElementById('exp-bg');
  if (bg) bg.style.transform = `translate(${nx}px, ${ny}px) scale(1.04)`;
});
