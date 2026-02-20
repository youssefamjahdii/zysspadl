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
            const yRatio = (clientY / innerHeight - 0.5) * 2;
            targetY = yRatio * (innerHeight * 0.3);
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
                currentX += (targetX - currentX) * 0.1;
                currentY += (targetY - currentY) * 0.1;
            } else {
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

    // --- Particle Effect (Antigravity Overhaul - High Inertia Swarm) ---
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const particleCount = 800; // Denser stardust
        let mouse = { x: -1000, y: -1000, active: false };

        // Navy color for dots
        const dotColor = '#051024';

        function resize() {
            const rect = canvas.parentElement.getBoundingClientRect();
            canvas.width = rect.width;
            canvas.height = rect.height;
        }

        window.addEventListener('resize', resize);
        resize();

        class Particle {
            constructor() {
                this.init();
            }

            init() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 1.0;
                this.vy = (Math.random() - 0.5) * 1.0;
                this.size = Math.random() * 1.5 + 0.5;
                this.baseAlpha = Math.random() * 0.5 + 0.3;
                this.alpha = this.baseAlpha;

                // Acceleration factors for inertia
                this.ax = 0;
                this.ay = 0;
                this.friction = 0.96; // High inertia coefficient
            }

            update() {
                if (mouse.active) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const distSq = dx * dx + dy * dy;
                    const dist = Math.sqrt(distSq);

                    if (dist < 800) {
                        const force = (800 - dist) / 800;

                        // Gravitational attraction with a 'whip' delay
                        // Acceleration based on distance
                        this.ax = (dx / dist) * force * 0.6;
                        this.ay = (dy / dist) * force * 0.6;

                        // Add swarming/orbital drift
                        this.vx += this.ax + (Math.random() - 0.5) * 0.1;
                        this.vy += this.ay + (Math.random() - 0.5) * 0.1;
                    }
                }

                // Apply physics: Velocity + Acceleration + Friction
                this.vx *= this.friction;
                this.vy *= this.friction;

                this.x += this.vx;
                this.y += this.vy;

                // Seamless Screen Wrap
                if (this.x < 0) this.x = canvas.width;
                if (this.x > canvas.width) this.x = 0;
                if (this.y < 0) this.y = canvas.height;
                if (this.y > canvas.height) this.y = 0;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = dotColor;
                ctx.globalAlpha = this.alpha;
                ctx.fill();
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        const heroSection = document.getElementById('agadir-hero');
        if (heroSection) {
            heroSection.addEventListener('mousemove', (e) => {
                const rect = canvas.getBoundingClientRect();
                mouse.x = e.clientX - rect.left;
                mouse.y = e.clientY - rect.top;
                mouse.active = true;
            });
            heroSection.addEventListener('mouseleave', () => {
                mouse.active = false;
            });
        }

        function animate() {
            // Light trailing for white background
            ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
            ctx.globalAlpha = 1;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animate);
        }
        animate();
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

    // --- Deck Carousel Logic ---
    // --- Deck Carousel Logic (Multi-Instance) ---
    const carousels = document.querySelectorAll('.deck-carousel');

    carousels.forEach((carousel, index) => {
        const deckCards = carousel.querySelectorAll('.deck-card');
        const prevBtn = carousel.querySelector('.prev-btn');
        const nextBtn = carousel.querySelector('.next-btn');

        if (deckCards.length > 0) {
            let currentIndex = 0;
            const totalCards = deckCards.length;

            function updateDeck() {
                deckCards.forEach((card, i) => {
                    card.classList.remove('active', 'prev', 'next');

                    // Calculate Circular Distance (Offset)
                    let offset = (i - currentIndex + totalCards) % totalCards;
                    // Normalize to e.g. -3 to +3 for 7 cards
                    if (offset > totalCards / 2) {
                        offset -= totalCards;
                    }

                    // Set CSS Variable for styling
                    card.style.setProperty('--offset', offset);

                    // Optional: Keep classes for specific legacy overrides if needed, 
                    // or just rely on css vars. Active is good to keep.
                    if (offset === 0) {
                        card.classList.add('active');
                    } else if (offset === -1) {
                        card.classList.add('prev');
                    } else if (offset === 1) {
                        card.classList.add('next');
                    }
                });
            }

            if (nextBtn) {
                nextBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    currentIndex = (currentIndex + 1) % totalCards;
                    updateDeck();
                });
            }

            if (prevBtn) {
                prevBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    currentIndex = (currentIndex - 1 + totalCards) % totalCards;
                    updateDeck();
                });
            }

            // Initialize this carousel
            updateDeck();
        }
    });

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
}); // This closes the main DOMContentLoaded for the scroll handler and other elements.

// Footer Magnetic Ball Logic
document.addEventListener('DOMContentLoaded', () => {
    const footer = document.querySelector('footer');
    const magneticBall = document.querySelector('.magnetic-ball');

    if (footer && magneticBall) {
        let mouseX = 0;
        let mouseY = 0;
        let ballX = 0;
        let ballY = 0;
        let isFooterHovered = false;

        footer.addEventListener('mouseenter', () => {
            isFooterHovered = true;
            magneticBall.style.opacity = '1';
        });

        footer.addEventListener('mouseleave', () => {
            isFooterHovered = false;
            magneticBall.style.opacity = '0';
        });

        footer.addEventListener('mousemove', (e) => {
            const rect = footer.getBoundingClientRect();
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;
        });

        function animateBall() {
            if (isFooterHovered) {
                // Smooth Lerp
                ballX += (mouseX - ballX) * 0.1;
                ballY += (mouseY - ballY) * 0.1;

                // Center the ball on cursor (30px is half of 60px size)
                magneticBall.style.transform = `translate(${ballX - 30}px, ${ballY - 30}px)`;
            }
            requestAnimationFrame(animateBall);
        }
        animateBall();
    }

    // Legacy Visual Engine logic removed to prevent conflicts with advanced_engine.js
});
