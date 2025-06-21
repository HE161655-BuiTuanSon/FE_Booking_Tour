import React, { useEffect, useState } from "react";
import Header from "../../components/header/Header";
import LoginRegisterPopup from "../../components/authorization/LoginRegisterPopup";
import aboutBanner from "../../assets/about_banner.jpg";
import { getProductById } from "../../services/Client/ProductService";
import { useParams } from "react-router-dom";
import "../../styles/Client/ProductDetail.css";
import Footer from "../../components/footer/Footer";

function ProductDetail() {
    const [showPopup, setShowPopup] = useState(false);
    const [product, setProduct] = useState(null);
    const { productId } = useParams();

    // Hàm fixDriveUrl để xử lý URL ảnh từ Google Drive
    const fixDriveUrl = (url) => {
        if (typeof url !== "string") return url;
        if (!url.includes("drive.google.com/uc?id=")) return url;

        const parts = url.split("id=");
        const fileId = parts[1]?.split("&")[0];
        return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
    };

    useEffect(() => {
        const fetchDataProduct = async () => {
            try {
                const res = await getProductById(productId);
                setProduct(res);
            } catch (err) {
                console.error("Lỗi khi lấy sản phẩm:", err);
            }
        };

        fetchDataProduct();
    }, [productId]);

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
                <h2>{product?.name || "Đang tải..."}</h2>
            </div>

            {product && (
                <div className="product-detail">
                    <div className="product-detail-main">
                        <div className="image-section">
                            <img
                                src={fixDriveUrl(product.imageUrl)} // Áp dụng fixDriveUrl
                                alt={product.name}
                            />
                        </div>
                        <div className="info-section">
                            <h1>{product.name}</h1>
                            <div className="sub-info-product">
                                <p>
                                    <strong>Thuộc tour:</strong> {product.tourName}
                                </p>
                                <p>
                                    <strong>Product ID:</strong> {product.souvenirId}
                                </p>
                                <p>
                                    <strong>Tour ID:</strong> {product.tourId}
                                </p>
                            </div>

                            <p>
                                <strong style={{ fontSize: "30px" }}>Giá:</strong>{" "}
                                <span className="highlight-price">
                  {product.price.toLocaleString()}đ
                </span>
                            </p>
                        </div>
                    </div>
                    <div className="description-section">
                        <h3>Mô tả chi tiết</h3>
                        <p>{product.description}</p>
                    </div>
                </div>
            )}
            <Footer />
        </div>
    );
}

export default ProductDetail;