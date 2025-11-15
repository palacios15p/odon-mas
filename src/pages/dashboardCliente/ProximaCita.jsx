import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/es";
import Modal from "react-modal";
import { api } from "../../services/api";

dayjs.extend(relativeTime);
dayjs.locale("es");

// 🔧 Configuración global del modal
Modal.setAppElement("#root");

const ProximaCita = () => {
  const [cita, setCita] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalType, setModalType] = useState(""); // "detalles", "reprogramar", "cancelar"
  const [detalle, setDetalle] = useState(null);
  const [nuevaFecha, setNuevaFecha] = useState("");
  const [nuevaHora, setNuevaHora] = useState("");

  // ===========================
  // 🔹 Cargar próxima cita
  // ===========================
  useEffect(() => {
    const fetchCita = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) return;

        const { data } = await api.get(`/Cita.php?usuario_id=${user.id}`);
        if (data && !data.message) {
          setCita({
            id: data.cita_id,
            fecha_hora: data.fechaHora,
            servicio: data.servicio,
            descripcion: data.descripcion_servicio,
            doctor: data.doctor,
            doctor_avatar: data.doctor_avatar || "https://i.pravatar.cc/150?img=6",
            estado: data.estado,
          });
        }
      } catch (error) {
        console.error("Error al cargar la cita", error);
      }
    };
    setInterval(fetchCita, 10000); // Actualiza la cita cada 10 segundos

  }, []);

  if (!cita) return <p>No tienes próximas citas.</p>;

  const nextAppointmentDate = dayjs(cita.fecha_hora);
  const timeUntil = nextAppointmentDate.fromNow();

  // ===========================
  // 🔹 Abrir y cerrar modal
  // ===========================
  const openModal = (type) => {
    setModalType(type);
    setModalIsOpen(true);

    if (type === "detalles") {
      fetchDetalles(cita.id);
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setDetalle(null);
    setNuevaFecha("");
    setNuevaHora("");
  };

  // ===========================
  // 🔹 Ver detalles
  // ===========================
  const fetchDetalles = async (id) => {
    try {
      const { data } = await api.get(`/DetalleCita.php?cita_id=${id}`);
      if (data.success) setDetalle(data.cita);
      else alert("No se pudieron cargar los detalles de la cita.");
    } catch {
      alert("Error al cargar los detalles.");
    }
  };

  // ===========================
  // 🔹 Reprogramar cita
  // ===========================
  const handleReprogramar = async () => {
    if (!nuevaFecha || !nuevaHora) {
      alert("Por favor completa la nueva fecha y hora");
      return;
    }

    try {
      const { data } = await api.post(`/ReprogramarCita.php`, {
        cita_id: cita.id,
        nueva_fecha: nuevaFecha,
        nueva_hora: nuevaHora,
      });

      if (data.success) {
        alert("Cita reprogramada correctamente.");
        setCita({ ...cita, fecha_hora: `${nuevaFecha}T${nuevaHora}` });
        closeModal();
      } else {
        alert(data.message);
      }
    } catch {
      alert("Error al reprogramar la cita.");
    }
  };

  // ===========================
  // 🔹 Cancelar cita
  // ===========================
  const handleCancelar = async () => {
    try {
      const { data } = await api.post(`/CancelarCita.php`, { cita_id: cita.id });
      if (data.success) {
        alert("Cita cancelada correctamente.");
        setCita(null);
        closeModal();
      } else alert(data.message);
    } catch {
      alert("Error al cancelar la cita.");
    }
  };

  return (
    <section className="p-4">
      <h2 className="text-2xl font-bold mb-4">🗓️ Tu Próxima Cita</h2>
      <div className="p-6 rounded-2xl bg-white shadow-md flex flex-col md:flex-row items-start gap-4">
        {/* Avatar del doctor */}
        <div
          className="w-24 h-24 bg-center bg-cover rounded-full shadow-md"
          style={{ backgroundImage: `url(${cita.doctor_avatar})` }}
        ></div>

        {/* Información de la cita */}
        <div className="flex-1">
          <p className="text-lg font-bold">{cita.servicio}</p>
          <p className="text-gray-600">Con {cita.doctor}</p>
          <span className="text-sm text-gray-500">
            {nextAppointmentDate.format("dddd, DD [de] MMMM - h:mm A")} ({timeUntil})
          </span>
          <p className="text-gray-500 mt-1">{cita.descripcion}</p>

          {/* Botones de acción */}
          <div className="mt-3 flex gap-3 flex-wrap">
            <button
              onClick={() => openModal("detalles")}
              className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 transition"
            >
              🔎 Ver Detalles
            </button>
            <button
              onClick={() => openModal("reprogramar")}
              className="border px-3 py-1 rounded text-indigo-700 hover:bg-indigo-50 transition"
            >
              🔄 Reprogramar
            </button>
            <button
              onClick={() => openModal("cancelar")}
              className="border px-3 py-1 rounded text-red-600 hover:bg-red-50 transition"
            >
              ❌ Cancelar
            </button>
          </div>
        </div>
      </div>

      {/* ===========================
          🔸 Modal dinámico
      =========================== */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="bg-white p-6 rounded-2xl shadow-xl max-w-md mx-auto mt-32 relative"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start"
      >
        {/* Botón de cierre */}
        <button
          onClick={closeModal}
          className="absolute top-2 right-3 text-gray-500 hover:text-gray-800"
        >
          ✖
        </button>

        {/* Modal de Detalles */}
        {modalType === "detalles" && detalle && (
          <>
            <h3 className="text-xl font-semibold mb-3">Detalles de la cita</h3>
            <p><b>Servicio:</b> {detalle.servicio}</p>
            <p><b>Doctor:</b> {detalle.doctor}</p>
            <p><b>Fecha:</b> {detalle.fecha}</p>
            <p><b>Hora:</b> {detalle.hora}</p>
            <p><b>Estado:</b> {detalle.estado}</p>
            <p><b>Descripción:</b> {detalle.descripcion_servicio}</p>
          </>
        )}

        {/* Modal de Reprogramar */}
        {modalType === "reprogramar" && (
          <>
            <h3 className="text-xl font-semibold mb-3">Reprogramar cita</h3>
            <label className="block mb-2">
              Nueva Fecha:
              <input
                type="date"
                value={nuevaFecha}
                onChange={(e) => setNuevaFecha(e.target.value)}
                className="border rounded p-2 w-full mt-1"
              />
            </label>
            <label className="block mb-4">
              Nueva Hora:
              <input
                type="time"
                value={nuevaHora}
                onChange={(e) => setNuevaHora(e.target.value)}
                className="border rounded p-2 w-full mt-1"
              />
            </label>
            <button
              onClick={handleReprogramar}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              Guardar Cambios
            </button>
          </>
        )}

        {/* Modal de Cancelar */}
        {modalType === "cancelar" && (
          <>
            <h3 className="text-xl font-semibold mb-3 text-red-600">
              Cancelar cita
            </h3>
            <p>¿Estás seguro de que deseas cancelar esta cita?</p>
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={closeModal}
                className="border px-3 py-1 rounded hover:bg-gray-100"
              >
                No
              </button>
              <button
                onClick={handleCancelar}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Sí, cancelar
              </button>
            </div>
          </>
        )}
      </Modal>
    </section>
  );
};

export default ProximaCita;
