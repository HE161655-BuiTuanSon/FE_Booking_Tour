import React, { useEffect, useState } from "react";
import {
  getAllDestination,
  createDestination,
  updateDestination,
  deleteDestination,
} from "../../services/Admin/CRUDDestination";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Alert,
  Stack,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

function ManageDestination() {
  const [destinations, setDestinations] = useState([]);
  const [formData, setFormData] = useState({ DestinationName: "" });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  if (role !== "1") {
    navigate("/");
  }
  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      const res = await getAllDestination();
      setDestinations(res.data || []);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách điểm đến:", err);
      setError("Không thể tải danh sách điểm đến.");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = formData.DestinationName.trim();
    if (!name) {
      setError("Tên điểm đến không được để trống.");
      return;
    }

    try {
      if (editingId) {
        await updateDestination(editingId, {
          destinationId: editingId,
          DestinationName: name,
        });
        setMessage("Cập nhật điểm đến thành công.");
      } else {
        await createDestination({ DestinationName: name });
        setMessage("Thêm điểm đến thành công.");
      }
      resetForm();
      await fetchDestinations();
    } catch (err) {
      console.error("Lỗi khi lưu điểm đến:", err);
      setError("Đã xảy ra lỗi khi lưu điểm đến.");
    }
  };

  const handleEdit = (item) => {
    setFormData({ DestinationName: item.destinationName });
    setEditingId(item.destinationId);
    setError("");
    setMessage("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xoá điểm đến này?")) return;
    try {
      await deleteDestination(id);
      setMessage("Xoá điểm đến thành công.");
      await fetchDestinations();
    } catch (err) {
      console.error("Lỗi khi xóa:", err);
      setError("Không thể xoá điểm đến.");
    }
  };

  const resetForm = () => {
    setFormData({ DestinationName: "" });
    setEditingId(null);
    setError("");
  };

  return (
    <Box sx={{ p: 4 }}>
      <Button variant="outlined" onClick={() => navigate("/dashboard")}>
        Quay lại
      </Button>

      <Typography align="center" variant="h3" mt={2} mb={2}>
        Quản lý điểm đến
      </Typography>

      <Stack spacing={2} mb={3}>
        {message && <Alert severity="success">{message}</Alert>}
        {error && <Alert severity="error">{error}</Alert>}
      </Stack>

      <Paper sx={{ p: 3, mb: 4 }} elevation={3}>
        <form onSubmit={handleSubmit}>
          <Stack
            spacing={2}
            direction={{ xs: "column", sm: "row" }}
            alignItems="center"
          >
            <TextField
              label="Tên điểm đến"
              name="DestinationName"
              value={formData.DestinationName}
              onChange={handleChange}
              fullWidth
              required
            />
            <Button variant="contained" type="submit" color="primary">
              {editingId ? "Cập nhật" : "Thêm mới"}
            </Button>
            {editingId && (
              <Button variant="outlined" color="inherit" onClick={resetForm}>
                Huỷ
              </Button>
            )}
          </Stack>
        </form>
      </Paper>

      {destinations.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          Chưa có điểm đến nào.
        </Typography>
      ) : (
        <List>
          {destinations.map((d) => (
            <Paper key={d.destinationId} sx={{ mb: 1 }} elevation={1}>
              <ListItem
                secondaryAction={
                  <Stack direction="row" spacing={1}>
                    <IconButton
                      edge="end"
                      onClick={() => handleEdit(d)}
                      color="primary"
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      edge="end"
                      onClick={() => handleDelete(d.destinationId)}
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  </Stack>
                }
              >
                <ListItemText primary={d.destinationName} />
              </ListItem>
            </Paper>
          ))}
        </List>
      )}
    </Box>
  );
}

export default ManageDestination;
