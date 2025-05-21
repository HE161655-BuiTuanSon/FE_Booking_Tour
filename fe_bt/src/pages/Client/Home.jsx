import React, { useEffect, useRef, useState } from "react";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import LoginRegisterPopup from "../../components/authorization/LoginRegisterPopup";
import ImageBanner from "../../components/ImageBanner";
import "../../styles/Client/Home.css";
import hoian from "../../assets/hoian.png";
import { Navigate, useNavigate } from "react-router-dom";
import tour from "../../assets/tour.png";
function Home(props) {
  const [showPopup, setShowPopup] = useState(false);
  const [showPromoPopup, setShowPromoPopup] = useState(false);
  useEffect(() => {
    if (sessionStorage.getItem("promoPopupShown")) {
      return;
    }

    let timeoutId;

    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setShowPromoPopup(true);
        sessionStorage.setItem("promoPopupShown", "true");
      }, 3000);
    };

    const handleInteraction = () => {
      resetTimer();
    };

    resetTimer();

    window.addEventListener("click", handleInteraction);
    window.addEventListener("scroll", handleInteraction);
    window.addEventListener("mousemove", handleInteraction);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("scroll", handleInteraction);
      window.removeEventListener("mousemove", handleInteraction);
    };
  }, []);
  const mockDB = {
    tours: [
      {
        id: 1,
        title: "Hanoi City Tour",
        image:
          "https://d3h1lg3ksw6i6b.cloudfront.net/media/image/2024/05/15/50acecd6ea5d4c899a2caf59e00ce64f_2-days-in-hanoi_%287%29.jpg",
        price: 990000,
        description:
          "Khám phá thủ đô Hà Nội với Hồ Hoàn Kiếm, phố cổ và những ngôi chùa lịch sử.",
        duration: "2 ngày",
        departure: "Hà Nội",
        startDate: "25/06/2025",
        transportation: "Xe du lịch",
      },
      {
        id: 2,
        title: "Ha Long Bay Cruise",
        image:
          "https://res.klook.com/images/fl_lossy.progressive,q_65/c_fill,w_1200,h_630/w_80,x_15,y_15,g_south_west,l_Klook_water_br_trans_yhcmh3/activities/qmgtdjekctlyucr8itqw/%C4%90%E1%BA%B7t%20tour%20%C4%91i%20V%E1%BB%8Bnh%20H%E1%BA%A1%20Long%20t%E1%BB%AB%20H%C3%A0%20N%E1%BB%99i.jpg",
        price: 1490000,
        description:
          "Du ngoạn vịnh Hạ Long với cảnh sắc hùng vĩ, chèo kayak và tham quan hang động.",
        duration: "3 ngày",
        departure: "Hà Nội",
        startDate: "30/06/2025",
        transportation: "Xe du lịch + Tàu",
      },
      {
        id: 3,
        title: "Sapa Trekking Adventure",
        image: "https://images.unsplash.com/photo-1521336575822-6da63fb45455",
        price: 1200000,
        description:
          "Trekking qua những thửa ruộng bậc thang và bản làng dân tộc tại Sapa.",
        duration: "4 ngày",
        departure: "Hà Nội",
        startDate: "02/07/2025",
        transportation: "Xe giường nằm",
      },
      {
        id: 4,
        title: "Hoi An Ancient Town",
        image:
          "https://cleverlearnvietnam.com/wp-content/uploads/2019/05/hoian-e1559273078151.jpg",
        price: 890000,
        description:
          "Dạo bước phố cổ Hội An rực rỡ đèn lồng và những ngôi nhà cổ kính.",
        duration: "2 ngày",
        departure: "Đà Nẵng",
        startDate: "28/06/2025",
        transportation: "Xe du lịch",
      },
    ],

    articles: [
      {
        id: 1,
        title: "Top 10 Must-Visit Places in Vietnam",
        image: "https://images.unsplash.com/photo-1504457047772-27faf1c00561",
        description:
          "Discover the best destinations in Vietnam for an unforgettable trip.",
        author: "Nguyen Van A",
        date: "2025-05-10",
      },
      {
        id: 2,
        title: "Exploring Vietnamese Street Food",
        image:
          "https://media.istockphoto.com/id/1489611687/photo/hand-holding-banh-mi-sandwich-on-street-in-hanoi.jpg?s=612x612&w=0&k=20&c=wecEZZb-UQWd9liLTFJGxjHq0COelQn5UesRpglZCFc=",
        description:
          "A guide to the vibrant street food culture, from pho to banh mi.",
        author: "Tran Thi B",
        date: "2025-05-12",
      },
      {
        id: 3,
        title: "Cultural Festivals in Hanoi",
        image:
          "https://static.vinwonders.com/production/festivals-in-hanoi-banner.jpg",
        description:
          "Experience the rich traditions of Hanoi's festivals, from Tet to Mid-Autumn.",
        author: "Le Van C",
        date: "2025-05-15",
      },
      {
        id: 4,
        title: "Hidden Gems of Central Vietnam",
        image:
          "https://vietnamnomad.com/wp-content/uploads/2022/01/Hidden-gem-in-Vietnam-Lao-Cai-Vietnamnomad.jpg",
        description:
          "Uncover lesser-known spots in Central Vietnam, from caves to beaches.",
        author: "Pham Minh D",
        date: "2025-05-08",
      },
    ],
    products: [
      {
        id: 1,
        name: "Handcrafted Silk Scarf",
        image:
          "https://static.wixstatic.com/media/9fa1f1_37d6a2684093434c93b4e3bef1cbcb9c~mv2.jpg/v1/crop/x_57,y_0,w_5003,h_3349/fill/w_560,h_374,al_c,q_80,usm_1.20_1.00_0.01,enc_avif,quality_auto/IMG_7516.jpg",
        price: 25,
        tourId: 4,
        description:
          "Elegant silk scarf handmade by Hoi An artisans, perfect for any outfit.",
      },
      {
        id: 2,
        name: "Traditional Conical Hat",
        image:
          "https://handicraftsafimex.com/wp-content/uploads/2022/12/vietnamese-conical-hats-learn-3-fascinating-facts-3090.jpg",
        price: 15,
        tourId: 1,
        description:
          "Iconic Vietnamese non la, crafted for style and sun protection.",
      },
      {
        id: 3,
        name: "Lacquerware Bowl",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQs6Vywldw5tnXJfRAN3ZDAnV2VeW9PwjI03A&s",
        price: 30,
        tourId: 4,
        description:
          "Beautifully crafted bowl with a glossy lacquer finish, ideal for decor.",
      },
      {
        id: 4,
        name: "Bamboo Water Bottle",
        image:
          "https://thegreenmartvietnam.com/wp-content/uploads/2023/03/c459c9fcafab73f52aba5-1024x1024.jpg",
        price: 20,
        tourId: 5,
        description:
          "Eco-friendly bamboo bottle, perfect for sustainable travel.",
      },
    ],
  };
  const HeroSection = () => (
    <div className="hero-section">
      <h2>Plan Your Perfect Trip</h2>
      <p>
        Explore Vietnam's breathtaking landscapes, vibrant culture, and unique
        experiences with our curated tours and products.
      </p>
    </div>
  );
  const TourCard = ({ tour }) => {
    const navigate = useNavigate();

    const handleViewDetail = () => {
      navigate(`/tours/${tour.id}`);
    };

    return (
      <div className="tour-card">
        <img src={tour.image} alt={tour.title} className="tour-image" />

        <div className="content">
          <h3>{tour.title}</h3>
          <p className="short-description">{tour.description}</p>

          <div className="meta">
            <span>🕒 {tour.duration}</span>
            <span>📍 Khởi hành: {tour.departure}</span>
            <span>🗓️ Ngày khởi hành: {tour.startDate}</span>
            <span>🚌 Phương tiện: {tour.transportation}</span>
          </div>

          <p className="price">{Number(tour.price).toLocaleString("vi-VN")}₫</p>

          <button className="view-detail-btn" onClick={handleViewDetail}>
            Xem chi tiết
          </button>
        </div>
      </div>
    );
  };
  const ArticleCard = ({ article }) => (
    <div className="article-card">
      <img src={article.image} alt={article.title} />
      <div className="content">
        <h3>{article.title}</h3>
        <div className="meta">
          <span>{article.author}</span>
          <span>{article.date}</span>
        </div>
      </div>
    </div>
  );
  const ArticlePreview = ({ article }) => (
    <div className="article-card">
      <img src={article.image} alt={article.title} />
      <div className="content">
        <h3>{article.title}</h3>
        <p>{article.description}</p>
        <div className="meta">
          <span>{article.author}</span>
          <span>{article.date}</span>
        </div>
      </div>
    </div>
  );
  const ProductCard = ({ product, tourTitle }) => (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <div className="content">
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <p>Tour: {tourTitle}</p>
        <p className="price">${product.price}</p>
      </div>
    </div>
  );
  const PromoPopup = ({ onClose }) => {
    const navigate = useNavigate();
    const popupRef = useRef(null);

    const handleBookNow = () => {
      navigate("/tours");
      onClose();
    };

    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
        sessionStorage.setItem("promoPopupShown", "true");
      }
    };

    return (
      <div className="promo-popup" onClick={handleClickOutside}>
        <div className="promo-popup-content" ref={popupRef}>
          <img src={tour} alt="Promo Tour" className="promo-image" />
          <h2>Get 10% Off Your Next Tour!</h2>
          <p>
            Book now and save on your dream Vietnam adventure. Limited offer!
          </p>
          <button onClick={handleBookNow} className="book-button">
            Book Now
          </button>
        </div>
      </div>
    );
  };
  return (
    <div>
      <Header
        onLoginClick={() => setShowPopup(true)}
        onRegisterClick={() => setShowPopup(true)}
      />

      {showPopup && <LoginRegisterPopup onClose={() => setShowPopup(false)} />}
      {showPromoPopup && (
        <PromoPopup onClose={() => setShowPromoPopup(false)} />
      )}
      <ImageBanner />
      <HeroSection />
      <div className="container">
        <div className="main-content">
          <section>
            <h2>Popular Tours</h2>
            <div className="card-grid">
              {mockDB.tours.map((tour) => (
                <TourCard key={tour.id} tour={tour} />
              ))}
            </div>
          </section>
          <section>
            <h2>Travel Stories</h2>
            <div className="card-grid">
              {mockDB.articles.map((article) => (
                <ArticlePreview key={article.id} article={article} />
              ))}
            </div>
          </section>
          <section>
            <h2>Unique Souvenirs</h2>
            <div className="card-grid">
              {mockDB.products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  tourTitle={
                    mockDB.tours.find((tour) => tour.id === product.tourId)
                      ?.title || "Unknown Tour"
                  }
                />
              ))}
            </div>
          </section>
        </div>
        <div className="sidebar">
          <h3>Top Stories</h3>
          {mockDB.articles.slice(0, 3).map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
          <div className="newsletter">
            <h3>Stay Updated</h3>
            <input type="email" placeholder="Enter your email" />
            <button>Subscribe</button>
          </div>
          <div className="social-links">
            <h3>Follow Us</h3>
            <a href="#">Facebook</a>
            <a href="#">Instagram</a>
            <a href="#">Twitter</a>
          </div>
          <div className="featured-destination">
            <h3>Featured Destination</h3>
            <img src={hoian} alt="Hoi An" />
            <p>Discover Hoi An's lantern-lit streets and timeless charm.</p>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
}

export default Home;
