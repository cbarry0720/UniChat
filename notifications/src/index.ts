import express, { Express, Request, Response } from 'express';
import logger from 'morgan';
import cors from 'cors';
import axios, { AxiosError } from 'axios';

type Post = {
    postID: string,
    userID: string,
    groupID: string,
    postText: string,
    postMedia: string,
    postComments: Comment[],
    postUpvotes: Vote[],
    postDownvotes: Vote[]
}

type Comment = {
    commentID : string,
	postID : string,
    userID : string,
	content : string
}

type Vote = {
    voteID : string,
    voter : string,
    postID : string,
    voteType : string
}

const app: Express = express();

app.use(logger('dev'));
app.use(express.json());
app.use(cors());

app.post('/events', async (req: Request, res: Response) => {
    const { type, data } = req.body;

    if (type === 'PostModerated') {
        // Handling Bad Request
        const post : Post = data;
        const {postID, userID, groupID, postText, postMedia, postComments} = post;
        const params : any[] = [postID, userID, groupID, postText];
        if (params.some((param, index) => (!param || param.trim() === ''))) {
            res.status(400).send({
                error: 'Body missing parameters',
                expected: {
                    "postID": "string",
                    "userID": "string",
                    "groupID": "string",
                    "postText": "string",
                    "postMedia": "string",
                    "postComments": [],
                    "postUpvotes": [],
                    "postDownvotes": []
                }
            });
            return;
        }

        // NOTIFY
       
        res.status(200).send({
            "type" : "PostNotified",
            "data" : data
        })
        return;

    }

    if (type === 'CommentModerated') {
        // Handling Bad Request
        const comment : Comment = data;
        const {commentID, postID, userID, content} = comment;
        const params : any[] = [commentID, postID, userID, content];
        if (params.some((param, index) => (!param || param.trim() === ''))) {
            res.status(400).send({
                error: 'Body missing parameters',
                expected: {
                    "commentID": "string",
                    "postID": "string",
                    "userID": "string",
                    "content": "string"
                }
            });
            return;
        }

        // NOTIFY

        res.status(200).send({
            "type" : "CommentNotified",
            "data" : data
        })
        return;
    }

    res.status(300).send({
        message: 'Event not recognized', 
        type: type, 
        data: data
    });

});


app.listen(4009, () => {
    console.log('Notifications service listening on port 4009');
});