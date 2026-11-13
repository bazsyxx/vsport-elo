(function () {
  var root = document.documentElement;
  var btn = document.getElementById('themeBtn');
  var mobile = matchMedia('(max-width: 700px)');
  var BASE_W = 1280, BASE_H = 800;

  /* theme */
  function sync() { btn.setAttribute('aria-checked', root.dataset.theme === 'light' ? 'true' : 'false'); }
  sync();
  btn.addEventListener('click', function () {
    var next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('vsport-theme', next); } catch (e) {}
    btn.classList.remove('spin'); void btn.offsetWidth; btn.classList.add('spin');
    sync();
  });

  /* frames: loader + phone scaling */
  var frames = [].slice.call(document.querySelectorAll('.frame'));
  frames.forEach(function (frame) {
    var f = frame.querySelector('iframe');
    var done = function () { frame.classList.add('ready'); };
    f.addEventListener('load', done);
    setTimeout(done, 8000);
  });

  function layout() {
    frames.forEach(function (frame) {
      var f = frame.querySelector('iframe');
      var full = document.fullscreenElement === frame;
      if (mobile.matches && !full && frame.clientWidth > 0) {
        var s = frame.clientWidth / BASE_W;
        f.style.width = BASE_W + 'px';
        f.style.height = BASE_H + 'px';
        f.style.transform = 'scale(' + s + ')';
      } else {
        f.style.width = f.style.height = f.style.transform = '';
      }
    });
  }
  if ('ResizeObserver' in window) {
    var ro = new ResizeObserver(layout);
    frames.forEach(function (fr) { ro.observe(fr); });
  }
  window.addEventListener('resize', layout);
  window.addEventListener('orientationchange', layout);
  document.addEventListener('fullscreenchange', layout);
  if (mobile.addEventListener) mobile.addEventListener('change', layout);
  layout();

  /* tabs (phone) */
  var tabs = document.getElementById('tabs');
  var grid = document.getElementById('grid');
  var tabBtns = [].slice.call(tabs.querySelectorAll('[data-tab]'));
  function setTab(i, save) {
    tabs.dataset.active = grid.dataset.active = String(i);
    tabBtns.forEach(function (b) { b.setAttribute('aria-selected', b.dataset.tab === String(i) ? 'true' : 'false'); });
    if (save) { try { localStorage.setItem('vsport-tab', String(i)); } catch (e) {} }
    layout();
    setTimeout(layout, 60);
  }
  tabBtns.forEach(function (b) {
    b.addEventListener('click', function () { setTab(+b.dataset.tab, true); });
  });
  try { var t = localStorage.getItem('vsport-tab'); if (t === '0' || t === '1') setTab(+t, false); } catch (e) {}

  /* fullscreen buttons (where supported) */
  document.querySelectorAll('.fs').forEach(function (b) {
    var frame = b.closest('.panel').querySelector('.frame');
    if (!document.fullscreenEnabled || !frame.requestFullscreen) return;
    b.hidden = false;
    b.addEventListener('click', function () {
      if (document.fullscreenElement) document.exitFullscreen();
      else frame.requestFullscreen().catch(function () {});
    });
  });

  /* popup window */
  document.querySelectorAll('[data-popup]').forEach(function (b) {
    b.addEventListener('click', function () {
      var w = Math.min(1200, screen.availWidth - 80), hgt = Math.min(760, screen.availHeight - 80);
      var win = window.open(b.dataset.popup, 'vsport-popup',
        'popup=yes,noopener,width=' + w + ',height=' + hgt +
        ',left=' + Math.round((screen.availWidth - w) / 2) + ',top=' + Math.round((screen.availHeight - hgt) / 2));
      if (!win) window.open(b.dataset.popup, '_blank', 'noopener');
    });
  });
})();
