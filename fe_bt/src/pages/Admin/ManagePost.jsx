import React, { useEffect, useState } from "react";
import {
  createPost,
  updatePost,
  deletePost,
  getAllPost,
  getPostById,
} from "../../services/Admin/CRUDPostService";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Pagination,
  Paper,
  Typography,
  Stack,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

function ManagePost() {
  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    pageSize: 10,
  });
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const userId = localStorage.getItem("userId");
  const [formData, setFormData] = useState({
    Title: "",
    AuthorId: userId,
    Image: null,
    ExistingImageUrl: "", // Lưu URL ảnh hiện tại
    Sections: [],
  });
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  if (role !== "1") {
    navigate("/");
  }

  // Hàm fixDriveUrl để xử lý URL ảnh từ Google Drive
  const fixDriveUrl = (url) => {
    if (typeof url !== "string" || !url.trim())
      return "/assets/placeholder.jpg"; // Cập nhật đường dẫn ảnh mặc định
    if (!url.includes("drive.google.com/uc?id=")) return url;

    const parts = url.split("id=");
    const fileId = parts[1]?.split("&")[0];
    if (!fileId) return "/assets/placeholder.jpg";
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w200`;
  };

  useEffect(() => {
    fetchPosts(pagination.currentPage);
  }, [pagination.currentPage]);
  const fetchPosts = async (page) => {
    setLoading(true);
    try {
      const data = await getAllPost(page, pagination.pageSize);
      setPosts(data.articles);
      setPagination(data.pagination);
    } catch (error) {
      setError(error.message || "Lỗi khi tải bài viết");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSectionChange = (index, field, value) => {
    const updatedSections = [...formData.Sections];
    updatedSections[index][field] =
      field === "Image" ? value.target.files[0] : value;
    setFormData((prev) => ({ ...prev, Sections: updatedSections }));
  };

  const handleAddSection = () => {
    setFormData((prev) => ({
      ...prev,
      Sections: [
        ...prev.Sections,
        { Text: "", Image: null, ExistingImageUrl: "" },
      ],
    }));
  };

  const handleRemoveSection = (index) => {
    const updatedSections = [...formData.Sections];
    updatedSections.splice(index, 1);
    setFormData((prev) => ({ ...prev, Sections: updatedSections }));
  };

  const handleSubmit = async () => {
    if (!formData.Title || !formData.Sections.length) {
      setError("Tiêu đề và ít nhất một section là bắt buộc.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("Title", formData.Title);
      form.append("AuthorId", formData.AuthorId);
      if (formData.Image) {
        form.append("Image", formData.Image);
      } else if (formData.ExistingImageUrl && editId) {
        form.append("ExistingImageUrl", formData.ExistingImageUrl); // Gửi URL ảnh hiện tại nếu không thay đổi
      }

      const sectionsData = formData.Sections.map((section, idx) => ({
        Text: section.Text,
        Image: section.Image ? `section_image_${idx}` : null,
        ExistingImageUrl: section.ExistingImageUrl || null, // Gửi URL ảnh section hiện tại
      }));
      form.append("Sections", JSON.stringify(sectionsData));

      formData.Sections.forEach((section, idx) => {
        if (section.Image) {
          form.append(`section_image_${idx}`, section.Image);
        }
      });

      console.log("📦 FormData sent:");
      for (let [key, value] of form.entries()) {
        console.log(`${key}:`, value instanceof File ? value.name : value);
      }

      if (editId) {
        await updatePost(editId, form);
      } else {
        await createPost(form);
      }

      fetchPosts(pagination.currentPage);
      handleClose();
    } catch (error) {
      console.error("Lỗi khi submit:", error);
      setError(error.message || "Không thể lưu bài viết");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (post) => {
    setLoading(true);
    try {
      const postData = await getPostById(post.articleId);
      setFormData({
        Title: postData.title,
        AuthorId: userId,
        Image: null,
        ExistingImageUrl: postData.imageUrl || "", // Lưu URL ảnh chính hiện tại
        Sections: postData.sections.map((section) => ({
          Text: section.text,
          Image: null,
          ExistingImageUrl: section.imageUrl || "", // Lưu URL ảnh section hiện tại
        })),
      });
      setEditId(post.articleId);
      setOpen(true);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu chỉnh sửa:", error);
      setError(error.message || "Lỗi khi tải dữ liệu bài viết");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await deletePost(id);
      fetchPosts(pagination.currentPage);
    } catch (error) {
      console.error("Lỗi khi xóa:", error);
      setError(error.message || "Lỗi khi xóa bài viết");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setEditId(null);
    setFormData({
      Title: "",
      AuthorId: userId,
      Image: null,
      ExistingImageUrl: "",
      Sections: [],
    });
  };

  const handlePageChange = (event, value) => {
    setPagination((prev) => ({
      ...prev,
      currentPage: value,
    }));
  };

  return (
    <div style={{ padding: 20 }}>
      <Button variant="outlined" onClick={() => navigate("/dashboard")}>
        Quay lại
      </Button>
      <Typography align="center" variant="h4" gutterBottom fontWeight="bold">
        📄 Quản lý bài viết
      </Typography>
      {error && (
        <Alert severity="error" sx={{ marginBottom: 2 }}>
          {error}
        </Alert>
      )}
      {loading && (
        <CircularProgress sx={{ display: "block", margin: "20px auto" }} />
      )}
      <Button
        variant="contained"
        onClick={() => setOpen(true)}
        disabled={loading}
      >
        ➕ Thêm bài viết
      </Button>
      <Paper elevation={3} sx={{ marginTop: 3, padding: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Ảnh
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Tiêu đề</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Tác giả</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Ngày tạo</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Hành động
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {posts.map((post) => (
              <TableRow key={post.articleId} hover>
                <TableCell align="center">
                  {post.imageUrl ? (
                    <a
                      href={
                        post.imageUrl.startsWith("http")
                          ? fixDriveUrl(post.imageUrl)
                          : `${process.env.REACT_APP_API_URL}${post.imageUrl}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={
                          post.imageUrl.startsWith("http")
                            ? fixDriveUrl(post.imageUrl)
                            : `${process.env.REACT_APP_API_URL}${post.imageUrl}`
                        }
                        alt="ảnh"
                        style={{
                          width: 120,
                          height: 80,
                          objectFit: "cover",
                          borderRadius: 6,
                          border: "2px solid #eee",
                          transition: "border 0.3s",
                        }}
                        onMouseOver={(e) =>
                          (e.currentTarget.style.borderColor = "#1976d2")
                        }
                        onMouseOut={(e) =>
                          (e.currentTarget.style.borderColor = "#eee")
                        }
                        loading="lazy"
                        onError={(e) => {
                          e.target.src = "/assets/placeholder.jpg";
                        }}
                      />
                    </a>
                  ) : (
                    <img
                      src="/assets/placeholder.jpg"
                      alt="No image"
                      style={{
                        width: 120,
                        height: 80,
                        objectFit: "cover",
                        borderRadius: 6,
                        border: "2px solid #eee",
                        transition: "border 0.3s",
                      }}
                      loading="lazy"
                    />
                  )}
                </TableCell>
                <TableCell>{post.title}</TableCell>
                <TableCell>{post.authorName}</TableCell>
                <TableCell>
                  {new Date(post.createdDate).toLocaleString("vi-VN")}
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    onClick={() => handleEdit(post)}
                    color="primary"
                    disabled={loading}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(post.articleId)}
                    color="error"
                    disabled={loading}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Pagination
          count={pagination.totalPages}
          page={pagination.currentPage}
          onChange={handlePageChange}
          sx={{ marginTop: 2 }}
          color="primary"
          disabled={loading}
        />
      </Paper>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: "bold" }}>
          {editId ? "✏️ Cập nhật bài viết" : "📝 Thêm bài viết mới"}
        </DialogTitle>
        <DialogContent dividers>
          <TextField
            fullWidth
            margin="normal"
            label="Tiêu đề bài đăng"
            name="Title"
            value={formData.Title || ""}
            onChange={handleChange}
            disabled={loading}
            required
            error={!!error && !formData.Title}
            helperText={error && !formData.Title ? "Tiêu đề là bắt buộc" : ""}
          />
          <Typography variant="body2" sx={{ marginTop: 2 }}>
            Ảnh chính thức
          </Typography>
          <input
            type="file"
            name="Image"
            accept="image/*"
            onChange={handleChange}
            style={{ margin: "16px 0" }}
            disabled={loading}
          />
          {(formData.Image || formData.ExistingImageUrl) && (
            <img
              src={
                formData.Image
                  ? URL.createObjectURL(formData.Image)
                  : fixDriveUrl(formData.ExistingImageUrl)
              }
              alt="Preview"
              style={{
                maxWidth: 200,
                height: 80,
                objectFit: "cover",
                marginTop: 8,
              }}
              loading="lazy"
              onError={(e) => {
                e.target.src = "/assets/placeholder.jpg";
              }}
            />
          )}
          <Stack spacing={2} sx={{ marginTop: 2 }}>
            <Typography sx variant={{ fontWeight: "bold" }}>
              Các mục tiêu bài đăng
            </Typography>
            {formData.Sections?.map((section, index) => (
              <Paper
                key={index}
                variant="outlined"
                sx={{ padding: 2, borderStyle: "dashed" }}
              >
                <TextField
                  fullWidth
                  label={`Mục ${index + 1} - Nội dung văn bản`}
                  value={section.Text || section.Text || ""}
                  onChange={(e) =>
                    handleSectionChange(index, "Text", e.target.value)
                  }
                  multiline
                  rows={5}
                  disabled={loading}
                  error={!!error && !section.Text}
                  helperText={
                    error && !section.Text ? "Nội dung mục là bắt buộc" : ""
                  }
                />
                <Typography variant="caption">Ảnh của mục</Typography>
                <input
                  type="file"
                  accept="image"
                  onChange={(e) => handleSectionChange(index, "Image", e)}
                  style={{ marginTop: 8 }}
                  disabled={loading}
                />
                {(section.Image || section.ExistingImageUrl) && (
                  <img
                    src={
                      section.Image
                        ? URL.createObjectURL(section.Image)
                        : fixDriveUrl(section.ExistingImageUrl)
                    }
                    alt={`Section ${index + 1} Preview`}
                    style={{
                      maxWidth: 200,
                      height: 80,
                      objectFit: "cover",
                      marginTop: 8,
                    }}
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = "/assets/placeholder.jpg";
                    }}
                  />
                )}
                <Button
                  color="error"
                  variant="text"
                  onClick={() => handleRemoveSection(index)}
                  disabled={loading}
                  sx={{ marginTop: 1 }}
                >
                  Xóa mục tiêu
                </Button>
              </Paper>
            ))}
          </Stack>
          <Button
            variant="outlined"
            onClick={handleAddSection}
            sx={{ marginTop: 2 }}
            disabled={loading}
          >
            ➕ Thêm mục mới
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            color="primary"
            disabled={loading}
          >
            {editId ? "Cập nhật" : "Thêm"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ManagePost;
