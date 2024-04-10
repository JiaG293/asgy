import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./MainSlider.css"; // Import file CSS tùy chỉnh

export default function MainSlider() {
  var settings = {
    dots: true,
    infinite: true,
    speed: 2000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplaySpeed: 7000,
    autoplay: true,
  };

  return (
    <div className="slider-container">
      <Slider {...settings}>
        <div className="slide">
          <img
            src={require("../../img/iconRMBG.png")}
            style={{ width: "300px", height: "300px" }}
            className="slide-animation1"
          />
          <p className="slide-detail-title">Nhắn tin trở nên thú vị hơn</p>
        </div>
        <div className="slide">
          <img
            src={require("../../img/animation.gif")}
            style={{ width: "300px", height: "300px" }}
            className="slide-animation2"
          />
          <p className="slide-detail-title">Tin nhắn được gửi tốc độ bàn thờ</p>
        </div>
        <div className="slide">
          <img
            src={require("../../img/amu.gif")}
            style={{ width: "300px", height: "300px" }}
          />
          <p className="slide-detail-title">Trò chuyện nhóm với mọi người </p>
        </div>
        <div className="slide">
          <img
            src={require("../../img/pepe.gif")}
            style={{ width: "350px", height: "300px" }}
          />
          <p className="slide-detail-title">Trải nghiệm xuyên suốt </p>
        </div>
      </Slider>
    </div>
  );
}
