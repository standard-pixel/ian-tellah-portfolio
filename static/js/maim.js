
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
    navToggle.addEventListener("click", () => {
        const isOpen = nav.classList.toggle("is-open");

        navToggle.setAttribute("aria-expanded", String(isOpen));

        navToggle.setAttribute(
            "aria-label",
            isOpen ? "Close navigation" : "Open navigation"
        );
    });

    nav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            nav.classList.remove("is-open");

            navToggle.setAttribute("aria-expanded", "false");
            navToggle.setAttribute("aria-label", "Open navigation");
        });
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
