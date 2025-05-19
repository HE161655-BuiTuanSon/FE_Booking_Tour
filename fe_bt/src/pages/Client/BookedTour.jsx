import React from "react";
import Header from "../../components/header/Header";
import aboutBanner from "../../assets/about_banner.jpg";
import Footer from "../../components/footer/Footer";
function BookedTour(props) {
  return (
    <div>
      <Header></Header>
      <div
        className="about-banner"
        style={{ backgroundImage: `url(${aboutBanner})` }}
      >
        Booked Tour
      </div>
      <Footer></Footer>
    </div>
  );
}

export default BookedTour;
