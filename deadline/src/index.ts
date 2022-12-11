import { randomBytes } from 'crypto';
import express, { Request, Response } from 'express';
import { MongoClient, ObjectId } from "mongodb";
import * as bodyParser from "body-parser";
import * as axios from 'axios';
import cors from 'cors';

const app = express();
app.use(bodyParser.json());
app.use(cors());
async function connectDB(): Promise<MongoClient> {
  const uri = process.env.DATABASE_URL || 'mongodb://localhost:27017';

  if (uri === undefined) {
    throw Error('DATABASE_URL environment variable is not specified');
  }

  const mongo = new MongoClient(uri);
  await mongo.connect();
  return await Promise.resolve(mongo);
}
app.get("/deadlines/all", async (req, res) => {
  const mongo = await connectDB();
  const deadlines = mongo.db("deadlines").collection('deadlines');
  const allDeadlines = await deadlines.find({}).toArray();
  res.send(allDeadlines);
});

app.get("/deadlines/:id", async (req, res) => {
  const mongo = await connectDB();
  const deadlines = mongo.db("deadlines").collection('deadlines');
  const deadline = await deadlines.findOne({_id: req.params.id});
  if(!deadline){
      res.status(404).send("Deadline Not Found!");
      return;
  }
  res.send(deadline);
});

app.post("/deadline/create", async (req, res) => {
  if(!req.body.userID || !req.body.deadlineName || !req.body.deadlineTime){
      res.status(400).send("Invalid Details!");
      return;
  }
  const {userID, deadlineName, deadlineTime } = req.body;
  const mongo = await connectDB();
  const deadlines = mongo.db("deadlines").collection('deadlines');
  const id = await deadlines.insertOne({
    deadlineUsers: [userID],
    deadlineName: deadlineName,
    deadlineTime: deadlineTime,
  });
  if(id){
      res.status(201).send({
          deadlineID: id.insertedId,
          deadlineUsers: [userID],
          deadlineName: deadlineName,
          deadlineTime: deadlineTime,
      });
      return;
  }
  res.status(500).send("Internal Server Error!");
});

app.post("/deadlines/addUser", async (req, res) => {
  if(!req.body.userID || !req.body.deadlineID){
    res.status(400).send("Invalid Details!");
    return;
  }
  const userID = req.body.userID;
  const deadlineID = new ObjectId(req.body.deadlineID)
  const mongo = await connectDB();
  const deadlines = mongo.db("deadlines").collection('deadlines');
  const deadline = await deadlines.findOne({_id: deadlineID});
  if(!deadline){
    res.status(404).send("Deadline Not Found!");
    return;
  }
  else{
    const subscribedToDeadline = await deadlines.updateOne({_id: deadlineID}, {$push: {deadlineUsers: userID}});
        if(subscribedToDeadline){
            res.status(200).send("User subscribed to deadline");
            return;
        }
        res.status(500).send("Internal Server Error!");
        return;
  }

});



app.listen(4007, () => {
  console.log(`Running on ${4007}.`);
});