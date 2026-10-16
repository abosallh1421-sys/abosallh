// القائمة في الجوال
const toggle = document.querySelector('.nav-toggle');
const nav = document.getElementById('main-nav');

toggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', open);
  toggle.setAttribute('aria-label', open ? 'إغلاق القائمة' : 'فتح القائمة');
});

nav.querySelectorAll('a').forEach((link) =>
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  })
);

// سنة التذييل
document.getElementById('year').textContent = new Date().getFullYear();

// عدّاد الأرقام
const formatter = new Intl.NumberFormat('ar-EG');
const animateCount = (el) => {
  const target = Number(el.dataset.count);
  const duration = 1400;
  const start = performance.now();
  const step = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    el.textContent = '+' + formatter.format(Math.round(target * progress));
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};

// حركة الظهور عند التمرير
const revealTargets = document.querySelectorAll('.section-head, .card, .goals li, .pillars li, .two-col > div');
revealTargets.forEach((el) => el.classList.add('reveal'));

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.15 });
  revealTargets.forEach((el) => observer.observe(el));

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.querySelectorAll('[data-count]').forEach(animateCount);
      statsObserver.unobserve(entry.target);
    });
  }, { threshold: 0.4 });
  statsObserver.observe(document.querySelector('.stats'));
} else {
  revealTargets.forEach((el) => el.classList.add('visible'));
  document.querySelectorAll('[data-count]').forEach(animateCount);
}

// نموذج التواصل (عرض فقط — يحتاج ربطًا بخدمة إرسال)
const form = document.getElementById('contact-form');
const note = form.querySelector('.form-note');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = form.elements.name.value.trim();
  const contact = form.elements.contact.value.trim();
  if (!name || !contact) {
    note.textContent = 'فضلًا أدخل الاسم ووسيلة التواصل.';
    note.classList.add('error');
    return;
  }
  note.classList.remove('error');
  note.textContent = `شكرًا ${name}، استلمنا رسالتك وسنتواصل معك قريبًا بإذن الله.`;
  form.reset();
});
