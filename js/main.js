/* ============================================================
   ORDO PRIME - Interacciones y Comportamiento
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ==================== Referencias DOM ====================
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const links = navLinks.querySelectorAll('a');
    const sections = document.querySelectorAll('section[id]');
    const reveals = document.querySelectorAll('.reveal');
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');
    const yearSpan = document.getElementById('year');

    // ==================== Año dinámico ====================
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    // ==================== Navbar scroll effect ====================
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // ==================== Menú hamburguesa ====================
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    // Cerrar menú al hacer clic en un link
    links.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // ==================== Active link on scroll ====================
    const observerOptions = {
        root: null,
        rootMargin: '-40% 0px -55% 0px',
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                links.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => sectionObserver.observe(section));

    // ==================== Scroll Reveal ====================
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        threshold: 0.12,
        rootMargin: '0px 0px -30px 0px'
    });

    reveals.forEach(el => revealObserver.observe(el));

    // ==================== Formulario Formspree ====================
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;

            // Estado de carga
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" style="animation: spin 1s linear infinite;">
                    <circle cx="12" cy="12" r="10" stroke-dasharray="60" stroke-dashoffset="20"></circle>
                </svg>
                Enviando...
            `;

            const data = new FormData(contactForm);

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: data,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    formStatus.className = 'form-status success';
                    formStatus.innerHTML = `
                        <svg width="20" height="20" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                        ¡Mensaje enviado con éxito! Te contactaremos pronto.
                    `;
                    contactForm.reset();
                } else {
                    const result = await response.json();
                    throw new Error(result.error || 'Error al enviar');
                }
            } catch (err) {
                formStatus.className = 'form-status error';
                formStatus.innerHTML = `
                    <svg width="20" height="20" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                    ${err.message || 'Hubo un error. Intenta de nuevo o escríbenos directamente.'}
                `;
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }
        });
    }

    // ==================== Smooth scroll para anchor links ====================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                const offset = 100;
                const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

});

// ==================== Keyframes spin (para loader inline) ====================
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);
