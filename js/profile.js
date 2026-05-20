/* ===== 페이지 로더 ===== */
function hideLoader() {
  const loader = document.getElementById('page-loader');
  if (loader) loader.classList.add('hidden');
}

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    hideLoader();
    startTyping();
  }, 400);
});

// 혹시 DOMContentLoaded도 놓쳤을 경우 강제 해제
setTimeout(() => hideLoader(), 2500);

/* ===== 파티클 캔버스 ===== */
// 레이아웃이 완료된 후 실행
document.addEventListener('DOMContentLoaded', function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animId;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createParticle() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.8 + 0.4,
      dx: (Math.random() - 0.5) * 0.35,
      dy: (Math.random() - 0.5) * 0.35,
      alpha: Math.random() * 0.5 + 0.1
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: 90 }, createParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.dx;
      p.y += p.dy;
      if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.dy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(79, 142, 247, ${p.alpha})`;
      ctx.fill();
    });

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(79, 142, 247, ${0.06 * (1 - dist / 110)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
    animId = requestAnimationFrame(draw);
  }

  init();
  draw();
  window.addEventListener('resize', () => { cancelAnimationFrame(animId); init(); draw(); });
});

/* ===== 타이핑 효과 ===== */
const titles = ['백엔드 개발자', 'Java 개발자', 'Spring Boot 개발자', '코드로 문제를 해결합니다'];
let titleIdx = 0, charIdx = 0, isDeleting = false;

function startTyping() {
  const el = document.getElementById('typed-text');
  if (!el) return;

  const current = titles[titleIdx];
  el.textContent = isDeleting ? current.slice(0, charIdx--) : current.slice(0, charIdx++);

  let delay = isDeleting ? 60 : 110;

  if (!isDeleting && charIdx > current.length) {
    delay = 1800;
    isDeleting = true;
  } else if (isDeleting && charIdx < 0) {
    isDeleting = false;
    charIdx = 0;
    titleIdx = (titleIdx + 1) % titles.length;
    delay = 400;
  }
  setTimeout(startTyping, delay);
}

/* ===== 스크롤 진행 바 ===== */
window.addEventListener('scroll', updateProgress);
function updateProgress() {
  const scrolled = window.scrollY;
  const total = document.documentElement.scrollHeight - window.innerHeight;
  document.getElementById('scroll-progress').style.width = (scrolled / total * 100) + '%';
}

/* ===== 네비게이션 스크롤 효과 ===== */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 30);

  // 맨 위로 버튼
  document.getElementById('back-to-top').classList.toggle('visible', window.scrollY > 400);

  // 활성 섹션 하이라이트
  const sections = document.querySelectorAll('section[id]');
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  document.querySelectorAll('.nav-link').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
  });
});

/* ===== Intersection Observer (스크롤 트리거 애니메이션) ===== */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right')
  .forEach(el => revealObserver.observe(el));

/* ===== 숫자 카운터 애니메이션 ===== */
function animateCounter(el, target, duration = 1800) {
  let start = 0;
  const startTime = performance.now();

  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // ease-out 곡선
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target;
  }
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      animateCounter(el, target);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number').forEach(el => counterObserver.observe(el));

/* ===== 스킬 바 애니메이션 ===== */
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-fill').forEach(bar => {
        bar.style.width = bar.dataset.width + '%';
      });
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-category').forEach(el => skillObserver.observe(el));

/* ===== 카드 마우스 틸트 효과 ===== */
document.querySelectorAll('.tilt-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotateX = ((y - cy) / cy) * -6;
    const rotateY = ((x - cx) / cx) * 6;

    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(6px)`;

    // 글로우 위치 업데이트
    const glow = card.querySelector('.project-card-glow');
    if (glow) {
      glow.style.setProperty('--x', (x / rect.width * 100) + '%');
      glow.style.setProperty('--y', (y / rect.height * 100) + '%');
    }
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.5s ease';
    setTimeout(() => { card.style.transition = ''; }, 500);
  });
});

/* ===== 프로젝트 필터 ===== */
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    document.querySelectorAll('.project-card').forEach(card => {
      const match = filter === 'all' || card.dataset.category === filter;
      card.style.transition = 'opacity 0.3s, transform 0.3s';
      if (match) {
        card.style.opacity = '1';
        card.style.transform = '';
        card.classList.remove('hidden-card');
      } else {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95)';
        setTimeout(() => { if (btn.dataset.filter === filter) card.classList.add('hidden-card'); }, 300);
      }
    });
  });
});

/* ===== 햄버거 메뉴 ===== */
function toggleMenu() {
  const hamburger = document.getElementById('hamburger');
  const menu = document.getElementById('mobile-menu');
  hamburger.classList.toggle('open');
  menu.classList.toggle('open');
}

/* ===== 맨 위로 ===== */
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ===== 연락처 폼 ===== */
function sendMessage(e) {
  e.preventDefault();
  const btn = e.target.querySelector('.btn-send span:first-child');
  btn.textContent = '전송 중...';
  setTimeout(() => {
    btn.textContent = '전송 완료! ✓';
    e.target.reset();
    setTimeout(() => { btn.textContent = '보내기'; }, 3000);
  }, 1200);
}

/* ===== ESC 키 ===== */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    const menu = document.getElementById('mobile-menu');
    if (menu.classList.contains('open')) toggleMenu();
  }
});
