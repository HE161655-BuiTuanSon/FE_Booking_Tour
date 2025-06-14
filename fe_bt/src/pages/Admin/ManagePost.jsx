import React, { useEffect, useState } from "react";
import {
  createPost,
  updatePost,
  deletePost,
  getAllPost,
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
  const userId = localStorage.getItem("userId");
  const [formData, setFormData] = useState({
    Title: "",
    content: "",
    authorId: userId,
    image: null,
    sections: [],
  });

  useEffect(() => {
    fetchPosts(pagination.currentPage);
  }, [pagination.currentPage]);
  const navigate = useNavigate();

  const fetchPosts = async (page) => {
    try {
      const data = await getAllPost(page, pagination.pageSize);
      setPosts(data.articles);
      console.log(data.articles);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData((prev) => ({
        ...prev,
        image: files[0],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  const handleSectionChange = (index, field, value) => {
    const updatedSections = [...formData.sections];
    if (field === "image") {
      updatedSections[index][field] = value.target.files[0];
    } else {
      updatedSections[index][field] = value;
    }
    setFormData((prev) => ({ ...prev, sections: updatedSections }));
  };

  const handleAddSection = () => {
    setFormData((prev) => ({
      ...prev,
      sections: [...prev.sections, { text: "", image: null }],
    }));
  };

  const handleRemoveSection = (index) => {
    const updatedSections = [...formData.sections];
    updatedSections.splice(index, 1);
    setFormData((prev) => ({ ...prev, sections: updatedSections }));
  };

  const handleSubmit = async () => {
    try {
      console.log("⚙️ Form data gốc:", formData);

      const form = new FormData();
      form.append("title", formData.Title);
      form.append("content", formData.content);
      form.append("authorId", formData.authorId);
      if (formData.image) form.append("Image", formData.image);

      const sectionsData = [];
      formData.sections.forEach((section, idx) => {
        sectionsData.push({
          text: section.text,
          image: `section_image_${idx}`,
        });
        if (section.image) {
          form.append(`section_image_${idx}`, section.image);
        }
      });
      form.append("Sections", JSON.stringify(sectionsData));

      // GIAI ĐOẠN 2: In ra FormData đã đóng gói
      console.log("📦 FormData thực tế gửi:");
      for (let pair of form.entries()) {
        console.log(`${pair[0]}:`, pair[1]);
      }

      if (editId) {
        await updatePost(editId, form);
      } else {
        await createPost(form);
      }

      fetchPosts(pagination.currentPage);
      handleClose();
    } catch (error) {
      console.error("❌ Failed to save post:", error);
    }
  };

  const handleEdit = (post) => {
    setFormData({
      Title: post.title || "",
      content: "",
      authorId: "",
      image: null,
      sections: [],
    });
    setEditId(post.articleId);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await deletePost(id);
      fetchPosts(pagination.currentPage);
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setEditId(null);
    setFormData({ Title: "", content: "", imageUrl: "" });
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
      <Button variant="contained" onClick={() => setOpen(true)}>
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
                </TableCell>
                <TableCell>{post.title}</TableCell>
                <TableCell>{post.authorName}</TableCell>
                <TableCell>
                  {new Date(post.createdDate).toLocaleDateString()}
                </TableCell>
                <TableCell align="center">
                  <IconButton onClick={() => handleEdit(post)} color="primary">
                    <Edit />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(post.articleId)}
                    color="error"
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* PHÂN TRANG */}
        <Pagination
          count={pagination.totalPages}
          page={pagination.currentPage}
          onChange={handlePageChange}
          sx={{ marginTop: 2 }}
          color="primary"
        />
      </Paper>
      {/* DIALOG THÊM/SỬA */}
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
          />
          <TextField
            fullWidth
            margin="dense"
            label="Nội dung"
            name="content"
            multiline
            rows={4}
            value={formData.content}
            onChange={handleChange}
          />
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            style={{ marginTop: "16px" }}
          />
          <Stack spacing={2} sx={{ marginTop: 2 }}>
            {formData.sections.map((section, index) => (
              <Paper
                key={index}
                variant="outlined"
                sx={{ padding: 2, borderStyle: "dashed" }}
              >
                <TextField
                  fullWidth
                  label={`Section ${index + 1} - Text`}
                  value={section.text}
                  onChange={(e) =>
                    handleSectionChange(index, "text", e.target.value)
                  }
                  multiline
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleSectionChange(index, "image", e)}
                  style={{ marginTop: 8 }}
                />
                <Button
                  color="error"
                  variant="text"
                  onClick={() => handleRemoveSection(index)}
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
          >
            ➕ Thêm Section
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Hủy</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {editId ? "Cập nhật" : "Thêm"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ManagePost;
