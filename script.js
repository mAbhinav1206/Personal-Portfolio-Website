document.addEventListener("DOMContentLoaded", () => {

    /* ================= HAMBURGER MENU ================= */
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");

    if (hamburger && navLinks) {
        hamburger.addEventListener("click", () => {
            hamburger.classList.toggle("active");
            navLinks.classList.toggle("active");
        });
    }

    /* ================= TYPING EFFECT ================= */
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
        if (!typingText) return;

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

        setTimeout(typeEffect, isDeleting ? 60 : 100);
    }
    typeEffect();

    /* ================= SCROLL REVEAL ================= */
    const reveals = document.querySelectorAll(".reveal");

    if (reveals.length) {
        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("active");
                    }
                });
            },
            { threshold: 0.2 }
        );

        reveals.forEach(el => observer.observe(el));
    }

    /* ================= HERO ORBIT ================= */
    const orbitItems = document.querySelectorAll(".orbit-item");

    if (orbitItems.length) {
        let angle = 0;

        function getRadius() {
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

    /* ================= 3D CURSOR TILT (DESKTOP ONLY) ================= */
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
    if (typeof emailjs !== "undefined") {
        emailjs.init("l6eAlSEiFQbx76z8Z");

        const form = document.getElementById("contact-form");

        if (form) {
            form.addEventListener("submit", function (e) {
                e.preventDefault();

                const button = form.querySelector(".submit-btn");
                button.textContent = "Sending...";
                button.disabled = true;

                emailjs.sendForm(
                    "service_co1su1b",
                    "template_2yf44gp",
                    form
                )
                    .then(() => {
                        button.textContent = "Sent ✔";
                        form.reset();

                        setTimeout(() => {
                            button.textContent = "Send Message";
                            button.disabled = false;
                        }, 2500);
                    })
                    .catch((error) => {
                        console.error("EmailJS Error:", error);
                        button.textContent = "Failed ❌";
                        button.disabled = false;
                    });
            });
        }
    } else {
        console.error("EmailJS not loaded");
    }

});

/* ================= PROJECT MODAL ================= */

const projects = {
    1: {
        title: "Assignment Portal",
        image: "Assets/project1.png",
        description: "A full-stack assignment submission portal with authentication and email notifications.",
        tech: ["HTML", "CSS", "JavaScript", "Node.js", "MongoDB"],
        live: "#",
        git: "#"
    },
    2: {
        title: "Expense Tracker",
        image: "Assets/project2.png",
        description: "Track daily expenses with charts and persistent storage using MERN stack.",
        tech: ["React", "Node.js", "MongoDB"],
        live: "#",
        git: "#"
    },
    3: {
        title: "Portfolio Website",
        image: "Assets/project3.png",
        description: "Animated personal portfolio with orbit effects, EmailJS contact form and smooth UX.",
        tech: ["HTML", "CSS", "JavaScript"],
        live: "#",
        git: "#"
    }
};

const modal = document.getElementById("projectModal");
const modalImage = document.getElementById("modalImage");
const modalTitle = document.getElementById("modalTitle");
const modalDescription = document.getElementById("modalDescription");
const modalTech = document.getElementById("modalTech");
const modalLive = document.getElementById("modalLive");
const modalGit = document.getElementById("modalGit");

document.querySelectorAll(".project-card").forEach(card => {
    card.addEventListener("click", () => {
        const data = projects[card.dataset.project];

        modalImage.src = data.image;
        modalTitle.textContent = data.title;
        modalDescription.textContent = data.description;
        modalLive.href = data.live;
        modalGit.href = data.git;

        modalTech.innerHTML = "";
        data.tech.forEach(t => {
            const span = document.createElement("span");
            span.textContent = t;
            modalTech.appendChild(span);
        });

        modal.classList.add("active");
    });
});

document.querySelector(".close-modal").addEventListener("click", () => {
    modal.classList.remove("active");
});

modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.classList.remove("active");
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") modal.classList.remove("active");
});
