import { dbService, storageService } from "fb";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import React, {useState } from "react";
import { addDoc, collection } from "@firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

const HweetFactory = ({userObj}) => {
    const [hweet, setHweet] = useState("");
    const [attachment, setAttachment] = useState("");
    
    const onSubmit = async (event) => {
        event.preventDefault();

        if (hweet === "") {
            return;
        }

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

    const onClearAttachment = () => setAttachment("");
    return (
        <form onSubmit={onSubmit} className="factoryForm">
            <div className="factoryInput__container">
                <input type="text" placeholder="What's on your mind?" maxLength={120} value={hweet} onChange={onChange} className="factoryInput__input"/>
                <input type="submit" value="&rarr;" className="factoryInput__arrow" />
            </div>
            <label htmlFor="attach-file" className="factoryInput__label">
                <span>Add photos</span>
                <FontAwesomeIcon icon={faPlus} />
            </label>
            
            <input id="attach-file"
                type="file"
                accept="image/*"
                onChange={onFileChange}
                style={{
                opacity: 0,
                }}
            />
            
            {attachment && (
                <div className="factoryForm__attachment">
                    <img
                        src={attachment}
                        style={{
                        backgroundImage: attachment,
                            }}
                        alt="attachment"
                    />
                    <div className="factoryForm__clear" onClick={onClearAttachment}>
                        <span>Remove</span>
                        <FontAwesomeIcon icon={faTimes} />
                    </div>
                </div>
            )}
        </form>
    );
};

export default HweetFactory;