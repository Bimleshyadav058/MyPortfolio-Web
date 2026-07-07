import { useEffect, useState } from "react";
import axios from "axios";

function Certificates() {

  const [certificates, setCertificates] = useState([]);

 useEffect(() => {
  axios
    .get(`${import.meta.env.VITE_API_URL}/certificates`)
    .then((res) => setCertificates(res.data))
    .catch(console.log);
}, []);

return (
 <section className="certificates-section">
  <h1>Certificates</h1>

  <div className="certificates-grid">
    {certificates.map((cert) => (
  <div className="certificate-card" key={cert.id}>
    <img
      src={cert.file}
      alt={cert.title}
      className="certificate-image"
    />

    <div className="certificate-content">
      <h3>{cert.title}</h3>

      <div className="certificate-links">
        <a href={cert.file} target="_blank" rel="noreferrer">
          View Certificate
        </a>
      </div>
    </div>
  </div>
))}
  </div>
</section>
);
}

export default Certificates;