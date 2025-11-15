import React, { useEffect, useState } from "react";
import { TriangleAlert } from "lucide-react";

const HorasDisponibles = ({ fechaSeleccionada, selectedEspecialista, horaSeleccionada, setHoraSeleccionada }) => {
  const [availableHours, setAvailableHours] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // cuando cambia la fecha o el especialista, cargamos las horas
  useEffect(() => {
    const fetchHoras = () => {
      setError(null);
      setLoading(true);

      // simulamos datos estáticos (puedes reemplazar con axios si tu backend está listo)
      const horas = [
        { hora: "09:00 AM", value: "09:00", disponible: true },
        { hora: "09:30 AM", value: "09:30", disponible: true },
        { hora: "10:00 AM", value: "10:00", disponible: true },
        { hora: "10:30 AM", value: "10:30", disponible: true },
        { hora: "11:00 AM", value: "11:00", disponible: true },
        { hora: "11:30 AM", value: "11:30", disponible: true },
        { hora: "02:00 PM", value: "14:00", disponible: true },
        { hora: "02:30 PM", value: "14:30", disponible: true },
        { hora: "03:00 PM", value: "15:00", disponible: true },
        { hora: "03:30 PM", value: "15:30", disponible: true },
        { hora: "04:00 PM", value: "16:00", disponible: true }
      ];

      setAvailableHours(horas);
      setLoading(false);
    };

    if (fechaSeleccionada && selectedEspecialista) {
      fetchHoras();
    }
  }, [fechaSeleccionada, selectedEspecialista]);

  if (!fechaSeleccionada || !selectedEspecialista) {
    return (
      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-yellow-800 dark:text-yellow-300 flex items-center gap-3 animate-pulse">
        <TriangleAlert className="text-2xl flex-shrink-0" />
        <p className="text-sm">
          Primero seleccione un <strong>Especialista</strong> y una <strong>Fecha</strong>.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-green-50 to-blue-50 dark:from-slate-800 dark:to-slate-900 p-6 rounded-3xl shadow-2xl border border-green-200 dark:border-slate-700 transition-all">
      <h2 className="text-lg font-bold mb-4 text-green-900 dark:text-green-200 flex items-center gap-2">
        4. Seleccione Horario
        <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
          ({fechaSeleccionada.format("ddd, D MMM")})
        </span>
      </h2>

      {loading && <p className="text-sm text-gray-500">Cargando horarios...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-2">
        {availableHours.length === 0 && !loading ? (
          <p className="text-sm text-gray-500 col-span-3">No hay horas registradas para esta fecha.</p>
        ) : (
          availableHours.map((hora) => (
            <button
              key={hora.value}
              disabled={!hora.disponible}
              onClick={() => setHoraSeleccionada(hora.value)}
              className={`
                h-12 rounded-xl text-sm font-medium flex items-center justify-center transition-all duration-300 transform
                ${!hora.disponible
                  ? "bg-gray-100 text-gray-400 dark:bg-slate-700 dark:text-gray-600 cursor-not-allowed line-through"
                  : horaSeleccionada === hora.value
                  ? "bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold shadow-lg scale-105"
                  : "bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-700 text-gray-800 dark:text-gray-200 hover:bg-green-100/50 dark:hover:bg-green-700/30 hover:border-green-400 hover:scale-105"
                }`}
            >
              {hora.hora}
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default HorasDisponibles;
