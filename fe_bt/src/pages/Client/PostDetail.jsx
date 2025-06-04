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
      <Header></Header>
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
                    src={section.imageUrl}
                    alt={`Hình ảnh ${section.sectionId}`}
                    className="post-image"
                  />
                )}
              </div>
            ))}
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
}

export default PostDetail;
