import React, { useEffect } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const handleLogin = () => {
    // Aquí puedes validar credenciales si quieres
    navigate("/sistema/gestion-parametros");
  };

  useEffect(() => {
    document.body.classList.add("login-background");

    const btnIniciarSesion = document.getElementById("btn__iniciar-sesion");
    const btnRegistrarse = document.getElementById("btn__registrarse");
    const contenedor_login_register = document.querySelector(".contenedor__login-register");
    const formulario_login = document.querySelector(".formulario__login");
    const formulario_register = document.querySelector(".formulario__register");
    const caja_trasera_login = document.querySelector(".caja__trasera-login");
    const caja_trasera_register = document.querySelector(".caja__trasera-register");

    function anchoPagina() {
      if (window.innerWidth > 850) {
        caja_trasera_login.style.display = "block";
        caja_trasera_register.style.display = "block";
      } else {
        caja_trasera_register.style.display = "block";
        caja_trasera_login.style.display = "none";
        formulario_login.style.display = "block";
        formulario_register.style.display = "none";
        contenedor_login_register.style.left = "0px";
      }
    }

    function iniciarSesion() {
      if (window.innerWidth > 850) {
        formulario_register.style.display = "none";
        contenedor_login_register.style.left = "10px";
        formulario_login.style.display = "block";
        caja_trasera_register.style.opacity = "1";
        caja_trasera_login.style.opacity = "0";
      } else {
        formulario_register.style.display = "none";
        contenedor_login_register.style.left = "10px";
        formulario_login.style.display = "block";
        caja_trasera_register.style.display = "block";
        caja_trasera_login.style.display = "none";
      }
    }

    function register() {
      if (window.innerWidth > 850) {
        formulario_register.style.display = "block";
        contenedor_login_register.style.left = "410px";
        formulario_login.style.display = "none";
        caja_trasera_register.style.opacity = "0";
        caja_trasera_login.style.opacity = "1";
      } else {
        formulario_register.style.display = "block";
        contenedor_login_register.style.left = "0px";
        formulario_login.style.display = "none";
        caja_trasera_register.style.opacity = "none";
        caja_trasera_login.style.opacity = "1";
      }
    }

    btnIniciarSesion?.addEventListener("click", iniciarSesion);
    btnRegistrarse?.addEventListener("click", register);
    window.addEventListener("resize", anchoPagina);

    anchoPagina();

    return () => {
      btnIniciarSesion?.removeEventListener("click", iniciarSesion);
      btnRegistrarse?.removeEventListener("click", register);
      window.removeEventListener("resize", anchoPagina);
      document.body.classList.remove("login-background");
    };
}, []);

  return (
    <main>
        <div className="contenedor__todo">
            <div className="caja__trasera">
                <div className="caja__trasera-login">
                    <h3>Ya tienes una cuenta?</h3>
                    <p>Inicia sesión para entrar a la página</p>
                    <button id="btn__iniciar-sesion">Iniciar Sesión</button>
                </div>
                <div className="caja__trasera-register">
                    <h3>Aún no tienes una cuenta?</h3>
                    <p>Regístrate para que puedas iniciar sesión</p>
                    <button id="btn__registrarse">Registrarse</button>
                </div>
            </div>

            <div className="contenedor__login-register">
                <form className="formulario__login">
                    <h2>Iniciar Sesión</h2>
                    <input type="text" placeholder="Correo Electrónico" />
                    <input type="password" placeholder="Contraseña" />
                    
                        <button type="button" onClick={handleLogin}>Entrar</button>
                    
                </form>

                <form className="formulario__register">
                    <h2>Registrarse</h2>
                    <input type="text" placeholder="Nombre Completo" />
                    <input type="text" placeholder="Correo Electrónico" />
                    <input type="text" placeholder="Usuario" />
                    <input type="password" placeholder="Contraseña" />
                    
                      <button id="btn_registrarse" onClick={handleLogin}>Registrarse</button>
                    
                </form>
            </div>
        </div>
    </main>

  );
}

export default Login;
