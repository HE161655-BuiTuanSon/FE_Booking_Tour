import React, { useEffect, useState } from "react";
import { getAllConsultation } from "../../services/Client/reviewService";
import {
  Button,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

function ListConsultation(props) {
  const [consultation, setConsultation] = useState([]);
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  if (role !== "1") {
    navigate("/");
  }
  useEffect(() => {
    fetchConsultation();
  }, []);

  const fetchConsultation = async () => {
    try {
      const data = await getAllConsultation();
      setConsultation(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Button variant="outlined" onClick={() => navigate("/dashboard")}>
        Quay lại
      </Button>
      <Typography align="center" variant="h3" gutterBottom>
        Danh sách liên hệ
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead
            sx={{ backgroundColor: (theme) => theme.palette.primary.main }}
          >
            <TableRow>
              <TableCell sx={{ color: "white" }}>ID</TableCell>
              <TableCell sx={{ color: "white" }}>Họ tên</TableCell>
              <TableCell sx={{ color: "white" }}>SĐT</TableCell>
              <TableCell sx={{ color: "white" }}>Email</TableCell>
              <TableCell sx={{ color: "white" }}>Tiêu đề</TableCell>
              <TableCell sx={{ color: "white" }}>Nội dung</TableCell>
              <TableCell sx={{ color: "white" }}>Ngày tạo</TableCell>
              <TableCell sx={{ color: "white" }}>Loại</TableCell>
              <TableCell sx={{ color: "white" }}>Công ty</TableCell>
              <TableCell sx={{ color: "white" }}>Địa chỉ</TableCell>
              <TableCell sx={{ color: "white" }}>Số khách</TableCell>
              <TableCell sx={{ color: "white" }}>Trạng thái</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {consultation.map((item) => (
              <TableRow key={item.consultationId}>
                <TableCell>{item.consultationId}</TableCell>
                <TableCell>{item.fullName}</TableCell>
                <TableCell>{item.phone}</TableCell>
                <TableCell>{item.email}</TableCell>
                <TableCell>{item.title}</TableCell>
                <TableCell>{item.additionalInfo}</TableCell>
                <TableCell>
                  {new Date(item.createdAt).toLocaleString("vi-VN")}
                </TableCell>
                <TableCell>{item.informationType}</TableCell>
                <TableCell>{item.companyName}</TableCell>
                <TableCell>{item.address}</TableCell>
                <TableCell>{item.clientNumber}</TableCell>
                <TableCell>{item.status}</TableCell>
              </TableRow>
            ))}
            {consultation.length === 0 && (
              <TableRow>
                <TableCell colSpan={12} align="center">
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default ListConsultation;
