import React, { useEffect, useState } from "react";
import "./LoginRegisterPopup.css";
import { login } from "../../services/Client/loginService";
import { register } from "../../services/Client/registerService";
import Swal from "sweetalert2";
function LoginRegisterPopup({ onClose }) {
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpPhone, setSignUpPhone] = useState("");
  const [signUpAddress, setSignUpAddress] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const signUpButton = document.getElementById("signUp");
    const signInButton = document.getElementById("signIn");
    const container = document.getElementById("contain");

    if (signUpButton && signInButton && container) {
      signUpButton.addEventListener("click", () => {
        container.classList.add("right-panel-active");
      });

      signInButton.addEventListener("click", () => {
        container.classList.remove("right-panel-active");
      });
    }

    return () => {
      if (signUpButton && signInButton) {
        signUpButton.removeEventListener("click", () => {});
        signInButton.removeEventListener("click", () => {});
      }
    };
  }, []);

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const data = await login(signInEmail, signInPassword);
      console.log("Login successful:", data);
      onClose();
      Swal.fire({
        icon: "success",
        title: "Đăng nhập thành công!",
        confirmButtonText: "OK",
      });
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.roleId);
    } catch (err) {
      console.error("Login failed:", err);
      setError("Login failed. Please check your credentials.");
    }
  };
  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const data = await register(
        signUpName,
        signUpEmail,
        signUpPassword,
        signUpPhone,
        signUpAddress
      );
      Swal.fire({
        icon: "success",
        title: "Đăng ký thành công!",
        text: "Bây giờ bạn có thể đăng nhập.",
        confirmButtonText: "OK",
      }).then(() => {
        const signInButton = document.getElementById("signIn");
        if (signInButton) signInButton.click();
      });
      setSignUpAddress("");
      setSignUpEmail("");
      setSignUpPassword("");
      setSignUpPhone("");
      setSignUpName("");
    } catch (err) {
      console.error("Register failed:", err);

      if (err.response && err.response.data) {
        setError(err.response.data || "Registration failed.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content" style={{ maxWidth: "900px" }}>
        <button className="close-btn" onClick={onClose}>
          ×
        </button>

        <div className="contain" id="contain">
          {/* Form đăng ký */}
          <div className="form-container sign-up-container">
            <form className="form" onSubmit={handleSignUpSubmit}>
              <h1>Create Account</h1>
              <span className="span">or use your email for registration</span>
              <input
                type="text"
                placeholder="Name"
                value={signUpName}
                onChange={(e) => setSignUpName(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={signUpEmail}
                onChange={(e) => setSignUpEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={signUpPassword}
                onChange={(e) => setSignUpPassword(e.target.value)}
                required
              />
              <input
                type="tel"
                placeholder="Phone"
                value={signUpPhone}
                onChange={(e) => setSignUpPhone(e.target.value)}
              />
              <input
                type="text"
                placeholder="Address"
                value={signUpAddress}
                onChange={(e) => setSignUpAddress(e.target.value)}
              />
              <button type="submit">Sign Up</button>
              {error && (
                <p style={{ color: "red", marginTop: "10px" }}>{error}</p>
              )}
            </form>
          </div>

          {/* Form đăng nhập */}
          <div className="form-container sign-in-container">
            <form className="form" onSubmit={handleSignInSubmit}>
              <h1>Sign in</h1>
              <span className="span">or use your account</span>
              <input
                type="email"
                placeholder="Email"
                value={signInEmail}
                onChange={(e) => setSignInEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={signInPassword}
                onChange={(e) => setSignInPassword(e.target.value)}
                required
              />
              <a href="#">Forgot your password?</a>

              <button type="submit">Sign In</button>
              {error && <p style={{ color: "red" }}>{error}</p>}
            </form>
          </div>

          {/* Overlay */}
          <div className="overlay-container">
            <div className="overlay">
              <div className="overlay-panel overlay-left">
                <h1>Welcome Back!</h1>
                <p>
                  To keep connected with us please login with your personal info
                </p>
                <button className="ghost" id="signIn">
                  Sign In
                </button>
              </div>
              <div className="overlay-panel overlay-right">
                <h1>Hello, Friend!</h1>
                <p>Enter your personal details and start journey with us</p>
                <button className="ghost" id="signUp">
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginRegisterPopup;
