import react, { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import "../styles/Group.css";



type GroupType = {
    groupID: string,
    groupUsers: string[],
    groupName: string,
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




export default function Group({group, user} : {group: GroupType, user: UserType}) {
    const [groupData, setGroupData] = useState<GroupType>(group);
    const joinGroup = async(e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // const result: GroupType = (await axios.post("http://localhost:4008/group/addUser", groupData)).data;
        // setGroups([...groups, result]);
        axios.post("http://localhost:4008/group/addUser", {groupID: groupData.groupID, userID: user.userID});
        setGroupData({...groupData, groupUsers: [...groupData.groupUsers, user.userID]})
    }



    return(
        <div className = "block">
            <b className = "title">{groupData.groupName}</b>
            <div>
                {groupData.groupUsers.map(x=>{
                    return <p className = "word" key = {x}>{x}</p>
                })}
            </div>
            <form onSubmit={joinGroup} className="form">
                <button type="submit" className="btn btn-primary post-button">Join Group</button> 
            </form>
            
        </div>
    )
}