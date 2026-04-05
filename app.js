document.addEventListener('DOMContentLoaded', () => {

    /* --- Scroll Animations (Intersection Observer) --- */
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Unobserve after animating once for better performance
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animateElements = document.querySelectorAll('.fade-up, .fade-in-left, .fade-in-right');
    animateElements.forEach(el => observer.observe(el));


    /* --- Number Counter Animation --- */
    const counterObserverOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startCounter(entry.target);
                // Unobserve so it only counts up once
                observer.unobserve(entry.target);
            }
        });
    }, counterObserverOptions);

    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => counterObserver.observe(counter));

    function startCounter(counterElement) {
        let textTarget = counterElement.getAttribute('data-target');
        // Handle "150K" strings
        let isK = textTarget.includes('K');
        let target = isK ? parseFloat(textTarget.replace('K', '')) : +textTarget;

        const duration = 2000; // ms
        const step = target / (duration / 16); // 60fps
        
        let current = 0;
        
        const updateCounter = () => {
            current += step;
            if (current < target) {
                let displayVal = Math.ceil(current).toLocaleString();
                if(isK) displayVal += 'K';
                counterElement.innerText = displayVal;
                requestAnimationFrame(updateCounter);
            } else {
                let displayVal = target.toLocaleString();
                if(isK) displayVal += 'K';
                counterElement.innerText = displayVal;
            }
        };
        
        updateCounter();
    }

    /* --- Navbar Scroll Effect --- */
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.style.background = 'rgba(11, 17, 14, 0.9)';
                navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.5)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.03)';
                navbar.style.boxShadow = 'none';
            }
        });
    }

    /* --- Interactive Waste Calculator (Home Page Only) --- */
    const studentSlider = document.getElementById('studentSlider');
    if (studentSlider) {
        const sliderValue = document.getElementById('sliderValue');
        const calcPages = document.getElementById('calcPages');
        const calcValue = document.getElementById('calcValue');
        const calcTrees = document.getElementById('calcTrees');
        const calcNotebooks = document.getElementById('calcNotebooks');

        function updateCalculator() {
            const students = parseInt(studentSlider.value);
            
            // MATH BASED ON BUSINESS PLAN:
            // 4000 students ~ 6,00,000 pages / 10 MT
            // 10 MT sold at 5/kg = 50,000 rs to maybe 2,00,000 depending on quality
            // Trees: 240 trees per campus.
            // Notebooks: 6000 notebooks per campus.

            const ratio = students / 4000;
            
            const pagesMath = Math.round(600000 * ratio);
            const valueMath = Math.round(200000 * ratio);
            const treesMath = Math.round(240 * ratio);
            const notebooksMath = Math.round(6000 * ratio);

            sliderValue.innerText = students.toLocaleString() + " Students";
            calcPages.innerText = pagesMath.toLocaleString();
            calcValue.innerText = "₹ " + valueMath.toLocaleString();
            calcTrees.innerText = treesMath.toLocaleString();
            calcNotebooks.innerText = notebooksMath.toLocaleString();
        }

        studentSlider.addEventListener('input', updateCalculator);
        // Initialize once
        updateCalculator();
    }

});
