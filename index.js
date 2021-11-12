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