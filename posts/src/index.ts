import express from "express";
import { MongoClient } from "mongodb";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

async function connectDB(): Promise<MongoClient> {
    const uri = process.env.DATABASE_URL || 'mongodb://localhost:27017';

    if (uri === undefined) {
      throw Error('DATABASE_URL environment variable is not specified');
    }

    const mongo = new MongoClient(uri);
    await mongo.connect();
    return await Promise.resolve(mongo);
  }

app.get("/posts/all", async (req, res) => {
    const mongo = await connectDB();
    const posts = mongo.db("posts").collection('posts');
    const allPosts = await posts.find({}).toArray();
    res.send(allPosts);
});

app.get("/posts/:id", async (req, res) => {
    const mongo = await connectDB();
    const posts = mongo.db("posts").collection('posts');
    const post = await posts.findOne({_id: req.params.id});
    if(!post){
        res.status(404).send("Post Not Found!");
        return;
    }
    res.send(post);
});

app.post("/posts/create", async (req, res) => {
    if(!req.body.userID || !req.body.postText || !req.body.postMedia){
        res.status(400).send("Invalid Details!");
        return;
    }
    const {userID, postText, postMedia} = req.body;
    const mongo = await connectDB();
    const posts = mongo.db("posts").collection('posts');
    const id = await posts.insertOne({
        userID: userID,
        postText: postText,
        postMedia: postMedia,
        postUpvotes: [],
        postDownvotes: [],
        postComments: []
    });
    if(id){
        res.status(201).send({
            postID: id.insertedId,
            userID: userID,
            postText: postText,
            postMedia: postMedia,
            postUpvotes: [],
            postDownvotes: [],
            postComments: []
        });
        return;
    }
    res.status(500).send("Internal Server Error!");
});

app.post("/posts/events", async (req, res) => {
    if(!req.body.type || !req.body.data){
        res.status(400).send("Invalid Details!");
        return;
    }
    const {type, data} = req.body;
    const mongo = await connectDB();
    const posts = mongo.db("posts").collection('posts');
    const post = await posts.findOne({_id: data.postID});
    if(!post){
        res.status(404).send("Post Not Found!");
        return;
    }
    if(type === "PostUpvoted"){
        const upvoted = await posts.updateOne({_id: data.postID}, {$push: {postUpvotes: data.userID}});
        if(upvoted){
            res.status(200).send("Post Upvoted!");
            return;
        }
        res.status(500).send("Internal Server Error!");
        return;
    }
    if(type === "PostDownvoted"){
        const downvoted = await posts.updateOne({_id: data.postID}, {$push: {postDownvotes: data.userID}});
        if(downvoted){
            res.status(200).send("Post Downvoted!");
            return;
        }
        res.status(500).send("Internal Server Error!");
        return;
    }
    if(type === "PostCommented"){
        const commented = await posts.updateOne({_id: data.postID}, {$push: {postComments: data.commentID}});
        if(commented){
            res.status(200).send("Post Commented!");
            return;
        }
        res.status(500).send("Internal Server Error!");
        return;
    }
    res.status(400).send("Invalid Details!");
});

app.listen(4002, () => {
    console.log("Listening on port 4002");
});