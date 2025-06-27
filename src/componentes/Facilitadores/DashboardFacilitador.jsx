import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./DashboardFacilitador.css"; // Asegúrate de crear este archivo

function DashboardFacilitador() {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        const facilitadorId = storedUser?.id;

        const response = await axios.get(
          `http://localhost:3001/therapp/events/facilitador/${facilitadorId}`
        );
        setEventos(response.data.eventos);
      } catch (error) {
        console.error("Error al obtener eventos del facilitador:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventos();
  }, []);

  const handleRegistrarEvento = () => {
    navigate("/registro-eventos");
  };

  const handleVerEvento = (id) => {
    navigate(`/evento-page/${id}`);
  };

  return (
    <div className="container">
      <h2>🎓 Dashboard del Facilitador</h2>

      <button onClick={handleRegistrarEvento}>Registrar Nuevo Evento</button>

      <section>
        <h3>📅 Mis Eventos Registrados</h3>

        {loading ? (
          <p>Cargando eventos...</p>
        ) : eventos.length > 0 ? (
          <div className="eventos-grid">
            {eventos.map((evento) => (
              <div
                key={evento.id}
                className="evento-card"
                onClick={() => handleVerEvento(evento.id)}
              >
                <h4>{evento.eventName}</h4>
                <p>{evento.description}</p>
                <p>
                  {new Date(evento.startDate).toLocaleDateString()} -{" "}
                  {new Date(evento.endDate).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p>No tienes eventos registrados.</p>
        )}
      </section>
    </div>
  );
}

export default DashboardFacilitador;
