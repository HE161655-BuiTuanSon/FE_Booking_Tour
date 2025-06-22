import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

function ListBooking() {
  const [bookings, setBookings] = useState([]);
  const role = localStorage.getItem("role");
  const navigate = useNavigate();
  if (role !== "1") {
    navigate("/");
  }
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get("http://vivutravel.net/api/Bookings");
        setBookings(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchBookings();
  }, []);

  return (
    <TableContainer
      component={Paper}
      sx={{ mt: 4, mx: "auto", maxWidth: "95%" }}
    >
      <Button variant="outlined" onClick={() => navigate("/dashboard")}>
        Quay lại
      </Button>
      <Typography variant="h5" sx={{ p: 2 }}>
        Danh sách đặt tour
      </Typography>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: "primary.main" }}>
            <TableCell>
              <strong>User</strong>
            </TableCell>
            <TableCell>
              <strong>Tour</strong>
            </TableCell>
            <TableCell>
              <strong>Booking Date</strong>
            </TableCell>
            <TableCell>
              <strong>Số người</strong>
            </TableCell>
            <TableCell>
              <strong>Tổng tiền</strong>
            </TableCell>
            <TableCell>
              <strong>Trạng thái</strong>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {bookings.map((booking) => (
            <TableRow key={booking.bookingId}>
              <TableCell>{booking.user.username}</TableCell>
              <TableCell>{booking.tour.tourName}</TableCell>
              <TableCell>
                {new Date(booking.bookingDate).toLocaleDateString("vi-VN")}
              </TableCell>
              <TableCell>{booking.numberOfParticipants}</TableCell>
              <TableCell>
                {booking.totalAmount.toLocaleString("vi-VN")} VND
              </TableCell>
              <TableCell>{booking.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default ListBooking;
