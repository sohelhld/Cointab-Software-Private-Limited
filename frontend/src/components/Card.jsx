import React, { useEffect } from "react";
import "./Card.css";

import { useNavigate } from "react-router-dom";
import { baseUrl } from "../api";

const UserCard = ({ user }) => {
    const navigate = useNavigate();

    function gotoPost() {
        navigate(`/post/${user.id}`);
    }

    const addUser = async () => {
        try {
            const response = await fetch(`${baseUrl}add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(user),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error("Error adding user:", error);
        }
    };

    return (
        <div className="card">
            <div className="card-header">
                <h2>{user.name}</h2>
            </div>
            <div className="card-body">
                <p>
                    <strong>Email:</strong> {user.email}
                </p>
                <p>
                    <strong>Phone:</strong> {user.phone}
                </p>
                <p>
                    <strong>Website:</strong> {user.website}
                </p>
                <p>
                    <strong>City:</strong> {user.address.city}
                </p>
                <p>
                    <strong>Company:</strong> {user.company.name}
                </p>
            </div>
            {!user.added ? (
                <button onClick={addUser}>Add</button>
            ) : (
                <button onClick={() => gotoPost(user.id)}>Open</button>
            )}
        </div>
    );
};

export default UserCard;
