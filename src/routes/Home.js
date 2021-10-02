import Hweet from "components/Hweet";
import { dbService, storageService } from "fb";
import { addDoc, collection, onSnapshot, query } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import React, { useEffect, useState } from "react";

const Home = ({ userObj }) => {
    const [hweet, setHweet] = useState("");
    const [hweets, setHweets] = useState([]);
    const [attachment, setAttachment] = useState("");

    useEffect(() => {
        const q = query(collection(dbService, "hweets"));
        onSnapshot(q, (querySnapshot) => {
            const hweetArray = querySnapshot.docs.map((document) => ({
                id: document.id,
                ...document.data()
            }));
            setHweets(hweetArray);
        });
    }, []);

    const onSubmit = async (event) => {
        event.preventDefault();

        let attachmenturl = "";
        if (attachment !== "") {
            const attachmentRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
            await uploadString(attachmentRef, attachment, "data_url");
            attachmenturl = await getDownloadURL(attachmentRef);
        }
        
        const newHweet = {
            text: hweet,
            createdAt: Date.now(),
            creatorId: userObj.uid,
            attachmenturl : attachmenturl,
        };

        try {
            await addDoc(collection(dbService, "hweets"), newHweet);
        } catch (error) {
            console.error(error);
        }
        setHweet("");
        setAttachment("");
    };
    const onChange = (event) => {
        const { value } = event.target;
        setHweet(value);
    };

    const onFileChange = (event) => {
        const { files } = event.target;
        const theFile = files[0];

        // use fileReader API
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            const { result } = finishedEvent.currentTarget;
            setAttachment(result);
        };
        reader.readAsDataURL(theFile);
    };

    const onClearAttachment = () => setAttachment(null);
    return (
        <div>
            <form onSubmit={onSubmit}>
                <input type="text" placeholder="What's on your mind?" maxLength={120} value={hweet} onChange={onChange}/>
                <input type="file" accept="image/*" onChange={onFileChange}/>
                <input type="submit" value="Hweet" />
                {attachment &&
                    <div>
                        <img src={attachment} width="50px" height="50px" alt="preview" />
                        <button onClick={onClearAttachment}>Clear</button>
                    </div>}
            </form>
            <div>
                {hweets.map((hweetObject) => (
                    <Hweet key={hweetObject.id} hweetObject={hweetObject} isOwner={hweetObject.creatorId === userObj.uid}/>
                ))}
            </div>
        </div>
    );
};

export default Home;