import "../style.css";

function About() {
  return (
    <section className="about" id="about">

      <div className="about-container">
        
        {/* LEFT IMAGE */}
        <div className="about-img">
          <img src="/profile.jpg" alt="profile" />
        </div>

        {/* RIGHT CONTENT */}
        <div className="about-text">
          <h1>
            About <span>Me</span>
          </h1>

          <p>
            Hi, I'm <b>Bimlesh Yadav</b> — a passionate Web Developer.
            I build modern, responsive, and user-friendly websites using 
            React, Flask, and modern technologies.
          </p>

          <p>
            I love solving problems, building projects, and learning new skills.
            Currently focusing on Full Stack Development.
          </p>

          <div style={{ marginTop: "20px" }}>
            
            {/* ✅ VIEW */}
            <a
              className="btn"
              href="http://127.0.0.1:5000/download-resume"
              target="_blank"
              rel="noreferrer"
            >
              View Resume
            </a>

            {/* ✅ DOWNLOAD */}
            <a
              href="http://127.0.0.1:5000/download-resume"
              target="_blank"
              style={{ marginLeft: "15px", color: "orange" }}
            >
              Download Resume
            </a>

          </div>
        </div>

      </div>

    </section>
  );
}

export default About;