// Hamburger
const menuBtn = document.querySelector("#menu-btn");
const navbar = document.querySelector("#navbar");
menuBtn.onclick = () => {
  menuBtn.classList.toggle("fa-times");
  navbar.classList.toggle("active");
};
window.onclick = (e) => {
  if (
    !e.target.matches("#menu-btn") &&
    navbar.classList.contains("active") &&
    window.innerWidth < 901
  ) {
    navbar.classList.remove("active");
    menuBtn.classList.remove("fa-times");
  }
};

// Hero slideshow
let slideIndex = 1;
showSlides(slideIndex);
let autoSlideInterval = setInterval(() => plusSlides(1), 3850);

function plusSlides(n) {
  showSlides((slideIndex += n));
  resetAutoSlide();
}
function currentSlide(n) {
  showSlides((slideIndex = n));
  resetAutoSlide();
}
function resetAutoSlide() {
  clearInterval(autoSlideInterval);
  autoSlideInterval = setInterval(() => plusSlides(1), 3850);
}
function showSlides(n) {
  let slides = document.getElementsByClassName("slide");
  let dots = document.getElementsByClassName("dot");
  if (n > slides.length) {
    slideIndex = 1;
  }
  if (n < 1) {
    slideIndex = slides.length;
  }
  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (let i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex - 1].style.display = "block";
  slides[slideIndex - 1].classList.add("active");
  dots[slideIndex - 1].className += " active";
}

// Scroll Up Button
const scrollUpBtn = document.getElementById("scrollUp");
window.onscroll = function () {
  if (window.scrollY > 350) {
    scrollUpBtn.style.display = "block";
  } else {
    scrollUpBtn.style.display = "none";
  }
};
scrollUpBtn.onclick = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};
