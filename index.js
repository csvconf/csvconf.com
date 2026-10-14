/* ---------- view router (tabs) ---------- */
const navlinks = document.getElementById('navlinks');
const views = document.querySelectorAll('.view');
const validViews = new Set(['home','schedule','speakers','sponsors','cfp','venue']);

function showView(id, push){
  if(!validViews.has(id)) id = 'home';
  views.forEach(v => {
    const on = v.id === 'view-' + id;
    v.classList.toggle('active', on);
    v.style.display = on ? 'block' : 'none';
  });
  document.querySelectorAll('.navlinks a[data-view]').forEach(a =>
    a.classList.toggle('current', a.dataset.view === id));
  window.scrollTo(0, 0);
  navlinks.classList.remove('open');
  if(push !== false && location.hash !== '#' + id) history.pushState(null, '', '#' + id);
}
document.querySelectorAll('[data-view]').forEach(el => {
  el.addEventListener('click', e => { e.preventDefault(); showView(el.dataset.view); });
});
window.addEventListener('popstate', () => showView((location.hash || '#home').slice(1), false));

/* ---------- mobile menu ---------- */
document.getElementById('burger').addEventListener('click', () => navlinks.classList.toggle('open'));

/* ---------- speakers (real data) ---------- */
const speakers = [
  {n:'Cristian Planas', r:'Principal Engineer', c:'Combinaut', t:'Dead Cucumbers &amp; Frozen Capybaras: Building the Safety Net for Agentic Development'},
  {n:'Dhruva Sagar (DS)', r:'Senior Consultant', c:'Tarka Labs', t:'The Ceiling: Why Ruby 4.0 Needed a Second Compiler'},
  {n:'Shanmugha Priya P R', r:'Senior Software Engineer', c:'Rently Software Development Pvt Ltd', t:'Rethinking Ruby Query Optimization: From ORM Traps to AI Analysis'},
  {n:'Vishwajeetsingh Desurkar', r:'Senior Software Engineer', c:'Josh Software Pvt Ltd', t:'No Way Home: Threads, Fibers and Ractors Against One Training Loop'},
  {n:'Akshay Birajdar', r:'Senior Software Engineer', c:'Zendesk', t:'Small Things, Big Impact: Scaling Ruby Apps with the Right Primitives'},
  {n:'Ratnadeep Deshmane', r:'CTO', c:'Betacraft', t:'The Pursuit of Quality: Chase Better Code with AI, and the Speed Follows'},
  {n:'Sourabh Bharale', r:'Senior Software Engineer', c:'MoxiWorks Solutions Pvt Ltd', t:"Your API Is Already an Agent's Tool"}
];
const initials = name => name.split(' ').filter(Boolean).slice(0,2).map(w=>w[0]).join('').toUpperCase();
document.getElementById('spkGrid').innerHTML = speakers.map(s => `
  <article class="spk">
    ${s.kb ? '<span class="kb">Keynote</span>' : ''}
    <div class="spk-avatar"><span class="ring"></span><span class="initials">${initials(s.n)}</span></div>
    <div class="spk-body">
      <div class="spk-name">${s.n}</div>
      <div class="spk-role">${s.r}</div>
      <div class="spk-co">${s.c}</div>
      <div class="spk-talk">${s.t}</div>
    </div>
  </article>`).join('');

/* ---------- countdown to 21 Nov 2026, 9:00 AM IST ---------- */
const target = new Date('2026-11-21T09:00:00+05:30').getTime();
const el = {d:'cd-days',h:'cd-hrs',m:'cd-min',s:'cd-sec'};
const pad = n => String(n).padStart(2,'0');
function tick(){
  let diff = Math.max(0, target - Date.now());
  const d = Math.floor(diff/864e5); diff -= d*864e5;
  const h = Math.floor(diff/36e5); diff -= h*36e5;
  const m = Math.floor(diff/6e4); diff -= m*6e4;
  const s = Math.floor(diff/1e3);
  document.getElementById(el.d).textContent = d;
  document.getElementById(el.h).textContent = pad(h);
  document.getElementById(el.m).textContent = pad(m);
  document.getElementById(el.s).textContent = pad(s);
}
tick(); setInterval(tick, 1000);

/* ---------- nav shadow on scroll ---------- */
const topbar = document.querySelector('.topbar');
addEventListener('scroll', () => {
  topbar.style.boxShadow = scrollY > 20 ? '0 10px 30px -20px rgba(94,10,32,.45)' : 'none';
});

/* ---------- mini-game: Gem Catch ---------- */
(function(){
  const stage = document.getElementById('gameStage');
  if(!stage) return;
  const scoreEl = document.getElementById('gScore');
  const timeEl  = document.getElementById('gTime');
  const overlay = document.getElementById('gOverlay');
  const RUBY = '<svg viewBox="0 0 32 28"><path d="M8 2h16l6 8-14 16L2 10z" fill="#E0115F"/><path d="M8 2l8 8 8-8M2 10h28M16 10v16" stroke="#F2D58C" stroke-width="1.4" fill="none"/></svg>';

  let running=false, score=0, timeLeft=10, items=[], lastT=0, spawnAcc=0, secAcc=0, raf=0, best=0;

  function spawn(){
    const w = stage.clientWidth;
    const isBomb = Math.random() < 0.22;
    const el = document.createElement('div');
    el.className = isBomb ? 'bomb' : 'gem';
    el.innerHTML = isBomb ? '💣' : RUBY;
    el.style.left = Math.max(0, Math.random()*(w-46)) + 'px';
    el.style.transform = 'translateY(-50px)';
    const it = { el, y:-50, vy: 85 + Math.random()*65 + (10-timeLeft)*5, alive:true };
    el.addEventListener('pointerdown', ev => {
      ev.preventDefault();
      if(!running || !it.alive) return;
      it.alive = false;
      if(isBomb){ score = Math.max(0, score-2); el.className='bomb boom'; }
      else { score += 1; el.className='gem pop'; }
      scoreEl.textContent = score;
      setTimeout(()=>el.remove(), 220);
    }, {passive:false});
    stage.appendChild(el);
    items.push(it);
  }

  function loop(t){
    if(!running) return;
    if(!lastT) lastT = t;
    const dt = Math.min(0.05, (t-lastT)/1000); lastT = t;
    spawnAcc += dt; secAcc += dt;
    const spawnEvery = Math.max(0.30, 0.58 - (10-timeLeft)*0.028);
    if(spawnAcc >= spawnEvery){ spawnAcc = 0; spawn(); }
    if(secAcc >= 1){ secAcc -= 1; timeLeft -= 1; timeEl.textContent = Math.max(0, timeLeft); if(timeLeft <= 0){ endGame(); return; } }
    const h = stage.clientHeight;
    for(const it of items){ if(!it.alive) continue; it.y += it.vy*dt; it.el.style.transform = 'translateY('+it.y+'px)'; if(it.y > h){ it.alive=false; it.el.remove(); } }
    items = items.filter(it => it.alive);
    raf = requestAnimationFrame(loop);
  }

  function clearItems(){ items.forEach(it => it.el.remove()); items = []; }

  function startGame(){
    clearItems(); score=0; timeLeft=10; lastT=0; spawnAcc=0; secAcc=0; running=true;
    scoreEl.textContent='0'; timeEl.textContent='10';
    overlay.classList.add('hide');
    raf = requestAnimationFrame(loop);
  }

  function endGame(){
    running=false; cancelAnimationFrame(raf); clearItems(); timeEl.textContent='0';
    const isBest = score > best && score > 0;
    if(score > best) best = score;
    overlay.classList.remove('hide');
    overlay.innerHTML =
      `<h3>Time's up!</h3><div class="big-score">${score}</div>`
      + `<p>${score===0 ? 'No rubies this time — give it another go!' : (isBest ? '🎉 New personal best!' : 'Nice catching! Best this session: ' + best + '.')}</p>`
      + `<button class="btn btn-gold" id="gAgain">Play Again</button>`;
    document.getElementById('gAgain').addEventListener('click', startGame);
  }

  document.getElementById('gStart').addEventListener('click', startGame);
})();

/* ---------- initial route ---------- */
showView((location.hash || '#home').slice(1), false);
