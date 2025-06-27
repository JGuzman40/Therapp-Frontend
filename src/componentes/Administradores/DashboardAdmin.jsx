import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function DashboardAdmin() {
  const navigate = useNavigate();
  const [facilitadores, setFacilitadores] = useState([]);

  useEffect(() => {
    const fetchFacilitadores = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        const adminId = storedUser?.id;

        const response = await axios.get(
          `http://localhost:3001/therapp/users/facilitadores/${adminId}`
        );

        if (Array.isArray(response.data)) {
          setFacilitadores(response.data);
        } else {
          console.error("Formato de respuesta inesperado:", response.data);
          setFacilitadores([]); // fallback
        }

      } catch (error) {
        console.error("Error al obtener facilitadores:", error);
      }
    };

    fetchFacilitadores();
  }, []);

  const handleRegistrarFacilitador = () => {
    navigate("/registro-facilitadores");
  };

  return (
    <div className="container">
      <h2>👑 Dashboard del Administrador</h2>

      <section>
        <h3>👤 Facilitadores Activos</h3>
        <button onClick={handleRegistrarFacilitador}>
          Registrar Facilitador
        </button>

        {facilitadores.length > 0 ? (
          <ul>
            {facilitadores.map((f) => (
              <li key={f.id}>
                {f.name} - {f.email}
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay facilitadores activos registrados.</p>
        )}
      </section>
    </div>
  );
}

export default DashboardAdmin;
