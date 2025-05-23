
        document.addEventListener('DOMContentLoaded', function() {
            // Cart functionality
            let cart = [];
            const cartButton = document.getElementById('cart-button');
            const cartPanel = document.getElementById('cart-panel');
            const cartOverlay = document.getElementById('cart-overlay');
            const closeCart = document.getElementById('close-cart');
            const cartItemsContainer = document.getElementById('cart-items');
            const cartCount = document.getElementById('cart-count');
            const cartSubtotal = document.getElementById('cart-subtotal');
            const cartTotal = document.getElementById('cart-total');
            const checkoutButton = document.getElementById('checkout-button');
            
            // Toggle cart panel
            cartButton.addEventListener('click', function() {
                cartPanel.classList.remove('translate-x-full');
                cartOverlay.classList.remove('hidden');
                document.body.style.overflow = 'hidden';
            });
            
            closeCart.addEventListener('click', function() {
                cartPanel.classList.add('translate-x-full');
                cartOverlay.classList.add('hidden');
                document.body.style.overflow = '';
            });
            
            cartOverlay.addEventListener('click', function() {
                cartPanel.classList.add('translate-x-full');
                cartOverlay.classList.add('hidden');
                document.body.style.overflow = '';
            });
            
            // Add to cart functionality
            document.querySelectorAll('.add-to-cart').forEach(button => {
                button.addEventListener('click', function() {
                    const bookCard = this.closest('.book-card');
                    const bookId = bookCard.dataset.id;
                    const bookTitle = bookCard.dataset.title;
                    const bookAuthor = bookCard.dataset.author;
                    const bookPrice = parseFloat(bookCard.dataset.price);
                    const bookImage = bookCard.dataset.image;
                    
                    // Check if book already in cart
                    const existingItem = cart.find(item => item.id === bookId);
                    
                    if (existingItem) {
                        existingItem.quantity += 1;
                    } else {
                        cart.push({
                            id: bookId,
                            title: bookTitle,
                            author: bookAuthor,
                            price: bookPrice,
                            image: bookImage,
                            quantity: 1
                        });
                    }
                    
                    updateCart();
                    
                    // Show cart panel if not already open
                    if (cartPanel.classList.contains('translate-x-full')) {
                        cartPanel.classList.remove('translate-x-full');
                        cartOverlay.classList.remove('hidden');
                        document.body.style.overflow = 'hidden';
                    }
                    
                    // Add animation to button
                    this.innerHTML = '<i class="fas fa-check mr-2"></i> Added';
                    this.classList.remove('bg-green-600', 'hover:bg-green-700');
                    this.classList.add('bg-green-500');
                    
                    setTimeout(() => {
                        this.innerHTML = 'Add to Cart <i class="fas fa-cart-plus ml-2"></i>';
                        this.classList.remove('bg-green-500');
                        this.classList.add('bg-green-600', 'hover:bg-green-700');
                    }, 2000);
                });
            });
            
            function updateCart() {
                // Update cart count
                const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
                cartCount.textContent = totalItems;
                
                // Update cart items
                if (cart.length === 0) {
                    cartItemsContainer.innerHTML = `
                        <div class="text-center text-gray-500 py-8">
                            <i class="fas fa-shopping-cart text-4xl mb-4"></i>
                            <p>Your cart is empty</p>
                        </div>
                    `;
                } else {
                    cartItemsContainer.innerHTML = cart.map(item => `
                        <div class="flex items-center border-b border-gray-200 pb-4">
                            <img src="${item.image}" alt="${item.title}" class="w-16 h-16 object-cover rounded">
                            <div class="ml-4 flex-1">
                                <h4 class="font-medium text-gray-800">${item.title}</h4>
                                <p class="text-sm text-gray-600">${item.author}</p>
                                <div class="flex items-center mt-1">
                                    <span class="text-green-600 font-medium">$${item.price.toFixed(2)}</span>
                                    <span class="text-gray-400 mx-2">×</span>
                                    <div class="flex items-center border border-gray-300 rounded">
                                        <button class="decrease-quantity px-2 py-1 text-gray-600 hover:bg-gray-100" data-id="${item.id}">-</button>
                                        <span class="px-2">${item.quantity}</span>
                                        <button class="increase-quantity px-2 py-1 text-gray-600 hover:bg-gray-100" data-id="${item.id}">+</button>
                                    </div>
                                </div>
                            </div>
                            <button class="remove-item text-red-500 hover:text-red-700 ml-4" data-id="${item.id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    `).join('');
                }
                
                // Calculate totals
                const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
                cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
                cartTotal.textContent = `$${subtotal.toFixed(2)}`;
                
                // Add event listeners to quantity buttons
                document.querySelectorAll('.increase-quantity').forEach(button => {
                    button.addEventListener('click', function() {
                        const itemId = this.dataset.id;
                        const item = cart.find(item => item.id === itemId);
                        if (item) {
                            item.quantity += 1;
                            updateCart();
                        }
                    });
                });
                
                document.querySelectorAll('.decrease-quantity').forEach(button => {
                    button.addEventListener('click', function() {
                        const itemId = this.dataset.id;
                        const itemIndex = cart.findIndex(item => item.id === itemId);
                        if (itemIndex !== -1) {
                            if (cart[itemIndex].quantity > 1) {
                                cart[itemIndex].quantity -= 1;
                            } else {
                                cart.splice(itemIndex, 1);
                            }
                            updateCart();
                        }
                    });
                });
                
                document.querySelectorAll('.remove-item').forEach(button => {
                    button.addEventListener('click', function() {
                        const itemId = this.dataset.id;
                        const itemIndex = cart.findIndex(item => item.id === itemId);
                        if (itemIndex !== -1) {
                            cart.splice(itemIndex, 1);
                            updateCart();
                        }
                    });
                });
            }
            
            // Checkout button
            checkoutButton.addEventListener('click', function() {
                if (cart.length === 0) {
                    alert('Your cart is empty!');
                    return;
                }
                
                // In a real app, this would redirect to a checkout page
                alert(`Proceeding to checkout with ${cart.reduce((total, item) => total + item.quantity, 0)} items. Total: $${cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}`);
                
                // For demo purposes, we'll just clear the cart
                cart = [];
                updateCart();
                cartPanel.classList.add('translate-x-full');
                cartOverlay.classList.add('hidden');
                document.body.style.overflow = '';
            });
            
            // Book card hover effect enhancement
            const bookCards = document.querySelectorAll('.book-card');
            bookCards.forEach(card => {
                card.addEventListener('mouseenter', function() {
                    this.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
                });
            });
            
            // Newsletter form submission
            const newsletterForm = document.querySelector('footer form');
            if(newsletterForm) {
                newsletterForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    alert('Thank you for subscribing to our newsletter!');
                    this.reset();
                });
            }
        });