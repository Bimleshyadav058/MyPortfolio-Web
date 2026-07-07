import { useState, useEffect } from "react";
import axios from "axios";
import "../style.css";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

function Admin() {

  // ===== STATES =====
  const [projects, setProjects] = useState([]);
  const [toast, setToast] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [github, setGithub] = useState("");
  const [live, setLive] = useState("");
  const [image, setImage] = useState(null);
  const [ppt, setPpt] = useState(null);
  const [resume, setResume] = useState(null);
  const [certificateTitle, setCertificateTitle] = useState("");
const [certificateFile, setCertificateFile] = useState(null);
const [certificates, setCertificates] = useState([]);
  const [editId, setEditId] = useState(null);
  const certificateRef = useRef(null);
  const navigate = useNavigate();


  const handleEdit = (p) => {
  setTitle(p.title || "");
  setDescription(p.description || "");
  setGithub(p.github || "");
  setLive(p.live || "");
  setEditId(p.id);

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
};

 // ===== FETCH PROJECTS =====
const loadProjects = () => {
  axios.get(`${import.meta.env.VITE_API_URL}/projects`)
      .then(res => setProjects(res.data))
      .catch(err => console.log(err));
  };
useEffect(() => {
  const isAdmin = localStorage.getItem("admin");

  if (isAdmin !== "true") {
    navigate("/admin-login");
    return;
  }

  loadProjects();
  loadCertificates();
}, []);

console.log(projects); // 👈 ADD THIS

// ===== FETCH PROJECTS =====
const loadProjects = () => {
  axios.get(`${import.meta.env.VITE_API_URL}/projects`)

    .then((res) => setCertificates(res.data))
    .catch(console.log);
};

  // ===== SHOW TOAST =====
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  // ===== UPLOAD PROJECT =====
const uploadProject = async () => {
  try {
    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);
    formData.append("github", github);
    formData.append("live", live);

    if (image) {
  formData.append("image", image);
}

    if (ppt) {
      formData.append("ppt", ppt);
    }
    


    if (editId) {

      await axios.put(
        `${import.meta.env.VITE_API_URL}/edit-project/${editId}`,
        formData
      );

      showToast("Project Updated ✅");
      setEditId(null);

    } else {

     await axios.post(
  `${import.meta.env.VITE_API_URL}/upload-project`,
  formData
);

      showToast("Project Uploaded ✅");
    }

    loadProjects();

    // RESET INPUTS
    setTitle("");
    setDescription("");
    setGithub("");
    setLive("");
    setImage(null);
    setPpt(null);
    setResume(null);

    document.querySelector('input[type="file"]').value = "";

  } catch (err) {
    console.log(err);
    showToast("Error ❌");
  }
};

  // ===== DELETE PROJECT =====
  const deleteProject = async (id) => {
    try {
     await axios.delete(
  `${import.meta.env.VITE_API_URL}/delete-project/${id}`
);
      showToast("Project Deleted ✅");
      loadProjects();
    } catch (err) {
      showToast("Delete Failed ❌");
    }
  };

  // ===== UPLOAD CERTIFICATE =====
  const uploadCertificate = async () => {

  try {

    const formData = new FormData();

    formData.append(
      "title",
      certificateTitle
    );

    formData.append(
      "file",
      certificateFile
    );

    await axios.post(
      `${import.meta.env.VITE_API_URL}/upload-certificate`,
      formData
    );

    showToast("Certificate Uploaded ✅");

    setCertificateTitle("");
    setCertificateFile(null);
    if (certificateRef.current) {
  certificateRef.current.value = "";
}

    loadCertificates();

  } catch {

    showToast("Upload Failed ❌");
  }
};



// ===== DELETE CERTIFICATE =====

const deleteCertificate = async (id) => {
  try {
    await axios.delete(
      `${import.meta.env.VITE_API_URL}/delete-certificate/${id}`
    );

    showToast("Certificate Deleted ✅");

    loadCertificates();

  } catch (err) {
    showToast("Delete Failed ❌");
  }
};

  // ===== RESUME UPLOAD =====
  const uploadResume = async () => {
    try {
      const formData = new FormData();
      formData.append("file", resume);

      await axios.post(
  `${import.meta.env.VITE_API_URL}/upload-resume`,
  formData
);

      showToast("Resume Uploaded ✅");

    } catch (err) {
      showToast("Error Uploading Resume ❌");
    }
  };

  return (
    <div className="admin">

      {/* 🔥 SINGLE TOAST */}
      {toast && <div className="toast">{toast}</div>}

<div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  }}
>
  <h1>Admin Dashboard</h1>

  <button
  onClick={() => {
    localStorage.removeItem("admin");
    window.location.href = "/";
  }}

  style={{
    background: "orange",
    color: "black",
    border: "none",
    padding: "12px 22px",
    borderRadius: "10px",
    fontWeight: "bold",
    cursor: "pointer",
    boxShadow: "0 0 10px orange",
    transition: "0.3s"
  }}

  onMouseOver={(e) => {
    e.target.style.transform = "scale(1.05)";
  }}

  onMouseOut={(e) => {
    e.target.style.transform = "scale(1)";
  }}
>
  Logout 🚪
</button>
</div>

      {/* ===== PROJECT FORM ===== */}
      <div className="admin-box">
        <h2>Upload Project</h2>

      <input
  placeholder="Title"
  value={title}
  onChange={(e) => setTitle(e.target.value)}
/>

<input
  placeholder="Description"
  value={description}
  onChange={(e) => setDescription(e.target.value)}
/>

<input
  placeholder="GitHub Link"
  value={github}
  onChange={(e) => setGithub(e.target.value)}
/>

<input
  placeholder="Live Link"
  value={live}
  onChange={(e) => setLive(e.target.value)}
/>


<p style={{ color: "orange", marginBottom: "5px" }}>
  Choose Project Image
</p>

<input
  type="file"
  onChange={(e) => setImage(e.target.files[0])}
/>

<p
  style={{
    color: "orange",
    marginTop: "15px",
    marginBottom: "5px"
  }}
>
  Upload PPT
</p>

<input
  type="file"
  accept=".ppt,.pptx"
  onChange={(e) => setPpt(e.target.files[0])}
/>


<button onClick={uploadProject}>
  {editId ? "Update Project" : "Upload Project"}
</button>

      </div>

      {/* ===== PROJECT LIST ===== */}
      <div className="admin-box">
        <h2>Your Projects</h2>

       {projects.length === 0 ? (
  <p>No Projects Found ❌</p>
) : (
  projects.map((p) => (
    <div
  key={p.id}
  className="admin-card"
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    borderBottom: "1px solid gray",
    paddingBottom: "15px"
  }}
>
  <div>
    <h3>{p.title}</h3>
  </div>

  {p.image && (
    <img
      src={p.image}
      alt="project"
      style={{
        width: "120px",
        height: "70px",
        objectFit: "cover"
      }}
    />
  )}

  <div style={{ display: "flex", gap: "10px" }}>
    <button onClick={() => handleEdit(p)}>
      Edit ✏️
    </button>

    <button onClick={() => deleteProject(p.id)}>
      Delete ❌
    </button>
  </div>
</div>
  ))
)}
      </div>

      {/* ===== RESUME ===== */}
      <div className="admin-box">
        <h2>Upload Resume</h2>

        <input type="file" onChange={(e) => setResume(e.target.files[0])} />
        <button onClick={uploadResume}>Update Resume</button>
      </div>

     <div className="admin-box">

  <h2>Upload Certificate</h2>

  <input
    placeholder="Certificate Title"
    value={certificateTitle}
    onChange={(e) =>
      setCertificateTitle(
        e.target.value
      )
    }
  />

 
  <input
  type="file"
  ref={certificateRef}
  onChange={(e) =>
    setCertificateFile(
      e.target.files[0]
    )
  }
/>
<button
  className="upload-btn"
  onClick={uploadCertificate}
>
  Upload Certificate
</button>

<div className="admin-box">
  <h2>Certificates</h2>

  {certificates.map((cert) => (
    <div
  key={cert.id}
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 0",
    borderBottom: "1px solid #444"
  }}
>
  <span
    style={{
      color: "white",
      fontSize: "18px",
      fontWeight: "500"
    }}
  >
    {cert.title}
  </span>

  <button
    onClick={() => deleteCertificate(cert.id)}
    style={{
      background: "#f5a623",
      color: "#000",
      border: "none",
      padding: "10px 18px",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "bold"
    }}
  >
    Delete ❌
  </button>
</div>
  ))}
</div>


</div>

    </div>
  );
}

export default Admin;