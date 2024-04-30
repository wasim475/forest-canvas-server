const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.r95emnj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    const userFormDataCollection = client.db('formDataDB').collection('crafts')

    app.get('/crafts', async(req, res)=>{
      const cursor = userFormDataCollection.find()
      const result = await cursor.toArray()
      res.send(result)
   
    })

 

    app.get('/crafts', async (req, res) => {
      const cursor = userFormDataCollection.find();
      const result = await cursor.toArray();
      res.send(result);
  })

  app.delete('/crafts/:id',async(req, res)=>{
    const id = req.params.id;
    const query = {_id: new ObjectId(id)}
    const result = await userFormDataCollection.deleteOne(query)
    res.send(result)
  })

  app.get('/crafts/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await userFormDataCollection.findOne(query);
      res.send(result);
  })

  app.put('/crafts/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const options= {upsert: true}
      const updateFormData = req.body
      const upFormData ={
        $set:{
          itemName:updateFormData.itemName,
          subcategoryName:updateFormData.subcategoryName,
          shortDescription:updateFormData.shortDescription, 
          price:updateFormData.price, 
          processingTime:updateFormData.processingTime, 
          rating:updateFormData.rating, 
          customization:updateFormData.customization, 
          stockStatus:updateFormData.stockStatus, 
          userEmail:updateFormData.userEmail, 
          userName:updateFormData.userName, 
          photoUrl: updateFormData.photoUrl
        }
      }
      const result = await userFormDataCollection.updateOne(filter, upFormData);
      res.send(result);
  })


    app.post('/crafts', async(req, res)=>{
      const formData = req.body;
      console.log(formData);
      const result = await userFormDataCollection.insertOne(formData)
      res.send(result)
    })

       // Craft item section

 
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
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})