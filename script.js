const body = document.body;
const revealItems = document.querySelectorAll('.reveal');
const pageLinks = document.querySelectorAll('[data-page-link]');
const tiltItems = document.querySelectorAll('[data-tilt]');
const parallaxItems = document.querySelectorAll('[data-parallax]');
const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    body.classList.add('is-ready');
  });
});

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.18 });

revealItems.forEach(item => revealObserver.observe(item));

const updateScrollProgress = () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  document.documentElement.style.setProperty('--scroll-progress', `${progress}%`);
};

const updateParallax = () => {
  parallaxItems.forEach(item => {
    const rect = item.getBoundingClientRect();
    const viewportCenter = window.innerHeight / 2;
    const elementCenter = rect.top + rect.height / 2;
    const distance = viewportCenter - elementCenter;
    const shift = Math.max(-24, Math.min(24, distance * 0.06));

    item.style.setProperty('--parallax-shift', `${shift}px`);
  });
};

window.addEventListener('scroll', updateScrollProgress, { passive:true });
window.addEventListener('scroll', updateParallax, { passive:true });
window.addEventListener('resize', updateParallax);
updateScrollProgress();
updateParallax();

pageLinks.forEach(link => {
  link.addEventListener('click', event => {
    const href = link.getAttribute('href');

    if (!href || href.startsWith('#')) {
      return;
    }

    event.preventDefault();
    body.classList.remove('is-ready');
    body.classList.add('is-leaving');

    setTimeout(() => {
      window.location.href = href;
    }, 320);
  });
});

if (canHover) {
  tiltItems.forEach(card => {
    card.addEventListener('mousemove', event => {
      const rect = card.getBoundingClientRect();
      const ratioX = (event.clientX - rect.left) / rect.width;
      const ratioY = (event.clientY - rect.top) / rect.height;
      const rotateY = (ratioX - 0.5) * 10;
      const rotateX = (0.5 - ratioY) * 10;

      card.classList.add('is-tilting');
      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.classList.remove('is-tilting');
      card.style.transform = '';
    });
  });
}
