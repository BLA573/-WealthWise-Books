
        // Cart functionality
        let cart = [];
        let cartCount = 0;
        let cartTotal = 0;

        // DOM elements
        const cartButton = document.getElementById('cartButton');
        const cartCountElement = document.getElementById('cartCount');
        const cartSidebar = document.getElementById('cartSidebar');
        const closeCart = document.getElementById('closeCart');
        const cartOverlay = document.getElementById('cartOverlay');
        const cartItems = document.getElementById('cartItems');
        const cartSubtotal = document.getElementById('cartSubtotal');
        const cartTotalElement = document.getElementById('cartTotal');
        const checkoutBtn = document.getElementById('checkoutBtn');
        const cartNotification = document.getElementById('cartNotification');
        const notificationMessage = document.getElementById('notificationMessage');
        const addToCartButtons = document.querySelectorAll('.add-to-cart');

        // Open cart sidebar
        cartButton.addEventListener('click', () => {
            cartSidebar.classList.add('open');
            cartOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        // Close cart sidebar
        closeCart.addEventListener('click', () => {
            cartSidebar.classList.remove('open');
            cartOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });

        // Close cart when clicking on overlay
        cartOverlay.addEventListener('click', () => {
            cartSidebar.classList.remove('open');
            cartOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });

        // Add to cart functionality
        addToCartButtons.forEach(button => {
            button.addEventListener('click', () => {
                const id = button.getAttribute('data-id');
                const title = button.getAttribute('data-title');
                const price = parseFloat(button.getAttribute('data-price'));
                const image = button.getAttribute('data-image');

                // Check if item already exists in cart
                const existingItem = cart.find(item => item.id === id);

                if (existingItem) {
                    existingItem.quantity += 1;
                } else {
                    cart.push({
                        id,
                        title,
                        price,
                        image,
                        quantity: 1
                    });
                }

                // Update cart count
                cartCount += 1;
                cartCountElement.textContent = cartCount;

                // Update cart total
                cartTotal += price;
                cartSubtotal.textContent = `$${cartTotal.toFixed(2)}`;
                cartTotalElement.textContent = `$${cartTotal.toFixed(2)}`;

                // Update cart items
                updateCartItems();

                // Show notification
                notificationMessage.textContent = `${title} added to cart!`;
                cartNotification.classList.remove('hidden');
                cartNotification.classList.add('show');

                // Hide notification after 3 seconds
                setTimeout(() => {
                    cartNotification.classList.remove('show');
                    setTimeout(() => {
                        cartNotification.classList.add('hidden');
                    }, 300);
                }, 3000);
            });
        });

        // Update cart items in sidebar
        function updateCartItems() {
            if (cart.length === 0) {
                cartItems.innerHTML = '<p class="text-gray-500 text-center py-8">Your cart is empty</p>';
                return;
            }

            cartItems.innerHTML = cart.map(item => `
                <div class="flex items-center space-x-4 border-b border-gray-200 pb-4">
                    <img src="${item.image}" alt="${item.title}" class="w-16 h-16 object-contain">
                    <div class="flex-1">
                        <h4 class="font-medium text-gray-800">${item.title}</h4>
                        <div class="flex justify-between items-center mt-1">
                            <span class="text-green-600 font-medium">$${item.price.toFixed(2)}</span>
                            <div class="flex items-center space-x-2">
                                <button class="decrease-quantity text-gray-500 hover:text-green-600" data-id="${item.id}">
                                    <i class="fas fa-minus text-xs"></i>
                                </button>
                                <span class="quantity">${item.quantity}</span>
                                <button class="increase-quantity text-gray-500 hover:text-green-600" data-id="${item.id}">
                                    <i class="fas fa-plus text-xs"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <button class="remove-item text-gray-400 hover:text-red-500" data-id="${item.id}">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `).join('');

            // Add event listeners to quantity buttons
            document.querySelectorAll('.increase-quantity').forEach(button => {
                button.addEventListener('click', (e) => {
                    const id = e.currentTarget.getAttribute('data-id');
                    const item = cart.find(item => item.id === id);
                    item.quantity += 1;
                    cartCount += 1;
                    cartTotal += item.price;
                    updateCartDisplay();
                });
            });

            document.querySelectorAll('.decrease-quantity').forEach(button => {
                button.addEventListener('click', (e) => {
                    const id = e.currentTarget.getAttribute('data-id');
                    const item = cart.find(item => item.id === id);
                    if (item.quantity > 1) {
                        item.quantity -= 1;
                        cartCount -= 1;
                        cartTotal -= item.price;
                    } else {
                        // Remove item if quantity is 1
                        const itemIndex = cart.findIndex(item => item.id === id);
                        cartCount -= 1;
                        cartTotal -= item.price;
                        cart.splice(itemIndex, 1);
                    }
                    updateCartDisplay();
                });
            });

            document.querySelectorAll('.remove-item').forEach(button => {
                button.addEventListener('click', (e) => {
                    const id = e.currentTarget.getAttribute('data-id');
                    const itemIndex = cart.findIndex(item => item.id === id);
                    const item = cart[itemIndex];
                    cartCount -= item.quantity;
                    cartTotal -= item.price * item.quantity;
                    cart.splice(itemIndex, 1);
                    updateCartDisplay();
                });
            });
        }

        // Update cart display
        function updateCartDisplay() {
            cartCountElement.textContent = cartCount;
            cartSubtotal.textContent = `$${cartTotal.toFixed(2)}`;
            cartTotalElement.textContent = `$${cartTotal.toFixed(2)}`;
            updateCartItems();
        }

        // Checkout button
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                alert('Your cart is empty!');
                return;
            }
            alert(`Proceeding to checkout with ${cartCount} items. Total: $${cartTotal.toFixed(2)}`);
            // In a real app, you would redirect to checkout page
        });

        // Filter functionality
        const categoryFilter = document.getElementById('categoryFilter');
        const sortBy = document.getElementById('sortBy');
        const booksGrid = document.getElementById('booksGrid');
        const bookCards = document.querySelectorAll('.book-card');

        categoryFilter.addEventListener('change', filterBooks);
        sortBy.addEventListener('change', filterBooks);

        function filterBooks() {
            const category = categoryFilter.value;
            const sort = sortBy.value;

            let filteredBooks = Array.from(bookCards);

            // Filter by category
            if (category !== 'all') {
                filteredBooks = filteredBooks.filter(book => {
                    return book.getAttribute('data-category') === category;
                });
            }

            // Sort books
            filteredBooks.sort((a, b) => {
                switch (sort) {
                    case 'rating':
                        return parseFloat(b.getAttribute('data-rating')) - parseFloat(a.getAttribute('data-rating'));
                    case 'price-low':
                        return parseFloat(a.getAttribute('data-price')) - parseFloat(b.getAttribute('data-price'));
                    case 'price-high':
                        return parseFloat(b.getAttribute('data-price')) - parseFloat(a.getAttribute('data-price'));
                    case 'newest':
                        return parseInt(b.getAttribute('data-sales')) - parseInt(a.getAttribute('data-sales'));
                    case 'bestselling':
                    default:
                        return parseInt(b.getAttribute('data-sales')) - parseInt(a.getAttribute('data-sales'));
                }
            });

            // Clear current grid
            booksGrid.innerHTML = '';

            // Add filtered books
            filteredBooks.forEach(book => {
                booksGrid.appendChild(book);
            });
        }