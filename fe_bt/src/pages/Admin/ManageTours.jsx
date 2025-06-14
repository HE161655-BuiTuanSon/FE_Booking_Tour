import React, { useEffect, useState } from "react";
import { getAllTour } from "../../services/Client/TourService";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
} from "@mui/material";
import {
  createTour,
  deleteTour,
  updateTour,
} from "../../services/Admin/CRUDTourService";
import { useNavigate } from "react-router-dom";
import { getAllDestination } from "../../services/Admin/CRUDDestination";
import { getAllDeparturePoint } from "../../services/Admin/CRUDDeparturePoint";
import { getAllMethodTrans } from "../../services/Admin/CRUDTransportationMethods";
import { getAllTourCategory } from "../../services/Admin/CRUDTourCategories";

function ManageTours() {
  const [tours, setTours] = useState([]);
  const [formData, setFormData] = useState({
    TourName: "",
    Description: "",
    DurationDays: "",
    Price: 0,
    DestinationId: 0,
    CategoryId: 0,
    DeparturePointId: 0,
    TransportationMethodId: 0,
    MaxParticipants: 0,
    SightseeingSpot: "",
    Cuisine: "",
    SuitableSubject: "",
    IdealTime: "",
    Vehicle: "",
    Promotion: "",
    CreateTourDeparture: [], // Assuming this is an array of strings for now
    images: [],
  });
  console.log(formData);
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [currentPage] = useState(1);
  const pageSize = 10;
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  if (role !== "1") {
    navigate("/");
  }
  const [destinations, setDestinations] = useState([]);
  const [departurePoints, setDeparturePoints] = useState([]);
  const [categories, setCategories] = useState([]);
  const [transportationMethods, setTransportationMethods] = useState([]);

  useEffect(() => {
    fetchTours();
    fecthDestination();
    fetchDeparturePoint();
    fetchMethodTrans();
    fetchCategoryTour();
  }, []);

  const fetchCategoryTour = async () => {
    try {
      const data = await getAllTourCategory();
      setCategories(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fecthDestination = async () => {
    try {
      const data = await getAllDestination();
      setDestinations(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDeparturePoint = async () => {
    try {
      const data = await getAllDeparturePoint();
      setDeparturePoints(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchMethodTrans = async () => {
    try {
      const data = await getAllMethodTrans();
      setTransportationMethods(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTours = async () => {
    try {
      const data = await getAllTour(currentPage, pageSize);
      setTours(data.tours);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách tour", err);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      "TourName",
      "Description",
      "DurationDays",
      "Cuisine",
      "Vehicle",
      "IdealTime",
      "Promotion",
      "SightseeingSpot",
      "SuitableSubject",
    ];

    requiredFields.forEach((field) => {
      if (!formData[field] || formData[field].toString().trim() === "") {
        newErrors[field] = `Trường ${field} là bắt buộc`;
      }
    });

    if (formData.CreateTourDeparture.length === 0) {
      newErrors.CreateTourDeparture = "Phải có ít nhất một ngày khởi hành";
    }

    if (formData.DestinationId === 0) {
      newErrors.DestinationId = "Vui lòng chọn điểm đến";
    }
    if (formData.CategoryId === 0) {
      newErrors.CategoryId = "Vui lòng chọn thể loại";
    }
    if (formData.DeparturePointId === 0) {
      newErrors.DeparturePointId = "Vui lòng chọn điểm khởi hành";
    }
    if (formData.TransportationMethodId === 0) {
      newErrors.TransportationMethodId = "Vui lòng chọn phương tiện";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const payload = {
      ...formData,
      Price: Number(formData.Price),
      MaxParticipants: Number(formData.MaxParticipants),
      DestinationId: Number(formData.DestinationId),
      CategoryId: Number(formData.CategoryId),
      DeparturePointId: Number(formData.DeparturePointId),
      TransportationMethodId: Number(formData.TransportationMethodId),
    };
    console.log("CreateTourDeparture gửi đi:", formData.CreateTourDeparture);

    try {
      console.log("Payload gửi đi:", JSON.stringify(payload, null, 2));
      if (isEditing) {
        await updateTour(editId, payload);
      } else {
        await createTour(payload);
      }

      // Reset lại form sau khi gửi
      setFormData({
        TourName: "",
        Description: "",
        DurationDays: "",
        Price: 0,
        DestinationId: 0,
        CategoryId: 0,
        DeparturePointId: 0,
        TransportationMethodId: 0,
        MaxParticipants: 0,
        SightseeingSpot: "",
        Cuisine: "",
        SuitableSubject: "",
        IdealTime: "",
        Vehicle: "",
        Promotion: "",
        CreateTourDeparture: [],
        images: [],
      });
      setErrors({});
      setIsEditing(false);
      setEditId(null);
      setShowPopup(false);
      fetchTours();
    } catch (err) {
      console.error("Lỗi khi submit tour", err);
      if (err.response && err.response.data.errors) {
        setErrors(err.response.data.errors);
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa tour này?")) {
      try {
        await deleteTour(id);
        fetchTours();
      } catch (err) {
        console.error("Lỗi khi xóa tour", err);
      }
    }
  };

  const handleEdit = (tour) => {
    setFormData({
      TourName: tour.TourName,
      Description: tour.description,
      DurationDays: tour.durationDays,
      Price: tour.price,
      DestinationId: tour.destinationId || 0,
      CategoryId: tour.categoryId || 0,
      DeparturePointId: tour.departurePointId || 0,
      TransportationMethodId: tour.transportationMethodId || 0,
      MaxParticipants: tour.maxParticipants,
      SightseeingSpot: tour.sightseeingSpot || "",
      Cuisine: tour.cuisine || "",
      SuitableSubject: tour.suitableSubject || "",
      IdealTime: tour.idealTime || "",
      Vehicle: tour.vehicle || "",
      Promotion: tour.promotion || "",
      CreateTourDeparture: tour.createTourDeparture || [],
      images: tour.images || [],
    });
    setIsEditing(true);
    setEditId(tour.tourId);
    setShowPopup(true);
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleCreateTourDepartureChange = (e) => {
    const value = e.target.value;

    const departures = value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
      .map((date) => ({
        departureDate: new Date(date).toISOString(),
        availableSlots: 0,
      }));

    console.log("✅ Đã convert CreateTourDeparture:", departures);

    setFormData((prev) => ({
      ...prev,
      CreateTourDeparture: departures,
    }));

    setErrors((prev) => ({ ...prev, CreateTourDeparture: "" }));
  };

  const handleCreateNew = () => {
    setFormData({
      TourName: "",
      Description: "",
      DurationDays: "",
      Price: 0,
      DestinationId: 0,
      CategoryId: 0,
      DeparturePointId: 0,
      TransportationMethodId: 0,
      MaxParticipants: 0,
      SightseeingSpot: "",
      Cuisine: "",
      SuitableSubject: "",
      IdealTime: "",
      Vehicle: "",
      Promotion: "",
      CreateTourDeparture: [],
      images: [],
    });
    setIsEditing(false);
    setEditId(null);
    setShowPopup(true);
    setErrors({});
  };

  return (
    <div style={{ padding: "30px" }}>
      <Button variant="outlined" onClick={() => navigate("/dashboard")}>
        Quay lại
      </Button>
      <Typography align="center" variant="h4" gutterBottom>
        Quản lý Tour
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={handleCreateNew}
        sx={{ mb: 3 }}
      >
        Tạo mới Tour
      </Button>

      <Dialog
        open={showPopup}
        onClose={() => setShowPopup(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {isEditing ? "Cập nhật Tour" : "Tạo mới Tour"}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            {[
              {
                label: "Tên tour",
                name: "TourName",
                type: "text",
                required: true,
              },
              {
                label: "Mô tả",
                name: "Description",
                type: "text",
                required: true,
              },
              {
                label: "Số ngày",
                name: "DurationDays",
                type: "text",
                required: true,
              },
              { label: "Giá", name: "Price", type: "number" },
              {
                label: "Số người tối đa",
                name: "MaxParticipants",
                type: "number",
              },
              {
                label: "Điểm tham quan",
                name: "SightseeingSpot",
                type: "text",
                required: true,
              },
              {
                label: "Ẩm thực",
                name: "Cuisine",
                type: "text",
                required: true,
              },
              {
                label: "Đối tượng phù hợp",
                name: "SuitableSubject",
                type: "text",
                required: true,
              },
              {
                label: "Thời điểm lý tưởng",
                name: "IdealTime",
                type: "text",
                required: true,
              },
              {
                label: "Phương tiện di chuyển",
                name: "Vehicle",
                type: "text",
                required: true,
              },
              {
                label: "Khuyến mãi",
                name: "Promotion",
                type: "text",
                required: true,
              },
            ].map((field) => (
              <Grid item xs={12} key={field.name}>
                <TextField
                  fullWidth
                  label={field.label}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  type={field.type}
                  required={field.required}
                  error={!!errors[field.name]}
                  helperText={errors[field.name]}
                />
              </Grid>
            ))}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Ngày khởi hành (cách nhau bởi dấu phẩy)"
                name="CreateTourDeparture"
                value={formData.CreateTourDeparture.map((item) =>
                  item?.departureDate
                    ? new Date(item.departureDate).toISOString().split("T")[0]
                    : ""
                ).join(", ")}
                onChange={handleCreateTourDepartureChange}
                required
                error={!!errors.CreateTourDeparture}
                helperText={
                  errors.CreateTourDeparture ||
                  "Nhập các ngày, ví dụ: 2025-06-15, 2025-06-20"
                }
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.DestinationId}>
                <InputLabel>Điểm đến</InputLabel>
                <Select
                  name="DestinationId"
                  value={formData.DestinationId}
                  onChange={handleChange}
                  label="Điểm đến"
                  required
                >
                  <MenuItem value={0}>Chọn điểm đến</MenuItem>
                  {destinations.map((dest) => (
                    <MenuItem
                      key={dest.destinationId}
                      value={dest.destinationId}
                    >
                      {dest.destinationName}
                    </MenuItem>
                  ))}
                </Select>
                {errors.DestinationId && (
                  <FormHelperText>{errors.DestinationId}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.CategoryId}>
                <InputLabel>Thể loại</InputLabel>
                <Select
                  name="CategoryId"
                  value={formData.CategoryId}
                  onChange={handleChange}
                  label="Thể loại"
                  required
                >
                  <MenuItem value={0}>Chọn thể loại</MenuItem>
                  {categories.map((cat) => (
                    <MenuItem key={cat.categoryId} value={cat.categoryId}>
                      {cat.categoryName}
                    </MenuItem>
                  ))}
                </Select>
                {errors.CategoryId && (
                  <FormHelperText>{errors.CategoryId}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.DeparturePointId}>
                <InputLabel>Điểm khởi hành</InputLabel>
                <Select
                  name="DeparturePointId"
                  value={formData.DeparturePointId}
                  onChange={handleChange}
                  label="Điểm khởi hành"
                  required
                >
                  <MenuItem value={0}>Chọn điểm khởi hành</MenuItem>
                  {departurePoints.map((dep) => (
                    <MenuItem
                      key={dep.departurePointId}
                      value={dep.departurePointId}
                    >
                      {dep.departurePointName}
                    </MenuItem>
                  ))}
                </Select>
                {errors.DeparturePointId && (
                  <FormHelperText>{errors.DeparturePointId}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.TransportationMethodId}>
                <InputLabel>Phương tiện</InputLabel>
                <Select
                  name="TransportationMethodId"
                  value={formData.TransportationMethodId}
                  onChange={handleChange}
                  label="Phương tiện"
                  required
                >
                  <MenuItem value={0}>Chọn phương tiện</MenuItem>
                  {transportationMethods.map((trans) => (
                    <MenuItem
                      key={trans.transportationMethodId}
                      value={trans.transportationMethodId}
                    >
                      {trans.methodName}
                    </MenuItem>
                  ))}
                </Select>
                {errors.TransportationMethodId && (
                  <FormHelperText>
                    {errors.TransportationMethodId}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPopup(false)} color="secondary">
            Hủy
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {isEditing ? "Cập nhật" : "Tạo mới"}
          </Button>
        </DialogActions>
      </Dialog>

      <Paper elevation={3} sx={{ overflowX: "auto" }}>
        <Table>
          <TableHead
            sx={{ backgroundColor: (theme) => theme.palette.primary.main }}
          >
            <TableRow>
              <TableCell sx={{ color: "white" }}>ID</TableCell>
              <TableCell sx={{ color: "white" }}>Tên Tour</TableCell>
              <TableCell sx={{ color: "white" }}>Mô tả</TableCell>
              <TableCell sx={{ color: "white" }}>Thời lượng</TableCell>
              <TableCell sx={{ color: "white" }}>Giá</TableCell>
              <TableCell sx={{ color: "white" }}>Phương tiện</TableCell>
              <TableCell sx={{ color: "white" }}>Điểm đến</TableCell>
              <TableCell sx={{ color: "white" }}>Loại</TableCell>
              <TableCell sx={{ color: "white" }}>Điểm xuất phát</TableCell>
              <TableCell sx={{ color: "white" }}>Số lượng tối đa</TableCell>
              <TableCell sx={{ color: "white" }}>Khởi hành tiếp theo</TableCell>
              <TableCell sx={{ color: "white" }}>Ảnh</TableCell>
              <TableCell sx={{ color: "white" }}>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tours.map((tour) => (
              <TableRow key={tour.tourId}>
                <TableCell>{tour.tourId}</TableCell>
                <TableCell>{tour.TourName}</TableCell>
                <TableCell>{tour.description}</TableCell>
                <TableCell>{tour.durationDays}</TableCell>
                <TableCell>{tour.price.toLocaleString()} đ</TableCell>
                <TableCell>{tour.vehicle}</TableCell>
                <TableCell>{tour.destination}</TableCell>
                <TableCell>{tour.category}</TableCell>
                <TableCell>{tour.departurePoint}</TableCell>
                <TableCell>{tour.maxParticipants}</TableCell>
                <TableCell>
                  {tour.nextDeparture
                    ? new Date(tour.nextDeparture).toLocaleDateString()
                    : "Chưa có"}
                </TableCell>
                <TableCell>
                  {tour.imageUrl ? (
                    <img
                      src={`https://your-image-host/${tour.imageUrl}`}
                      alt={tour.TourName}
                      style={{ width: "80px", height: "auto", borderRadius: 4 }}
                    />
                  ) : (
                    "Không có ảnh"
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => handleEdit(tour)}
                    sx={{ mb: 1 }}
                  >
                    Sửa
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    variant="outlined"
                    onClick={() => handleDelete(tour.tourId)}
                  >
                    Xóa
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
}

export default ManageTours;
