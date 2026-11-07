
(function () {
  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (event) {
      event.preventDefault();
      if (!contactForm.reportValidity()) return;
      var data = new FormData(contactForm);
      var name = String(data.get('name') || '').trim();
      var email = String(data.get('email') || '').trim();
      var phone = String(data.get('phone') || '').trim();
      var message = String(data.get('message') || '').trim();
      var subject = 'Portfolio contact from ' + name;
      var body = 'Hello Sai Teja,\n\n' + message + '\n\n' +
        'Name: ' + name + '\nEmail: ' + email + '\nPhone: ' + (phone || 'Not provided');
      var gmailUrl = 'https://mail.google.com/mail/?view=cm&fs=1&to=saitejreddy190@gmail.com&su=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      var note = contactForm.querySelector('.contact-note');
      if (note) note.textContent = 'Opening Gmail… If it does not open, email saitejreddy190@gmail.com directly.';
      // Open Gmail compose directly from the submit gesture. If the browser blocks
      // the new tab, fall back to the user's configured email application.
      var composeLink = document.createElement('a');
      composeLink.href = gmailUrl;
      composeLink.target = '_blank';
      composeLink.rel = 'noopener noreferrer';
      composeLink.style.display = 'none';
      document.body.appendChild(composeLink);
      composeLink.click();
      composeLink.remove();
      // Keep a mailto fallback available if Gmail cannot be opened by the browser.
      if (note) {
        note.textContent = 'Gmail compose should open in a new tab. If it does not, email saitejreddy190@gmail.com directly.';
      }
    });
  }

  // Open an animated, accessible popup when a project overview is selected.
  var activeProjectModal = null;
  function closeProjectModal() {
    if (!activeProjectModal) return;
    var modal = activeProjectModal;
    activeProjectModal = null;
    modal.classList.remove('is-visible');
    document.body.style.overflow = '';
    window.setTimeout(function () { if (modal.parentNode) modal.parentNode.removeChild(modal); }, 320);
  }
  function openProjectModal(trigger) {
    // Avoid duplicate popups when hover and click events occur together.
    if (activeProjectModal) return;
    var details = trigger.closest('.project-details');
    var card = trigger.closest('.card');
    var title = card && card.querySelector('h3') ? card.querySelector('h3').textContent : 'Project overview';
    var source = details.querySelector('.detail-body');
    var backdrop = document.createElement('div');
    backdrop.className = 'project-modal-backdrop';
    backdrop.innerHTML = '<section class="project-modal" role="dialog" aria-modal="true" aria-label="Project overview"><div class="project-modal-top"><div><p class="project-modal-eyebrow">Project overview</p><h3></h3></div><button class="project-modal-close" type="button" aria-label="Close project overview">×</button></div><div class="project-modal-content"></div></section>';
    backdrop.querySelector('.project-modal-top h3').textContent = title;
    backdrop.querySelector('.project-modal-content').appendChild(source.cloneNode(true));
    document.body.appendChild(backdrop);
    document.body.style.overflow = 'hidden';
    activeProjectModal = backdrop;
    requestAnimationFrame(function () { requestAnimationFrame(function () { backdrop.classList.add('is-visible'); }); });
    backdrop.querySelector('.project-modal-close').addEventListener('click', closeProjectModal);
    backdrop.addEventListener('click', function (e) { if (e.target === backdrop) closeProjectModal(); });
  }

  document.querySelectorAll('.project-details summary').forEach(function (trigger) {
    // Open only when the user intentionally clicks or activates the overview control.
    trigger.addEventListener('click', function (event) {
      event.preventDefault();
      openProjectModal(trigger);
    });
  });
  document.addEventListener('keydown', function (event) { if (event.key === 'Escape') closeProjectModal(); });


  var resumeBtn = document.getElementById('resume-preview');
  if (resumeBtn) {
    resumeBtn.addEventListener('click', function () {
      var path = resumeBtn.getAttribute('data-resume') || 'images/saitejresume.pdf';
      var overlay = document.createElement('div');
      overlay.className = 'certificate-modal-backdrop';
      overlay.innerHTML =
        '<section class="certificate-modal resume-modal" role="dialog" aria-modal="true" aria-label="Résumé preview">' +
          '<button class="close-certificate" type="button" aria-label="Close résumé">×</button>' +
          '<div class="certificate-modal-heading">' +
            '<p class="project-modal-eyebrow">RESUME</p>' +
            '<h3>Sai Teja Bomma</h3>' +
            '<p class="certificate-issuer">Advanced App Engineering Associate</p>' +
          '</div>' +
          '<div class="resume-frame"><iframe title="Résumé preview" src="' + path + '"></iframe></div>' +
          '<div class="resume-actions">' +
            '<a class="btn" href="' + path + '" download="saitejresume.pdf">Download résumé</a>' +
          '</div>' +
        '</section>';
      document.body.appendChild(overlay);
      var previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      var close = function () {
        overlay.remove();
        document.body.style.overflow = previousOverflow;
        document.removeEventListener('keydown', onKey);
      };
      var onKey = function (event) { if (event.key === 'Escape') close(); };
      overlay.querySelector('.close-certificate').addEventListener('click', close);
      overlay.addEventListener('click', function (event) { if (event.target === overlay) close(); });
      document.addEventListener('keydown', onKey);
      overlay.querySelector('.close-certificate').focus();
    });
  }

  document.querySelectorAll('.certificate-view').forEach(function (button) {
    button.addEventListener('click', function () {
      var overlay = document.createElement('div');
      overlay.className = 'certificate-modal-backdrop';
      overlay.innerHTML = '<section class="certificate-modal certificate-image-modal" role="dialog" aria-modal="true" aria-label="Certificate image viewer">' +
        '<button class="close-certificate" type="button" aria-label="Close certificate">×</button>' +
        '<div class="certificate-modal-heading"><p class="project-modal-eyebrow">CERTIFICATE</p><h3></h3><p class="certificate-issuer"></p></div>' +
        '<div class="certificate-image-frame"><img class="certificate-preview" alt="Certificate image"><p class="certificate-image-fallback" role="status">Certificate image not added yet. Add the image file at the path shown in the button\'s data-image attribute.</p></div>' +
        '</section>';
      overlay.querySelector('h3').textContent = button.dataset.certificate || 'Certificate';
      overlay.querySelector('.certificate-issuer').textContent = 'Issued by ' + (button.dataset.issuer || '—');
      var image = overlay.querySelector('.certificate-preview');
      var fallback = overlay.querySelector('.certificate-image-fallback');
      var imagePath = button.dataset.image;
      if (imagePath) {
        image.onload = function () { image.classList.add('is-loaded'); fallback.hidden = true; };
        image.onerror = function () { image.hidden = true; fallback.hidden = false; fallback.textContent = 'Image not found. Add your certificate image here: ' + imagePath; };
        image.src = imagePath;
      } else {
        image.hidden = true;
        fallback.hidden = false;
      }
      document.body.appendChild(overlay);
      var previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      var close = function () {
        overlay.remove();
        document.body.style.overflow = previousOverflow;
        document.removeEventListener('keydown', onKey);
      };
      var onKey = function (event) { if (event.key === 'Escape') close(); };
      overlay.querySelector('.close-certificate').addEventListener('click', close);
      overlay.addEventListener('click', function (event) { if (event.target === overlay) close(); });
      document.addEventListener('keydown', onKey);
      overlay.querySelector('.close-certificate').focus();
    });
  });

  document.querySelectorAll('[data-copy]').forEach(function (b) {
    b.addEventListener('click', function () {
      var text = b.getAttribute('data-copy');
      var reset = function (msg) { b.textContent = msg; setTimeout(function () { b.textContent = 'Copy'; }, 1500); };
      var fallback = function () {
        var el = b.previousElementSibling;
        var r = document.createRange(); r.selectNodeContents(el);
        var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
        reset('Selected');
      };
      try { navigator.clipboard.writeText(text).then(function () { reset('Copied'); }, fallback); }
      catch (e) { fallback(); }
    });
  });
})();




// Responsive navigation and profile image fallback
(function(){
  var nav=document.querySelector('.nav');
  var toggle=document.querySelector('.nav-toggle');
  if(nav && toggle){
    toggle.addEventListener('click',function(){
      var open=nav.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded',String(open));
      toggle.setAttribute('aria-label',open?'Close navigation':'Open navigation');
      toggle.textContent=open?'✕':'☰';
    });
    nav.querySelectorAll('a[href^="#"]').forEach(function(link){
      link.addEventListener('click',function(){
        nav.classList.remove('nav-open');
        toggle.setAttribute('aria-expanded','false');
        toggle.setAttribute('aria-label','Open navigation');
        toggle.textContent='☰';
      });
    });
  }
  var portrait=document.querySelector('.hero-portrait');
  if(portrait){ portrait.addEventListener('error',function(){portrait.style.display='none';}); }
})();
