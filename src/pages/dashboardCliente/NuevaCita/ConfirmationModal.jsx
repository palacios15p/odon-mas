import React from "react";
import { CheckCircle, Stethoscope, Calendar, Clock, Info } from "lucide-react";
import dayjs from "dayjs";

/**
 * ConfirmationModal
 * Props:
 *  - isOpen (bool)
 *  - cita (obj) -> puede venir desde el backend (cita creada) o desde el estado local
 *  - especialista (obj) -> datos del doctor (nombre, apellido)
 *  - onClose (fn)
 */
const ConfirmationModal = ({ isOpen, cita, especialista, onClose }) => {
  if (!isOpen) return null;

  // cita.fecha puede ser string 'YYYY-MM-DD' o dayjs; unificamos
  const fecha = cita?.fecha ? dayjs(cita.fecha) : null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-b from-green-50 to-blue-50 dark:from-slate-800 dark:to-slate-900 p-6 sm:p-8 rounded-3xl shadow-2xl max-w-lg w-full transform transition-all duration-500 scale-100 hover:scale-105">
        <div className="flex flex-col items-center text-center">
          <CheckCircle className="text-green-600 dark:text-green-400 text-7xl mb-4 animate-bounce" />
          <h2 className="text-3xl font-extrabold text-green-800 dark:text-green-200 mb-2">¡Cita Confirmada!</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6 text-sm sm:text-base">
            Su cita ha sido agendada con éxito en <span className="font-semibold text-green-700 dark:text-green-300">ortho&mas</span>.
          </p>

          <div className="w-full bg-white dark:bg-slate-700 p-5 rounded-xl shadow-inner mb-6 border border-green-200 dark:border-green-600 transition-all hover:shadow-lg text-left">
            <p className="text-sm text-green-800 dark:text-green-200 font-semibold flex items-center gap-2 mb-2">
              <Stethoscope className="w-5 h-5" /> Especialista: {especialista ? `${especialista.nombre} ${especialista.apellido}` : "N/A"}
            </p>
            <p className="text-sm text-blue-700 dark:text-blue-300 font-semibold flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5" /> Fecha: {fecha ? fecha.format("dddd, D [de] MMMM [de] YYYY") : cita.fecha}
            </p>
            <p className="text-sm text-green-700 dark:text-green-300 font-semibold flex items-center gap-2">
              <Clock className="w-5 h-5" /> Hora: {cita.hora || cita.horaSeleccionada}
            </p>
            {cita.nota && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 italic flex items-start gap-1">
                <Info className="w-4 h-4 mt-0.5 flex-shrink-0" /> Nota: {cita.nota}
              </p>
            )}
          </div>

          <button
            onClick={onClose}
            className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-3 px-6 rounded-2xl w-full transition duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
