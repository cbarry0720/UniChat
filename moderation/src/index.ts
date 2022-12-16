import express, { Express, Request, Response } from 'express';
import logger from 'morgan';
import { randomBytes } from 'crypto';
import cors from 'cors';
import axios, { AxiosError } from 'axios';
import  Filter from 'bad-words';

// TYPES

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

    if (type === 'PostCreated') {
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

        const postData : Post = {
            postID: postID,
            userID: userID,
            groupID: groupID,
            postText: moderateMessage(postText),
            postMedia: postMedia,
            postComments: postComments,
            postUpvotes: [],
            postDownvotes: []
        }
        await axios.post('http://eventbus:4010/events', {
            type: 'PostModerated',
            data: postData
        }).catch((err: AxiosError) => {
            console.log(err);
        });
        res.status(200).send({
            "type" : "PostModerated",
            "data" : postData
        })
        return;
    }

    if (type === 'CommentCreated') {
        // Handling Bad Request
        const comment : Comment  = data;
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

        const commentData : Comment = {
            commentID: commentID,
            postID: postID,
            userID: userID,
            content: moderateMessage(content)
        }

        await axios.post('http://eventbus:4010/events', {
            type: 'CommentModerated',
            data: commentData
        }).catch((err: AxiosError) => {
            console.log(err);
        });

        res.status(200).send({
            "type" : "CommentModerated",
            "data" : commentData
        })
        return;
    }

    res.status(300).send({
        message: 'Event not recognized', 
        type: type, 
        data: data
    });

})

app.listen(4005, () => {
    console.log('Moderation service listening on port 4005');
})

const moderateMessage = (content: string) => {
    const filter = new Filter();
    return filter.clean(content);
}