import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import __dirname from './utils.js';

const app = express();
const SERVER_PORT = 8080;

// Configuración de Express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, '/public')));

// Crear servidor HTTP y WebSocket
const httpServer = app.listen(SERVER_PORT, () => {
    console.log(`Servidor escuchando por el puerto: ${SERVER_PORT}`);
});

const socketServer = new Server(httpServer);

app.use('/api/products', productsRouter(socketServer));
app.use('/api/carts', cartsRouter);

// Rutas para renderizar vistas
app.get('/realtimeproducts', (req, res) => {
    const filePath = path.join(__dirname, '../data/productos.json');

    fs.readFile(filePath, 'utf8')
        .then((data) => {
            const products = JSON.parse(data);
            res.render('realTimeProducts', { products });
        })
        .catch((err) => {
            console.error('Error leyendo el archivo:', err);
            res.status(500).send('Error al leer los productos');
        });
});

app.get('/home', (req, res) => {
    const filePath = path.join(__dirname, '../data/productos.json');

    fs.readFile(filePath, 'utf8')
        .then((data) => {
            const products = JSON.parse(data);
            res.render('home', { products });
        })
        .catch((err) => {
            console.error('Error leyendo el archivo:', err);
            res.status(500).send('Error al leer los productos');
        });
});

app.get('/ping', (req, res) => {
    res.render("index");
});

// Manejo de eventos WebSocket
socketServer.on('connection', (socket) => {

    // Enviar todos los productos al cliente conectado
    socket.on('requestProducts', async () => {
        const filePath = path.join(__dirname, '../data/productos.json');
        try {
            const data = await fs.readFile(filePath, 'utf8');
            const products = JSON.parse(data);
            socket.emit('updateProducts', products);
        } catch (error) {
            console.error('Error leyendo el archivo:', error);
        }
    });

// Agregar un nuevo producto
socket.on('addProduct', async (productData) => {
    const filePath = path.join(__dirname, '../data/productos.json');
    try {
        const data = await fs.readFile(filePath, 'utf8');
        const products = JSON.parse(data);
        const newId = products.length > 0 ? Math.max(products.map(p => p.id)) + 1 : 1;
        const newProduct = {
            id: newId,
            ...productData,
            code: productData.code || `CODE${newId}`,  // Generar un código si no se proporciona
            status: productData.status !== undefined ? productData.status : true // Definir estado por defecto
        };
        products.push(newProduct);
        await fs.writeFile(filePath, JSON.stringify(products, null, 2));
        socketServer.emit('updateProducts', products); // Emitir a todos los clientes
    } catch (error) {
        console.error('Error al agregar el producto:', error);
    }
});

    // Eliminar un producto
    socket.on('deleteProduct', async (productId) => {
        const filePath = path.join(__dirname, '../data/productos.json');
        try {
            const data = await fs.readFile(filePath, 'utf8');
            let products = JSON.parse(data);
            const index = products.findIndex(p => p.id === productId);
            if (index !== -1) {
                products.splice(index, 1);
                // Reindexar productos
                products = products.map((p, i) => ({ ...p, id: i + 1 }));
                await fs.writeFile(filePath, JSON.stringify(products, null, 2));
                socketServer.emit('updateProducts', products); // Emitir a todos los clientes
            }
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

