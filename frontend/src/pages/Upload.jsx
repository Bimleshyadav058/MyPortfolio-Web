import { useState } from "react";
import axios from "axios";

function Upload() {
  const [form, setForm] = useState({});

  const submit = async () => {
    const data = new FormData();

    Object.keys(form).forEach((k) => data.append(k, form[k]));

    await axios.post(
      `${import.meta.env.VITE_API_URL}/upload-project`,
      data
    );

    alert("Uploaded 🚀");
  };

  return (
    <div>
      <h2>Upload Project</h2>

      <input
        placeholder="Title"
        onChange={(e) =>
          setForm({ ...form, title: e.target.value })
        }
      />

      <input
        placeholder="Description"
        onChange={(e) =>
          setForm({ ...form, description: e.target.value })
        }
      />

      <input
        placeholder="GitHub"
        onChange={(e) =>
          setForm({ ...form, github: e.target.value })
        }
      />

      <input
        placeholder="Live Link"
        onChange={(e) =>
          setForm({ ...form, live: e.target.value })
        }
      />

      <button onClick={submit}>Upload</button>
    </div>
  );
}

export default Upload;