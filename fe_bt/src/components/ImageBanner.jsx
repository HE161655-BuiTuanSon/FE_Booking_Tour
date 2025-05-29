import React from "react";
import Slider from "react-slick";
import banner1 from "../assets/banner1.png";
import banner2 from "../assets/banner2.png";
import banner3 from "../assets/banner3.png";
import banner4 from "../assets/banner4.png";
import banner5 from "../assets/banner5.png";
import "./ImageBanner.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const images = [
  { src: banner1, caption: "Làng hương Quảng Phú Cầu" },
  { src: banner2, caption: "Làng nón Chuông" },
  { src: banner3, caption: "Làng cốm Mễ Trì" },
  { src: banner4, caption: "Làng nghề đan lát của người Tày ở Cao Bằng" },
  { src: banner5, caption: "Làng nghề bánh tráng Trảng Bàng – Tây Ninh" },
];

function ImageBanner() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    autoplay: true,
    autoplaySpeed: 2000,
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: true,
  };

  return (
    <div style={{ position: "relative" }}>
      <Slider {...settings}>
        {images.map((item, index) => (
          <div key={index} style={{ position: "relative" }}>
            <img
              src={item.src}
              alt={`Slide ${index}`}
              style={{ width: "100%", height: "90vh", objectFit: "cover" }}
            />
            <div
              style={{
                position: "absolute",
                top: "40%",
                left: "50%",
                transform: "translateX(-50%)",
                color: "white",
                fontSize: "50px",
                textShadow: "1px 1px 2px #ccc",
                padding: "10px 20px",
                borderRadius: "10px",
                textAlign: "center",
              }}
            >
              <h3>{item.caption}</h3>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default ImageBanner;
