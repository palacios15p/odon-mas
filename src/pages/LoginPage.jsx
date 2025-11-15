// src/pages/LoginPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaUserCircle } from "react-icons/fa";
import { api } from "../services/api";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.warning("Por favor ingresa correo y contraseña.");
      return;
    }
    setLoading(true);

    try {
      const { data } = await api.post("index.php", {
        email,
        password,
      });

      console.log("Respuesta del servidor:", data);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      const roleRouteMap = {
        paciente: "/cliente",
        doctor: "/medico",
        admin: "/admin",
        administrador: "/admin",
      };

      const roleName = data.user.rol?.nombre?.toLowerCase();
      const redirectPath = roleRouteMap[roleName];

      if (redirectPath) navigate(redirectPath);
      else toast.warning("Rol no reconocido. Contacte al administrador.");
    } catch (error) {
      console.error(error);
      if (error.response?.status === 401) {
        toast.error("Correo o contraseña incorrectos.");
      } else {
        toast.error("Error en el servidor. Intenta nuevamente.");
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="font-display bg-gradient-to-br from-indigo-50 via-pink-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-text-light dark:text-text-dark min-h-screen flex flex-col items-center justify-center p-6 relative">
      {/* Card principal */}
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-10 border border-gray-200 dark:border-gray-700 transform transition hover:scale-[1.02]">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <FaUserCircle className="text-primary text-7xl mb-4 drop-shadow-md" />
          <h1 className="text-4xl font-extrabold text-primary tracking-wide">ortho&amp;mas</h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-3 text-center">
            Bienvenido al sistema de citas
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold mb-2">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ejemplo@correo.com"
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 p-3 bg-transparent focus:ring-2 focus:ring-primary focus:outline-none transition"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold mb-2">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 p-3 bg-transparent focus:ring-2 focus:ring-primary focus:outline-none transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold text-white shadow-md transition-transform ${loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-indigo-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 hover:scale-105"
              }`}
          >
            {loading ? "Iniciando sesión..." : "Iniciar sesión"}
          </button>
        </form>

        {/* Links */}
        <div className="mt-6 text-center space-y-2">
          <a
            href="#"
            className="text-sm text-gray-600 dark:text-gray-400 underline hover:text-primary transition block"
          >
            ¿Olvidaste tu contraseña?
          </a>

          {/* Nuevo: Link de registro */}
          <a
            href="/register"
            className="text-sm font-semibold text-white bg-gradient-to-r from-green-400 to-blue-500 rounded-lg px-4 py-2 inline-block hover:from-green-500 hover:to-blue-600 transition mt-2"
          >
            Crear una cuenta
          </a>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-0 w-full p-6 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          © 2025 ortho&amp;mas. Todos los derechos reservados.
        </p>
      </footer>
    </div>
  );
};

export default LoginPage;
