document.addEventListener('DOMContentLoaded', () => {
  const yearNode = document.getElementById('year');
  if (yearNode) {
    yearNode.textContent = new Date().getFullYear();
  }

  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    const closeNav = () => {
      navToggle.setAttribute('aria-expanded', 'false');
      navLinks.classList.remove('is-open');
    };

    navToggle.setAttribute('aria-controls', 'site-navigation');
    navLinks.id = 'site-navigation';

    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!isExpanded));
      navLinks.classList.toggle('is-open');
    });

    navLinks.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeNav));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeNav();
    });
    document.addEventListener('click', (event) => {
      if (!navLinks.contains(event.target) && !navToggle.contains(event.target)) closeNav();
    });
  }

  const gallerySection = document.getElementById('past-sales-gallery');
  const galleryToggle = document.querySelector('.gallery-toggle');

  const setGalleryState = (isOpen) => {
    if (!gallerySection) return;

    gallerySection.classList.toggle('hidden-gallery', !isOpen);
    gallerySection.classList.toggle('visible-gallery', isOpen);

    if (galleryToggle) {
      galleryToggle.setAttribute('aria-expanded', String(isOpen));
        const label = galleryToggle.querySelector('.toggle-label');
      if (label) {
          label.textContent = isOpen ? 'Close Past Sales' : 'View Past Sales';
      }
    }

    if (isOpen) {
      gallerySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (galleryToggle && gallerySection) {
    galleryToggle.addEventListener('click', () => {
      const isVisible = !gallerySection.classList.contains('hidden-gallery');
      setGalleryState(!isVisible);
    });
  }

  const eventCarousel = document.querySelector('.event-carousel');
  if (eventCarousel) {
    const slides = Array.from(eventCarousel.querySelectorAll('.carousel-slide'));
    const dots = Array.from(eventCarousel.querySelectorAll('.dot'));
    const prevButton = eventCarousel.querySelector('.carousel-prev');
    const nextButton = eventCarousel.querySelector('.carousel-next');

    let currentIndex = 0;

    const updateCarousel = (newIndex) => {
      if (!slides.length) return;

      currentIndex = (newIndex + slides.length) % slides.length;

      slides.forEach((slide, index) => {
        slide.classList.toggle('is-active', index === currentIndex);
        slide.setAttribute('aria-hidden', String(index !== currentIndex));
      });

      dots.forEach((dot, index) => {
        dot.classList.toggle('is-active', index === currentIndex);
        dot.setAttribute('aria-current', String(index === currentIndex));
      });
    };

    prevButton?.addEventListener('click', () => updateCarousel(currentIndex - 1));
    nextButton?.addEventListener('click', () => updateCarousel(currentIndex + 1));

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => updateCarousel(index));
    });

    eventCarousel.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') updateCarousel(currentIndex - 1);
      if (event.key === 'ArrowRight') updateCarousel(currentIndex + 1);
    });
    eventCarousel.tabIndex = 0;
    updateCarousel(0);
  }

  const galleryItems = document.querySelectorAll('[data-lightbox]');
  if (galleryItems.length) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.setAttribute('aria-label', 'Image preview');
    lightbox.setAttribute('aria-hidden', 'true');
    lightbox.innerHTML = `
      <button class="lightbox-close" aria-label="Close lightbox">×</button>
      <figure>
        <img src="" alt="Estate sale preview" />
        <figcaption></figcaption>
      </figure>
    `;
    document.body.appendChild(lightbox);

    const lightboxImg = lightbox.querySelector('img');
    const lightboxCaption = lightbox.querySelector('figcaption');
    const closeButton = lightbox.querySelector('.lightbox-close');
    let previousFocus;

    galleryItems.forEach((item) => {
      item.setAttribute('tabindex', '0');
      item.setAttribute('role', 'button');
      item.addEventListener('click', () => {
        previousFocus = document.activeElement;
        lightboxImg.src = item.dataset.lightbox;
        lightboxImg.alt = item.dataset.title || 'Estate sale preview';
        lightboxCaption.textContent = item.dataset.title || '';
        lightbox.classList.add('visible');
        lightbox.setAttribute('aria-hidden', 'false');
        closeButton.focus();
      });
      item.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          item.click();
        }
      });
    });

    const closeLightbox = () => {
      lightbox.classList.remove('visible');
      lightbox.setAttribute('aria-hidden', 'true');
      if (previousFocus) previousFocus.focus();
    };
    closeButton.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (event) => {
      if (event.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && lightbox.classList.contains('visible')) closeLightbox();
    });
  }

  const contactForm = document.querySelector('#contact-form');
  if (contactForm) {
    const message = contactForm.querySelector('.form-message');

    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const fields = Array.from(contactForm.querySelectorAll('input, textarea'));
      const invalidField = fields.find((field) => !field.checkValidity());

      fields.forEach((field) => field.setAttribute('aria-invalid', String(!field.checkValidity())));

      if (invalidField) {
        message.textContent = 'Please complete the highlighted fields before sending your consultation request.';
        message.classList.add('error');
        message.classList.remove('success');
        invalidField.focus();
        return;
      }

      message.textContent = 'Online delivery is not configured yet. Please call (404) 245-9437 so we can respond to your request directly.';
      message.classList.add('notice');
      message.classList.remove('error');
    });
  }
});
