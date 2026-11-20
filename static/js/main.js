
document.documentElement.classList.add("js-ready");

// Automatically update the copyright year.
const year = document.getElementById("year");

if (year) {
    year.textContent = new Date().getFullYear();
}

// Mobile navigation.
const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");

if (navToggle && nav) {
    const closeNav = () => {
        nav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.setAttribute("aria-label", "Open navigation");
    };

    navToggle.addEventListener("click", () => {
        const isOpen = nav.classList.toggle("is-open");

        navToggle.setAttribute("aria-expanded", String(isOpen));

        navToggle.setAttribute(
            "aria-label",
            isOpen ? "Close navigation" : "Open navigation"
        );
    });

    nav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeNav);
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && nav.classList.contains("is-open")) {
            closeNav();
            navToggle.focus();
        }
    });
}

const root = document.documentElement;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

// A single animation-frame update keeps the ambient light tied to the pointer.
if (finePointer && !reduceMotion) {
    let ambientFrame = 0;
    let latestPointerX = window.innerWidth * 0.77;
    let latestPointerY = window.innerHeight * 0.12;

    document.addEventListener("pointermove", (event) => {
        latestPointerX = event.clientX;
        latestPointerY = event.clientY;

        if (ambientFrame) return;

        ambientFrame = window.requestAnimationFrame(() => {
            root.style.setProperty("--pointer-x", `${(latestPointerX / window.innerWidth) * 100}%`);
            root.style.setProperty("--pointer-y", `${(latestPointerY / window.innerHeight) * 100}%`);
            ambientFrame = 0;
        });
    }, { passive: true });

    // Magnetic buttons move only a few pixels and return smoothly on exit.
    document.querySelectorAll(".magnetic").forEach((element) => {
        element.addEventListener("pointermove", (event) => {
            const bounds = element.getBoundingClientRect();
            const offsetX = (event.clientX - bounds.left - bounds.width / 2) * 0.14;
            const offsetY = (event.clientY - bounds.top - bounds.height / 2) * 0.14;

            element.style.setProperty("--mag-x", `${Math.max(-7, Math.min(7, offsetX))}px`);
            element.style.setProperty("--mag-y", `${Math.max(-5, Math.min(5, offsetY))}px`);
        });

        element.addEventListener("pointerleave", () => {
            element.style.setProperty("--mag-x", "0px");
            element.style.setProperty("--mag-y", "0px");
        });
    });

    // Project cards get a restrained, pointer-positioned light and tilt.
    document.querySelectorAll(".project-card").forEach((card) => {
        card.addEventListener("pointermove", (event) => {
            const bounds = card.getBoundingClientRect();
            if (!bounds.width || !bounds.height) return;

            const x = (event.clientX - bounds.left) / bounds.width;
            const y = (event.clientY - bounds.top) / bounds.height;
            const tiltX = (0.5 - y) * 3.2;
            const tiltY = (x - 0.5) * 3.2;

            card.style.setProperty("--card-x", `${x * 100}%`);
            card.style.setProperty("--card-y", `${y * 100}%`);
            card.style.setProperty("--tilt-x", `${tiltX.toFixed(2)}deg`);
            card.style.setProperty("--tilt-y", `${tiltY.toFixed(2)}deg`);
        });

        card.addEventListener("pointerleave", () => {
            card.style.setProperty("--tilt-x", "0deg");
            card.style.setProperty("--tilt-y", "0deg");
        });
    });
}

// Follow the pointer with a perforated film-strip negative reveal.
const portrait = document.querySelector(".portrait-card");

if (portrait) {
    let maskX = 50;
    let maskY = 50;
    let pointerInside = false;
    let maskFrame = 0;
    let latestMaskX = maskX;
    let latestMaskY = maskY;
    const portraitToggle = portrait.querySelector(".portrait-toggle");

    const positionMask = (x, y) => {
        maskX = Math.max(0, Math.min(100, x));
        maskY = Math.max(0, Math.min(100, y));

        portrait.style.setProperty("--mask-x", `${maskX}%`);
        portrait.style.setProperty("--mask-y", `${maskY}%`);
        portrait.classList.add("is-active");
    };

    const hideMask = () => portrait.classList.remove("is-active");

    if (portraitToggle) {
        portraitToggle.addEventListener("click", () => {
            const reveal = portraitToggle.getAttribute("aria-pressed") !== "true";
            portraitToggle.setAttribute("aria-pressed", String(reveal));

            if (reveal) {
                positionMask(50, 50);
            } else {
                hideMask();
            }
        });
    }

    portrait.addEventListener("pointerenter", (event) => {
        pointerInside = event.pointerType !== "touch";
    });

    portrait.addEventListener("pointermove", (event) => {
        if (event.pointerType === "touch") return;

        const bounds = portrait.getBoundingClientRect();
        if (!bounds.width || !bounds.height) return;

        latestMaskX = ((event.clientX - bounds.left) / bounds.width) * 100;
        latestMaskY = ((event.clientY - bounds.top) / bounds.height) * 100;

        if (maskFrame) return;

        maskFrame = window.requestAnimationFrame(() => {
            positionMask(latestMaskX, latestMaskY);
            maskFrame = 0;
        });
    });

    portrait.addEventListener("pointerleave", (event) => {
        if (event.pointerType !== "touch") pointerInside = false;
        const touchRevealIsOpen = portraitToggle?.getAttribute("aria-pressed") === "true";
        if (!portrait.matches(":focus-within") && !touchRevealIsOpen) hideMask();
    });

    portrait.addEventListener("focus", () => positionMask(50, 50));

    portrait.addEventListener("blur", () => {
        const touchRevealIsOpen = portraitToggle?.getAttribute("aria-pressed") === "true";
        if (!pointerInside && !touchRevealIsOpen) hideMask();
    });

    portrait.addEventListener("keydown", (event) => {
        const step = event.shiftKey ? 12 : 6;
        let nextX = maskX;
        let nextY = maskY;

        if (event.key === "ArrowLeft") nextX -= step;
        else if (event.key === "ArrowRight") nextX += step;
        else if (event.key === "ArrowUp") nextY -= step;
        else if (event.key === "ArrowDown") nextY += step;
        else return;

        event.preventDefault();
        positionMask(nextX, nextY);
    });
}

// Mark the section nearest the reading line in the navigation.
if (nav && "IntersectionObserver" in window) {
    const navLinks = Array.from(nav.querySelectorAll('a[href^="#"]'));
    const sections = navLinks
        .map((link) => document.querySelector(link.getAttribute("href")))
        .filter(Boolean);
    const visibility = new Map();

    const setActiveSection = () => {
        const current = Array.from(visibility.entries())
            .filter(([, entry]) => entry.isIntersecting)
            .sort((a, b) => b[1].intersectionRatio - a[1].intersectionRatio)[0];

        navLinks.forEach((link) => {
            if (current && link.getAttribute("href") === `#${current[0].id}`) {
                link.setAttribute("aria-current", "location");
            } else {
                link.removeAttribute("aria-current");
            }
        });
    };

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => visibility.set(entry.target, entry));
        setActiveSection();
    }, {
        rootMargin: "-22% 0px -58% 0px",
        threshold: [0, 0.15, 0.35, 0.6]
    });

    sections.forEach((section) => navObserver.observe(section));
}

// Reveal sections as they enter the viewport.
const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window && revealItems.length) {
    const observer = new IntersectionObserver(
        (entries, currentObserver) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    currentObserver.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12
        }
    );

    revealItems.forEach((item) => observer.observe(item));
} else {
    // Fallback for browsers without IntersectionObserver.
    revealItems.forEach((item) => item.classList.add("is-visible"));
}
