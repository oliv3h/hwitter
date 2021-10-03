import React from "react";
import { useState } from "react";
import { authService } from "fb";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from "firebase/auth";

const AuthForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newAccount, setNewAccount] = useState(true);
    const [error, setError] = useState("");

    const onChange = (event) => {
        const { target: { name, value } } = event;
        if (name === "email") {
            setEmail(value);
        } else if (name === "password") {
            setPassword(value);
        }
    };
    const onSubmit = async (event) => {
        event.preventDefault();
        try {
            if (newAccount) {
                // create account
                await createUserWithEmailAndPassword(
                    authService,
                    email,
                    password
                );
            } else {
                // login
                await signInWithEmailAndPassword(
                    authService,
                    email,
                    password
                );
            }
        } catch (error) {
            setError(error.message);
        }
    };
    const toggleAccount = () => setNewAccount((prev) => !prev);
    return (
        <>
            <form onSubmit={onSubmit} className="container">
                <input name="email" type="text" placeholder="Email" required value={email} onChange={onChange} className="authInput"></input>
                <input name="password" type="password" placeholder="Password" required value={password} onChange={onChange} className="authInput"></input>
                <input type="submit" value={newAccount ? "Create Account" : "Login"} className="authInput authSubmit"></input>
                { error && <span className="authError">{error}</span>}
            </form>
            <span onClick={toggleAccount} className="authSwitch">{newAccount ? "Sign in" : "Create Account"}</span>
        </>
    )
};
export default AuthForm;