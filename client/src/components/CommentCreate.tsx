import react from "react";
import axios from "axios";
import { useState } from "react";
// import "../styles/CreatePost.css";

type Props = {
    postID: string,
    userID: string,
}

export default function CommentCreate({postID, userID} : Props) {

    const [commentText, setCommentText] = useState<string>("");

    const onSubmit = async (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        await axios.post("http://localhost:4003/comments/create", {
            postID: postID,
            userID: userID,
            content: commentText
        })
    }

    return (
        <div>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="form-control"
            ></input>
          </div>
          <button className="btn btn-primary">Submit</button>
        </form>
      </div>
    );
}