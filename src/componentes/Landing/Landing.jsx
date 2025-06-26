import { Link } from "react-router-dom";
import "./Landing.css";
import AryaLogo from "../../assets/therapp.svg";

function Landing() {
  return (
    <div className="landing">
      <h1>Plataforma</h1>
      <img src={AryaLogo} alt="Logo Microhuasca" className="logo-img" />
      <Link to="/login">
      <button>Entrar</button>
      </Link>
      
    </div>
  );
}

export default Landing;
