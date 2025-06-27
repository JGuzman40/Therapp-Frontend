import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function SegmentosForm() {
  const { id: eventId } = useParams(); // id del evento desde la URL
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    topics: "",
    startDate: "",
    endDate: "",
  });

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("eventId", eventId);
    formData.append("name", form.name);
    formData.append("topics", form.topics);
    formData.append("startDate", form.startDate);
    formData.append("endDate", form.endDate);

    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    try {
      await axios.post("http://localhost:3001/therapp/segments", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      navigate(`/evento-page/${eventId}`);
    } catch (err) {
      console.error("Error al crear segmento:", err);
      setError("Ocurrió un error al crear el segmento.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>📂 Crear Segmento</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div>
          <label>Nombre del Segmento</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Temas del Segmento</label>
          <textarea
            name="topics"
            value={form.topics}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Fecha de Inicio</label>
          <input
            type="date"
            name="startDate"
            value={form.startDate}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Fecha de Fin</label>
          <input
            type="date"
            name="endDate"
            value={form.endDate}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Archivos (opcional)</label>
          <input type="file" name="files" multiple onChange={handleFileChange} />
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Creando..." : "Crear Segmento"}
        </button>
      </form>
    </div>
  );
}

export default SegmentosForm;
