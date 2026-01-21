/**
 * Instagram Influencer Sales Website - Main JavaScript
 * Features: Scroll Reveal Animations, WhatsApp Integration, Sticky CTA
 */

(function() {
  'use strict';

  // ============================================
  // UTILITY FUNCTIONS
  // ============================================

  /**
   * Check if user prefers reduced motion
   */
  const prefersReducedMotion = () => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  };

  /**
   * Throttle function for performance
   */
  const throttle = (func, limit) => {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  };

  // ============================================
  // FEATURE 1: SCROLL REVEAL ANIMATIONS
  // ============================================

  const initScrollReveal = () => {
    if (prefersReducedMotion()) {
      // Skip animations for users who prefer reduced motion
      const revealElements = document.querySelectorAll('.reveal');
      revealElements.forEach(el => el.classList.add('is-visible'));
      return;
    }

    const revealElements = document.querySelectorAll('.reveal');
    
    if (revealElements.length === 0) return;

    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.15
    };

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // Unobserve after animation triggers (animate once)
          revealObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach(element => {
      revealObserver.observe(element);
    });
  };

  // ============================================
  // FEATURE 2: STAGGERED CHILD ANIMATIONS
  // ============================================

  const initStaggeredAnimations = () => {
    if (prefersReducedMotion()) return;

    const revealGroups = document.querySelectorAll('.reveal-group');
    
    if (revealGroups.length === 0) return;

    revealGroups.forEach(group => {
      const children = Array.from(group.children);
      
      children.forEach((child, index) => {
        // Set CSS custom property for staggered delay
        const delay = index * 100; // 100ms increment
        child.style.setProperty('--stagger-delay', `${delay}ms`);
        
        // Add reveal class if not already present
        if (!child.classList.contains('reveal')) {
          child.classList.add('reveal');
        }
      });
    });
  };

  // ============================================
  // FEATURE 3: WHATSAPP ORDER INTEGRATION
  // ============================================

  const initWhatsAppButtons = () => {
    const whatsappButtons = document.querySelectorAll('.btn--whatsapp');
    
    if (whatsappButtons.length === 0) return;

    // Default WhatsApp number (can be customized)
    const defaultPhone = '919876543210';

    whatsappButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        e.preventDefault();

        // Find closest product card
        const productCard = this.closest('[data-product-name]');
        
        if (!productCard) {
          console.warn('Product card not found');
          return;
        }

        // Extract product information
        const productName = productCard.getAttribute('data-product-name') || 'Product';
        const productPrice = productCard.getAttribute('data-product-price') || 'N/A';
        const productId = productCard.getAttribute('data-product-id') || '';

        // Construct WhatsApp message
        let message = `Hi, I want to order:\n\n`;
        message += `Product: ${productName}\n`;
        message += `Price: ₹${productPrice}`;
        
        if (productId) {
          message += `\nSKU: ${productId}`;
        }

        // Encode message for URL
        const encodedMessage = encodeURIComponent(message);

        // Check if button has custom phone number in href
        const href = this.getAttribute('href');
        let phoneNumber = defaultPhone;
        
        if (href && href.includes('wa.me/')) {
          const match = href.match(/wa\.me\/(\d+)/);
          if (match) {
            phoneNumber = match[1];
          }
        }

        // Construct WhatsApp URL
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

        // Open in new tab
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      });
    });
  };

  // ============================================
  // FEATURE 4: STICKY MOBILE CTA
  // ============================================

  const initStickyCTA = () => {
    const stickyCTA = document.querySelector('.sticky-whatsapp');
    
    if (!stickyCTA) return;

    const showThreshold = 300; // Show after 300px scroll
    const footer = document.querySelector('.footer');

    const handleScroll = throttle(() => {
      const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
      
      // Show/hide based on scroll position
      if (scrollPosition > showThreshold) {
        stickyCTA.classList.add('is-visible');
      } else {
        stickyCTA.classList.remove('is-visible');
      }

      // Hide near footer
      if (footer) {
        const footerRect = footer.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        if (footerRect.top < viewportHeight) {
          stickyCTA.classList.add('is-hidden');
        } else {
          stickyCTA.classList.remove('is-hidden');
        }
      }
    }, 100);

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial check
    handleScroll();
  };

  // ============================================
  // FEATURE 5: SMOOTH SCROLL FOR ANCHOR LINKS
  // ============================================

  const initSmoothScroll = () => {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    if (anchorLinks.length === 0) return;

    anchorLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // Skip if href is just "#"
        if (href === '#') return;

        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          e.preventDefault();
          
          const headerOffset = 80; // Adjust based on sticky header height
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: prefersReducedMotion() ? 'auto' : 'smooth'
          });
        }
      });
    });
  };

  // ============================================
  // FEATURE 6: MOBILE MENU TOGGLE
  // ============================================

  const initMobileMenu = () => {
    const menuToggle = document.querySelector('.header__menu-toggle');
    const nav = document.querySelector('.header__nav');
    
    if (!menuToggle || !nav) return;

    menuToggle.addEventListener('click', function() {
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      
      this.setAttribute('aria-expanded', !isExpanded);
      nav.classList.toggle('is-open');
      document.body.classList.toggle('menu-open');
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!menuToggle.contains(e.target) && !nav.contains(e.target)) {
        menuToggle.setAttribute('aria-expanded', 'false');
        nav.classList.remove('is-open');
        document.body.classList.remove('menu-open');
      }
    });

    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        menuToggle.setAttribute('aria-expanded', 'false');
        nav.classList.remove('is-open');
        document.body.classList.remove('menu-open');
      }
    });
  };

  // ============================================
  // FEATURE 7: LAZY LOAD IMAGES
  // ============================================

  const initLazyLoad = () => {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    if (lazyImages.length === 0) return;

    // Native lazy loading is supported, nothing to do
    if ('loading' in HTMLImageElement.prototype) {
      return;
    }

    // Fallback for older browsers
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          imageObserver.unobserve(img);
        }
      });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
  };

  // ============================================
  // INITIALIZATION
  // ============================================

  const init = () => {
    // Initialize all features
    initScrollReveal();
    initStaggeredAnimations();
    initWhatsAppButtons();
    initStickyCTA();
    initSmoothScroll();
    initMobileMenu();
    initLazyLoad();

    console.log('✓ Website initialized successfully');
  };

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
