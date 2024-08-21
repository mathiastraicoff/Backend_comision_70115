import fs from 'fs/promises';
import path from 'path';

const cartsFilePath = path.resolve('data', 'carts.json');
const productsFilePath = path.resolve('data', 'productos.json'); 
export default class CartManager {
    constructor() {
        this.carts = [];
        this.products = [];
        this.init();
    }

    async init() {
        try {
            const cartsData = await fs.readFile(cartsFilePath, 'utf-8');
            this.carts = JSON.parse(cartsData);
        } catch (error) {
            this.carts = [];
        }

        try {
            const productsData = await fs.readFile(productsFilePath, 'utf-8');
            this.products = JSON.parse(productsData);
        } catch (error) {
            console.error('Error al cargar los productos:', error);
            this.products = [];
        }
    }

    saveToFile() {
        fs.writeFile(cartsFilePath, JSON.stringify(this.carts, null, 2));
    }

    createCart() {
        const newCart = {
            id: this.carts.length ? this.carts[this.carts.length - 1].id + 1 : 1,
            products: []
        };
        this.carts.push(newCart);
        this.saveToFile();
        return newCart;
    }

    getCartById(id) {
        return this.carts.find(cart => cart.id === id);
    }

    getProductById(productId) {
        return this.products.find(product => product.id === productId);
    }

    addProductToCart(cartId, productId) {
        const cart = this.getCartById(cartId);
        const product = this.getProductById(productId);

        if (cart && product) {
            const productIndex = cart.products.findIndex(p => p.product === productId);
            if (productIndex > -1) {
                cart.products[productIndex].quantity += 1;
            } else {
                cart.products.push({ product: productId, quantity: 1 });
            }
            this.saveToFile();
            return cart;
        }

        return null;
    }

    getCartProducts(cartId) {
        const cart = this.getCartById(cartId);
        if (!cart) return null;

        return cart.products.map(cartProduct => ({
            product: cartProduct.product,
            quantity: cartProduct.quantity
        }));
    }
}
