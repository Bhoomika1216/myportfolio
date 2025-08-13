// Portfolio Interactions for P.Bhoomika
(function () {
  const onReady = (fn) => (document.readyState !== 'loading' ? fn() : document.addEventListener('DOMContentLoaded', fn));

  onReady(() => {
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // 1) Mobile Menu Toggle
    if (hamburger && navMenu) {
      hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
      });

      navLinks.forEach((link) =>
        link.addEventListener('click', () => {
          navMenu.classList.remove('active');
          hamburger.classList.remove('active');
        })
      );
    }

    // 2) Navbar shadow on scroll
    const handleNavbarShadow = () => {
      if (!navbar) return;
      if (window.scrollY > 10) navbar.classList.add('scrolled');
      else navbar.classList.remove('scrolled');
    };
    window.addEventListener('scroll', handleNavbarShadow, { passive: true });
    handleNavbarShadow();

    // 3) Active Nav Link Highlight on Scroll
    const sectionIds = ['home', 'about', 'education', 'experience', 'skills', 'projects', 'certifications', 'achievements', 'contact'];
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el) => !!el);

    const linkMap = new Map();
    navLinks.forEach((link) => {
      const href = link.getAttribute('href') || '';
      if (href.startsWith('#')) linkMap.set(href.substring(1), link);
    });

    const highlightActiveLink = () => {
      let currentId = sectionIds[0];
      const offset = 120; // offset for fixed navbar
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top - offset <= 0) currentId = section.id;
      });
      navLinks.forEach((l) => l.classList.remove('active'));
      const active = linkMap.get(currentId);
      if (active) active.classList.add('active');
    };
    window.addEventListener('scroll', highlightActiveLink, { passive: true });
    window.addEventListener('resize', highlightActiveLink);
    highlightActiveLink();

    // 4) 3D Tilt Hover Effect for Cards
    const tiltableSelectors = ['.project-card', '.skill-category', '.cert-card'];
    const tiltableElements = document.querySelectorAll(tiltableSelectors.join(','));

    const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

    tiltableElements.forEach((card) => {
      let rafId = null;
      const state = { rx: 0, ry: 0 };

      const onMove = (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const px = (x / rect.width) - 0.5;
        const py = (y / rect.height) - 0.5;
        const maxTilt = 10; // degrees
        state.ry = clamp(px * maxTilt * 2, -maxTilt, maxTilt);
        state.rx = clamp(-py * maxTilt * 2, -maxTilt, maxTilt);
        if (!rafId) rafId = requestAnimationFrame(apply);
      };

      const apply = () => {
        rafId = null;
        card.style.transform = `perspective(800px) rotateX(${state.rx}deg) rotateY(${state.ry}deg) translateY(-4px)`;
      };

      const onLeave = () => {
        card.style.transition = 'transform 300ms ease';
        card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
        setTimeout(() => (card.style.transition = ''), 300);
      };

      card.addEventListener('mousemove', onMove);
      card.addEventListener('mouseleave', onLeave);
    });

    // 5) Animated Counters (About stats)
    const counters = document.querySelectorAll('.stat-number');
    const parseTarget = (text) => {
      const n = parseInt(String(text).replace(/[^0-9]/g, ''), 10);
      return Number.isFinite(n) ? n : 0;
    };

    const animateCounter = (el, target, duration = 1200) => {
      const start = 0;
      const startTime = performance.now();

      const step = (now) => {
        const progress = clamp((now - startTime) / duration, 0, 1);
        const value = Math.round(start + (target - start) * progress);
        const suffix = /\+$/.test(el.textContent.trim()) ? '+' : '';
        el.textContent = `${value}${suffix}`;
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    if (counters.length) {
      const observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const el = entry.target;
              const target = parseTarget(el.textContent);
              animateCounter(el, target);
              obs.unobserve(el);
            }
          });
        },
        { threshold: 0.5 }
      );
      counters.forEach((c) => observer.observe(c));
    }

    // 6) Respect Reduced Motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (prefersReducedMotion.matches) {
      document.querySelectorAll('*').forEach((el) => {
        el.style.animation = 'none';
        el.style.transition = 'none';
      });
    }
  });
})();

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    }
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, observerOptions);

// Observe all elements with reveal class
document.addEventListener('DOMContentLoaded', () => {
    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => observer.observe(el));
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        const rate = scrolled * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
    }
});

// Typing effect for hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// Animate skill items on scroll
const skillItems = document.querySelectorAll('.skill-item');
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0)';
            }, index * 100);
        }
    });
}, { threshold: 0.5 });

skillItems.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(-30px)';
    item.style.transition = 'all 0.5s ease';
    skillObserver.observe(item);
});

// Project card hover effects
const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-15px) scale(1.02)';
        card.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.2)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
        card.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.1)';
    });
});

// Timeline animation
const timelineItems = document.querySelectorAll('.timeline-item');
const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 200);
        }
    });
}, { threshold: 0.3 });

timelineItems.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(50px)';
    item.style.transition = 'all 0.8s ease';
    timelineObserver.observe(item);
});

// Floating animation for hero elements
function addFloatingAnimation() {
    const floatingElements = document.querySelectorAll('.floating-card, .hero-content');
    floatingElements.forEach((el, index) => {
        el.style.animationDelay = `${index * 0.5}s`;
    });
}

// Contact form validation (if you add a form later)
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Smooth reveal for sections
const sections = document.querySelectorAll('section');
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'all 0.8s ease';
    sectionObserver.observe(section);
});

// Add hover effects to buttons
const buttons = document.querySelectorAll('.btn');
buttons.forEach(button => {
    button.addEventListener('mouseenter', () => {
        button.style.transform = 'translateY(-3px)';
    });
    
    button.addEventListener('mouseleave', () => {
        button.style.transform = 'translateY(0)';
    });
});

// Social links hover effect
const socialLinks = document.querySelectorAll('.social-link');
socialLinks.forEach(link => {
    link.addEventListener('mouseenter', () => {
        link.style.transform = 'translateY(-5px) scale(1.05)';
    });
    
    link.addEventListener('mouseleave', () => {
        link.style.transform = 'translateY(0) scale(1)';
    });
});

// Skill category hover effects
const skillCategories = document.querySelectorAll('.skill-category');
skillCategories.forEach(category => {
    category.addEventListener('mouseenter', () => {
        category.style.transform = 'translateY(-10px)';
        category.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
    });
    
    category.addEventListener('mouseleave', () => {
        category.style.transform = 'translateY(0)';
        category.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
    });
});

// Certification cards hover effects
const certCards = document.querySelectorAll('.cert-card');
certCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px)';
        card.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
        card.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
    });
});

// Initialize animations when page loads
document.addEventListener('DOMContentLoaded', () => {
    addFloatingAnimation();
    
    // Add reveal class to elements for scroll animations
    const elementsToReveal = document.querySelectorAll('.skill-category, .project-card, .cert-card, .contact-item');
    elementsToReveal.forEach(el => {
        el.classList.add('reveal');
    });
    
    // Trigger initial animations
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

// Smooth scroll to top functionality
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Add scroll to top button (optional)
const scrollToTopBtn = document.createElement('button');
scrollToTopBtn.innerHTML = '↑';
scrollToTopBtn.className = 'scroll-to-top';
scrollToTopBtn.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    border: none;
    cursor: pointer;
    font-size: 20px;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 1000;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
`;

document.body.appendChild(scrollToTopBtn);

// Show/hide scroll to top button
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollToTopBtn.style.opacity = '1';
        scrollToTopBtn.style.visibility = 'visible';
    } else {
        scrollToTopBtn.style.opacity = '0';
        scrollToTopBtn.style.visibility = 'hidden';
    }
});

scrollToTopBtn.addEventListener('click', scrollToTop);

// Add hover effect to scroll to top button
scrollToTopBtn.addEventListener('mouseenter', () => {
    scrollToTopBtn.style.transform = 'scale(1.1)';
    scrollToTopBtn.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.3)';
});

scrollToTopBtn.addEventListener('mouseleave', () => {
    scrollToTopBtn.style.transform = 'scale(1)';
    scrollToTopBtn.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.2)';
});

// Performance optimization: Throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Apply throttling to scroll events
window.addEventListener('scroll', throttle(() => {
    // Scroll event handlers
}, 16)); // 60fps

// Add CSS for scroll to top button
const style = document.createElement('style');
style.textContent = `
    .scroll-to-top:hover {
        background: linear-gradient(135deg, #5a6fd8, #6a4190) !important;
    }
`;
document.head.appendChild(style);



