import React, { useState } from "react";
import "./RegionTabs.css";
import { useNavigate } from "react-router-dom";

const data = {
  "Miền Bắc": [
    { name: "Bắc Ninh", image: "https://i2.ex-cdn.com/crystalbay.com/files/content/2024/06/11/du-lich-bac-ninh-2-0937.jpeg", big: true },
    { name: "Nam Định", image: "https://cdn.tgdd.vn/Files/2021/06/22/1362268/tong-hop-10-dia-diem-du-lich-nam-dinh-dep-noi-tieng-nhat-202306061513377693.jpg" },
    { name: "Lào Cai", image: "https://cdn.tgdd.vn/Files/2021/07/03/1365444/kham-pha-13-dia-diem-du-lich-lao-cai-dep-noi-tieng-202303281656546137.jpg" ,wide: true},
    { name: "Ninh Bình", image: "https://sakos.vn/wp-content/uploads/2023/10/THUMB-SAKOS-6.jpg" },
    { name: "Yên Bái", image: "https://dulichviet.com.vn/images/bandidau/top-18-dia-diem-du-lich-yen-bai-tuyet-dep-nhat-dinh-phai-trai-nghiem.jpg" },
    { name: "Sơn La", image: "https://ik.imagekit.io/tvlk/blog/2022/02/dia-diem-du-lich-son-la-1.jpg?tr=q-70,c-at_max,w-500,h-300,dpr-2" },
    { name: "Cao Bằng", image: "https://tuyengiaocaobang.vn/uploads/photos/images/2022/07/phong-canh-cao-bang/cb4.jpg" },
    { name: "Hải Phòng", image: "https://vipsedan.vn/media/data/tin-tuc/2019/T3/bi-quyet-du-lich-tu-tuc-hai-phong.jpg" },
    { name: "Hà Nội", image: "https://cellphones.com.vn/sforum/wp-content/uploads/2024/01/dia-diem-du-lich-o-ha-noi-1.jpg" },
  ],
  "Miền Trung": [
    { name: "Đà Nẵng", image: "https://datviettour.com.vn/uploads/images/tin-tuc-SEO/mien-trung/Da-Nang/danh-thang/ba-na-hills.jpg", big: true },
    { name: "Huế", image: "https://static.vinwonders.com/production/danh-lam-thang-canh-hue-17.jpg" },
    { name: "Quảng Nam", image: "https://intour.vn/upload/img/0f70a9710eb8c8bd31bb847ec81b5dd0/2022/03/14/cac_dia_diem_du_lich_noi_tieng_o_quang_nam_thu_hut_khach_du_lich_quanh_nam_1647252610.jpg", wide: true },
    { name: "Quảng Ngãi", image: "https://cdn.vntrip.vn/cam-nang/wp-content/uploads/2017/11/ly-son-1-e1509706803776.jpg" },
    { name: "Ninh Thuận", image: "https://cdn-media.sforum.vn/storage/app/media/ctvseo_MH/%E1%BA%A3nh%20%C4%91%E1%BA%B9p%20ninh%20thu%E1%BA%ADn/anh-dep-ninh-thuan-1.jpg" },
      { name: "Khánh Hòa", image: "https://cdn.tgdd.vn/Files/2022/02/20/1416377/10-dia-diem-du-lich-noi-tieng-nhat-tai-tinh-khanh-hoa-202309261520584239.jpg" },
      { name: "Bình Định", image: "https://static.vinwonders.com/production/danh-lam-thang-canh-binh-dinh-banner.jpeg" },
      { name: "Quảng Bình", image: "https://vj-prod-website-cms.s3.ap-southeast-1.amazonaws.com/-1680236673843." },
      { name: "Quảng Trị", image: "https://mia.vn/media/uploads/blog-du-lich/du-lich-quang-tr%E1%BB%8B-10-1693561009.jpg" },
  ],
  "Miền Nam": [
    { name: "Bình Dương", image: "https://ik.imagekit.io/tvlk/blog/2022/02/dia-diem-du-lich-binh-duong-cover-1.jpg?tr=q-70,c-at_max,w-500,h-250,dpr-2", big: true  },
    { name: "TP.HCM", image: "https://images.hcmcpv.org.vn//Uploads/Image/020920187E072274/02-09-2018Psuanh_01.jpg",},
    { name: "Đồng Nai", image: "https://cdn.vntrip.vn/cam-nang/wp-content/uploads/2017/10/da-ba-chong-dong-nai-1.jpg", wide: true },
    { name: "Bà Rịa - Vũng Tàu", image: "https://www.bonboncar.vn/blog/content/images/2025/05/A-nh-chu-p-Ma-n-hi-nh-2025-05-15-lu-c-12.29.55.png" },
    { name: "Cần Thơ", image: "https://ik.imagekit.io/tvlk/blog/2021/11/dia-diem-du-lich-can-tho-cover.jpg?tr=q-70,c-at_max,w-500,h-250,dpr-2" },
  { name: "Long An", image: "https://cdn.tgdd.vn/Files/2021/06/23/1362552/22-dia-diem-du-lich-long-an-noi-tieng-ma-ban-nhat-dinh-phai-den-202203241648132248.jpg" },
  { name: "Tiền Giang", image: "https://dulichviet.com.vn/images/bandidau/kham-pha-top-5-canh-dep-o-tien-giang-thu-hut-khach-du-lich-nhat.jpg" },
  { name: "Bến Tre", image: "https://www.homepaylater.vn/static/e291c03b24933b940664f33d2ba0e4f8/67090/cac_khu_du_lich_ben_tre_mang_ve_dep_cua_xu_so_miet_vuon_thanh_binh_tho_mong_7dec6b34ee.webp" },
  { name: "An Giang", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzBHxTnpwAc3V5p6zt-JIi6oTNnvhDzqqhpQ&s" }
  ],
};

const RegionTabs = () => {
  const [selectedRegion, setSelectedRegion] = useState("Miền Bắc");
      const navigate = useNavigate();
  return (
    <div className="tabs-wrapper">
      <div className="tabs">
        {Object.keys(data).map((region) => (
          <button
            key={region}
            onClick={() => setSelectedRegion(region)}
            className={`tab ${selectedRegion === region ? "active" : ""}`}
          >
            {region}
          </button>
        ))}
      </div>

      <div className="region-grid">
        {data[selectedRegion].map((place, index) => (
          <div
            key={index}
              className={`place-card ${place.big ? 'big-card' : ''} ${place.wide ? 'wide-card' : ''}`}
            style={{ backgroundImage: `url(${place.image})` }}
          >
            <div className="place-title">{place.name}</div>
            <div className="overlay-content">
              <button onClick={() => navigate(`/tours?destination=${encodeURIComponent(place.name)}`)}>Khám phá</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RegionTabs;
