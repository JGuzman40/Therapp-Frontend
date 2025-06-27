import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function SesionesForm() {
  const { id: eventId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    sessionType: "grupal",
    dates: "",
    time: "",
    duration: "",
    meetingLink: "",
    message: "",
    notify: false,
    participantId: "",
  });

  const [participantes, setParticipantes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔄 Cargar participantes al iniciar
  useEffect(() => {
    const fetchParticipantes = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/therapp/users/participantes/${eventId}`);
        setParticipantes(res.data);
      } catch (err) {
        console.error("Error al obtener participantes:", err);
      }
    };
    fetchParticipantes();
  }, [eventId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      ...form,
      eventId,
      participantId: form.sessionType === "individual" ? form.participantId : null,
    };

    try {
      await axios.post("http://localhost:3001/therapp/sessions", payload);
      navigate(`/evento-page/${eventId}`);
    } catch (err) {
      console.error("❌ Error al crear sesión:", err);
      setError("Error al crear la sesión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>📆 Programar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre de la sesión:</label>
          <input type="text" name="name" value={form.name} onChange={handleChange} required />
        </div>

        <div>
          <label>Tipo de sesión:</label>
          <select name="sessionType" value={form.sessionType} onChange={handleChange}>
            <option value="grupal">Grupal</option>
            <option value="individual">Individual</option>
          </select>
        </div>

        {form.sessionType === "individual" && (
          <div>
            <label>Participante:</label>
            <select
              name="participantId"
              value={form.participantId}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona un participante</option>
              {participantes.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label>Fecha (YYYY-MM-DD):</label>
          <input type="date" name="dates" value={form.dates} onChange={handleChange} required />
        </div>

        <div>
          <label>Hora:</label>
          <input type="time" name="time" value={form.time} onChange={handleChange} required />
        </div>

        <div>
          <label>Duración (minutos):</label>
          <input
            type="number"
            name="duration"
            value={form.duration}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Enlace de reunión:</label>
          <input
            type="url"
            name="meetingLink"
            value={form.meetingLink}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Mensaje personalizado (opcional):</label>
          <textarea name="message" value={form.message} onChange={handleChange} />
        </div>

        <div>
          <label>¿Notificar por correo?</label>
          <input
            type="checkbox"
            name="notify"
            checked={form.notify}
            onChange={handleChange}
          />
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Guardando..." : "Guardar sesión"}
        </button>
      </form>
    </div>
  );
}

export default SesionesForm;
