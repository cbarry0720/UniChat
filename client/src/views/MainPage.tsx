import React from "react";
import CreatePost from "../components/CreatePost";
import Post from "../components/Post";
import "../styles/MainPage.css"

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

export default function MainPage({user} : {user: User}) {

    console.log(user.posts)

    return (
        <div>
            <h1>UniChat</h1>
            <div className="main-page">
                <div className="posts-container">
                    {user.posts.map((post) => {
                        return <Post key={post} post={post} />
                    })}
                </div>
                <CreatePost user={user}/>
            </div>
        </div>
    );
    }