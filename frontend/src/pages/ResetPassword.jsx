import { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ResetPassword() {

  const { token } = useParams();

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const changePassword = async () => {

    try {

      const res = await axios.post(
  `${import.meta.env.VITE_API_URL}/reset-password/${token}`,
  { password }
);

      if (res.data.success) {

        setMessage("Password Changed Successfully ✅");

        setTimeout(() => {
  window.location.replace("/admin-login");
}, 1500);

      } else {

        setMessage("Invalid Token ❌");
      }

    } catch (err) {

      setMessage("Error Occurred ❌");
    }
  };

  return (

    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#000",
        color: "white"
      }}
    >

      {/* CARD */}
      <div
        style={{
          width: "350px",
          padding: "40px",
          borderRadius: "20px",
          background: "#111",
          boxShadow: "0 0 25px orange",
          textAlign: "center",
          border: "2px solid orange"
        }}
      >

        <h1
          style={{
            marginBottom: "30px",
            color: "orange"
          }}
        >
          Reset Password
        </h1>

        <input
          type="password"
          placeholder="Enter New Password"
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
            marginBottom: "20px",
            boxSizing: "border-box"
          }}
        />

        <button
          onClick={changePassword}
          style={{
            width: "100%",
            padding: "12px",
            border: "none",
            borderRadius: "10px",
            background: "orange",
            color: "black",
            fontWeight: "bold",
            cursor: "pointer",
            fontSize: "16px"
          }}
        >
          Update Password
        </button>

        {/* MESSAGE */}
        {message && (
          <p
            style={{
              marginTop: "20px",
              color: "orange",
              fontWeight: "bold"
            }}
          >
            {message}
          </p>
        )}

      </div>

    </div>
  );
}

export default ResetPassword;