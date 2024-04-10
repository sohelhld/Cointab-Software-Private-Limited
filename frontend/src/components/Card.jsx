import React from "react";

const UserCard = ({ user }) => {
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
                    <strong>City:</strong> {user?.address.city}
                </p>
                <p>
                    <strong>Company:</strong> {user?.company.name}
                </p>
            </div>
        </div>
    );
};

export default UserCard;
