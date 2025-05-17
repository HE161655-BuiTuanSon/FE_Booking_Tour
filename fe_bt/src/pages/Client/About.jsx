import React from "react";
import Header from "../../components/header/Header";
import "../../styles/Client/About.css";
import aboutBanner from "../../assets/about_banner.jpg";
import background from "../../assets/background.png";
import team1 from "../../assets/team.png";
import team2 from "../../assets/team2.png";
import TeamSlider from "../../components/slider/TeamSlider";
import Footer from "../../components/footer/Footer";
import member1 from "../../assets/member1.png";
import member2 from "../../assets/member2.png";
import member3 from "../../assets/member3.png";
import member4 from "../../assets/member4.png";
import member5 from "../../assets/member5.png";
function About(props) {
  const images = [team1, team2];
  return (
    <div>
      <Header />
      <div
        className="about-banner"
        style={{ backgroundImage: `url(${aboutBanner})` }}
      >
        About Us
      </div>
      <div
        className="info-banner"
        style={{ backgroundImage: `url(${background})` }}
      >
        <div className="title-banner">BlackPink - Tinh hoa làng Kpop</div>
        <div className="des-banner">
          Xin chào các bạn!<span>BlackPink -</span> là kênh thông tin chia sẻ về
          các làng quê, các nghề truyền thống và các sản phẩm thủ công của Việt
          Nam đến với cộng đồng.
        </div>
      </div>
      <div className="info-team">
        <TeamSlider images={images} />

        <div className="des-team">
          <div className="title-info-team">Đội ngũ Black Pink</div>
          <div className="des-info-team">
            Với chúng tôi, mỗi chuyến đi là một sự trải nghiệm, là việc khám phá
            ra những điều mới mẻ ở các làng quê trên mọi miền tổ quốc. Qua đây,
            chúng tôi muốn chia sẻ lại những điều đó đến với cộng đồng. Hãy ủng
            hộ <span>BlackPink</span> nhé.
          </div>
        </div>
      </div>
      <div className="team-members">
        <div className="member-card">
          <img src={member1} alt="Jisoo" />
          <p>Jisoo</p>
          <div className="position">Trưởng nhóm</div>
        </div>
        <div className="member-card">
          <img src={member2} alt="Jennie" />
          <p>Jennie</p>
          <div className="position">Rapper chính</div>
        </div>
        <div className="member-card">
          <img src={member4} alt="Rosé" />
          <p>Rosé</p>
          <div className="position">Giọng ca chính</div>
        </div>
        <div className="member-card">
          <img src={member3} alt="Lisa" />
          <p>Lisa</p>
          <div className="position">Nhảy chính</div>
        </div>
        <div className="member-card">
          <img src={member5} alt="You" />
          <p>Bạn🌸</p>
          <div className="position">Thành viên đặc biệt</div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default About;
