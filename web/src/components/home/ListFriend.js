import React from "react";
import "../homeStyle/ListFriend.scss"
import { PiUserListBold } from "react-icons/pi";

function ListFriend() {
    return (
        <div className="listFriends">
            <div className="header">
                <PiUserListBold className="icon" />
                <span className="text">Danh sách bạn bè</span>
            </div>
            <div className="list-card">
                
            </div>
        </div>
    )
}

export default ListFriend;