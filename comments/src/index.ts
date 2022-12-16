import express, { Express, Request, Response } from 'express';
import logger from 'morgan';
import { randomBytes } from 'crypto';
import { MongoClient, ObjectId } from "mongodb";
import cors from 'cors';
import axios, { AxiosError } from 'axios';

type Comment = {
    "commentID" : ObjectId,
	"postID" : string,
    "userID" : string,
	"content" : string
}

const app: Express = express();

app.use(logger('dev'));
app.use(express.json());
app.use(cors());

app.post('/comments/create', async (req: Request, res: Response) => {

    // Handling Bad Requests
    const { postID, userID, content } : {postID : string, userID : string, content: string} = req.body;
    const params  : any[] = [postID, userID, content];
    if (params.some((param, index) => (!param || param.trim() === ''))) {
        res.status(400).send({
            error: 'Body missing parameters',
            expected: {
                "postID" : "string",
                "userID" : "string",
                "content" : "string"
            }
        });
        return;
    }    

    // Push to DB
    const comment = await addToDB(postID, userID, content);
    if (!comment) {
        res.status(500).send({
            error: 'Internal Server Error',
            expected: {
                "postID" : "string",
                "userID" : "string",
                "content" : "string"
            }
        });
    }

    // Call Event bus
    await axios.post("http://localhost:4010/events", {
        type: "CommentCreated",
        data: comment
    }).catch((error: AxiosError | Error) => {
        if (error) {
            console.log(error);
        }
    })

    // Response
    res.status(200).send(comment);
    
});


app.get('/comments/all', async (req: Request, res: Response) => {
    
    // Get from DB
    const comments = await getAllFromDB();
    if (!comments) {
        res.status(500).send({
            error: 'Internal Server Error'
        });
    }
    
    // Response
    res.status(200).send(comments);
    
})

app.get('/comments/:id', async (req: Request, res: Response) => {

    // Handling Bad Requests
    const { postID } : {postID : string} = req.body;
    const params  : any[] = [postID];
    if (params.some((param, index) => (!param || param.trim() === ''))) {
        res.status(400).send({
            error: 'Body missing parameters',
            expected: {
                "postID" : "string"
            }
        });
        return;
    }

    // Get from DB
    const comments = await getFromDB(postID);
    if (!comments) {
        res.status(500).send({
            error: 'Internal Server Error',
            expected: {
                "postID" : "string"
            }
        });
    }

    // Response
    res.status(200).send(comments);

})

app.listen(4003, () => {
    console.log('Listening on port 4003');
});

async function connectDB(): Promise<MongoClient> {
    const uri = process.env.DATABASE_URL || 'mongodb://localhost:27017';

    if (uri === undefined) {
      throw Error('DATABASE_URL environment variable is not specified');
    }

    const mongo = new MongoClient(uri);
    await mongo.connect();
    return await Promise.resolve(mongo);
}

const addToDB = async (postID: string, userID: string, content: string) => {
    const mongo = await connectDB();
    const comments = mongo.db("comments").collection('comments');

    const id = await comments.insertOne({
        userID: userID,
        postID: postID,
        content: content
    });

    if (id) {
        const comment : Comment = {
            commentID : id.insertedId,
            postID : postID,
            userID : userID,
            content : content
        }
        return comment;
    }
    return null;
}

const getFromDB = async (postID: string) => {
    const mongo = await connectDB();
    const comments = mongo.db("comments").collection('comments');

    const filteredComments = await comments.find({postID: postID }).toArray();

    return filteredComments;
}

const getAllFromDB = async () => {
    const mongo = await connectDB();
    const comments = mongo.db("comments").collection('comments');

    const filteredComments = await comments.find({}).toArray();

    return filteredComments;
}