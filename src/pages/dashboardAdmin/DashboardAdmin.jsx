import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import HeaderDashboard from "./HeaderDashboard";
import StatCard from "./StatCard";
import CitasChart from "./CitasChart";
import EstadoCitasChart from "./EstadoCitasChart";
import TablaProximasCitas from "./TablaProximasCitas";
import Footer from "./Footer";
import { api } from "../../services/api";

const DashboardAdmin = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api
      .get("admin.php")
      .then((res) => setStats(res.data.data))
      .catch((err) => console.error(err));
  }, []);

  if (!stats) return <p className="text-center mt-10">Cargando estadísticas...</p>;

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      {/* Sidebar */}
      <Sidebar />

      {/* Contenido Principal */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* Header */}
        <div className="p-8 pb-4">
          <HeaderDashboard title="Panel de Administración" />
        </div>

        {/* Tarjetas de Estadísticas */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-8 py-4">
          <StatCard title="Citas Hoy" value={stats.citas_hoy} percent="+5%" color="text-green-600" />
          <StatCard title="Ingresos del Mes" value={`$${stats.ingresos_mes}`} percent="+2.1%" color="text-green-600" />
          <StatCard title="Pacientes Nuevos" value={stats.pacientes_nuevos} percent="+8%" color="text-green-600" />
          <StatCard title="Tasa de Confirmación" value={`${stats.tasa_confirmacion}%`} percent="-1.5%" color="text-red-600" />
        </section>
        {/* Gráficos */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-8 mt-8">
          <CitasChart />
          <EstadoCitasChart />
        </section>

        {/* Tabla de Próximas Citas */}
        <section className="px-8 mt-8">
          <TablaProximasCitas />
        </section>

        {/* Footer */}
        <div className="mt-auto px-8 pb-6">
          <Footer />
        </div>
      </main>
    </div>
  );
};

export default DashboardAdmin;
