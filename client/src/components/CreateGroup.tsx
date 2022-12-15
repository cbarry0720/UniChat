import react from "react";
import axios from "axios";
import { useState } from "react";
import "../styles/CreateGroup.css";


type GroupType = {
    groupID: string,
    groupUsers: string[],
    groupName: string,
}

type GroupParameters = {
    userID: string,
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

export default function CreateGroup({user, groups, setGroups} : {user: UserType, groups: GroupType[], setGroups: react.Dispatch<react.SetStateAction<GroupType[]>>}){

    const [groupData, setGroupData] = useState<GroupParameters>({
        userID: user.userID,
        groupName: "",
    });

    const createGroup = async(e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(groupData)
        const result: GroupType = (await axios.post("http://localhost:4008/group/create", groupData)).data;
        setGroups([...groups, result]);
    }



    return (
        <div className = "create-group-container">
        <h2>Groups</h2>
        <form onSubmit={createGroup} className="form">
            <div className="form-group">
                <label>Enter Group Name:</label>
                <textarea className="post-text form-control" placeholder="" onChange={(e) => {
                    setGroupData({
                        userID: groupData.userID,
                        groupName: e.target.value,
                    })
                }}></textarea>
            </div>
            <button type="submit" className="btn btn-primary post-button">Create Group</button>
        </form>
        </div>
      );
}       