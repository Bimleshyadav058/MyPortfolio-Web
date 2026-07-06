import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import About from "../components/About";
import Projects from "../components/Project";
import Contact from "../components/Contact";
import Certificates from "../components/Certificates";

function Home() {
  return (
    <>
      <Navbar />

      <main>
        <section id="home">
          <Hero />
        </section>

        <section id="about">
          <About />
        </section>

        <section id="projects">
          <Projects />
        </section>
           <section id="certificates">
  <Certificates />
</section>

        <section id="contact">
          <Contact />
        </section>
     
      </main>
    </>
  );
}

export default Home;