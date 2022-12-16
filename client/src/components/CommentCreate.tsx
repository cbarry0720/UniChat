import react from "react";
import axios from "axios";
import { useState } from "react";
// import "../styles/CreatePost.css";

type Props = {
    postID: string,
    userID: string,
    reloadPosts: () => void
}

export default function CommentCreate({postID, userID, reloadPosts} : Props) {

    const [commentText, setCommentText] = useState<string>("");

    const onSubmit = async (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        await axios.post("http://localhost:4003/comments/create", {
            postID: postID,
            userID: userID,
            content: commentText
        })

        setTimeout(() => {
            reloadPosts();
        }, 500)
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