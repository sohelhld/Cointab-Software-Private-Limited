import React, { useState, useEffect } from "react";

import "./post.css"; // Import CSS file
import { baseUrl } from "../api";

function UserPosts() {
    const [userId, setUserId] = useState(1);
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
                const response = await fetch(
                    `https://jsonplaceholder.typicode.com/users/${userId}`
                );
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

    const bulkAddPosts = async () => {
        try {
            const response = await fetch(`${baseUrl}bulk-add/${userId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setPosts(data);
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    };

    const downloadExcel = () => {};

    return (
        <div className="container">
            <h2 className="user-name">Title: {user?.name}</h2>
            <h2 className="user-name">Company: {user?.company.name}</h2>
            <button
                className="action-button"
                onClick={bulkAddPosts}
                style={{ display: showBulkAdd ? "block" : "none" }}
            >
                Bulk Add
            </button>
            <button
                className="action-button"
                onClick={downloadExcel}
                style={{ display: showBulkAdd ? "none" : "block" }}
            >
                Download In Excel
            </button>

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
