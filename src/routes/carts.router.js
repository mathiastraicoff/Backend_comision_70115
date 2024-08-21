// import { Router } from 'express';
// import CartManager from '../service/CartManager.js';

// const router = Router();
// const cartManager = new CartManager();


// router.post('/', (req, res) => {
//     try {
//         const newCart = cartManager.createCart();
//         res.status(201).json(newCart);
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ error: 'Error al crear el carrito' });
//     }
// });

// // GET /api/carts/:cid
// router.get('/:cid', (req, res) => {
//     try {
//         const cartId = parseInt(req.params.cid);
//         const cart = cartManager.getCartProducts(cartId);
//         if (cart) {
//             res.json(cart);
//         } else {
//             res.status(404).json({ error: 'Carrito no encontrado' });
//         }
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ error: 'Error al obtener los productos del carrito' });
//     }
// });

// // POST /api/carts/:cid/product/:pid
// router.post('/:cid/product/:pid', (req, res) => {
//     try {
//         const cartId = parseInt(req.params.cid);
//         const productId = parseInt(req.params.pid);
//         const updatedCart = cartManager.addProductToCart(cartId, productId);
//         if (updatedCart) {
//             res.json(updatedCart);
//         } else {
//             res.status(404).json({ error: 'Carrito no encontrado' });
//         }
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ error: 'Error al agregar el producto al carrito' });
//     }
// });

// export default router;


import { Router } from 'express';
import CartManager from '../service/CartManager.js';

const router = Router();
const cartManager = new CartManager();

router.post('/', (req, res) => {
    try {
        const newCart = cartManager.createCart();
        res.status(201).json(newCart);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error al crear el carrito' });
    }
});

router.get('/:cid', (req, res) => {
    try {
        const cartId = parseInt(req.params.cid);
        const cartProducts = cartManager.getCartProducts(cartId);
        if (cartProducts) {
            res.json(cartProducts);
        } else {
            res.status(404).json({ error: 'Carrito no encontrado' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error al obtener los productos del carrito' });
    }
});

router.post('/:cid/product/:pid', (req, res) => {
    try {
        const cartId = parseInt(req.params.cid);
        const productId = parseInt(req.params.pid);
        const updatedCart = cartManager.addProductToCart(cartId, productId);
        if (updatedCart) {
            res.json(updatedCart);
        } else {
            res.status(404).json({ error: 'Carrito o producto no encontrado' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error al agregar el producto al carrito' });
    }
});

export default router;
