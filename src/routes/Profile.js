import { updateProfile } from "@firebase/auth";
import { collection, getDocs, onSnapshot, orderBy, query, where } from "@firebase/firestore";
import { authService, dbService } from "fb";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";

const Profile = ({ refreshUser, userObject }) => {
    const history = useHistory();
    const [newDisplayName, setNewDisplayName] = useState(userObject.displayName);
    const onLogOutClick = () => {
        authService.signOut();
        history.push("/");
    };

    const getMyHweets = async () => {
        const q = query(collection(dbService, "hweets")
            , where("creatorId", "==", userObject.uid)
            , orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            console.log(doc.id, " => ", doc.data());
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
    return <>
        <form onSubmit={onSubmit}>
            <input type="text" placeholder="Display Name" value={newDisplayName} onChange={onChange} />
            <input type="submit" value="Update Profile!" />
        </form>
        <button onClick={onLogOutClick}>Log Out</button>
    </>;
};

export default Profile;