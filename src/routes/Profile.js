import { updateProfile } from "@firebase/auth";
import { collection, getDocs, onSnapshot, orderBy, query, where } from "@firebase/firestore";
import { getDownloadURL, ref, uploadString } from "@firebase/storage";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { authService, dbService, storageService } from "fb";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { v4 as uuidv4 } from "uuid";
import noImages from "../no-images.jpg";

const Profile = ({ refreshUser, userObject }) => {
    const history = useHistory();
    const [newPhotoURL, setNewPhotoURL] = useState(userObject.photoURL);
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

        let hasChanged = false;

        let newPhotoDownloadURL = "";
        if (userObject.photoURL !== newPhotoURL) {
            // upload file
            const photoRef = ref(storageService, `users/${uuidv4()}`);
            await uploadString(photoRef, newPhotoURL, "data_url");
            newPhotoDownloadURL = await getDownloadURL(photoRef);
            await updateProfile(userObject, {
                photoURL: newPhotoDownloadURL,
            });
            hasChanged = true;
        }

        if (userObject.displayName !== newDisplayName) {
            await updateProfile(userObject, {
                displayName: newDisplayName,
            });
            hasChanged = true;
        }

        if (hasChanged) {
            refreshUser();
            alert("user has been changed!");
        }
    };

    const onFileChange = (event) => {
        const { files } = event.target;
        const theFile = files[0];

        // use fileReader API
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            const { result } = finishedEvent.currentTarget;
            setNewPhotoURL(result);
        };
        reader.readAsDataURL(theFile);
    };

    useEffect(() => {
        getMyHweets();
    });
    return (<div className="container">
        <form onSubmit={onSubmit}>
            <div className="photo__container">
                 <img src={newPhotoURL || noImages} alt="It's me!" style={{
                    backgroundImage: newPhotoURL || noImages,
                }} />
                <label htmlFor="modify-file" className="factoryInput__label">
                    <span>Modify photo</span>
                    <FontAwesomeIcon icon={faPlus} />
                </label>
                
                <input id="modify-file"
                    type="file"
                    accept="image/*"
                    onChange={onFileChange}
                    style={{
                    opacity: 0,
                    }}
                />
            </div>
            <input type="text" placeholder="Display Name" value={newDisplayName} onChange={onChange} autoFocus className="formInput" style={{ marginTop: 10 }} />
            <input type="submit" value="Update Profile!" className="formBtn" style={{ marginTop: 10 }} />
        </form>
        <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
            Log Out
        </span>
    </div>);
};

export default Profile;