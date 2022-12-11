import React from 'react';
import Login from "./components/Login";
import logo from './logo.svg';
import { Router, Route, Link } from 'react-router-dom';
import './App.css';
import MainPage from './views/MainPage';

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
      <MainPage user={user}/>
    )
  }
}

export default App;
