import react, { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import "../styles/Post.css";

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

type PostType = {
    postID: string,
    userID: string,
    groupID: string,
    postText: string,
    postMedia: string,
    postUpvotes: Vote[],
    postDownvotes: Vote[],
    postComments: Comment[]
}

type UserType = {
    userID: string,
    firstName: string,
    lastName: string,
    tagName: string,
    posts: [],
    comments: [],
    upvotes: [],
    downvotes: [],
    courses: [],
    deadlines: []
}

export default function Post({post} : {post: PostType}) {

    const [postData, setPostData] = useState<PostType>(post);

    const onUpvote = () => {
        setPostData({...postData, postUpvotes: [...postData.postUpvotes, {voteID: "1", voter: "1", postID: "1", voteType: "upvote"}]})
    }

    const onDownvote = () => {
        setPostData({...postData, postDownvotes: [...postData.postDownvotes, {voteID: "1", voter: "1", postID: "1", voteType: "downvote"}]})
    }

    return (
        <div className="card post-container">
            <img className="card-img-top" src={postData.postMedia} alt="img"></img>
            <span className="card-body">{postData.postText}</span>
            {/* Upvotes Here */}
            <div className="upvote-container">
                <button onClick={onUpvote} className="btn btn-success">&uarr;</button>
                <button onClick={onDownvote} className="btn btn-danger">&darr;</button>
                <span>{postData.postUpvotes.length - postData.postDownvotes.length}</span>
            </div>
            {/* Comments Here */}
            <h6 className="card-subtitle">Created by {postData.userID}</h6>
        </div>
    );
}