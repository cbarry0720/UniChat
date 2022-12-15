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

    

    return (
        <div className="card post-container">
            <img className="card-img-top" src={post.postMedia} alt="img"></img>
            <span className="card-body">{post.postText}</span>
            {/* Upvotes Here */}
            <div className="upvote-container">
                <button className="btn btn-success">&uarr;</button>
                <button className="btn btn-danger">&darr;</button>
                <span>{post.postUpvotes.length - post.postDownvotes.length}</span>
            </div>
            {/* Comments Here */}
            <h6 className="card-subtitle">Created by {post.userID}</h6>
        </div>
    );
}