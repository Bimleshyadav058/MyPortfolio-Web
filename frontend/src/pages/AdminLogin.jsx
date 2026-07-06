import { useState } from "react";
import axios from "axios";
import "../style.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function AdminLogin() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState("");
  

  const login = async () => {
    try {
      const res = await axios.post("http://127.0.0.1:5000/admin-login", {
        password
      });

      if (res.data.success) {
        localStorage.setItem("admin", "true");
        window.location.href = "/admin";
      } else {
        setToast("Wrong Password ❌");
      }
    } catch {
      setToast("Server Error ❌");
    }

    setTimeout(() => setToast(""), 3000);
  };

  const forgotPassword = async () => {
    try {
      const res = await axios.post("http://127.0.0.1:5000/forgot-password", {
        email: "yadavbimleshnarayan98@gmail.com"
      });

      setToast("Reset Password Link Sent To Admin Mail 📩");
    } catch {
      setToast("Error sending mail ❌");
    }

    setTimeout(() => setToast(""), 3000);
  };

  return (
    <div className="login-container">

      {toast && <div className="toast">{toast}</div>}

      <div className="login-box">
        <h1>Admin <span>Login</span></h1>

        <div
  style={{
    position: "relative",
    width: "100%"
  }}
>

  <input
    type={showPassword ? "text" : "password"}
    placeholder="Enter Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}

    style={{
      width: "100%",
      padding: "12px",
      borderRadius: "10px",
      border: "2px solid orange",
      background: "#000",
      color: "white",
      outline: "none",
      boxSizing: "border-box"
    }}
  />

  <span
    onClick={() => setShowPassword(!showPassword)}

    style={{
      position: "absolute",
      right: "15px",
      top: "40%",
      transform: "translateY(-50%)",
      cursor: "pointer",
      color: "orange"
    }}
  >
    {showPassword ? <FaEyeSlash /> : <FaEye />}
  </span>

</div>
        <button onClick={login}>Login</button>

        <p
  onClick={forgotPassword}
  style={{
    color: "orange",
    cursor: "pointer",
    marginTop: "10px"
  }}
>
  Forgot Password?
</p>
      </div>
    </div>
  );
}

export default AdminLogin;