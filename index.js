const express =require('express');
const cors = require('cors');
const app = express();
require('dotenv').config()
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// middleware
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@sahed96.5o5zjc5.mongodb.net/?retryWrites=true&w=majority&appName=Sahed96`;

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

    const roomCollection = client.db('roomsDB').collection('allRooms')
    const bookingCollection = client.db('roomsDB').collection('bookedRoom')

    app.get('/allRooms', async (req, res) =>{
      const cursor = roomCollection.find();
      const result = await cursor.toArray();
      res.send(result);
  })

  app.get('/allRooms/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) }

    const result = await roomCollection.findOne(query);
    res.send(result);
})

app.get('/bookedRoom', async (req, res) => {
  let query = {};
  if(req.query?.email){
    query = {email: req.query.email}
  }
  const result = await bookingCollection.find(query).toArray()
  res.send(result)
})

app.get('/bookedRoom/:id', async (req, res) => {
  const id = req.params.id
  const query = {_id: new ObjectId(id)}
  const result = await bookingCollection.findOne(query)
  res.send(result)
})

  app.post('/bookedRoom', async (req, res) => {
    const bookRoom = req.body;
    console.log(bookRoom);
    const result = await bookingCollection.insertOne(bookRoom)
    res.send(result)
  })

  app.delete('/bookedRoom/:id', async (req, res) => {
    const id = req.params.id
    const query = {_id: new ObjectId(id)}
    const result = await bookingCollection.deleteOne(query)
    res.send(result)
  })

  app.patch('/update/:id', async (req , res) => {
    const id = req.params.id
    const filter = {_id: new ObjectId(id)}
    const changeDate = req.body
    console.log(changeDate);
    const updatedData = {
      $set:{
        dateFrom: changeDate.dateFrom,
        dateTo: changeDate.dateTo
        
      }
    }
    const result = await bookingCollection.updateOne(filter, updatedData);
      res.send(result)
  })

    
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/',(req, res)=>{
    res.send('fairview server running')
})

app.listen(port, () => {
    console.log(`fairview server is running on port ${port}`);
})