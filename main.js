(() => {
  // Splash text
  const splashes = ['Копай глубже!', '100% блоков!', 'Крипер не придёт!', 'Сделано из кубов!', 'Теперь и в браузере!', 'Не копай вниз!'];
  document.getElementById('splash').textContent = splashes[Math.floor(Math.random() * splashes.length)];

  // F3 overlay: Y from 64 at top to -59 at bottom, biome by section
  const yEl = document.getElementById('f3-y');
  const biomeEl = document.getElementById('f3-biome');
  const layers = [...document.querySelectorAll('[data-biome]')];
  let ticking = false;
  function update() {
    ticking = false;
    const max = document.documentElement.scrollHeight - innerHeight;
    const f = max > 0 ? Math.min(1, scrollY / max) : 0;
    yEl.textContent = (64 - f * 123).toFixed(3);
    const mid = innerHeight * 0.4;
    let cur = layers[0];
    for (const l of layers) if (l.getBoundingClientRect().top <= mid) cur = l;
    biomeEl.textContent = cur.dataset.biome;
  }
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  addEventListener('resize', update);
  update();

  // Hearts
  document.querySelectorAll('.hp').forEach(el => {
    const n = +el.dataset.hp;
    for (let i = 0; i < n; i++) {
      const h = document.createElement('img');
      h.src = 'assets/i-heart.png'; h.alt = '';
      el.appendChild(h);
    }
  });

  // Crafting
  const I = {
    d: ['i-diamond', 'Алмаз'], s: ['i-stick', 'Палка'], c: ['i-coal', 'Уголь'], p: ['i-planks', 'Доски'],
  };
  const R = {
    pickaxe: { grid: 'ddd_s__s_', out: 'i-pickaxe', name: 'Алмазная кирка',
      note: 'Алмазная кирка: три алмаза сверху и две палки по центру. Добывает обсидиан и любую руду.' },
    sword: { grid: '_d__d__s_', out: 'i-sword', name: 'Алмазный меч',
      note: 'Алмазный меч: два алмаза и палка в одном столбце. Семь единиц урона за удар.' },
    torch: { grid: '_c__s____', out: 'i-torch', name: 'Факел',
      note: 'Факел: уголь над палкой — и сразу четыре факела. Свет не даёт мобам появляться рядом.' },
    table: { grid: 'pp_pp____', out: 'i-crafting-table', name: 'Верстак',
      note: 'Верстак: четыре доски квадратом. С него начинается весь крафт.' },
  };
  const grid = document.getElementById('grid');
  const result = document.getElementById('result');
  const note = document.getElementById('note');
  const cells = [];
  for (let i = 0; i < 9; i++) {
    const s = document.createElement('div');
    s.className = 'slot';
    grid.appendChild(s); cells.push(s);
  }
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let timers = [];
  function img(src, alt) {
    const el = document.createElement('img');
    el.src = `assets/${src}.png`; el.alt = alt; el.className = 'pop';
    return el;
  }
  function craft(key, btn) {
    timers.forEach(clearTimeout); timers = [];
    document.querySelectorAll('[data-recipe]').forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
    cells.forEach(c => c.replaceChildren()); result.replaceChildren();
    const r = R[key];
    let step = 0;
    [...r.grid].forEach((ch, i) => {
      if (ch === '_') return;
      const t = setTimeout(() => cells[i].appendChild(img(...I[ch])), reduce ? 0 : 80 * step++);
      timers.push(t);
    });
    timers.push(setTimeout(() => {
      result.appendChild(img(r.out, r.name));
      note.textContent = r.note;
    }, reduce ? 0 : 80 * step + 160));
  }
  document.querySelectorAll('[data-recipe]').forEach(b => b.addEventListener('click', () => craft(b.dataset.recipe, b)));
})();
