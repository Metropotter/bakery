// Contact form handling
    document.addEventListener('DOMContentLoaded', function() {
      const contactForm = document.getElementById('contactForm');
      
      if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
          e.preventDefault();
          
          // Get form values
          const name = document.getElementById('name').value;
          const email = document.getElementById('email').value;
          const phone = document.getElementById('phone').value;
          const subject = document.getElementById('subject').value;
          const message = document.getElementById('message').value;
          
          // Simple validation
          if (!name || !email || !message) {
            showNotification('Пожалуйста, заполните обязательные поля', 'error');
            return;
          }
          
          if (!validateEmail(email)) {
            showNotification('Пожалуйста, введите корректный email', 'error');
            return;
          }
          
          // Simulate form submission
          const submitBtn = contactForm.querySelector('.submit-btn');
          const originalText = submitBtn.innerHTML;
          
          submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
          submitBtn.disabled = true;
          
          setTimeout(() => {
            // Success simulation
            showNotification('Сообщение отправлено! Мы свяжемся с вами в ближайшее время.', 'success');
            
            // Reset form
            contactForm.reset();
            
            // Restore button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            // Show confirmation details
            console.log('Contact Form Submission:', {
              name, email, phone, subject, message,
              timestamp: new Date().toISOString()
            });
          }, 1500);
        });
      }
      
      // Phone input formatting
      const phoneInput = document.getElementById('phone');
      if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
          let value = e.target.value.replace(/\D/g, '');
          
          if (value.length > 0) {
            if (!value.startsWith('7') && !value.startsWith('8')) {
              value = '7' + value;
            }
            
            let formatted = '+7 ';
            
            if (value.length > 1) {
              formatted += '(' + value.substring(1, 4);
            }
            if (value.length >= 4) {
              formatted += ') ' + value.substring(4, 7);
            }
            if (value.length >= 7) {
              formatted += '-' + value.substring(7, 9);
            }
            if (value.length >= 9) {
              formatted += '-' + value.substring(9, 11);
            }
            
            e.target.value = formatted.substring(0, 18);
          }
        });
      }
    });
    
    // Helper functions
    function validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    }
    
    function showNotification(message, type = 'success') {
      // Remove existing notification
      const existing = document.querySelector('.notification');
      if (existing) {
        existing.remove();
      }
      
      // Create notification
      const notification = document.createElement('div');
      notification.className = `notification ${type}`;
      notification.textContent = message;
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'rgba(147, 60, 36, 0.95)' : '#f44336'};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1002;
        animation: slideIn 0.3s ease;
        font-family: 'Inter', sans-serif;
        font-size: 16px;
        max-width: 300px;
      `;
      
      document.body.appendChild(notification);
      
      // Add CSS animation if not exists
      if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
          @keyframes slideIn {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
          
          @keyframes slideOut {
            from {
              transform: translateX(0);
              opacity: 1;
            }
            to {
              transform: translateX(100%);
              opacity: 0;
            }
          }
        `;
        document.head.appendChild(style);
      }
      
      // Remove after 3 seconds
      setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
          notification.remove();
        }, 300);
      }, 3000);
    }