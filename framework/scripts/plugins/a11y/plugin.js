/**
 * CSSS Accessibility Plugin
 *
 * Helps to make slides more keyboard and screen reader friendly by
 * providing the following:
 *
 * - Sets `role` for each slide for semantic context
 * - Sets `aria-roledescription` for each slide for extra context
 * - Sets `aria-label` for each slide to provide an accessible name
 * - Outputs a link list for keyboard controls to load previous and next slides
 * - Shifts focus to slide content container on link click
 *
 * @author Scott Vinkle <scott.vinkle@shopify.com>
 * @version 0.1.0
 * @license MIT License
 */

(function() {
  var self = (window.a11y = {
    /**
     * Set slides to be more screen reader friendly.
     *
     * @return null
     */
    setupSlides: function() {
      // Check for `slideshow.slides` object
      if (!window.slideshow.slides) {
        return;
      }

      // Local slide object
      var slide = {
        all: window.slideshow.slides,
        current: null,
        index: 0,
        next: null,
        prev: null,
        title: '',
        total: window.slideshow.slides.length
      };

      // Iterarte over each slide available…
      for (; slide.index < slide.total; slide.index++) {
        // Cache current slide
        slide.current = slide.all[slide.index];

        // Previous slide
        if (slide.index !== 0) {
          slide.prev = slide.all[slide.index - 1];
        }

        // Next slide
        slide.next = slide.all[slide.index + 1];

        // Cache current slide title
        slide.title = slide.current.getAttribute('data-title');

        // Set current slide attributes
        slide.current.setAttribute('role', 'region');
        slide.current.setAttribute('aria-roledescription', 'slide');
        slide.current.setAttribute('aria-label', slide.index + 1 + ' - ' + slide.title);

        // Setup controls for current slide
        self.slideControls(slide.current, slide.prev, slide.next);
      }
    },

    /**
     * Create and output the list of links for keyboard and screen reader
     * users.
     *
     * @param {Element} currentSlide Slide `section` HTML element
     * @param {Element} prevSlide Slide `section` HTML element
     * @param {Element} nextSlide Slide `section` HTML element
     * @return null
     */
    slideControls: function(currentSlide, prevSlide, nextSlide) {
      // Create document fragment to hold list and controls
      var fragment = document.createDocumentFragment();

      // Create list and controls
      var controls = {
        list: document.createElement('ul'),
        next: {
          item: document.createElement('li'),
          link: document.createElement('a')
        },
        prev: {
          item: document.createElement('li'),
          link: document.createElement('a')
        },
        strings: {
          next: 'Next&nbsp;<span aria-hidden="true">&raquo;</span>',
          nextAT: 'Next Slide',
          previous: '<span aria-hidden="true">&laquo;</span>&nbsp;Previous',
          previousAT: 'Previous Slide'
        }
      };

      // List classes
      controls.list.setAttribute('role', 'list');
      controls.list.classList.add('a11y-controls__list');

      // List items classes
      controls.prev.item.classList.add('a11y-controls__item');
      controls.next.item.classList.add('a11y-controls__item');

      // Previous link classes
      controls.prev.link.classList.add('a11y-controls__link');
      controls.prev.link.classList.add('visuallyhidden');
      controls.prev.link.classList.add('focusable');

      // Next link classes
      controls.next.link.classList.add('a11y-controls__link');
      controls.next.link.classList.add('visuallyhidden');
      controls.next.link.classList.add('focusable');

      // Output previous link if available
      if (prevSlide !== null) {
        // Previous link attributes
        controls.prev.link.href = '#' + prevSlide.id;
        controls.prev.link.target = '_self';
        controls.prev.link.innerHTML = controls.strings.previous;
        controls.prev.link.setAttribute('aria-label', controls.strings.previousAT);

        // Load previous slide on click
        controls.prev.link.addEventListener('click', function() {
          self.shiftFocus(prevSlide);
        }, false);

        // Output previous link within list item
        controls.prev.item.appendChild(controls.prev.link);
        controls.list.appendChild(controls.prev.item);
      }

      // Output next link if available
      if (nextSlide !== undefined) {
        // Next link attributes
        controls.next.link.href = '#' + nextSlide.id;
        controls.next.link.target = '_self';
        controls.next.link.innerHTML = controls.strings.next;
        controls.next.link.setAttribute('aria-label', controls.strings.nextAT);

        // Load next slide on click
        controls.next.link.addEventListener('click', function() {
          self.shiftFocus(nextSlide);
        }, false);

        // Output next link within list item
        controls.next.item.appendChild(controls.next.link);
        controls.list.appendChild(controls.next.item);
      }

      // Output list and append to slide `section`
      fragment.appendChild(controls.list);
      currentSlide.appendChild(fragment);
    },

    /**
     * Shift keyboard focus to the Slide on link click event. This helps
     * to provide greater context for screen reader users for when a
     * slide loads.
     *
     * @param {Element} slide Slide `section` HTML element
     * @return null
     */
    shiftFocus: function(slide) {
      var addFocus = function(callback) {
        // Set `tabindex` on the slide in order for it to receive focus
        slide.setAttribute('tabindex', -1);

        // Send keyboard focus to the slide
        slide.focus();

        // Remove focus
        callback();
      }

      var removeFocus = function() {
        // Remove `tabindex` in order to not disrupt Slide keyboard navigation
        slide.removeAttribute('tabindex');
      }

      addFocus(removeFocus);
    },

    /**
     * Initialize the plugin by calling setupSlides method.
     *
     * @return null
     */
    init: function() {
      // Check for `slideshow` object
      if (!window.slideshow) {
        return;
      }

      self.setupSlides();
    }
  });

  // Initialize the plugin when page content has loaded
  document.addEventListener('DOMContentLoaded', self.init);
})();
