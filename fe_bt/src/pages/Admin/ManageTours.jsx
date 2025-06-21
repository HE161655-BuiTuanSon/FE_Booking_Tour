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
  Alert,
  CircularProgress,
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
    Price: "",
    DestinationId: 0,
    CategoryId: 0,
    DeparturePointId: 0,
    TransportationMethodId: 0,
    MaxParticipants: "",
    SightseeingSpot: "",
    Cuisine: "",
    SuitableSubject: "",
    IdealTime: "",
    Vehicle: "",
    Promotion: "",
    CreateTourDeparture: [{ departureDate: "", availableSlots: "" }],
    images: [],
  });
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [currentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
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

  // Hàm fixDriveUrl để xử lý URL ảnh từ Google Drive
  const fixDriveUrl = (url) => {
    if (typeof url !== "string") return url;
    if (!url.includes("drive.google.com/uc?id=")) return url;

    const parts = url.split("id=");
    const fileId = parts[1]?.split("&")[0];
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
  };

  useEffect(() => {
    fetchTours();
    fetchDestination();
    fetchDeparturePoint();
    fetchMethodTrans();
    fetchCategoryTour();
  }, []);

  const fetchCategoryTour = async () => {
    try {
      const data = await getAllTourCategory();
      setCategories(data.data);
    } catch (error) {
      setError("Không thể lấy danh sách danh mục tour.");
    }
  };

  const fetchDestination = async () => {
    try {
      const data = await getAllDestination();
      setDestinations(data.data);
    } catch (error) {
      setError("Không thể lấy danh sách điểm đến.");
    }
  };

  const fetchDeparturePoint = async () => {
    try {
      const data = await getAllDeparturePoint();
      setDeparturePoints(data.data);
    } catch (error) {
      setError("Không thể lấy danh sách điểm khởi hành.");
    }
  };

  const fetchMethodTrans = async () => {
    try {
      const data = await getAllMethodTrans();
      setTransportationMethods(data.data);
    } catch (error) {
      setError("Không thể lấy danh sách phương tiện.");
    }
  };

  const fetchTours = async () => {
    setLoading(true);
    try {
      const data = await getAllTour(currentPage, pageSize);
      setTours(data.tours);
    } catch (err) {
      setError("Lỗi khi lấy danh sách tour.");
    } finally {
      setLoading(false);
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
        newErrors[field] = `${field} là bắt buộc.`;
      }
    });

    if (!formData.Price || Number(formData.Price) <= 0) {
      newErrors.Price = "Giá phải lớn hơn 0.";
    }

    if (!formData.MaxParticipants || Number(formData.MaxParticipants) <= 0) {
      newErrors.MaxParticipants = "Số người tối đa phải lớn hơn 0.";
    }

    if (formData.DestinationId === 0) {
      newErrors.DestinationId = "Vui lòng chọn điểm đến.";
    }
    if (formData.CategoryId === 0) {
      newErrors.CategoryId = "Vui lòng chọn thể loại.";
    }
    if (formData.DeparturePointId === 0) {
      newErrors.DeparturePointId = "Vui lòng chọn điểm khởi hành.";
    }
    if (formData.TransportationMethodId === 0) {
      newErrors.TransportationMethodId = "Vui lòng chọn phương tiện.";
    }

    if (!formData.CreateTourDeparture.length) {
      newErrors.CreateTourDeparture = "Phải có ít nhất một ngày khởi hành.";
    } else {
      formData.CreateTourDeparture.forEach((dep, index) => {
        if (!dep.departureDate) {
          newErrors[`CreateTourDeparture[${index}].departureDate`] = "Ngày khởi hành là bắt buộc.";
        } else {
          const date = new Date(dep.departureDate);
          if (isNaN(date.getTime())) {
            newErrors[`CreateTourDeparture[${index}].departureDate`] = "Ngày khởi hành không hợp lệ.";
          } else if (date <= new Date()) {
            newErrors[`CreateTourDeparture[${index}].departureDate`] = "Ngày khởi hành phải trong tương lai.";
          }
        }
        if (!dep.availableSlots || isNaN(Number(dep.availableSlots)) || Number(dep.availableSlots) <= 0) {
          newErrors[`CreateTourDeparture[${index}].availableSlots`] = "Số chỗ trống phải lớn hơn 0.";
        }
        if (Number(dep.availableSlots) > Number(formData.MaxParticipants)) {
          newErrors[`CreateTourDeparture[${index}].availableSlots`] = "Số chỗ trống không được vượt quá số người tối đa.";
        }
      });
    }

    if (!isEditing && (!formData.images || !formData.images.length)) {
      newErrors.images = "Phải chọn ít nhất một ảnh khi tạo mới.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const formPayload = new FormData();
      formPayload.append("TourName", formData.TourName);
      formPayload.append("Description", formData.Description);
      formPayload.append("DurationDays", formData.DurationDays);
      formPayload.append("Price", Number(formData.Price));
      formPayload.append("DestinationId", Number(formData.DestinationId));
      formPayload.append("CategoryId", Number(formData.CategoryId));
      formPayload.append("DeparturePointId", Number(formData.DeparturePointId));
      formPayload.append("TransportationMethodId", Number(formData.TransportationMethodId));
      formPayload.append("MaxParticipants", Number(formData.MaxParticipants));
      formPayload.append("SightseeingSpot", formData.SightseeingSpot);
      formPayload.append("Cuisine", formData.Cuisine);
      formPayload.append("SuitableSubject", formData.SuitableSubject);
      formPayload.append("IdealTime", formData.IdealTime);
      formPayload.append("Vehicle", formData.Vehicle);
      formPayload.append("Promotion", formData.Promotion);

      // Chuẩn hóa CreateTourDeparture
      const departures = formData.CreateTourDeparture.map(dep => ({
        departureDate: dep.departureDate,
        availableSlots: Number(dep.availableSlots)
      }));
      formPayload.append("CreateTourDeparture", JSON.stringify(departures));

      formData.images.forEach((file) => {
        formPayload.append("images", file);
      });

      console.log("📦 FormData sent:");
      for (let [key, value] of formPayload.entries()) {
        console.log(`${key}:`, value instanceof File ? value.name : value);
      }

      if (isEditing) {
        await updateTour(editId, formPayload);
      } else {
        await createTour(formPayload);
      }

      setFormData({
        TourName: "",
        Description: "",
        DurationDays: "",
        Price: "",
        DestinationId: 0,
        CategoryId: 0,
        DeparturePointId: 0,
        TransportationMethodId: 0,
        MaxParticipants: "",
        SightseeingSpot: "",
        Cuisine: "",
        SuitableSubject: "",
        IdealTime: "",
        Vehicle: "",
        Promotion: "",
        CreateTourDeparture: [{ departureDate: "", availableSlots: "" }],
        images: [],
      });
      setErrors({});
      setIsEditing(false);
      setEditId(null);
      setShowPopup(false);
      await fetchTours();
    } catch (err) {
      console.error("Lỗi khi submit tour:", err.response?.data);
      setError(err.response?.data?.message || "Không thể lưu tour.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa tour này?")) {
      setLoading(true);
      try {
        await deleteTour(id);
        await fetchTours();
      } catch (err) {
        setError(err.response?.data?.message || "Không thể xóa tour.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEdit = (tour) => {
    setFormData({
      TourName: tour.tourName || "",
      Description: tour.description || "",
      DurationDays: tour.durationDays || "",
      Price: tour.price || "",
      DestinationId: tour.destinationId || 0,
      CategoryId: tour.categoryId || 0,
      DeparturePointId: tour.departurePointId || 0,
      TransportationMethodId: tour.transportationMethodId || 0,
      MaxParticipants: tour.maxParticipants || "",
      SightseeingSpot: tour.sightseeingSpot || "",
      Cuisine: tour.cuisine || "",
      SuitableSubject: tour.suitableSubject || "",
      IdealTime: tour.idealTime || "",
      Vehicle: tour.vehicle || "",
      Promotion: tour.promotion || "",
      CreateTourDeparture: tour.departureDates?.map(d => ({
        departureDate: new Date(d.departureDate).toISOString(),
        availableSlots: d.availableSlots.toString()
      })) || [{ departureDate: "", availableSlots: "" }],
      images: [],
    });
    setIsEditing(true);
    setEditId(tour.tourId);
    setShowPopup(true);
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (name === "images") {
      setFormData((prev) => ({
        ...prev,
        images: Array.from(files),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "number" ? (value === "" ? "" : Number(value)) : value,
      }));
    }
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleDepartureChange = (index, field, value) => {
    const newDepartures = [...formData.CreateTourDeparture];
    if (field === "departureDate") {
      // Chuyển YYYY-MM-DD thành ISO 8601
      const date = value ? new Date(value).toISOString() : "";
      newDepartures[index] = { ...newDepartures[index], [field]: date };
    } else {
      newDepartures[index] = { ...newDepartures[index], [field]: value };
    }
    setFormData((prev) => ({
      ...prev,
      CreateTourDeparture: newDepartures,
    }));
    setErrors((prev) => ({ ...prev, [`CreateTourDeparture[${index}].${field}`]: "" }));
  };

  const addDeparture = () => {
    setFormData((prev) => ({
      ...prev,
      CreateTourDeparture: [...prev.CreateTourDeparture, { departureDate: "", availableSlots: "" }],
    }));
  };

  const removeDeparture = (index) => {
    setFormData((prev) => ({
      ...prev,
      CreateTourDeparture: prev.CreateTourDeparture.filter((_, i) => i !== index),
    }));
  };

  const handleCreateNew = () => {
    setFormData({
      TourName: "",
      Description: "",
      DurationDays: "",
      Price: "",
      DestinationId: 0,
      CategoryId: 0,
      DeparturePointId: 0,
      TransportationMethodId: 0,
      MaxParticipants: "",
      SightseeingSpot: "",
      Cuisine: "",
      SuitableSubject: "",
      IdealTime: "",
      Vehicle: "",
      Promotion: "",
      CreateTourDeparture: [{ departureDate: "", availableSlots: "" }],
      images: [],
    });
    setIsEditing(false);
    setEditId(null);
    setShowPopup(true);
    setErrors({});
    setError(null);
  };

  return (
      <div style={{ padding: "30px" }}>
        <Button variant="outlined" onClick={() => navigate("/dashboard")}>
          Quay lại
        </Button>
        <Typography align="center" variant="h4" gutterBottom>
          Quản lý Tour
        </Typography>
        {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
        )}
        {loading && (
            <div style={{ display: "flex", justifyContent: "center", margin: "16px 0" }}>
              <CircularProgress />
            </div>
        )}
        <Button
            variant="contained"
            color="primary"
            onClick={handleCreateNew}
            sx={{ mb: 3 }}
            disabled={loading}
        >
          Tạo mới Tour
        </Button>

        <Dialog
            open={showPopup}
            onClose={() => setShowPopup(false)}
            maxWidth="md"
            fullWidth
        >
          <DialogTitle>
            {isEditing ? "Cập nhật Tour" : "Tạo mới Tour"}
          </DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2}>
              {[
                { label: "Tên tour", name: "TourName", type: "text", required: true },
                { label: "Mô tả", name: "Description", type: "text", required: true, multiline: true, rows: 4 },
                { label: "Số ngày", name: "DurationDays", type: "text", required: true },
                { label: "Giá", name: "Price", type: "number", required: true },
                { label: "Số người tối đa", name: "MaxParticipants", type: "number", required: true },
                { label: "Điểm tham quan", name: "SightseeingSpot", type: "text", required: true },
                { label: "Ẩm thực", name: "Cuisine", type: "text", required: true },
                { label: "Đối tượng phù hợp", name: "SuitableSubject", type: "text", required: true },
                { label: "Thời điểm lý tưởng", name: "IdealTime", type: "text", required: true },
                { label: "Phương tiện di chuyển", name: "Vehicle", type: "text", required: true },
                { label: "Khuyến mãi", name: "Promotion", type: "text", required: true },
              ].map((field) => (
                  <Grid item xs={12} sm={6} key={field.name}>
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
                        multiline={field.multiline}
                        rows={field.rows}
                        disabled={loading}
                    />
                  </Grid>
              ))}
              <Grid item xs={12}>
                <Typography variant="subtitle1">Ngày khởi hành</Typography>
                {formData.CreateTourDeparture.map((dep, index) => (
                    <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
                      <Grid item xs={5}>
                        <TextField
                            fullWidth
                            label="Ngày khởi hành"
                            type="date"
                            value={dep.departureDate ? new Date(dep.departureDate).toISOString().split("T")[0] : ""}
                            onChange={(e) => handleDepartureChange(index, "departureDate", e.target.value)}
                            error={!!errors[`CreateTourDeparture[${index}].departureDate`]}
                            helperText={errors[`CreateTourDeparture[${index}].departureDate`]}
                            InputLabelProps={{ shrink: true }}
                            disabled={loading}
                        />
                      </Grid>
                      <Grid item xs={5}>
                        <TextField
                            fullWidth
                            label="Số chỗ trống"
                            type="number"
                            value={dep.availableSlots}
                            onChange={(e) => handleDepartureChange(index, "availableSlots", e.target.value)}
                            error={!!errors[`CreateTourDeparture[${index}].availableSlots`]}
                            helperText={errors[`CreateTourDeparture[${index}].availableSlots`]}
                            disabled={loading}
                            inputProps={{ min: 0 }}
                        />
                      </Grid>
                      <Grid item xs={2}>
                        <Button
                            color="error"
                            onClick={() => removeDeparture(index)}
                            disabled={formData.CreateTourDeparture.length === 1 || loading}
                        >
                          Xóa
                        </Button>
                      </Grid>
                    </Grid>
                ))}
                <Button onClick={addDeparture} disabled={loading}>
                  Thêm ngày khởi hành
                </Button>
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
                      disabled={loading}
                  >
                    <MenuItem value={0}>Chọn điểm đến</MenuItem>
                    {destinations.map((dest) => (
                        <MenuItem key={dest.destinationId} value={dest.destinationId}>
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
                      disabled={loading}
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
                      disabled={loading}
                  >
                    <MenuItem value={0}>Chọn điểm khởi hành</MenuItem>
                    {departurePoints.map((dep) => (
                        <MenuItem key={dep.departurePointId} value={dep.departurePointId}>
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
                      disabled={loading}
                  >
                    <MenuItem value={0}>Chọn phương tiện</MenuItem>
                    {transportationMethods.map((trans) => (
                        <MenuItem key={trans.transportationMethodId} value={trans.transportationMethodId}>
                          {trans.methodName}
                        </MenuItem>
                    ))}
                  </Select>
                  {errors.TransportationMethodId && (
                      <FormHelperText>{errors.TransportationMethodId}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1">Ảnh tour</Typography>
                <input
                    type="file"
                    name="images"
                    accept="image/*"
                    multiple
                    onChange={handleChange}
                    disabled={loading}
                />
                {errors.images && <FormHelperText error>{errors.images}</FormHelperText>}
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowPopup(false)} color="secondary" disabled={loading}>
              Hủy
            </Button>
            <Button onClick={handleSubmit} variant="contained" color="primary" disabled={loading}>
              {isEditing ? "Cập nhật" : "Tạo mới"}
            </Button>
          </DialogActions>
        </Dialog>

        <Paper elevation={3} sx={{ overflowX: "auto" }}>
          <Table>
            <TableHead sx={{ backgroundColor: (theme) => theme.palette.primary.main }}>
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
                    <TableCell>{tour.tourName}</TableCell>
                    <TableCell>{tour.description}</TableCell>
                    <TableCell>{tour.durationDays}</TableCell>
                    <TableCell>{tour.price.toLocaleString()} đ</TableCell>
                    <TableCell>{tour.vehicle}</TableCell>
                    <TableCell>{tour.destination}</TableCell>
                    <TableCell>{tour.category}</TableCell>
                    <TableCell>{tour.departurePoint}</TableCell>
                    <TableCell>{tour.maxParticipants}</TableCell>
                    <TableCell>
                      {tour.nextDeparture?.departureDate
                          ? new Date(tour.nextDeparture.departureDate).toLocaleDateString()
                          : "Chưa có"}
                    </TableCell>
                    <TableCell>
                      {tour.imageUrl ? (
                          <img
                              src={fixDriveUrl(tour.imageUrl)} // Áp dụng fixDriveUrl
                              alt={tour.tourName}
                              style={{ width: "80px", height: "auto", borderRadius: 4 }}
                              loading="lazy" // Tối ưu hóa tải ảnh
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
                          disabled={loading}
                      >
                        Sửa
                      </Button>
                      <Button
                          size="small"
                          color="error"
                          variant="outlined"
                          onClick={() => handleDelete(tour.tourId)}
                          disabled={loading}
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