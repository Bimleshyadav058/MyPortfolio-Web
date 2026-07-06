import "../style.css";
import { FaGithub, FaLinkedin, FaHackerrank } from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";

function Hero() {
  return (
    <section className="hero" id="home">
      
      {/* LEFT SIDE */}
      <div className="hero-left">
        <h1>
          Hi, I am <span>Bimlesh</span>
        </h1>

        <h2>I'm a Full Stack Developer</h2>

        <p>
          I build modern web apps using React & Flask.
          Passionate about coding & debugging.
        </p>

        {/* SOCIAL ICONS */}
        <div className="socials">
          <a href="https://github.com/Bimleshyadav058" target="_blank" rel="noreferrer">
            <FaGithub />
          </a>

          <a href="https://www.linkedin.com/in/bimlesh-yadav-b909512a8/" target="_blank" rel="noreferrer">
            <FaLinkedin />
          </a>

          <a href="https://leetcode.com/u/Bimleshyadav058/" target="_blank" rel="noreferrer">
            <SiLeetcode />
          </a>

          <a href="https://www.hackerrank.com/profile/Bimleshyadav058" target="_blank" rel="noreferrer">
            <FaHackerrank />
          </a>
        </div>

        {/* BUTTON */}
        <a href="#contact" className="btn">Hire Me</a>
      </div>

      {/* RIGHT SIDE IMAGE */}
      <div className="hero-right">
        <img src="/profile.jpg" alt="profile" />
      </div>

    </section>
  );
}

export default Hero;