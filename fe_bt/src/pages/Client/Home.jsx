import React, { useState } from "react";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import LoginRegisterPopup from "../../components/authorization/LoginRegisterPopup";
import ImageBanner from "../../components/ImageBanner";
function Home(props) {
  const [showPopup, setShowPopup] = useState(false);
  return (
    <div>
      <Header
        onLoginClick={() => setShowPopup(true)}
        onRegisterClick={() => setShowPopup(true)}
      />

      {showPopup && <LoginRegisterPopup onClose={() => setShowPopup(false)} />}
      <ImageBanner />
      <Footer></Footer>
    </div>
  );
}

export default Home;
