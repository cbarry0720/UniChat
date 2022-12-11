import react from "react";
import axios from "axios";
import { useState } from "react";
import "../styles/CreatePost.css";

type PostType = {
    userID: string,
    postText: string,
    postMedia: string,
    postUpvotes: [],
    postDownvotes: [],
    postComments: []
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

export default function CreatePost({user} : {user: UserType}) {

    const [postData, setPostData] = useState<PostType>({
        userID: "",
        postText: "",
        postMedia: "",
        postUpvotes: [],
        postDownvotes: [],
        postComments: []
    });

    const createPost = (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        axios.post("http://localhost:4002/posts/create", postData);
    }

    return (
        <div className="create-post-container">
            <h2>Create Post</h2>
            <form onSubmit={createPost} className="form">
                <div className="form-group">
                    <label>Enter Text Here:</label>
                    <textarea className="post-text form-control" placeholder="What's on your mind?" onChange={(e) => {
                        setPostData({
                            userID: user.userID,
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
                            userID: user.userID,
                            postText: postData.postText,
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