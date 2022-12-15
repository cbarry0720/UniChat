import react from "react";
import axios from "axios";
import { useState } from "react";
import "../styles/CreateDeadline.css";


type DeadlineType = {
    deadlineID: string,
    deadlineUsers: string[],
    deadlineName: string,
    deadlineTime: string,
}

type DeadlineParameters = {
    userID: string,
    deadlineName: string,
    deadlineTime:string
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

export default function CreateDeadline({user, deadlines, setDeadlines} : {user: UserType, deadlines: DeadlineType[], setDeadlines: react.Dispatch<react.SetStateAction<DeadlineType[]>>}){

    const [deadlineData, setDeadlineData] = useState<DeadlineParameters>({
        userID: user.userID,
        deadlineName: "",
        deadlineTime:""
    });

    const createDeadline = async(e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(deadlineData)
        const result: DeadlineType = (await axios.post("http://localhost:4007/deadline/create", deadlineData)).data;
        setDeadlines([...deadlines, result]);
    }



    return (
        <div>
        <h2>Deadlines</h2>
        <form onSubmit={createDeadline} className="form">
            <div className="form-group">
                <label>Enter Deadline Name:</label>
                <textarea className="post-text form-control" placeholder="" onChange={(e) => {
                    setDeadlineData({
                        userID: deadlineData.userID,
                        deadlineName: e.target.value,
                        deadlineTime: deadlineData.deadlineTime 
                    })
                }}></textarea>
            <br></br>
            <label>Enter Date:</label>
            <br></br>
            <input type="datetime-local" onChange={(e) =>
                setDeadlineData({
                    userID: deadlineData.userID,
                    deadlineName: deadlineData.deadlineName,
                    deadlineTime: e.target.value 
                })
            }/>
            </div>
            <button type="submit" className="btn btn-primary post-button">Create Deadline</button>
        </form>
        </div>
      );
}       