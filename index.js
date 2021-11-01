const express = require('express');
const axios = require('axios').default;
const { MongoClient } = require('mongodb');
const cors = require('cors');
require("dotenv").config();
const ObjectId = require('mongodb').ObjectId;


const app = express();
const port = process.env.PORT || 5000;



app.use(cors());
app.use(express.json());
// app.use(axios());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.11wfa.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// console.log(uri);

async function run() {
    try {
        await client.connect();
        const database = client.db('globalTourDB');
        const packagesCollection = database.collection('packageCollection');
        // console.log('Database Get Connection')

        // GET API
        app.get('/packages', async (req, res) => {
            const getPackages = packagesCollection.find({});
            const packages = await getPackages.toArray();
            res.send(packages);
        });


        // GET Single Data API
        app.get('/packages/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await packagesCollection.findOne(query);
            res.json(service);
        });


        // Get Order Data From Database 

        app.get('/orders', async (req, res) => {
            const getOrders = orderCollection.find({});
            const orders = await getOrders.toArray();
            res.send(orders);
        });


        app.get('/orders/:uid', async (req, res) => {
            const uid = req.params.uid;
            const query = { uid: uid };
            console.log(uid)
            const getOrders = await orderCollection.find(query).toArray();
            // const orders = await getOrders.toArray();
            res.json(getOrders);
        });


        // POST API
        app.post('/packages', async (req, res) => {
            const newPackage = req.body;
            const result = await packagesCollection.insertOne(newPackage);
            console.log('got new package', req.body);
            console.log('added package', result);
            res.json(result);

        });



        // Placed Order Insert Into database 
        const customerCollection = database.collection('customerCollection');
        app.post('/customerInfo', async (req, res) => {
            const newCustomer = req.body;
            const result = await customerCollection.insertOne(newCustomer);

            res.json(result);

        });



        const orderCollection = database.collection('orderCollection');
        app.post('/newOrder', async (req, res) => {
            const newOrder = req.body;
            const result = await orderCollection.insertOne(newOrder);

            console.log(result);
            res.json(result);

        });



        // Add Data to cart collection
        app.post('/newOrder/add', async (req, res) => {
            const newOrder = req.body;
            const result = await orderCollection.insertOne(newOrder);
            res.json(result);
        })



        // Load order Data According To User ID
        app.get('/order/:uid', async (req, res) => {
            const uid = req.params.uid;
            const query = { uid: uid }
            const result = await orderCollection.find(query).toArray();
            res.json(result);
        });


        // DELETE From ordered
        app.delete('/order/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query);
            res.json(result);
        })



        app.delete('/order/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query);
            console.log('deleting user with id ', result);
            res.json(result);
            console.log(result);
        })




        // GET ordered Data
        app.get('/orders', async (req, res) => {
            const cursor = orderCollection.find({});
            const orders = await cursor.toArray();
            res.send(orders);
        })
        app.get('/', async (req, res) => {
            const cursor = orderCollection.find({});
            const orders = await cursor.toArray();
            res.send(orders);
        })



    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir)

// app.get('/', (req, res) => {
//     res.send('This is my CRUD Server is runnig! Woow');
// });
app.get('/hello', (req, res) => {
    res.send('I am Ready to use');
});

app.listen(port, () => {
    console.log('Running Server on port', port);
})