    // Gallery data with images and captions
    const galleryImages = [
      { src: 'images/rectangle-70-22.png', caption: 'Свежий хлеб', category: 'bread' },
      { src: 'images/rectangle-71-33.png', caption: 'Арт-хлеб', category: 'bread' },
      { src: 'images/rectangle-20-3.png', caption: 'Круассаны', category: 'pastry' },
      { src: 'images/rectangle-21-4.png', caption: 'Маффины', category: 'pastry' },
      { src: 'images/rectangle-22-5.png', caption: 'Торты', category: 'desserts' },
      { src: 'images/rectangle-23-7.png', caption: 'Пирожные', category: 'desserts' },
      { src: 'images/rectangle-24-8.png', caption: 'Пончики', category: 'desserts' },
      { src: 'images/rectangle-25-6.png', caption: 'Брауни', category: 'desserts' },
      { src: 'images/rectangle-156-100.png', caption: 'Интерьер пекарни', category: 'bakery' },
      { src: 'images/rectangle-153-102.png', caption: 'Процесс выпечки', category: 'bakery' },
      { src: 'images/rectangle-154-104.png', caption: 'Свежие ингредиенты', category: 'bakery' },
      { src: 'images/rectangle-70-22.png', caption: 'Наша команда', category: 'bakery' }
    ];

    // Slideshow variables
    let currentSlide = 0;
    const slideshowModal = document.querySelector('.slideshow-modal');
    const slideshowImage = document.querySelector('.slideshow-image');
    const slideshowCaption = document.querySelector('.slideshow-caption');
    const slideCounter = document.querySelector('.slide-counter');
    const closeSlideshowBtn = document.querySelector('.close-slideshow');
    const prevSlideBtn = document.querySelector('.prev-slide');
    const nextSlideBtn = document.querySelector('.next-slide');

    document.addEventListener('DOMContentLoaded', function() {
      // Gallery filtering
      const categoryBtns = document.querySelectorAll('.category-btn');
      const galleryItems = document.querySelectorAll('.gallery-item');
      
      categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
          // Remove active class from all buttons
          categoryBtns.forEach(b => b.classList.remove('active'));
          // Add active class to clicked button
          this.classList.add('active');
          
          const category = this.dataset.category;
          
          // Show/hide gallery items
          galleryItems.forEach(item => {
            if (category === 'all' || item.dataset.category === category) {
              item.style.display = 'block';
            } else {
              item.style.display = 'none';
            }
          });
        });
      });
      
      // Click on gallery item to open slideshow
      galleryItems.forEach((item, index) => {
        item.addEventListener('click', function() {
          currentSlide = parseInt(this.dataset.index);
          openSlideshow(currentSlide);
        });
      });
      
      // Slideshow navigation
      closeSlideshowBtn.addEventListener('click', closeSlideshow);
      
      prevSlideBtn.addEventListener('click', function() {
        navigateSlideshow(-1);
      });
      
      nextSlideBtn.addEventListener('click', function() {
        navigateSlideshow(1);
      });
      
      // Keyboard navigation for slideshow
      document.addEventListener('keydown', function(e) {
        if (slideshowModal.classList.contains('active')) {
          if (e.key === 'Escape') {
            closeSlideshow();
          } else if (e.key === 'ArrowLeft') {
            navigateSlideshow(-1);
          } else if (e.key === 'ArrowRight') {
            navigateSlideshow(1);
          }
        }
      });
      
      // Close slideshow when clicking outside image
      slideshowModal.addEventListener('click', function(e) {
        if (e.target === slideshowModal) {
          closeSlideshow();
        }
      });
    });

    // Slideshow functions
    function openSlideshow(index) {
      currentSlide = index;
      updateSlideshow();
      slideshowModal.classList.add('active');
      document.body.style.overflow = 'hidden'; // Prevent scrolling
    }

    function closeSlideshow() {
      slideshowModal.classList.remove('active');
      document.body.style.overflow = ''; // Re-enable scrolling
    }

    function navigateSlideshow(direction) {
      currentSlide += direction;
      
      // Loop slideshow
      if (currentSlide < 0) {
        currentSlide = galleryImages.length - 1;
      } else if (currentSlide >= galleryImages.length) {
        currentSlide = 0;
      }
      
      updateSlideshow();
    }

    function updateSlideshow() {
      const image = galleryImages[currentSlide];
      slideshowImage.src = image.src;
      slideshowImage.alt = image.caption;
      slideshowCaption.textContent = image.caption;
      slideCounter.textContent = `${currentSlide + 1} / ${galleryImages.length}`;
      
      // Add animation
      slideshowImage.style.opacity = '0';
      setTimeout(() => {
        slideshowImage.style.transition = 'opacity 0.3s ease';
        slideshowImage.style.opacity = '1';
      }, 50);
    }

    // Auto-rotate slideshow every 5 seconds
    let slideshowInterval;
    
    function startAutoSlideshow() {
      slideshowInterval = setInterval(() => {
        if (slideshowModal.classList.contains('active')) {
          navigateSlideshow(1);
        }
      }, 5000);
    }
    
    function stopAutoSlideshow() {
      clearInterval(slideshowInterval);
    }
    
    // Start auto slideshow when modal opens
    slideshowModal.addEventListener('click', function() {
      if (slideshowModal.classList.contains('active')) {
        stopAutoSlideshow();
        startAutoSlideshow();
      }
    });
    
    // Initialize auto slideshow
    startAutoSlideshow();