import express, { Express, Request, Response } from 'express';
import logger from 'morgan';
import { randomBytes } from 'crypto';
import cors from 'cors';
import { WithId, Document, MongoClient, ObjectId } from "mongodb";
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

interface ComplexPost extends WithId<Document> {
    _id: ObjectId,
    postID: string,
    userID: string,
    groupID: string,
    postText: string,
    postMedia: string,
    postUpvotes: Vote[],
    postDownvotes: Vote[],
    postComments: Comment[]
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

const app: Express = express();

app.use(logger('dev'));
app.use(express.json());
app.use(cors());

app.get('/posts/all', async (req: Request, res: Response) => {
    // Get From DB
    const posts : Post[] = await getAllPosts();

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
    const allPosts : Post[] = await getAllPosts();

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
    const allPosts : Post[] = await getAllPosts();

    const posts : Post[] = allPosts.filter((post: Post) => post.userID === userID);

    // Send Response
    res.status(200).send(posts);
});

// Handle Events
app.post('/events', async (req: Request, res: Response) => {
    const { type, data } : {type : string, data : any} = req.body;

    if (type === 'PostModerated') {
        const post : Post = data;
        if (!addPost(post)) {
            res.status(500).send({
                error: 'Could not add post to DB',
                data: post
            });
            return;
        }
        res.status(200).send(post);
        return;
    }
    if (type === 'CommentModerated') {
        const comment : Comment = data;

        // if (!updatePostByComment(comment)) {
        const bool = await updatePostByComment(comment);
        console.log(bool)
        if (!bool) {
            res.status(500).send({
                error: 'Could not add comment to DB',
                data: comment
            });
            return;
        }

        res.status(200).send(comment);
        return;
    }
    
    if (type === 'VoteCreated') {
        const vote : Vote = data;

        if (!updatePostByVote(vote)) {
            res.status(500).send({
                error: 'Could not add Vote to DB',
                data: vote
            });
            return;
        }

        res.status(200).send(vote);
        return;
    }
    
    res.status(300).send({
        message: 'Event not recognized', 
        type: type, 
        data: data
    });
    return;

});

// Start Server
app.listen(4004, () => {
    console.log('Listening on 4004');
});


// CRUD OPERATIONS

// Helper functions for getting posts
const getAllPosts = async () => {
    const mongo = await connectDB();
    const db = mongo.db('query').collection('query');

    const result = (await db.find({}).toArray()) as ComplexPost[];
    return result.map((post) => {
        const retPost : Post = {
            postID: post.postID,
            userID: post.userID,
            groupID: post.groupID,
            postText: post.postText,
            postMedia: post.postMedia,
            postUpvotes: post.postUpvotes,
            postDownvotes: post.postDownvotes,
            postComments: post.postComments
        }
        return retPost
    })
}

// Helper function for adding a post to DB
const addPost = async (post: Post) => {
    const mongo = await connectDB();
    const db = mongo.db('query').collection('query');
    const result = await db.insertOne(post);
    if (!result) {
        return null;
    }
    return post;
}

const updatePostByComment = async(comment: Comment) => {
    const mongo = await connectDB();
    const db = mongo.db('query').collection('query');
    try {
        const ret = await db.updateOne(
           { "postID" : comment.postID },
           { $push: { postComments : comment } }
        );
        if (ret.modifiedCount === 0) {
            return false;
        }
        return true;
     } catch (e: any) {
        console.log(e);
        return false;
     }
}

const updatePostByVote = async(vote: Vote) => {
    const mongo = await connectDB();
    const db = mongo.db('query').collection('query');
    try {
        const ret = await db.updateOne(
            { "postID" : vote.postID },
            { $push: { postVotes : vote } }
        );
        if (ret.modifiedCount === 0) {
            return false;
        }
        return true;
        } catch (e: any) {
            console.log(e);
            return false;
        }
}

async function connectDB(): Promise<MongoClient> {
    const uri = process.env.DATABASE_URL || 'mongodb://localhost:27017';

    if (uri === undefined) {
      throw Error('DATABASE_URL environment variable is not specified');
    }

    const mongo = new MongoClient(uri);
    await mongo.connect();
    return await Promise.resolve(mongo);
}