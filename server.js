const express = require('express');
const app = express();

const cors = require("cors");
const ListingsDB = require("./modules/listingsDB.js");

const HTTP_PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// Include the MongoDB connection string directly in the server.js file
const MONGODB_CONN_STRING = "mongodb+srv://nbandari1:zPMWRMrIrBsfRf7F@senecaweb.niwu9tw.mongodb.net/sample_mflix?retryWrites=true&w=majority";

// Create an instance of the ListingsDB class
const db = new ListingsDB();

// Define routes and handlers
app.get('/', (req, res) => {
  res.send({message: "API listening"});
});

// Endpoint to add a new listing
app.post("/api/listings", async (req, res) => {
  try {
    const listing = await db.addNewListing(req.body);
    res.status(201).send(listing);
  } catch (err) {
    res.status(500).send({ message: `An error occurred: ${err}` });
  }
});

// Endpoint to get all listings
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

// Endpoint to get a listing by ID
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

// Endpoint to update a listing by ID
app.put("/api/listings/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await db.updateListingById(req.body, id);
    res.send({ message: `Listing ${id} successfully updated` });
  } catch (err) {
    res.status(500).send({ message: `An error occurred: ${err}` });
  }
});

// Endpoint to delete a listing by ID
app.delete("/api/listings/:id", async (req, res) => {
  try {
    await db.deleteListingById(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(500).send({ message: `An error occurred: ${err}` });
  }
});

// Initialize the database connection and start the server
db.initialize(MONGODB_CONN_STRING).then(() => {
  console.log("Connected to MongoDB!");
  app.listen(HTTP_PORT, () => {
    console.log(`Server listening on port: ${HTTP_PORT}`);
  });
}).catch((err) => {
  console.error("Error initializing database:", err);
});

