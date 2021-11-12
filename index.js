const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;


// Getting PORT
const app = express();
const port = process.env.PORT || 5000;

// MiddleWare
app.use(cors());
app.use(express.json());

// Database URI
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.j6nwy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



// Async Function for Database
async function run() {
    try {
        await client.connect();
        const database = client.db("galaxyCraft");
        const productsCollection = database.collection("products");
        const ordersCollection = database.collection("orders");

        // Adding New Prroduct into Database
        app.post('/products', async (req, res) => {
            const newProduct = req.body;
            const result = await productsCollection.insertOne(newProduct);
            console.log(result);
            res.json(result);
        });

        // Showing All Package into Home Page
        app.get('/products', async (req, res) => {
            const cursor = productsCollection.find({});
            const productInfo = await cursor.toArray();
            res.send(productInfo);
        });

        // Showing Single Package Into Private Route
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const singleProduct = await productsCollection.findOne(query);
            res.json(singleProduct);
        });

        // Confirm Orders
        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await ordersCollection.insertOne(order);
            res.json(result);
        });

        // Showing Orders Into UI
        app.get('/orders', async (req, res) => {
            const cursor = ordersCollection.find({});
            const orderProduct = await cursor.toArray();
            res.send(orderProduct);
        });

        // Delete Orders
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await ordersCollection.deleteOne(query);
            res.json(result);
        });

        // Delete Products
        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productsCollection.deleteOne(query);
            res.json(result);
        });

        // My Orders
        app.get('/orders/:userEmail', async (req, res) => {
            const result = await ordersCollection.find({ userEmail: req.params.userEmail }).toArray();
            res.send(result);
        });
    }
    finally {
        // await client.connect();
    }
}
run().catch(console.dir);








// Request and Response
app.get('/', (req, res) => {
    res.send("GalaxyCraft Server is Running...");
});

app.listen(port, () => {
    console.log("Listening PORT: ", port);
});