import React from 'react';
import '../homeStyle/Header.scss'; // Import file SCSS
import { IoIosCall } from "react-icons/io";
import { FcVideoCall } from "react-icons/fc";


function Header() {
  return (
    <div className="chat-Header">
      <div className="header-Left">
      <img
        src=""
        className="avatar-Header"
        alt="Avatar"
      />
        <h2 className="user-Name">ten gnuoi dung</h2>
      </div>
      <div className="header-Right">
        <IoIosCall className='item'></IoIosCall>
        <FcVideoCall className='item'></FcVideoCall>
      </div>
    </div>
  );
}

export default Header;