const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
dotenv.config();
const uri = process.env.MONGODB_URI;

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // await client.connect();

    const db = client.db("docAppointmentDB");
    const AppointmentsCollection = db.collection("allDoctorList");
    const bookingCollection = db.collection("bookings");

    app.get("/allDoctorList", async (req, res) => {
      const result = await AppointmentsCollection.find().toArray();
      res.json(result);
    });

    app.get("/allDoctorList/:id", async (req, res) => {
      const { id } = req.params;

      const result = await AppointmentsCollection.findOne({
        _id: new ObjectId(id),
      });

      res.json(result);
    });

    app.get("/topdoctor", async (req, res) => {
      const result = await AppointmentsCollection.find()
        .sort({ rating: -1 })
        .limit(4)
        .toArray();

      res.json(result);
    });

    app.post("/booking", async (req, res) => {
      const bookingData = req.body;
      const result = await bookingCollection.insertOne(bookingData);

      res.json(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
