import React from "react";
import "../homeStyle/SplashScreen.scss";
import MainSlider from "../../components/slider/MainSlider";

function SplashScreen() {
  return (
    <div className="splash-screen-container">
      <p className="splash-screen-title">Chào mừng đến với <b style={{color:'#3CD9B6'}}>Asgy</b> web!</p>
      <br/>
      <p className="splash-screen-subtitle">
        Khám phá những tiện ích hỗ trợ làm việc và trò chuyện {" "}
        <br />
        cùng người thân, bạn bè được tối ưu hóa trên máy tính của bạn.
      </p>
      <MainSlider></MainSlider>
    </div>
  );
}

export default SplashScreen;
