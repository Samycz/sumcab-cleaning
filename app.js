/*
   Sumcab Cleaning Services LLC - Interactive JS Engine
   Created by Antigravity - Advanced Agentic Coding
*/

document.addEventListener('DOMContentLoaded', () => {
  
  // --- API Base Configuration ---
  // When running locally, this is empty (uses relative paths).
  // Once you deploy the backend to the cloud (e.g. Render, Railway),
  // replace this empty string with your cloud URL (e.g. 'https://sumcab-backend.onrender.com')
  const API_BASE_URL = 'https://sumcab-cleaning.onrender.com';

  // --- 1. Sticky Navigation & Scroll Blur ---
  const header = document.getElementById('header-nav');
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Trigger on load in case page is already scrolled

  // --- 2. Mobile Navigation Menu Toggle ---
  const mobileToggle = document.getElementById('mobile-toggle');
  const body = document.body;
  const navMenu = document.getElementById('navbar-menu');
  const navLinks = navMenu.querySelectorAll('a');

  const toggleMenu = () => {
    const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
    mobileToggle.setAttribute('aria-expanded', !isExpanded);
    body.classList.toggle('nav-active');
  };

  mobileToggle.addEventListener('click', toggleMenu);

  // Close mobile menu when a link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (body.classList.contains('nav-active')) {
        toggleMenu();
      }
    });
  });

  // --- 3. Hero Floating Bubble Generator ---
  const bubblesContainer = document.getElementById('bubbles-container');
  const createBubble = () => {
    if (!bubblesContainer) return;
    
    const bubble = document.createElement('div');
    bubble.classList.add('bubble');
    
    // Randomize properties
    const size = Math.random() * 60 + 15; // 15px to 75px
    const startLeft = Math.random() * 100; // 0% to 100%
    const delay = Math.random() * 8; // 0s to 8s delay
    const duration = Math.random() * 15 + 10; // 10s to 25s duration
    
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    bubble.style.left = `${startLeft}%`;
    bubble.style.animationDelay = `${delay}s`;
    bubble.style.animationDuration = `${duration}s`;
    
    bubblesContainer.appendChild(bubble);
    
    // Remove bubble after animation ends to free up DOM nodes
    setTimeout(() => {
      bubble.remove();
    }, (duration + delay) * 1000);
  };

  // Generate initial bubbles
  if (bubblesContainer) {
    for (let i = 0; i < 15; i++) {
      createBubble();
    }
    // Periodically create new bubbles
    setInterval(createBubble, 1200);
  }

  // --- 4. Testimonial Carousel Slider ---
  const sliderTrack = document.getElementById('reviews-slider');
  const slides = document.querySelectorAll('.review-slide');
  const dots = document.querySelectorAll('.carousel-dot');
  let currentSlide = 0;
  let autoSlideTimer;

  const updateSlider = (index) => {
    if (!sliderTrack) return;
    currentSlide = index;
    sliderTrack.style.transform = `translateX(-${index * 100}%)`;
    
    // Update dots state
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === index);
    });
  };

  // Click handler for dots
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      updateSlider(index);
      resetAutoSlide(); // Reset timer on user interaction
    });
  });

  // Auto sliding function
  const startAutoSlide = () => {
    if (slides.length === 0) return;
    autoSlideTimer = setInterval(() => {
      let nextSlide = (currentSlide + 1) % slides.length;
      updateSlider(nextSlide);
    }, 6000); // Transition every 6 seconds
  };

  const resetAutoSlide = () => {
    clearInterval(autoSlideTimer);
    startAutoSlide();
  };

  if (slides.length > 0) {
    startAutoSlide();
  }

  // --- 5. Interactive Form & Date Validation ---
  const bookingForm = document.getElementById('booking-form');
  const bookingDateInput = document.getElementById('booking-date');
  const bookingCard = document.getElementById('booking-card-widget');
  
  // Set date picker minimum to tomorrow (to avoid booking past or same-day)
  const setMinDate = () => {
    if (!bookingDateInput) return;
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const dd = String(tomorrow.getDate()).padStart(2, '0');
    
    bookingDateInput.min = `${yyyy}-${mm}-${dd}`;
  };
  setMinDate();

  // Validate Sunday selection
  bookingDateInput.addEventListener('change', () => {
    const selectedDate = new Date(bookingDateInput.value + 'T00:00:00'); // Prevent timezone offset shift
    const day = selectedDate.getDay();
    
    if (day === 0) { // 0 represents Sunday
      alert('Sumcab Cleaning is closed on Sundays. Please select a Monday through Saturday slot for your booking.');
      bookingDateInput.value = ''; // Reset input
    }
  });

  // Modal Controls
  const successModalOverlay = document.getElementById('success-modal-overlay');
  const closeModalBtn = document.getElementById('close-modal-btn');

  const openSuccessModal = () => {
    successModalOverlay.classList.add('active');
    successModalOverlay.setAttribute('aria-hidden', 'false');
  };

  const closeSuccessModal = () => {
    successModalOverlay.classList.remove('active');
    successModalOverlay.setAttribute('aria-hidden', 'true');
  };

  closeModalBtn.addEventListener('click', closeSuccessModal);
  
  // Close modal when clicking outside the content card
  successModalOverlay.addEventListener('click', (e) => {
    if (e.target === successModalOverlay) {
      closeSuccessModal();
    }
  });

  // Handle Form Submission
  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Check basic HTML5 validity
    if (!bookingForm.checkValidity()) {
      bookingForm.reportValidity();
      return;
    }

    // Custom check: Ensure at least one service checkbox is selected
    const checkedServices = bookingForm.querySelectorAll('input[name="services"]:checked');
    if (checkedServices.length === 0) {
      alert('Please select at least one cleaning specialty service.');
      return;
    }

    // Collect data values
    const formData = {
      name: document.getElementById('booking-name').value,
      email: document.getElementById('booking-email').value,
      phone: document.getElementById('booking-phone').value,
      date: bookingDateInput.value,
      time: document.getElementById('booking-time').value,
      services: Array.from(checkedServices).map(cb => cb.value),
      notes: document.getElementById('booking-notes').value
    };

    console.log('--- Consultation Request Received ---', formData);

    // Send form data to Express backend
    const submitBtn = document.getElementById('submit-booking');
    const originalText = submitBtn.textContent;
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Recording Your Clean Slot...';

    fetch(`${API_BASE_URL}/api/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    .then(async (response) => {
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Server returned an error');
      }
      return data;
    })
    .then((data) => {
      console.log('Success:', data);
      // Open custom success modal
      openSuccessModal();
      // Reset form fields
      bookingForm.reset();
      setMinDate(); // Re-establish tomorrow minimum
    })
    .catch((error) => {
      console.error('Error submitting form:', error);
      alert('We encountered an error saving your request: ' + error.message + '. Please check if the server and database are running.');
    })
    .finally(() => {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    });

  });

  // --- 6. Generic Details Modal Controls for all 6 Services ---
  const overlays = document.querySelectorAll('.modal-overlay');
  const openModalBtns = document.querySelectorAll('.service-more-btn');
  const closeBtns = document.querySelectorAll('.modal-close-btn');
  const modalBookBtns = document.querySelectorAll('.modal-book-btn');
  const thumbnailBtns = document.querySelectorAll('.thumbnail-btn');

  // Open modal based on data-service
  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const service = btn.getAttribute('data-service');
      const targetModal = document.getElementById(`${service}-modal-overlay`);
      if (targetModal) {
        targetModal.classList.add('active');
        targetModal.setAttribute('aria-hidden', 'false');
      }
    });
  });

  // Close specific modal
  const closeModal = (modal) => {
    if (!modal) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
  };

  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      closeModal(btn.closest('.modal-overlay'));
    });
  });

  // Close on clicking outside the card
  overlays.forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeModal(overlay);
      }
    });
  });

  // Escape key closes all modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      overlays.forEach(overlay => closeModal(overlay));
      if (successModalOverlay && successModalOverlay.classList.contains('active')) {
        closeSuccessModal();
      }
    }
  });

  // Generic Gallery Thumbnail Switcher
  thumbnailBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const newSrc = btn.getAttribute('data-img');
      const modalGallery = btn.closest('.detail-modal-gallery');
      if (!modalGallery || !newSrc) return;

      const featuredImg = modalGallery.querySelector('.featured-image-wrapper img');
      if (!featuredImg) return;

      // Update active thumbnail state within this specific gallery
      const siblings = modalGallery.querySelectorAll('.thumbnail-btn');
      siblings.forEach(t => t.classList.remove('active'));
      btn.classList.add('active');

      // Add fade animation transition
      featuredImg.classList.add('fade-out');
      
      setTimeout(() => {
        featuredImg.src = newSrc;
        featuredImg.classList.remove('fade-out');
      }, 150);
    });
  });

  // CTA inside Modal mapping to Booking form
  modalBookBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const serviceVal = btn.getAttribute('data-service');
      
      // Close all modals
      overlays.forEach(overlay => closeModal(overlay));

      // Select corresponding checkbox in form
      const checkbox = document.querySelector(`input[name="services"][value="${serviceVal}"]`);
      if (checkbox) {
        checkbox.checked = true;
        // Trigger style updates
        const label = checkbox.closest('.checkbox-label');
        if (label) {
          checkbox.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }

      // Smooth scroll to booking form
      const agendaSection = document.getElementById('agenda');
      if (agendaSection) {
        agendaSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

});
