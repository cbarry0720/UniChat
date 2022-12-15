import react, { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
// import "../styles/.css";

type Comment = {
    commentID : string,
	postID : string,
    userID : string,
	content : string
}

export default function CommentList({comments} : {comments: Comment[]}) {
    
    const renderedComments = comments.map((comment) => {
        return <li key={comment.commentID}>{comment.content}
        </li>
    })

    return (
        <ul>
            {renderedComments}
        </ul>
    )
        
}