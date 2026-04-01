/**
 * Hairsalon OKAN - Enhanced Edition
 * 
 * Features:
 * - Slide-in booking panel from right
 * - Professional Form Data Capture
 * - Optimized Animations & Scroll Performance
 * - Mobile-first responsive enhancements
 */

document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.navbar');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav ul a');
    const scrollProgress = document.querySelector('.scroll-progress');
    const modal = document.getElementById('booking-modal');
    const openModalBtns = document.querySelectorAll('.open-booking');
    const closeModalBtn = document.querySelector('.close-modal');
    const modalCloseArea = document.querySelector('.modal-close-area');
    const appointmentForm = document.getElementById('appointment-form');
    const formSuccess = document.getElementById('form-success');
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('nav ul');

    // Set minimum date for booking
    const dateInput = document.querySelector('input[name="date"]');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }

    // --- 1. Navbar Scroll Behavior ---
    let lastScroll = 0;
    const handleScroll = () => {
        const currentScroll = window.pageYOffset;
        
        // Background Glass Toggle
        navbar.classList.toggle('scrolled', currentScroll > 50);

        // Progress Tracking
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (currentScroll / height) * 100;
        if (scrollProgress) scrollProgress.style.width = scrolled + "%";

        lastScroll = currentScroll;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // --- Mobile Menu Logic ---
    if(menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'auto';
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });
    }

    // --- 2. Scroll Reveal Observer ---
    const revealOptions = { 
        threshold: 0.1,
        rootMargin: "0px 0px -5% 0px" 
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // Count-up Trigger
                if (entry.target.classList.contains('counter-value')) {
                    animateCount(entry.target);
                    observer.unobserve(entry.target);
                }
            }
        });
    }, revealOptions);

    document.querySelectorAll('.reveal, .divider-line, .counter-value, .feature-card, .shimmer-container').forEach(el => {
        observer.observe(el);
    });

    // --- 3. Counter Animation ---
    function animateCount(obj) {
        const target = parseInt(obj.getAttribute('data-target'));
        let start = 0;
        const duration = 2000;
        const step = (timestamp) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4);
            obj.innerHTML = Math.floor(eased * target);
            if (progress < 1) window.requestAnimationFrame(step);
            else obj.innerHTML = target;
        };
        window.requestAnimationFrame(step);
    }

    // --- 4. Booking Panel (Slide from Right) ---
    const openModal = () => {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        // Prevent background scrolling when modal is open
        document.documentElement.style.overflow = 'hidden';
    };

    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
        document.documentElement.style.overflow = '';
        // Reset form after close animation completes
        setTimeout(() => {
            if (appointmentForm) {
                appointmentForm.classList.remove('hidden');
                appointmentForm.style.opacity = '1';
            }
            formSuccess.classList.add('hidden');
            formSuccess.style.opacity = '';
            if (appointmentForm) appointmentForm.reset();
        }, 500);
    };

    openModalBtns.forEach(btn => btn.addEventListener('click', openModal));
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (modalCloseArea) modalCloseArea.addEventListener('click', closeModal);
    
    // Close on overlay click
    window.addEventListener('click', (e) => { 
        if (e.target === modal) closeModal(); 
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // Form Processing
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const data = new FormData(appointmentForm);
            
            const appointment = {
                id: 'OKAN-' + Date.now(),
                customer: data.get('name'),
                phone: data.get('phone'),
                service: data.get('service'),
                date: data.get('date'),
                time: data.get('time'),
                timestamp: new Date().toISOString()
            };

            // Save to localStorage
            const list = JSON.parse(localStorage.getItem('okan_bookings') || '[]');
            list.push(appointment);
            localStorage.setItem('okan_bookings', JSON.stringify(list));

            // Success Transition
            appointmentForm.style.opacity = '0';
            setTimeout(() => {
                appointmentForm.classList.add('hidden');
                formSuccess.classList.remove('hidden');
                formSuccess.style.opacity = '1';
            }, 400);
        });
    }

    // --- 5. 3D Testimonial Carousel ---
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.dot');
    let idx = 0;
    let carouselInterval;

    function goToSlide(index) {
        // Add exiting class to current slide
        slides[idx].classList.add('exiting');
        slides[idx].classList.remove('active');
        dots[idx].classList.remove('active');

        // After transition, remove exiting class
        setTimeout(() => {
            slides[idx].classList.remove('exiting');
        }, 800);

        // Activate new slide
        idx = index;
        slides[idx].classList.add('active');
        dots[idx].classList.add('active');
    }

    function nextSlide() {
        goToSlide((idx + 1) % slides.length);
    }

    // Start auto-play
    function startCarousel() {
        carouselInterval = setInterval(nextSlide, 5000);
    }

    // Reset auto-play on manual click
    function resetCarousel() {
        clearInterval(carouselInterval);
        startCarousel();
    }

    // Dot click handlers
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            if (index !== idx) {
                goToSlide(index);
                resetCarousel();
            }
        });
    });

    if (slides.length > 0) {
        startCarousel();
    }

    // --- 6. Scroll Spy for Active Nav Link ---
    const spy = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${id}`));
            }
        });
    }, { threshold: 0.3 });
    
    sections.forEach(s => spy.observe(s));
});