const express =require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken')
const app = express();
const cookieParser = require('cookie-parser')
require('dotenv').config()
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// middleware
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://fairview-hotel-c14d2.web.app/",
    "https://fairview-hotel-c14d2.firebaseapp.com/",
  ],
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@sahed96.5o5zjc5.mongodb.net/?retryWrites=true&w=majority&appName=Sahed96`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const verifyToken = async (req ,res , next) => {
  const token = req?.cookies?.token
  console.log('middleware token value', token);
  
  if(!token){
      return res.status(401).send({message: 'invalid access'})

  }

  jwt.verify(token, process.env.ACCESS_TOKEN, (error , decoded) =>{
      if(error){
          console.log(error);
          return res.status(401).send({message: 'unauthorized access'})
      }
      console.log('value of token',decoded);
      req.user = decoded;
      next()
  })
}

// const cookieOptions = {
//   httpOnly: true,
//   secure: true,
//   sameSite: 'none',
// };

const logger = (req, res, next) => {
  console.log('log: info',req.method, req.url);
  next()
}

async function run() {
  try {

    const roomCollection = client.db('roomsDB').collection('allRooms')
    const bookingCollection = client.db('roomsDB').collection('bookedRoom')
    const reviewCollection = client.db('roomsDB').collection('feedBack')

    app.get('/allRooms', async (req, res) =>{
      const cursor = roomCollection.find();
      const result = await cursor.toArray();
      res.send(result);
  })
    app.get('/allReview', async (req, res) =>{
      const cursor = reviewCollection.find().sort({date: -1});
      const result = await cursor.toArray();
      res.send(result);
  })


  // create token
  app.post("/jwt", async (req, res) => {
    const user = req.body;
    console.log("user for token", user);
    const token = jwt.sign(user, process.env.ACCESS_TOKEN, {expiresIn: '2h'});
    res
    .cookie('token',token,{
      httpOnly: true,
      secure:true,
      sameSite: 'none'
    })
    .send({success: true})
  
    // res.cookie("token", token).send({ success: true });
  });

  // remove token
  app.post("/logout", async (req, res) => {
    const user = req.body;
    console.log("logging out", user);
    res
      .clearCookie("token", { maxAge: 0 })
      .send({ success: true });
  });

  app.get('/detailsReview/:id', async (req,res) => {
    const id = req.params.id
    console.log(id);
    const result= await reviewCollection.findOne({ratingId: id})
    res.send(result)
  })

  app.get('/sortedData', async (req,res) => {
    const query = req.query.value
    console.log(query);
    let priceRange = {}
    if(query === 'low' ) {
      priceRange = { price: { $lt: 500 } }
    }if(query === 'high') {
      priceRange = { price: { $gte: 500} }
    }
    const result = await roomCollection.find(priceRange).toArray()
    res.send(result)
  })

  app.get('/allRooms/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) }

    const result = await roomCollection.findOne(query);
    res.send(result);
})

app.patch('/availability/:id', async (req,res) => {
  const id = req.params.id
  // const status = false
  const query = { _id: new ObjectId(id) }
  const data = {
    $set:{
      availability: 'unavailable'
    }
  }
  const result = await roomCollection.updateOne(query,data)
  res.send(result)
})


app.patch('/unavailability/:id', async (req,res) => {
  const id = req.params.id
  console.log(id);
  // const status = false
  const query = { _id: new ObjectId(id) }
  const data = {
    $set:{
      availability: 'available'
    }
  }
  const result = await roomCollection.updateOne(query,data)
  res.send(result)
})

app.get('/bookedRoom',logger,verifyToken, async (req, res) => {
  console.log('owner info',req.user);
  if(req.user.email !== req.query.email){
    return res.status(403).send({message: 'forbidden access'})
  }
  let query = {};
  if(req.query?.email){
    query = {email: req.query.email}
  }
  const result = await bookingCollection.find(query).toArray()
  res.send(result)
})

app.get('/specialRoom', async (req, res) =>{
  const result = await roomCollection.find({status: 'FEATURED'}).toArray();
  res.send(result);
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

  app.post('/review/:id', async (req, res) => {
    const addComment = req.body;
    const id = req.params.id
    const query = {_id: new ObjectId(id)}
    const result = await reviewCollection.insertOne(addComment,query)
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