import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function EventosForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    eventType: "",
    eventName: "",
    eventImage: "",
    description: "",
    startDate: "",
    endDate: "",
  });

  const [eventTypes, setEventTypes] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Traer los tipos de evento desde el backend
  useEffect(() => {
    const fetchEventTypes = async () => {
      try {
        const response = await axios.get("http://localhost:3001/therapp/events/types");
        setEventTypes(response.data);
      } catch (err) {
        console.error("Error al obtener tipos de evento:", err);
        setError("No se pudieron cargar los tipos de evento.");
      }
    };

    fetchEventTypes();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const storedUser = JSON.parse(localStorage.getItem("user"));
    const facilitadorId = storedUser?.id;

    if (!facilitadorId) {
      setError("No se encontró el ID del facilitador.");
      setLoading(false);
      return;
    }

    try {
      const data = { ...form, facilitadorId };
      await axios.post("http://localhost:3001/therapp/events", data);
      navigate("/dashboard-facilitador");
    } catch (err) {
      console.error("Error al crear evento:", err);
      setError("Ocurrió un error al crear el evento.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>📅 Registrar Nuevo Evento</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Tipo de Evento</label>
          <select
            name="eventType"
            value={form.eventType}
            onChange={handleChange}
            required
          >
            <option value="">Seleccionar tipo</option>
            {eventTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Nombre del Evento</label>
          <input
            type="text"
            name="eventName"
            value={form.eventName}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Imagen (URL)</label>
          <input
            type="url"
            name="eventImage"
            value={form.eventImage}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Descripción</label>
          <textarea
            name="description"
            value={form.description}
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

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Registrando..." : "Registrar Evento"}
        </button>
      </form>
    </div>
  );
}

export default EventosForm;
