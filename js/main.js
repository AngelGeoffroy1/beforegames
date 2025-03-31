// Attendre que le DOM soit chargé
document.addEventListener('DOMContentLoaded', function() {
    // Animation au défilement avec AOS
    initAOS();
    
    // Navigation mobile
    setupMobileNavigation();
    
    // Navigation fluide au clic sur les ancres
    setupSmoothScrolling();
    
    // Animation au survol pour les cartes de jeux
    setupGameCardHover();
    
    // Animation des chiffres
    setupCounterAnimation();
});

// Initialiser AOS (Animate On Scroll)
function initAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: false,
            mirror: true
        });
    }
}

// Menu mobile
function setupMobileNavigation() {
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = mobileMenu.querySelectorAll('a');
    
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
            
            // Changer l'icône du menu
            const icon = menuToggle.querySelector('i');
            if (icon) {
                if (mobileMenu.classList.contains('hidden')) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                } else {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                }
            }
        });
        
        // Fermer le menu mobile quand on clique sur un lien
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.add('hidden');
                const icon = menuToggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }
}

// Navigation fluide
function setupSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            e.preventDefault();
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Ajouter une classe active au lien
                links.forEach(l => l.classList.remove('text-primary'));
                this.classList.add('text-primary');
                
                // Faire défiler jusqu'à l'élément cible avec une animation
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Offset pour le header fixe
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Mise à jour active au défilement
    updateActiveNavOnScroll(links);
}

// Mise à jour de la navigation active au défilement
function updateActiveNavOnScroll(links) {
    window.addEventListener('scroll', function() {
        const sections = [];
        links.forEach(link => {
            const targetId = link.getAttribute('href');
            if (targetId !== '#') {
                const section = document.querySelector(targetId);
                if (section) {
                    sections.push({
                        id: targetId,
                        offset: section.offsetTop - 100
                    });
                }
            }
        });
        
        // Trier les sections par leur position sur la page
        sections.sort((a, b) => a.offset - b.offset);
        
        // Trouver la section actuellement visible
        const scrollPosition = window.scrollY;
        let activeSection = sections[0]?.id;
        
        for (let i = 0; i < sections.length; i++) {
            if (scrollPosition >= sections[i].offset) {
                activeSection = sections[i].id;
            }
        }
        
        // Mettre à jour les liens actifs
        if (activeSection) {
            links.forEach(link => {
                if (link.getAttribute('href') === activeSection) {
                    link.classList.add('text-primary');
                } else {
                    link.classList.remove('text-primary');
                }
            });
        }
    });
}

// Animation au survol des cartes de jeux
function setupGameCardHover() {
    const gameCards = document.querySelectorAll('.game-card');
    
    gameCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.05)';
        });
    });
}

// Animation des compteurs
function setupCounterAnimation() {
    const counters = document.querySelectorAll('.counter');
    
    // Fonction pour animer un compteur de 0 à sa valeur cible
    function animateCounter(counter, target) {
        let count = 0;
        const duration = 2000; // 2 secondes
        const frameRate = 60;
        const increment = target / (duration / 1000 * frameRate);
        
        const timer = setInterval(() => {
            count += increment;
            
            if (count >= target) {
                clearInterval(timer);
                counter.textContent = target;
            } else {
                counter.textContent = Math.floor(count);
            }
        }, 1000 / frameRate);
    }
    
    // Intersection Observer pour déclencher l'animation quand visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                animateCounter(counter, target);
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    // Observer chaque compteur
    counters.forEach(counter => {
        observer.observe(counter);
    });
}

// Effet parallaxe pour le héros
window.addEventListener('scroll', function() {
    const scrollPosition = window.pageYOffset;
    const heroSection = document.querySelector('.hero-section');
    
    if (heroSection) {
        // Parallaxe pour le fond
        heroSection.style.backgroundPositionY = scrollPosition * 0.5 + 'px';
        
        // Effet de zoom léger
        const scale = 1 + scrollPosition * 0.0005;
        heroSection.style.transform = `scale(${Math.min(scale, 1.05)})`;
    }
});
