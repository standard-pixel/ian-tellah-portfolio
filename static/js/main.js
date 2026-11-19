
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

// Move a rectangular color-negative window over the portrait.
const portrait = document.querySelector(".portrait-card");

if (portrait) {
    let maskX = 50;
    let maskY = 50;
    let pointerInside = false;

    const positionMask = (x, y) => {
        maskX = Math.max(0, Math.min(100, x));
        maskY = Math.max(0, Math.min(100, y));

        portrait.style.setProperty("--mask-x", `${maskX}%`);
        portrait.style.setProperty("--mask-y", `${maskY}%`);
        portrait.classList.add("is-active");
    };

    const hideMask = () => portrait.classList.remove("is-active");

    portrait.addEventListener("pointerenter", (event) => {
        pointerInside = event.pointerType !== "touch";
    });

    portrait.addEventListener("pointermove", (event) => {
        if (event.pointerType === "touch") return;

        const bounds = portrait.getBoundingClientRect();
        if (!bounds.width || !bounds.height) return;

        positionMask(
            ((event.clientX - bounds.left) / bounds.width) * 100,
            ((event.clientY - bounds.top) / bounds.height) * 100
        );
    });

    portrait.addEventListener("pointerleave", (event) => {
        if (event.pointerType !== "touch") pointerInside = false;
        if (!portrait.matches(":focus")) hideMask();
    });

    portrait.addEventListener("focus", () => positionMask(50, 50));

    portrait.addEventListener("blur", () => {
        if (!pointerInside) hideMask();
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
