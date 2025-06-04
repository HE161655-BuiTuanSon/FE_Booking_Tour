import React, { useEffect, useState } from "react";
import Header from "../../components/header/Header";
import aboutBanner from "../../assets/about_banner.jpg";
import Footer from "../../components/footer/Footer";
import LoginRegisterPopup from "../../components/authorization/LoginRegisterPopup";
import { getAllPosts } from "../../services/Client/PostService";
import "../../styles/Client/Post.css";
import background from "../../assets/background.png";
import { useNavigate } from "react-router-dom";
function Posts() {
  const [showPopup, setShowPopup] = useState(false);
  const [articles, setArticles] = useState([]);
  const navigate = useNavigate();
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 8,
    totalArticles: 0,
    totalPages: 1,
  });

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getAllPosts(
          pagination.currentPage,
          pagination.pageSize
        );
        setArticles(data.data.articles);
        setPagination(data.data.pagination);
      } catch (error) {
        console.error("Lỗi tải bài viết:", error);
      }
    };

    fetchPosts();
  }, [pagination.currentPage]);

  const handlePageChange = (page) => {
    setPagination((prev) => ({
      ...prev,
      currentPage: page,
    }));
  };

  return (
    <div className="posts-page">
      <Header
        onLoginClick={() => setShowPopup(true)}
        onRegisterClick={() => setShowPopup(true)}
      />
      {showPopup && <LoginRegisterPopup onClose={() => setShowPopup(false)} />}

      <div
        className="about-banner"
        style={{ backgroundImage: `url(${aboutBanner})` }}
      >
        <h2>Bài viết</h2>
      </div>

      <div
        className="allposts-container"
        style={{ backgroundImage: `url(${background})` }}
      >
        {articles.length === 0 ? (
          <p className="empty-text">Không có bài viết nào.</p>
        ) : (
          articles.map((post) => (
            <div
              className="post-card"
              key={post.articleId}
              onClick={() => {
                navigate(`/posts/post-detail/${post.articleId}`);
              }}
            >
              <img
                src={post.imageUrl}
                alt={post.title}
                className="post-image"
              />
              <div className="post-info">
                <h3 className="post-title">{post.title}</h3>
                <p className="post-meta">
                  ✍️ {post.authorName} &nbsp; | &nbsp; 🕒{" "}
                  {new Date(post.createdDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))
        )}

        <div className="pagination">
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
            (page) => (
              <button
                key={page}
                className={pagination.currentPage === page ? "active" : ""}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            )
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Posts;
