document.addEventListener('DOMContentLoaded', () => {
  // === 1. SYSTEM INITIALIZATIONS ===
  initTheme();
  initDirection();
  initStickyHeader();
  initActiveMenuLink();
  initScrollAnimations();
  initCounters();
  initPortfolioFilter();
  initPricingToggle();
  initPasswordToggle();
  initForms();
  initCountdown();
  initEnergyCanvas();
  initScrollTop();
  initMobileMenu();
});

// === 2. THEME SYSTEM (Light / Dark) ===
function initTheme() {
  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  const savedTheme = localStorage.getItem('theme') || 'light';
  
  // Set initial theme
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeUI(savedTheme);

  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateThemeUI(newTheme);
    });
  });
}

function updateThemeUI(theme) {
  const icons = document.querySelectorAll('.theme-icon');
  icons.forEach(icon => {
    if (theme === 'dark') {
      icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`; // Sun Icon
    } else {
      icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`; // Moon Icon
    }
  });
}

// === 3. DIRECTION SYSTEM (LTR / RTL) ===
function initDirection() {
  const dirToggleBtns = document.querySelectorAll('.rtl-toggle-btn');
  const savedDir = localStorage.getItem('dir') || 'ltr';

  document.documentElement.setAttribute('dir', savedDir);
  document.documentElement.setAttribute('lang', savedDir === 'rtl' ? 'ar' : 'en');
  updateDirUI(savedDir);

  dirToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentDir = document.documentElement.getAttribute('dir');
      const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';

      document.documentElement.setAttribute('dir', newDir);
      document.documentElement.setAttribute('lang', newDir === 'rtl' ? 'ar' : 'en');
      localStorage.setItem('dir', newDir);
      updateDirUI(newDir);
      
      // Reload is sometimes required for RTL/LTR changes on strict layouts
      // But we dynamically adjust layouts via style.css / rtl.css variables!
    });
  });
}

function updateDirUI(dir) {
  const textElements = document.querySelectorAll('.rtl-toggle-text');
  textElements.forEach(el => {
    el.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
  });
}

// === 4. STICKY NAVBAR SCROLL ACTION ===
function initStickyHeader() {
  const header = document.querySelector('.navbar-custom');
  if (!header) return;

  const checkScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', checkScroll);
  checkScroll(); // Trigger initial state check
}

// === 5. ACTIVE MENU LINK HIGHLIGHT ===
function initActiveMenuLink() {
  const path = window.location.pathname;
  const page = path.split("/").pop() || 'index.html';
  
  const navLinks = document.querySelectorAll('.nav-link-custom');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    
    // Parent Home toggle should be active on either homepage (Home 1 or Home 2)
    const isHomeParent = (href === '#' && (page === 'index.html' || page === 'home-2.html' || page === ''));
    
    if (href === page || isHomeParent || (page === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// === 6. REVEAL-ON-SCROLL ANIMATIONS ===
function initScrollAnimations() {
  const animatedEls = document.querySelectorAll('.reveal-fade-up');
  if (animatedEls.length === 0) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Stop observing once animated
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animatedEls.forEach(el => {
    observer.observe(el);
  });
}

// === 7. STATISTICS COUNTERS ===
function initCounters() {
  const counters = document.querySelectorAll('.metric-number');
  if (counters.length === 0) return;

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseFloat(counter.getAttribute('data-target'));
        const isPercentage = counter.getAttribute('data-suffix') || '';
        let current = 0;
        const duration = 1500; // ms
        const stepTime = 15; // ms
        const step = target / (duration / stepTime);

        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            counter.textContent = target + isPercentage;
            clearInterval(timer);
          } else {
            // Check if floating point needed
            if (target % 1 === 0) {
              counter.textContent = Math.floor(current) + isPercentage;
            } else {
              counter.textContent = current.toFixed(1) + isPercentage;
            }
          }
        }, stepTime);

        observer.unobserve(counter);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

// === 8. PORTFOLIO FILTER ===
function initPortfolioFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.case-study-card-wrapper');
  
  if (filterBtns.length === 0 || cards.length === 0) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle button active status
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      cards.forEach(card => {
        const category = card.getAttribute('data-category');
        
        // Custom transitions
        card.style.opacity = '0';
        card.style.transform = 'scale(0.85) translateY(15px)';
        
        setTimeout(() => {
          if (filterValue === 'all' || category === filterValue) {
            card.style.display = 'block';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'scale(1) translateY(0)';
            }, 50);
          } else {
            card.style.display = 'none';
          }
        }, 300);
      });
    });
  });
}

// === 9. PRICING TIMEFRAME TOGGLE ===
function initPricingToggle() {
  const toggleInput = document.querySelector('#billingToggle');
  const priceValues = document.querySelectorAll('.price-val');
  const billingLabels = document.querySelectorAll('.price-schedule');

  if (!toggleInput || priceValues.length === 0) return;

  toggleInput.addEventListener('change', () => {
    const isAnnual = toggleInput.checked;

    priceValues.forEach(val => {
      const monthlyPrice = parseInt(val.getAttribute('data-monthly'));
      const annualPrice = parseInt(val.getAttribute('data-annual'));

      if (isAnnual) {
        animateValue(val, monthlyPrice, annualPrice, 400);
      } else {
        animateValue(val, annualPrice, monthlyPrice, 400);
      }
    });

    billingLabels.forEach(label => {
      label.textContent = isAnnual ? '/ yr' : '/ mo';
    });
  });
}

function animateValue(obj, start, end, duration) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    obj.innerHTML = Math.floor(progress * (end - start) + start);
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

// === 10. AUTH PASSWORD EYE TOGGLE ===
function initPasswordToggle() {
  const toggleButtons = document.querySelectorAll('.password-toggle-btn');
  toggleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const wrapper = btn.closest('.password-toggle-wrapper');
      const input = wrapper.querySelector('input');
      
      if (input.type === 'password') {
        input.type = 'text';
        btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`; // Crossed Eye
      } else {
        input.type = 'password';
        btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`; // Normal Eye
      }
    });
  });
}

// === 11. CUSTOM PREMIUM FORM SUBMISSION ===
function initForms() {
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    // Avoid interfering with auth redirect links, but handle inquiries beautifully
    if (form.classList.contains('no-ajax')) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = form.querySelector('[type="submit"]');
      const originalContent = submitBtn.innerHTML;
      
      // Loading State
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Processing...`;
      
      // Simulate API call
      setTimeout(() => {
        submitBtn.innerHTML = `Success!`;
        submitBtn.style.backgroundColor = 'var(--color-accent)';
        submitBtn.style.borderColor = 'var(--color-accent)';

        // Create elegant inline feedback alert
        const feedback = document.createElement('div');
        feedback.className = 'alert alert-success mt-3 reveal-fade-up active';
        feedback.style.fontSize = '0.9rem';
        feedback.style.fontFamily = 'var(--font-heading)';
        feedback.textContent = `Thank you for your submission. Our senior energy consultants will respond within 24 hours.`;
        
        form.appendChild(feedback);
        form.reset();

        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalContent;
          submitBtn.removeAttribute('style');
          feedback.remove();
        }, 5000);
      }, 1500);
    });
  });
}

// === 12. COUNTDOWN TIMER (Coming Soon) ===
function initCountdown() {
  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  // Set target date: 90 days from today
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 90);

  const updateTimer = () => {
    const now = new Date().getTime();
    const difference = targetDate.getTime() - now;

    if (difference <= 0) {
      clearInterval(interval);
      return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');
  };

  const interval = setInterval(updateTimer, 1000);
  updateTimer();
}

// === 13. ENERGY FLOW CANVAS ANIMATION (Home 2) ===
function initEnergyCanvas() {
  const canvas = document.getElementById('energyCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationFrameId;

  // Setup sizes
  const resizeCanvas = () => {
    const rect = canvas.parentNode.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = Math.max(rect.height, 480);
  };
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Particles config
  const particles = [];
  const particleCount = 40;
  const connectionDistance = 130;
  
  // Mouse position
  const mouse = { x: null, y: null, radius: 140 };
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  canvas.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Particle Class
  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2.5 + 1.5;
      this.speedX = (Math.random() - 0.5) * 0.55;
      this.speedY = (Math.random() - 0.5) * 0.55;
      this.baseOpacity = Math.random() * 0.4 + 0.35;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      // Bounce boundaries
      if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
      if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

      // Mouse interactive push/pull
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.hypot(dx, dy);
        
        if (distance < mouse.radius) {
          const force = (mouse.radius - distance) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          // Pull gently towards the cursor (energy grid attraction)
          this.x += Math.cos(angle) * force * 1.6;
          this.y += Math.sin(angle) * force * 1.6;
        }
      }
    }

    draw() {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const color = isDark ? 'rgba(52, 211, 153, ' : 'rgba(5, 78, 59, ';
      
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = color + this.baseOpacity + ')';
      ctx.fill();

      // Dotted active halo if hover is close
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.hypot(dx, dy);
        if (distance < 70) {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size * 3.5, 0, Math.PI * 2);
          ctx.strokeStyle = isDark ? 'rgba(52, 211, 153, 0.25)' : 'rgba(16, 185, 129, 0.25)';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
  }

  // Populate particles
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  // Render Loop
  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const lineColor = isDark ? 'rgba(52, 211, 153, ' : 'rgba(5, 78, 59, ';
    const packetColor = isDark ? 'rgba(110, 231, 183, ' : 'rgba(16, 185, 129, ';

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    // Draw connection paths and energy packets
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.hypot(dx, dy);

        if (distance < connectionDistance) {
          const opacity = (1 - distance / connectionDistance) * 0.16;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = lineColor + opacity + ')';
          ctx.lineWidth = 1;
          ctx.stroke();

          // Flowing Energy Packet along the connection line
          // Phase offset per connection to create scattered flow
          const time = (Date.now() * 0.0012 + (i + j) * 0.4) % 1;
          const packetX = particles[i].x + (particles[j].x - particles[i].x) * time;
          const packetY = particles[i].y + (particles[j].y - particles[i].y) * time;

          ctx.beginPath();
          ctx.arc(packetX, packetY, 2, 0, Math.PI * 2);
          ctx.fillStyle = packetColor + (opacity * 4) + ')';
          ctx.fill();
        }
      }
    }

    // Cursor tracking radar target
    if (mouse.x !== null && mouse.y !== null) {
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 40, 0, Math.PI * 2);
      ctx.strokeStyle = isDark ? 'rgba(52, 211, 153, 0.15)' : 'rgba(16, 185, 129, 0.15)';
      ctx.lineWidth = 1.2;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    animationFrameId = requestAnimationFrame(animate);
  };
  
  animate();
}

// === 14. SCROLL TO TOP BUTTON ===
function initScrollTop() {
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  if (!scrollTopBtn) return;

  const toggleScrollTopBtn = () => {
    if (window.scrollY > 300) {
      scrollTopBtn.classList.add('show');
    } else {
      scrollTopBtn.classList.remove('show');
    }
  };

  window.addEventListener('scroll', toggleScrollTopBtn);
  toggleScrollTopBtn(); // Initial check

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// === 15. MOBILE MENU TOGGLE LOGIC ===
function initMobileMenu() {
  const myOffcanvas = document.getElementById('mobileNavbar');
  const btnHamburger = document.querySelector('.btn-hamburger');
  
  if (myOffcanvas && btnHamburger) {
    myOffcanvas.addEventListener('show.bs.offcanvas', () => {
      btnHamburger.classList.add('is-active');
    });
    myOffcanvas.addEventListener('hide.bs.offcanvas', () => {
      btnHamburger.classList.remove('is-active');
    });
  }
}
