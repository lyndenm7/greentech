const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.primary-nav');
const navLinks = document.querySelectorAll('.primary-nav a');
const themeToggle = document.querySelector('[data-theme-toggle]');
const root = document.documentElement;
let currentTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

root.setAttribute('data-theme', currentTheme);

const updateThemeIcon = () => {
  if (!themeToggle) return;

  themeToggle.innerHTML =
    currentTheme === 'dark'
      ? '<span aria-hidden="true">☀</span>'
      : '<span aria-hidden="true">◐</span>';

  themeToggle.setAttribute(
    'aria-label',
    `Switch to ${currentTheme === 'dark' ? 'light' : 'dark'} mode`
  );
};

updateThemeIcon();

themeToggle?.addEventListener('click', () => {
  currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', currentTheme);
  updateThemeIcon();
});

menuButton?.addEventListener('click', () => {
  const expanded = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!expanded));
  menuButton.setAttribute(
    'aria-label',
    expanded ? 'Open navigation menu' : 'Close navigation menu'
  );
  nav?.classList.toggle('open');
});

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    nav?.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
    menuButton?.setAttribute('aria-label', 'Open navigation menu');
  });
});

const searchInput = document.getElementById('product-search');
const filterButtons = document.querySelectorAll('.chip');
const productCards = document.querySelectorAll('.product-card');
const noResults = document.getElementById('no-results');
let activeCategory = 'all';

function filterProducts() {
  if (!searchInput || !noResults || productCards.length === 0) return;

  const query = searchInput.value.trim().toLowerCase();
  let visibleCount = 0;

  productCards.forEach(card => {
    const category = card.dataset.category;
    const name = card.dataset.name.toLowerCase();
    const matchesCategory = activeCategory === 'all' || category === activeCategory;
    const matchesSearch = name.includes(query);
    const show = matchesCategory && matchesSearch;

    card.hidden = !show;

    if (show) {
      visibleCount += 1;
    }
  });

  noResults.hidden = visibleCount !== 0;
}

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    filterButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    activeCategory = button.dataset.filter;
    filterProducts();
  });
});

searchInput?.addEventListener('input', filterProducts);

function validateForm(form, messageEl) {
  const fields = [...form.querySelectorAll('input[required], textarea[required], select[required]')];
  let valid = true;
  let firstError = '';

  fields.forEach(field => {
    field.classList.remove('input-error');
    const value = field.value.trim();

    if (!value) {
      valid = false;
      field.classList.add('input-error');

      if (!firstError) {
        firstError = `Please complete the ${field.labels?.[0]?.textContent || field.name} field.`;
      }

      return;
    }

    if (field.type === 'email') {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailPattern.test(value)) {
        valid = false;
        field.classList.add('input-error');

        if (!firstError) {
          firstError = 'Enter a valid email address.';
        }
      }
    }
  });

  if (!valid) {
    messageEl.textContent = firstError;
    messageEl.className = 'form-message error';
    return false;
  }

  messageEl.textContent = 'Thanks! Your form was submitted successfully.';
  messageEl.className = 'form-message success';
  form.reset();
  return true;
}

const contactForm = document.getElementById('contact-form');
const contactMessage = document.getElementById('contact-message');

contactForm?.addEventListener('submit', event => {
  event.preventDefault();
  validateForm(contactForm, contactMessage);
});

const newsletterForm = document.getElementById('newsletter-form');
const newsletterMessage = document.getElementById('newsletter-message');

newsletterForm?.addEventListener('submit', event => {
  event.preventDefault();
  validateForm(newsletterForm, newsletterMessage);
});