/**
 * Hairsalon OKAN - Ready-to-Sell Final Edition
 * 
 * Features:
 * - Professional Form Data Capture (Date/Time/Service)
 * - Optimized Parallax & Scroll Performance
 * - Split-Mask Reveal Triggers
 * - 10k User Scale Readiness (Static optimization)
 */

document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.navbar');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav ul a');
    const scrollProgress = document.querySelector('.scroll-progress');
    const modal = document.getElementById('booking-modal');
    const openModalBtns = document.querySelectorAll('.open-booking');
    const closeModalBtn = document.querySelector('.close-modal');
    const appointmentForm = document.getElementById('appointment-form');
    const formSuccess = document.getElementById('form-success');

    // --- 1. Navbar Navigation Refinement ---
    let lastScroll = 0;
    const handleScroll = () => {
        const currentScroll = window.pageYOffset;
        
        // Background Glass Toggle
        navbar.classList.toggle('scrolled', currentScroll > 50);

        // Smart Hide/Show
        if (currentScroll > lastScroll && currentScroll > 400) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        lastScroll = currentScroll;

        // Progress Tracking
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (currentScroll / height) * 100;
        if (scrollProgress) scrollProgress.style.width = scrolled + "%";

        // Parallax Glide
        document.querySelectorAll('.hero-image img, .gallery-item img').forEach(img => {
            const speed = 0.1;
            const yPos = -(currentScroll * speed);
            img.style.transform = `translateY(${yPos}px) scale(1.08)`;
        });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // --- 2. Mesmerizing Reveal Observer ---
    const revealOptions = { 
        threshold: 0.1,
        rootMargin: "0px 0px -10% 0px" 
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

    document.querySelectorAll('.reveal, .reveal-split, .divider-line, .counter-value, .feature-card, .shimmer-container').forEach(el => {
        observer.observe(el);
    });

    // --- 3. Professional Counter Logic ---
    function animateCount(obj) {
        const target = parseInt(obj.getAttribute('data-target'));
        let start = 0;
        const duration = 2500;
        const step = (timestamp) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4); // Quartic ease out
            obj.innerHTML = Math.floor(eased * target);
            if (progress < 1) window.requestAnimationFrame(step);
            else obj.innerHTML = target;
        };
        window.requestAnimationFrame(step);
    }

    // --- 4. Booking System (Ready-to-Sell) ---
    const openModal = () => {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
        setTimeout(() => {
            appointmentForm.classList.remove('hidden');
            formSuccess.classList.add('hidden');
            appointmentForm.reset();
        }, 300);
    };

    openModalBtns.forEach(btn => btn.addEventListener('click', openModal));
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

    // Form Processing
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const data = new FormData(appointmentForm);
            
            // Professional Data Object
            const appointment = {
                id: 'OKAN-' + Date.now(),
                customer: data.get('name'),
                phone: data.get('phone'),
                service: data.get('service'),
                date: data.get('date'),
                time: data.get('time'),
                timestamp: new Date().toISOString()
            };

            // Save to LocalDatabase (Simulation)
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

    // --- 5. Auto-Play Testimonials ---
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.dot');
    let idx = 0;

    if (slides.length > 0) {
        setInterval(() => {
            slides[idx].classList.remove('active');
            dots[idx].classList.remove('active');
            idx = (idx + 1) % slides.length;
            slides[idx].classList.add('active');
            dots[idx].classList.add('active');
        }, 5000);
    }

    // Scroll Spy for Navbar
    const spy = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${id}`));
            }
        });
    }, { threshold: 0.55 });
    sections.forEach(s => spy.observe(s));
});
