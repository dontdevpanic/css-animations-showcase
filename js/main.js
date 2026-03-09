// ══════════════════════════════════════════════
//  CSS ANIMATIONS SHOWCASE — main.js
//  DevPanicZone | vanilla JS, no dependencies
// ══════════════════════════════════════════════

// ── Paletten — wechseln pro Loop, alle Sections betroffen ──
const palettes = [
    {
        hero: { bg: "#3d1f0d", color: "#f2e9d0" },
        sectionDark: { bg: "#3d1f0d", color: "#f2e9d0" },
        sectionMid: { bg: "#2a1208", color: "#f2e9d0" },
        sectionAccent: { bg: "#c8a96e", color: "#3d1f0d" },
        inlineNav: { bg: "#1a0c05", color: "#f2e9d0" },
    },
    {
        hero: { bg: "#f2e9d0", color: "#3d1f0d" },
        sectionDark: { bg: "#e8dfc4", color: "#3d1f0d" },
        sectionMid: { bg: "#d4c9a8", color: "#3d1f0d" },
        sectionAccent: { bg: "#3d1f0d", color: "#f2e9d0" },
        inlineNav: { bg: "#c8bfa4", color: "#3d1f0d" },
    },
    {
        hero: { bg: "#c8a96e", color: "#3d1f0d" },
        sectionDark: { bg: "#b8955a", color: "#f2e9d0" },
        sectionMid: { bg: "#3d1f0d", color: "#c8a96e" },
        sectionAccent: { bg: "#f2e9d0", color: "#3d1f0d" },
        inlineNav: { bg: "#9c7a42", color: "#f2e9d0" },
    },
];

let loopCount = 0;

// ── DOM-Referenzen ──
const main = document.getElementById("main-content");
const intro = document.getElementById("intro");

// ── INTRO ──
document.body.classList.add("intro-active");

if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    intro.style.display = "none";
    document.body.classList.remove("intro-active");
} else {
    const INTRO_DURATION = 2900;

    setTimeout(() => {
        intro.classList.add("intro--exit");
        intro.addEventListener("animationend", () => {
            intro.style.display = "none";
            document.body.classList.remove("intro-active");
        }, { once: true });
    }, INTRO_DURATION);
}

// ══════════════════════════════════════════════
//  ENDLESS LOOP — Pre-Klon + Post-Klon
//
//  Stack im DOM:
//  [ pre-clone ]   ← eingefügt vor den Originals
//  [ originals ]   ← der echte Inhalt
//  [ post-clone ]  ← angehängt nach den Originals
//
//  Scroll startet bei originalHeight (zeigt Originals)
//  Reset nach oben:  scrollY < originalHeight        → + originalHeight
//  Reset nach unten: scrollY >= 2 × originalHeight   → - originalHeight
// ══════════════════════════════════════════════

const originals = Array.from(main.children);

// Post-Klon (nach unten scrollen)
originals.forEach(el => {
    const clone = el.cloneNode(true);
    clone.classList.add("is-clone", "is-clone--post");
    main.appendChild(clone);
});

// Pre-Klon (nach oben scrollen)
originals.forEach(el => {
    const clone = el.cloneNode(true);
    clone.classList.add("is-clone", "is-clone--pre");
    main.insertBefore(clone, main.firstChild);
});

// Hilfsfunktion: Gesamthöhe der Original-Elemente
function getOriginalHeight() {
    let h = 0;
    originals.forEach(el => { h += el.offsetHeight; });
    return h;
}

// Scroll-Startposition: mitten im Stack (zeigt Originals)
// Nach dem DOM-Insert warten bis Layout berechnet ist
window.addEventListener("load", () => {
    const h = getOriginalHeight();
    window.scrollTo({ top: h, behavior: "instant" });
});

// Scroll-Reset in beide Richtungen
let isResetting = false;

window.addEventListener("scroll", () => {
    if (isResetting) return;
    const h = getOriginalHeight();

    if (window.scrollY < h) {
        // Obere Grenze erreicht → nach unten springen
        isResetting = true;
        window.scrollTo({ top: window.scrollY + h, behavior: "instant" });
        isResetting = false;
    } else if (window.scrollY >= h * 2) {
        // Untere Grenze erreicht → nach oben springen
        isResetting = true;
        window.scrollTo({ top: window.scrollY - h, behavior: "instant" });
        isResetting = false;
    }
}, { passive: true });

// ══════════════════════════════════════════════
//  FARBWECHSEL — wenn Hero sichtbar wird
// ══════════════════════════════════════════════

function applyPalette(index) {
    const p = palettes[index % palettes.length];

    document.querySelectorAll(".hero").forEach(el => {
        el.style.background = p.hero.bg;
        el.style.color = p.hero.color;
    });
    document.querySelectorAll(".section--dark").forEach(el => {
        el.style.background = p.sectionDark.bg;
        el.style.color = p.sectionDark.color;
    });
    document.querySelectorAll(".section--mid").forEach(el => {
        el.style.background = p.sectionMid.bg;
        el.style.color = p.sectionMid.color;
    });
    document.querySelectorAll(".section--accent").forEach(el => {
        el.style.background = p.sectionAccent.bg;
        el.style.color = p.sectionAccent.color;
    });
    document.querySelectorAll(".inline-nav").forEach(el => {
        el.style.background = p.inlineNav.bg;
    });
    document.querySelectorAll(".inline-nav a").forEach(el => {
        el.style.color = p.inlineNav.color;
    });
}

applyPalette(0);

// Hero-Observer: beim ersten Erscheinen ignorieren,
// danach bei jedem Hero-Eintritt Palette wechseln
let heroVisitCount = 0;

const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        heroVisitCount++;
        if (heroVisitCount === 1) return; // Startpalette, kein Wechsel
        loopCount++;
        applyPalette(loopCount);
    });
}, { threshold: 0.4 });

document.querySelectorAll(".hero").forEach(el => heroObserver.observe(el));

// ══════════════════════════════════════════════
//  SCROLL-ANIMATIONEN
// ══════════════════════════════════════════════

const animatedSelectors = [
    ".reveal",
    ".stagger-item",
    ".slide-in-left",
    ".slide-in-right",
    ".typewriter",
].join(", ");

const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const el = entry.target;
        const isClone = el.closest(".is-clone") !== null;

        if (entry.isIntersecting) {
            el.classList.add("is-visible");
            if (!isClone) {
                scrollObserver.unobserve(el);
            }
        } else if (isClone) {
            // Klon zurücksetzen → Animation spielt beim nächsten Loop wieder
            el.classList.remove("is-visible");
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll(animatedSelectors).forEach(el => {
    scrollObserver.observe(el);
});