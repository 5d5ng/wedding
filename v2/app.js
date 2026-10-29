/* 화면을 그리는 코드예요. 문구·사진은 content.js 에서 고치면 돼요. */
(function () {
  var W = window.WEDDING, P = W.photoBase || 'photos/';
  var $ = function (id) { return document.getElementById(id); };
  function txt(id, s) { var e = $(id); if (e) e.textContent = s || ''; }
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function p2(n) { return (n < 10 ? '0' : '') + n; }
  var D = W.date, WEDDING = new Date(D.year, D.month - 1, D.day, D.hour, D.minute, 0);
  var url = W.shareUrl || (location.origin + location.pathname);

  // toast + copy
  var tt;
  function toast(m) { var t = $('toast'); t.textContent = m; t.hidden = false; clearTimeout(tt); tt = setTimeout(function () { t.hidden = true; }, 2000); }
  function copy(s, m) {
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(s).then(function () { toast(m); }, function () { fb(s, m); });
    else fb(s, m);
  }
  function fb(s, m) { var ta = el('textarea'); ta.value = s; ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); toast(m); } catch (e) { toast(s); } ta.remove(); }

  // cover
  $('coverImg').src = P + W.coverPhoto;
  txt('coverScript', W.coverScript);

  // date band — letters appear one by one when scrolled into view
  txt('names', W.names); txt('inviteLine', W.inviteLine);
  var de = $('dateEn'); de.setAttribute('aria-label', W.dateEn);
  W.dateEn.split('').forEach(function (ch, i) { var s = el('span', null, ch === ' ' ? ' ' : ch); s.style.transitionDelay = (i * 45) + 'ms'; s.setAttribute('aria-hidden', 'true'); de.appendChild(s); });
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var io0 = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { de.classList.add('on'); io0.disconnect(); } }); }, { threshold: .4 });
    io0.observe(de);
  } else de.classList.add('on');

  // greeting
  if (W.quote) { $('quote').hidden = false; txt('quote', W.quote); }
  txt('greeting', W.greeting);
  txt('sign', '신랑 ' + W.groom.name + ' · 신부 ' + W.bride.name);
  if (W.midPhoto) $('midPhoto').src = P + W.midPhoto; else $('midPhoto').hidden = true;

  // family
  function par(p) { return [p.father, p.mother].filter(Boolean).join(' · '); }
  txt('gParents', par(W.groom)); txt('gRel', W.groom.relation); txt('gName', W.groom.name);
  txt('bParents', par(W.bride)); txt('bRel', W.bride.relation); txt('bName', W.bride.name);
  var contacts = [
    { role: '신랑', name: W.groom.name, phone: W.groom.phone },
    { role: '신랑 혼주', name: par(W.groom), phone: W.groomParentsPhone },
    { role: '신부', name: W.bride.name, phone: W.bride.phone },
    { role: '신부 혼주', name: par(W.bride), phone: W.brideParentsPhone }
  ].filter(function (c) { return c.phone; });
  if (contacts.length) {
    $('contactBtn').hidden = false;
    contacts.forEach(function (c) {
      var r = el('div', 'crow'), i = el('div'); i.appendChild(el('small', null, c.role)); i.appendChild(document.createTextNode(c.name));
      var t = c.phone.replace(/[^0-9]/g, ''), a = el('a', null, '전화'), b = el('a', null, '문자'); a.href = 'tel:' + t; b.href = 'sms:' + t;
      r.appendChild(i); r.appendChild(a); r.appendChild(b); $('contactList').appendChild(r);
    });
    $('contactBtn').onclick = function () { $('contact').hidden = false; };
  }
  [['GROOM', '신랑', W.groom], ['BRIDE', '신부', W.bride]].forEach(function (x) {
    var p = x[2]; if (!p.photo) return;
    var b = el('div', 'prof'), im = el('img'); im.src = P + p.photo; im.alt = x[1] + ' ' + p.name; im.loading = 'lazy';
    b.appendChild(im); b.appendChild(el('div', 'role', x[0])); b.appendChild(el('div', 'nm', p.name));
    if (p.tags && p.tags.length) b.appendChild(el('div', 'tags', p.tags.join(' ')));
    if (p.intro) b.appendChild(el('p', 'pre', p.intro));
    $('profiles').appendChild(b);
  });

  // day
  txt('dateKo', W.dateKo); txt('ddNames', W.groom.name + ' ♥ ' + W.bride.name);
  var cal = $('cal');
  ['일', '월', '화', '수', '목', '금', '토'].forEach(function (d, i) { cal.appendChild(el('div', 'h' + (i === 0 ? ' sun' : ''), d)); });
  var first = new Date(D.year, D.month - 1, 1).getDay(), last = new Date(D.year, D.month, 0).getDate();
  for (var i = 0; i < first; i++) cal.appendChild(el('div', 'd'));
  for (var d = 1; d <= last; d++) {
    if (d === D.day) { var c = el('div', 'd on'); c.appendChild(el('span', null, String(d))); cal.appendChild(c); }
    else cal.appendChild(el('div', 'd' + ((first + d - 1) % 7 === 0 ? ' sun' : ''), String(d)));
  }
  function tick() {
    var s = Math.floor(Math.max(0, WEDDING - new Date()) / 1000);
    txt('cD', String(Math.floor(s / 86400))); txt('cH', p2(Math.floor(s % 86400 / 3600))); txt('cM', p2(Math.floor(s % 3600 / 60))); txt('cS', p2(s % 60));
    var t = new Date(); t.setHours(0, 0, 0, 0); var left = Math.round((new Date(D.year, D.month - 1, D.day) - t) / 86400000);
    txt('dd', left > 0 ? left + '일' : '오늘');
  }
  tick(); setInterval(tick, 1000);
  function utc(dt) { return dt.getUTCFullYear() + p2(dt.getUTCMonth() + 1) + p2(dt.getUTCDate()) + 'T' + p2(dt.getUTCHours()) + p2(dt.getUTCMinutes()) + '00Z'; }
  var st = new Date(Date.UTC(D.year, D.month - 1, D.day, D.hour - 9, D.minute)), en = new Date(st.getTime() + 7200000);
  $('gcal').href = 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' + encodeURIComponent(W.groom.name + ' ♥ ' + W.bride.name + ' 결혼식') + '&dates=' + utc(st) + '/' + utc(en) + '&location=' + encodeURIComponent(W.venue + ' ' + W.hall) + '&details=' + encodeURIComponent(url);

  // location
  txt('venue', W.venue); txt('hall', W.hall); txt('addrText', W.address);
  $('copyAddr').onclick = function () { copy(W.address + ' ' + W.venue, '주소를 복사했어요'); };
  $('map').src = 'https://www.google.com/maps?q=' + encodeURIComponent(W.mapQuery) + '&z=16&output=embed';
  $('naverMap').href = 'https://map.naver.com/p/search/' + encodeURIComponent(W.naverQuery || W.mapQuery);
  $('kakaoMap').href = W.kakaoPlaceUrl || ('https://map.kakao.com/link/search/' + encodeURIComponent(W.mapQuery));
  var ICON = {
    subway: '<rect x="5" y="3" width="14" height="14" rx="3"/><path d="M5 11h14M8 21l2-4M16 21l-2-4"/><circle cx="9" cy="14" r=".8"/><circle cx="15" cy="14" r=".8"/>',
    bus: '<rect x="4" y="3" width="16" height="15" rx="3"/><path d="M4 11h16M7 21v-3M17 21v-3"/><circle cx="8" cy="15" r=".8"/><circle cx="16" cy="15" r=".8"/>',
    car: '<path d="M5 16V11l2-5h10l2 5v5"/><path d="M4 16h16v3H4z"/><circle cx="8" cy="13" r=".8"/><circle cx="16" cy="13" r=".8"/>',
    shuttle: '<rect x="3" y="5" width="18" height="11" rx="3"/><path d="M3 10h18M7 19v-3M17 19v-3"/>',
    phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>'
  };
  (W.route || []).forEach(function (r) {
    var it = el('div', 'item'), t = el('div', 't');
    t.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">' + (ICON[r.icon] || '') + '</svg>';
    t.appendChild(document.createTextNode(r.title));
    it.appendChild(t); it.appendChild(el('div', 'x', r.text)); $('route').appendChild(it);
  });

  // info cards
  var info = W.info || [], ci = 0;
  if (!info.length) $('infoSec').hidden = true;
  info.forEach(function (c) { var w = el('div', 'card'), i = el('div', 'in'); i.appendChild(el('h3', null, c.title)); i.appendChild(el('p', null, c.text)); w.appendChild(i); $('track').appendChild(w); });
  function showCard() { $('track').style.transform = 'translateX(' + (-ci * 100) + '%)'; txt('cardNum', (ci + 1) + ' / ' + info.length); }
  $('prevCard').onclick = function () { ci = (ci + info.length - 1) % info.length; showCard(); };
  $('nextCard').onclick = function () { ci = (ci + 1) % info.length; showCard(); };
  var cx = null;
  $('track').addEventListener('touchstart', function (e) { cx = e.touches[0].clientX; }, { passive: true });
  $('track').addEventListener('touchend', function (e) { if (cx === null) return; var dx = e.changedTouches[0].clientX - cx; if (Math.abs(dx) > 40) (dx < 0 ? $('nextCard') : $('prevCard')).onclick(); cx = null; });
  if (info.length) showCard();
  if (info.length < 2) { $('prevCard').style.visibility = 'hidden'; $('nextCard').style.visibility = 'hidden'; }

  // gallery
  var list = (W.gallery || []).slice(), cur = 0, firstN = W.galleryFirst || 9;
  if (W.galleryRandom) for (var k = list.length - 1; k > 0; k--) { var j = Math.floor(Math.random() * (k + 1)); var tmp = list[k]; list[k] = list[j]; list[j] = tmp; }
  list.forEach(function (f, idx) {
    var b = el('button'); b.setAttribute('aria-label', '사진 ' + (idx + 1) + ' 크게 보기'); if (idx >= firstN) b.hidden = true;
    var im = el('img'); im.src = P + 'gallery/' + f; im.alt = ''; im.loading = 'lazy'; b.appendChild(im);
    b.onclick = function () { cur = idx; showLb(); $('lb').hidden = false; };
    $('grid').appendChild(b);
  });
  if (list.length <= firstN) $('moreBtn').hidden = true;
  $('moreBtn').onclick = function () { [].forEach.call($('grid').children, function (b) { b.hidden = false; }); this.hidden = true; };
  function showLb() { $('lbImg').src = P + 'gallery/' + list[cur]; $('lbImg').alt = '웨딩 사진 ' + (cur + 1); txt('lbNum', (cur + 1) + ' / ' + list.length); }
  $('lbPrev').onclick = function () { cur = (cur + list.length - 1) % list.length; showLb(); };
  $('lbNext').onclick = function () { cur = (cur + 1) % list.length; showLb(); };
  var sx = null;
  $('lb').addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
  $('lb').addEventListener('touchend', function (e) { if (sx === null) return; var dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 40) (dx < 0 ? $('lbNext') : $('lbPrev')).onclick(); sx = null; });
  $('lb').addEventListener('click', function (e) { if (e.target === this) this.hidden = true; });

  // accounts
  [['신랑측에게', W.accounts.groom], ['신부측에게', W.accounts.bride]].forEach(function (g) {
    if (!g[1] || !g[1].length) return;
    var det = el('details'), sum = el('summary', null, g[0]);
    sum.insertAdjacentHTML('beforeend', '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>');
    det.appendChild(sum);
    g[1].forEach(function (a) {
      var r = el('div', 'row'), i = el('div'); i.appendChild(el('small', null, a.label + ' ' + a.name)); i.appendChild(document.createTextNode(a.bank + ' ' + a.number));
      var b = el('button', 'mini', '복사'); b.onclick = function () { copy(a.bank + ' ' + a.number + ' ' + a.name, '계좌번호를 복사했어요'); };
      r.appendChild(i); r.appendChild(b); det.appendChild(r);
    });
    $('acc').appendChild(det);
  });
  if (W.rsvpUrl) { $('rsvpSec').hidden = false; $('rsvpLink').href = W.rsvpUrl; }

  // thanks + share
  txt('thanks', W.thanks);
  $('copyLink').onclick = function () { copy(url, '청첩장 주소를 복사했어요'); };
  var kakaoReady = false;
  if (W.kakaoJsKey) {
    var s = document.createElement('script'); s.src = 'https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js'; s.crossOrigin = 'anonymous';
    s.onload = function () { try { if (!Kakao.isInitialized()) Kakao.init(W.kakaoJsKey); kakaoReady = true; } catch (e) {} };
    document.head.appendChild(s);
  }
  $('kakaoBtn').onclick = function () {
    if (kakaoReady) {
      Kakao.Share.sendDefault({
        objectType: 'feed',
        content: { title: W.shareTitle, description: W.shareText, imageUrl: W.shareImage, link: { mobileWebUrl: url, webUrl: url } },
        buttons: [{ title: '모바일 청첩장 보기', link: { mobileWebUrl: url, webUrl: url } }]
      });
    } else if (navigator.share) {
      navigator.share({ title: W.shareTitle, text: W.shareText, url: url }).catch(function () {});
    } else copy(url, '주소를 복사했어요. 카카오톡에 붙여넣어 보내주세요');
  };

  // sheets
  document.querySelectorAll('[data-close]').forEach(function (b) { b.onclick = function () { b.closest('.sheet,.lb').hidden = true; }; });
  document.querySelectorAll('.sheet').forEach(function (s) { s.addEventListener('click', function (e) { if (e.target === s) s.hidden = true; }); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') document.querySelectorAll('.sheet,.lb').forEach(function (x) { x.hidden = true; });
    if (!$('lb').hidden && e.key === 'ArrowRight') $('lbNext').onclick();
    if (!$('lb').hidden && e.key === 'ArrowLeft') $('lbPrev').onclick();
  });

  // fade-in on scroll (only sections below the first screen)
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.remove('pre-in'); io.unobserve(e.target); } }); }, { threshold: .08 });
    document.querySelectorAll('.fade').forEach(function (s) { if (s.getBoundingClientRect().top > innerHeight) { s.classList.add('pre-in'); io.observe(s); } });
  }

  // gentle falling petals on the cover
  var cv = $('petals'), ctx = cv.getContext('2d'), on = !matchMedia('(prefers-reduced-motion: reduce)').matches, ps = [];
  function size() { var r = cv.getBoundingClientRect(); cv.width = r.width * devicePixelRatio; cv.height = r.height * devicePixelRatio; }
  size(); addEventListener('resize', size);
  for (var f = 0; f < 26; f++) ps.push({ x: Math.random(), y: Math.random(), r: 2 + Math.random() * 3, s: .0007 + Math.random() * .001, w: Math.random() * 6, a: Math.random() * 6 });
  (function draw() {
    if (!on) return;
    ctx.clearRect(0, 0, cv.width, cv.height);
    ps.forEach(function (p) {
      p.y += p.s; p.w += .012; p.a += .02; if (p.y > 1.03) { p.y = -.03; p.x = Math.random(); }
      var x = (p.x + Math.sin(p.w) * .02) * cv.width, y = p.y * cv.height, r = p.r * devicePixelRatio;
      ctx.save(); ctx.translate(x, y); ctx.rotate(p.a); ctx.fillStyle = 'rgba(255,255,255,.85)';
      ctx.beginPath(); ctx.ellipse(0, 0, r, r * .6, 0, 0, 7); ctx.fill(); ctx.restore();
    });
    requestAnimationFrame(draw);
  })();
})();
