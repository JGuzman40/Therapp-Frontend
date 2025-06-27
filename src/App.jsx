import { Routes, Route } from "react-router-dom";
import Landing from "../src/componentes/Landing/Landing";
import LoginForm from "../src/componentes/Login/LoginForm";
import PrivateRoute from "./routes/PrivateRoute";
import DashboardAdministrador from "../src/componentes/Administradores/DashboardAdmin";
import DashboardFacilitador from "./componentes/Facilitadores/DashboardFacilitador";
import DashboardParticipante from "../src/componentes/Participantes/DashboardParticipante";
import FacilitadorForm from "./componentes/Administradores/FacilitadorForm/FacilitadorForm";
import EventosForm from "./componentes/Facilitadores/EventosForm/EventosForm";
import SegmentosForm from "./componentes/Facilitadores/EventosForm/SegmentosForm";
import SesionesForm from "./componentes/Facilitadores/EventosForm/SesionesForm";
import EventoPage from "./componentes/Facilitadores/EventoPage/EventoPage";

function App() {
  return (
    <div className="app-container">
      <main>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<LoginForm />} />
          <Route
    path="/dashboard-administrador"
    element={
      <PrivateRoute allowedRoles={["administrador"]}>
        <DashboardAdministrador />
      </PrivateRoute>
    }
  />
  <Route path="/registro-facilitadores" element={<FacilitadorForm />} />
  <Route
    path="/dashboard-facilitador"
    element={
      <PrivateRoute allowedRoles={["facilitador"]}>
        <DashboardFacilitador />
      </PrivateRoute>
    }
  />
  <Route path="/registro-eventos" element={<EventosForm />} />
  <Route path="/evento-page/:id" element={<EventoPage/>} />
  <Route path="/registro-segmentos/:id" element={<SegmentosForm />} />
  <Route path="/registro-sesiones/:id" element={<SesionesForm />} />
  <Route
    path="/dashboard-participante"
    element={
      <PrivateRoute allowedRoles={["participante"]}>
        <DashboardParticipante />
      </PrivateRoute>
    }
  />
        </Routes>
      </main>
    </div>
  );
}

export default App;