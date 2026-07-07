import { useEffect, useState } from "react";
import axios from "axios";
import "../style.css";

function Project() {
  const [projects, setProjects] = useState([]);
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
  axios
    .get(`${import.meta.env.VITE_API_URL}/projects`)
    .then(res => setProjects(res.data));
}, []);

  const toggleProject = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="projects">
      <h1>Projects</h1>

      <div className="grid">
        {projects.map((p) => (
          <div className="card" key={p.id}>

            {/* IMAGE */}
            {p.image && (
              <img src={p.image} alt="project" className="project-img" />
            )}

            <h2>{p.title}</h2>
            <p>{p.description}</p>

            <button className="btn" onClick={() => toggleProject(p.id)}>
              View Project
            </button>

            {/* 🔥 ONLY SELECTED CARD SHOW */}
            {openId === p.id && (
              <div className="project-links">

                {/* GITHUB */}
                {p.github ? (
                  <a href={p.github} target="_blank">
                    GitHub
                  </a>
                ) : (
                  <span className="disabled-link">GitHub Link Not Available</span>
                )}

                {/* LIVE */}
                {p.live ? (
                  <a href={p.live} target="_blank">
                    Live
                  </a>
                ) : (
                  <span className="disabled-link">Live Link Not Available</span>
                )}

                {/* PPT */}
                {p.ppt ? (
                  <a href={p.ppt} target="_blank">
                    PPT
                  </a>
                ) : (
                  <span className="disabled-link">PPT Not Available</span>
                )}


              </div>
            )}

          </div>
        ))}
      </div>
    </section>
  );
}

export default Project;