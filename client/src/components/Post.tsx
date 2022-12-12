import react, { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import "../styles/Post.css";

type PostType = {
    userID: string,
    postText: string,
    postMedia: string,
    postUpvotes: [],
    postDownvotes: [],
    postComments: []
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

export default function Post({post} : {post: string}) {

    const [user, setUser] = useState({
        userID : "",
        firstName: "",
        lastName: "",
        tagName: "",
        posts: [],
        comments: [],
        upvotes: [],
        downvotes: [],
        courses: [],
        deadlines: []
    });

    const [postData, setPostData] = useState({
        userID: "",
        postText: "",
        postMedia: "",
        postUpvotes: [],
        postDownvotes: [],
        postComments: []
    });

    const loadUser = async (id : string) => {
        const response = await axios.get<UserType>("http://localhost:4001/users/" + id);
        setUser(response.data);
    }

    const loadPost = async () => {
        const response = await axios.get<PostType>("http://localhost:4002/posts/" + post);
        setPostData(response.data);
        return response.data;
    }

    useEffect(() => {
        loadPost().then((x : PostType) => {
            loadUser(x.userID);
        })
    }, []);


    return (
        <div className="card post-container">
            <img className="card-img-top" src={postData.postMedia} alt="img"></img>
            <span className="card-body">{postData.postText}</span>
            {/* Upvotes Here */}

            {/* Comments Here */}
            <h6 className="card-subtitle">Created by {user.tagName}</h6>
        </div>
    );
}