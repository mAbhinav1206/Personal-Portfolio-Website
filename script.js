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
    "AI Enthusiast"
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

// Scroll-reveal
const reveals = document.querySelectorAll(".reveal");

const Observer = new IntersectionObserver(
    (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
            }
        });
    },
    {
        threshold: 0.2
    }
);

reveals.forEach(el => Observer.observe(el));

/* ================= HERO ORBIT ================= */

const orbitItems = document.querySelectorAll(".orbit-item");

if (orbitItems.length) {
    let angle = 0;

    function getRadius() {
        // You can tweak the breakpoint if you want
        return window.innerWidth <= 768 ? 150 : 180;
    }

    function rotateOrbit() {
        const radius = getRadius();
        const step = (2 * Math.PI) / orbitItems.length;

        orbitItems.forEach((item, index) => {
            const a = angle + index * step;
            const x = Math.cos(a) * radius;
            const y = Math.sin(a) * radius;

            item.style.transform =
                `translate(-50%, -50%) translate(${x}px, ${y}px)`;
        });

        angle += 0.008;
        requestAnimationFrame(rotateOrbit);
    }

    rotateOrbit();
}

/* ================= 3D CURSOR EFFECT (DESKTOP ONLY) ================= */

const orbitWrapper = document.querySelector(".orbit-wrapper");
const tiltLayer = document.querySelector(".orbit-tilt");

const isDesktop =
    window.matchMedia("(hover: hover) and (pointer: fine)").matches;

if (orbitWrapper && tiltLayer && isDesktop) {
    orbitWrapper.addEventListener("mousemove", (e) => {
        const rect = orbitWrapper.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const rotateY = ((x / rect.width) - 0.5) * 14;
        const rotateX = -((y / rect.height) - 0.5) * 14;

        tiltLayer.style.transform =
            `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    orbitWrapper.addEventListener("mouseleave", () => {
        tiltLayer.style.transform = "rotateX(0deg) rotateY(0deg)";
    });
}

/* ================= EMAILJS CONTACT FORM ================= */

(function () {
    emailjs.init("l6eAlSEiFQbx76z8Z"); // 👈 paste public key here
})();

const form = document.getElementById("contact-form");

if (form) {
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const button = form.querySelector(".submit-btn");
        button.textContent = "Sending...";
        button.disabled = true;

        emailjs.sendForm(
            "service_04prk4b",   // 👈 service ID
            "template_2yf44gp",  // 👈 template ID
            this
        ).then(
            () => {
                button.textContent = "Sent ✔";
                form.reset();

                setTimeout(() => {
                    button.textContent = "Send Message";
                    button.disabled = false;
                }, 2500);
            },
            (error) => {
                console.error("EmailJS Error:", error);
                button.textContent = "Failed ❌";
                button.disabled = false;
            }
        );
    });
}

