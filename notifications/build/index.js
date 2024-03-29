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
const app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(cors());
app.post('/events', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { type, data } = req.body;
    if (type === 'PostModerated') {
        // Handling Bad Request
        const post = data;
        const { postID, userID, groupID, postText, postMedia, postComments } = post;
        const params = [postID, userID, groupID, postText];
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
            "type": "PostNotified",
            "data": data
        });
        return;
    }
    if (type === 'CommentModerated') {
        // Handling Bad Request
        const comment = data;
        const { commentID, postID, userID, content } = comment;
        const params = [commentID, postID, userID, content];
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
            "type": "CommentNotified",
            "data": data
        });
        return;
    }
    res.status(300).send({
        message: 'Event not recognized',
        type: type,
        data: data
    });
}));
app.listen(4009, () => {
    console.log('Notifications service listening on port 4009');
});
