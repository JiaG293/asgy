import React from 'react';
import '../homeStyle/Header.scss'; // Import file SCSS


function Header() {
  return (
    <div className="chatHeader">
      <div className="headerLeft">
      <img
        src=""
        className="avatarHeader"
        alt="Avatar"
      />
        <h2 className="username">ten gnuoi dung</h2>
      </div>
      <div className="headerRight">
        <span className="icon touchOpacity">📞</span>
        <span className="icon touchOpacity">🎥</span>
        <span className="icon touchOpacity">ℹ️</span>
      </div>
    </div>
  );
}

export default Header;