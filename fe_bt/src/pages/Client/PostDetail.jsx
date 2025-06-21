import React, { useEffect, useState } from "react";
import { getPostById } from "../../services/Client/PostService";
import { useParams } from "react-router-dom";
import "../../styles/Client/PostDetail.css";
import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
import aboutBanner from "../../assets/about_banner.jpg";

function PostDetail() {
  const [post, setPost] = useState(null);
  const { postId } = useParams();

  // Hàm fixDriveUrl để xử lý URL ảnh từ Google Drive
  const fixDriveUrl = (url) => {
    if (typeof url !== "string") return url;
    if (!url.includes("drive.google.com/uc?id=")) return url;

    const parts = url.split("id=");
    const fileId = parts[1]?.split("&")[0];
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
  };

  useEffect(() => {
    const fetchPostDetail = async () => {
      try {
        const data = await getPostById(postId);
        setPost(data);
      } catch (error) {
        console.error("Lỗi khi tải bài viết:", error);
      }
    };
    fetchPostDetail();
  }, [postId]);

  if (!post) {
    return <div className="post-loading">Đang tải bài viết...</div>;
  }

  return (
      <div className="">
        <Header />
        <div
            className="about-banner"
            style={{ backgroundImage: `url(${aboutBanner})` }}
        >
          <h2 className="banner-title">{post.title}</h2>
        </div>
        <div className="post-container">
          <h1 className="post-title">{post.title}</h1>
          <div className="post-meta">
            <span className="post-author">✍ {post.authorName}</span>
            <span className="post-date">
            📅 {new Date(post.createdDate).toLocaleDateString("vi-VN")}
          </span>
          </div>

          <div className="post-divider" />

          <div className="post-sections">
            {post.sections
                .sort((a, b) => a.sectionOrder - b.sectionOrder)
                .map((section) => (
                    <div className="post-section" key={section.sectionId}>
                      <p className="post-text">{section.text}</p>
                      {section.imageUrl && (
                          <img
                              src={fixDriveUrl(section.imageUrl)} // Áp dụng fixDriveUrl
                              alt={`Hình ảnh ${section.sectionId}`}
                              className="post-image"
                              loading="lazy" // Tối ưu hóa tải ảnh
                          />
                      )}
                    </div>
                ))}
          </div>
        </div>
        <Footer />
      </div>
  );
}

export default PostDetail;