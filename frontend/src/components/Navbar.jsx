import { TfiAlignJustify } from "react-icons/tfi";
import { useState } from "react";
import "../style.css";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <h2>
        Bimlesh<span>Yadav</span>
      </h2>

      <div className="links">
        <a href="#home">Home</a>
        <a href="#about">About</a>
        <a href="#projects">Projects</a>
        <a href="#certificates">Certificates</a>
        <a href="#contact">Contact</a>
      </div>

      {/* 🔥 ICON */}
      <div className="menu-icon" onClick={() => setOpen(!open)}>
        <TfiAlignJustify />
      </div>

      {/* 🔽 DROPDOWN */}
      {open && (
        <div className="dropdown">
          <p>👤 Bimlesh</p>

          {!localStorage.getItem("admin") ? (
           <button onClick={() => navigate("/admin-login")}>
              Admin Login
            </button>
          ) : (
           <button onClick={() => navigate("/admin")}>
              Dashboard
            </button>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;