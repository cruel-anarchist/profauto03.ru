const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.main-nav');

function closeMenu() {
  menuButton?.setAttribute('aria-expanded', 'false');
  menuButton?.setAttribute('aria-label', 'Открыть меню');
  navigation?.classList.remove('is-open');
}

menuButton?.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Открыть меню' : 'Закрыть меню');
  navigation.classList.toggle('is-open', !isOpen);
});

navigation?.addEventListener('click', (event) => {
  if (event.target.closest('a')) closeMenu();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuButton?.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menuButton.focus();
  }
});

const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 16);
window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

document.querySelectorAll('[data-year]').forEach((element) => {
  element.textContent = new Date().getFullYear();
});

const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
let revealObserver;

function configureReveals() {
  revealObserver?.disconnect();
  const elements = document.querySelectorAll('[data-reveal]');
  elements.forEach((element) => element.classList.remove('will-reveal', 'is-visible'));
  if (motionPreference.matches || !('IntersectionObserver' in window)) return;

  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -24px 0px' });

  elements.forEach((element, index) => {
    if (element.getBoundingClientRect().top < window.innerHeight) return;
    element.classList.add('will-reveal');
    element.style.setProperty('--reveal-delay', `${(index % 3) * 55}ms`);
    revealObserver.observe(element);
  });
}

configureReveals();
motionPreference.addEventListener('change', configureReveals);

const searchInput = document.querySelector('#price-search');
const searchStatus = document.querySelector('#price-status');

searchInput?.addEventListener('input', () => {
  const query = searchInput.value.toLocaleLowerCase('ru').trim().replaceAll('ё', 'е');
  let visibleCount = 0;
  document.querySelectorAll('[data-price-category]').forEach((section) => {
    const categoryName = section.querySelector('h2').textContent.toLocaleLowerCase('ru').replaceAll('ё', 'е');
    let categoryCount = 0;
    section.querySelectorAll('tbody tr').forEach((row) => {
      const text = row.textContent.toLocaleLowerCase('ru').replaceAll('ё', 'е');
      const matches = text.includes(query) || categoryName.includes(query);
      row.hidden = !matches;
      if (matches) categoryCount++;
    });
    section.hidden = categoryCount === 0;
    visibleCount += categoryCount;
  });
  searchStatus.textContent = visibleCount ? `Найдено позиций — ${visibleCount}` : 'По вашему запросу ничего не найдено. Измените запрос или позвоните нам.';
});
