// القائمة في الجوال
const toggle = document.querySelector('.nav-toggle');
const nav = document.getElementById('main-nav');

toggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', open);
  toggle.setAttribute('aria-label', open ? 'إغلاق القائمة' : 'فتح القائمة');
});

// سنة التذييل
document.querySelectorAll('.year').forEach((el) => (el.textContent = new Date().getFullYear()));

// حركة الظهور عند التمرير
const revealTargets = document.querySelectorAll(
  '.section-head, .card, .goals li, .maxim, .news-card, .doc-card, .accordion details, .member, .steps li, .board-empty, .form-card, .two-col > *'
);
revealTargets.forEach((el) => el.classList.add('reveal'));

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.1 });
  revealTargets.forEach((el) => observer.observe(el));
} else {
  revealTargets.forEach((el) => el.classList.add('visible'));
}

// نموذج طلب العضوية (عرض فقط — يحتاج ربطًا بخدمة إرسال)
const joinForm = document.getElementById('join-form');

if (joinForm) {
  const note = joinForm.querySelector('.form-note');
  joinForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const { fullname, phone, consent } = joinForm.elements;
    if (!fullname.value.trim() || !phone.value.trim()) {
      note.textContent = 'فضلًا أدخل الاسم ورقم الجوال.';
      note.classList.add('error');
      return;
    }
    if (!consent.checked) {
      note.textContent = 'فضلًا أكّد استيفاء شروط العضوية والاطلاع على اللائحة الأساسية.';
      note.classList.add('error');
      return;
    }
    note.classList.remove('error');
    note.textContent = `شكرًا ${fullname.value.trim()}، استلمنا طلبك وسيُعرض على مجلس الإدارة، وسنتواصل معك قريبًا.`;
    joinForm.reset();
  });
}
