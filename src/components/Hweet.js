import React, { useState } from "react";
import { dbService, storageService } from "fb";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "@firebase/storage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

const Hweet = ({ hweetObject, isOwner }) => {
    const [editing, setEditing] = useState(false);
    const [newHweet, setNewHweet] = useState(hweetObject.text);
    const onDeleteClick = async (event) => {
        const ok = window.confirm("Are you sure?");
        if (ok) {
            // delete
            if (hweetObject.attachmenturl !== "") {
                await deleteObject(ref(storageService, hweetObject.attachmenturl));
            }
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
        <div className="hweet">
            {
                editing ? (
                    <>
                        <form onSubmit={onSubmit} className="container hweetEdit">
                            <input type="text" placeholder="edit your hweet!" value={newHweet} onChange={onChange} required autoFocus className="formInput"/>
                            <input type="submit" value="Update Hweet!"className="formBtn" />
                        </form>
                        <span onClick={toggleEditing} className="formBtn cancelBtn">
                            Cancel
                        </span>
                    </>
                ) : (
                    <>
                        <h4>{hweetObject.text}</h4>
                        {hweetObject.attachmenturl && <img src={hweetObject.attachmenturl} alt="images"/>}
                        {isOwner && (
                            <div className="hweet__actions">
                                <span onClick={onDeleteClick}>
                                    <FontAwesomeIcon icon={faTrash} />
                                </span>
                                <span onClick={toggleEditing}>
                                    <FontAwesomeIcon icon={faPencilAlt} />
                                </span>
                            </div>
                        )} 
                    </>
                )
            }
        </div>
    );
};

export default Hweet;