// --- Advanced Visual Engine Logic (Modular Lock Sequence) ---

document.addEventListener('DOMContentLoaded', () => {
    const visualEngine = document.querySelector('.visual-engine-container');

    // Only run if elements exist
    if (visualEngine) {
        const svgRing = document.querySelector('.progress-ring');
        const levelDisplay = document.getElementById('level-display');
        const trackCards = document.querySelectorAll('.track-card');
        const lockContainer = document.querySelector('.lock-icon-container'); // New Container

        if (!svgRing) return;

        // Configuration
        const radius = 160;
        const centerX = 200;
        const centerY = 200;
        const totalSegments = 10;
        const gapDegrees = 4;
        const segmentDegrees = (360 / totalSegments) - gapDegrees;

        // Clear initial static segments AND any segments from other scripts
        const initialSegments = svgRing.querySelectorAll('.ring-segment, .segment-path');
        initialSegments.forEach(el => el.remove());

        // Helper: Describe Arc
        function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
            var angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
            return {
                x: centerX + (radius * Math.cos(angleInRadians)),
                y: centerY + (radius * Math.sin(angleInRadians))
            };
        }

        function describeArc(x, y, radius, startAngle, endAngle) {
            var start = polarToCartesian(x, y, radius, endAngle);
            var end = polarToCartesian(x, y, radius, startAngle);
            var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
            var d = ["M", start.x, start.y, "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y].join(" ");
            return d;
        }

        // Generate Segments
        const segments = [];
        for (let i = 0; i < totalSegments; i++) {
            const startAngle = (i * (segmentDegrees + gapDegrees)) + gapDegrees / 2;
            const endAngle = startAngle + segmentDegrees;

            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            // No +90 offset, starts at 12 o'clock
            path.setAttribute("d", describeArc(centerX, centerY, radius, startAngle, endAngle));

            // Classes & Attributes
            path.classList.add("segment-path");

            // VISUAL WEIGHT LOGIC: Segments 9 & 10 (Indices 8 & 9)
            if (i === 9) { // 10th Segment (Elite)
                path.style.stroke = "#ffffff";
                path.style.strokeWidth = "55px";
                path.style.filter = "drop-shadow(0 0 5px rgba(255, 255, 255, 0.5))"; // Base white glow
            } else if (i === 8) { // 9th Segment (Performance)
                path.style.stroke = "var(--accent-neon)";
                path.style.strokeWidth = "55px";
                path.style.filter = "drop-shadow(0 0 5px rgba(140, 198, 63, 0.4))"; // Base green glow
            } else {
                path.setAttribute("stroke", "rgba(255,255,255,0.4)");
                path.style.strokeWidth = "40px";
                path.style.filter = "none";
            }

            path.setAttribute("data-index", i + 1);
            svgRing.appendChild(path);
            segments.push(path);
        }

        // --- Sequence Logic ---
        let currentIndex = 0;
        let isPaused = false;

        // Initial Lock State
        if (lockContainer) {
            lockContainer.classList.add('locked');
            lockContainer.classList.remove('unlocked');
        }

        const runSequence = () => {
            if (!document.body.contains(visualEngine)) return;
            if (isPaused) return;

            // Update Number/Text Logic
            const displayNum = currentIndex + 1;

            if (displayNum === 9) {
                levelDisplay.innerText = "PERFORMANCE";
                levelDisplay.style.fontSize = "2.2rem";
                levelDisplay.style.letterSpacing = "-1px";
            } else if (displayNum === 10) {
                levelDisplay.innerText = "ELITE";
                levelDisplay.style.fontSize = "4.5rem";
                levelDisplay.style.letterSpacing = "0px";
            } else {
                levelDisplay.innerText = displayNum < 10 ? `0${displayNum}` : displayNum;
                levelDisplay.style.fontSize = "8rem";
                levelDisplay.style.letterSpacing = "0px";
            }

            // Segments Logic
            segments.forEach((seg, i) => {
                const isAdvanced = (i >= 8);
                const isElite = (i === 9);
                const baseWidth = isAdvanced ? '55px' : '40px';
                const activeWidth = isAdvanced ? '65px' : '45px';

                if (i <= currentIndex) {
                    seg.classList.add('active');
                    seg.style.opacity = '1';
                    seg.style.strokeWidth = activeWidth;

                    if (isElite) {
                        seg.style.stroke = "#ffffff";
                        seg.style.filter = "drop-shadow(0 0 20px rgba(255, 255, 255, 1))";
                    } else {
                        seg.style.stroke = "var(--accent-neon)";
                        seg.style.filter = "drop-shadow(0 0 15px rgba(140, 198, 63, 0.8))";
                    }
                } else {
                    seg.classList.remove('active');
                    seg.style.opacity = isAdvanced ? '0.5' : '0.3';
                    seg.style.strokeWidth = baseWidth;

                    if (isElite) {
                        seg.style.stroke = "#ffffff";
                        seg.style.filter = "drop-shadow(0 0 5px rgba(255, 255, 255, 0.3))";
                    } else if (i === 8) {
                        seg.style.stroke = "var(--accent-neon)";
                        seg.style.filter = "drop-shadow(0 0 5px rgba(140, 198, 63, 0.3))";
                    } else {
                        seg.style.stroke = "rgba(255,255,255,0.4)";
                        seg.style.filter = "none";
                    }
                }
            });

            // Step 8: Trigger Lock Animation
            if (displayNum === 8) {
                isPaused = true;
                setTimeout(() => {
                    // Shake
                    lockContainer.classList.add('shaking');

                    setTimeout(() => {
                        // Open
                        lockContainer.classList.remove('shaking');
                        lockContainer.classList.remove('locked');
                        lockContainer.classList.add('unlocked');

                        setTimeout(() => {
                            // Resume & Close
                            lockContainer.classList.remove('unlocked');
                            lockContainer.classList.add('locked');

                            isPaused = false;
                            currentIndex++;
                            runSequence();
                        }, 1000); // 1s wait at unlock state
                    }, 500); // 0.5s shake duration
                }, 400); // Slight pause before lock appears
                return;
            }

            // Cards Logic
            if (displayNum === 9) {
                const cardP = document.getElementById('card-performance');
                if (cardP) cardP.classList.add('active');
            } else if (displayNum === 10) {
                const cardE = document.getElementById('card-elite');
                if (cardE) cardE.classList.add('active');
            } else {
                document.querySelectorAll('.track-card').forEach(c => c.classList.remove('active'));
            }

            // Advance Loop
            currentIndex++;
            if (currentIndex >= totalSegments) {
                currentIndex = 0;
            }

            // Scheduling
            let speed = 400;
            if (currentIndex >= 8) speed = 800; // Slow down for 9 and 10

            setTimeout(runSequence, speed);
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    runSequence();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(visualEngine);
    }
});
