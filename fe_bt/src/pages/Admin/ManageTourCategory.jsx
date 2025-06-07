import React, { useEffect, useState } from "react";
import {
  getAllTourCategory,
  createTourCategory,
  updateTourCategory,
  deleteTourCategory,
} from "../../services/Admin/CRUDTourCategories";

import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  Stack,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Alert,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

function ManageTourCategory() {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({ tourCategory: "" });
  const [editingId, setEditingId] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await getAllTourCategory();
      setCategories(data.data || data);
      setErrorMsg("");
    } catch (error) {
      console.error("Lỗi khi lấy danh mục tour:", error);
      setErrorMsg("Lỗi khi lấy danh mục tour");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, tourCategory: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateTourCategory(editingId, formData);
      } else {
        await createTourCategory(formData);
      }
      setFormData({ tourCategory: "" });
      setEditingId(null);
      await fetchCategories();
    } catch (error) {
      console.error("Lỗi khi lưu danh mục tour:", error);
      setErrorMsg("Lỗi khi lưu danh mục tour");
    }
  };

  const handleEdit = (category) => {
    setFormData({
      tourCategory: category.categoryName || category.tourCategory,
    });
    setEditingId(category.categoryId || category.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xoá danh mục này?")) return;
    try {
      await deleteTourCategory(id);
      await fetchCategories();
    } catch (error) {
      console.error("Lỗi khi xóa danh mục tour:", error);
      setErrorMsg("Lỗi khi xóa danh mục tour");
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => navigate("/dashboard")}
      >
        ← Quay lại
      </Button>

      <Typography variant="h4" mt={2} mb={2}>
        Quản lý danh mục tour
      </Typography>

      {errorMsg && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMsg}
        </Alert>
      )}

      <Paper sx={{ p: 3, mb: 4 }} elevation={3}>
        <form onSubmit={handleSubmit}>
          <Stack
            spacing={2}
            direction={{ xs: "column", sm: "row" }}
            alignItems="center"
          >
            <TextField
              label="Tên danh mục"
              name="tourCategory"
              value={formData.tourCategory}
              onChange={handleChange}
              fullWidth
              required
            />
            <Button type="submit" variant="contained" color="primary">
              {editingId ? "Cập nhật" : "Thêm mới"}
            </Button>
            {editingId && (
              <Button
                variant="outlined"
                onClick={() => {
                  setEditingId(null);
                  setFormData({ tourCategory: "" });
                  setErrorMsg("");
                }}
              >
                Huỷ
              </Button>
            )}
          </Stack>
        </form>
      </Paper>

      {categories.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          Chưa có danh mục tour nào.
        </Typography>
      ) : (
        <List>
          {categories.map((cat) => (
            <Paper key={cat.categoryId || cat.id} sx={{ mb: 1 }} elevation={1}>
              <ListItem
                secondaryAction={
                  <Stack direction="row" spacing={1}>
                    <IconButton
                      edge="end"
                      onClick={() => handleEdit(cat)}
                      color="primary"
                      aria-label="edit"
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      edge="end"
                      onClick={() => handleDelete(cat.categoryId || cat.id)}
                      color="error"
                      aria-label="delete"
                    >
                      <Delete />
                    </IconButton>
                  </Stack>
                }
              >
                <ListItemText primary={cat.categoryName || cat.tourCategory} />
              </ListItem>
            </Paper>
          ))}
        </List>
      )}
    </Box>
  );
}

export default ManageTourCategory;
