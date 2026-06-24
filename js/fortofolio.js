/* ============================================
   BENZ PORTFOLIO — MAIN JAVASCRIPT
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // PRELOADER
    // ==========================================
    const preloader = document.getElementById('preloader');
    const preloaderText = document.getElementById('preloader-text');
    const welcomeText = 'Welcome to Benz';

    // Create letter spans with staggered animation
    welcomeText.split('').forEach((char, index) => {
        const span = document.createElement('span');
        span.textContent = char === ' ' ? ' ' : char;
        span.className = 'preloader-letter';
        span.style.animationDelay = `${index * 50}ms`;
        preloaderText.appendChild(span);
    });

    // Calculate total animation time
    const totalLetters = welcomeText.length;
    const letterAnimationTime = totalLetters * 50 + 80; // stagger + duration
    const holdTime = 500;
    const fadeOutTime = 600;
    const totalPreloaderTime = letterAnimationTime + holdTime + fadeOutTime;

    setTimeout(() => {
        preloader.classList.add('preloader-fade-out');

        setTimeout(() => {
            preloader.style.display = 'none';
            // Start typing effect after preloader
            startTypingEffect();
            // Animate metric numbers
            animateMetrics();
        }, fadeOutTime);
    }, letterAnimationTime + holdTime);

    // ==========================================
    // TYPING EFFECT
    // ==========================================
    const typingText = document.getElementById('typing-text');
    const typingCursor = document.getElementById('typing-cursor');
    const tagline = 'Make Your Business Website Future';
    let charIndex = 0;

    function startTypingEffect() {
        const typeInterval = setInterval(() => {
            if (charIndex < tagline.length) {
                typingText.textContent += tagline.charAt(charIndex);
                charIndex++;
            } else {
                clearInterval(typeInterval);
                // Keep cursor blinking
            }
        }, 80);
    }

    // ==========================================
    // CUSTOM CURSOR
    // ==========================================
    const cursor = document.getElementById('cursor');
    let cursorX = 0, cursorY = 0;
    let currentX = 0, currentY = 0;

    if (cursor && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        document.addEventListener('mousemove', (e) => {
            cursorX = e.clientX;
            cursorY = e.clientY;
        });

        function animateCursor() {
            // Smooth follow with slight delay
            currentX += (cursorX - currentX) * 0.15;
            currentY += (cursorY - currentY) * 0.15;

            cursor.style.left = currentX + 'px';
            cursor.style.top = currentY + 'px';

            requestAnimationFrame(animateCursor);
        }

        animateCursor();

        // Scale cursor on clickable elements
        const clickables = document.querySelectorAll('a, button, [role="button"], input, textarea, select, label, .cursor-pointer');
        clickables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(0.6)';
            });
            el.addEventListener('mouseleave', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            });
        });
    }

    // ==========================================
    // NAVBAR SCROLL EFFECTS
    // ==========================================
    const navbar = document.getElementById('navbar');
    const navbarInner = document.getElementById('navbar-inner');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        if (scrollY > 100) {
            navbarInner.classList.add('shadow-lg', 'shadow-slate-200/20', 'dark:shadow-slate-900/20');
            // Slightly reduce padding on scroll
            navbarInner.style.padding = '10px 28px';
        } else {
            navbarInner.classList.remove('shadow-lg', 'shadow-slate-200/20', 'dark:shadow-slate-900/20');
            navbarInner.style.padding = '';
        }
    });

    // ==========================================
    // MOBILE MENU TOGGLE
    // ==========================================
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });
    });

    // ==========================================
    // DARK MODE TOGGLE
    // ==========================================
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;

    // Check for saved theme preference or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        html.classList.add('dark');
    }

    themeToggle.addEventListener('click', () => {
        html.classList.toggle('dark');
        const isDark = html.classList.contains('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');

        // Rotate icon
        const sunIcon = document.getElementById('sun-icon');
        const moonIcon = document.getElementById('moon-icon');
        if (sunIcon) sunIcon.style.transform = isDark ? 'rotate(180deg)' : 'rotate(0deg)';
        if (moonIcon) moonIcon.style.transform = !isDark ? 'rotate(180deg)' : 'rotate(0deg)';
    });

    // ==========================================
    // MAGNETIC BUTTON EFFECT
    // ==========================================
    const magneticBtn = document.getElementById('hero-cta');

    if (magneticBtn && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        magneticBtn.addEventListener('mousemove', (e) => {
            const rect = magneticBtn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            const maxOffset = 8;
            const offsetX = (x / rect.width) * maxOffset * 2;
            const offsetY = (y / rect.height) * maxOffset * 2;

            magneticBtn.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
        });

        magneticBtn.addEventListener('mouseleave', () => {
            magneticBtn.style.transform = 'translate(0, 0)';
        });
    }

    // ==========================================
    // METRIC NUMBERS ANIMATION
    // ==========================================
    function animateMetrics() {
        const metrics = document.querySelectorAll('.metric-number');

        metrics.forEach(metric => {
            const target = parseInt(metric.dataset.target);
            const duration = 1500;
            const startTime = performance.now();

            function updateNumber(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Ease out cubic
                const easeOut = 1 - Math.pow(1 - progress, 3);
                const current = Math.round(easeOut * target);

                metric.textContent = current;

                if (progress < 1) {
                    requestAnimationFrame(updateNumber);
                }
            }

            requestAnimationFrame(updateNumber);
        });
    }

    // ==========================================
    // SCROLL REVEAL (IntersectionObserver)
    // ==========================================
    const scrollRevealElements = document.querySelectorAll('.scroll-reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    scrollRevealElements.forEach(el => revealObserver.observe(el));

    // ==========================================
    // SKILL BARS ANIMATION (IntersectionObserver)
    // ==========================================
    const skillBars = document.querySelectorAll('.skill-bar');

    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const targetWidth = bar.dataset.width + '%';

                // Small delay for stagger effect
                setTimeout(() => {
                    bar.style.width = targetWidth;
                }, 200);

                skillObserver.unobserve(bar);
            }
        });
    }, {
        threshold: 0.5
    });

    skillBars.forEach(bar => skillObserver.observe(bar));

    // ==========================================
    // PROJECT FILTER
    // ==========================================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            filterBtns.forEach(b => {
                b.classList.remove('active', 'bg-[#3B82F6]', 'text-white');
                b.classList.add('bg-white', 'dark:bg-[#1E293B]', 'border', 'border-[#E2E8F0]', 'dark:border-[#334155]', 'text-[#64748B]', 'dark:text-[#94A3B8]');
            });

            btn.classList.add('active', 'bg-[#3B82F6]', 'text-white');
            btn.classList.remove('bg-white', 'dark:bg-[#1E293B]', 'border', 'border-[#E2E8F0]', 'dark:border-[#334155]', 'text-[#64748B]', 'dark:text-[#94A3B8]');

            const filter = btn.dataset.filter;

            projectCards.forEach(card => {
                const category = card.dataset.category;

                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                    // Small animation for appearing cards
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.transition = 'opacity 0.4s ease-out, transform 0.4s ease-out';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // ==========================================
    // FEEDBACK FORM SUBMIT
    // ==========================================
    const feedbackSubmit = document.getElementById('feedback-submit');
    const feedbackText = document.getElementById('feedback-text');

    if (feedbackSubmit) {
        feedbackSubmit.addEventListener('click', () => {
            if (!feedbackText.value.trim()) {
                feedbackText.focus();
                feedbackText.classList.add('ring-2', 'ring-red-200');
                setTimeout(() => feedbackText.classList.remove('ring-2', 'ring-red-200'), 1000);
                return;
            }

            // Sending state
            feedbackSubmit.textContent = 'Sending...';
            feedbackSubmit.style.backgroundColor = '#60A5FA';
            feedbackSubmit.disabled = true;

            setTimeout(() => {
                // Sent state
                feedbackSubmit.textContent = 'Sent! ✓';
                feedbackSubmit.style.backgroundColor = '#22C55E';
                feedbackText.value = '';

                setTimeout(() => {
                    // Reset state
                    feedbackSubmit.textContent = 'Submit Feedback';
                    feedbackSubmit.style.backgroundColor = '';
                    feedbackSubmit.disabled = false;
                }, 1000);
            }, 1500);
        });
    }

    // ==========================================
    // CONTACT FORM SUBMIT
    // ==========================================
    const contactForm = document.getElementById('contact-form');
    const contactSubmit = document.getElementById('contact-submit');

    if (contactForm && contactSubmit) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Sending state
            contactSubmit.textContent = 'Sending...';
            contactSubmit.style.backgroundColor = '#60A5FA';
            contactSubmit.disabled = true;

            setTimeout(() => {
                // Sent state
                contactSubmit.textContent = 'Sent! ✓';
                contactSubmit.style.backgroundColor = '#22C55E';
                contactForm.reset();

                setTimeout(() => {
                    // Reset state
                    contactSubmit.textContent = 'Send Message';
                    contactSubmit.style.backgroundColor = '';
                    contactSubmit.disabled = false;
                }, 1000);
            }, 1500);
        });
    }

    // ==========================================
    // BACK TO TOP BUTTON
    // ==========================================
    const backToTop = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.remove('opacity-0', 'invisible');
            backToTop.classList.add('opacity-100', 'visible');
        } else {
            backToTop.classList.add('opacity-0', 'invisible');
            backToTop.classList.remove('opacity-100', 'visible');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // ==========================================
    // SMOOTH SCROLL FOR NAV LINKS
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80; // Account for fixed navbar
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ==========================================
    // ACTIVE NAV LINK ON SCROLL
    // ==========================================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const activeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');

                navLinks.forEach(link => {
                    link.classList.remove('text-[#3B82F6]', 'dark:text-[#60A5FA]');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('text-[#3B82F6]', 'dark:text-[#60A5FA]');
                    }
                });
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '-80px 0px -50% 0px'
    });

    sections.forEach(section => activeObserver.observe(section));

    // ==========================================
    // THEME ICON ROTATION ON LOAD
    // ==========================================
    const isDark = html.classList.contains('dark');
    const sunIcon = document.getElementById('sun-icon');
    const moonIcon = document.getElementById('moon-icon');

    if (sunIcon) sunIcon.style.transform = isDark ? 'rotate(0deg)' : 'rotate(180deg)';
    if (moonIcon) moonIcon.style.transform = !isDark ? 'rotate(0deg)' : 'rotate(180deg)';

});
