import React from "react";
import axios from "axios";
import "../styles/Login.css";
import { useState } from "react";

type Auth = {
    userID : string,
    message: string
}

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

type LoginProps = {
    setUser: React.Dispatch<React.SetStateAction<User>>
}

export default function Login({setUser} : LoginProps) {

    const [tagName, setTagname] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");



    const onLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const response = await axios.post<Auth>("http://localhost:4000/auth/login", {
            tagName,
            password
        });
        const {userID, message} = response.data;
        if(message === "Logged in!"){
            try{
                const response = await axios.get<User>("http://localhost:4001/users/" + userID);
                setUser(response.data);
            }catch(err){
                console.error(err);
            } 
        }
    }

    const onSignup = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(password !== confirmPassword){
            alert("Passwords do not match!");
            return;
        }
        const response = await axios.post<Auth>("http://localhost:4000/auth/signup", {
            firstName,
            lastName,
            tagName,
            password
        });
        const data = response.data;
        setUser({
            userID: data.userID,
            firstName,
            lastName,
            tagName,
            password,
            posts: [],
            comments: [],
            upvotes: [],
            downvotes: [],
            courses: [],
            deadlines: []
        });
    }

    return (
        <div className="container m-5">
            <div className="row justify-content-between">
                <div className="login-container col" id="login">
                    <h1>Login</h1>
                    <form onSubmit={onLogin}>
                        <div className="mb-3">
                            <label className="form-label">Tagname</label>
                            <input className="form-control" type="text" onChange={e => setTagname(e.target.value)} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Password</label>
                            <input className="form-control" type="password"  onChange={e => setPassword(e.target.value)} />            </div>
                        <input className="btn btn-primary" type="submit" value="Login" />
                    </form>
                </div>
                <div className="login-container col">
                    <h1>Signup</h1>
                    <form onSubmit={onSignup}>
                        <div className="mb-3">
                            <label className="form-label">Tagname</label>
                            <input className="form-control" type="text" onChange={(e) => setTagname(e.target.value)} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Password</label>
                            <input className="form-control" type="password" onChange={(e) => setPassword(e.target.value)}/>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Confirm Password</label>
                            <input className="form-control" type="password" onChange={(e) => setConfirmPassword(e.target.value)}/>
                        </div>
                        <div className="input-group mb-3">
                            <label className="input-group-text">First Name</label>
                            <input className="form-control" type="text" onChange={(e) => setFirstName(e.target.value)}/>
                            <label className="input-group-text">Last Name</label>
                            <input className="form-control" type="text" onChange={(e) => setLastName(e.target.value)}/>
                        </div>
                        <input className="btn btn-primary" type="submit" value="Sign Up"/>
                    </form>
                </div>
            </div>
        </div>
    );
}