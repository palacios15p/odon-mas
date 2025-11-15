import React from "react";
import { FaBell } from "react-icons/fa";
import dayjs from "dayjs";
import "dayjs/locale/es";

dayjs.locale("es");

const Header = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const currentHour = dayjs().hour();
  const todayFormatted = dayjs().format("dddd, DD [de] MMMM");

  const getGreeting = () => {
    if (currentHour < 12) return "Buenos Días";
    if (currentHour < 18) return "Buenas Tardes";
    return "Buenas Noches";
  };

  return (
    <header className="flex flex-wrap justify-between items-center gap-4 pb-6 border-b border-gray-100 dark:border-slate-700">
      {/* Bloque de saludo */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <img
            src={user?.foto_url || "https://i.pravatar.cc/40"}
            alt={user?.nombre || "Usuario"}
            className="rounded-full w-10 h-10 border-2 border-indigo-600"
          />
          <h2 className="text-gray-900 dark:text-white text-2xl font-extrabold flex items-center gap-2">
            {getGreeting()}, {user?.rol?.nombre === "Doctor" ? "Dr." : ""} {user?.apellido || "Apellido"} 👩‍⚕️
          </h2>
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-sm capitalize">
          {todayFormatted} &middot; Resumen de su jornada.
        </p>
      </div>

      {/* Bloque de acciones */}
      <div className="flex items-center gap-5">
        <button
          aria-label="Notificaciones"
          className="relative flex items-center justify-center w-10 h-10 rounded-full
                     bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-200
                     hover:bg-indigo-50 dark:hover:bg-indigo-900 transition duration-200 shadow-sm"
        >
          <FaBell className="text-xl" />
          <span className="absolute top-1 right-1 h-2.5 w-2.5 bg-red-600 rounded-full animate-pulse"></span>
        </button>
      </div>
    </header>
  );
};

export default Header;
