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
       FAQ ACCORDION
       ======================================== */
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const header = item.querySelector('.faq-header');
        header.addEventListener('click', () => {
            // Close other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            // Toggle current item
            item.classList.toggle('active');
        });
    });

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

    /* ========================================
       SPA PAGE TRANSITIONS
       ======================================== */
    const links = document.querySelectorAll('a[href]');
    
    // On load, ensure body doesn't have fading-out
    document.body.classList.remove('fading-out');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetUrl = link.getAttribute('href');
            
            // Ignore external links, mailto, wa.me, and hashes
            if (targetUrl.startsWith('http') || targetUrl.startsWith('mailto') || targetUrl.startsWith('#') || targetUrl.includes('wa.me') || link.target === '_blank') {
                return;
            }

            e.preventDefault();
            document.body.classList.add('fading-out');

            setTimeout(() => {
                window.location.href = targetUrl;
            }, 300); // match transition duration
        });
    });

    /* ========================================
       SHOPPING CART (WHATSAPP)
       ======================================== */
    const cartModal = document.getElementById('cartModal');
    const floatingCartBtn = document.getElementById('floatingCartBtn');
    if (cartModal && floatingCartBtn) {
        let cart = JSON.parse(localStorage.getItem('uki_cart')) || [];
        const closeCart = document.getElementById('closeCart');
        const cartItemsContainer = document.getElementById('cartItems');
        const cartTotalValue = document.getElementById('cartTotalValue');
        const cartBadge = document.getElementById('cartBadge');
        const checkoutBtn = document.getElementById('checkoutBtn');

        function saveCart() {
            localStorage.setItem('uki_cart', JSON.stringify(cart));
        }

        function renderCart() {
            cartItemsContainer.innerHTML = '';
            let total = 0;
            let totalQuantity = 0;

            if (cart.length === 0) {
                cartItemsContainer.innerHTML = '<p style="color:var(--text-muted); text-align:center; padding-top:2rem;">Your cart is empty.</p>';
            } else {
                cart.forEach((item, index) => {
                    total += item.price * item.quantity;
                    totalQuantity += item.quantity;
                    const itemEl = document.createElement('div');
                    itemEl.className = 'cart-item';
                    itemEl.innerHTML = `
                        <div class="cart-item-details">
                            <h4>${item.name}</h4>
                            <div class="cart-item-price">₹${item.price}</div>
                        </div>
                        <div class="cart-item-actions">
                            <button class="cart-qty-btn" onclick="updateQty(${index}, -1)">-</button>
                            <span style="font-weight:600; padding:0 0.5rem">${item.quantity}</span>
                            <button class="cart-qty-btn" onclick="updateQty(${index}, 1)">+</button>
                        </div>
                    `;
                    cartItemsContainer.appendChild(itemEl);
                });
            }

            cartTotalValue.innerText = `₹${total}`;
            cartBadge.innerText = totalQuantity;
            
            if (totalQuantity > 0) {
                floatingCartBtn.classList.add('visible');
            } else {
                floatingCartBtn.classList.remove('visible');
                cartModal.classList.remove('open');
            }
        }

        // Global functions for inline onclick handlers
        window.updateQty = (index, delta) => {
            cart[index].quantity += delta;
            if (cart[index].quantity <= 0) {
                cart.splice(index, 1);
            }
            saveCart();
            renderCart();
        };

        // Initialize Add to Cart buttons
        document.querySelectorAll('.add-to-cart').forEach(btn => {
            btn.addEventListener('click', () => {
                const name = btn.getAttribute('data-name');
                const price = parseInt(btn.getAttribute('data-price'));
                
                const existing = cart.find(i => i.name === name);
                if (existing) {
                    existing.quantity += 1;
                } else {
                    cart.push({ name, price, quantity: 1 });
                }
                
                saveCart();
                renderCart();
                
                // Show modal temporarily as feedback
                cartModal.classList.add('open');
                
                // Button feedback
                const origText = btn.innerText;
                btn.innerText = 'Added!';
                btn.style.background = 'var(--accent-green)';
                btn.style.color = 'black';
                setTimeout(() => {
                    btn.innerText = origText;
                    btn.style.background = '';
                    btn.style.color = '';
                }, 1000);
            });
        });

        floatingCartBtn.addEventListener('click', () => {
            cartModal.classList.add('open');
        });

        closeCart.addEventListener('click', () => {
            cartModal.classList.remove('open');
        });

        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) return;
            let message = "Hi UKI! I'd like to place an order from the Nirmaan Store:\n\n";
            let total = 0;
            cart.forEach(item => {
                message += `- ${item.name} (x${item.quantity}) : ₹${item.price * item.quantity}\n`;
                total += item.price * item.quantity;
            });
            message += `\n*Total: ₹${total}*\n\nPlease let me know the payment and delivery details.`;
            
            // Placeholder number
            const waNumber = "917008000000"; 
            const url = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
            window.open(url, '_blank');
        });

        // Initialize
        renderCart();
    }

});
