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
    Sections: [],
  });
  const navigate = useNavigate();

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
      setError(error);
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
    updatedSections[index][field] = field === "Image" ? value.target.files[0] : value;
    setFormData((prev) => ({ ...prev, Sections: updatedSections }));
  };

  const handleAddSection = () => {
    setFormData((prev) => ({
      ...prev,
      Sections: [...prev.Sections, { Text: "", Image: null }],
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
      if (formData.Image) form.append("Image", formData.Image);

      const sectionsData = formData.Sections.map((section, idx) => ({
        Text: section.Text,
        Image: section.Image ? `section_image_${idx}` : null,
      }));
      form.append("Sections", JSON.stringify(sectionsData));

      formData.Sections.forEach((section, idx) => {
        if (section.Image) {
          form.append(`section_image_${idx}`, section.Image);
        }
      });

      if (editId) {
        await updatePost(editId, form);
      } else {
        await createPost(form);
      }

      fetchPosts(pagination.currentPage);
      handleClose();
    } catch (error) {
      setError(error);
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
        Sections: postData.sections.map((section) => ({
          Text: section.text,
          Image: null,
        })),
      });
      setEditId(post.articleId);
      setOpen(true);
    } catch (error) {
      setError(error);
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
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setEditId(null);
    setFormData({ Title: "", AuthorId: userId, Image: null, Sections: [] });
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
        {loading && <CircularProgress sx={{ display: "block", margin: "20px auto" }} />}
        <Button variant="contained" onClick={() => setOpen(true)} disabled={loading}>
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
                                    ? post.imageUrl
                                    : `https://localhost:44338${post.imageUrl}`
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                          >
                            <img
                                src={
                                  post.imageUrl.startsWith("http")
                                      ? post.imageUrl
                                      : `https://localhost:44338${post.imageUrl}`
                                }
                                alt="ảnh"
                                style={{
                                  width: 120,
                                  height: 80,
                                  objectFit: "cover",
                                  borderRadius: 6,
                                  border: "2px solid #eee",
                                  transition: "0.3s",
                                }}
                                onMouseOver={(e) =>
                                    (e.currentTarget.style.border = "2px solid #1976d2")
                                }
                                onMouseOut={(e) =>
                                    (e.currentTarget.style.border = "2px solid #eee")
                                }
                            />
                          </a>
                      ) : (
                          <img
                              src="https://via.placeholder.com/120x80?text=No+Image"
                              alt="No image"
                              style={{
                                width: 120,
                                height: 80,
                                objectFit: "cover",
                                borderRadius: 6,
                                border: "2px solid #eee",
                                transition: "0.3s",
                              }}
                          />
                      )}
                    </TableCell>
                    <TableCell>{post.title}</TableCell>
                    <TableCell>{post.authorName}</TableCell>
                    <TableCell>
                      {new Date(post.createdDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton onClick={() => handleEdit(post)} color="primary" disabled={loading}>
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
                margin="dense"
                label="Tiêu đề"
                name="Title"
                value={formData.Title}
                onChange={handleChange}
                disabled={loading}
            />
            <input
                type="file"
                name="Image"
                accept="image/*"
                onChange={handleChange}
                style={{ marginTop: "16px" }}
                disabled={loading}
            />
            {formData.Image && (
                <img
                    src={URL.createObjectURL(formData.Image)}
                    alt="Preview"
                    style={{ maxWidth: 200, marginTop: 8 }}
                />
            )}
            <Stack spacing={2} sx={{ marginTop: 2 }}>
              {formData.Sections.map((section, index) => (
                  <Paper
                      key={index}
                      variant="outlined"
                      sx={{ padding: 2, borderStyle: "dashed" }}
                  >
                    <TextField
                        fullWidth
                        label={`Section ${index + 1} - Text`}
                        value={section.Text}
                        onChange={(e) =>
                            handleSectionChange(index, "Text", e.target.value)
                        }
                        multiline
                        disabled={loading}
                    />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleSectionChange(index, "Image", e)}
                        style={{ marginTop: 8 }}
                        disabled={loading}
                    />
                    {section.Image && (
                        <img
                            src={URL.createObjectURL(section.Image)}
                            alt={`Section ${index + 1} Preview`}
                            style={{ maxWidth: 200, marginTop: 8 }}
                        />
                    )}
                    <Button
                        color="error"
                        variant="text"
                        onClick={() => handleRemoveSection(index)}
                        disabled={loading}
                    >
                      Xóa Section
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
              ➕ Thêm Section
            </Button>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} disabled={loading}>
              Hủy
            </Button>
            <Button variant="contained" onClick={handleSubmit} disabled={loading}>
              {editId ? "Cập nhật" : "Thêm"}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
  );
}

export default ManagePost;