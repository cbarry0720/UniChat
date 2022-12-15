import react, { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import "../styles/Deadline.css";



type DeadlineType = {
    deadlineID: string,
    deadlineUsers: string[],
    deadlineName: string,
    deadlineTime: string,
}

export default function Deadline({deadline} : {deadline: DeadlineType}) {
    return(
        <div className = "block">
            <b>{deadline.deadlineName}</b>
            <p>{deadline.deadlineTime}</p>
        </div>
    )
}