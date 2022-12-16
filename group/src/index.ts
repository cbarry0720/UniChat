import { randomBytes } from 'crypto';
import express, { Request, Response } from 'express';
import { MongoClient, ObjectId } from "mongodb";
import * as bodyParser from "body-parser";
import axios from 'axios';
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
app.get("/group/all", async (req, res) => {
  const mongo = await connectDB();
  const groups = mongo.db("groups").collection('groups');
  const allGroups = await groups.find({}).toArray();
  res.send(allGroups.map((group) => {
    return {
      groupID: group._id,
      groupUsers: group.groupUsers,
      groupName: group.groupName,
    }
  }));
});


app.get("/group/:id", async (req, res) => {
  const mongo = await connectDB();
  const groups = mongo.db("groups").collection('groups');
  const group = await groups.findOne({_id: req.params.id});
  if(!group){
      res.status(404).send("Group Not Found!");
      return;
  }
  res.send(group);
});

app.post("/group/create", async (req, res) => {
    if(!req.body.userID || !req.body.groupName){
        res.status(400).send("Invalid Group!");
        return;
    }
    const {userID, groupName} = req.body;
    const mongo = await connectDB();
    const groups = mongo.db("groups").collection('groups');
    const id = await groups.insertOne({
      groupUsers: [userID],
      groupName: groupName,
    });
    if(id){
      await axios.post('http://eventbus:4010/events', {
        type: 'GroupCreated',
        data: {
          groupID: id.insertedId,
          groupUsers: [userID],
          groupName: groupName,
        },
      });
        res.status(201).send({
            groupID: id.insertedId,
            groupUsers: [userID],
            groupName: groupName,
        });
        return;
    }
    res.status(500).send("Internal Server Error!");
  });

  app.post("/group/addUser", async (req, res) => {
    if(!req.body.userID || !req.body.groupID){
      res.status(400).send("Invalid group!");
      return;
    }
    const userID = req.body.userID;
    const groupID = new ObjectId(req.body.groupID)
    const mongo = await connectDB();
    const groups = mongo.db("groups").collection('groups');
    const group = await groups.findOne({_id: groupID});
    if(!group){
      res.status(404).send("group Not Found!");
      return;
    }
    else{
      const userAddedToGroup = await groups.updateOne({_id: groupID}, {$push: {groupUsers: userID}});
          if(userAddedToGroup){
            await axios.post('http://eventbus:4010/events', {
              type: 'UserAddedToGroup',
              data: {
                userID,
                groupID
              },
            });
              res.status(200).send("User added to group");
              return;
          }
          res.status(500).send("Internal Server Error!");
          return;
    }
  });

app.listen(4008, () => {
    console.log(`Running on ${4008}.`);
  });