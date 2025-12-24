const cards = document.querySelectorAll(".profile-card");

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = 1;
            entry.target.style.transform = "translateY(0)";
        }
    });
}, { threshold: 0.2 });

cards.forEach(card => {
    card.style.opacity = 0;
    card.style.transform = "translateY(100px)";
    observer.observe(card);
});

// HAMBURGER MENU
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");

hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navLinks.classList.toggle("active");
});

// Typing Effect in Hero Section
const words = [
    "Full Stack Web Developer",
    "Coding Enthusiast",
    "Learning AI"
];

const typingText = document.getElementById("typing-text");

let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
    const currentWord = words[wordIndex];

    if (!isDeleting) {
        typingText.textContent = currentWord.slice(0, charIndex + 1);
        charIndex++;

        if (charIndex === currentWord.length) {
            setTimeout(() => isDeleting = true, 1500);
        }
    } else {
        typingText.textContent = currentWord.slice(0, charIndex - 1);
        charIndex--;

        if (charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
        }
    }

    const speed = isDeleting ? 60 : 100;
    setTimeout(typeEffect, speed);
}

typeEffect();
