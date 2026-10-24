/* Shared behavior: active link, work samples drop-down, lightbox */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    /* ---- Active link ---- */
    var current = window.location.pathname.split('/').pop() || 'index.html';
    if (current === 'index.html') current = 'about.html';
    document.querySelectorAll('.topnav a').forEach(function (a) {
      if (a.getAttribute('href') === current) {
        a.classList.add('active'); a.setAttribute('aria-current', 'page');
        var dd = a.closest('.dropdown');
        if (dd) dd.querySelector('.dropdown-toggle').classList.add('active');
      }
    });

    /* ---- Work samples drop-down ---- */
    var ddBtn = document.querySelector('.dropdown-toggle');
    var ddMenu = ddBtn ? document.getElementById(ddBtn.getAttribute('aria-controls')) : null;
    function setDropdown(open) {
      if (!ddBtn || !ddMenu) return;
      ddBtn.setAttribute('aria-expanded', String(open));
      ddMenu.hidden = !open;
    }
    if (ddBtn) {
      ddBtn.addEventListener('click', function (e) { e.stopPropagation(); setDropdown(ddMenu.hidden); });
      document.addEventListener('click', function (e) { if (!e.target.closest('.dropdown')) setDropdown(false); });
    }

    /* ---- Lightbox (infographics page only) ---- */
    var thumbs = document.querySelectorAll('.thumb');
    var box = null, lastFocus = null;
    function closeBox() {
      if (!box) return;
      box.remove(); box = null;
      if (lastFocus) lastFocus.focus();
    }
    thumbs.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var svg = btn.querySelector('svg');
        if (!svg) return;
        lastFocus = btn;
        box = document.createElement('div');
        box.className = 'lightbox';
        box.setAttribute('role', 'dialog');
        box.setAttribute('aria-modal', 'true');
        box.setAttribute('aria-label', 'Enlarged infographic');
        box.appendChild(svg.cloneNode(true));
        var cap = btn.parentElement.querySelector('figcaption');
        if (cap) { var p = document.createElement('p'); p.textContent = cap.textContent; box.appendChild(p); }
        var x = document.createElement('button');
        x.className = 'lightbox-close'; x.type = 'button'; x.setAttribute('aria-label', 'Close'); x.innerHTML = '&times;';
        box.appendChild(x);
        box.addEventListener('click', closeBox);
        document.body.appendChild(box);
        x.focus();
      });
    });

    /* ---- Escape closes lightbox and menu ---- */
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      closeBox();
      if (ddBtn && !ddMenu.hidden) { setDropdown(false); ddBtn.focus(); }
    });
  });
})();
