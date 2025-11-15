// src/components/HistorialReciente.jsx
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { MdEventNote } from "react-icons/md";
import { FaCalendarCheck } from "react-icons/fa";
import { api } from "../../services/api";

// 🎨 Estilos del estado
const getStatusBadge = (estado) => {
  const base =
    "text-xs font-semibold px-3 py-1 rounded-full border transition-colors";
  switch (estado) {
    case "Completada":
      return `${base} bg-green-100 text-green-700 border-green-300 dark:bg-green-900 dark:text-green-300`;
    case "Programada":
    case "Pendiente":
      return `${base} bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900 dark:text-blue-300`;
    case "Cancelada":
      return `${base} bg-red-100 text-red-700 border-red-300 dark:bg-red-900 dark:text-red-300`;
    default:
      return `${base} bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-900 dark:text-gray-300`;
  }
};

const HistorialReciente = () => {
  const [citas, setCitas] = React.useState([]);

  useEffect(() => {
    // llamada inicial
    fetchCitas();

    const interval = setInterval(() => {
      fetchCitas();
    }, 60000); // cada 60 segundos

    // limpiar intervalo al desmontar el componente
    return () => clearInterval(interval);
  }, []);

  const fetchCitas = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) return;

      const { data } = await api.get(`/Cita2.php?usuario_id=${user.id}`);

      // Normalizar: si la API devuelve un objeto, lo convertimos en array
      const citasArray = Array.isArray(data) ? data : [data];
      setCitas(citasArray);

      console.log("Citas recibidas:", citasArray);
    } catch (error) {
      console.error("Error fetching citas:", error);
      setCitas([]);
    }
  };


  return (
    <section className="relative z-10 lg:col-span-2 p-5" style={{ isolation: "isolate" }}>
      <div className="flex flex-col gap-6 p-7 rounded-2xl bg-white dark:bg-slate-800 shadow-xl border border-gray-100 dark:border-slate-700 transition-all">
        {/* 🦷 Título principal */}
        <header className="flex items-center gap-3 border-b pb-3 border-gray-200 dark:border-slate-600">
          <MdEventNote className="text-3xl text-teal-500" />
          <h3 className="text-2xl font-bold text-indigo-800 dark:text-white tracking-tight">
            Historial de Citas
          </h3>
        </header>

        {/* 📋 Lista de citas */}
        <ul className="flex flex-col gap-4 mt-3">
          {citas.map((cita) => (
            <li key={cita.cita_id}>
              <Link
                to={`/citas/${cita.cita_id}`}
                className="flex justify-between items-center p-4 rounded-xl bg-gray-50 dark:bg-slate-700/40 
                           hover:bg-teal-50 dark:hover:bg-slate-700 border border-transparent 
                           hover:border-teal-300 dark:hover:border-teal-500 shadow-sm transition-all"
              >
                {/* Info de cita */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-teal-100 text-teal-600 dark:bg-teal-900 dark:text-teal-300">
                    <FaCalendarCheck className="text-xl" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-gray-50 text-base">
                      {cita.servicio || cita.nombre || "Servicio no definido"}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(cita.fechaHora || cita.fecha).toLocaleDateString("es-ES", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}{" "}
                      · <span className="font-medium">{cita.doctor_nombre} {cita.doctor_apellido}</span>
                    </p>
                  </div>
                </div>

                {/* Estado */}
                <span className={getStatusBadge(cita.estado)}>
                  {cita.estado}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        {/* 🔗 Ver más */}
      </div>
    </section>
  );
};

export default HistorialReciente;
