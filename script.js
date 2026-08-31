document.addEventListener('DOMContentLoaded', () => {
  const yearNode = document.getElementById('year');
  if (yearNode) {
    yearNode.textContent = new Date().getFullYear();
  }

  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!isExpanded));
      navLinks.classList.toggle('is-open');
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
        label.textContent = isOpen ? 'Close' : 'Open';
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

  const galleryItems = document.querySelectorAll('[data-lightbox]');
  if (galleryItems.length) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
      <button class="lightbox-close" aria-label="Close lightbox">×</button>
      <img src="" alt="Estate sale preview" />
      <p></p>
    `;
    document.body.appendChild(lightbox);

    const lightboxImg = lightbox.querySelector('img');
    const lightboxCaption = lightbox.querySelector('p');
    const closeButton = lightbox.querySelector('.lightbox-close');

    galleryItems.forEach((item) => {
      item.addEventListener('click', () => {
        lightboxImg.src = item.dataset.lightbox;
        lightboxImg.alt = item.dataset.title || 'Estate sale preview';
        lightboxCaption.textContent = item.dataset.title || '';
        lightbox.classList.add('visible');
      });
    });

    const closeLightbox = () => lightbox.classList.remove('visible');
    closeButton.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (event) => {
      if (event.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeLightbox();
    });
  }

  const contactForm = document.querySelector('#contact-form');
  if (contactForm) {
    const message = contactForm.querySelector('.form-message');

    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const requiredFields = ['name', 'phone', 'email', 'location', 'timeline', 'description'];
      let isValid = true;

      requiredFields.forEach((fieldName) => {
        const field = contactForm.querySelector(`[name="${fieldName}"]`);
        if (!field || !field.value.trim()) {
          isValid = false;
        }
      });

      const emailField = contactForm.querySelector('[name="email"]');
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailField && !emailPattern.test(emailField.value.trim())) {
        isValid = false;
      }

      if (!isValid) {
        message.textContent = 'Please complete all required fields before submitting your consultation request.';
        message.classList.add('error');
        message.classList.remove('success');
        return;
      }

      message.textContent = 'Thank you. Your consultation request has been received. A Compassion Estates specialist will reach out shortly.';
      message.classList.add('success');
      message.classList.remove('error');
      contactForm.reset();
    });
  }
});
