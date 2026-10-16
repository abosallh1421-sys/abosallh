// الترويسة والتذييل والتنقل — كلها تُولَّد من مصفوفة NAV.
// إضافة صفحة جديدة = ملف HTML + سطر هنا (وتحديث كتلة <noscript> في الصفحات).
const NAV = [
  { title: 'الرئيسية', href: 'index.html', desc: 'التعريف بالجمعية وأبرز ما فيها' },
  { title: 'من نحن', href: 'about.html', desc: 'تعريف الجمعية وبيانات ترخيصها' },
  { title: 'الأهداف', href: 'goals.html', desc: 'أهداف الجمعية وفق المادة الخامسة من اللائحة الأساسية' },
  { title: 'الحوكمة', href: 'governance.html', desc: 'مجلس الإدارة والجمعية العمومية وأجهزة الجمعية' },
  { title: 'العضوية', href: 'membership.html', desc: 'شروط العضوية وأنواعها وطلب الانضمام' },
  { title: 'الدعم', href: 'support.html', desc: 'سبل دعم الجمعية' },
  { title: 'الوثائق والإفصاح', href: 'documents.html', desc: 'اللائحة الأساسية وشهادة الترخيص والسياسات' },
  { title: 'الأخبار', href: 'news.html', desc: 'أخبار الجمعية ولقاءاتها' },
  { title: 'تواصل معنا', href: 'contact.html', desc: 'البريد الإلكتروني والمقر الرئيسي' },
];

const SITE = {
  name: 'جمعية نفع للمحامين',
  license: '1000899100',
  unifiedNo: '7055099845',
  email: 'nafa.lawyers@gmail.com',
  hq: 'بريدة – منطقة القصيم',
  supervisor: 'وزارة العدل',
};

(() => {
  const body = document.body;
  const fromPath = location.pathname.split('/').pop() || 'index.html';
  const current = body.dataset.page || fromPath;
  const index = NAV.findIndex((p) => p.href === current);
  const page = NAV[index];
  const isHome = current === 'index.html';
  const navLinks = (extra = '') =>
    NAV.map((p) => `<a href="${p.href}"${p.href === current ? ' aria-current="page"' : ''}${extra}>${p.title}</a>`).join('');

  // رابط «انتقل إلى المحتوى»
  const main = document.querySelector('main');
  if (main) {
    main.id = main.id || 'main';
    main.tabIndex = -1;
    body.insertAdjacentHTML('afterbegin', `<a class="skip-link" href="#${main.id}">انتقل إلى المحتوى</a>`);
  }

  // الترويسة
  const header = document.getElementById('site-header');
  if (header) {
    header.className = 'site-header';
    header.innerHTML = `
      <div class="container nav-bar">
        <a href="index.html" class="brand" aria-label="${SITE.name} - الرئيسية">
          <img class="logo-light" src="assets/img/symbol.svg" alt="" width="48" height="44">
          <img class="logo-dark" src="assets/img/symbol-light.svg" alt="" width="48" height="44">
          <span class="brand-text"><b>${SITE.name}</b><small>مرخّصة برقم ${SITE.license}</small></span>
        </a>
        <nav id="main-nav" class="main-nav" aria-label="القائمة الرئيسية">${navLinks()}</nav>
        <div class="header-tools">
          <button class="icon-btn theme-toggle" type="button" aria-label="تبديل الوضع الليلي">
            <svg class="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>
            <svg class="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>
          </button>
          <button class="nav-toggle" type="button" aria-label="فتح القائمة" aria-expanded="false" aria-controls="main-nav">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>`;
  }

  // مسار التنقل: الرئيسية ‹ اسم الصفحة (عدا الرئيسية)
  const heroBox = document.querySelector('.page-hero .container');
  if (heroBox && !isHome) {
    const name = page ? page.title : document.querySelector('h1')?.textContent.trim();
    heroBox.insertAdjacentHTML('afterbegin', `
      <nav class="breadcrumb" aria-label="مسار التنقل">
        <ol><li><a href="index.html">الرئيسية</a></li><li><span aria-current="page">${name}</span></li></ol>
      </nav>`);
  }

  // السابق / التالي حسب ترتيب NAV
  if (main && page) {
    const prev = NAV[index - 1];
    const next = NAV[index + 1];
    const cream = main.lastElementChild?.classList.contains('section-cream') ? ' pager-cream' : '';
    main.insertAdjacentHTML('beforeend', `
      <nav class="pager${cream}" aria-label="التنقل بين الصفحات">
        <div class="container pager-inner">
          ${prev ? `<a class="prev" href="${prev.href}" rel="prev"><small>→ السابق</small><b>${prev.title}</b></a>` : ''}
          ${next ? `<a class="next" href="${next.href}" rel="next"><small>التالي ←</small><b>${next.title}</b></a>` : ''}
        </div>
      </nav>`);
  }

  // خريطة الموقع داخل الصفحة (تُستخدم في 404)
  document.querySelectorAll('[data-sitemap]').forEach((list) => {
    list.innerHTML = NAV.map((p) => `<li><a href="${p.href}"><b>${p.title}</b><small>${p.desc}</small></a></li>`).join('');
  });

  // التذييل
  const footer = document.getElementById('site-footer');
  if (footer) {
    footer.className = 'site-footer';
    footer.innerHTML = `
      <div class="container">
        <div class="footer-grid">
          <div>
            <img src="assets/img/logo-light.svg" alt="شعار ${SITE.name}" width="174" height="54">
            <p>جمعية أهلية مرخّصة، مقرها ${SITE.hq}، تحت إشراف ${SITE.supervisor}.</p>
          </div>
          <nav aria-label="خريطة الموقع">
            <h2>خريطة الموقع</h2>
            <ul class="footer-map">${NAV.map((p) => `<li><a href="${p.href}" title="${p.desc}"${p.href === current ? ' aria-current="page"' : ''}>${p.title}</a></li>`).join('')}</ul>
          </nav>
          <div>
            <h2>بيانات الجمعية</h2>
            <ul>
              <li>رقم الترخيص: ${SITE.license}</li>
              <li>الرقم الوطني الموحد: ${SITE.unifiedNo}</li>
              <li>البريد: <a href="mailto:${SITE.email}">${SITE.email}</a></li>
              <li>المقر: ${SITE.hq}</li>
              <li>الجهة المشرفة: ${SITE.supervisor}</li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <p>© <span class="year">${new Date().getFullYear()}</span> ${SITE.name}. جميع الحقوق محفوظة.</p>
        </div>
      </div>`;
  }

  // زر العودة للأعلى
  body.insertAdjacentHTML('beforeend', `
    <button class="to-top" type="button" aria-label="العودة للأعلى">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
    </button>`);
})();
