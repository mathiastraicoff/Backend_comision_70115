import { Router } from "express";
import ProductManager from "../service/ProductManager.js";

const router = Router();
const productManager = new ProductManager();

export default function (socketServer) {
    // GET 
    router.get("/", async (req, res) => {
        try {
            const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
            const products = await productManager.getAllProducts(limit);
            res.json(products);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Error fetching products' });
        }
    });

    router.get("/:pid", async (req, res) => {
        try {
            const productId = parseInt(req.params.pid);
            const product = await productManager.getProductById(productId);
            if (product) {
                res.json(product);
            } else {
                res.status(404).json({ error: "Producto no encontrado" });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Error fetching product' });
        }
    });

    // POST 
    router.post("/", async (req, res) => {
        console.log("Solicitud POST recibida");
        try {
            const { title, description, code, price, stock, category, thumbnails } =
                req.body;
            if (!title || !description || !code || !price || !stock || !category) {
                return res.status(400).json({
                    error: "Todos los campos son obligatorios excepto thumbnails",
                });
            }

            const newProduct = await productManager.addProduct({
                title,
                description,
                code,
                price,
                stock,
                category,
                thumbnails,
            });
            const products = await productManager.getAllProducts();
            socketServer.emit("updateProducts", products); 
            res.status(201).json(newProduct);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Error adding product' });
        }
    });

    // PUT
    router.put("/:pid", async (req, res) => {
        try {
            const productId = parseInt(req.params.pid);
            const updateProduct = await productManager.updateProduct(
                productId,
                req.body,
            );
            if (updateProduct) {
                res.json(updateProduct);
            } else {
                res.status(404).json({ error: "Producto no encontrado" });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Error updating product' });
        }
    });

    // DELETE 
    router.delete("/:pid", async (req, res) => {
        try {
            const productId = parseInt(req.params.pid);
            const deletedProduct = await productManager.deleteProduct(productId);
            if (deletedProduct) {
                const products = await productManager.getAllProducts();
                socketServer.emit("updateProducts", products);
                res.json(deletedProduct);
            } else {
                res.status(404).json({ error: "Producto no encontrado" });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Error deleting product' });
        }
    });

    return router;
}
