let cart = JSON.parse(localStorage.getItem('cart')) || [];
let cartCount = cart.reduce((total, item) => total + item.quantity, 0);

const productsData = [
  { id: 1, name: "Whole Grain Bread", price: 40, image: "rectangle-70-22.png", category: "bread" },
  { id: 2, name: "Rye Bread", price: 35, image: "rectangle-71-33.png", category: "bread" },
  { id: 3, name: "French Baguette", price: 25, image: "rectangle-72-44.png", category: "bread" },
  { id: 4, name: "Multigrain Bread", price: 38, image: "rectangle-73-55.png", category: "bread" },
  { id: 5, name: "Sourdough Bread", price: 42, image: "rectangle-74-66.png", category: "bread" },
  { id: 6, name: "Butter Croissant", price: 15, image: "rectangle-20-3.png", category: "pastry" },
  { id: 7, name: "Almond Croissant", price: 18, image: "rectangle-21-4.png", category: "pastry" },
  { id: 8, name: "Chocolate Pastry", price: 16, image: "rectangle-22-5.png", category: "pastry" },
  { id: 9, name: "Danish Pastry", price: 20, image: "rectangle-23-7.png", category: "pastry" },
  { id: 10, name: "Cinnamon Roll", price: 14, image: "rectangle-24-8.png", category: "pastry" },
  { id: 11, name: "Chocolate Cake", price: 25, image: "rectangle-25-6.png", category: "dessert" },
  { id: 12, name: "Puff Pastry", price: 8, image: "rectangle-156-100.png", category: "dessert" },
  { id: 13, name: "Doughnuts", price: 8, image: "rectangle-153-102.png", category: "dessert" },
  { id: 14, name: "Brownies", price: 8, image: "rectangle-154-104.png", category: "dessert" },
  { id: 15, name: "Fruit Tart", price: 22, image: "rectangle-70-22.png", category: "dessert" }
];

const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const cartIcon = document.querySelector('.cart-icon');
const cartCountElement = document.querySelector('.cart-count');
const cartModal = document.querySelector('.cart-modal');
const cartOverlay = document.querySelector('.cart-modal-overlay');
const closeCart = document.querySelector('.close-cart');
const cartItemsContainer = document.querySelector('.cart-items');
const totalPriceElement = document.querySelector('.total-price');
const checkoutBtn = document.querySelector('.checkout-btn');

document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  setupEventListeners();
  setupProducts();
  setupNavLinks();
  setupExploreSection();
});

function setupEventListeners() {
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', toggleMobileMenu);
  }

  if (cartIcon) {
    cartIcon.addEventListener('click', openCart);
  }

  if (closeCart) {
    closeCart.addEventListener('click', closeCartModal);
  }

  if (cartOverlay) {
    cartOverlay.addEventListener('click', closeCartModal);
  }

  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', handleCheckout);
  }

  document.addEventListener('click', (e) => {
    if (navToggle && navMenu && 
        !navToggle.contains(e.target) && 
        !navMenu.contains(e.target)) {
      navToggle.classList.remove('active');
      navMenu.classList.remove('active');
    }
  });
}

function setupProducts() {
  const addToCartButtons = document.querySelectorAll('.btn-add');
  addToCartButtons.forEach((button, index) => {
    button.addEventListener('click', () => addToCart(index));
  });

  const favoriteStars = document.querySelectorAll('.favorite-star');
  favoriteStars.forEach(star => {
    star.addEventListener('click', toggleFavorite);
  });

  const newsletterForms = document.querySelectorAll('.newsletter-form');
  newsletterForms.forEach(form => {
    form.addEventListener('submit', handleNewsletter);
  });
}

function setupNavLinks() {
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      
      if (navToggle && navToggle.classList.contains('active')) {
        toggleMobileMenu();
      }
    });
  });
}

function setupExploreSection() {
  const exploreNavItems = document.querySelectorAll('.explore-nav-item');
  const exploreItems = document.querySelectorAll('.explore-item');
  
  if (exploreNavItems.length > 0) {
    exploreNavItems.forEach(item => {
      item.addEventListener('click', function() {
        exploreNavItems.forEach(nav => nav.classList.remove('active'));
        this.classList.add('active');
        
        const category = this.dataset.category;
        
        exploreItems.forEach(exploreItem => {
          if (category === 'all' || exploreItem.dataset.category === category) {
            exploreItem.style.display = 'block';
          } else {
            exploreItem.style.display = 'none';
          }
        });
      });
    });
  }
}

function toggleMobileMenu() {
  navToggle.classList.toggle('active');
  navMenu.classList.toggle('active');
}

function addToCart(productIndex) {
  const product = productsData[productIndex] || productsData[0];
  
  const existingItem = cart.find(item => item.id === product.id);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      ...product,
      quantity: 1
    });
  }
  
  localStorage.setItem('cart', JSON.stringify(cart));
  
  updateCartCount();
  updateCartModal();
  
  showNotification(`${product.name} added to cart!`, 'success');
  
  const button = document.querySelectorAll('.btn-add')[productIndex];
  if (button) {
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
      button.style.transform = 'scale(1)';
    }, 200);
  }
}

function updateCartCount() {
  cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  
  if (cartCountElement) {
    cartCountElement.textContent = cartCount;
    cartCountElement.style.display = cartCount > 0 ? 'flex' : 'none';
  }
}

function openCart() {
  if (cartModal) cartModal.classList.add('active');
  if (cartOverlay) cartOverlay.classList.add('active');
  updateCartModal();
}

function closeCartModal() {
  if (cartModal) cartModal.classList.remove('active');
  if (cartOverlay) cartOverlay.classList.remove('active');
}

function updateCartModal() {
  if (!cartItemsContainer) return;
  
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div style="text-align: center; padding: var(--space-xl); color: var(--text-rgb-93-93-93);">
        <p style="font-size: 16px; margin-bottom: var(--space-sm);">Cart is empty</p>
        <p>Add items from catalog</p>
      </div>
    `;
    return;
  }
  
  let total = 0;
  cartItemsContainer.innerHTML = '';
  
  cart.forEach((item, index) => {
    total += item.price * item.quantity;
    
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.innerHTML = `
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <p class="cart-item-price">$${item.price} × ${item.quantity} = $${item.price * item.quantity}</p>
      </div>
      <div class="cart-item-actions">
        <button class="quantity-btn decrease" data-index="${index}">-</button>
        <span>${item.quantity}</span>
        <button class="quantity-btn increase" data-index="${index}">+</button>
        <button class="remove-item" data-index="${index}">🗑️</button>
      </div>
    `;
    cartItemsContainer.appendChild(cartItem);
  });
  
  document.querySelectorAll('.quantity-btn').forEach(button => {
    button.addEventListener('click', handleQuantityChange);
  });
  
  document.querySelectorAll('.remove-item').forEach(button => {
    button.addEventListener('click', handleRemoveItem);
  });
  
  if (totalPriceElement) {
    totalPriceElement.textContent = `$${total}`;
  }
}

function handleQuantityChange(e) {
  const index = parseInt(e.target.dataset.index);
  const isIncrease = e.target.classList.contains('increase');
  
  if (isIncrease) {
    cart[index].quantity += 1;
  } else if (cart[index].quantity > 1) {
    cart[index].quantity -= 1;
  } else {
    cart.splice(index, 1);
  }
  
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  updateCartModal();
}

function handleRemoveItem(e) {
  const index = parseInt(e.target.dataset.index);
  const productName = cart[index].name;
  
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  
  updateCartCount();
  updateCartModal();
  showNotification(`${productName} removed from cart`, 'info');
}

function handleCheckout() {
  if (cart.length === 0) {
    showNotification('Cart is empty!', 'error');
    return;
  }
  
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  showNotification(`Order confirmed! Total: $${total}. Thank you!`, 'success');
  
  cart = [];
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  updateCartModal();
  closeCartModal();
}

function toggleFavorite(e) {
  const star = e.target;
  star.classList.toggle('active');
  
  if (star.classList.contains('active')) {
    star.textContent = '★';
    star.style.color = 'gold';
    showNotification('Added to favorites!', 'success');
  } else {
    star.textContent = '⭐';
    star.style.color = '#ddd';
    showNotification('Removed from favorites', 'info');
  }
}

function handleNewsletter(e) {
  e.preventDefault();
  const form = e.target;
  const emailInput = form.querySelector('.newsletter-input');
  const email = emailInput.value;
  
  if (email && validateEmail(email)) {
    showNotification('Thank you for subscribing!', 'success');
    emailInput.value = '';
  } else {
    showNotification('Please enter valid email', 'error');
  }
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function showNotification(message, type = 'success') {
  const existing = document.querySelector('.notification');
  if (existing) {
    existing.remove();
  }
  
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? 'rgba(147, 60, 36, 0.95)' : 
                type === 'error' ? '#ff4444' : '#2196F3'};
    color: white;
    padding: 12px 20px;
    border-radius: 6px;
    box-shadow: 0 3px 10px rgba(0,0,0,0.15);
    z-index: 1002;
    animation: slideIn 0.3s ease;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    max-width: 280px;
  `;
  
  document.body.appendChild(notification);
  
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
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}