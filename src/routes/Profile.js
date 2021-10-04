import { updateProfile } from "@firebase/auth";
import { collection, getDocs, onSnapshot, orderBy, query, where } from "@firebase/firestore";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { authService, dbService } from "fb";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";

const Profile = ({ refreshUser, userObject }) => {
    const history = useHistory();
    const [newProfile, setNewProfile] = useState(userObject.photoURL);
    const [newDisplayName, setNewDisplayName] = useState(userObject.displayName);
    const onLogOutClick = () => {
        authService.signOut();
        history.push("/");
        refreshUser();
    };

    const getMyHweets = async () => {
        const q = query(collection(dbService, "hweets")
            , where("creatorId", "==", userObject.uid)
            , orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            
        });
    };

    const onChange = (event) => {
        const { value } = event.target;
        setNewDisplayName(value);
    };

    const onSubmit = async (event) => {
        event.preventDefault();
        if (userObject.displayName !== newDisplayName) {
            await updateProfile(userObject, {
                displayName: newDisplayName,
            });
        refreshUser();
        }
    };

    useEffect(() => {
        getMyHweets();
    });
    return (<div className="container">
        <form onSubmit={onSubmit}>
            <img src={userObject.photoURL} alt="It's me!" style={{
                display: "block",
                margin: "0 auto",
            }} />
            <input type="text" placeholder="Display Name" value={newDisplayName} onChange={onChange} autoFocus className="formInput" style={{marginTop:10}} />
            <input type="submit" value="Update Profile!" className="formBtn" style={{marginTop: 10 }} />
        </form>
        <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
            Log Out
        </span>
    </div>);
};

export default Profile;