import express, {Request, Response} from "express";
import bodyParser from "body-parser";
import cookieParser from 'cookie-parser';
import session from "express-session";
import bcrypt, { hash } from "bcrypt";
import axios from "axios";
import fs from "fs";
import { MongoClient, ObjectId } from "mongodb";
import cors from "cors";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(cookieParser());
app.use(session({secret: "Your secret key"}));
app.use(cors());

type userData = {
    firstName: string,
    lastName: string,
    tagName: string,
    password: string
}

type UserDataWId = userData & {userID: ObjectId};


async function connectDB(): Promise<MongoClient> {
    const uri = process.env.DATABASE_URL || 'mongodb://localhost:27017';
  
    if (uri === undefined) {
      throw Error('DATABASE_URL environment variable is not specified');
    }
  
    const mongo = new MongoClient(uri);
    await mongo.connect();
    return await Promise.resolve(mongo);
  }

async function addUser(mongo: MongoClient, user: userData) : Promise<ObjectId>{
    const users = mongo.db("auth").collection('users');
    const result = await users.insertOne(user);
    return result.insertedId;
}

async function getUser(mongo: MongoClient, tagName: string){
    const users = mongo.db("auth").collection('users');
    const user = (await users.findOne({tagName: tagName}));
    if(user){
        return user;
    }

    return undefined;
}

app.post("/auth/signup", async (req : Request, res : Response) => {
    if(!req.body.firstName || !req.body.lastName || !req.body.tagName || !req.body.password){
        res.status(400).send("Invalid Details!");
        return;
    }
    const {firstName, lastName, tagName, password} : userData = req.body;

    const mongo = await connectDB();

    const salt = await bcrypt.genSalt(5);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser : userData = {firstName, lastName, tagName, password: hashedPassword};

    const id = await addUser(mongo, newUser);

    const user : UserDataWId = {...newUser, userID : id};

    console.log(user)

    await axios.post("http://localhost:4001/users/events", {
        type: "UserCreated",
        data: user
    });

    res.json(user)
})

app.post("/auth/login", async (req : Request, res: Response) => {
    if(!req.body.tagName || !req.body.password){
        res.status(400).send("Invalid Details!");
        return;
    }
    const {tagName, password} : userData = req.body;

    const mongo = await connectDB();

    const user = await getUser(mongo, tagName);

    if(!user){
        res.status(404).send("User not found!");
        return;
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if(!validPassword){
        res.status(400).send("Invalid password!");
        return;
    }

    console.log({userID: user._id, message: "Logged in!"})

    res.json({userID: user._id, message: "Logged in!"});
})

app.post("/auth/events", async (req : Request, res: Response) => {
    if(!req.body.type || !req.body.data){
        res.status(400).send("Invalid Details!");
        return;
    }
    const {type, data} = req.body;
    if(type == "UpdatePassword"){
        const {tagName, password, newPassword} = data;
        const mongo = await connectDB();
        const user = await getUser(mongo, tagName);
        if(!user){
            res.status(404).send("User not found!");
            return;
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if(!validPassword){
            res.status(400).send("Invalid password!");
            return;
        }
        const salt = await bcrypt.genSalt(5);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        const users = mongo.db("auth").collection('users');
        const result = await users.updateOne({_id: user._id}, {$set: {password: hashedPassword}});
        res.send("Password updated!");
    }else if(type == "UpdateFirstName"){
        const {tagName, firstName} = data;
        const mongo = await connectDB();
        const user = await getUser(mongo, tagName);
        if(!user){
            res.status(404).send("User not found!");
            return;
        }
        const users = mongo.db("auth").collection('users');
        const result = await users.updateOne({_id: user._id}, {$set: {firstName: firstName}});
        res.send("First name updated!");
    }else if(type == "UpdateLastName"){
        const {tagName, lastName} = data;
        const mongo = await connectDB();
        const user = await getUser(mongo, tagName);
        if(!user){
            res.status(404).send("User not found!");
            return;
        }
        const users = mongo.db("auth").collection('users');
        const result = await users.updateOne({_id: user._id}, {$set: {lastName: lastName}});
        res.send("Last name updated!");
    }else{
        res.status(400).send("Invalid event type!");
    }
});
app.listen(4000, () => console.log("Listening on port 4000"))