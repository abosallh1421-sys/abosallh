// يعمل بعد layout.js: القائمة في الجوال، الوضع الليلي، العودة للأعلى، حركة الظهور

// القائمة في الجوال
const toggle = document.querySelector('.nav-toggle');
const nav = document.getElementById('main-nav');

if (toggle && nav) {
  const setOpen = (open) => {
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open);
    toggle.setAttribute('aria-label', open ? 'إغلاق القائمة' : 'فتح القائمة');
  };
  toggle.addEventListener('click', () => setOpen(!nav.classList.contains('open')));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('open')) {
      setOpen(false);
      toggle.focus();
    }
  });
}

// الوضع الليلي — يُحفظ الاختيار، وبدونه يتبع إعداد الجهاز
const THEME_KEY = 'nafa-theme';
const themeBtn = document.querySelector('.theme-toggle');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
const isDark = () => (document.documentElement.dataset.theme || (prefersDark.matches ? 'dark' : 'light')) === 'dark';
const syncThemeBtn = () => themeBtn && themeBtn.setAttribute('aria-pressed', isDark());

if (themeBtn) {
  syncThemeBtn();
  prefersDark.addEventListener('change', syncThemeBtn);
  themeBtn.addEventListener('click', () => {
    const next = isDark() ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem(THEME_KEY, next); } catch {}
    syncThemeBtn();
  });
}

// زر العودة للأعلى
const toTop = document.querySelector('.to-top');

if (toTop) {
  const onScroll = () => toTop.classList.toggle('show', window.scrollY > 600);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  toTop.addEventListener('click', () => {
    window.scrollTo({ top: 0 });
    document.querySelector('.skip-link')?.focus({ preventScroll: true });
  });
}

// حركة الظهور عند التمرير
const revealTargets = document.querySelectorAll(
  '.section-head, .card, .goals li, .maxim, .news-card, .doc-card, .accordion details, .member, .steps li, .form-card, .two-col > *'
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

// نموذج طلب العضوية — يُرسَل إلى بريد الجمعية عبر خدمة FormSubmit (لصفحة membership.html)
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

// قسم القيادة: لا يظهر إلا بعد تحميل الصور الثلاث بنجاح
const leadership = document.querySelector('.leadership');

if (leadership) {
  const photos = [...leadership.querySelectorAll('img')];
  const loaded = (img) => new Promise((resolve, reject) => {
    if (img.complete) return img.naturalWidth ? resolve() : reject();
    img.addEventListener('load', resolve, { once: true });
    img.addEventListener('error', reject, { once: true });
  });
  Promise.all(photos.map(loaded)).then(() => leadership.classList.remove('is-pending'), () => {});
}
