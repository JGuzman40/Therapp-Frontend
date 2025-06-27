import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function FacilitadorForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    imageUrl: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const storedUser = JSON.parse(localStorage.getItem("user"));
    const adminId = storedUser?.id;

    const data = {
      ...form,
      role: "facilitador",
      isActive: true,
      adminId,
    };

    try {
      await axios.post("http://localhost:3001/therapp/users", data);
      navigate("/dashboard-administrador", { replace: true });
    } catch (err) {
      console.error("Error al registrar facilitador:", err);
      setError(err.response?.data?.message || "Error al registrar facilitador");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Registrar Facilitador</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Correo electrónico</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Contraseña</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Imagen (URL)</label>
          <input
            type="url"
            name="imageUrl"
            value={form.imageUrl}
            onChange={handleChange}
            required
          />
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Registrando..." : "Registrar Facilitador"}
        </button>
      </form>
    </div>
  );
}

export default FacilitadorForm;
