import express, { Express, Request, Response } from 'express';
import logger from 'morgan';
import { randomBytes } from 'crypto';
import cors from 'cors';
import axios, { AxiosError } from 'axios';

// TYPES

type Post = {
    postID: string,
    userID: string,
    groupID: string,
    postText: string,
    postMedia: string,
    postComments: Comment[]
}

type Comment = {
    commentID : string,
	postID : string,
    userID : string,
	content : string
}

const app: Express = express();

app.use(logger('dev'));
app.use(express.json());
app.use(cors());

app.post('/events', async (req: Request, res: Response) => {
    const { type, data } = req.body;

    if (type === 'PostCreated') {
        const post : Post = data;
        const content : string = post.postText;
        if (moderateMessage(content)) {
            await axios.post('http://localhost:4005/events', {
                type: 'PostModerated',
                data: {
                    postID: post.postID,
                    userID: post.userID,
                    groupID: post.groupID,
                    postText: post.postText,
                    postMedia: post.postMedia,
                    postComments: post.postComments,
                }
            })
        }
        else {
            await axios.post('http://localhost:4005/events', {
                type: 'PostModerated',
                data: {
                    post: {
                        postID: post.postID,
                        userID: post.userID,
                        groupID: post.groupID,
                        postText: 'This post has been removed due to offensive content',
                        postMedia: '',
                        postComments: post.postComments,
                    }
                }
            })
        }
    }

    if (type === 'CommentCreated') {
        const comment : Comment  = data;
        const content : string = comment.content;
        if (moderateMessage(content)) {
            await axios.post('http://localhost:4005/events', {
                type: 'CommentModerated',
                data: {
                    comment: {
                        commentID: comment.commentID,
                        postID: comment.postID,
                        userID: comment.userID,
                        content: comment.content
                    }
                }
            })
        }
        else {
            await axios.post('http://localhost:4005/events', {
                type: 'CommentModerated',
                data: {
                    comment: {
                        commentID: comment.commentID,
                        postID: comment.postID,
                        userID: comment.userID,
                        content: 'This comment has been removed due to offensive content'
                    }
                }
            })
        }
    }

    res.status(300).send({
        message: 'Event not recognized', 
        type: type, 
        data: data
    });

})

const moderateMessage = (content: string) => {
    return true;
}