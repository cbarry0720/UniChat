import express, { Express, Request, Response } from 'express';
import logger from 'morgan';
import { randomBytes } from 'crypto';
import cors from 'cors';
import axios, { AxiosError } from 'axios';

type Comment = {
    "commentID" : string,
	"postID" : string,
    "userID" : string,
	"content" : string
}

const database : Comment[] = [];

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

    // Create a comment
    const commentID : string = randomBytes(8).toString('hex');
    const comment : Comment = {
        commentID : commentID,
        postID : postID,
        userID : userID,
        content : content
    }
    
    // Push to DB
    // TODO : MongoDB should be indexable by commentID
    database.push(comment);

    // Call Event bus
    await axios.post("http://localhost:4010/events", {
        type: "CommentCreated",
        data: commentID
    }).catch((error: AxiosError | Error) => {
        if (error) {
            console.log(error);
        }
    })

    // Response
    res.status(200).send(comment);
    
});


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
    const comments = database.filter((comment: Comment) => comment.postID === postID);

    // Call Event Bus ?

    // Response
    res.status(200).send(comments);


})


app.listen(4003, () => {
    console.log('Listening on port 4003');
});
