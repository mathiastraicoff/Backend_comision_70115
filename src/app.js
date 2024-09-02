import express from 'express';
import productsRouter from './routes/products.router.js'
import cartsRouter from './routes/carts.router.js';
import __dirname from './utils.js';
import handlebars from 'express-handlebars'
// import { server } from 'socket.io'

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)


const SERVER_PORT = 8080;


app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set ('view engine','handlebars');


app.use(express.static(__dirname + '/public'))


app.listen(SERVER_PORT, () => {
    console.log(`Servidor escuchando por el puerto: ${SERVER_PORT}`);
});








