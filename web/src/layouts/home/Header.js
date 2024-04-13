import React from "react";
import "../homeStyle/Header.scss";
import { CiSearch as SearchIcon } from "react-icons/ci";
import { BiPhoneCall as CallIcon } from "react-icons/bi";
import { LuVideo as VideoIcon } from "react-icons/lu";
import { CiBookmark as MarkIcon } from "react-icons/ci";
import { useSelector } from "react-redux";

function Header() {
  const currentChannel = useSelector((state) => state.currentChannel);

  return (
    <div className="header-container">
      {currentChannel ? (
        <div className="header-left">
          {currentChannel.typeChannel === 101 ? (
            <>
              <img
                src={currentChannel.icon}
                alt="avatar"
                className="header-avatar"
              />
              <div>
                <h2 className="header-name">{currentChannel.name}</h2>
                <MarkIcon className="header-mark" />
              </div>
            </>
          ) : (
            <>
              <img
                src={currentChannel.background}
                alt="avatar"
                className="header-avatar"
              />
              <div>
                <h2 className="header-name">{currentChannel.name}</h2>
                <MarkIcon className="header-mark" />
              </div>
            </>
          )}
        </div>
      ) : <>
      <h1 className="header-name">Loadding...</h1>
      </>}
      <div className="header-right">
        <SearchIcon className="header-icon" />
        <CallIcon className="header-icon" />
        <VideoIcon className="header-icon" />
      </div>
    </div>
  );
}

export default Header;
