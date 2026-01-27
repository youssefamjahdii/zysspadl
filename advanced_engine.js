// --- Advanced Visual Engine Logic (Modular Lock Sequence) ---

document.addEventListener('DOMContentLoaded', () => {
    const visualEngine = document.querySelector('.visual-engine-container');

    // Only run if elements exist
    if (visualEngine) {
        const svgRing = document.querySelector('.progress-ring');
        const levelDisplay = document.getElementById('level-display');
        const trackCards = document.querySelectorAll('.track-card');

        if (!svgRing) return;

        // Configuration
        const radius = 210;
        const centerX = 250;
        const centerY = 250;
        const totalSegments = 10;
        const gapDegrees = 4;
        const segmentDegrees = (360 / totalSegments) - gapDegrees;

        // Clear initial static segments AND any segments from other scripts
        const initialSegments = svgRing.querySelectorAll('.ring-segment, .segment-path, .segment-group');
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

        // Generate Segments (LAYERED GROUP APPROACH)
        const segments = [];

        for (let i = 0; i < totalSegments; i++) {
            const startAngle = (i * (segmentDegrees + gapDegrees)) + gapDegrees / 2;
            const endAngle = startAngle + segmentDegrees;
            const dPath = describeArc(centerX, centerY, radius, startAngle, endAngle);

            // Create Group for this segment
            const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
            g.classList.add("segment-group");
            g.setAttribute("data-index", i + 1);

            // 1. Base Path (BOLD FLAT)
            const basePath = document.createElementNS("http://www.w3.org/2000/svg", "path");
            basePath.setAttribute("d", dPath);
            basePath.classList.add("segment-base");
            basePath.style.strokeLinecap = "butt"; // Flat ends ("block" look)

            // VISUAL WEIGHT LOGIC
            basePath.style.strokeWidth = "60px"; // Thick default

            if (i === 9) { // Elite
                basePath.style.stroke = "#ffffff";
                basePath.classList.add("is-elite");
            } else if (i === 8) { // Performance
                basePath.style.stroke = "var(--accent-neon)";
                basePath.classList.add("is-performance");
            } else {
                basePath.setAttribute("stroke", "rgba(255,255,255,0.15)");
            }

            g.appendChild(basePath);
            // No Highlight Path
            svgRing.appendChild(g);
            segments.push(g);
        }

        // --- Sequence Logic ---
        let currentIndex = 0;

        const runSequence = () => {
            if (!document.body.contains(visualEngine)) return;

            // Update Number/Text Logic
            const displayNum = currentIndex + 1;

            if (displayNum === 9) {
                levelDisplay.innerText = "PERFORMANCE";
                levelDisplay.style.fontSize = "2.2rem";
                levelDisplay.style.letterSpacing = "-1px";
                levelDisplay.style.color = "var(--accent-neon)";
                levelDisplay.style.textShadow = "0 0 30px var(--accent-neon)";
            } else if (displayNum === 10) {
                levelDisplay.innerText = "ELITE";
                levelDisplay.style.fontSize = "4.5rem";
                levelDisplay.style.letterSpacing = "0px";
                levelDisplay.style.color = "#fff";
                levelDisplay.style.textShadow = "0 0 40px rgba(255,255,255,0.8)";
            } else {
                levelDisplay.innerText = displayNum < 10 ? `0${displayNum}` : displayNum;
                levelDisplay.style.fontSize = "8rem";
                levelDisplay.style.letterSpacing = "0px";
                levelDisplay.style.color = "#fff";
                levelDisplay.style.textShadow = "0 0 50px rgba(140, 198, 63, 0.4)";
            }

            // Segments Logic
            segments.forEach((segGroup, i) => {
                const basePath = segGroup.querySelector('.segment-base');

                const isAdvanced = (i >= 8);
                const isElite = (i === 9);

                // Active State Logic
                if (i <= currentIndex) {
                    segGroup.classList.add('active');

                    // Width expansion
                    basePath.style.strokeWidth = isAdvanced ? "80px" : "70px"; // Huge strokes

                    // Opacity & Glow
                    basePath.style.opacity = '1';

                    if (isElite) {
                        basePath.style.stroke = "#ffffff";
                        basePath.style.filter = "drop-shadow(0 0 10px rgba(255, 255, 255, 0.5))";
                    } else {
                        basePath.style.stroke = "var(--accent-neon)";
                        basePath.style.filter = "drop-shadow(0 0 10px rgba(140, 198, 63, 0.5))";
                    }

                } else {
                    // Inactive
                    segGroup.classList.remove('active');
                    basePath.style.strokeWidth = "60px";

                    if (isElite) {
                        basePath.style.stroke = "#ffffff";
                        basePath.style.opacity = '0.2';
                        basePath.style.filter = "none";
                    } else if (i === 8) {
                        basePath.style.stroke = "var(--accent-neon)";
                        basePath.style.opacity = '0.2';
                        basePath.style.filter = "none";
                    } else {
                        basePath.style.stroke = "rgba(255,255,255,0.1)";
                        basePath.style.opacity = '1';
                        basePath.style.filter = "none";
                    }
                }
            });

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
            if (currentIndex >= 8) speed = 800;

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
