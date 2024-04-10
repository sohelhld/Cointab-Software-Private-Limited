import React, { useState, useEffect } from "react";

import "./post.css"; // Import CSS file
import { useParams } from "react-router-dom";
import { baseUrl } from "../api";

function UserPosts() {
    const { userId } = useParams();
    const [posts, setPosts] = useState([]);
    const [showBulkAdd, setShowBulkAdd] = useState(true);
    const [user, setUser] = useState({});

    useEffect(() => {
        const fetchUserPosts = async () => {
            try {
                const response = await fetch(`${baseUrl}posts/${userId}`);
                // const response = await fetch(`${baseUrl}bulk-add/${userId}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                setPosts(data);
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        };
        const fetchUser = async () => {
            try {
                const response = await fetch(`${baseUrl}${userId}`);
                // const response = await fetch(`${baseUrl}bulk-add/${userId}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                setUser(data);
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        };
        fetchUser();
        fetchUserPosts();
    }, [userId]);

    const bulkAddPosts = async (userId) => {
        try {
            const response = await fetch(`${baseUrl}bulk-add/${userId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                // body: JSON.stringify(postData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            setUser(data.user);
            alert("bulk data uploaded");
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    };

    const downloadExcel = async () => {
        try {
            const response = await fetch(`${baseUrl}download/${userId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            console.log(data);

            alert("Excel file uploaded ");
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    };

    return (
        <div className="container">
            <h2 className="user-name">Title: {user?.name}</h2>
            <h2 className="user-name">Company: {user?.company?.name}</h2>
            {!user?.uploaded ? (
                <button
                    className="action-button"
                    onClick={() => bulkAddPosts(user.id)}
                >
                    Bulk Add
                </button>
            ) : (
                <button className="action-button" onClick={downloadExcel}>
                    Download In Excel
                </button>
            )}

            <h3 className="posts-heading">Posts:</h3>
            <ul className="posts-list">
                {posts.map((post) => (
                    <li key={post.id} className="post-item">
                        <h4 className="post-title">Title: {post.title}</h4>
                        <p className="post-body">Body: {post.body}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default UserPosts;
