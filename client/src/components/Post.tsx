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

export default function Post({userID, post} : {userID: string, post: PostType}) {

    const [postData, setPostData] = useState<PostType>(post);
    const [localVoteValue, setLocalVoteValue] = useState<number>(0);

    console.log(postData)

    const onUpvote = async () => {
        if(localVoteValue === 1) {
            setPostData({...postData, postUpvotes: postData.postUpvotes.filter((vote, i) => postData.postUpvotes.length - 1 !== i)})
            setLocalVoteValue(0)
            return;
        }
        const voteData : Vote = await axios.post("http://localhost:4006/votes/create", {
            userID,
            postID: postData.postID,
            voteType: "upvote"
        })
        setLocalVoteValue(localVoteValue + 1);
        setPostData({...postData, postUpvotes: [...postData.postUpvotes, voteData]})
    }

    const onDownvote = async () => {
        if(localVoteValue === -1) {
            setPostData({...postData, postDownvotes: postData.postDownvotes.filter((vote, i) => postData.postDownvotes.length - 1 !== i)})
            setLocalVoteValue(0)
            return;
        }
        const voteData : Vote = await axios.post("http://localhost:4006/votes/create", {
            userID,
            postID: postData.postID,
            voteType: "downvote"
        })
        setLocalVoteValue(localVoteValue - 1);
        setPostData({...postData, postDownvotes: [...postData.postDownvotes, voteData]})
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