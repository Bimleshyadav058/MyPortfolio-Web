import "../style.css";
import axios from "axios";
import { useState } from "react";

function Contact() {
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async (e) => {
    e.preventDefault();

    const form = e.target;

    const data = {
  name: form.name.value,
  email: form.email.value,
  subject: form.subject.value,
  message: form.message.value
};

    try {
      setLoading(true);

      const res = await axios.post(
  `${import.meta.env.VITE_API_URL}/contact`,
  data
);

      if (res.data.success) {
        setToast("Message Sent ✅");

        form.reset();

        setTimeout(() => {
          setToast("");
        }, 3000);
      }

    } catch (err) {
      setToast("Error ❌");

      setTimeout(() => {
        setToast("");
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="contact" id="contact">
      <h1>Contact Me</h1>

      {/* 🔥 TOAST MESSAGE */}
      {toast && <div className="toast">{toast}</div>}

      <form onSubmit={send}>
        <div className="contact-box">

          <div className="contact-left">
            <input name="name" placeholder="Name" required />
            <input name="email" placeholder="Email" required />
            <input name="subject" placeholder="Subject" />
          </div>

          <div className="contact-right">
            <textarea name="message" placeholder="Message" required />
          </div>

        </div>

        <button className="send-btn" disabled={loading}>
          {loading ? "Sending..." : "Send Message"}
        </button>
      </form>
    </section>
  );
}

export default Contact;