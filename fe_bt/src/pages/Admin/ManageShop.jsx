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
      console.log(allTours);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách tour:", error);
    }
  };
  const fetchAllTours = async () => {
    const allTours = [];
    let page = 1;
    const pageSize = 50; // số lượng tour mỗi trang
    let totalPages = 1;

    do {
      const data = await getAllTour(page, pageSize);
      allTours.push(...data.tours); // giả sử data.tours là mảng tour
      totalPages = data.totalPages; // giả sử API trả về tổng số trang
      page++;
    } while (page <= totalPages);

    return allTours;
  };
  const fetchProducts = async () => {
    try {
      const data = await getAllProduct();
      setProducts(data.data.souvenirs);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sản phẩm:", error);
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

    try {
      const formPayload = new FormData();
      formPayload.append("tourId", formData.tourId);
      formPayload.append("SouvenirName", formData.SouvenirName);
      formPayload.append("description", formData.description);
      formPayload.append("price", Number(formData.price)); // chuyển về number
      if (formData.file) {
        formPayload.append("image", formData.file); // Chỉ append nếu có file mới
      } // tên trường phải đúng với backend yêu cầu

      if (editingId) {
        await updateProduct(editingId, formPayload);
      } else {
        await createProduct(formPayload);
      }

      setFormData({
        tourId: "",
        SouvenirName: "",
        description: "",
        price: "",
        file: null,
        currentImageUrl: "",
      });
      setEditingId(null);
      await fetchProducts();
    } catch (error) {
      console.error("Lỗi khi lưu sản phẩm:", error);
    }
  };

  const handleEdit = (product) => {
    setFormData({
      tourId: product.tourId || "",
      SouvenirName: product.SouvenirName,
      price: product.price,
      description: product.description,
      file: null,
      currentImageUrl: product.imageUrl || "",
    });
    setEditingId(product.souvenirId);
    setOpen(true); // bật dialog luôn
  };

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      await fetchProducts();
    } catch (error) {
      console.error("Lỗi khi xoá sản phẩm:", error);
    }
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
          label="Xoá"
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
      <Button variant="contained" onClick={() => setOpen(true)}>
        Thêm mới
      </Button>

      <Box sx={{ height: 500, mt: 2 }}>
        <DataGrid
          rows={products.map((p) => ({
            id: p.souvenirId,
            ...p,
            imageUrl: p.imageUrl || "", // cần backend trả URL ảnh
          }))}
          columns={columns}
          pageSize={pageSize}
          onPageSizeChange={(newSize) => setPageSize(newSize)}
          rowsPerPageOptions={[5, 10, 20]}
          pagination
        />
      </Box>

      {/* Dialog để thêm/sửa */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>
          {editingId ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}
        </DialogTitle>
        <DialogContent>
          <select
            name="tourId"
            value={formData.tourId}
            onChange={handleChange}
            required
          >
            <option value="">-- Chọn tour --</option>
            {tours.map((tour) => (
              <option key={tour.tourId} value={tour.tourId}>
                {tour.tourName}
              </option>
            ))}
          </select>
          <TextField
            margin="dense"
            name="name"
            label="Tên sản phẩm"
            fullWidth
            value={formData.name}
            onChange={handleChange}
            required
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
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Huỷ</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingId ? "Cập nhật" : "Thêm"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ManageShop;
