import express from 'express';
import logger from 'morgan';
import { randomBytes } from 'crypto';
import cors from 'cors';
import axios from 'axios';

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(cors());

app.post('posts/:id/comments', async (req, res) => {
    const commentId = randomBytes(8).toString('hex');
    const { postID, content } = req.body;
    if (!content || content.trim() === '') {
        res.status(400).send('Comment must have content');
        return;
    }
    else {
        res.status(200).send({ commentId, postID, content });
    }
});

app.listen(4001, () => {
    console.log('Listening on port 4001');
});
