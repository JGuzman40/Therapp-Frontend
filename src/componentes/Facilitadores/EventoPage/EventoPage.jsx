// 🎯 Mejorada con diseño responsive, detalles ocultos desplegables y botones estilosos
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./EventoPage.css";

function EventoPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [evento, setEvento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [segmentos, setSegmentos] = useState([]);
  const [sesiones, setSesiones] = useState([]);
  const [openSegmentoId, setOpenSegmentoId] = useState(null);
  const [openSesionId, setOpenSesionId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventoRes, segmentosRes, sesionesRes] = await Promise.all([
          axios.get(`http://localhost:3001/therapp/events/${id}`),
          axios.get(`http://localhost:3001/therapp/segments/event/${id}`),
          axios.get(`http://localhost:3001/therapp/sessions/event/${id}`),
        ]);
        setEvento(eventoRes.data);
        setSegmentos(segmentosRes.data);
        setSesiones(sesionesRes.data);
      } catch (error) {
        console.error("Error al obtener datos del evento:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleCrearSegmento = () => navigate(`/registro-segmentos/${id}`);
  const handleProgramarSesion = () => navigate(`/registro-sesiones/${id}`);
  const toggleSegmento = (segId) => setOpenSegmentoId(segId === openSegmentoId ? null : segId);
  const toggleSesion = (sesId) => setOpenSesionId(sesId === openSesionId ? null : sesId);

  if (loading) return <p>Cargando evento...</p>;
  if (!evento) return <p>Evento no encontrado.</p>;

  return (
    <div className="container">
      <div className="evento-header">
        <h2>📌 Detalles del Evento</h2>
        <h3>{evento.eventName}</h3>
        <p><strong>Tipo:</strong> {evento.eventType}</p>
        <p><strong>Descripción:</strong> {evento.description}</p>
        <p><strong>Fechas:</strong> {new Date(evento.startDate).toLocaleDateString()} - {new Date(evento.endDate).toLocaleDateString()}</p>
        {evento.eventImage && <img src={evento.eventImage} alt="Evento" className="event-image" />}
      </div>

      <div className="bloque">
        <h3>📚 Segmentos del Evento</h3>
        {segmentos.length > 0 ? (
          <div className="lista">
            {segmentos.map((seg) => (
              <div key={seg.id} className="card-item">
                <button className="toggle-btn" onClick={() => toggleSegmento(seg.id)}>
                  {seg.name}
                </button>
                {openSegmentoId === seg.id && (
                  <div className="card-body">
                    <p><strong>Temas:</strong> {seg.topics}</p>
                    <p><strong>Fechas:</strong> {new Date(seg.startDate).toLocaleDateString()} - {new Date(seg.endDate).toLocaleDateString()}</p>
                    {seg.files?.length > 0 && (
                      <div>
                        <p><strong>Archivos adjuntos:</strong></p>
                        <ul>
                          {seg.files.map((file, idx) => (
                            <li key={idx}>
                              <a href={file.url} download target="_blank" rel="noreferrer">
                                📎 {file.originalname} <span className="file-type">({file.mimetype})</span>
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>No hay segmentos aún.</p>
        )}
         <div className="botones">
        <button onClick={handleCrearSegmento}>📂 Crear Segmento</button>
      </div>
      </div>

      <div className="bloque">
        <h3>📆 Sesiones Programadas</h3>
        {sesiones.length > 0 ? (
          <div className="lista">
            {sesiones.map((ses) => (
              <div key={ses.id} className="card-item">
                <button className="toggle-btn" onClick={() => toggleSesion(ses.id)}>
                  {ses.name}
                </button>
                {openSesionId === ses.id && (
                  <div className="card-body">
                    <p><strong>Tipo:</strong> {ses.sessionType}</p>
                    <p><strong>Fecha:</strong> {new Date(ses.dates).toLocaleDateString()}</p>
                    <p><strong>Hora:</strong> {ses.time} — {ses.duration} min</p>
                    <p><strong>Enlace:</strong> <a href={ses.meetingLink} target="_blank" rel="noreferrer">{ses.meetingLink}</a></p>
                    <p><strong>Mensaje:</strong> {ses.message}</p>
                    {ses.sessionType === "individual" && (
                      <p><strong>Participante ID:</strong> {ses.participantId}</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>No hay sesiones aún.</p>
        )}
         <div className="botones">
        <button onClick={handleProgramarSesion}>📆 Programar Sesión</button>
      </div>
      </div>

      <div className="botones">
        <button onClick={handleCrearSegmento}>📂 Crear Segmento</button>
        <button onClick={handleProgramarSesion}>📆 Programar Sesión</button>
      </div>
    </div>
  );
}

export default EventoPage;