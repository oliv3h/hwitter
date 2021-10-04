import Hweet from "components/Hweet";
import { dbService } from "fb";
import { collection, onSnapshot, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import HweetFactory from "components/HweetFactory";

const Home = ({ userObj }) => {

    const [hweets, setHweets] = useState([]);

    useEffect(() => {
        const q = query(collection(dbService, "hweets"));
        onSnapshot(q, (querySnapshot) => {
            let hweetArray = querySnapshot.docs.map((document) => ({
                id: document.id,
                ...document.data()
            }));
            setHweets(hweetArray);
        });
    }, []);
    return (
        <div className="container">
            <HweetFactory userObj={userObj} />
            <div style={{ marginTop: 30 }}>
                {hweets.map((hweetObject) => (
                    <Hweet key={hweetObject.id} hweetObject={hweetObject} isOwner={hweetObject.creatorId === userObj.uid}/>
                ))}
            </div>
        </div>
    );
};

export default Home;