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
import { MongoClient } from "mongodb";
import cors from 'cors';
import axios from 'axios';
const database = [];
const app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(cors());
app.post('/comments/create', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Handling Bad Requests
    const { postID, userID, content } = req.body;
    const params = [postID, userID, content];
    if (params.some((param, index) => (!param || param.trim() === ''))) {
        res.status(400).send({
            error: 'Body missing parameters',
            expected: {
                "postID": "string",
                "userID": "string",
                "content": "string"
            }
        });
        return;
    }
    // Create a comment
    // const commentID : string = randomBytes(8).toString('hex');
    // const comment : Comment = {
    //     commentID : commentID,
    //     postID : postID,
    //     userID : userID,
    //     content : content
    // }
    // Push to DB
    const comment = yield addToDB(postID, userID, content);
    if (!comment) {
        res.status(500).send({
            error: 'Internal Server Error',
            expected: {
                "postID": "string",
                "userID": "string",
                "content": "string"
            }
        });
    }
    // Call Event bus
    yield axios.post("http://localhost:4010/events", {
        type: "CommentCreated",
        data: comment
    }).catch((error) => {
        if (error) {
            console.log(error);
        }
    });
    // Response
    res.status(200).send(comment);
}));
app.get('/comments/all', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Get from DB
    const comments = yield getAllFromDB();
    if (!comments) {
        res.status(500).send({
            error: 'Internal Server Error'
        });
    }
    // Response
    res.status(200).send(comments);
}));
app.get('/comments/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Handling Bad Requests
    const { postID } = req.body;
    const params = [postID];
    if (params.some((param, index) => (!param || param.trim() === ''))) {
        res.status(400).send({
            error: 'Body missing parameters',
            expected: {
                "postID": "string"
            }
        });
        return;
    }
    // Get from DB
    const comments = yield getFromDB(postID);
    if (!comments) {
        res.status(500).send({
            error: 'Internal Server Error',
            expected: {
                "postID": "string"
            }
        });
    }
    // Response
    res.status(200).send(comments);
}));
app.listen(4003, () => {
    console.log('Listening on port 4003');
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
const addToDB = (postID, userID, content) => __awaiter(void 0, void 0, void 0, function* () {
    const mongo = yield connectDB();
    const comments = mongo.db("comments").collection('comments');
    const id = yield comments.insertOne({
        userID: userID,
        postID: postID,
        content: content
    });
    if (id) {
        const comment = {
            commentID: id.insertedId,
            postID: postID,
            userID: userID,
            content: content
        };
        return comment;
    }
    return null;
});
const getFromDB = (postID) => __awaiter(void 0, void 0, void 0, function* () {
    const mongo = yield connectDB();
    const comments = mongo.db("comments").collection('comments');
    const filteredComments = yield comments.find({ postID: postID }).toArray();
    return filteredComments;
});
const getAllFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const mongo = yield connectDB();
    const comments = mongo.db("comments").collection('comments');
    const filteredComments = yield comments.find({}).toArray();
    return filteredComments;
});
