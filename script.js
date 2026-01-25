// ZYSS Padel - Interactions & Animations V2

document.addEventListener('DOMContentLoaded', () => {

    // --- Scroll Reveal Animations ---
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // --- Header Scroll Effect ---
    const header = document.getElementById('header');

    // --- Header Scroll Effect & Parallax ---
    // Handled in optimized scroll loop below
    const parallaxImages = document.querySelectorAll('.matrix-img');


    // --- Mouse Move Tilt (Optional) ---
    // HERO RACKET 3D PARALLAX
    const heroRacket = document.getElementById('heroRacket');
    const heroRacket2 = document.getElementById('heroRacket2');

    if (heroRacket && heroRacket2) {
        document.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;

            // Calculate mouse position relative to center (-1 to 1)
            const xPos = (clientX / innerWidth - 0.5) * 2;
            const yPos = (clientY / innerHeight - 0.5) * 2;

            // Rotation sensitivity
            const rotateX = yPos * -15; // Invert Y for natural tilt
            const rotateY = xPos * 15;

            // Racket 1: Standard
            heroRacket.style.transform = `
                translateX(-50%)
                perspective(1000px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                scale3d(1.05, 1.05, 1.05)
            `;

            // Racket 2: Mirrored (scaleX -1) and maybe inverted rotation for symmetry?
            // Actually, usually you want them to look at the mouse together.
            heroRacket2.style.transform = `
                translateX(-50%)
                scaleX(-1)
                perspective(1000px)
                rotateX(${rotateX}deg)
                rotateY(${-rotateY}deg) /* Invert Y rotation for mirrored feel */
                scale3d(1.05, 1.05, 1.05)
            `;
        });

        // Reset on mouse leave (optional)
        document.addEventListener('mouseleave', () => {
            heroRacket.style.transform = `
                translateX(-50%)
                perspective(1000px)
                rotateX(0deg)
                rotateY(0deg)
                scale3d(1, 1, 1)
            `;
            heroRacket2.style.transform = `
                translateX(-50%)
                scaleX(-1)
                perspective(1000px)
                rotateX(0deg)
                rotateY(0deg)
                scale3d(1, 1, 1)
            `;
        });
    }

    // --- Custom Glow Cursor ---
    // --- Custom Glow Cursor (with Trailing Effect) ---
    const cursor = document.querySelector('.custom-cursor');
    if (cursor) {
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let cursorX = window.innerWidth / 2;
        let cursorY = window.innerHeight / 2;

        // Track real mouse position
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            if (!document.body.classList.contains('cursor-active')) {
                document.body.classList.add('cursor-active');
                cursor.style.opacity = '1';
            }
        });

        // Loop for fluid movement (Linear Interpolation)
        function animateCursor() {
            // LERP: Move 100% of the distance towards target per frame (Instant)
            const ease = 1;

            cursorX += (mouseX - cursorX) * ease;
            cursorY += (mouseY - cursorY) * ease;

            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';

            requestAnimationFrame(animateCursor);
        }

        // Start loop
        animateCursor();

        // Hover Effect Logic
        const hoverTags = 'a, button, .matrix-card, .cta-btn, .glass-card, .partner-logo';
        document.addEventListener('mouseover', (e) => {
            if (e.target.closest(hoverTags)) {
                cursor.classList.add('hovered');
            }
        });
        document.addEventListener('mouseout', (e) => {
            if (e.target.closest(hoverTags)) {
                cursor.classList.remove('hovered');
            }
        });
    }

    // --- Dynamic Text Reveal (Removed per user request) ---
    // Kept static for reliability.

    // --- Optimized Scroll Handler (Throttled via rAF) ---
    let isScrolling = false;

    function handleScroll() {
        const scrollY = window.scrollY;

        // Header
        if (header) {
            if (scrollY > 50) {
                header.classList.add('sticky');
            } else {
                header.classList.remove('sticky');
            }
        }

        // Parallax
        parallaxImages.forEach(img => {
            if (!img.parentElement) return;
            const rect = img.parentElement.getBoundingClientRect();
            // Only animate if in viewport to save performance
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const elementCenter = rect.top + rect.height / 2;
                const viewCenter = window.innerHeight / 2;
                const distance = viewCenter - elementCenter;
                const translateY = distance * 0.1;
                img.style.transform = `scale(1.1) translateY(${translateY}px)`;
            }
        });
    }

    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            window.requestAnimationFrame(() => {
                handleScroll();
                isScrolling = false;
            });
            isScrolling = true;
        }
    });

});
