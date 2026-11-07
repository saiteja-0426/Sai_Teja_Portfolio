(function () {
  'use strict';

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ------------------------------------------------------------------
     0. FULL PAGE LOADER + LANDING SEQUENCE (replays on every visit)
     ------------------------------------------------------------------ */
  document.documentElement.classList.add('js-ready');
  var loader = document.getElementById('page-loader');
  var minLoaderMs = reduce ? 0 : 1100;
  var loaderFinished = false;
  var safetyTimer = null;

  function ensureLoader() {
    loader = document.getElementById('page-loader');
    if (!loader) {
      // Re-create loader if it was removed so animation can play again
      loader = document.createElement('div');
      loader.id = 'page-loader';
      loader.setAttribute('aria-hidden', 'true');
      loader.innerHTML =
        '<div class="loader-mark">ST</div>' +
        '<div class="loader-name">Sai Teja Bomma</div>' +
        '<div class="loader-bar"><i></i></div>' +
        '<div class="loader-hint">Loading portfolio</div>';
      document.body.insertBefore(loader, document.body.firstChild);
    }
    // Restart bar animation by re-inserting the inner bar
    var bar = loader.querySelector('.loader-bar');
    if (bar) {
      bar.innerHTML = '<i></i>';
    }
    loader.classList.remove('is-done');
    loader.style.opacity = '';
    loader.style.visibility = '';
    loader.style.pointerEvents = '';
  }

  function startLanding(forceReplay) {
    loaderFinished = false;
    ensureLoader();
    document.body.classList.remove('page-ready');
    document.documentElement.classList.remove('content-in');
    if (!reduce) {
      document.body.classList.add('page-loading');
    }
    // Force reflow so CSS transitions always restart from hidden state
    void document.body.offsetWidth;

    var loaderStart = Date.now();

    function finishLoader() {
      if (loaderFinished) return;
      loaderFinished = true;
      if (safetyTimer) {
        window.clearTimeout(safetyTimer);
        safetyTimer = null;
      }
      var elapsed = Date.now() - loaderStart;
      var wait = Math.max(0, minLoaderMs - elapsed);
      window.setTimeout(function () {
        if (loader) {
          loader.classList.add('is-done');
        }
        document.body.classList.remove('page-loading');
        // Force reflow before revealing so landing transitions fire every time
        void document.body.offsetWidth;
        document.body.classList.add('page-ready');
        document.documentElement.classList.add('content-in');
      }, wait);
    }

    if (!forceReplay && document.readyState === 'complete') {
      finishLoader();
    } else if (!forceReplay) {
      window.addEventListener('load', finishLoader, { once: true });
    } else {
      // Replay path (bfcache / return visit) — finish after min duration
      window.setTimeout(finishLoader, reduce ? 50 : minLoaderMs);
    }
    safetyTimer = window.setTimeout(finishLoader, reduce ? 100 : 3200);
  }

  // First load
  startLanding(false);

  // Replay landing on every back/forward restore (bfcache)
  window.addEventListener('pageshow', function (event) {
    if (event.persisted) {
      startLanding(true);
    }
  });

  /* ------------------------------------------------------------------
     1. ROLE TICKER + TYPING EFFECT IN HERO
     ------------------------------------------------------------------ */
  var kicker = document.querySelector('.hero .kicker');
  if (kicker && !document.querySelector('.hero-roles')) {
    var roles = document.createElement('div');
    roles.className = 'hero-roles';
    roles.setAttribute('aria-live', 'polite');
    roles.innerHTML = '<span>Python &amp; Django</span>';
    kicker.insertAdjacentElement('afterend', roles);
  }

  var roleText = document.querySelector('.hero-roles span');
  if (roleText && !reduce) {
    var roleList = ['Python & Django', 'Full-stack applications', 'Practical AI solutions'];
    var roleIndex = 0;
    window.setInterval(function () {
      roleText.style.opacity = '0';
      roleText.style.transform = 'translateY(6px)';
      window.setTimeout(function () {
        roleIndex = (roleIndex + 1) % roleList.length;
        roleText.textContent = roleList[roleIndex];
        roleText.style.transform = 'translateY(0)';
        roleText.style.opacity = '1';
      }, 220);
    }, 2800);
  }

  // Typing effect on headline removed per request (keep static headline)

  /* ------------------------------------------------------------------
     2. SCROLL PROGRESS + BACK TO TOP
     ------------------------------------------------------------------ */
  var progress = document.createElement('div');
  progress.id = 'scroll-progress';
  progress.setAttribute('aria-hidden', 'true');
  document.body.appendChild(progress);

  var topButton = document.createElement('button');
  topButton.id = 'back-to-top';
  topButton.type = 'button';
  topButton.setAttribute('aria-label', 'Back to top');
  topButton.innerHTML = '↑';
  document.body.appendChild(topButton);
  topButton.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  });

  var ticking = false;
  function updateScrollUI() {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var value = max > 0 ? (window.scrollY / max) * 100 : 0;
    progress.style.width = value + '%';
    topButton.classList.toggle('is-visible', window.scrollY > 520);
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(updateScrollUI);
      ticking = true;
    }
  }, { passive: true });
  updateScrollUI();

  /* ------------------------------------------------------------------
     5. STATS COUNT-UP — removed (no project / internship / certificate counters)
     ------------------------------------------------------------------ */

  /* ------------------------------------------------------------------
     3. SCROLL REVEAL + POP-UP EFFECT ON ALL COMPONENTS
     ------------------------------------------------------------------ */
  var revealTargets = document.querySelectorAll(
    [
      '.hero .intro-copy > *',
      '.hero .blob',
      '#about .about-copy',
      '#about .about-side',
      '#about .about-facts > div',
      '#about .disc',
      '#about .about-label',
      '#about h2',
      '#about .about-copy > p',
      '#about .about-copy > dl',
      '#about .about-copy > .btn',
      '#projects > h2',
      '#projects > .sub',
      '#projects .card',
      '#projects .project-details',
      '#experience > h2',
      '#experience > .sub',
      '#experience .xp article',
      '#skills > .skills-eyebrow',
      '#skills > h2',
      '#skills > .sub',
      '#skills .skill-tile',
      '#skills .skill-chips span',
      '#certificates .skills-eyebrow',
      '#certificates h2',
      '#certificates .sub',
      '#certificates .certificate-card',
      '#notes > .skills-eyebrow',
      '#notes > h2',
      '#notes > .sub',
      '#notes .note',
      '#contact > h2',
      '#contact > .sub',
      '#contact .contact-form',
      '#contact .contact-form .field',
      '#contact .contact-form .submit-btn',
      '#contact .contact-layout > div',
      'footer .inner > *',
      '.btns .btn'
    ].join(', ')
  );

  revealTargets.forEach(function (el) {
    el.setAttribute('data-reveal', '');
    el.classList.add('pop-up');
    var siblings = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
    el.style.setProperty('--reveal-delay', Math.min(siblings * 70, 420) + 'ms');
  });

  // Stronger staggered pop for key groups
  document.querySelectorAll('#about .about-facts > div').forEach(function (fact, i) {
    fact.classList.add('fact-pop');
    fact.style.setProperty('--reveal-delay', (i * 110) + 'ms');
  });

  document.querySelectorAll('#skills .skill-tile').forEach(function (tile, i) {
    tile.classList.add('skill-pop');
    tile.style.setProperty('--reveal-delay', (i * 100) + 'ms');
  });

  document.querySelectorAll('#certificates .certificate-card').forEach(function (card, i) {
    card.classList.add('cert-pop');
    card.style.setProperty('--reveal-delay', (i * 95) + 'ms');
  });

  document.querySelectorAll('#projects .card').forEach(function (card, i) {
    card.classList.add('card-pop');
    card.style.setProperty('--reveal-delay', (i * 120) + 'ms');
  });

  document.querySelectorAll('#experience .xp article').forEach(function (item, i) {
    item.classList.add('xp-pop');
    item.style.setProperty('--reveal-delay', (i * 130) + 'ms');
  });

  document.querySelectorAll('#skills .skill-chips span').forEach(function (chip, i) {
    chip.classList.add('chip-pop');
    chip.style.setProperty('--reveal-delay', (i * 45) + 'ms');
  });

  if ('IntersectionObserver' in window && !reduce) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
    revealTargets.forEach(function (el) { observer.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add('is-revealed'); });
  }

  /* ------------------------------------------------------------------
     4. ACTIVE NAV + SLIDING PILL INDICATOR
     ------------------------------------------------------------------ */
  var nav = document.querySelector('.nav');
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav ul a[href^="#"]'));
  var indicator = document.createElement('span');
  indicator.className = 'nav-indicator';
  indicator.setAttribute('aria-hidden', 'true');
  var navList = document.querySelector('.nav ul');
  if (navList) {
    navList.style.position = 'relative';
    navList.appendChild(indicator);
  }

  function moveIndicator(link) {
    if (!link || !indicator || !navList) return;
    var listRect = navList.getBoundingClientRect();
    var linkRect = link.getBoundingClientRect();
    indicator.style.width = linkRect.width + 'px';
    indicator.style.height = linkRect.height + 'px';
    indicator.style.transform = 'translate(' + (linkRect.left - listRect.left) + 'px, ' + (linkRect.top - listRect.top) + 'px)';
    indicator.classList.add('is-active');
  }

  var observedSections = ['about', 'projects', 'experience', 'skills', 'notes', 'contact']
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);

  if ('IntersectionObserver' in window) {
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (link) {
          var active = link.getAttribute('href') === '#' + entry.target.id;
          link.classList.toggle('is-active', active);
          if (active) {
            link.setAttribute('aria-current', 'location');
            moveIndicator(link);
          } else {
            link.removeAttribute('aria-current');
          }
        });
      });
    }, { rootMargin: '-25% 0px -60% 0px', threshold: 0 });
    observedSections.forEach(function (section) { navObserver.observe(section); });
  }

  // Initial position
  window.addEventListener('load', function () {
    var current = document.querySelector('.nav ul a.is-active') || navLinks[0];
    if (current) moveIndicator(current);
  });
  window.addEventListener('resize', function () {
    var current = document.querySelector('.nav ul a.is-active') || navLinks[0];
    if (current) moveIndicator(current);
  });

  /* ------------------------------------------------------------------
     6. HERO PARALLAX (portrait + blob + chips)
     ------------------------------------------------------------------ */
  if (finePointer && !reduce) {
    var hero = document.querySelector('.hero');
    var portrait = document.querySelector('.hero-portrait-wrap');
    var blob = document.querySelector('.hero .blob');
    var chips = document.querySelectorAll('.hero .chip');

    if (hero) {
      hero.addEventListener('pointermove', function (e) {
        var rect = hero.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        if (portrait) {
          portrait.style.transform = 'translate(' + (x * 12) + 'px, ' + (y * 10) + 'px)';
        }
        if (blob) {
          blob.style.transform = 'translate(' + (x * -18) + 'px, ' + (y * -14) + 'px)';
        }
        chips.forEach(function (chip, i) {
          var factor = (i % 2 === 0 ? 1 : -1) * (8 + i * 3);
          chip.style.transform = 'translate(' + (x * factor) + 'px, ' + (y * factor * 0.7) + 'px)';
        });
      });
      hero.addEventListener('pointerleave', function () {
        if (portrait) portrait.style.transform = '';
        if (blob) blob.style.transform = '';
        chips.forEach(function (chip) { chip.style.transform = ''; });
      });
    }
  }

  /* ------------------------------------------------------------------
     7. MAGNETIC BUTTONS + SHINE
     ------------------------------------------------------------------ */
  if (finePointer && !reduce) {
    document.querySelectorAll('.hero .btn, #contact .submit-btn, #projects .card .btn').forEach(function (button) {
      button.classList.add('btn-shine');
      button.addEventListener('pointermove', function (event) {
        var rect = button.getBoundingClientRect();
        var x = (event.clientX - rect.left - rect.width / 2) * 0.1;
        var y = (event.clientY - rect.top - rect.height / 2) * 0.14;
        button.style.translate = x + 'px ' + y + 'px';
      });
      button.addEventListener('pointerleave', function () {
        button.style.translate = '0 0';
      });
    });
  } else {
    document.querySelectorAll('.hero .btn, #contact .submit-btn, #projects .card .btn').forEach(function (button) {
      button.classList.add('btn-shine');
    });
  }

  /* ------------------------------------------------------------------
     8. EXPERIENCE TIMELINE DRAW
     ------------------------------------------------------------------ */
  document.querySelectorAll('#experience .xp article').forEach(function (article) {
    article.classList.add('timeline-item');
  });
  var xp = document.querySelector('#experience .xp');
  if (xp) {
    xp.classList.add('has-timeline');
    if ('IntersectionObserver' in window) {
      var tlObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            xp.classList.add('timeline-drawn');
            tlObs.disconnect();
          }
        });
      }, { threshold: 0.15 });
      tlObs.observe(xp);
    } else {
      xp.classList.add('timeline-drawn');
    }
  }

  /* ------------------------------------------------------------------
     9. CURSOR AURA (enhanced glow)
     ------------------------------------------------------------------ */
  if (finePointer && !reduce) {
    var aura = document.createElement('div');
    aura.className = 'cursor-aura';
    aura.setAttribute('aria-hidden', 'true');
    document.body.appendChild(aura);
    var mouseX = 0, mouseY = 0, auraX = 0, auraY = 0;
    document.addEventListener('pointermove', function (event) {
      mouseX = event.clientX;
      mouseY = event.clientY;
      aura.classList.add('is-visible');
    }, { passive: true });
    function animateAura() {
      auraX += (mouseX - auraX) * 0.16;
      auraY += (mouseY - auraY) * 0.16;
      aura.style.left = auraX + 'px';
      aura.style.top = auraY + 'px';
      window.requestAnimationFrame(animateAura);
    }
    window.requestAnimationFrame(animateAura);
    document.querySelectorAll('a, button, summary, .card, .skill-tile').forEach(function (el) {
      el.addEventListener('pointerenter', function () { aura.classList.add('is-hover'); });
      el.addEventListener('pointerleave', function () { aura.classList.remove('is-hover'); });
    });
  }

  /* ------------------------------------------------------------------
     10. PROJECT CARD 3D TILT (stronger)
     ------------------------------------------------------------------ */
  if (finePointer && !reduce) {
    document.querySelectorAll('#projects .card').forEach(function (card) {
      card.addEventListener('pointermove', function (event) {
        var rect = card.getBoundingClientRect();
        var px = (event.clientX - rect.left) / rect.width;
        var py = (event.clientY - rect.top) / rect.height;
        var rx = (0.5 - py) * 7;
        var ry = (px - 0.5) * 7;
        card.style.transform = 'perspective(900px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) translateY(-6px) scale(1.01)';
      });
      card.addEventListener('pointerleave', function () {
        card.style.transform = '';
      });
    });
  }

  /* ------------------------------------------------------------------
     NAV MOBILE TOGGLE (keep existing behaviour if script.js handles it)
     ------------------------------------------------------------------ */
})();
