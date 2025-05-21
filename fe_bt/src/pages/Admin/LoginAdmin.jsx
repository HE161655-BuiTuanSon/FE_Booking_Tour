import React, { useEffect, useState } from "react";
import { loginAdmin } from "../../services/Admin/loginAdminService";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../../styles/Admin/LoginAdmin.css";

function LoginAdmin(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    localStorage.clear();
  }, []);
  const handleLogin = async () => {
    try {
      const response = await loginAdmin(email, password);
      console.log("Login thành công:", response);
      Swal.fire({
        icon: "success",
        title: "Đăng nhập thành công!",
        confirmButtonText: "OK",
      });
      localStorage.setItem("token", response.token);
      navigate("/dashboard");
    } catch (err) {
      console.error("Đăng nhập thất bại:", err);
      setError("Sai tài khoản hoặc mật khẩu");
    }
  };
  const handleBack = () => {
    navigate("/");
  };
  return (
    <div className="login-container">
      <div className="btn-back-home">
        <button className="back" onClick={handleBack}>
          Back to home
        </button>
      </div>
      <div className="login-box">
        <h2>Đăng nhập Admin</h2>
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Đăng nhập</button>
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
}

export default LoginAdmin;
