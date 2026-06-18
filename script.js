document.addEventListener("DOMContentLoaded", () => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const mobileViewport = window.matchMedia("(max-width: 768px)");

    /* Navigation */
    const navbar = document.getElementById("navbar");
    const hamburger = document.querySelector(".hamburger");
    const nav = document.querySelector(".navbar nav");
    const navLinks = [...document.querySelectorAll(".nav-links a")];
    let scrollTicking = false;

    /* Keep the browser's native anchor offset synchronized with the real
       floating navbar dimensions at every breakpoint. */
    const updateNavbarOffset = () => {
        if (!navbar) return;
        const rootStyles = getComputedStyle(document.documentElement);
        const anchorGap = Number.parseFloat(rootStyles.getPropertyValue("--nav-anchor-gap")) || 0;
        const offset = Math.ceil(navbar.offsetTop + navbar.offsetHeight + anchorGap);
        document.documentElement.style.setProperty("--navbar-offset", `${offset}px`);
    };

    updateNavbarOffset();
    window.addEventListener("resize", updateNavbarOffset, { passive: true });

    if (navbar && "ResizeObserver" in window) {
        new ResizeObserver(updateNavbarOffset).observe(navbar);
    }

    const closeMenu = () => {
        hamburger?.classList.remove("active");
        nav?.classList.remove("open");
        hamburger?.setAttribute("aria-expanded", "false");
        document.body.classList.remove("menu-open");
    };

    hamburger?.addEventListener("click", () => {
        const open = !nav?.classList.contains("open");
        hamburger.classList.toggle("active", open);
        nav?.classList.toggle("open", open);
        hamburger.setAttribute("aria-expanded", String(open));
        document.body.classList.toggle("menu-open", open);
    });

    const getAnchorPosition = target => {
        if (target.id === "home") return 0;
        const heading = target.querySelector(".section-heading") || target;
        const navbarOffset = Number.parseFloat(
            getComputedStyle(document.documentElement).getPropertyValue("--navbar-offset")
        ) || 0;

        return Math.max(0, window.scrollY + heading.getBoundingClientRect().top - navbarOffset);
    };

    const scrollToHash = (hash, behavior = "smooth") => {
        if (!hash || hash === "#") return;
        const target = document.getElementById(decodeURIComponent(hash.slice(1)));
        if (!target) return;

        updateNavbarOffset();
        window.scrollTo({
            top: getAnchorPosition(target),
            behavior: reducedMotion ? "auto" : behavior
        });
    };

    document.querySelectorAll('a[href^="#"]').forEach(link => {
        const hash = link.getAttribute("href");
        if (!hash || hash === "#" || link.classList.contains("skip-link")) return;

        link.addEventListener("click", event => {
            const target = document.getElementById(decodeURIComponent(hash.slice(1)));
            if (!target) return;

            event.preventDefault();
            closeMenu();
            if (window.location.hash !== hash) history.pushState(null, "", hash);
            scrollToHash(hash);
        });
    });

    /* Correct native hash restoration after layout, fonts, and images settle. */
    const alignCurrentHash = behavior => {
        if (window.location.hash) scrollToHash(window.location.hash, behavior);
    };

    requestAnimationFrame(() => requestAnimationFrame(() => alignCurrentHash("auto")));
    window.addEventListener("load", () => alignCurrentHash("auto"), { once: true });
    let hashAlignmentFrame;
    const scheduleHashAlignment = () => {
        cancelAnimationFrame(hashAlignmentFrame);
        hashAlignmentFrame = requestAnimationFrame(() => alignCurrentHash("smooth"));
    };

    window.addEventListener("popstate", scheduleHashAlignment);
    window.addEventListener("hashchange", scheduleHashAlignment);

    window.addEventListener("scroll", () => {
        if (scrollTicking) return;
        scrollTicking = true;

        requestAnimationFrame(() => {
            const currentScroll = window.scrollY;
            navbar?.classList.toggle("is-scrolled", currentScroll > 30);
            scrollTicking = false;
        });
    }, { passive: true });

    const navSections = navLinks
        .map(link => document.querySelector(link.getAttribute("href")))
        .filter(Boolean);

    const activeSectionObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            navLinks.forEach(link => {
                const active = link.getAttribute("href") === `#${entry.target.id}`;
                link.classList.toggle("active", active);
                if (active) link.setAttribute("aria-current", "page");
                else link.removeAttribute("aria-current");
            });
        });
    }, { rootMargin: "-35% 0px -58%", threshold: 0 });

    navSections.forEach(section => activeSectionObserver.observe(section));

    /* Typing effect */
    const words = ["Full Stack Web Developer", "Coder", "AI Engineer", "Freelancer"];
    const typingText = document.getElementById("typing-text");
    let wordIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function typeEffect() {
        if (!typingText) return;
        const word = words[wordIndex];
        charIndex += deleting ? -1 : 1;
        typingText.textContent = word.slice(0, charIndex);

        let delay = deleting ? 55 : 90;
        if (!deleting && charIndex === word.length) {
            deleting = true;
            delay = 1450;
        } else if (deleting && charIndex === 0) {
            deleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            delay = 300;
        }
        window.setTimeout(typeEffect, delay);
    }

    if (reducedMotion && typingText) typingText.textContent = words[0];
    else typeEffect();

    /* Scroll reveals and stagger */
    const revealElements = document.querySelectorAll(".reveal, .reveal-card");
    document.querySelectorAll(".skills-grid, .projects-grid, .profiles-grid").forEach(group => {
        group.querySelectorAll(".reveal-card").forEach((card, index) => {
            card.style.setProperty("--delay", `${index * 85}ms`);
        });
    });

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px" });

    revealElements.forEach(element => revealObserver.observe(element));

    /* Animated statistics */
    const counters = document.querySelectorAll("[data-count]");
    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const element = entry.target;
            const target = Number(element.dataset.count);
            const decimals = Number(element.dataset.decimals || 0);
            const startValue = target > 100 ? 2000 : 0;
            const duration = reducedMotion ? 1 : 1200;
            const startTime = performance.now();

            const update = now => {
                const progress = Math.min((now - startTime) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                const value = startValue + (target - startValue) * eased;
                element.textContent = value.toFixed(decimals);
                if (progress < 1) requestAnimationFrame(update);
            };

            requestAnimationFrame(update);
            observer.unobserve(element);
        });
    }, { threshold: 0.65 });

    counters.forEach(counter => counterObserver.observe(counter));

    /* Orbiting technology icons */
    const orbit = document.querySelector(".orbit");
    const orbitItems = [...document.querySelectorAll(".orbit-item")];
    let orbitAngle = 0;
    let orbitFrame;

    function renderOrbit() {
        if (!orbit || !orbitItems.length) return;
        cancelAnimationFrame(orbitFrame);
        const mobile = mobileViewport.matches;
        const radius = orbit.getBoundingClientRect().width * (mobile ? 0.36 : 0.46);
        const step = (Math.PI * 2) / orbitItems.length;

        orbitItems.forEach((item, index) => {
            const angle = orbitAngle + index * step;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            item.style.transform = `translate(-50%, -50%) translate3d(${x}px, ${y}px, 0)`;
        });

        if (!reducedMotion) {
            orbitAngle += mobile ? 0.0016 : 0.0035;
            orbitFrame = requestAnimationFrame(renderOrbit);
        }
    }

    renderOrbit();
    window.addEventListener("resize", renderOrbit, { passive: true });
    mobileViewport.addEventListener?.("change", renderOrbit);

    /* Pointer parallax and spotlights */
    const heroVisual = document.querySelector(".hero-visual");
    const tiltLayer = document.querySelector(".orbit-tilt");
    const cursorGlow = document.querySelector(".cursor-glow");

    if (finePointer && !reducedMotion) {
        window.addEventListener("pointermove", event => {
            cursorGlow?.style.setProperty("--x", `${event.clientX}px`);
            cursorGlow?.style.setProperty("--y", `${event.clientY}px`);
        }, { passive: true });

        heroVisual?.addEventListener("pointermove", event => {
            const rect = heroVisual.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width - 0.5;
            const y = (event.clientY - rect.top) / rect.height - 0.5;
            if (tiltLayer) tiltLayer.style.transform = `rotateX(${-y * 8}deg) rotateY(${x * 10}deg)`;
        });

        heroVisual?.addEventListener("pointerleave", () => {
            if (tiltLayer) tiltLayer.style.transform = "rotateX(0deg) rotateY(0deg)";
        });

        document.querySelectorAll(".project-card").forEach(card => {
            card.addEventListener("pointermove", event => {
                const rect = card.getBoundingClientRect();
                card.style.setProperty("--mouse-x", `${((event.clientX - rect.left) / rect.width) * 100}%`);
                card.style.setProperty("--mouse-y", `${((event.clientY - rect.top) / rect.height) * 100}%`);
            });
        });
    }

    /* Resume download */
    document.getElementById("downloadResume")?.addEventListener("click", () => {
        const link = document.createElement("a");
        link.href = "abhinav_mishra_resume.html";
        link.download = "Abhinav_Mishra_Resume.html";
        document.body.appendChild(link);
        link.click();
        link.remove();
    });

    /* EmailJS contact form */
    const form = document.getElementById("contact-form");
    const submitButton = form?.querySelector(".submit-btn");
    const submitLabel = submitButton?.querySelector("span");
    const formStatus = form?.querySelector(".form-status");

    if (typeof emailjs !== "undefined") emailjs.init("l6eAlSEiFQbx76z8Z");

    form?.addEventListener("submit", event => {
        event.preventDefault();

        if (typeof emailjs === "undefined") {
            if (formStatus) formStatus.textContent = "The message service is unavailable. Please email me directly.";
            return;
        }

        if (submitLabel) submitLabel.textContent = "Sending...";
        if (submitButton) submitButton.disabled = true;
        if (formStatus) formStatus.textContent = "";

        emailjs.sendForm("service_co1su1b", "template_2yf44gp", form)
            .then(() => {
                if (submitLabel) submitLabel.textContent = "Sent ✔";
                if (formStatus) formStatus.textContent = "Thanks — your message is on its way.";
                form.reset();

                window.setTimeout(() => {
                    if (submitLabel) submitLabel.textContent = "Send Message";
                    if (submitButton) submitButton.disabled = false;
                }, 2500);
            })
            .catch(error => {
                console.error("EmailJS Error:", error);
                if (submitLabel) submitLabel.textContent = "Try Again";
                if (formStatus) formStatus.textContent = "Something went wrong. Please try again or email me directly.";
                if (submitButton) submitButton.disabled = false;
            });
    });
});
