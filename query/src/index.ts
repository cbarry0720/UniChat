import express, { Express, Request, Response } from 'express';
import logger from 'morgan';
import { randomBytes } from 'crypto';
import cors from 'cors';
import axios, { AxiosError } from 'axios';

// TYPES 

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

type Post = {
    postID: string,
    userID: string,
    groupID: string,
    postText: string,
    postMedia: string,
    postUpvotes: Vote[],
    postDownvotes: Vote[],
    postComments: Comment[]
}

const database : Post[] = [];

const app: Express = express();

app.use(logger('dev'));
app.use(express.json());
app.use(cors());

app.get('/posts/all', async (req: Request, res: Response) => {
    // Get From DB
    const posts : Post[] = getAllPosts();

    // Send Response
    res.status(200).send(posts);
});

interface Query {
    groupID? : string,
    userID? : string
}

app.get('/posts/group/:id', async (req: Request<{}, {}, {}, Query>, res: Response) => {
    // Handling Bad Request
    const { query } = req;
    const groupID = query.groupID;
    const params : any[] = [groupID];
    if (params.some((param, index) => (!param || param.trim() === ''))) {
        res.status(400).send({
            error: 'Body missing parameters',
            expected: {
                "groupID" : "string"
            }
        });
        return;
    }

    // Get From DB
    const allPosts : Post[] = getAllPosts();

    const posts : Post[] = allPosts.filter((post: Post) => post.groupID === groupID);

    // Send Response
    res.status(200).send(posts);

});

app.get('/posts/user/:id', async (req: Request, res: Response) => {
    // Handling Bad Request
    const { query } = req;
    const userID = query.userID;
    const params : any[] = [userID];
    if (params.some((param, index) => (!param || param.trim() === ''))) {
        res.status(400).send({
            error: 'Body missing parameters',
            expected: {
                "userID" : "string"
            }
        });
        return;
    }

    // Get From DB
    const allPosts : Post[] = getAllPosts();

    const posts : Post[] = allPosts.filter((post: Post) => post.userID === userID);

    // Send Response
    res.status(200).send(posts);
});

// Handle Events
app.post('/events', async (req: Request, res: Response) => {
    const { type, data } : {type : string, data : any} = req.body;

    if (type === 'PostModerated') {
        const post : Post = data;
        addPost(post);
        res.status(200).send(post);
        return;
    }
    if (type === 'CommentModerated') {
        const comment : Comment = data;
        const post = getPost(comment.postID);
        if (post) {
            post.postComments.push(comment);
            updatePost(post);
            res.status(200).send(post);
            return;
        } else {
            res.status(404).send({
                error: 'Post not found',
                data: comment
            });
            return;
        }
    }
    if (type === 'VoteCreated') {
        const vote : Vote = data;
        const post = getPost(vote.postID);
        if (post) {
            if (vote.voteType === 'upvote') {
                post.postUpvotes.push(vote);
            } else {
                post.postDownvotes.push(vote);
            }
            updatePost(post);
            res.status(200).send(post);
            return;
        }
        else {
            res.status(404).send({
                error: 'Post not found',
                data: vote
            });
            return;
        }
    }
    
    res.status(300).send({
        message: 'Event not recognized', 
        type: type, 
        data: data
    });

});

// Start Server
app.listen(4004, () => {
    console.log('Listening on 4004');
});


// CRUD OPERATIONS

// Helper functions for getting posts
const getAllPosts = () => {
    return database;
}

// Helper function for getting a post from DB
const getPost = (postID: string) => {
    const index : number = database.findIndex((post: Post) => post.postID === postID);
    if (index > -1) {
        return database[index];
    }
    return null;
}

// Helper function for adding a post to DB
const addPost = (post: Post) => {
    database.push(post);
}

// Helper function for deleting a post from DB
const deletePost = (postID: string) => {
    const index : number = database.findIndex((post: Post) => post.postID === postID);
    const post : Post = database[index];
    if (index > -1) {
        database.splice(index, 1);
        return post;
    }
    return null;
}

// Helper function for updating a post in DB
const updatePost = (post: Post) => {
    const index : number = database.findIndex((post: Post) => post.postID === post.postID);
    if (index > -1) {
        database[index] = post;
        return post;
    }
    return null;
}
