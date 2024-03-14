import React from "react";
import "../homeStyle/ListFriend.scss"
import { FaUserFriends } from "react-icons/fa";

function ListGroup() {
    return (
        <div className="listGroup">
            <div className="header">
                <FaUserFriends className="icon" />
                <span className="text">Danh sách nhom</span>
            </div>
            <div className="list-card">
                
            </div>
        </div>
    )
}

export default ListGroup;