// src/components/Sidebar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaHome,
  FaCalendarPlus,
  FaHistory,
  FaUser,
  FaSignOutAlt,
  FaTooth,
} from "react-icons/fa";

const navItems = [
  { icon: <FaHome />, text: "Inicio", link: "/cliente" },
  { icon: <FaCalendarPlus />, text: "Agendar Cita", link: "/cliente/nueva-cita" },
  { icon: <FaUser />, text: "Mi Perfil", link: "/perfil" },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="flex h-screen flex-col justify-between bg-white dark:bg-slate-900 p-5 w-64 fixed shadow-2xl border-r border-gray-100 dark:border-slate-700 z-30 transition-all duration-300">
      
      {/* 🔷 LOGO */}
      <div>
        <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-slate-700">
          <div className="bg-sky-500 text-white rounded-full p-3 shadow-lg">
            <FaTooth className="text-2xl" />
          </div>
          <div>
            <h1 className="text-sky-600 dark:text-sky-400 text-xl font-extrabold leading-snug">
              Ortho&Mas
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-xs">
              Centro Odontológico
            </p>
          </div>
        </div>

        {/* 🔹 Menú */}
        <nav className="mt-6 flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.link;
            return (
              <motion.div
                key={item.text}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  to={item.link}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200
                    ${
                      isActive
                        ? "bg-sky-500 text-white shadow-md"
                        : "text-gray-700 dark:text-gray-300 hover:bg-sky-100 dark:hover:bg-sky-800"
                    }`}
                >
                  <span
                    className={`text-lg ${
                      isActive ? "text-white" : "text-sky-500"
                    }`}
                  >
                    {item.icon}
                  </span>
                  <p
                    className={`text-base font-medium ${
                      isActive ? "text-white" : "text-gray-800 dark:text-gray-200"
                    }`}
                  >
                    {item.text}
                  </p>
                </Link>
              </motion.div>
            );
          })}
        </nav>
      </div>

      {/* 🔻 Cerrar Sesión */}
        <Link
          to="/"
          className="border-t border-gray-200 dark:border-slate-700 pt-4 mt-4"
        >
        <motion.div
          whileHover={{ x: 5 }}
          className="flex items-center gap-3 px-3 py-3 rounded-xl transition duration-150 hover:bg-red-50 dark:hover:bg-red-900/50"
        >
          <FaSignOutAlt className="text-red-500 text-xl" />
          <p className="text-base font-semibold text-red-600 dark:text-red-400">
            Salir de la Cuenta
          </p>
        </motion.div>
      </Link>
    </aside>
  );
};

export default Sidebar;
