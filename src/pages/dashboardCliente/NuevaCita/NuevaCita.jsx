import React, { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { Calendar } from "lucide-react";
import CalendarGrid from "./CalendarGrid";
import HorasDisponibles from "./HorasDisponibles";
import ConfirmationModal from "./ConfirmationModal";
import {api} from "../../../services/api";

dayjs.locale("es");

const NuevaCita = ({ pacienteId: pacienteIdProp = null }) => {
  // estados principales
  const [especialistasData, setEspecialistasData] = useState([]); // viene del backend
  const [especialistaId, setEspecialistaId] = useState(null); // id numérico
  const [nota, setNota] = useState("");
  const [horaSeleccionada, setHoraSeleccionada] = useState(null); // valor "HH:mm"
  const [fechaSeleccionada, setFechaSeleccionada] = useState(dayjs());
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [showConfirmation, setShowConfirmation] = useState(false);

  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);
  const [citaCreada, setCitaCreada] = useState(null);

  // obtener pacienteId: props -> localStorage -> fallback 4
  const pacienteId = useMemo(() => {
    if (pacienteIdProp) return pacienteIdProp;
    try {
      const u = JSON.parse(localStorage.getItem("usuario") || "null");
      if (u && u.id) return u.id;
    } catch (e) {
      // ignore
    }
    return 4;
  }, [pacienteIdProp]);

  // traer especialistas desde backend al montar
  useEffect(() => {
    const fetchEspecialistas = async () => {
      try {
        const res = await api.get("Cita3.php?accion=especialistas");
        // backend devuelve [{id, nombre, apellido, ...}]
        setEspecialistasData(res.data || []);
      } catch (err) {
        console.error("Error cargando especialistas:", err);
      }
    };
    fetchEspecialistas();
  }, []);

  // selectedEspecialista obj para pasarlo a HorasDisponibles y ConfirmationModal
  const selectedEspecialista = useMemo(() => {
    if (!especialistaId) return null;
    return especialistasData.find((e) => Number(e.id) === Number(especialistaId)) || null;
  }, [especialistaId, especialistasData]);

  const isFormValid = especialistaId && horaSeleccionada && fechaSeleccionada;

  const handleConfirmar = async () => {
    setError(null);
    if (!isFormValid) {
      setError("Formulario incompleto. Seleccione especialista, fecha y hora.");
      return;
    }

    setCreating(true);
    try {
      const payload = {
        pacienteId,
        doctorId: Number(especialistaId),
        fecha: fechaSeleccionada.format("YYYY-MM-DD"),
        hora: horaSeleccionada, // backend espera "09:00"
        nota,
      }; 

      const res = await api.post("Cita3.php", payload, {
        headers: { "Content-Type": "application/json" },
      });

      if (res.data && res.data.success) {
        setCitaCreada(res.data.cita);
        console.log("Cita creada:", res.data);
        setShowConfirmation(true);
      } else {
        setError(res.data.error || "Error al crear la cita");
      }
    } catch (err) {
      console.error(err);
      setError("Error creando la cita. Intente nuevamente.");
    } finally {
      setCreating(false);
    }
  };

  const handleCloseModal = () => {
    setShowConfirmation(false);
    // opcional: resetear formulario
    setEspecialistaId(null);
    setNota("");
    setHoraSeleccionada(null);
    setFechaSeleccionada(dayjs());
    setCurrentMonth(dayjs());
    setCitaCreada(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 p-4 sm:p-8 transition-all duration-500">
      <h1 className="text-3xl font-extrabold text-green-900 dark:text-green-200 mb-8 border-b border-green-200 dark:border-green-700 pb-4 flex items-center gap-3">
        <Calendar className="inline text-green-700 dark:text-green-300 w-8 h-8 animate-bounce" /> Programar Nueva Cita
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        <div className="lg:col-span-1 space-y-6">
          {/* Selección de Especialista desde backend */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-2xl border border-green-200 dark:border-slate-700 transition-all hover:shadow-xl">
            <h2 className="text-lg font-bold mb-4 text-green-800 dark:text-green-200">1. Seleccione Especialista</h2>
            <div className="space-y-3">
              {especialistasData.map((esp) => {
                const isSelected = Number(especialistaId) === Number(esp.id);
                return (
                  <button
                    key={esp.id}
                    onClick={() => setEspecialistaId(esp.id)}
                    className={`w-full text-left p-3 rounded-xl border transition-all duration-200 flex items-center gap-3
                      ${isSelected
                        ? "border-green-500 bg-green-100 dark:bg-green-900 shadow-md text-green-700 font-bold scale-105"
                        : "border-gray-200 dark:border-slate-700 hover:bg-green-50 dark:hover:bg-green-800/40 text-gray-800 dark:text-gray-300 hover:scale-105"
                      }`}
                  >
                    <span className={`text-2xl ${isSelected ? "text-green-500" : "text-gray-400"}`}>🦷</span>
                    <div>
                      <p className="font-semibold leading-none">{`${esp.nombre} ${esp.apellido}`}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{esp.especialidad || "Especialista"}</p>
                    </div>
                  </button>
                );
              })}
              {especialistasData.length === 0 && <p className="text-sm text-gray-500">Cargando especialistas...</p>}
            </div>
          </div>

          {/* Nota */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-2xl border border-green-200 dark:border-slate-700 transition-all hover:shadow-xl">
            <label htmlFor="nota" className="text-lg font-bold mb-4 block text-green-800 dark:text-green-200">
              3. Nota / Motivo de la visita (Opcional)
            </label>
            <textarea
              id="nota"
              value={nota}
              onChange={(e) => setNota(e.target.value)}
              rows={4}
              placeholder="e.g. Dolor en muela del juicio, chequeo anual..."
              className="w-full resize-none rounded-xl border border-green-300 dark:border-green-700 p-4 bg-green-50 dark:bg-green-900/30 text-green-900 dark:text-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-150"
            />
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <CalendarGrid
            currentMonth={currentMonth}
            setCurrentMonth={setCurrentMonth}
            fechaSeleccionada={fechaSeleccionada}
            setFechaSeleccionada={setFechaSeleccionada}
          />
          <HorasDisponibles
            fechaSeleccionada={fechaSeleccionada}
            selectedEspecialista={selectedEspecialista}
            allHorasDisponibles={[]} // ya no lo usamos; el componente consulta al backend
            horaSeleccionada={horaSeleccionada}
            setHoraSeleccionada={setHoraSeleccionada}
          />
        </div>
      </div>

      <div className="mt-10 pt-6 border-t border-green-200 dark:border-green-700 flex flex-col gap-3 items-end">
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button
          disabled={!isFormValid || creating}
          onClick={handleConfirmar}
          className="h-14 px-10 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl disabled:bg-gray-300 disabled:shadow-none disabled:cursor-not-allowed dark:disabled:bg-slate-700 transition-all duration-300 transform hover:scale-105"
        >
          {creating ? "Creando..." : "Confirmar Cita"}
        </button>
      </div>

      <ConfirmationModal
        isOpen={showConfirmation}
        cita={citaCreada || { especialistaId, fecha: fechaSeleccionada, hora: horaSeleccionada, nota }}
        especialista={selectedEspecialista}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default NuevaCita;
