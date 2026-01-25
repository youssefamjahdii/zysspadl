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
    // --- Events Racket Advanced Logic (Float & Hold & Glow) ---
    const eventsRacket = document.getElementById('eventsRacket');
    const heroTextContainer = document.querySelector('.events-hero-text-container'); // Need to ensure this class exists or use existing
    // Actually let's look for the text container in events.html. It's .glass-hero-text inside .section-header.
    // Better selector:
    const eventsText = document.querySelector('.events-page .glass-hero-text') || document.querySelector('.section-header .glass-hero-text');

    if (eventsRacket) {
        let currentX = 0;
        let currentY = 0;
        let targetX = 0;
        let targetY = 0; // Vertical target
        let isHovering = false;
        let time = 0;

        // Mouse Tracking
        document.addEventListener('mousemove', (e) => {
            if (!isHovering) return;
            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;

            // Map X: +/- 40vw
            const xRatio = (clientX / innerWidth - 0.5) * 2;
            targetX = xRatio * (innerWidth * 0.4);

            // Map Y: +/- 30vh (constrained to hero roughly)
            // Center of screen is 0. 
            const yRatio = (clientY / innerHeight - 0.5) * 2;
            targetY = yRatio * (innerHeight * 0.3); // +/- 30% of viewport height
        });

        // Interaction States
        eventsRacket.addEventListener('mouseenter', () => {
            isHovering = true;
            eventsRacket.style.cursor = 'grab';
        });

        eventsRacket.addEventListener('mouseleave', () => {
            isHovering = false;
            eventsRacket.style.cursor = 'default';
        });

        // Animation Loop
        function animateRacket() {
            time += 0.03; // Float speed

            if (isHovering) {
                // "Holding" state: Smoothly follow mouse
                currentX += (targetX - currentX) * 0.1;
                currentY += (targetY - currentY) * 0.1;
            } else {
                // "Floating" state: Sticky position + float
                const floatOffset = Math.sin(time) * 15;
                // We apply float on top of the LAST position (currentY should be stable base)
                // Actually to make it "stick", currentY remains as the base. 
                // We calculate a RENDER Y which includes float.
                // But if we modify currentY, it drifts. 
                // Alternative: TargetY stays at last known input. CurrentY lerps to TargetY + Float.
                // If not hovering, TargetY is constant (last mouse pos).

                const floatY = Math.sin(time) * 10;
                currentY += ((targetY + floatY) - currentY) * 0.05;
            }

            // Apply Transform
            const rotateDeg = (currentX / window.innerWidth) * 10;
            eventsRacket.style.transform = `translate(calc(-50% + ${currentX}px), calc(-50% + ${currentY}px)) rotate(${rotateDeg}deg)`;

            requestAnimationFrame(animateRacket);
        }

        animateRacket();
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
