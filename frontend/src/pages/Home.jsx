import React, { useState, useEffect } from "react";
import UserCard from "../components/Card";
import { baseUrl } from "../api";

function Home() {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [count, setCount] = useState(0);

    // useEffect(() => {

    // }, [count]);

    const fetchData = async () => {
        try {
            const response = await fetch(`${baseUrl}all`);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            setUsers(data);
            setIsLoading(false);
        } catch (error) {
            setError(error.message);
            setIsLoading(false);
        }
    };

    return (
        <div className="home">
            <h1>User Information</h1>
            <button
                onClick={() => {
                    fetchData();
                }}
            >
                {" "}
                Fetch All user
            </button>
            <div className="user-list">
                {users.map((user) => (
                    <UserCard key={user.id} user={user} />
                ))}
            </div>
        </div>
    );
}

export default Home;
