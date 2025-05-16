import React from "react";
import Header from "../../components/header/Header";
import "../../styles/Client/About.css";
import aboutBanner from "../../assets/about_banner.jpg";
import background from "../../assets/background.png";
import team1 from "../../assets/team.png";
import team2 from "../../assets/team2.png";
import TeamSlider from "../../components/slider/TeamSlider";
function About(props) {
  const images = [team1, team2];
  return (
    <div>
      <Header />
      <div
        className="about-banner"
        style={{ backgroundImage: `url(${aboutBanner})` }}
      >
        Chúng tôi
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
    </div>
  );
}

export default About;
