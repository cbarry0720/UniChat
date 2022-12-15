import React, { useEffect, useState } from "react";
import CreatePost from "../components/CreatePost";
import Post from "../components/Post";
import "../styles/MainPage.css"
import axios from "axios";
import CreateDeadline from '../components/CreateDeadline';
import Deadline  from '../components/Deadline';
import CreateGroup from "../components/CreateGroup";
import Group from "../components/Group";

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


type DeadlineType = {
    deadlineID: string,
    deadlineUsers: string[],
    deadlineName: string,
    deadlineTime: string,
}

type GroupType = {
    groupID: string,
    groupUsers: string[],
    groupName: string,
}
  

type Filter = {
    filter: string,
    id: string
}

export default function MainPage({user} : {user: User}) {
    const [deadlines, setDeadlines] = React.useState<DeadlineType[]>([]);
    const [groups, setGroups] = React.useState<GroupType[]>([]);
    const [posts, setPosts] = useState<PostType[]>([]);
    const [filter, setFilter] = useState<Filter>({
        filter: "user",
        id: user.userID
    });

    const loadAllPosts = () => {
        axios.get("http://localhost:4004/posts/all").then((res) => {
            setPosts(res.data)
        })
    }

    const loadAllDeadlines = () => {
        axios.get("http://localhost:4007/deadlines/all").then((res) => {
            setDeadlines(res.data)
        })
    }

    const loadAllGroups = () => {
        axios.get("http://localhost:4008/group/all").then((res) => {
            setGroups(res.data)
        })
    }

    const loadPostsByUser = (userID : string) => {
        return () => {
            axios.get("http://localhost:4004/posts/user/:id", {params: {
                userID: userID
            }}).then((res) => {
                setPosts(res.data)
            })
        }
    }

    const loadPostsByGroup = (groupID : string) => {
        return () => {
            axios.get("http://localhost:4004/posts/group/:id", {
                params: {
                    groupID: groupID
                }
            }).then((res) => {
                setPosts(res.data)
            })
        }
    }

    const loadPostsByFilter = () => {
        console.log("here")
        console.log(filter)
        if (filter.filter === "user") {
            loadPostsByUser(filter.id)();
        } else if (filter.filter === "group") {
            loadPostsByGroup(filter.id)();
        } else{
            loadAllPosts()
        }
    }

    const loadEverything = () =>{
        loadPostsByFilter();
        loadAllDeadlines();
        loadAllGroups();
    }

    useEffect(loadEverything, [filter]);

    return (
        <div>
            <h1>UniChat</h1>
            <div className="main-page">
                <div className="posts-container">
                    {posts.map((post) => {
                        return <Post key={post.postID} userID = {user.userID} post={post} />
                    })}
                </div>
                <CreatePost reloadPosts={loadPostsByFilter} user={user}/>
            </div>
            <div className = "deadline-container">
                <CreateDeadline setDeadlines={setDeadlines} deadlines={deadlines} user={user}/>
                <div className="posts-container">
                    {deadlines.map((deadline) => {
                        return <Deadline key={deadline.deadlineID} deadline={deadline} />
                    })}
                </div>
            </div>
            <div className = "deadline-container">
                <CreateGroup setGroups={setGroups} groups={groups} user={user}/>
                <div className="posts-container">
                    {groups.map((group) => {
                        return <Group key={group.groupID} group={group} user = {user} setFilter = {setFilter}/>
                    })}
                </div>
            </div>
        </div>
    );
}