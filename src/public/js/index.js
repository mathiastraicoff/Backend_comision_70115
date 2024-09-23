if (typeof socket === "undefined") {
const socket = io();

function addProductToCart(productId) {
    
    let cartId = localStorage.getItem('cartId');
    if (!cartId) {
        socket.emit('createCart');
    } else {
        socket.emit('addProductToCart', { productId });
    }
}

socket.on('cartCreated', ({ cartId }) => {
    localStorage.setItem('cartId', cartId);
});

socket.on('addProductSuccess', (message) => {
    updateCartCount();
});

socket.on('addProductError', (error) => {
    console.error('Error al agregar al carrito:', error.message);
});

function updateCartCount() {
    let cartId = localStorage.getItem('cartId');
    if (cartId) {
        socket.emit('getCart', { cartId });
    }
}

socket.on('cartUpdated', (cart) => {
    const cartCount = cart.products.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-count').innerText = cartCount;
});
}