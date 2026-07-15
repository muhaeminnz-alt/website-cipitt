/* ============================================================
   TATA — 5 Section Interactions
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
   /* ---------- LOADING SCREEN ---------- */
  const loadingScreen = document.getElementById('loadingScreen');
  const loaderProgress = document.getElementById('loaderProgress');

  let progress = 0;
  const loaderInterval = setInterval(() => {
    progress += Math.random() * 18;
    if (progress >= 100) {
      progress = 100;
      clearInterval(loaderInterval);
      setTimeout(() => {
        loadingScreen.style.opacity = '0';
        loadingScreen.style.pointerEvents = 'none';
        setTimeout(() => {
          loadingScreen.style.display = 'none';
          document.body.style.overflow = 'auto';
          initTypingEffect();
          initScrollReveal();
          initCounters();
        }, 500);
      }, 300);
    }
    loaderProgress.style.width = progress + '%';
  }, 150);

  loadingScreen.style.transition = 'opacity 0.5s ease';
  document.body.style.overflow = 'hidden';
  initScrollReveal();
  initSimulation();
  initDashboardCharts();
});
/* ---------- MOUSE GLOW ---------- */
  const mouseGlow = document.getElementById('mouseGlow');
  if (mouseGlow) {
    document.addEventListener('mousemove', (e) => {
      mouseGlow.style.left = e.clientX + 'px';
      mouseGlow.style.top = e.clientY + 'px';
    });

    document.addEventListener('mouseleave', () => {
      mouseGlow.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
      mouseGlow.style.opacity = '1';
    });
  }

/* ---------- NAVBAR SCROLL ---------- */
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveNavLink();
  });

  function updateActiveNavLink() {
    let currentSection = '';
    const scrollPos = window.scrollY + 140;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      const href = link.getAttribute('href').substring(1);
      if (href === currentSection) {
        link.classList.add('active');
      }
    });
  }
/* ---------- SCROLL REVEAL ---------- */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-up');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('revealed'), i * 60);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -80px 0px' }
  );

  revealElements.forEach((el) => observer.observe(el));
}
/* ---------- SMOOTH SCROLL FOR ANCHOR LINKS ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId.length > 1) {
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          const offset = 90;
          const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        }
      }
    });
  });
 /* ---------- RIPPLE BUTTON EFFECT ---------- */
  document.querySelectorAll('.ripple').forEach((btn) => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.position = 'absolute';
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      ripple.style.borderRadius = '50%';
      ripple.style.background = 'rgba(255, 255, 255, 0.5)';
      ripple.style.transform = 'scale(0)';
      ripple.style.animation = 'rippleEffect 0.6s ease-out';
      ripple.style.pointerEvents = 'none';

      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);

      setTimeout(() => ripple.remove(), 600);
    });
  });
/* ============================================================
   COUNTER ANIMATION
   ============================================================ */
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );

  counters.forEach((counter) => counterObserver.observe(counter));
}

function animateCounter(el) {
  const target = parseFloat(el.getAttribute('data-count'));
  const suffix = el.getAttribute('data-suffix') || '';
  const isDecimal = target % 1 !== 0;
  const duration = 1600;
  const startTime = performance.now();

  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = target * eased;

    el.textContent = (isDecimal ? current.toFixed(1) : Math.floor(current)) + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = (isDecimal ? target.toFixed(1) : target) + suffix;
    }
  }

  requestAnimationFrame(update);
}
/* ---------- SIMULATION (Eye Tracking + TTS) ---------- */
function initSimulation() {
  const symbolCards = document.querySelectorAll('.symbol-card');
  const avatar = document.getElementById('avatar');
  const speechText = document.getElementById('speechText');
  const speakerIcon = document.getElementById('speakerIcon');

  if (!symbolCards.length) return;

  const HOVER_DURATION = 1000;
  let hoverTimer = null;
  let activeCard = null;

  symbolCards.forEach((card) => {
    card.addEventListener('mouseenter', () => startSelecting(card));
    card.addEventListener('mouseleave', () => cancelSelecting(card));

    card.addEventListener('touchstart', (e) => {
      e.preventDefault();
      startSelecting(card);
    }, { passive: false });

    card.addEventListener('touchend', () => cancelSelecting(card));
  });

  function startSelecting(card) {
    if (activeCard === card) return;
    symbolCards.forEach((c) => c.classList.remove('selecting'));
    activeCard = card;
    card.classList.add('selecting');

    hoverTimer = setTimeout(() => selectSymbol(card), HOVER_DURATION);
  }

  function cancelSelecting(card) {
    if (activeCard === card) {
      clearTimeout(hoverTimer);
      card.classList.remove('selecting');
      activeCard = null;
    }
  }

  function selectSymbol(card) {
    const text = card.getAttribute('data-text');

    symbolCards.forEach((c) => c.classList.remove('selecting', 'selected'));
    card.classList.add('selected');

    avatar.classList.add('happy');
    speechText.textContent = text;
    speakerIcon.classList.add('speaking');

    speak(text, speakerIcon);

    setTimeout(() => {
      card.classList.remove('selected');
      avatar.classList.remove('happy');
      activeCard = null;
    }, 2200);
  }

  function speak(text, iconEl) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'id-ID';
    utterance.rate = 0.95;
    utterance.pitch = 1.1;

    utterance.onend = () => iconEl.classList.remove('speaking');
    window.speechSynthesis.speak(utterance);
  }
}

/* ---------- DASHBOARD CHARTS ---------- */
function initDashboardCharts() {
  const weeklyCanvas = document.getElementById('weeklyChart');
  const symbolCanvas = document.getElementById('symbolChart');

  if (!weeklyCanvas || !symbolCanvas || typeof Chart === 'undefined') return;

  const gridColor = 'rgba(100, 116, 139, 0.1)';
  const textColor = '#64748B';

  new Chart(weeklyCanvas, {
    type: 'line',
    data: {
      labels: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'],
      datasets: [{
        label: 'Komunikasi',
        data: [12, 18, 15, 22, 20, 28, 25],
        borderColor: '#2563EB',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#2563EB',
        pointRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false }, ticks: { color: textColor } },
        y: { grid: { color: gridColor }, ticks: { color: textColor }, beginAtZero: true }
      }
    }
  });

  new Chart(symbolCanvas, {
    type: 'doughnut',
    data: {
      labels: ['Makan', 'Minum', 'Toilet', 'Bermain', 'Tidur', 'Sayang'],
      datasets: [{
        data: [22, 30, 15, 18, 8, 7],
        backgroundColor: ['#2563EB', '#06B6D4', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444'],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { color: textColor, padding: 16, font: { size: 11 } }
        }
      }
    }
  });
}
