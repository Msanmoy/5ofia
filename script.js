const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function createButterflies() {
    if (prefersReducedMotion) return;
    
    const container = document.querySelector('.butterflies-container');
    if (!container) return;
    
    const count = isMobile ? 2 : 3;
    
    for (let i = 0; i < count; i++) {
        const butterfly = document.createElement('div');
        butterfly.className = 'butterfly';
        butterfly.textContent = '🦋';
        butterfly.style.left = Math.random() * 100 + '%';
        butterfly.style.top = Math.random() * 100 + '%';
        butterfly.style.animationDelay = Math.random() * 5 + 's';
        butterfly.style.animationDuration = (20 + Math.random() * 10) + 's';
        container.appendChild(butterfly);
    }
}

function createFloatingHearts() {
    if (prefersReducedMotion) return;
    
    const container = document.querySelector('.floating-hearts');
    if (!container) return;
    
    const count = isMobile ? 8 : 12;
    const heartSymbols = ['❤️', '💕', '🌻'];
    
    for (let i = 0; i < count; i++) {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.top = Math.random() * 100 + '%';
        heart.style.animationDelay = Math.random() * 12 + 's';
        heart.style.animationDuration = (10 + Math.random() * 4) + 's';
        container.appendChild(heart);
    }
}

function animateSections() {
    const sections = document.querySelectorAll('.message-section');
    if (sections.length === 0) return;
    
    const observerOptions = {
        threshold: 0.15,
        rootMargin: isMobile ? '0px 0px -30px 0px' : '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('visible')) {
                const delay = parseInt(entry.target.dataset.delay) || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay * 300);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        observer.observe(section);
    });
    
    if (sections.length > 0) {
        setTimeout(() => {
            sections[0].classList.add('visible');
        }, 300);
    }
}

function createHeartEffect(x, y) {
    if (prefersReducedMotion) return;
    
    const heartSymbols = ['💕', '❤️', '💖', '🌻'];
    const heart = document.createElement('div');
    heart.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
    heart.style.position = 'fixed';
    heart.style.left = x + 'px';
    heart.style.top = y + 'px';
    heart.style.fontSize = '28px';
    heart.style.pointerEvents = 'none';
    heart.style.zIndex = '9999';
    heart.style.opacity = '0.8';
    heart.style.animation = 'floatAway 1.5s ease-out forwards';
    heart.style.transform = 'translate(-50%, -50%)';
    
    document.body.appendChild(heart);
    
    setTimeout(() => {
        heart.remove();
    }, 1500);
}

function setupTouchEffects() {
    let lastTouchTime = 0;
    
    document.addEventListener('touchstart', (e) => {
        const now = Date.now();
        if (now - lastTouchTime > 300) { 
            const touch = e.touches[0];
            createHeartEffect(touch.clientX, touch.clientY);
            lastTouchTime = now;
        }
    }, { passive: true });
    
    if (!isMobile) {
        document.addEventListener('click', (e) => {
            createHeartEffect(e.clientX, e.clientY);
        }, { passive: true });
    }
}

function addDynamicStyles() {
    if (document.getElementById('dynamic-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'dynamic-styles';
    style.textContent = `
        @keyframes floatAway {
            0% {
                transform: translate(-50%, -50%) scale(1) rotate(0deg);
                opacity: 0.8;
            }
            100% {
                transform: translate(-50%, calc(-50% - 80px)) scale(0.4) rotate(15deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}


function setupParallax() {
    if (isMobile || prefersReducedMotion) return;
    
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                const hearts = document.querySelectorAll('.floating-heart');
                
                hearts.forEach((heart, index) => {
                    const speed = 0.3 + (index % 3) * 0.1;
                    heart.style.transform = `translateY(${scrolled * speed}px)`;
                });
                
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}

function initialize() {
    createButterflies();
    createFloatingHearts();
    animateSections();
    setupTouchEffects();
    setupParallax();
    addDynamicStyles();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initialize, 100);
    });
} else {
    setTimeout(initialize, 100);
}

let lastTouchEnd = 0;
document.addEventListener('touchend', (e) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
        e.preventDefault();
    }
    lastTouchEnd = now;
}, { passive: false });

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        document.body.style.animationPlayState = 'paused';
    } else {
        document.body.style.animationPlayState = 'running';
    }
});

function setupButterflyModal() {
    const modal = document.getElementById('butterflyModal');
    const openBtn = document.getElementById('openButterflyModal');
    const closeBtn = document.getElementById('closeButterflyModal');
    const video = modal?.querySelector('.butterfly-video-modal');
    
    if (!modal || !openBtn || !closeBtn) return;
    
    openBtn.addEventListener('click', (e) => {
        e.preventDefault();
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        if (video) {
            video.play().catch(err => {
                console.log('Error al reproducir video:', err);
            });
        }
    });
    
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        
        if (video) {
            video.pause();
        }
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
            
            if (video) {
                video.pause();
            }
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
            
            if (video) {
                video.pause();
            }
        }
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupButterflyModal);
} else {
    setupButterflyModal();
}
