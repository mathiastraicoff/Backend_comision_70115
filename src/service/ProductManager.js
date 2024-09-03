import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ProductManager {
    constructor() {
        this.filePath = path.join(__dirname, '../../data/productos.json');
        this._initializeFile();
    }

    async _initializeFile() {
        try {
            await fs.access(this.filePath);
        } catch (error) {
            await fs.writeFile(this.filePath, JSON.stringify([]));
        }
    }

    async getAllProducts(limit) {
        const products = await this._readFile();
        if (limit) {
            return products.slice(0, limit);
        }
        return products;
    }

    async getProductById(id) {
        const products = await this._readFile();
        return products.find(product => product.id === id);
    }

    async addProduct(productData) {
        const products = await this._readFile();
        const newId = products.length > 0 ? Math.max(products.map(p => p.id)) + 1 : 1;
        const newProduct = { id: newId, ...productData };
        products.push(newProduct);
        await this._writeFile(products);
        return newProduct;
    }

    async updateProduct(id, updateData) {
        const products = await this._readFile();
        const index = products.findIndex(p => p.id === id);
        if (index === -1) {
            return null;
        }
        products[index] = { ...products[index], ...updateData };
        await this._writeFile(products);
        return products[index];
    }

    async deleteProduct(id) {
        let products = await this._readFile();
        const index = products.findIndex(p => p.id === id);
        if (index === -1) {
            return null;
        }
        const [deletedProduct] = products.splice(index, 1);

        products = products.map((p, i) => ({ ...p, id: i + 1 }));
        await this._writeFile(products);
        return deletedProduct;
    }

    async _readFile() {
        try {
            const data = await fs.readFile(this.filePath, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            return [];
        }
    }

    async _writeFile(products) {
        try {
            await fs.writeFile(this.filePath, JSON.stringify(products, null, 2));
        } catch (error) {
            console.log('Error writing to file', error);
        }
    }
}

export default ProductManager;
