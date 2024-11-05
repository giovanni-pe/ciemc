const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const path = require('path');
const methodOverride = require('method-override');

require('dotenv').config({ path: path.resolve(__dirname, determineEnvFile()) });

function determineEnvFile() {
    const env = process.env.NODE_ENV || 'development';
    return env === 'production' ? path.join('env', '.env.prod') : path.join('env', '.env');
}

if (!process.env.MONGODB_URI) {
    console.error("Error: La variable MONGODB_URI no está definida.");
    process.exit(1);
}

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

let collection;

async function connectToDB() {
    try {
        await client.connect();
        console.log("Conectado a MongoDB!");
        const db = client.db("myStore");
        collection = db.collection("cars");
    } catch (error) {
        console.error("Error al conectar con MongoDB:", error);
    }
}

// Rutas

app.get('/', (req, res) => {
    res.render('index', { title: 'Bienvenido a la Tienda de Autos' });
});

app.get('/products', async (req, res) => {
    try {
        const cars = await collection.find({}).toArray();
        res.render('products/list', { title: 'Lista de Autos', cars });
    } catch (error) {
        res.render('products/list', { title: 'Lista de Autos', error: 'Error al obtener los autos' });
    }
});

app.get('/products/create', (req, res) => {
    res.render('products/create', { title: 'Agregar Auto' });
});

app.post('/products', async (req, res) => {
    try {
        const { marca, modelo, stock } = req.body;
        const car = { marca, modelo, stock: parseInt(stock) };
        await collection.insertOne(car);
        res.redirect('/products');
    } catch (error) {
        res.render('products/create', { title: 'Agregar Auto', error: 'Error al crear el auto' });
    }
});

app.get('/products/:id', async (req, res) => {
    try {
        const id = new ObjectId(req.params.id);
        const car = await collection.findOne({ _id: id });

        if (!car) {
            return res.render('products/detail', { title: 'Auto no encontrado', error: 'Auto no encontrado' });
        }

        res.render('products/detail', { title: `${car.marca} ${car.modelo}`, car });
    } catch (error) {
        res.render('products/detail', { title: 'Error', error: 'Error al obtener el auto' });
    }
});

app.get('/products/:id/edit', async (req, res) => {
    try {
        const id = new ObjectId(req.params.id);
        const car = await collection.findOne({ _id: id });

        if (!car) {
            return res.render('products/edit', { title: 'Auto no encontrado', error: 'Auto no encontrado' });
        }

        res.render('products/edit', { title: 'Editar Auto', car });
    } catch (error) {
        res.render('products/edit', { title: 'Error', error: 'Error al obtener el auto' });
    }
});

app.put('/products/:id', async (req, res) => {
    try {
        const id = new ObjectId(req.params.id);
        const { marca, modelo, stock } = req.body;
        const updatedCar = { marca, modelo, stock: parseInt(stock) };

        const result = await collection.updateOne({ _id: id }, { $set: updatedCar });

        if (result.matchedCount === 0) {
            return res.render('products/edit', { title: 'Auto no encontrado', error: 'Auto no encontrado' });
        }

        res.redirect('/products');
    } catch (error) {
        res.render('products/edit', { title: 'Error', error: 'Error al actualizar el auto' });
    }
});

app.delete('/products/:id', async (req, res) => {
    try {
        const id = new ObjectId(req.params.id);
        const result = await collection.deleteOne({ _id: id });

        if (result.deletedCount === 0) {
            return res.render('products/detail', { title: 'Auto no encontrado', error: 'Auto no encontrado' });
        }

        res.redirect('/products');
    } catch (error) {
        res.render('products/detail', { title: 'Error', error: 'Error al eliminar el auto' });
    }
});

connectToDB().then(() => {
    app.listen(port, () => {
        console.log(`Servidor corriendo en http://localhost:${port}/`);
    });
});
