import React, { useEffect, useState } from "react";
import Header from "../../components/header/Header";
import aboutBanner from "../../assets/about_banner.jpg";
import Footer from "../../components/footer/Footer";
import LoginRegisterPopup from "../../components/authorization/LoginRegisterPopup";
import { getAllProduct } from "../../services/Client/ProductService";
import "../../styles/Client/Shop.css";
import { useNavigate } from "react-router-dom";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

function Shop(props) {
    const [showPopup, setShowPopup] = useState(false);
    const [souvenirs, setSouvenirs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(12);
    const [totalPages, setTotalPages] = useState(1);
    const [sortOption, setSortOption] = useState("createdatdesc");
    const navigate = useNavigate();

    // Hàm fixDriveUrl để xử lý URL ảnh từ Google Drive
    const fixDriveUrl = (url) => {
        if (typeof url !== "string") return url;
        if (!url.includes("drive.google.com/uc?id=")) return url;

        const parts = url.split("id=");
        const fileId = parts[1]?.split("&")[0];
        return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
    };

    useEffect(() => {
        fetchSouvenirs(currentPage, sortOption);
    }, [currentPage, sortOption]);

    const fetchSouvenirs = async (page, sort) => {
        try {
            const result = await getAllProduct(page, pageSize, sort);
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

    const handleSortChange = (e) => {
        setSortOption(e.target.value);
        setCurrentPage(1); // reset về trang đầu
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
                <h2>Đồ lưu niệm</h2>
            </div>
            <FormControl sx={{ minWidth: 200, margin: "20px 60px" }}>
                <InputLabel id="sort-label">Sắp xếp</InputLabel>
                <Select
                    labelId="sort-label"
                    id="sort"
                    value={sortOption}
                    label="Sắp xếp"
                    onChange={handleSortChange}
                    sx={{ borderRadius: 2 }}
                >
                    <MenuItem value="createdatdesc">Mới nhất</MenuItem>
                    <MenuItem value="createdatasc">Cũ nhất</MenuItem>
                    <MenuItem value="priceasc">Giá tăng dần</MenuItem>
                    <MenuItem value="pricedesc">Giá giảm dần</MenuItem>
                </Select>
            </FormControl>
            <div className="souvenir-container">
                {souvenirs.map((item) => (
                    <div
                        key={item.souvenirId}
                        className="souvenir-card"
                        onClick={() => {
                            navigate(`/shop/${item.souvenirId}`);
                        }}
                    >
                        <img
                            src={fixDriveUrl(item.imageUrl)} // Áp dụng fixDriveUrl
                            alt={item.name}
                            loading="lazy" // Tối ưu hóa tải ảnh
                        />
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

            <Footer />
        </div>
    );
}

export default Shop;