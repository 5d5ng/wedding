/* 화면을 그리는 코드예요. 문구·사진은 content.js 에서 고치면 되고, 이 파일은 건드리지 않아도 돼요. */
(function () {
  var W = window.WEDDING;
  var $ = function (id) { return document.getElementById(id); };
  function txt(id, s) { var el = $(id); if (el) el.textContent = s || ''; }
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function p2(n) { return (n < 10 ? '0' : '') + n; }

  var D = W.date;
  var WEDDING = new Date(D.year, D.month - 1, D.day, D.hour, D.minute, 0);

  // cover
  $('coverImg').src = W.coverPhoto;
  txt('coverDate', D.year + ' · ' + p2(D.month) + ' · ' + p2(D.day));
  txt('coverScript', W.coverScript);
  txt('coverNames', W.coverNames);

  // greeting + parents
  txt('greeting', W.greeting);
  function parents(p) {
    var names = [p.father, p.mother].filter(Boolean).join(' · ');
    return names ? names + ' 의 ' + p.relation : '';
  }
  txt('gParents', parents(W.groom)); txt('gName', W.groom.name);
  txt('bParents', parents(W.bride)); txt('bName', W.bride.name);

  // contacts (only those with numbers)
  var contacts = [
    { role: '신랑', name: W.groom.name, phone: W.groom.phone },
    { role: '신랑 혼주', name: [W.groom.father, W.groom.mother].filter(Boolean).join(' · '), phone: W.groomParentsPhone },
    { role: '신부', name: W.bride.name, phone: W.bride.phone },
    { role: '신부 혼주', name: [W.bride.father, W.bride.mother].filter(Boolean).join(' · '), phone: W.brideParentsPhone }
  ].filter(function (c) { return c.phone; });
  if (contacts.length) {
    $('contactBtn').hidden = false;
    contacts.forEach(function (c) {
      var row = el('div', 'crow');
      var info = el('div'); info.appendChild(el('small', null, c.role)); info.appendChild(document.createTextNode(c.name));
      var tel = c.phone.replace(/[^0-9]/g, '');
      var call = el('a', null, '전화'); call.href = 'tel:' + tel;
      var sms = el('a', null, '문자'); sms.href = 'sms:' + tel;
      row.appendChild(info); row.appendChild(call); row.appendChild(sms);
      $('contactList').appendChild(row);
    });
    $('contactBtn').onclick = function () { $('contact').hidden = false; };
  }

  // profiles
  [['GROOM', '신랑', W.groom], ['BRIDE', '신부', W.bride]].forEach(function (x) {
    var p = x[2], box = el('div', 'prof');
    var img = el('img'); img.src = p.photo; img.alt = x[1] + ' ' + p.name; img.loading = 'lazy';
    box.appendChild(img);
    box.appendChild(el('div', 'role', x[0]));
    box.appendChild(el('div', 'nm', x[1] + ' ' + p.name));
    if (p.tags && p.tags.length) { var t = el('div', 'tags'); p.tags.forEach(function (s) { t.appendChild(el('span', null, s)); }); box.appendChild(t); }
    if (p.intro) box.appendChild(el('p', 'pre-line', p.intro));
    $('profiles').appendChild(box);
  });

  // date + calendar
  txt('dateText', W.dateText); txt('timeText', W.timeText);
  txt('ddNames', W.groom.name + ' ♥ ' + W.bride.name);
  var cal = $('cal');
  ['일', '월', '화', '수', '목', '금', '토'].forEach(function (d, i) { cal.appendChild(el('div', 'h' + (i === 0 ? ' sun' : ''), d)); });
  var first = new Date(D.year, D.month - 1, 1).getDay();
  var last = new Date(D.year, D.month, 0).getDate();
  for (var i = 0; i < first; i++) cal.appendChild(el('div', 'd'));
  for (var d = 1; d <= last; d++) {
    var dow = (first + d - 1) % 7;
    if (d === D.day) { var c = el('div', 'd on'); c.appendChild(el('span', null, String(d))); cal.appendChild(c); }
    else cal.appendChild(el('div', 'd' + (dow === 0 ? ' sun' : ''), String(d)));
  }
  function tick() {
    var ms = Math.max(0, WEDDING - new Date()), s = Math.floor(ms / 1000);
    txt('cD', String(Math.floor(s / 86400))); txt('cH', p2(Math.floor(s % 86400 / 3600)));
    txt('cM', p2(Math.floor(s % 3600 / 60))); txt('cS', p2(s % 60));
    var t = new Date(); t.setHours(0, 0, 0, 0);
    var left = Math.round((new Date(D.year, D.month - 1, D.day) - t) / 86400000);
    txt('dd', left > 0 ? left + '일' : '오늘');
  }
  tick(); setInterval(tick, 1000);

  // google calendar (KST → UTC)
  function utc(dt) { return dt.getUTCFullYear() + p2(dt.getUTCMonth() + 1) + p2(dt.getUTCDate()) + 'T' + p2(dt.getUTCHours()) + p2(dt.getUTCMinutes()) + '00Z'; }
  var start = new Date(Date.UTC(D.year, D.month - 1, D.day, D.hour - 9, D.minute));
  var end = new Date(start.getTime() + 2 * 3600 * 1000);
  $('gcal').href = 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' +
    encodeURIComponent(W.groom.name + ' ♥ ' + W.bride.name + ' 결혼식') +
    '&dates=' + utc(start) + '/' + utc(end) +
    '&location=' + encodeURIComponent(W.venue + ' ' + W.hall) +
    '&details=' + encodeURIComponent(location.origin + location.pathname);

  // gallery
  var list = (W.gallery || []).slice();
  if (W.galleryRandom) for (var k = list.length - 1; k > 0; k--) { var j = Math.floor(Math.random() * (k + 1)); var tmp = list[k]; list[k] = list[j]; list[j] = tmp; }
  var pool = ['big', 'big', 'tall', 'tall', 'tall'], pi = 0, cur = 0, grid = $('grid');
  list.forEach(function (f, idx) {
    var b = el('button'); b.setAttribute('aria-label', '사진 ' + (idx + 1) + ' 크게 보기');
    var img = el('img'); img.src = 'photos/gallery/' + f; img.alt = ''; img.loading = 'lazy';
    img.onload = function () {
      if (img.naturalWidth > img.naturalHeight * 1.15) b.className = 'wide';
    };
    if (pi < pool.length && idx % 3 === 0) b.className = pool[pi++];
    b.appendChild(img);
    b.onclick = function () { cur = idx; showLb(); $('lb').hidden = false; };
    grid.appendChild(b);
  });
  function showLb() { $('lbImg').src = 'photos/gallery/' + list[cur]; $('lbImg').alt = '웨딩 사진 ' + (cur + 1); txt('lbNum', (cur + 1) + ' / ' + list.length); }
  $('lbPrev').onclick = function () { cur = (cur + list.length - 1) % list.length; showLb(); };
  $('lbNext').onclick = function () { cur = (cur + 1) % list.length; showLb(); };
  var sx = null;
  $('lb').addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
  $('lb').addEventListener('touchend', function (e) { if (sx === null) return; var dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 40) (dx < 0 ? $('lbNext') : $('lbPrev')).onclick(); sx = null; });
  $('lb').addEventListener('click', function (e) { if (e.target === this) this.hidden = true; });

  // location
  txt('venue', W.venue); txt('hall', W.hall); txt('addrText', W.address); txt('addrSub', W.addressSub);
  var q = encodeURIComponent(W.mapQuery);
  $('map').src = 'https://www.google.com/maps?q=' + q + '&z=16&output=embed';
  $('naverMap').href = 'https://map.naver.com/p/search/' + q;
  $('kakaoMap').href = 'https://map.kakao.com/link/search/' + q;
  (W.route || []).forEach(function (r) { var row = el('div'); row.appendChild(el('b', null, r.title)); row.appendChild(el('span', null, r.text)); $('route').appendChild(row); });

  // info
  if (!W.info || !W.info.length) $('infoSec').hidden = true;
  (W.info || []).forEach(function (r) { var row = el('div'); row.appendChild(el('b', null, r.title)); row.appendChild(el('span', null, r.text)); $('info').appendChild(row); });

  // accounts
  [['신랑측', W.accounts.groom], ['신부측', W.accounts.bride]].forEach(function (g) {
    if (!g[1] || !g[1].length) return;
    var det = el('details'), sum = el('summary', null, g[0] + ' 계좌번호');
    sum.insertAdjacentHTML('beforeend', '<svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 9l6 6 6-6"/></svg>');
    det.appendChild(sum);
    g[1].forEach(function (a) {
      var row = el('div', 'row'), info = el('div');
      info.appendChild(el('small', null, a.label + ' ' + a.name));
      info.appendChild(document.createTextNode(a.bank + ' ' + a.number));
      var btn = el('button', 'mini', '복사');
      btn.onclick = function () { copy(a.bank + ' ' + a.number + ' ' + a.name, '계좌번호를 복사했어요'); };
      row.appendChild(info); row.appendChild(btn); det.appendChild(row);
    });
    $('acc').appendChild(det);
  });

  // rsvp
  if (W.rsvpUrl) { $('rsvpSec').hidden = false; $('rsvpLink').href = W.rsvpUrl; }

  // share + copy
  txt('thanks', W.thanks);
  var tt;
  function toast(m) { var t = $('toast'); t.textContent = m; t.hidden = false; clearTimeout(tt); tt = setTimeout(function () { t.hidden = true; }, 2000); }
  function copy(s, m) {
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(s).then(function () { toast(m); }, function () { fallback(s, m); });
    else fallback(s, m);
  }
  function fallback(s, m) { var ta = el('textarea'); ta.value = s; ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); toast(m); } catch (e) { toast(s); } ta.remove(); }
  var url = location.origin + location.pathname;
  $('copyAddr').onclick = function () { copy(W.address + ' ' + W.venue, '주소를 복사했어요'); };
  $('copyLink').onclick = function () { copy(url, '링크를 복사했어요'); };
  $('shareBtn').onclick = function () {
    if (navigator.share) navigator.share({ title: W.shareTitle, text: W.shareText, url: url }).catch(function () {});
    else copy(url, '링크를 복사했어요. 카카오톡에 붙여넣어 보내주세요');
  };

  // sheets
  document.querySelectorAll('[data-close]').forEach(function (b) { b.onclick = function () { b.closest('.sheet,.lb').hidden = true; }; });
  document.querySelectorAll('.sheet').forEach(function (s) { s.addEventListener('click', function (e) { if (e.target === s) s.hidden = true; }); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') document.querySelectorAll('.sheet,.lb').forEach(function (x) { x.hidden = true; });
    if (!$('lb').hidden && e.key === 'ArrowRight') $('lbNext').onclick();
    if (!$('lb').hidden && e.key === 'ArrowLeft') $('lbPrev').onclick();
  });

  // reveal
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.remove('pre'); io.unobserve(en.target); } }); }, { threshold: .08 });
    document.querySelectorAll('.reveal').forEach(function (s) { if (s.getBoundingClientRect().top > innerHeight) { s.classList.add('pre'); io.observe(s); } });
  }

  // snow
  var cv = $('snow'), ctx = cv.getContext('2d'), flakes = [], on = !matchMedia('(prefers-reduced-motion: reduce)').matches;
  function size() { var r = cv.getBoundingClientRect(); cv.width = r.width * devicePixelRatio; cv.height = r.height * devicePixelRatio; }
  size(); addEventListener('resize', size);
  for (var f = 0; f < 40; f++) flakes.push({ x: Math.random(), y: Math.random(), r: 1 + Math.random() * 2.2, s: .0006 + Math.random() * .0012, w: Math.random() * 6 });
  (function draw() {
    ctx.clearRect(0, 0, cv.width, cv.height);
    if (on) {
      ctx.fillStyle = 'rgba(255,255,255,.85)';
      flakes.forEach(function (p) { p.y += p.s; p.w += .01; if (p.y > 1.02) { p.y = -.02; p.x = Math.random(); }
        ctx.beginPath(); ctx.arc((p.x + Math.sin(p.w) * .01) * cv.width, p.y * cv.height, p.r * devicePixelRatio, 0, 7); ctx.fill(); });
    }
    requestAnimationFrame(draw);
  })();
  $('snowBtn').onclick = function () { on = !on; this.setAttribute('aria-pressed', on); this.setAttribute('aria-label', on ? '눈 내리는 효과 끄기' : '눈 내리는 효과 켜기'); this.style.opacity = on ? 1 : .55; };
})();
