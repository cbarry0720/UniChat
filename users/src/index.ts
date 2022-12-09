import express from "express";
import { MongoClient } from "mongodb";
import bodyParser from "body-parser";
import cors from "cors";

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

app.get("/users/all", async (req, res) => {
    const mongo = await connectDB();
    const users = mongo.db("users").collection('users');
    const allUsers = await users.find({}).toArray();
    res.send(allUsers.map(user => {
        return {
            userID: user.userID,
            firstName: user.firstName,
            lastName: user.lastName,
            tagName: user.tagName,
            posts: user.posts,
            comments: user.comments,
            upvotes: user.upvotes,
            downvotes: user.downvotes,
            courses: user.courses,
            deadlines: user.deadlines
            }}));
});

app.get("/users/:userID", async (req, res) => {
    const mongo = await connectDB();
    const users = mongo.db("users").collection('users');
    console.log(req.params.userID)
    const user = await users.findOne({userID: req.params.userID});
    if(!user){
        res.status(404).send("User Not Found!");
        return;
    }
    res.send({
        userID: user.userID,
        firstName: user.firstName,
        lastName: user.lastName,
        tagName: user.tagName,
        posts: user.posts,
        comments: user.comments,
        upvotes: user.upvotes,
        downvotes: user.downvotes,
        courses: user.courses,
        deadlines: user.deadlines
    });
});

app.post("/users/events", async (req, res) => {
    if(!req.body.type || !req.body.data){
        res.status(400).send("Invalid Details!");
        return;
    }
    const {type, data} = req.body;
    if(type === "UserCreated"){
        const mongo = await connectDB();
        const users = mongo.db("users").collection('users');
        const reformattedData = {
            userID: data._id,
            firstName: data.firstName,
            lastName: data.lastName,
            tagName: data.tagName,
            posts:[],
            comments:[],
            upvotes:[],
            downvotes:[],
            courses:[],
            deadlines:[]
        }
        const id = await users.insertOne(reformattedData);
        if(id){
            res.send("User Created!");
        }else{
            res.status(400).send("User Creation Failed!");
        }
    }else if(type === "PostCreated"){
        const mongo = await connectDB();
        const users = mongo.db("users").collection('users');
        const user = await users.findOne({_id: data.userID});
        if(user){
            const updatedUser = await users.updateOne({_id: data.userID}, {$push: {posts: data.postID}});
            if(updatedUser){
                res.send("Post Created!");
            }else{
                res.status(400).send("Post Creation Failed!");
            }
        }else{
            res.status(400).send("User Not Found!");
        }
    }else if(type === "CommentCreated"){
        const mongo = await connectDB();
        const users = mongo.db("users").collection('users');
        const user = await users.findOne({_id: data.userID});
        if(user){
            const updatedUser = await users.updateOne({_id: data.userID}, {$push: {comments: data.commentID}});
            if(updatedUser){
                res.send("Comment Created!");
            }else{
                res.status(400).send("Comment Creation Failed!");
            }
        }else{
            res.status(400).send("User Not Found!");
        }
    }else if(type === "UpvoteCreated"){
        const mongo = await connectDB();
        const users = mongo.db("users").collection('users');
        const user = await users.findOne({_id: data.userID});
        if(user){
            const updatedUser = await users.updateOne({_id: data.userID}, {$push: {upvotes: data.postID}});
            if(updatedUser){
                res.send("Upvote Created!");
            }else{
                res.status(400).send("Upvote Creation Failed!");
            }
        }else{
            res.status(400).send("User Not Found!");
        }
    }else if(type === "DownvoteCreated"){
        const mongo = await connectDB();
        const users = mongo.db("users").collection('users');
        const user = await users.findOne({_id: data.userID});
        if(user){
            const updatedUser = await users.updateOne({_id: data.userID}, {$push: {downvotes: data.postID}});
            if(updatedUser){
                res.send("Downvote Created!");
            }else{
                res.status(400).send("Downvote Creation Failed!");
            }
        }else{
            res.status(400).send("User Not Found!");
        }
    }else if(type === "CourseAdded"){
        const mongo = await connectDB();
        const users = mongo.db("users").collection('users');
        const user = await users.findOne({_id: data.userID});
        if(user){
            const updatedUser = await users.updateOne({_id: data.userID}, {$push: {courses: data.courseID}});
            if(updatedUser){
                res.send("Course Added!");
            }else{
                res.status(400).send("Course Addition Failed!");
            }
        }else{
            res.status(400).send("User Not Found!");
        }
    }else if(type === "DeadlineAdded"){
        const mongo = await connectDB();
        const users = mongo.db("users").collection('users');
        const user = await users.findOne({_id: data.userID});
        if(user){
            const updatedUser = await users.updateOne({_id: data.userID}, {$push: {deadlines: data.deadlineID}});
            if(updatedUser){
                res.send("Deadline Added!");
            }else{
                res.status(400).send("Deadline Addition Failed!");
            }
        }else{
            res.status(400).send("User Not Found!");
        }
    }else{
        res.status(400).send("Invalid Event!");
    }
});

    

app.listen(4001, () => {
    console.log("Server listening on port 4001");
});