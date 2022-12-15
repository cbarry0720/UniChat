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
const database = [];
const app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(cors());
app.get('/posts/all', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Get From DB
    const posts = getAllPosts();
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
    const allPosts = getAllPosts();
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
    const allPosts = getAllPosts();
    const posts = allPosts.filter((post) => post.userID === userID);
    // Send Response
    res.status(200).send(posts);
}));
// Handle Events
app.post('/events', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { type, data } = req.body;
    if (type === 'PostModerated') {
        const post = data;
        addPost(post);
        res.status(200).send(post);
        return;
    }
    if (type === 'CommentModerated') {
        const comment = data;
        const post = getPost(comment.postID);
        if (post) {
            post.postComments.push(comment);
            updatePost(post);
            res.status(200).send(post);
            return;
        }
        else {
            res.status(404).send({
                error: 'Post not found',
                data: comment
            });
            return;
        }
    }
    if (type === 'PostUpvoted') {
        const vote = data;
        const post = getPost(vote.postID);
        if (post) {
            post.postUpvotes.push(vote);
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
    if (type === 'PostDownvoted') {
        const vote = data;
        const post = getPost(vote.postID);
        if (post) {
            post.postDownvotes.push(vote);
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
}));
// Start Server
app.listen(4004, () => {
    console.log('Listening on 4004');
});
// CRUD OPERATIONS
// Helper functions for getting posts
const getAllPosts = () => {
    return database;
};
// Helper function for getting a post from DB
const getPost = (postID) => {
    const index = database.findIndex((post) => post.postID === postID);
    if (index > -1) {
        return database[index];
    }
    return null;
};
// Helper function for adding a post to DB
const addPost = (post) => {
    database.push(post);
};
// Helper function for deleting a post from DB
const deletePost = (postID) => {
    const index = database.findIndex((post) => post.postID === postID);
    const post = database[index];
    if (index > -1) {
        database.splice(index, 1);
        return post;
    }
    return null;
};
// Helper function for updating a post in DB
const updatePost = (post) => {
    const index = database.findIndex((post) => post.postID === post.postID);
    if (index > -1) {
        database[index] = post;
        return post;
    }
    return null;
};
