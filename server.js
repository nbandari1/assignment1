const express = require('express');
const app = express();

const cors = require("cors");
require('dotenv').config();

const ListingsDB = require("./modules/listingsDB.js");
const db = new ListingsDB();

const HTTP_PORT = process.env.PORT || 8080;

console.log(process.env.MONGODB_CONN_STRING); // Check if the connection string is printed

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send({message: "API listening"});
});

app.post("/api/listings", async (req, res) => {
  try {
    const listing = await db.addNewListing(req.body);
    res.status(201).send(listing);
  } catch (err) {
    res.status(500).send({ message: `An error occurred: ${err}` });
  }
});

app.get("/api/listings", async (req, res) => {
  try {
    const { page, perPage, name } = req.query;
    const listings = await db.getAllListings(page, perPage, name);
    if(listings.length){
      res.send(listings)
    }else{
      res.status(404).send({message: `no listings found`})
    }
  } catch (err) {
    res.status(500).send({ message: `An error occurred: ${err}` });
  }
});

app.get("/api/listings/:id", async (req, res) => {
  try {
    const listing = await db.getListingById(req.params.id);
    if(listing){
      res.send(listing)
    }else{
      res.status(404).send({message: `no listings found`})
    }
  } catch (err) {
    res.status(500).send({ message: `An error occurred: ${err}` });
  }
});

app.put("/api/listings/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await db.updateListingById(req.body, id);
    res.send({ message: `Listing ${id} successfully updated` });
  } catch (err) {
    res.status(500).send({ message: `An error occurred: ${err}` });
  }
});

app.delete("/api/listings/:id", async (req, res) => {
  try {
    await db.deleteListingById(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(500).send({ message: `An error occurred: ${err}` });
  }
});

db.initialize(process.env.MONGODB_CONN_STRING).then(()=>{
  app.listen(HTTP_PORT, ()=>{
      console.log(`server listening on: ${HTTP_PORT}`);
  });
}).catch((err) => {
  console.error(err);
});
