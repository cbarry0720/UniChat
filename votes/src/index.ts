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
      res.status(404).send("votes Not Found!");
      return;
  }
  res.send(vote);
});

//this will handle the votes
app.post("/votes/create", async (req, res) => {
  if(!req.body.userID || !req.body.voteType || !req.body.postID){
      res.status(400).send("Invalid Group!");
      return;
  }
  const {userID, voteType, postID} = req.body;
  const mongo = await connectDB();
  const votes = mongo.db("votes").collection('votes');
  const id = await votes.insertOne({
    voter: userID,
    postID: postID,
    voteType: voteType,
  });
  if(id){
      res.status(201).send({
          voteID: id.insertedId,
          voter: userID,
          postID: postID,
          voteType: voteType,
      });
      return;
  }
  res.status(500).send("Internal Server Error!");
});

app.listen(4006, () => {
  console.log(`Running on ${4006}.`);
});