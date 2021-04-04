const express = require('express')

const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;


const port = 5000
const app = express();

app.use(express.json());

app.use(cors());

require('dotenv').config()


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jmryn.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const eventcollection = client.db("volunteer").collection("event");
  const personcollection = client.db("volunteer").collection("person");
  
  app.post('/addEvent',(req,res)=>{
    const event = req.body;
    console.log(event);
    eventcollection.insertOne(event)
    .then(result=>{
      console.log(result);
    })
  })
  app.post('/register',(req,res)=>{
    const detail = req.body;
    personcollection.insertOne(detail)
    .then(result=>{
      console.log(result);
    })
  })
  app.get('/events',(req,res)=>{
    eventcollection.find({})
    .toArray((err,doc)=>{
      res.send(doc);
    })
  })
  app.get('/userdetail/:email',(req,res)=>{
    personcollection.find({email :req.params.email})
    .toArray((err,docs)=>{
      console.log(docs);
      res.send(docs);
    })
  })
  app.get('/volunteers',(req,res)=>{
    personcollection.find()
    .toArray((err,docs)=>{
      console.log(docs);
      res.send(docs);
    })
  })

});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT || port)