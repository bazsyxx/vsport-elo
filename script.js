(function () {
  var root = document.documentElement;
  var btn = document.getElementById('themeBtn');

  function sync() {
    btn.setAttribute('aria-checked', root.dataset.theme === 'light' ? 'true' : 'false');
  }
  sync();

  btn.addEventListener('click', function () {
    var next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('vsport-theme', next); } catch (e) {}
    btn.classList.remove('spin');
    void btn.offsetWidth;
    btn.classList.add('spin');
    sync();
  });

  document.querySelectorAll('.frame').forEach(function (frame) {
    var f = frame.querySelector('iframe');
    var done = function () { frame.classList.add('ready'); };
    f.addEventListener('load', done);
    setTimeout(done, 8000);
  });
  document.querySelectorAll('[data-popup]').forEach(function (b) {
    b.addEventListener('click', function () {
      var w = Math.min(1200, screen.availWidth - 80), hgt = Math.min(760, screen.availHeight - 80);
      window.open(b.dataset.popup, 'vsport-popup',
        'popup=yes,noopener,width=' + w + ',height=' + hgt +
        ',left=' + Math.round((screen.availWidth - w) / 2) + ',top=' + Math.round((screen.availHeight - hgt) / 2));
    });
  });
})();
