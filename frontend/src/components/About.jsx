import "../style.css";

function About() {

  const downloadResume = async () => {
    try {
     const res = await fetch(`${import.meta.env.VITE_API_URL}/download-resume`);
const data = await res.json();

      if (data.url) {
        window.open(data.url, "_blank");
      } else {
        alert("Resume not found");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to load resume");
    }
  };

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
            <button
              className="btn"
              onClick={downloadResume}
            >
              View Resume
            </button>

            {/* ✅ DOWNLOAD */}
            <button
              onClick={downloadResume}
              style={{
                marginLeft: "15px",
                color: "orange",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "16px"
              }}
            >
              Download Resume
            </button>

          </div>
        </div>

      </div>

    </section>
  );
}

export default About;