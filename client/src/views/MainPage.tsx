import React, { useEffect } from "react";
import CreatePost from "../components/CreatePost";
import Post from "../components/Post";
import "../styles/MainPage.css"
import axios from "axios";

type User = {
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

export default function MainPage({user} : {user: User}) {

    const [posts, setPosts] = React.useState<PostType[]>([]);

    const loadAllPosts = () => {
        axios.get("http://localhost:4004/posts/all").then((res) => {
            setPosts(res.data)
        })
    }

    const loadPostsByUser = (userID : string) => {
        return () => {
            axios.get("http://localhost:4004/posts/user" + userID).then((res) => {
                setPosts(res.data)
            })
        }
    }

    const loadPostsByGroup = (groupID : string) => {
        return () => {
            axios.get("http://localhost:4004/posts/group" + groupID).then((res) => {
                setPosts(res.data)
            })
        }
    }

    useEffect(loadPostsByUser(user.userID), [])

    return (
        <div>
            <h1>UniChat</h1>
            <div className="main-page">
                <div className="posts-container">
                    {posts.map((post) => {
                        return <Post key={post.postID} post={post} />
                    })}
                </div>
                <CreatePost user={user}/>
            </div>
        </div>
    );
    }