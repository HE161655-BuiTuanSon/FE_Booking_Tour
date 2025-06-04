import React, { useEffect, useState } from "react";
import { getAllTour } from "../../services/Client/TourService";
import {
  createTour,
  deleteTour,
  updateTour,
} from "../../services/Admin/CRUDTourService";

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
    CreateTourDeparture: [],
    images: [],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [currentPage] = useState(1);
  const pageSize = 10;

  // Mới: popup show/hide
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    try {
      const data = await getAllTour(currentPage, pageSize);
      setTours(data.tours);
      console.log(data);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách tour", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updateTour(editId, formData);
      } else {
        await createTour(formData);
      }
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
      setShowPopup(false); // Đóng popup sau khi tạo hoặc sửa
      fetchTours();
    } catch (err) {
      console.error("Lỗi khi submit tour", err);
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
      TourName: tour.tourName,
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
    setShowPopup(true); // Mở popup khi sửa
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Mở popup tạo mới
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
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>Quản lý Tour</h2>

      <button onClick={handleCreateNew} style={{ marginBottom: "20px" }}>
        Tạo mới Tour
      </button>

      {/* POPUP FORM */}
      {showPopup && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              maxHeight: "90vh",
              overflowY: "auto",
              width: "400px",
            }}
          >
            <h3>{isEditing ? "Cập nhật Tour" : "Tạo mới Tour"}</h3>
            <form onSubmit={handleSubmit}>
              <input
                name="TourName"
                value={formData.TourName}
                onChange={handleChange}
                placeholder="Tên tour"
                required
                style={{ width: "100%", marginBottom: "8px" }}
              />
              <input
                name="Description"
                value={formData.Description}
                onChange={handleChange}
                placeholder="Mô tả"
                style={{ width: "100%", marginBottom: "8px" }}
              />
              <input
                name="DurationDays"
                value={formData.DurationDays}
                onChange={handleChange}
                placeholder="Số ngày"
                style={{ width: "100%", marginBottom: "8px" }}
              />
              <input
                type="number"
                name="Price"
                value={formData.Price}
                onChange={handleChange}
                placeholder="Giá"
                style={{ width: "100%", marginBottom: "8px" }}
              />
              <input
                type="number"
                name="DestinationId"
                value={formData.DestinationId}
                onChange={handleChange}
                placeholder="ID Điểm đến"
                style={{ width: "100%", marginBottom: "8px" }}
              />
              <input
                type="number"
                name="CategoryId"
                value={formData.CategoryId}
                onChange={handleChange}
                placeholder="ID Thể loại"
                style={{ width: "100%", marginBottom: "8px" }}
              />
              <input
                type="number"
                name="DeparturePointId"
                value={formData.DeparturePointId}
                onChange={handleChange}
                placeholder="ID Điểm khởi hành"
                style={{ width: "100%", marginBottom: "8px" }}
              />
              <input
                type="number"
                name="TransportationMethodId"
                value={formData.TransportationMethodId}
                onChange={handleChange}
                placeholder="ID Phương tiện"
                style={{ width: "100%", marginBottom: "8px" }}
              />
              <input
                type="number"
                name="MaxParticipants"
                value={formData.MaxParticipants}
                onChange={handleChange}
                placeholder="Số người tối đa"
                style={{ width: "100%", marginBottom: "8px" }}
              />
              <input
                name="SightseeingSpot"
                value={formData.SightseeingSpot}
                onChange={handleChange}
                placeholder="Điểm tham quan"
                style={{ width: "100%", marginBottom: "8px" }}
              />
              <input
                name="Cuisine"
                value={formData.Cuisine}
                onChange={handleChange}
                placeholder="Ẩm thực"
                style={{ width: "100%", marginBottom: "8px" }}
              />
              <input
                name="SuitableSubject"
                value={formData.SuitableSubject}
                onChange={handleChange}
                placeholder="Đối tượng phù hợp"
                style={{ width: "100%", marginBottom: "8px" }}
              />
              <input
                name="IdealTime"
                value={formData.IdealTime}
                onChange={handleChange}
                placeholder="Thời điểm lý tưởng"
                style={{ width: "100%", marginBottom: "8px" }}
              />
              <input
                name="Vehicle"
                value={formData.Vehicle}
                onChange={handleChange}
                placeholder="Phương tiện di chuyển"
                style={{ width: "100%", marginBottom: "8px" }}
              />
              <input
                name="Promotion"
                value={formData.Promotion}
                onChange={handleChange}
                placeholder="Khuyến mãi"
                style={{ width: "100%", marginBottom: "8px" }}
              />

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <button type="submit">
                  {isEditing ? "Cập nhật" : "Tạo mới"}
                </button>
                <button type="button" onClick={() => setShowPopup(false)}>
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DANH SÁCH TOUR */}
      <table
        border="1"
        cellPadding="10"
        style={{ width: "100%", borderCollapse: "collapse" }}
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên Tour</th>
            <th>Mô tả</th>
            <th>Thời lượng</th>
            <th>Giá</th>
            <th>Phương tiện</th>
            <th>Điểm đến</th>
            <th>Loại</th>
            <th>Điểm xuất phát</th>
            <th>Số lượng tối đa</th>
            <th>Khởi hành tiếp theo</th>
            <th>Ảnh</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {tours.map((tour) => (
            <tr key={tour.tourId}>
              <td>{tour.tourId}</td>
              <td>{tour.tourName}</td>
              <td>{tour.description}</td>
              <td>{tour.durationDays}</td>
              <td>{tour.price.toLocaleString()} đ</td>
              <td>{tour.vehicle}</td>
              <td>{tour.destination}</td>
              <td>{tour.category}</td>
              <td>{tour.departurePoint}</td>
              <td>{tour.maxParticipants}</td>
              <td>
                {tour.nextDeparture
                  ? new Date(tour.nextDeparture).toLocaleDateString()
                  : "Chưa có"}
              </td>
              <td>
                {tour.imageUrl ? (
                  <img
                    src={`https://your-image-host/${tour.imageUrl}`}
                    alt={tour.tourName}
                    style={{ width: "100px", height: "auto" }}
                  />
                ) : (
                  "Không có ảnh"
                )}
              </td>
              <td>
                <button onClick={() => handleEdit(tour)}>Sửa</button>
                <button onClick={() => handleDelete(tour.tourId)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManageTours;
