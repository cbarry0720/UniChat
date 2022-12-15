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
import axios from 'axios';
const app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(cors());
app.post('/events', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { type, data } = req.body;
    if (type === 'PostCreated') {
        const post = data;
        const content = post.postText;
        if (moderateMessage(content)) {
            yield axios.post('http://localhost:4005/events', {
                type: 'PostModerated',
                data: {
                    postID: post.postID,
                    userID: post.userID,
                    groupID: post.groupID,
                    postText: post.postText,
                    postMedia: post.postMedia,
                    postComments: post.postComments,
                }
            });
        }
        else {
            yield axios.post('http://localhost:4005/events', {
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
            });
        }
    }
    if (type === 'CommentCreated') {
        const comment = data;
        const content = comment.content;
        if (moderateMessage(content)) {
            yield axios.post('http://localhost:4005/events', {
                type: 'CommentModerated',
                data: {
                    comment: {
                        commentID: comment.commentID,
                        postID: comment.postID,
                        userID: comment.userID,
                        content: comment.content
                    }
                }
            });
        }
        else {
            yield axios.post('http://localhost:4005/events', {
                type: 'CommentModerated',
                data: {
                    comment: {
                        commentID: comment.commentID,
                        postID: comment.postID,
                        userID: comment.userID,
                        content: 'This comment has been removed due to offensive content'
                    }
                }
            });
        }
    }
    res.status(300).send({
        message: 'Event not recognized',
        type: type,
        data: data
    });
}));
const moderateMessage = (content) => {
    return true;
};
