// src/components/HeaderDashboard.jsx
import React from "react";
import { Plus, CalendarDays, Activity, Smile, Bell } from "lucide-react";
import dayjs from "dayjs";
import "dayjs/locale/es";

dayjs.locale("es");

const HeaderDashboard = () => {
  const today = dayjs().format("dddd, D [de] MMMM");

  return (
    <header
      className="sticky top-0 z-20 flex flex-col md:flex-row justify-between items-start md:items-center 
      gap-6 p-6 rounded-2xl bg-white/80 dark:bg-gray-900/80 
      backdrop-blur-lg border border-gray-200 dark:border-gray-700 shadow-sm"
    >
      {/* 🦷 Sección izquierda - Bienvenida y resumen */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
          ¡Bienvenido de vuelta, Admin! 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-base md:text-lg">
          Hoy es <span className="font-semibold text-gray-800 dark:text-gray-200">{today}</span>.  
          Revisa la actividad general de la clínica odontológica.
        </p>
      </div>

      {/* 🔔 Sección derecha - Botones de acción y notificaciones */}
      <div className="flex items-center gap-4 w-full md:w-auto">
        {/* Botón de notificaciones */}
        <button
          className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gray-100 
          hover:bg-blue-50 text-gray-600 hover:text-blue-600 dark:bg-gray-800 dark:hover:bg-gray-700 
          transition-all duration-200 shadow-sm"
          aria-label="Notificaciones"
        >
          <Bell className="w-5 h-5" />
          {/* Indicador de notificación */}
          <span className="absolute top-2 right-2 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
          </span>
        </button>

        {/* Botón principal CTA */}

      </div>
    </header>
  );
};

export default HeaderDashboard;
