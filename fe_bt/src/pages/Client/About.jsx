import React, { useState } from "react";
import Header from "../../components/header/Header";
import "../../styles/Client/About.css";
import aboutBanner from "../../assets/about_banner.jpg";
import section1 from "../../assets/1.jpg";
import section2 from "../../assets/2.jpg";
import section3 from "../../assets/3.jpg";
import team1 from "../../assets/team.png";
import team2 from "../../assets/team2.png";
import Footer from "../../components/footer/Footer";
import LoginRegisterPopup from "../../components/authorization/LoginRegisterPopup";
function About(props) {
  const images = [team1, team2];
  const [showPopup, setShowPopup] = useState(false);
  return (
    <div>
      <Header
        onLoginClick={() => setShowPopup(true)}
        onRegisterClick={() => setShowPopup(true)}
      />

      {showPopup && <LoginRegisterPopup onClose={() => setShowPopup(false)} />}
      <div
        className="about-banner"
        style={{ backgroundImage: `url(${aboutBanner})` }}
      >
        Về chúng tôi
      </div>
      <div className="about-us-container">
        <div className="section">
          <div className="text-section-about1">
            <h1 style={{ textAlign: "center" }}>Sứ mệnh</h1>
            <p style={{ textAlign: "center" }}>
              <span>ViVu Travel</span> thực hiện sứ mệnh kết nối mọi người với
              vẻ đẹp của các làng nghề truyền thống thông qua những hành trình
              được cá nhân hóa, nơi mọi người được tự do khám phá theo cách
              riêng của mình. Bằng cách tích hợp công nghệ AI,{" "}
              <span>ViVu Travel</span> biến mỗi chuyến đi thành một cuộc phiêu
              lưu độc đáo không chỉ khám phá những điểm đến mới và thúc đẩy sự
              tự khám phá mà còn góp phần bảo tồn các giá trị văn hóa đang dần
              mai một.
            </p>
          </div>
        </div>
        <div className="section">
          <div className="banner-section-about">
            <img src={section1} alt="" />
          </div>
          <div className="text-section-about">
            <h1>Tầm nhìn</h1>
            <p>
              <span>ViVu Travel</span> hướng đến mục tiêu trở thành nền tảng
              hàng đầu tại Việt Nam về trải nghiệm du lịch làng nghề văn hóa,
              nơi mỗi hành trình được cá nhân hóa cho từng du khách, giúp họ kết
              nối, trân trọng và yêu mến các giá trị truyền thống của Việt Nam.
              Trong tương lai, <span>ViVu Travel</span> mong muốn mở rộng ra
              toàn cầu, trở thành cầu nối văn hóa kết nối du khách quốc tế với
              vẻ đẹp độc đáo và sâu sắc của các làng nghề truyền thống Việt Nam.
            </p>
          </div>
        </div>
        <div className="section">
          <div className="text-section-about">
            <h1>Giá trị cốt lõi</h1>
            <p>
              <span>ViVu Travel</span> là nền tảng tiên phong khai phá du lịch
              văn hóa tại các làng nghề truyền thống Việt Nam, với sứ mệnh mang
              đến những hành trình cá nhân hóa sâu sắc nhờ sự hỗ trợ của AI.
              Chúng tôi không chỉ đồng hành cùng du khách từ lúc lên kế hoạch
              đến khi kết thúc hành trình, mà còn kết nối chặt chẽ với các đối
              tác địa phương để cùng nhau phát triển bền vững trong thời đại số.
              Mỗi chuyến đi cùng <span>ViVu Travel</span> là sự kết hợp giữa cảm
              xúc, khám phá và trách nhiệm – nơi du khách không chỉ trải nghiệm
              mà còn góp phần bảo tồn văn hóa, gìn giữ môi trường và xây dựng
              giá trị cộng đồng. Với tinh thần đổi mới, minh bạch và tận tâm,
              <span>ViVu Travel</span> cam kết trở thành người bạn đồng hành
              đáng tin cậy trên mọi nẻo đường khám phá Việt Nam.
            </p>
          </div>
          <div className="banner-section-about">
            <img src={section2} alt="" />
          </div>
        </div>
        <div className="section">
          <img className="img-special" src={section3} alt="" />
          <div className="text-section">
            <p>
              Với <span>ViVu Travel</span>, mỗi chuyến đi không chỉ là hành
              trình khám phá những điều mới mẻ tại các làng quê khắp mọi miền
              đất nước, mà còn là cơ hội để lắng nghe, cảm nhận và kết nối với
              giá trị văn hóa truyền thống. Chúng tôi mong muốn lan tỏa những
              trải nghiệm ấy đến cộng đồng, để mỗi bước chân không chỉ in dấu kỷ
              niệm mà còn góp phần gìn giữ và sẻ chia di sản quê hương.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default About;
