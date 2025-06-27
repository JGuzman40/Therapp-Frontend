import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // ✅ React-friendly navigation

  const handleLogin = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  if (!email || !password) {
    setError("Todos los campos son obligatorios");
    setLoading(false);
    return;
  }

  try {
    const response = await axios.post(
      "http://localhost:3001/therapp/login",
      { email, password },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const { token, user } = response.data;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("usuarioId", user.id);


    if (user.role === "administrador") {
      navigate("/dashboard-administrador");
    } else if (user.role === "facilitador") {
      navigate("/dashboard-facilitador");
    } else {
      navigate("/dashboard-participante");
    }

  } catch (err) {
    console.error("Error de login:", err);
    setError(
      err.response?.data?.message || "Ocurrió un error al iniciar sesión"
    );
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="container">
      <h2>Iniciar sesión</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Cargando..." : "Ingresar"}
        </button>
      </form>
    </div>
  );
}

export default LoginForm;
