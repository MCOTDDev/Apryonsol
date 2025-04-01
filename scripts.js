document.addEventListener('DOMContentLoaded', function() {
    // Product Filtering
    setupFilterButtons();
    
    // Image Carousel
    setupImageCarousels();
    
    // Cart Functionality
    setupCartFunctionality();
    
    // Footer Link Functionality
    setupFooterLinks();
    
    // Newsletter Subscription
    setupNewsletterForm();
});

// Product Filtering
function setupFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-button');
    const productCards = document.querySelectorAll('.product-card');
    const footerFilterLinks = document.querySelectorAll('.footer-section a[data-filter]');
    
    // Combine both filter buttons and footer links
    const allFilterElements = [...filterButtons, ...footerFilterLinks];
    
    allFilterElements.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all filter buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Find the corresponding filter button if clicked from footer
            if (this.tagName === 'A') {
                const category = this.getAttribute('data-filter');
                const correspondingButton = Array.from(filterButtons).find(
                    btn => btn.getAttribute('data-filter') === category
                );
                if (correspondingButton) {
                    correspondingButton.classList.add('active');
                }
            } else {
                // Add active class to clicked button if it's a direct filter button
                this.classList.add('active');
            }
            
            const category = this.getAttribute('data-filter');
            
            // Filter products
            productCards.forEach(card => {
                if (category === 'all') {
                    card.classList.remove('hidden');
                } else {
                    const cardCategories = card.getAttribute('data-category').split(' ');
                    if (cardCategories.includes(category)) {
                        card.classList.remove('hidden');
                    } else {
                        card.classList.add('hidden');
                    }
                }
            });
            
            // Scroll to products section if clicked from footer
            if (this.tagName === 'A') {
                document.querySelector('.store-container').scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Image Carousel
function setupImageCarousels() {
    const carousels = document.querySelectorAll('.image-carousel');
    
    carousels.forEach(carousel => {
        const container = carousel.querySelector('.carousel-container');
        const images = carousel.querySelectorAll('.carousel-image');
        const dots = carousel.querySelectorAll('.carousel-dot');
        const prevBtn = carousel.querySelector('.carousel-prev');
        const nextBtn = carousel.querySelector('.carousel-next');
        
        let currentIndex = 0;
        
        // Function to show specific slide
        const showSlide = (index) => {
            // Remove active class from all images and dots
            images.forEach(img => img.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));
            
            // Add active class to current image and dot
            images[index].classList.add('active');
            dots[index].classList.add('active');
            
            currentIndex = index;
        };
        
        // Set up click events for dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => showSlide(index));
        });
        
        // Set up previous button
        prevBtn.addEventListener('click', () => {
            let newIndex = currentIndex - 1;
            if (newIndex < 0) newIndex = images.length - 1;
            showSlide(newIndex);
        });
        
        // Set up next button
        nextBtn.addEventListener('click', () => {
            let newIndex = currentIndex + 1;
            if (newIndex >= images.length) newIndex = 0;
            showSlide(newIndex);
        });
        
        // Setup touch swiping functionality
        let touchStartX = 0;
        let touchEndX = 0;
        
        container.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, false);
        
        container.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, false);
        
        const handleSwipe = () => {
            const swipeThreshold = 50;
            if (touchEndX < touchStartX - swipeThreshold) {
                // Swipe left - next slide
                let newIndex = currentIndex + 1;
                if (newIndex >= images.length) newIndex = 0;
                showSlide(newIndex);
            } else if (touchEndX > touchStartX + swipeThreshold) {
                // Swipe right - previous slide
                let newIndex = currentIndex - 1;
                if (newIndex < 0) newIndex = images.length - 1;
                showSlide(newIndex);
            }
        };
        
        // Auto rotate images every 5 seconds
        let interval = setInterval(() => {
            let newIndex = currentIndex + 1;
            if (newIndex >= images.length) newIndex = 0;
            showSlide(newIndex);
        }, 5000);
        
        // Pause auto rotation when hovering over carousel
        carousel.addEventListener('mouseenter', () => {
            clearInterval(interval);
        });
        
        carousel.addEventListener('mouseleave', () => {
            interval = setInterval(() => {
                let newIndex = currentIndex + 1;
                if (newIndex >= images.length) newIndex = 0;
                showSlide(newIndex);
            }, 5000);
        });
    });
}

// Cart Functionality
function setupCartFunctionality() {
    const cartIcon = document.querySelector('.cart-icon');
    const cartModal = document.getElementById('cartModal');
    const closeCartButton = document.querySelector('.close-cart');
    const cartItemsContainer = document.querySelector('.cart-items');
    const totalAmountElement = document.querySelector('.total-amount');
    const cartCountElement = document.querySelector('.cart-count');
    const checkoutButton = document.querySelector('.checkout-button');
    const buyButtons = document.querySelectorAll('.buy-button');
    const emptyCartMessage = document.querySelector('.empty-cart-message');
    
    let cart = [];
    
    // Open cart modal
    cartIcon.addEventListener('click', () => {
        cartModal.classList.add('active');
    });
    
    // Close cart modal
    closeCartButton.addEventListener('click', () => {
        cartModal.classList.remove('active');
    });
    
    // Close cart modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.classList.remove('active');
        }
    });
    
    // Add items to cart
    buyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const id = button.getAttribute('data-id');
            const name = button.getAttribute('data-name');
            const price = parseFloat(button.getAttribute('data-price'));
            const productCard = button.closest('.product-card');
            const image = productCard.querySelector('.carousel-image.active').src;
            
            // Check if item already exists in cart
            const existingItem = cart.find(item => item.id === id);
            
            if (existingItem) {
                // Increase quantity
                existingItem.quantity++;
            } else {
                // Add new item
                cart.push({
                    id,
                    name,
                    price,
                    image,
                    quantity: 1
                });
            }
            
            // Update cart UI
            updateCart();
            
            // Show notification
            const notification = document.createElement('div');
            notification.className = 'notification';
            notification.textContent = `${name} added to cart!`;
            notification.style.position = 'fixed';
            notification.style.top = '20px';
            notification.style.left = '50%';
            notification.style.transform = 'translateX(-50%)';
            notification.style.backgroundColor = '#00A1E6';
            notification.style.color = 'white';
            notification.style.padding = '10px 20px';
            notification.style.borderRadius = '20px';
            notification.style.zIndex = '9999';
            notification.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.2)';
            notification.style.border = '2px solid black';
            
            document.body.appendChild(notification);
            
            // Remove notification after 3 seconds
            setTimeout(() => {
                notification.style.opacity = '0';
                notification.style.transition = 'opacity 0.5s ease';
                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 500);
            }, 2000);
        });
    });
    
    // Update cart UI
    function updateCart() {
        // Update cart count
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCountElement.textContent = totalItems;
        
        // Update cart items
        cartItemsContainer.innerHTML = '';
        
        if (cart.length === 0) {
            cartItemsContainer.appendChild(emptyCartMessage);
            checkoutButton.disabled = true;
            totalAmountElement.textContent = '$0.00';
            return;
        }
        
        // Hide empty cart message
        emptyCartMessage.remove();
        
        // Calculate total price
        let totalPrice = 0;
        
        // Add items to cart UI
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn minus" data-id="${item.id}">-</button>
                        <span class="quantity-value">${item.quantity}</span>
                        <button class="quantity-btn plus" data-id="${item.id}">+</button>
                    </div>
                </div>
                <button class="remove-item" data-id="${item.id}">×</button>
            `;
            
            cartItemsContainer.appendChild(cartItem);
            
            // Add to total price
            totalPrice += item.price * item.quantity;
        });
        
        // Update total price
        totalAmountElement.textContent = `$${totalPrice.toFixed(2)}`;
        
        // Enable checkout button
        checkoutButton.disabled = false;
        
        // Add event listeners for quantity buttons and remove buttons
        document.querySelectorAll('.quantity-btn.minus').forEach(button => {
            button.addEventListener('click', () => {
                const id = button.getAttribute('data-id');
                const item = cart.find(item => item.id === id);
                
                if (item.quantity > 1) {
                    item.quantity--;
                } else {
                    // Remove item if quantity becomes 0
                    cart = cart.filter(cartItem => cartItem.id !== id);
                }
                
                updateCart();
            });
        });
        
        document.querySelectorAll('.quantity-btn.plus').forEach(button => {
            button.addEventListener('click', () => {
                const id = button.getAttribute('data-id');
                const item = cart.find(item => item.id === id);
                item.quantity++;
                updateCart();
            });
        });
        
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', () => {
                const id = button.getAttribute('data-id');
                cart = cart.filter(item => item.id !== id);
                updateCart();
            });
        });
    }
    
    // Checkout button (for future implementation)
    checkoutButton.addEventListener('click', () => {
        alert('Checkout functionality coming soon!');
    });
}

// Footer Link Functionality
function setupFooterLinks() {
    // Set up Customer Service links
    const customerServiceLinks = document.querySelectorAll('.footer-section:nth-child(2) a');
    const policies = {
        'Shipping Policy': 'Free shipping on all orders over $50! Standard shipping (5-7 business days) is $4.99 for orders under $50. Express shipping (2-3 business days) is available for $9.99.',
        'Returns & Refunds': 'We offer a 30-day money-back guarantee on all unused merchandise. Return shipping is free for defective items. For non-defective returns, a $5 restocking fee may apply.',
        'FAQ': `
            Q: How long does shipping take?
            A: Standard shipping takes 5-7 business days. Express shipping takes 2-3 business days.
            
            Q: What payment methods do you accept?
            A: We accept all major credit cards, PayPal, and crypto payments in BTC, ETH, and SOL.
            
            Q: How do I track my order?
            A: You'll receive a tracking number via email once your order ships.
        `
    };
    
    customerServiceLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const linkText = this.textContent;
            const message = policies[linkText] || 'Information coming soon!';
            
            // Create and show modal
            showInfoModal(linkText, message);
        });
    });
    
    // Set up About Apry links
    const aboutApryLinks = document.querySelectorAll('.footer-section:nth-child(3) a');
    const aboutInfo = {
        'Our Story': 'Apry was founded in 2024 by a group of traders. Our mission - build a strong community, have fun, and chase big dreams together. Apry aims to make crypto more fun and accessible for everyone.',
        'Community': 'Join our thriving community of over 1000 crypto enthusiasts! We have an active Telegram channel where we discuss market trends, share memes, and announce exclusive opportunities.',
        'Token': 'The $APRY token powers our ecosystem, fueling growth and community engagement. Merch revenue helps burn supply, making Apry more than just a meme—it’s a movement.'
    };
    
    aboutApryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const linkText = this.textContent;
            const message = aboutInfo[linkText] || 'Information coming soon!';
            
            // Create and show modal directly without alert
            showInfoModal(linkText, message);
        });
    });
    
    // Helper function to show info modal
    function showInfoModal(title, content) {
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'info-modal';
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        modal.style.zIndex = '2000';
        modal.style.display = 'flex';
        modal.style.justifyContent = 'center';
        modal.style.alignItems = 'center';
        
        // Create modal content
        const modalContent = document.createElement('div');
        modalContent.style.backgroundColor = 'white';
        modalContent.style.borderRadius = '12px';
        modalContent.style.maxWidth = '500px';
        modalContent.style.width = '90%';
        modalContent.style.maxHeight = '80vh';
        modalContent.style.overflowY = 'auto';
        modalContent.style.padding = '20px';
        modalContent.style.position = 'relative';
        modalContent.style.border = '3px solid black';
        
        // Create close button
        const closeButton = document.createElement('button');
        closeButton.innerHTML = '&times;';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '10px';
        closeButton.style.right = '15px';
        closeButton.style.background = 'none';
        closeButton.style.border = 'none';
        closeButton.style.fontSize = '24px';
        closeButton.style.cursor = 'pointer';
        
        // Create title
        const titleElement = document.createElement('h3');
        titleElement.textContent = title;
        titleElement.style.marginTop = '0';
        titleElement.style.fontFamily = "'Chewy', cursive";
        titleElement.style.color = '#00A1E6';
        titleElement.style.marginBottom = '15px';
        
        // Create content
        const contentElement = document.createElement('p');
        contentElement.innerHTML = content.replace(/\n/g, '<br>');
        contentElement.style.lineHeight = '1.5';
        
        // Append elements
        modalContent.appendChild(closeButton);
        modalContent.appendChild(titleElement);
        modalContent.appendChild(contentElement);
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
        
        // Add event listeners
        closeButton.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }
}

// Newsletter Subscription
function setupNewsletterForm() {
    const emailInput = document.getElementById('newsletterEmail');
    const subscribeButton = document.getElementById('subscribeButton');
    const subscribeMessage = document.getElementById('subscribeMessage');
    
    subscribeButton.addEventListener('click', () => {
        const email = emailInput.value.trim();
        
        if (email === '') {
            subscribeMessage.textContent = 'Please enter your email address.';
            subscribeMessage.style.color = '#ff6b6b';
            return;
        }
        
        if (!isValidEmail(email)) {
            subscribeMessage.textContent = 'Please enter a valid email address.';
            subscribeMessage.style.color = '#ff6b6b';
            return;
        }
        
        subscribeMessage.textContent = 'Thanks for subscribing!';
        subscribeMessage.style.color = '#4CAF50';
        emailInput.value = '';
        
        // Clear success message after 3 seconds
        setTimeout(() => {
            subscribeMessage.textContent = '';
        }, 3000);
    });
    
    // Validate email format
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Submit on Enter key
    emailInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            subscribeButton.click();
        }
    });
}