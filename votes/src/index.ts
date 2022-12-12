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
app.get("/votes/all", async (req, res) => {
  const mongo = await connectDB();
  const votes = mongo.db("votes").collection('votes');
  const allVotes = await votes.find({}).toArray();
  res.send(allVotes);
});

app.get("/votes/:id", async (req, res) => {
  const mongo = await connectDB();
  const votes = mongo.db("votes").collection('votes');
  const vote = await votes.findOne({_id: req.params.id});
  if(!vote){
      res.status(404).send("Group Not Found!");
      return;
  }
  res.send(vote);
});


app.listen(4006, () => {
  console.log(`Running on ${4006}.`);
});