// src/components/Header.jsx
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { FaBell, FaUserCircle } from "react-icons/fa";

dayjs.locale("es");

const Header = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const today = dayjs().format("dddd, DD [de] MMMM");

  return (
    <header className="flex justify-between items-center py-5 px-6 border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm transition-all duration-300">
      {/* 🔹 Sección Izquierda: Saludo y Fecha */}
      <div>
        <h2 className="text-3xl font-extrabold text-sky-600 dark:text-sky-400 flex items-center gap-2">
          Hola, {user?.nombre} <span className="animate-wave">👋</span>
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-base font-medium mt-1">
          Bienvenida de vuelta. Hoy es {today}.
        </p>
      </div>

      {/* 🔹 Sección Derecha: Notificaciones + Perfil */}
      <div className="flex items-center gap-6">
        {/* Botón de Notificaciones */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          className="relative flex items-center justify-center w-11 h-11 rounded-full bg-sky-50 dark:bg-slate-800 hover:bg-sky-100 dark:hover:bg-slate-700 text-sky-600 dark:text-sky-400 shadow-sm transition duration-200"
        >
          <FaBell className="text-xl" />
          {/* Indicador de notificación */}
          <span className="absolute top-1.5 right-1.5 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
          </span>
        </motion.button>

      </div>
    </header>
  );
};

export default Header;
