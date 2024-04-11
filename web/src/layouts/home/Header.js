import React, { useState, useEffect, useLayoutEffect } from "react";
import "../homeStyle/Header.scss";
import { CiSearch as SearchIcon } from "react-icons/ci";
import { BiPhoneCall as CallIcon } from "react-icons/bi";
import { LuVideo as VideoIcon } from "react-icons/lu";
import { CiBookmark as MarkIcon } from "react-icons/ci";
import { useSelector } from "react-redux";

function Header() {
  const [othertUser, setOtherUser] = useState(null);
  const profile = useSelector((state) => state.profile);
  const profileID = profile?._id;
  const currentChannel = useSelector((state) => state.currentChannel);

  useLayoutEffect(() => {
    if (currentChannel && currentChannel.members) {
      const otherUser = currentChannel.members.find(
        (member) => member.profileId?._id !== profileID
      )?.profileId;
      setOtherUser(otherUser);
    }
  }, [currentChannel, profileID]);

  return (
    <div className="header-container">
      <div className="header-left">
        {othertUser ? (
          <>
            <img src={othertUser.avatar} alt="avatar" className="header-avatar" />
            <div>
              <h2 className="header-name">{othertUser.fullName}</h2>
              <MarkIcon className="header-mark" />
            </div>
          </>
        ) : (
          <div>Loading...</div>
        )}
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
