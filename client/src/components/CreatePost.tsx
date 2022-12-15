import react from "react";
import axios from "axios";
import { useState } from "react";
import "../styles/CreatePost.css";

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
    userID : string,
    firstName: string,
    lastName: string,
    tagName: string,
    password: string,
    posts: string[],
    comments: string[],
    upvotes: string[],
    downvotes: string[],
    courses: string[],
    deadlines: string[]
}

export default function CreatePost({user, reloadPosts} : {user: UserType, reloadPosts: () => void}) {

    const [postData, setPostData] = useState<PostType>({
        postID: "",
        userID: "",
        groupID: "123",
        postText: "",
        postMedia: "",
        postUpvotes: [],
        postDownvotes: [],
        postComments: []
    });

    const createPost = (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        axios.post("http://localhost:4002/posts/create", postData).then(() => {
            setTimeout(() => {
                reloadPosts();
            }, 500);
        })
    }

    return (
        <div className="create-post-container">
            <h2>Create Post</h2>
            <form onSubmit={createPost} className="form">
                <div className="form-group">
                    <label>Enter Text Here:</label>
                    <textarea className="post-text form-control" placeholder="What's on your mind?" onChange={(e) => {
                        setPostData({
                            postID: postData.postID,
                            userID: user.userID,
                            groupID: postData.groupID,
                            postText: e.target.value,
                            postMedia: postData.postMedia,
                            postUpvotes: postData.postUpvotes,
                            postDownvotes: postData.postDownvotes,
                            postComments: postData.postComments
                        })
                    }}></textarea>
                </div>
                <div className="form-group">
                    <label>Attach Media URL:</label>
                    <input className="url-input" type="url" onChange={(e) => {
                        setPostData({
                            postID: postData.postID,
                            userID: user.userID,
                            postText: postData.postText,
                            groupID: postData.groupID,
                            postMedia: e.target.value,
                            postUpvotes: postData.postUpvotes,
                            postDownvotes: postData.postDownvotes,
                            postComments: postData.postComments
                        })
                    }}></input>
                </div>
                <button type="submit" className="btn btn-primary post-button">Post</button>
            </form>
        </div>
    );
}