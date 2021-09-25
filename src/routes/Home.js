import { dbService } from "fb";
import { addDoc, collection, getDocs, doc, onSnapshot, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";

const Home = ({ userObj }) => {
    const [hweet, setHweet] = useState("");
    const [hweets, setHweets] = useState([]);

    const getHweets = async () => {
        const docRef = collection(dbService, "hweets");
        const docSnap = await getDocs(docRef);
        docSnap.forEach(document => {
            const hweetObject = {
                ...document.data(),
                id: document.id
            }
            setHweets(prev => [hweetObject, ...prev]);
        });
    };

    useEffect(() => {
        //getHweets();
        const q = query(collection(dbService, "hweets"));
        onSnapshot(q, (querySnapshot) => {
            const hweetArray = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            console.log(hweetArray);
            setHweets(hweetArray);
            /*
            querySnapshot.forEach((document) => {
                const hweetObject = {
                    ...document.data(),
                    id: document.id
                }
                setHweets(prev => [hweetObject, ...prev]);
            });
            */
        });
    }, []);

    const onSubmit = async (event) => {
        event.preventDefault();
        try {
            const docRef = await addDoc(collection(dbService, "hweets"), {
                text: hweet,
                createdAt: Date.now(),
                creatorId: userObj.uid
            });
            console.log(docRef.id);
        } catch (error) {
            console.error(error);
        }
        setHweet("");
    }
    const onChange = (event) => {
        const { value } = event.target;
        setHweet(value);
    }
    return (
        <div>
            <form onSubmit={onSubmit}>
                <input type="text" placeholder="What's on your mind?" maxLength={120} value={hweet} onChange={onChange}/>
                <input type="submit" value="Hweet"/>
            </form>
            <div>
                {hweets.map(hweet => (
                    <div key={hweet.id}>
                        <h4>{hweet.text}</h4>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;