// MysteryTrace Blog Articles - JavaScript

// ===== MONETAG MULTITAG — AUTO INJECT =====
// Injects Monetag's official script into every blog page automatically
// No need to edit 16 HTML files — this handles all of them
(function() {
  const s = document.createElement('script');
  s.src = 'https://quge5.com/88/tag.min.js';
  s.setAttribute('data-zone', '217224');
  s.setAttribute('data-cfasync', 'false');
  s.async = true;
  document.head.appendChild(s);
})();

// ===== MONETAG VIGNETTE BANNER — AUTO INJECT =====
(function(s){
  s.dataset.zone = '10706013';
  s.src = 'https://gizokraijaw.net/vignette.min.js';
})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')));

// ===== DOM READY =====
document.addEventListener('DOMContentLoaded', function () {

  // ===== READING PROGRESS BAR =====
  const progressBar = document.createElement('div');
  progressBar.style.cssText = 'position:fixed;top:0;left:0;width:0;height:3px;background:linear-gradient(90deg,#c0392b,#e74c3c);z-index:9999;transition:width 0.1s;pointer-events:none;';
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    progressBar.style.width = scrolled + '%';
  });

  // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ===== LAZY LOAD IMAGES =====
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            observer.unobserve(img);
          }
        }
      });
    });
    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }

  // ===== RELATED POST CARDS =====
  document.querySelectorAll('.related-card[data-post-url]').forEach(card => {
    card.addEventListener('click', function (e) {
      e.preventDefault();
      window.location.href = this.getAttribute('data-post-url');
    });
  });

  // ===== SOURCE LINKS =====
  document.querySelectorAll('.source-link').forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      window.open(this.href, '_blank');
    });
  });

});
