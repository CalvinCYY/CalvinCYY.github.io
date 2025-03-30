document.addEventListener('DOMContentLoaded', function() {

    const header = document.getElementById('main-header');
    const nav = document.getElementById('main-nav');
    const navLinks = nav.querySelectorAll('a');
    const sections = document.querySelectorAll('.content-section');
    const menuToggle = document.getElementById('menu-toggle');
    const backToTopButton = document.getElementById('back-to-top');
    const currentYearSpan = document.getElementById('current-year');
    const heroContent = document.querySelector('.hero-content'); // For initial load animation

    // --- Initial Hero Animation ---
    if (heroContent) {
        // No extra JS needed if using pure CSS animation on load
    }

    // --- Update Copyright Year ---
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // --- Header Style Change on Scroll ---
    function handleScroll() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Back to Top Button Visibility (using scrollY)
        if (window.scrollY > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    }
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check in case page loads scrolled

    // --- Mobile Menu Toggle ---
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            menuToggle.querySelector('i').classList.toggle('fa-bars');
            menuToggle.querySelector('i').classList.toggle('fa-times');
            // Optional: Prevent body scroll when menu is open
            document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
        });
    }

    // --- Close Mobile Menu on Link Click or Outside Click ---
    function closeMobileMenu() {
        if (nav.classList.contains('active')) {
            nav.classList.remove('active');
            menuToggle.querySelector('i').classList.remove('fa-times');
            menuToggle.querySelector('i').classList.add('fa-bars');
            document.body.style.overflow = '';
        }
    }

    navLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // Close menu if clicking outside of it (optional but good UX)
    document.addEventListener('click', function(event) {
        const isClickInsideNav = nav.contains(event.target);
        const isClickOnToggle = menuToggle.contains(event.target);

        if (!isClickInsideNav && !isClickOnToggle && nav.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // --- Active Link Highlighting on Scroll (Using Intersection Observer) ---
    const observerOptions = {
        root: null,
        rootMargin: `-${header.offsetHeight}px 0px -50% 0px`, // Adjust trigger point
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        if (section.id) { // Only observe sections with IDs
            sectionObserver.observe(section);
        }
    });

     // --- Animate Elements on Scroll (Using Intersection Observer) ---
     const revealElements = document.querySelectorAll('.reveal-on-scroll');
     const revealObserverOptions = {
         root: null,
         rootMargin: '0px',
         threshold: 0.1 // Trigger when 10% is visible
     };

     const revealObserver = new IntersectionObserver((entries, observer) => {
         entries.forEach(entry => {
             if (entry.isIntersecting) {
                 entry.target.classList.add('visible');
                 observer.unobserve(entry.target); // Animate only once
             }
         });
     }, revealObserverOptions);

     revealElements.forEach(el => {
         revealObserver.observe(el);
     });

    // --- Back to Top Button Click ---
    if (backToTopButton) {
        backToTopButton.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

}); // End DOMContentLoaded