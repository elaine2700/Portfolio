/**
 * ScrollAnimator
 * Handles scroll-triggered and load-triggered entry animations.
 */
class ScrollAnimator {
  constructor(options = {}) {
    // 1. Set global defaults
    this.settings = {
      selector: '.animate-on-scroll', // The class we look for in HTML
      visibleClass: 'is-visible',     // The class added when active
      threshold: 0.4,                 // How much of the element must be visible (20%)
      playOnce: true,                 // Global default: only animate once
      animationType: 'scroll',        // Global default: 'scroll' | 'start'
      ...options                      // Override defaults with user options
    };

    // 2. Initialize the Intersection Observer
    this.observer = new IntersectionObserver(this.handleIntersection.bind(this), {
      threshold: this.settings.threshold
    });

    this.start();
  }

  start() {
    // Find all elements matching the selector
    const elements = document.querySelectorAll(this.settings.selector);

    elements.forEach(el => {
      // 3. Check if element has a data attribute overriding the global animationType
      const dataAnimationType = el.getAttribute('data-animation-type');
      const animationType = dataAnimationType !== null
        ? dataAnimationType
        : (el.classList.contains('animate-on-start') ? 'start' : this.settings.animationType);

      if (animationType === 'start') {
        // Immediate start at load
        el.classList.add(this.settings.visibleClass);
      } else {
        // Scroll-triggered via Intersection Observer
        this.observer.observe(el);
      }
    });
  }

  handleIntersection(entries) {
    entries.forEach(entry => {
      const target = entry.target;

      // 4. Check if the element has a specific data attribute overriding the global setting
      const dataPlayOnce = target.getAttribute('data-play-once');
      const shouldPlayOnce = dataPlayOnce !== null
        ? dataPlayOnce === 'true'
        : this.settings.playOnce;

      if (entry.isIntersecting) {
        // Element entered the screen
        target.classList.add(this.settings.visibleClass);

        // Stop observing if it should only play once
        if (shouldPlayOnce) {
          this.observer.unobserve(target);
        }
      } else {
        // Element left the screen. 
        // Only remove the class if it is allowed to replay.
        if (!shouldPlayOnce) {
          target.classList.remove(this.settings.visibleClass);
        }
      }
    });
  }
}

// Global exposure & auto-initialization
if (typeof window !== 'undefined') {
  window.ScrollAnimator = ScrollAnimator;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      new ScrollAnimator();
    });
  } else {
    new ScrollAnimator();
  }
}
