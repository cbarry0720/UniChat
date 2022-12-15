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
import { randomBytes } from 'crypto';
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
    const commentID = randomBytes(8).toString('hex');
    const comment = {
        commentID: commentID,
        postID: postID,
        userID: userID,
        content: content
    };
    // Push to DB
    // TODO : MongoDB should be indexable by commentID
    database.push(comment);
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
    const comments = database.filter((comment) => comment.postID === postID);
    // Call Event Bus ?
    // Response
    res.status(200).send(comments);
}));
app.listen(4003, () => {
    console.log('Listening on port 4003');
});
