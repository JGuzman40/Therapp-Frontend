import { Routes, Route } from "react-router-dom";
import Landing from "../src/componentes/Landing/Landing";
import LoginForm from "../src/componentes/Login/LoginForm";
import PrivateRoute from "./routes/PrivateRoute";
import DashboardAdministrador from "../src/componentes/Administradores/DashboardAdmin";
import DashboardFacilitador from "./componentes/Facilitadores/DashboardFacilitador";
import DashboardParticipante from "../src/componentes/Participantes/DashboardParticipante";

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
  <Route
    path="/dashboard-facilitador"
    element={
      <PrivateRoute allowedRoles={["facilitador"]}>
        <DashboardFacilitador />
      </PrivateRoute>
    }
  />
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