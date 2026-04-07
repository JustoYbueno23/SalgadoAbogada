/**
 * @fileoverview Manejo optimizado de animaciones y efectos visuales.
 * @author Salgado Abogada
 * @version 2.0.0
 */

const SalgadoAbogada = (() => {
    'use strict';

    /**
     * Configuración de animaciones
     */
    const CONFIG = {
        counterDuration: 2000, // Duración total en ms
        parallaxSpeed: 0.15,   // Intensidad del efecto paralaje
    };

    /**
     * Cache de elementos del DOM para evitar búsquedas repetitivas
     */
    const DOM = {
        counters: document.querySelectorAll('.counter'),
        counterSection: document.querySelector('.seccion-contadores'),
        parallaxBg: document.querySelector('.bg-decoration'),
    };

    /**
     * Animación de contadores usando requestAnimationFrame para máxima fluidez
     */
    const initCounters = () => {
        if (!DOM.counters.length) return;

        const animate = (el) => {
            const target = parseInt(el.dataset.target, 10);
            const startTime = performance.now();

            const update = (now) => {
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / CONFIG.counterDuration, 1);
                
                // Función de easing (easeOutExpo) para un efecto más profesional
                const easeValue = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
                
                el.textContent = Math.floor(easeValue * target);

                if (progress < 1) {
                    requestAnimationFrame(update);
                } else {
                    el.textContent = target;
                }
            };

            requestAnimationFrame(update);
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animate(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        DOM.counters.forEach(counter => observer.observe(counter));
    };

    /**
     * Efecto de paralaje optimizado
     */
    const initParallax = () => {
        if (!DOM.parallaxBg) return;

        let ticking = false;

        const updateParallax = () => {
            const scrolled = window.scrollY;
            const yPos = scrolled * CONFIG.parallaxSpeed;
            DOM.parallaxBg.style.transform = `translate3d(0, ${yPos}px, 0)`;
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        }, { passive: true });
    };

    /**
     * Inicialización modular
     */
    const init = () => {
        initCounters();
        initParallax();
        
        // SOLUCIÓN 4: Activar fade-in cuando todo esté cargado
        window.addEventListener('load', () => {
            document.body.classList.add('loaded');
        });
        
        // Backup por si el evento load ya pasó o tarda demasiado
        if (document.readyState === 'complete') {
            document.body.classList.add('loaded');
        }
    };

    return { init };
})();

// Iniciar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', SalgadoAbogada.init);