import React, { useEffect, useState } from "react";
import {
  getAllProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../services/Admin/CRUDProductService";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import {
  Button,
  TextField,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { getAllTour } from "../../services/Admin/CRUDTourService";

function ManageShop() {
  const [tours, setTours] = useState([]);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    tourId: "",
    name: "",
    description: "",
    price: "",
    file: null,
    currentImageUrl: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [open, setOpen] = useState(false);
  const [pageSize, setPageSize] = useState(5);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  if (role !== "1") {
    navigate("/");
  }

  useEffect(() => {
    fetchProducts();
    fetchTours();
  }, []);

  const fetchTours = async () => {
    try {
      const allTours = await fetchAllTours();
      setTours(allTours);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách tour:", error);
      setError("Không thể lấy danh sách tour.");
    }
  };

  const fetchAllTours = async () => {
    const allTours = [];
    let page = 1;
    const pageSize = 50;
    let totalPages = 1;

    do {
      const data = await getAllTour(page, pageSize);
      allTours.push(...data.tours);
      totalPages = data.totalPages;
      page++;
    } while (page <= totalPages);

    return allTours;
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await getAllProduct();
      setProducts(data.data.souvenirs);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sản phẩm:", error);
      setError("Không thể lấy danh sách sản phẩm.");
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

  const fixDriveUrl = (url) => {
    if (typeof url !== "string") return url;
    if (!url.includes("drive.google.com/uc?id=")) return url;

    const parts = url.split("id=");
    const fileId = parts[1]?.split("&")[0];
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const formPayload = new FormData();
      formPayload.append("tourId", formData.tourId);
      formPayload.append("SouvenirName", formData.name); // Sửa từ SouvenirName thành name
      formPayload.append("description", formData.description || "");
      formPayload.append("price", Number(formData.price));
      if (formData.file) {
        formPayload.append("image", formData.file);
      }

      console.log("📦 FormData sent:");
      for (let [key, value] of formPayload.entries()) {
        console.log(`${key}:`, value instanceof File ? value.name : value);
      }

      if (editingId) {
        await updateProduct(editingId, formPayload);
      } else {
        await createProduct(formPayload);
      }

      setFormData({
        tourId: "",
        name: "",
        description: "",
        price: "",
        file: null,
        currentImageUrl: "",
      });
      setEditingId(null);
      setOpen(false);
      await fetchProducts();
    } catch (error) {
      console.error("Lỗi khi lưu sản phẩm:", error.response?.data);
      setError(error.response?.data?.message || "Không thể lưu sản phẩm.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setFormData({
      tourId: product.tourId || "",
      name: product.name || "",
      price: product.price || "",
      description: product.description || "",
      file: null,
      currentImageUrl: product.imageUrl || "",
    });
    setEditingId(product.souvenirId);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await deleteProduct(id);
      await fetchProducts();
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error.response?.data);
      setError(error.response?.data?.message || "Không thể xóa sản phẩm.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setEditingId(null);
    setFormData({
      tourId: "",
      name: "",
      description: "",
      price: "",
      file: null,
      currentImageUrl: "",
    });
    setError(null);
  };

  const columns = [
    {
      field: "image",
      headerName: "Ảnh",
      width: 100,
      renderCell: (params) =>
          params.row.imageUrl ? (
              <img
                  src={fixDriveUrl(params.row.imageUrl)}
                  alt={params.row.name}
                  style={{ width: 60, height: 60, objectFit: "cover" }}
              />
          ) : (
              "Không có ảnh"
          ),
    },
    { field: "name", headerName: "Tên sản phẩm", width: 200 },
    { field: "price", headerName: "Giá", width: 100 },
    { field: "description", headerName: "Mô tả", width: 250 },
    {
      field: "actions",
      headerName: "Thao tác",
      type: "actions",
      width: 100,
      getActions: (params) => [
        <GridActionsCellItem
            icon={<Edit />}
            label="Sửa"
            onClick={() => handleEdit(params.row)}
        />,
        <GridActionsCellItem
            icon={<Delete />}
            label="Xóa"
            onClick={() => handleDelete(params.row.souvenirId)}
            showInMenu
        />,
      ],
    },
  ];

  return (
      <Box sx={{ p: 3 }}>
        <Button variant="outlined" onClick={() => navigate("/dashboard")}>
          Quay lại
        </Button>
        <Typography align="center" variant="h3" sx={{ my: 2 }}>
          Quản lý cửa hàng (Souvenirs)
        </Typography>
        {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
        )}
        {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
              <CircularProgress />
            </Box>
        )}
        <Button variant="contained" onClick={() => setOpen(true)} disabled={loading}>
          Thêm mới
        </Button>

        <Box sx={{ height: 500, mt: 2 }}>
          <DataGrid
              rows={products.map((p) => ({
                id: p.souvenirId,
                ...p,
                imageUrl: p.imageUrl || "",
              }))}
              columns={columns}
              pageSize={pageSize}
              onPageSizeChange={(newSize) => setPageSize(newSize)}
              rowsPerPageOptions={[5, 10, 20]}
              pagination
              loading={loading}
          />
        </Box>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>
            {editingId ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}
          </DialogTitle>
          <DialogContent>
            <FormControl fullWidth margin="dense">
              <InputLabel id="tour-select-label">Tour</InputLabel>
              <Select
                  labelId="tour-select-label"
                  name="tourId"
                  value={formData.tourId}
                  onChange={handleChange}
                  label="Tour"
                  required
                  disabled={loading}
              >
                <MenuItem value="">-- Chọn tour --</MenuItem>
                {tours.map((tour) => (
                    <MenuItem key={tour.tourId} value={tour.tourId}>
                      {tour.tourName}
                    </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
                margin="dense"
                name="name"
                label="Tên sản phẩm"
                fullWidth
                value={formData.name}
                onChange={handleChange}
                required
                disabled={loading}
            />
            <TextField
                margin="dense"
                name="price"
                label="Giá"
                type="number"
                fullWidth
                value={formData.price}
                onChange={handleChange}
                required
                disabled={loading}
                inputProps={{ min: 0 }}
            />
            <TextField
                margin="dense"
                name="description"
                label="Mô tả"
                fullWidth
                multiline
                rows={3}
                value={formData.description}
                onChange={handleChange}
                disabled={loading}
            />
            {formData.currentImageUrl && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1">Ảnh hiện tại:</Typography>
                  <img
                      src={fixDriveUrl(formData.currentImageUrl)}
                      alt="Current"
                      style={{ width: 100, height: 100, objectFit: "cover" }}
                  />
                </Box>
            )}
            <input
                type="file"
                name="file"
                accept="image/*"
                onChange={handleChange}
                style={{ marginTop: "1rem" }}
                disabled={loading}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} disabled={loading}>
              Hủy
            </Button>
            <Button
                onClick={handleSubmit}
                variant="contained"
                disabled={loading}
            >
              {editingId ? "Cập nhật" : "Thêm"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
  );
}

export default ManageShop;