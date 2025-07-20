import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import LoginRegisterPopup from "../../components/authorization/LoginRegisterPopup";
import aboutBanner from "../../assets/about_banner.jpg";
import { getAllTour } from "../../services/Client/TourService";
import "../../styles/Client/Tour.css";
import {
  FaBus,
  FaClock,
  FaFlag,
  FaIdBadge,
  FaMapMarkerAlt,
  FaPlaneDeparture,
} from "react-icons/fa";
import { getAllDestination } from "../../services/Admin/CRUDDestination";
import { getAllTourCategory } from "../../services/Admin/CRUDTourCategories";
import { getAllDeparturePoint } from "../../services/Admin/CRUDDeparturePoint";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useSearchParams } from "react-router-dom";


function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

function Tours() {
  const [allTour, setAllTour] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [filters, setFilters] = useState({
    destinationId: "",
    categoryId: "",
    departurePointId: "",
    minPrice: "",
    maxPrice: "",
    startDate: "",
    endDate: "",
    sortBy: "all",
  });
  const [destinations, setDestinations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [departurePoints, setDeparturePoints] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const toursPerPage = 10;
  const [errors, setErrors] = useState({
    minPrice: "",
    maxPrice: "",
    startDate: "",
    endDate: "",
  });
  const [localMinPrice, setLocalMinPrice] = useState(filters.minPrice);
  const [localMaxPrice, setLocalMaxPrice] = useState(filters.maxPrice);
  const debouncedMinPrice = useDebounce(localMinPrice, 500);
  const debouncedMaxPrice = useDebounce(localMaxPrice, 500);
  const [searchParams] = useSearchParams();
  const destinationParam = searchParams.get("destination");
  const matchedDestination = destinations.find(
    (d) => d.destinationName === destinationParam
  );
  const [selectedDestination, setSelectedDestination] = useState(destinationParam || "");
  // Hàm fixDriveUrl để xử lý URL ảnh từ Google Drive
  const fixDriveUrl = (url) => {
    if (typeof url !== "string") return url;
    if (!url.includes("drive.google.com/uc?id=")) return url;

    const parts = url.split("id=");
    const fileId = parts[1]?.split("&")[0];
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
  };

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      minPrice: debouncedMinPrice,
      maxPrice: debouncedMaxPrice,
    }));
  }, [debouncedMinPrice, debouncedMaxPrice]);

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [destData, catData, depData] = await Promise.all([
          getAllDestination(),
          getAllTourCategory(),
          getAllDeparturePoint(),
        ]);
        setDestinations(destData.data || []);
        setCategories(catData.data || []);
        setDeparturePoints(depData.data || []);

        // const destinationParam = searchParams.get("destination");
        // if (destinationParam) {
        //   const matched = destData.data.find(
        //     (d) => d.destinationName === destinationParam
        //   );
        //   if (matched) {
        //     setFilters((prev) => ({
        //       ...prev,
        //       destinationId: matched.destinationId.toString(),
        //     }));
        //   }
        // }
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      }
    };
    fetchDropdownData();
  }, []);
  useEffect(() => {
  const destinationParam = searchParams.get("destination");
  if (destinationParam && destinations.length > 0) {
    const matched = destinations.find(
      (d) => d.destinationName === destinationParam
    );
    if (matched) {
      setFilters((prev) => ({
        ...prev,
        destinationId: matched.destinationId.toString(),
      }));
    }
  }
}, [destinations, searchParams]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const newFilters = {
      destinationId: queryParams.get("destinationId") || "",
      categoryId: queryParams.get("categoryId") || "",
      departurePointId: queryParams.get("departurePointId") || "",
      minPrice: queryParams.get("minPrice") || "",
      maxPrice: queryParams.get("maxPrice") || "",
      startDate: queryParams.get("startDate") || "",
      endDate: queryParams.get("endDate") || "",
      sortBy: queryParams.get("sortBy") || "all",
    };
    setFilters(newFilters);
    setLocalMinPrice(newFilters.minPrice);
    setLocalMaxPrice(newFilters.maxPrice);
    setCurrentPage(1);
  }, [location.search]);

  useEffect(() => {
    console.log("Filters sent to API:", filters);
    const fetchTours = async () => {
      setLoading(true);
      try {
        const data = await getAllTour(currentPage, toursPerPage, filters);
        setAllTour(data.tours || []);
        setTotalPages(data.totalPages || 1);
      } catch (error) {
        console.error("Error fetching tours:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTours();
  }, [currentPage, filters]);

  const formatVND = (value) => {
    if (typeof value === "number" && !isNaN(value)) {
      return value.toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
      });
    }
    if (typeof value === "string") {
      const num = Number(value.replace(/[, ]+/g, ""));
      if (!isNaN(num)) {
        return num.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        });
      }
    }
    return "Giá trị không hợp lệ";
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "Chưa xác định";
    const date = new Date(dateStr);
    const pad = (n) => n.toString().padStart(2, "0");
    return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
  };

  const validateFilters = (name, value) => {
    let newErrors = { ...errors };

    if (name === "minPrice" || name === "maxPrice") {
      const numValue = Number(value);
      if (value && (isNaN(numValue) || numValue < 0)) {
        newErrors[name] = "Giá phải là số không âm";
      } else if (
        name === "minPrice" &&
        filters.maxPrice &&
        numValue > Number(filters.maxPrice)
      ) {
        newErrors.minPrice = "Giá tối thiểu phải nhỏ hơn hoặc bằng giá tối đa";
      } else if (
        name === "maxPrice" &&
        filters.minPrice &&
        numValue < Number(filters.minPrice)
      ) {
        newErrors.maxPrice = "Giá tối đa phải lớn hơn hoặc bằng giá tối thiểu";
      } else {
        newErrors.minPrice = "";
        newErrors.maxPrice = "";
      }
    }

    if (name === "startDate" || name === "endDate") {
      if (value && isNaN(Date.parse(value))) {
        newErrors[name] = "Ngày không hợp lệ";
      } else if (
        name === "startDate" &&
        filters.endDate &&
        new Date(value) > new Date(filters.endDate)
      ) {
        newErrors.startDate = "Ngày đi phải trước hoặc bằng ngày về";
      } else if (
        name === "endDate" &&
        filters.startDate &&
        new Date(value) < new Date(filters.startDate)
      ) {
        newErrors.endDate = "Ngày về phải sau hoặc bằng ngày đi";
      } else {
        newErrors.startDate = "";
        newErrors.endDate = "";
      }
    }

    setErrors(newErrors);

    return !newErrors[name];
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    if (
      name === "minPrice" ||
      name === "maxPrice" ||
      name === "startDate" ||
      name === "endDate"
    ) {
      if (!validateFilters(name, value)) return;
    }

    if (name === "minPrice") {
      setLocalMinPrice(value);
    } else if (name === "maxPrice") {
      setLocalMaxPrice(value);
    } else {
      setFilters((prev) => ({ ...prev, [name]: value }));
      setCurrentPage(1);
    }
  };

  if (loading) return <div className="loading">Đang tải...</div>;

  return (
    <div className="tours-page">
      <Header
        onLoginClick={() => setShowPopup(true)}
        onRegisterClick={() => setShowPopup(true)}
      />
      {showPopup && <LoginRegisterPopup onClose={() => setShowPopup(false)} />}

      <div
        className="about-banner"
        style={{ backgroundImage: `url(${aboutBanner})` }}
      >
        <h2 className="banner-title">Tất cả điểm đến</h2>
      </div>

      <div className="tour-container" style={{ display: "flex" }}>
        <Box
          className="filter-sidebar"
          sx={{
            width: { xs: "100%", sm: "280px" },
            padding: 2,
            borderRight: { sm: "1px solid #ccc" },
            height: "100vh",
            boxSizing: "border-box",
            overflowY: "auto",
            left: 0,
            zIndex: 10,
          }}
        >
          <Typography
            variant="h6"
            color="primary"
            gutterBottom
            sx={{ fontWeight: 600 }}
          >
            Bộ lọc
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <FormControl variant="outlined" size="small">
              <InputLabel id="destinationId-label">Điểm đến</InputLabel>
              <Select
                labelId="destinationId-label"
                name="destinationId"
                value={filters.destinationId}
                onChange={handleFilterChange}
                label="Điểm đến"
              >
                <MenuItem value="">Tất cả điểm đến</MenuItem>
                {destinations.map((dest) => (
                  <MenuItem key={dest.destinationId} value={dest.destinationId}>
                    {dest.destinationName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl variant="outlined" size="small">
              <InputLabel id="categoryId-label">Danh mục</InputLabel>
              <Select
                labelId="categoryId-label"
                name="categoryId"
                value={filters.categoryId}
                onChange={handleFilterChange}
                label="Danh mục"
              >
                <MenuItem value="">Tất cả danh mục</MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat.categoryId} value={cat.categoryId}>
                    {cat.categoryName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl variant="outlined" size="small">
              <InputLabel id="departurePointId-label">Điểm khởi hành</InputLabel>
              <Select
                labelId="departurePointId-label"
                name="departurePointId"
                value={filters.departurePointId}
                onChange={handleFilterChange}
                label="Điểm khởi hành"
              >
                <MenuItem value="">Tất cả điểm khởi hành</MenuItem>
                {departurePoints.map((dep) => (
                  <MenuItem key={dep.departurePointId} value={dep.departurePointId}>
                    {dep.departurePointName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              type="number"
              name="minPrice"
              label="Giá tối thiểu (VNĐ)"
              value={localMinPrice}
              onChange={handleFilterChange}
              variant="outlined"
              size="small"
              placeholder="Giá tối thiểu"
              InputProps={{ inputProps: { min: 0 } }}
              error={!!errors.minPrice}
              helperText={errors.minPrice}
            />
            <TextField
              type="number"
              name="maxPrice"
              label="Giá tối đa (VNĐ)"
              value={localMaxPrice}
              onChange={handleFilterChange}
              variant="outlined"
              size="small"
              placeholder="Giá tối đa"
              InputProps={{ inputProps: { min: 0 } }}
              error={!!errors.maxPrice}
              helperText={errors.maxPrice}
            />
            <TextField
              type="date"
              name="startDate"
              label="Ngày đi"
              value={filters.startDate}
              onChange={handleFilterChange}
              variant="outlined"
              size="small"
              InputLabelProps={{ shrink: true }}
              error={!!errors.startDate}
              helperText={errors.startDate}
            />
            <TextField
              type="date"
              name="endDate"
              label="Ngày về"
              value={filters.endDate}
              onChange={handleFilterChange}
              variant="outlined"
              size="small"
              InputLabelProps={{ shrink: true }}
              error={!!errors.endDate}
              helperText={errors.endDate}
            />
            <FormControl variant="outlined" size="small">
              <InputLabel id="sortBy-label">Sắp xếp theo</InputLabel>
              <Select
                labelId="sortBy-label"
                name="sortBy"
                value={filters.sortBy}
                onChange={handleFilterChange}
                label="Sắp xếp theo"
              >
                <MenuItem value="all">Mới nhất</MenuItem>
                <MenuItem value="priceasc">Giá: Thấp đến cao</MenuItem>
                <MenuItem value="pricedesc">Giá: Cao đến thấp</MenuItem>
                <MenuItem value="departure">Ngày khởi hành gần nhất</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        <div className="tour-content" style={{ flex: 1, padding: "20px" }}>
          <div className="tour-card-grid">
            {allTour.length > 0 ? (
              allTour.map((tour) => (
                <div className="tour-card-all" key={tour.tourId}>
                  <img
                    src={
                      tour.imageUrl
                        ? fixDriveUrl(tour.imageUrl)
                        : "https://via.placeholder.com/300x200"
                    } // Áp dụng fixDriveUrl
                    alt={tour.tourName}
                    className="tour-image"
                  />
                  <div className="tour-info">
                    <h1 className="title-tour">{tour.tourName}</h1>
                    <div className="tour-sub-info">
                      <div className="info-1">
                        <p className="info-tour">
                          <FaIdBadge /> <strong>Mã tour:</strong> {tour.tourId || "N/A"}
                        </p>
                        <p className="info-tour">
                          <FaPlaneDeparture /> <strong>Khởi hành:</strong>{" "}
                          {formatDate(tour.nextDeparture?.departureDate)}
                        </p>
                        <p className="info-tour">
                          <FaMapMarkerAlt /> <strong>Điểm đến:</strong>{" "}
                          {tour.destination || "N/A"}
                        </p>
                      </div>
                      <div className="info-2">
                        <p className="info-tour">
                          <FaFlag /> <strong>Điểm khởi hành:</strong>{" "}
                          {tour.departurePoint || "N/A"}
                        </p>
                        <p className="info-tour">
                          <FaBus /> <strong>Phương tiện:</strong>{" "}
                          {tour.transportation || "N/A"}
                        </p>
                        <p className="info-tour">
                          <FaClock /> <strong>Thời gian đi:</strong>{" "}
                          {tour.durationDays || "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="price-tour">
                      <div className="info-price">
                        <strong>Giá từ:</strong>
                        <div className="price" style={{ fontWeight: "bold" }}>
                          {formatVND(tour.price)}
                        </div>
                      </div>
                      <button
                        className="btn-detail-tour"
                        onClick={() => {
                          navigate(`/tour/tour-detail/${tour.tourId}`);
                        }}
                      >
                        Xem chi tiết
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>Không tìm thấy tour nào phù hợp với bộ lọc.</p>
            )}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  className={i + 1 === currentPage ? "active" : ""}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Tours;