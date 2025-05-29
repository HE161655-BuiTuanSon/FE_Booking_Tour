import React, { useEffect, useState } from "react";
import Header from "../../components/header/Header";
import aboutBanner from "../../assets/about_banner.jpg";
import Footer from "../../components/footer/Footer";
import LoginRegisterPopup from "../../components/authorization/LoginRegisterPopup";
import { getAllProduct } from "../../services/Client/ProductService";
import "../../styles/Client/Shop.css";
import { useNavigate } from "react-router-dom";
function Shop(props) {
  const [showPopup, setShowPopup] = useState(false);
  const [souvenirs, setSouvenirs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  useEffect(() => {
    fetchSouvenirs(currentPage);
  }, [currentPage]);

  const fetchSouvenirs = async (page) => {
    try {
      const result = await getAllProduct(page, pageSize);
      console.log(result.data.souvenirs);
      setSouvenirs(result.data.souvenirs);
      setTotalPages(result.data.pagination.totalPages);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách souvenirs:", error);
    }
  };
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };
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
        <h2 className="banner-title">Đồ lưu niệm</h2>
      </div>
      <div className="souvenir-container">
        {souvenirs.map((item) => (
          <div
            key={item.souvenirId}
            className="souvenir-card"
            onClick={() => {
              navigate(`/shop/${item.souvenirId}`);
            }}
          >
            <img src={item.imageUrl} alt={item.name} />
            <h3>{item.name}</h3>
            <p>
              <strong>Tour:</strong> {item.tourName}
            </p>
            <p>
              <strong>Giá:</strong> {item.price.toLocaleString()}đ
            </p>
          </div>
        ))}
      </div>

      <div className="pagination">
        {[...Array(totalPages)].map((_, index) => {
          const pageNum = index + 1;
          return (
            <button
              key={pageNum}
              onClick={() => handlePageChange(pageNum)}
              className={currentPage === pageNum ? "active-page" : ""}
            >
              {pageNum}
            </button>
          );
        })}
      </div>

      <Footer></Footer>
    </div>
  );
}

export default Shop;
