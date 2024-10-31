// import express from 'express';
// import mongoose from 'mongoose';
// import session from 'express-session';
// import { engine } from 'express-handlebars';
// import http from 'http';
// import { Server } from 'socket.io';
// import cartsRouter from './routes/carts.router.js';
// import productsRouter from './routes/products.router.js';
// import viewsRouter from './routes/views.router.js';
// import path from 'path';
// import methodOverride from 'method-override'
// import { __dirname } from './utils.js'; 
// import CartManager from './service/CartManager.js';
// import Handlebars from 'handlebars';

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server);
// const cartManager = new CartManager(); 


// // Conectar a MongoDB
// mongoose.connect('mongodb+srv://mathiastraicoff:NsFHr42zR78sN6LF@dbecomision70115.5q1nl.mongodb.net/e-commerce?retryWrites=true&w=majority&appName=DBEcomision70115')
//     .then(() => {
//         console.log('Conexión a MongoDB exitosa');
//     })
//     .catch((error) => {
//         console.error('Error al conectar a MongoDB:', error);
//     });

// // Configuración de Handlebars
// app.engine('handlebars', engine({
//     allowProtoPropertiesByDefault: true,
//     allowProtoMethodsByDefault: true,
//     runtimeOptions: {
//         allowProtoPropertiesByDefault: true,
//         allowProtoMethodsByDefault: true,
//     },
//     layoutsDir: path.join(__dirname, 'views/layouts'),
//     defaultLayout: 'main',
// }));

// Handlebars.registerHelper('json', function (context) {
//     return JSON.stringify(context);
// });


// app.set('view engine', 'handlebars');
// app.set('views', path.join(__dirname, 'views'));

// // Middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(session({
//     secret: 'asd123', 
//     resave: false,
//     saveUninitialized: true,
//     cookie: { secure: false } 
// }));
// app.use(async (req, res, next) => {
//     const cartId = req.session.cartId; 
//     if (cartId) {
//         try {
//             const cart = await cartManager.getCartById(cartId); 
//             req.cartCount = cart.products.length; 
//         } catch (error) {
//             console.error('Error al obtener el carrito:', error);
//             req.cartCount = 0; 
//         }
//     } else {
//         req.cartCount = 0; 
//     }
//     next();
// });
// app.use(methodOverride('_method'));


// // Rutas
// app.use('/api/carts', cartsRouter);
// app.use('/api/products', productsRouter);
// app.use('/', viewsRouter);

// // Configuración de sockets
// io.on('connection', (socket) => {
// });

// // Servir archivos estáticos
// app.use(express.static(path.join(__dirname, 'public')));

// const PORT = 8080;
// server.listen(PORT, () => {
//     console.log(`Servidor escuchando en el puerto ${PORT}`);
// });



import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import { engine } from 'express-handlebars';
import http from 'http';
import { Server } from 'socket.io';
import cartsRouter from './routes/carts.router.js';
import productsRouter from './routes/products.router.js';
import viewsRouter from './routes/views.router.js';
import path from 'path';
import methodOverride from 'method-override';
import { __dirname } from './utils.js'; 
import CartManager from './service/CartManager.js';
import Handlebars from 'handlebars';

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const cartManager = new CartManager(); 

// Conectar a MongoDB
mongoose.connect('mongodb+srv://mathiastraicoff:NsFHr42zR78sN6LF@dbecomision70115.5q1nl.mongodb.net/e-commerce?retryWrites=true&w=majority&appName=DBEcomision70115')
    .then(() => {
        console.log('Conexión a MongoDB exitosa');
    })
    .catch((error) => {
        console.error('Error al conectar a MongoDB:', error);
    });

// Configuración de Handlebars
app.engine('handlebars', engine({
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    },
    layoutsDir: path.join(__dirname, 'views/layouts'),
    defaultLayout: 'main',
}));

Handlebars.registerHelper('json', function (context) {
    return JSON.stringify(context);
});

app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'asd123', 
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } 
}));
app.use(async (req, res, next) => {
    const cartId = req.session.cartId; 
    if (cartId) {
        try {
            const cart = await cartManager.getCartById(cartId); 
            req.cartCount = cart.products.length; 
        } catch (error) {
            console.error('Error al obtener el carrito:', error);
            req.cartCount = 0; 
        }
    } else {
        req.cartCount = 0; 
    }
    next();
});
app.use(methodOverride('_method')); // Asegúrate de que esta línea esté aquí

// Rutas
app.use('/api/carts', cartsRouter);
app.use('/api/products', productsRouter);
app.use('/', viewsRouter);

// Configuración de sockets
io.on('connection', (socket) => {
});

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

const PORT = 8080;
server.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
