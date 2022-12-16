var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import { MongoClient } from "mongodb";
const app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(cors());
app.get('/posts/all', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Get From DB
    const posts = yield getAllPosts();
    // Send Response
    res.status(200).send(posts);
}));
app.get('/posts/group/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Handling Bad Request
    const { query } = req;
    const groupID = query.groupID;
    const params = [groupID];
    if (params.some((param, index) => (!param || param.trim() === ''))) {
        res.status(400).send({
            error: 'Body missing parameters',
            expected: {
                "groupID": "string"
            }
        });
        return;
    }
    // Get From DB
    const allPosts = yield getAllPosts();
    const posts = allPosts.filter((post) => post.groupID === groupID);
    // Send Response
    res.status(200).send(posts);
}));
app.get('/posts/user/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Handling Bad Request
    const { query } = req;
    const userID = query.userID;
    const params = [userID];
    if (params.some((param, index) => (!param || param.trim() === ''))) {
        res.status(400).send({
            error: 'Body missing parameters',
            expected: {
                "userID": "string"
            }
        });
        return;
    }
    // Get From DB
    const allPosts = yield getAllPosts();
    const posts = allPosts.filter((post) => post.userID === userID);
    // Send Response
    res.status(200).send(posts);
}));
// Handle Events
app.post('/events', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { type, data } = req.body;
    if (type === 'PostModerated') {
        const post = data;
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
        const comment = data;
        // if (!updatePostByComment(comment)) {
        const bool = yield updatePostByComment(comment);
        console.log(bool);
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
        const vote = data;
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
}));
// Start Server
app.listen(4004, () => {
    console.log('Listening on 4004');
});
// CRUD OPERATIONS
// Helper functions for getting posts
const getAllPosts = () => __awaiter(void 0, void 0, void 0, function* () {
    const mongo = yield connectDB();
    const db = mongo.db('query').collection('query');
    const result = (yield db.find({}).toArray());
    return result.map((post) => {
        const retPost = {
            postID: post.postID,
            userID: post.userID,
            groupID: post.groupID,
            postText: post.postText,
            postMedia: post.postMedia,
            postUpvotes: post.postUpvotes,
            postDownvotes: post.postDownvotes,
            postComments: post.postComments
        };
        return retPost;
    });
});
// Helper function for adding a post to DB
const addPost = (post) => __awaiter(void 0, void 0, void 0, function* () {
    const mongo = yield connectDB();
    const db = mongo.db('query').collection('query');
    const result = yield db.insertOne(post);
    if (!result) {
        return null;
    }
    return post;
});
const updatePostByComment = (comment) => __awaiter(void 0, void 0, void 0, function* () {
    const mongo = yield connectDB();
    const db = mongo.db('query').collection('query');
    try {
        const ret = yield db.updateOne({ "postID": comment.postID }, { $push: { postComments: comment } });
        if (ret.modifiedCount === 0) {
            return false;
        }
        return true;
    }
    catch (e) {
        console.log(e);
        return false;
    }
});
const updatePostByVote = (vote) => __awaiter(void 0, void 0, void 0, function* () {
    const mongo = yield connectDB();
    const db = mongo.db('query').collection('query');
    try {
        db.updateOne({ "postid": vote.postID }, { $push: { postVotes: vote } });
        return true;
    }
    catch (e) {
        console.log(e);
        return false;
    }
});
function connectDB() {
    return __awaiter(this, void 0, void 0, function* () {
        const uri = process.env.DATABASE_URL || 'mongodb://localhost:27017';
        if (uri === undefined) {
            throw Error('DATABASE_URL environment variable is not specified');
        }
        const mongo = new MongoClient(uri);
        yield mongo.connect();
        return yield Promise.resolve(mongo);
    });
}
