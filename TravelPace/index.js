
(function () {
  // Force instant scroll to top BEFORE DOM ready
  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }
  window.scrollTo(0, 0);

  // INSTANT page load class - No requestAnimationFrame delay
  document.documentElement.classList.add("page-loaded");
  document.body.classList.add("page-loaded");

  // Critical DOM elements - cache immediately
  const header = document.querySelector(".header");
  const navLinks = document.querySelectorAll("nav a");
  const sections = document.querySelectorAll("section[id]");
  const navbar = document.getElementById("navbar");
  const menuBtn = document.getElementById("menuBtn");
  const menuClose = document.getElementById("menuClose");

  /* ================= HEADER SCROLL EFFECT ================= */
  const handleHeaderScroll = () => {
    if (header) header.classList.toggle("scrolled", window.scrollY > 50);
  };
  window.addEventListener("scroll", handleHeaderScroll, { passive: true });

  /* ================= SMOOTH SCROLL ================= */
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href").substring(1);
      const targetSection = document.getElementById(targetId);
      if (!targetSection || !header) return;
      window.scrollTo({
        top: targetSection.offsetTop - header.offsetHeight + 1,
        behavior: "smooth",
      });
      if (navbar) closeMenu();
    });
  });

  /* ================= ACTIVE LINK ONLY ================= */
  const observerOptions = {
    root: null,
    rootMargin: "-40% 0px -40% 0px",
    threshold: 0,
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      navLinks.forEach((link) => {
        link.classList.toggle(
          "active",
          link.getAttribute("href").substring(1) === id
        );
      });
    });
  }, observerOptions);

  sections.forEach((section) => sectionObserver.observe(section));

  /* ================= HERO SLIDES ================= */
  const slides = document.querySelectorAll(".slide");
  let currentSlide = 0;
  if (slides.length > 1) {
    setInterval(() => {
      slides[currentSlide].classList.remove("active");
      currentSlide = (currentSlide + 1) % slides.length;
      slides[currentSlide].classList.add("active");
    }, 5000);
  }

  /* ================= DARK MODE ================= */
  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark");
      themeToggle.textContent = document.body.classList.contains("dark")
        ? "☀️"
        : "🌙";
    });
  }

  /* ================= MOBILE NAVIGATION ================= */
  function openMenu() {
    if (!navbar) return;
    navbar.style.right = "0";
    navbar.style.visibility = "visible";
    navbar.style.opacity = "1";
    navbar.classList.add("active");
    document.body.classList.add("menu-open");
    document.body.style.overflow = "hidden";
    if (menuBtn) menuBtn.setAttribute("aria-expanded", "true");
  }

  function closeMenu() {
    if (!navbar) return;
    navbar.style.right = "-70%";
    navbar.style.visibility = "hidden";
    navbar.style.opacity = "0";
    navbar.classList.remove("active");
    document.body.classList.remove("menu-open");
    document.body.style.overflow = "";
    if (menuBtn) menuBtn.setAttribute("aria-expanded", "false");
  }

  if (menuBtn && navbar) {
    menuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (navbar.classList.contains("active")) {
        closeMenu();
      } else {
        openMenu();
      }
    });
  }

  if (menuClose && navbar) {
    menuClose.addEventListener("click", (e) => {
      e.stopPropagation();
      closeMenu();
    });
  }

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".nav") && navbar?.classList.contains("active")) {
      closeMenu();
    }
  });

  window.addEventListener(
    "resize",
    () => {
      if (window.innerWidth > 992) {
        closeMenu();
      }
    },
    { passive: true }
  );

  /* ================= SCROLL REVEAL ================= */
  const reveals = document.querySelectorAll(".reveal");
  const revealOnScroll = () => {
    reveals.forEach((el) => {
      if (el.getBoundingClientRect().top < window.innerHeight - 100) {
        el.classList.add("active");
      }
    });
  };
  window.addEventListener("scroll", revealOnScroll, { passive: true });

  /* ================= SCROLL TO TOP BUTTON - MOBILE FIXED ================= */
  const scrollTopBtn = document.createElement("button");
  scrollTopBtn.id = "scrollTopBtn";
  scrollTopBtn.innerHTML = "↑";
  scrollTopBtn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    padding: 12px 16px;
    border-radius: 50%;
    border: none;
    background: var(--primary);
    color: white;
    cursor: pointer;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
    z-index: 1000;
    font-size: 16px;
    font-weight: bold;
    font-family: sans-serif;
  `;
  document.body.appendChild(scrollTopBtn);

  const toggleScrollTopBtn = () => {
    const isMenuOpen = document.body.classList.contains("menu-open");
    const shouldShow = window.scrollY > 300 && !isMenuOpen;

    scrollTopBtn.style.opacity = shouldShow ? "1" : "0";
    scrollTopBtn.style.pointerEvents = shouldShow ? "auto" : "none";
  };

  scrollTopBtn.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" })
  );
  window.addEventListener("scroll", toggleScrollTopBtn, { passive: true });

  /* ================= BOOK FORM ================= */
  const bookForm = document.getElementById("bookForm");
  const bookStatus = document.getElementById("bookStatus");

  if (bookForm) {
    bookForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("bookName");
      const email = document.getElementById("bookEmail");
      const phone = document.getElementById("bookPhone");
      const address = document.getElementById("bookAddress");
      const destination = document.getElementById("bookDestination");
      const guests = document.getElementById("bookGuests");
      const arrival = document.getElementById("bookArrival");
      const leaving = document.getElementById("bookLeaving");
      const submitBtn = bookForm.querySelector(".book-btn");

      let valid = true;

      // Clear previous errors
      bookForm.querySelectorAll(".book-error").forEach((el) => el.remove());

      // Validation
      if (name.value.trim() === "") {
        showFieldError(name, "Name is required");
        valid = false;
      }
      if (!/^\S+@\S+\.\S+$/.test(email.value)) {
        showFieldError(email, "Valid email required");
        valid = false;
      }
      if (!/^\+?[\d\s-()]{10,}$/.test(phone.value)) {
        showFieldError(phone, "Valid phone number required");
        valid = false;
      }
      if (arrival.value && leaving.value && arrival.value >= leaving.value) {
        showFieldError(leaving, "Leaving date must be after arrival");
        valid = false;
      }

      if (!valid) {
        if (bookStatus) {
          bookStatus.textContent = "Please fix the errors above.";
          bookStatus.className = "book-status book-error";
        }
        return;
      }

      // Submit
      if (submitBtn) {
        submitBtn.innerHTML = '<span class="book-spinner"></span>Booking...';
        submitBtn.disabled = true;
      }
      if (bookStatus) {
        bookStatus.textContent = "Processing your booking...";
        bookStatus.className = "book-status";
      }

      const booking = {
        name: name.value,
        email: email.value,
        phone: phone.value,
        address: address.value,
        destination: destination.value,
        guests: guests.value,
        arrival: arrival.value,
        leaving: leaving.value,
        bookedAt: new Date().toISOString(),
      };

      setTimeout(() => {
        const stored = JSON.parse(localStorage.getItem("travelBookings")) || [];
        stored.push(booking);
        localStorage.setItem("travelBookings", JSON.stringify(stored));

        if (bookStatus) {
          bookStatus.textContent =
            "🎉 Booking confirmed! We'll contact you soon.";
          bookStatus.className = "book-status";
        }
        bookForm.reset();
        if (submitBtn) {
          submitBtn.innerHTML = '<span class="btn-text">Book Now</span>';
          submitBtn.disabled = false;
        }

        setTimeout(() => {
          if (bookStatus) bookStatus.textContent = "";
        }, 5000);
      }, 2000);
    });
  }

  function showFieldError(field, message) {
    const error = document.createElement("div");
    error.className = "book-error";
    error.style.cssText =
      "font-size: 0.8rem; color: #fecaca; margin-top: 4px; text-align: left;";
    error.textContent = message;
    field.parentNode.appendChild(error);
  }

  /* ================= CONTACT FORM ================= */
  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("name");
      const email = document.getElementById("email");
      const destination = document.getElementById("destination");
      const submitBtn = contactForm.querySelector(".contact-btn");

      let valid = true;
      contactForm
        .querySelectorAll(".error-msg")
        .forEach((el) => (el.textContent = ""));

      if (name.value.trim() === "") {
        if (name.nextElementSibling)
          name.nextElementSibling.textContent = "Name is required";
        valid = false;
      }
      if (!/^\S+@\S+\.\S+$/.test(email.value)) {
        if (email.nextElementSibling)
          email.nextElementSibling.textContent =
            "Please enter a valid email address";
        valid = false;
      }

      if (!valid) {
        if (formStatus) {
          formStatus.textContent = "Please fix the errors above.";
          formStatus.style.color = "#fecaca";
        }
        return;
      }

      if (submitBtn) {
        submitBtn.classList.add("loading");
        submitBtn.disabled = true;
        submitBtn.setAttribute("aria-busy", "true");
      }
      if (formStatus) {
        formStatus.textContent = "Submitting your request...";
        formStatus.style.color = "#e5e7eb";
      }

      const submission = {
        name: name.value,
        email: email.value,
        destination: destination.value,
        submittedAt: new Date().toISOString(),
      };

      setTimeout(() => {
        const stored = JSON.parse(localStorage.getItem("travelRequests")) || [];
        stored.push(submission);
        localStorage.setItem("travelRequests", JSON.stringify(stored));

        if (formStatus) {
          formStatus.textContent =
            "Success! Your travel request has been submitted.";
          formStatus.style.color = "#86efac";
        }
        if (submitBtn) {
          submitBtn.classList.remove("loading");
          submitBtn.disabled = false;
          submitBtn.setAttribute("aria-busy", "false");
        }
        contactForm.reset();

        setTimeout(() => {
          if (formStatus) formStatus.textContent = "";
        }, 3500);
      }, 1800);
    });
  }
})();
// Hero Slider Functionality
document.addEventListener("DOMContentLoaded", function () {
  const slides = document.querySelectorAll(".slide");
  const prevBtn = document.querySelector(".slide-prev");
  const nextBtn = document.querySelector(".slide-next");
  const dotsContainer = document.querySelector(".slide-dots");
  let currentSlide = 0;
  let autoSlideInterval;

  // Create dots
  function createDots() {
    dotsContainer.innerHTML = "";
    slides.forEach((_, index) => {
      const dot = document.createElement("div");
      dot.classList.add("dot");
      if (index === 0) dot.classList.add("active");
      dot.addEventListener("click", () => goToSlide(index));
      dotsContainer.appendChild(dot);
    });
  }

  function goToSlide(slideIndex) {
    slides[currentSlide].classList.remove("active");
    slides[slideIndex].classList.add("active");

    // Update dots
    document.querySelectorAll(".dot").forEach((dot, index) => {
      dot.classList.toggle("active", index === slideIndex);
    });

    currentSlide = slideIndex;
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    goToSlide(currentSlide);
  }

  function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    goToSlide(currentSlide);
  }

  // Auto slide
  function startAutoSlide() {
    autoSlideInterval = setInterval(nextSlide, 5000);
  }

  function stopAutoSlide() {
    clearInterval(autoSlideInterval);
  }

  // Event listeners
  if (prevBtn)
    prevBtn.addEventListener("click", () => {
      stopAutoSlide();
      prevSlide();
      startAutoSlide();
    });

  if (nextBtn)
    nextBtn.addEventListener("click", () => {
      stopAutoSlide();
      nextSlide();
      startAutoSlide();
    });

  // Hover pause
  const hero = document.querySelector(".hero");
  hero.addEventListener("mouseenter", stopAutoSlide);
  hero.addEventListener("mouseleave", startAutoSlide);

  // Initialize
  createDots();
  goToSlide(0);
  startAutoSlide();
});
