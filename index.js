const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
require('dotenv').config();
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.m8ywqwd.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const coffecollection = client.db('coffedata').collection('coffee')
    const usercollection = client.db('coffedata').collection('user')

    app.get('/coffee', async (req, res) => {
      const cursor = coffecollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    app.get('/coffee/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await coffecollection.findOne(query)
      res.send(result)
    })

    app.put('/coffee/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true }
      const updateCoffee = req.body;
      const coffee = {
        $set: {
          name: updateCoffee.name,
          quantity: updateCoffee.quantity,
          supplier: updateCoffee.supplier,
          taste: updateCoffee.taste,
          category: updateCoffee.category,
          details: updateCoffee.details,
          photo: updateCoffee.photo
        }
      }
      const result = await coffecollection.updateOne(filter, coffee, options)
      res.send(result)
    })

    app.post('/coffee', async (req, res) => {
      const coffeedata = req.body;
      console.log(coffeedata)
      const result = await coffecollection.insertOne(coffeedata)
      res.send(result)
    })

    app.delete('/coffee/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await coffecollection.deleteOne(query)
      res.send(result)
    })

    // User added collection

    app.get('/user', async (req, res) => {
      const cursor = usercollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    app.patch('/user', async(req, res) => {
      const user = req.body;
      const filter = { email: user.email }
      const updateDoc = {
        $set: {
          lastloggedAt : user.lastloggedAt
        }
      }
      const result = await usercollection.updateOne(filter, updateDoc)
      res.send(result)
    })

    app.post('/user', async (req, res) => {
      const user = req.body;
      console.log(user)
      const result = await usercollection.insertOne(user)
      res.send(result)
    })

    app.delete('/user/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await usercollection.deleteOne(query)
      res.send(result)
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}

run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('COffe server making procces')
})

app.listen(port, () => {
  console.log(`Coffe making site${port}`)
})