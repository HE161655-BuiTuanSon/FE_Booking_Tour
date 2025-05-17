import React from "react";
import Header from "../../components/header/Header";
import aboutBanner from "../../assets/about_banner.jpg";
import Footer from "../../components/footer/Footer";
function Tours(props) {
  return (
    <div>
      <Header></Header>
      <div
        className="about-banner"
        style={{ backgroundImage: `url(${aboutBanner})` }}
      >
        All Tours
      </div>
      <Footer></Footer>
    </div>
  );
}
export default Tours;
