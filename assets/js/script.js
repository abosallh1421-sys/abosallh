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

// نموذج طلب العضوية — يُرسَل إلى بريد الجمعية عبر خدمة FormSubmit
const JOIN_ENDPOINT = 'https://formsubmit.co/ajax/nafa.lawyers@gmail.com';
const joinForm = document.getElementById('join-form');

if (joinForm) {
  const note = joinForm.querySelector('.form-note');
  const submitBtn = joinForm.querySelector('button[type="submit"]');
  joinForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const { fullname, phone, email, city, role, org, membership, bio, consent } = joinForm.elements;
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
    note.textContent = 'جارٍ إرسال الطلب...';
    submitBtn.disabled = true;

    const name = fullname.value.trim();
    try {
      const res = await fetch(JOIN_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          _subject: `طلب عضوية جديد في الجمعية العمومية — ${name}`,
          _template: 'table',
          _captcha: 'false',
          _replyto: email.value.trim(),
          'الاسم الرباعي': name,
          'رقم الجوال': phone.value.trim(),
          'البريد الإلكتروني': email.value.trim(),
          'المدينة': city.value.trim(),
          'الصفة': role.value,
          'الجامعة / جهة العمل': org.value.trim(),
          'نوع العضوية': membership.value,
          'نبذة': bio.value.trim(),
        }),
      });
      if (!res.ok) throw new Error(res.status);
      note.textContent = `شكرًا ${name}، وصلنا طلبك وسيُعرض على مجلس الإدارة، وسنتواصل معك قريبًا.`;
      joinForm.reset();
    } catch {
      note.classList.add('error');
      note.innerHTML = 'تعذّر إرسال الطلب حاليًا. فضلًا أعد المحاولة، أو راسلنا على <a href="mailto:nafa.lawyers@gmail.com">nafa.lawyers@gmail.com</a>.';
    } finally {
      submitBtn.disabled = false;
    }
  });
}
