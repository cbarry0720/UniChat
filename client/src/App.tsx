import React from 'react';
import Login from "./components/Login";
import logo from './logo.svg';
import { Router, Route, Link } from 'react-router-dom';
import './App.css';

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

function App() {
  const [user, setUser] = React.useState<User>({
    userID : "",
    firstName: "",
    lastName: "",
    tagName: "",
    password: "",
    posts: [],
    comments: [],
    upvotes: [],
    downvotes: [],
    courses: [],
    deadlines: []
  });

  if(user.userID === ""){
    return (
      <Login setUser={setUser} />
    )
  }else{
    return (
      <div>
        <h1>Logged in!</h1>
        <h2>{user.firstName}</h2>
        <h2>{user.lastName}</h2>
        <h2>{user.tagName}</h2>
        <h2>{user.password}</h2>
        <h2>{user.posts}</h2>
        <h2>{user.comments}</h2>
        <h2>{user.upvotes}</h2>
        <h2>{user.downvotes}</h2>
        <h2>{user.courses}</h2>
        <h2>{user.deadlines}</h2>
      </div>
    )
  }
}

export default App;
