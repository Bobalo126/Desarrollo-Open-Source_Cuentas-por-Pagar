import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add("login-background");
    return () => {
      document.body.classList.remove("login-background");
    };
  }, []);

  const handleLoginSuccess = (credentialResponse) => {
    sessionStorage.setItem("token", credentialResponse.credential);
    window.location.reload();
  };

  const handleLoginError = () => {
    alert("Error al iniciar sesión con Google");
  };

  return (
    <main className="login-container">
      <div className="login-card">
        <h2>Bienvenido</h2>
        <p>Inicia sesión con Google para continuar</p>
        <div className="login-button">
          <GoogleLogin
            onSuccess={handleLoginSuccess}
            onError={handleLoginError}
          />
        </div>
      </div>
    </main>
  );
}

export default Login;