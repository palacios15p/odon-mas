import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Stethoscope,
  LogOut,
  BarChart3,
  Hospital,
  ShieldCheck,
} from "lucide-react";

// Mapeo de íconos
const iconMap = {
  Dashboard: LayoutDashboard,
  Calendario: CalendarDays,
  Pacientes: Users,
  Doctores: Stethoscope,
  Servicios: ShieldCheck,
  Reportes: BarChart3,
};

// Enlace con diseño mejorado
const SidebarLink = ({ name, icon: Icon, to, isLogout, onClick }) => {
  const baseClasses =
    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ease-in-out cursor-pointer select-none";
  const getLinkClasses = ({ isActive }) => {
    const activeClasses =
      "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/30 scale-[1.02]";
    let inactiveClasses =
      "hover:bg-blue-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400";
    if (isLogout)
      inactiveClasses =
        "hover:bg-red-50 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 hover:text-red-700";
    return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
  };

  return (
    <NavLink to={to} onClick={onClick} className={getLinkClasses}>
      <Icon className="w-5 h-5 flex-shrink-0" />
      <span className="text-sm font-semibold truncate">{name}</span>
    </NavLink>
  );
};

// Sidebar principal
const Sidebar = () => {
  const menuItems = [
    { name: "Dashboard", to: "/admin" },
    { name: "Calendario", to: "/calendario" },
    { name: "Pacientes", to: "/pacientes" },
    { name: "Doctores", to: "/doctores" },
  ];

  const bottomItems = [
    { name: "Salir", to: "/login", icon: LogOut, isLogout: true },
  ];

  return (
    <aside className="hidden md:flex w-64 flex-col border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="flex flex-col h-full p-5">

        {/* --- Header --- */}
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 p-3 rounded-xl shadow-sm">
            <Hospital className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              ortho&mas
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-tight">
              Clínica Odontológica
            </p>
          </div>
        </div>

        {/* --- Navegación principal --- */}
        <nav className="flex flex-col gap-1 flex-1 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => {
            const Icon = iconMap[item.name];
            return (
              <SidebarLink
                key={item.name}
                name={item.name}
                icon={Icon}
                to={item.to}
              />
            );
          })}
        </nav>

        {/* --- Footer --- */}
        <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-3">
          {bottomItems.map((item) => (
            <SidebarLink
              key={item.name}
              name={item.name}
              icon={item.icon}
              to={item.to}
              isLogout={item.isLogout}
            />
          ))}
          <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-4">
            © 2025 ortho&mas
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
