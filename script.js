// زر تبديل الوضع الفاتح/الغامق
const root = document.documentElement;
try {
  const saved = localStorage.getItem('theme');
  if (saved) root.setAttribute('data-theme', saved);
} catch (e) {}
document.getElementById('theme').addEventListener('click', () => {
  const isDark = root.getAttribute('data-theme') === 'dark' ||
    (!root.getAttribute('data-theme') && matchMedia('(prefers-color-scheme: dark)').matches);
  const next = isDark ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  try { localStorage.setItem('theme', next); } catch (e) {}
});

// تبديل اللغة عربي / English
// النص العربي بتكتبه جوه العنصر، والإنجليزي في data-en
const titles = { ar: 'أحمد مجدي محمد | الموقع الشخصي', en: 'Ahmed Magdy Mohamed | Personal Website' };
function setLang(l) {
  if (document.body.animate) document.body.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 400 });
  root.lang = l;
  root.dir = l === 'ar' ? 'rtl' : 'ltr';
  document.querySelectorAll('.t').forEach(el => {
    if (el.dataset.ar === undefined) el.dataset.ar = el.innerHTML;
    el.innerHTML = l === 'en' ? el.dataset.en : el.dataset.ar;
  });
  document.title = titles[l];
  document.getElementById('lang').textContent = l === 'ar' ? 'EN' : 'عربي';
  try { localStorage.setItem('lang', l); } catch (e) {}
}
document.getElementById('lang').addEventListener('click', () => {
  setLang(root.lang === 'ar' ? 'en' : 'ar');
});
try {
  if (localStorage.getItem('lang') === 'en') setLang('en');
} catch (e) {}

// حركات الظهور أثناء التمرير + شريط التقدم
const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!calm && 'IntersectionObserver' in window) {
  root.classList.add('js');
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target;
      el.classList.add('in');
      io.unobserve(el);
      const d = parseFloat(el.style.getPropertyValue('--d')) || 0;
      setTimeout(() => el.classList.remove('reveal', 'in'), 1000 + d * 1000);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('section h2, .card, .contact a, .chip, footer').forEach(el => {
    const i = [...el.parentElement.children].indexOf(el);
    el.style.setProperty('--d', (i * 0.1) + 's');
    el.classList.add('reveal');
    io.observe(el);
  });
}
const bar = document.createElement('div');
bar.id = 'bar';
document.body.appendChild(bar);
addEventListener('scroll', () => {
  const h = document.documentElement.scrollHeight - innerHeight;
  bar.style.transformOrigin = root.dir === 'rtl' ? 'right' : 'left';
  bar.style.transform = 'scaleX(' + (h > 0 ? scrollY / h : 0) + ')';
}, { passive: true });

// نسخ حساب إنستاباي بالضغط عليه
document.getElementById('copy-insta').addEventListener('click', e => {
  e.preventDefault();
  const label = e.currentTarget.querySelector('b');
  const old = label.innerHTML;
  const done = () => {
    label.textContent = root.lang === 'en' ? 'Copied ✓' : 'تم النسخ ✓';
    setTimeout(() => { label.innerHTML = old; }, 1500);
  };
  try { navigator.clipboard.writeText('megz_6@instapay').then(done); } catch (err) {}
});
