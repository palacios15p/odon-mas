// src/pages/Perfil.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCalendarCheck,
  FaTooth,
  FaSmile,
  FaUserMd,
  FaSignOutAlt,
  FaChartLine,
} from "react-icons/fa";

const Perfil = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <p className="text-gray-600 text-lg font-medium">
          No hay usuario autenticado.
        </p>
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Datos simulados de widgets
  const widgets = [
    {
      icon: <FaCalendarCheck className="text-blue-500 text-3xl" />,
      label: "Próxima Cita",
      value: "15 Nov 2025, 9:00 AM",
    },
    {
      icon: <FaTooth className="text-indigo-500 text-3xl" />,
      label: "Tratamientos Completados",
      value: "12",
    },
    {
      icon: <FaSmile className="text-green-500 text-3xl" />,
      label: "Satisfacción Promedio",
      value: "9.3 / 10",
    },
    {
      icon: <FaUserMd className="text-purple-500 text-3xl" />,
      label: "Último Doctor Atendido",
      value: "Dr. Carlos Ruiz",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex flex-col gap-8">
      {/* Header */}
      <div className="flex justify-between items-center">

      </div>

      {/* Información principal */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Perfil básico */}
        <div className="col-span-1 bg-white rounded-xl shadow p-6 flex flex-col gap-4">
          <div className="flex items-center gap-4 border-b pb-4">
            <img
              src={
                user.avatar ||
                "https://cdn-icons-png.flaticon.com/512/847/847969.png"
              }
              alt="Avatar"
              className="w-16 h-16 rounded-full border border-gray-200"
            />
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                {user.nombre} {user.apellido}
              </h2>
              <p className="text-gray-500 text-sm">
                {user.rol?.nombre || "Paciente"}
              </p>
            </div>
          </div>

          <div className="text-sm text-gray-700 space-y-2">
            <p>
              <strong>📧 Correo:</strong> {user.correo || "No especificado"}
            </p>
            <p>
              <strong>🆔 Documento:</strong> {user.documento || "No registrado"}
            </p>
            <p>
              <strong>👤 Usuario:</strong> {user.username || "No definido"}
            </p>
            <p>
              <strong>📱 Teléfono:</strong> {user.telefono || "No disponible"}
            </p>
          </div>

          <button
            onClick={() => navigate("/nueva-cita")}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium transition"
          >
            Agendar Nueva Cita
          </button>
        </div>

        {/* Widgets */}
        <div className="col-span-2 grid sm:grid-cols-2 gap-6">
          {widgets.map((w, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow p-6 flex items-center justify-between hover:shadow-md transition"
            >
              <div>
                <p className="text-sm text-gray-500">{w.label}</p>
                <p className="text-xl font-semibold text-gray-800">
                  {w.value}
                </p>
              </div>
              {w.icon}
            </div>
          ))}

          {/* Widget adicional: Evolución del paciente */}
          <div className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white p-6 rounded-xl shadow flex justify-between items-center col-span-2">
            <div>
              <p className="text-sm opacity-90">Evolución del paciente</p>
              <p className="text-2xl font-bold">+14% mejora este mes</p>
            </div>
            <FaChartLine className="text-4xl opacity-90" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Perfil;
