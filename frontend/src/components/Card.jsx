import React, { useEffect } from "react";
import "./Card.css";

import { useNavigate } from "react-router-dom";
import { baseUrl } from "../api";

const UserCard = ({ user, setUsers }) => {
    const navigate = useNavigate();

    function gotoPost() {
        navigate(`/post/${user?.id}`);
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
            setUsers((prev) => {
                const updatedData = { ...data.data, added: true };
                const alluers = prev.map((item) => {
                    return item.id === data.data.id ? updatedData : item;
                });
                return alluers;
            });
            alert("User added to database");
        } catch (error) {
            console.error("Error adding user:", error);
        }
    };

    return (
        <div className="card">
            <div className="card-header">
                <h2>{user?.name}</h2>
            </div>
            <div className="card-body">
                <p>
                    <strong>Email:</strong> {user?.email}
                </p>
                <p>
                    <strong>Phone:</strong> {user?.phone}
                </p>
                <p>
                    <strong>Website:</strong> {user?.website}
                </p>
                <p>
                    <strong>City:</strong> {user?.address?.city}
                </p>
                <p>
                    <strong>Company:</strong> {user?.company?.name}
                </p>
                {!user?.added ? (
                    <button className="custom-button" onClick={addUser}>
                        Add
                    </button>
                ) : (
                    <button
                        className="custom-button"
                        onClick={() => gotoPost(user?.id)}
                    >
                        Open
                    </button>
                )}
            </div>
           
        </div>
    );
};

export default UserCard;
