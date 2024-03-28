import React from "react";
import "../homeStyle/Header.scss";
import { CiSearch as SearchIcon } from "react-icons/ci";
import { BiPhoneCall as CallIcon } from "react-icons/bi";
import { LuVideo as VideoIcon} from "react-icons/lu";
import { CiBookmark as MarkIcon} from "react-icons/ci";

function Header() {
  return (
    <div className="header-container">
      <div className="header-left">
        <img
          src="https://media.tenor.com/kXWb4lofzQcAAAAe/hiroi-kikuri-hiroi.png"
          alt="avatar"
          className="header-avatar"
        />
        <div>
        <h2 className="header-name">Tên người dùng</h2>
        <MarkIcon className="header-mark"/>
        </div>
      </div>
      <div className="header-right">
        <SearchIcon className="header-icon" />
        <CallIcon className="header-icon" />
        <VideoIcon className="header-icon" />

      </div>
    </div>
  );
}

export default Header;
