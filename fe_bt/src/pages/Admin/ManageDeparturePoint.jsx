import React, { useEffect, useState } from "react";
import {
  getAllDeparturePoint,
  deleteDesparturePoint,
  createDesparturePoint,
  updateDesparturePoint,
} from "../../services/Admin/CRUDDeparturePoint";

import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  Stack,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

function ManageDeparturePoint() {
  const [points, setPoints] = useState([]);
  const [formData, setFormData] = useState({ DeparturePointName: "" });
  const [editingId, setEditingId] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchDeparturePoints();
  }, []);

  const fetchDeparturePoints = async () => {
    try {
      const data = await getAllDeparturePoint();
      setPoints(data.data || data);
      setErrorMsg("");
    } catch (error) {
      console.error("Lỗi khi lấy danh sách điểm xuất phát:", error);
      setErrorMsg("Lỗi khi lấy danh sách điểm xuất phát");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateDesparturePoint(editingId, {
          ...formData,
          departurePointId: editingId,
        });
      } else {
        await createDesparturePoint(formData);
      }
      setFormData({ DeparturePointName: "" });
      setEditingId(null);
      await fetchDeparturePoints();
    } catch (error) {
      console.error("Lỗi khi lưu điểm xuất phát:", error);
      setErrorMsg("Lỗi khi lưu điểm xuất phát");
    }
  };

  const handleEdit = (point) => {
    setFormData({ DeparturePointName: point.departurePointName });
    setEditingId(point.departurePointId);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xoá điểm xuất phát này?"))
      return;
    try {
      await deleteDesparturePoint(id);
      await fetchDeparturePoints();
    } catch (error) {
      console.error("Lỗi khi xóa điểm xuất phát:", error);
      const message =
        error.response?.data?.message ||
        "Lỗi khi xóa điểm xuất phát. Vui lòng thử lại.";
      setErrorMsg(message);
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
        Quản lý điểm xuất phát
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
              label="Tên điểm xuất phát"
              name="DeparturePointName"
              value={formData.DeparturePointName}
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
                  setFormData({ DeparturePointName: "" });
                }}
              >
                Huỷ
              </Button>
            )}
          </Stack>
        </form>
      </Paper>

      {points.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          Chưa có điểm xuất phát nào.
        </Typography>
      ) : (
        <List>
          {points.map((p) => (
            <Paper key={p.departurePointId} sx={{ mb: 1 }} elevation={1}>
              <ListItem
                secondaryAction={
                  <Stack direction="row" spacing={1}>
                    <IconButton
                      edge="end"
                      onClick={() => handleEdit(p)}
                      color="primary"
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      edge="end"
                      onClick={() => handleDelete(p.departurePointId)}
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  </Stack>
                }
              >
                <ListItemText primary={p.departurePointName} />
              </ListItem>
            </Paper>
          ))}
        </List>
      )}
    </Box>
  );
}

export default ManageDeparturePoint;
