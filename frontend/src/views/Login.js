import React, { useEffect } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add("login-background");
    return () => document.body.classList.remove("login-background");
  }, []);

  const handleSuccess = (credentialResponse) => {
    console.log("Login exitoso:", credentialResponse);
    localStorage.setItem("google_token", credentialResponse.credential);
    navigate("/sistema/gestion-parametros");
  };

  const handleError = () => {
    alert("Error al iniciar sesión con Google");
  };

  return (
    <main>
      <div className="contenedor__todo">
        <div className="caja__trasera">
          <div className="caja__trasera-login">
            <h3>Bienvenido</h3>
            <p>Inicia sesión para entrar al sistema</p>
          </div>
        </div>

        <div className="contenedor__login-register">
          <form className="formulario__login" style={{ display: "block", opacity: 1 }}>
            <h2>Iniciar Sesión</h2>
            <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
              <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

export default Login;