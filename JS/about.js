
        // Simple cart count functionality (same as other pages)
        const cartButton = document.getElementById('cartButton');
        const cartCount = document.getElementById('cartCount');
        
        // Just showing the cart button works - no actual cart functionality needed 
        cartButton.addEventListener('click', () => {
            alert("This is just a demo! Cart functionality works on other pages.");
        });