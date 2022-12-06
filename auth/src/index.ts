import express, {Request, Response} from "express";
import bodyParser from "body-parser";
import cookieParser from 'cookie-parser';
import session from "express-session";
import bcrypt, { hash } from "bcrypt";
import fs from "fs";
import { MongoClient, ObjectId } from "mongodb";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(cookieParser());
app.use(session({secret: "Your secret key"}));

type userData = {
    firstName: string,
    lastName: string,
    tagName: string,
    password: string
}

type UserDataWId = userData & {id: ObjectId};


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

async function getUser(mongo: MongoClient, tagName: string, password: string){
    const users = mongo.db("auth").collection('users');
    const user = (await users.findOne({tagName: tagName}));
    if(user){
        return user;
    }

    return undefined;
}

app.post("/signup", async (req : Request, res : Response) => {
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

    const user : UserDataWId = {...newUser, id};

    res.json(user)
})

app.post("/login", async (req : Request, res: Response) => {
    if(!req.body.tagName || !req.body.password){
        res.status(400).send("Invalid Details!");
        return;
    }
    const {tagName, password} : userData = req.body;

    const mongo = await connectDB();

    const user = await getUser(mongo, tagName, password);

    if(!user){
        res.status(404).send("User not found!");
        return;
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if(!validPassword){
        res.status(400).send("Invalid password!");
        return;
    }

    console.log(user);

    res.send("Logged in!");
})

app.post("/events", async (req : Request, res: Response) => {
    if(!req.body.type || !req.body.data){
        res.status(400).send("Invalid Details!");
        return;
    }
    const {type, data} = req.body;
});
app.listen(4000, () => console.log("Listening on port 4000"))