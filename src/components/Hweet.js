import React, { useState } from "react";
import { dbService, storageService } from "fb";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "@firebase/storage";

const Hweet = ({ hweetObject, isOwner }) => {
    const [editing, setEditing] = useState(false);
    const [newHweet, setNewHweet] = useState(hweetObject.text);
    const onDeleteClick = async (event) => {
        const ok = window.confirm("Are you sure?");
        if (ok) {
            // delete
            await deleteObject(ref(storageService, hweetObject.attachmenturl));
            await deleteDoc(doc(dbService, `hweets/${hweetObject.id}`))
        }
    };
    const toggleEditing = () => setEditing(prev => !prev);
    const onSubmit = async (event) => {
        event.preventDefault();
        await updateDoc(doc(dbService, `hweets/${hweetObject.id}`), {
            text: newHweet
        });
        setEditing(false);
    }
    const onChange = (event) => {
        const { value } = event.target;
        setNewHweet(value);
    }
    return (
        <div>
            {
                editing ? (
                    <>
                        <form onSubmit={onSubmit}>
                            <input type="text" placeholder="edit your hweet!" value={newHweet} onChange={onChange} required />
                            <input type="submit" value="Update Hweet!"></input>
                        </form>
                        <button onClick={toggleEditing}>Cancel</button>
                    </>
                ) : (
                    <>
                        <h4>{hweetObject.text}</h4>
                        {hweetObject.attachmenturl && <img src={hweetObject.attachmenturl} width="50px" height="50px" alt="pic"></img>}
                        {isOwner &&
                            <>
                                <button onClick={onDeleteClick}>Delete!</button>
                                <button onClick={toggleEditing}>Edit!</button>
                            </>
                        } 
                    </>
                )
            }
            
        </div>
    );
};

export default Hweet;