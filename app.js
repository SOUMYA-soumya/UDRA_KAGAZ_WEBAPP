document.addEventListener('DOMContentLoaded', () => {

    /* ========================================
       SCROLL ANIMATIONS (Intersection Observer)
       ======================================== */
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                obs.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-up, .fade-in-left, .fade-in-right')
        .forEach(el => observer.observe(el));

    /* ========================================
       NUMBER COUNTER ANIMATION
       ======================================== */
    const counterObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startCounter(entry.target);
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.counter').forEach(c => counterObserver.observe(c));

    function startCounter(el) {
        let raw = el.getAttribute('data-target');
        let isK = raw.includes('K');
        let target = isK ? parseFloat(raw.replace('K', '')) : +raw;
        const step = target / (2000 / 16);
        let current = 0;

        const tick = () => {
            current += step;
            if (current < target) {
                el.innerText = Math.ceil(current).toLocaleString() + (isK ? 'K' : '');
                requestAnimationFrame(tick);
            } else {
                el.innerText = target.toLocaleString() + (isK ? 'K' : '');
            }
        };
        tick();
    }

    /* ========================================
       NAVBAR SCROLL EFFECT
       ======================================== */
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.style.background = 'rgba(11, 17, 14, 0.92)';
                navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.5)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.03)';
                navbar.style.boxShadow = 'none';
            }
        });
    }

    /* ========================================
       MOBILE HAMBURGER MENU
       ======================================== */
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.getElementById('navLinks');
    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navLinks.classList.toggle('open');
        });

        // Close menu when a link is clicked
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                navLinks.classList.remove('open');
            });
        });
    }

    /* ========================================
       INTERACTIVE WASTE CALCULATOR (Home Only)
       ======================================== */
    const studentSlider = document.getElementById('studentSlider');
    if (studentSlider) {
        const sliderValue = document.getElementById('sliderValue');
        const calcPages = document.getElementById('calcPages');
        const calcValue = document.getElementById('calcValue');
        const calcTrees = document.getElementById('calcTrees');
        const calcNotebooks = document.getElementById('calcNotebooks');

        function updateCalculator() {
            const students = parseInt(studentSlider.value);
            const ratio = students / 4000;

            const pages = Math.round(600000 * ratio);
            const value = Math.round(200000 * ratio);
            const trees = Math.round(240 * ratio);
            const notebooks = Math.round(6000 * ratio);

            sliderValue.innerText = students.toLocaleString() + " Students";
            calcPages.innerText = pages.toLocaleString();
            calcValue.innerText = "₹ " + value.toLocaleString();
            calcTrees.innerText = trees.toLocaleString();
            calcNotebooks.innerText = notebooks.toLocaleString();
        }

        studentSlider.addEventListener('input', updateCalculator);
        updateCalculator();
    }

    /* ========================================
       PARTICLE BACKGROUND (Subtle Floating Dots)
       ======================================== */
    const canvas = document.getElementById('particleCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const PARTICLE_COUNT = 50;

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.3;
                this.speedY = (Math.random() - 0.5) * 0.3;
                this.opacity = Math.random() * 0.3 + 0.1;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                    this.reset();
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(46, 204, 113, ${this.opacity})`;
                ctx.fill();
            }
        }

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push(new Particle());
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw connecting lines between close particles
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 150) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(46, 204, 113, ${0.05 * (1 - dist / 150)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }

            particles.forEach(p => {
                p.update();
                p.draw();
            });

            requestAnimationFrame(animateParticles);
        }

        animateParticles();
    }

});
