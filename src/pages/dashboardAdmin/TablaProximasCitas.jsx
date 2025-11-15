import React, { useEffect, useState } from "react";
import { api } from "../../services/api";

const TablaProximasCitas = () => {
  const [citas, setCitas] = useState([]);

  useEffect(() => {
    api
      .get("proximas_citas.php")
      .then((res) => {
        if (res.data.status === "success") {
          setCitas(res.data.data);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="mt-8">
      <h2 className="text-gray-900 dark:text-white text-xl font-bold">
        Próximas Citas
      </h2>
      <div className="mt-4 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto">
          <div className="inline-block min-w-full py-2 align-middle">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 dark:ring-white/10 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                <thead className="bg-gray-50 dark:bg-gray-900/50">
                  <tr>
                    {["Paciente", "Doctor", "Servicio", "Hora", ""].map((h) => (
                      <th
                        key={h}
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-gray-900">
                  {citas.length > 0 ? (
                    citas.map((cita) => (
                      <tr key={cita.cita_id}>
                        <td className="whitespace-nowrap py-4 pl-4 text-sm font-medium text-gray-900 dark:text-white">
                          {cita.paciente}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {cita.doctor}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {cita.servicio}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {cita.hora}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium">
                          <a
                            className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                            href="#"
                          >
                            Ver
                            <span className="sr-only">, {cita.paciente}</span>
                          </a>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-center py-6 text-gray-500 dark:text-gray-400"
                      >
                        No hay citas programadas para hoy.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TablaProximasCitas;
