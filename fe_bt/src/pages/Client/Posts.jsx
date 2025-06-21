import React, { useEffect, useState } from "react";
import Header from "../../components/header/Header";
import aboutBanner from "../../assets/about_banner.jpg";
import Footer from "../../components/footer/Footer";
import LoginRegisterPopup from "../../components/authorization/LoginRegisterPopup";
import { getAllPosts } from "../../services/Client/PostService";
import background from "../../assets/background.png";
import { useNavigate } from "react-router-dom";
import {
    Grid,
    Card,
    CardMedia,
    CardContent,
    Typography,
    CardActions,
    Button,
    Box,
} from "@mui/material";

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

    // Hàm fixDriveUrl để xử lý URL ảnh từ Google Drive
    const fixDriveUrl = (url) => {
        if (typeof url !== "string") return url;
        if (!url.includes("drive.google.com/uc?id=")) return url;

        const parts = url.split("id=");
        const fileId = parts[1]?.split("&")[0];
        return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
    };

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
                style={{
                    backgroundImage: `url(${aboutBanner})`,
                    backgroundSize: "cover",
                    padding: "60px 0",
                    textAlign: "center",
                    color: "#fff",
                }}
            >
                <h2>Bài viết</h2>
            </div>

            <Box
                className="allposts-container"
                sx={{
                    backgroundImage: `url(${background})`,
                    backgroundSize: "cover",
                    backgroundAttachment: "fixed",
                    padding: 5,
                    minHeight: "100vh",
                    backdropFilter: "brightness(0.95)",
                }}
            >
                {articles.length === 0 ? (
                    <Typography variant="body1" align="center" sx={{ marginTop: 4 }}>
                        Không có bài viết nào.
                    </Typography>
                ) : (
                    <Grid container spacing={3} direction="column">
                        {articles.map((post) => (
                            <Grid item key={post.articleId}>
                                <Card
                                    sx={{
                                        display: "flex",
                                        alignItems: "stretch",
                                        borderRadius: 2,
                                        boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                                        transition: "transform 0.2s, box-shadow 0.2s",
                                        cursor: "pointer",
                                        ":hover": {
                                            transform: "translateY(-2px)",
                                            boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                                        },
                                    }}
                                    onClick={() =>
                                        navigate(`/posts/post-detail/${post.articleId}`)
                                    }
                                >
                                    <CardMedia
                                        component="img"
                                        image={fixDriveUrl(post.imageUrl)} // Áp dụng fixDriveUrl
                                        alt={post.title}
                                        sx={{ width: 400, height: "100%", objectFit: "cover" }}
                                        loading="lazy" // Tối ưu hóa tải ảnh
                                    />

                                    <CardContent
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            padding: 2,
                                            flex: 1,
                                        }}
                                    >
                                        <Typography
                                            variant="h6"
                                            sx={{ fontWeight: 600, marginBottom: 1 }}
                                        >
                                            {post.title}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{ marginBottom: 1 }}
                                        >
                                            ✍️ {post.authorName} | 🕒{" "}
                                            {new Date(post.createdDate).toLocaleDateString()}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: "#555",
                                            }}
                                        >
                                            {post.content?.slice(0, 150)}...
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}

                <Box
                    className="pagination"
                    sx={{
                        marginTop: 4,
                        display: "flex",
                        justifyContent: "center",
                        gap: 1,
                        flexWrap: "wrap",
                    }}
                >
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
                        (page) => (
                            <Button
                                key={page}
                                variant={
                                    pagination.currentPage === page ? "contained" : "outlined"
                                }
                                size="medium"
                                sx={{
                                    minWidth: 36,
                                    borderRadius: "50%",
                                    padding: "6px 0",
                                }}
                                onClick={() => handlePageChange(page)}
                            >
                                {page}
                            </Button>
                        )
                    )}
                </Box>
            </Box>

            <Footer />
        </div>
    );
}

export default Posts;