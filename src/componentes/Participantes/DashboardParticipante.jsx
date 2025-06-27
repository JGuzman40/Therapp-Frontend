import { useEffect, useState } from "react";
import axios from "axios";

function DashboardParticipante() {
  const [evento, setEvento] = useState(null);
  const [sesiones, setSesiones] = useState([]);
  const [segmentos, setSegmentos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      let participanteId = null;
      let attempts = 0;

      while (!participanteId && attempts < 5) {
        participanteId = localStorage.getItem("usuarioId");
        if (!participanteId) {
          await new Promise((res) => setTimeout(res, 200));
          attempts++;
        }
      }

      if (!participanteId) {
        console.error("❌ ID de participante no disponible tras varios intentos");
        setLoading(false);
        return;
      }

      console.log("✅ ID de participante:", participanteId);

      try {
        const userRes = await axios.get(`http://localhost:3001/therapp/users/${participanteId}`);
        console.log("📦 Datos del usuario recibido:", userRes.data);

        const eventoId = userRes.data.user.eventId;

        if (!eventoId) {
          console.warn("⚠️ Este participante aún no tiene un evento asignado.");
          setEvento(null);
          setSesiones([]);
          setSegmentos([]);
          setLoading(false);
          return;
        }

        const eventoRes = await axios.get(`http://localhost:3001/therapp/events/${eventoId}`);
        setEvento(eventoRes.data);

        const sesionesRes = await axios.get(`http://localhost:3001/therapp/sessions`);
        const misSesiones = sesionesRes.data.filter(
          (s) =>
            (s.sessionType === "individual" && s.participantId === participanteId) ||
            s.sessionType === "grupal"
        );
        setSesiones(misSesiones);

        // 👉 Cargar segmentos del evento
        const segmentosRes = await axios.get(`http://localhost:3001/therapp/segments/event/${eventoId}`);
        setSegmentos(segmentosRes.data);
      } catch (error) {
        console.error("❌ Error cargando dashboard:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Cargando tu espacio personal...</p>;

  return (
    <div className="container">
      <h2>🌱 Bienvenida/o a tu proceso</h2>

      {evento ? (
        <section>
          <h3>🧭 Evento: {evento.eventName}</h3>
          <p><strong>Tipo:</strong> {evento.eventType}</p>
          <p><strong>Descripción:</strong> {evento.description}</p>
          <p>
            <strong>Fechas:</strong>{" "}
            {new Date(evento.startDate).toLocaleDateString()} -{" "}
            {new Date(evento.endDate).toLocaleDateString()}
          </p>
          {evento.eventImage && (
            <img
              src={evento.eventImage}
              alt="Evento"
              style={{ width: "100%", borderRadius: "12px", marginTop: "1rem" }}
            />
          )}
        </section>
      ) : (
        <p>❗ Aún no tienes un evento asignado. Contacta a tu facilitador.</p>
      )}

      <section>
        <h3>📆 Tus Sesiones Programadas</h3>
        {sesiones.length > 0 ? (
          <ul>
            {sesiones.map((s) => (
              <li key={s.id} style={{ marginBottom: "1.5rem" }}>
                <strong>{s.name}</strong> <br />
                Tipo: {s.sessionType} <br />
                Fecha: {new Date(s.dates).toLocaleDateString()} <br />
                Hora: {s.time} — {s.duration} min <br />
                Enlace: <a href={s.meetingLink} target="_blank" rel="noreferrer">Ir a reunión</a><br />
                {s.message && <em>{s.message}</em>}
              </li>
            ))}
          </ul>
        ) : (
          <p>⏳ Aún no tienes sesiones asignadas.</p>
        )}
      </section>

      <section>
  <h3>🧩 Segmentos del Evento</h3>
  {segmentos.length > 0 ? (
    <ul>
      {segmentos.map((seg) => (
        <li key={seg.id} style={{ marginBottom: "1.5rem" }}>
          <strong>{seg.name}</strong> <br />
          {seg.description && <p>{seg.description}</p>}
          
          {seg.audioUrl && (
            <div>
              <p>🎧 Audio:</p>
              <audio controls src={seg.audioUrl} style={{ width: "100%" }} />
            </div>
          )}

          {seg.imageUrl && (
            <div>
              <p>🖼️ Imagen:</p>
              <img
                src={seg.imageUrl}
                alt="Imagen del segmento"
                style={{ width: "100%", maxHeight: "300px", objectFit: "cover", borderRadius: "8px" }}
              />
            </div>
          )}

          {seg.videoUrl && (
            <div>
              <p>📹 Video:</p>
              <video controls src={seg.videoUrl} style={{ width: "100%" }} />
            </div>
          )}

          {seg.documentUrl && (
            <div>
              <p>📄 Documento:</p>
              <a href={seg.documentUrl} target="_blank" rel="noopener noreferrer">
                Ver documento
              </a>
            </div>
          )}
        </li>
      ))}
    </ul>
  ) : (
    <p>⏳ Aún no se han registrado segmentos.</p>
  )}
</section>

    </div>
  );
}

export default DashboardParticipante;
