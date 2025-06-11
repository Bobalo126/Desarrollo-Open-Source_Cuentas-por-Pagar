import React, { useEffect } from "react";
import "./Login.css";
import { Link } from "react-router-dom";

function Login() {
  useEffect(() => {
    document.body.classList.add("login-background");
    const btnIniciarSesion = document.getElementById("btn__iniciar-sesion");
    const btnRegistrarse = document.getElementById("btn__registrarse");
    const contenedor = document.querySelector(".contenedor__todo");

    if (btnIniciarSesion && btnRegistrarse && contenedor) {
      btnIniciarSesion.addEventListener("click", () => {
        contenedor.classList.remove("modo__registro");
      });

      btnRegistrarse.addEventListener("click", () => {
        contenedor.classList.add("modo__registro");
      });
    }

    // Cleanup (opcional)
    return () => {
      if (btnIniciarSesion) btnIniciarSesion.removeEventListener("click", () => {});
      if (btnRegistrarse) btnRegistrarse.removeEventListener("click", () => {});
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
                    <Link to="/gestion-conceptos">
                        <button type="button">Entrar</button>
                    </Link>
                </form>

                <form className="formulario__register">
                    <h2>Registrarse</h2>
                    <input type="text" placeholder="Nombre Completo" />
                    <input type="text" placeholder="Correo Electrónico" />
                    <input type="text" placeholder="Usuario" />
                    <input type="password" placeholder="Contraseña" />
                    <button id="btn_registrarse">Registrarse</button>
                </form>
            </div>
        </div>
    </main>

  );
}

export default Login;
