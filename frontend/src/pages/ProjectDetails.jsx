import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "../style.css";

function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState({});

  useEffect(() => {
    axios.get(`http://127.0.0.1:5000/project/${id}`)
      .then(res => setProject(res.data));
  }, []);

  return (
    <div className="container">
      <h1>{project.title}</h1>
      <p>{project.description}</p>

      <a className="btn" href={project.github} target="_blank">Source Code</a>
      <a className="btn" href={project.live} target="_blank">Live Demo</a>
    </div>
  );
}

export default ProjectDetails;