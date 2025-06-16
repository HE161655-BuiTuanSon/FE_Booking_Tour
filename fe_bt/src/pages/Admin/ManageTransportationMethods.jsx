import React, { useEffect, useState } from "react";

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
import {
  createMethodTrans,
  deleteMethodTrans,
  getAllMethodTrans,
  updateMethodTrans,
} from "../../services/Admin/CRUDTransportationMethods";

function ManageTransportationMethods() {
  const [transportations, setTransportations] = useState([]);
  const [formData, setFormData] = useState({ methodName: "" });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  if (role !== "1") {
    navigate("/");
  }

  useEffect(() => {
    fetchTransportations();
  }, []);

  const fetchTransportations = async () => {
    try {
      const res = await getAllMethodTrans();
      setTransportations(res.data || []);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách phương thức vận chuyển:", err);
      setError("Không thể tải danh sách phương thức vận chuyển.");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = formData.methodName.trim();
    if (!name) {
      setError("Tên phương thức vận chuyển không được để trống.");
      return;
    }

    try {
      if (editingId) {
        await updateMethodTrans(editingId, {
          transportationId: editingId,
          methodName: name,
        });
        setMessage("Cập nhật phương thức vận chuyển thành công.");
      } else {
        await createMethodTrans({ methodName: name });
        setMessage("Thêm phương thức vận chuyển thành công.");
      }
      resetForm();
      await fetchTransportations();
    } catch (err) {
      console.error("Lỗi khi lưu phương thức vận chuyển:", err);
      setError("Đã xảy ra lỗi khi lưu phương thức vận chuyển.");
    }
  };

  const handleEdit = (item) => {
    setFormData({ methodName: item.methodName });
    setEditingId(item.transportationMethodId);
    setError("");
    setMessage("");
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm("Bạn có chắc chắn muốn xóa phương thức vận chuyển này?")
    )
      return;
    try {
      await deleteMethodTrans(id);
      setMessage("Xóa phương thức vận chuyển thành công.");
      await fetchTransportations();
    } catch (err) {
      console.error("Lỗi khi xóa:", err);
      setError("Không thể xóa phương thức vận chuyển.");
    }
  };

  const resetForm = () => {
    setFormData({ methodName: "" });
    setEditingId(null);
    setError("");
  };

  return (
    <Box sx={{ p: 4 }}>
      <Button variant="outlined" onClick={() => navigate("/dashboard")}>
        Quay lại
      </Button>

      <Typography align="center" variant="h4" mt={2} mb={2}>
        Quản lý phương thức vận chuyển
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
              name="methodName"
              value={formData.methodName}
              onChange={handleChange}
              fullWidth
              required
            />
            <Button variant="contained" type="submit" color="primary">
              {editingId ? "Cập nhật" : "Thêm mới"}
            </Button>
            {editingId && (
              <Button variant="outlined" color="inherit" onClick={resetForm}>
                Hủy
              </Button>
            )}
          </Stack>
        </form>
      </Paper>

      {transportations.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          Chưa có phương thức vận chuyển nào.
        </Typography>
      ) : (
        <List>
          {transportations.map((t) => (
            <Paper key={t.transportationMethodId} sx={{ mb: 1 }} elevation={1}>
              <ListItem
                secondaryAction={
                  <Stack direction="row" spacing={1}>
                    <IconButton
                      edge="end"
                      onClick={() => handleEdit(t)}
                      color="primary"
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      edge="end"
                      onClick={() => handleDelete(t.transportationMethodId)}
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  </Stack>
                }
              >
                <ListItemText primary={t.methodName} />
              </ListItem>
            </Paper>
          ))}
        </List>
      )}
    </Box>
  );
}

export default ManageTransportationMethods;
