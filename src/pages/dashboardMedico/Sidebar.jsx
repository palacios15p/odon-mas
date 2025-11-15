import { FaTooth, FaCalendarAlt, FaUsers, FaClock, FaSignOutAlt, FaTachometerAlt } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { icon: <FaTachometerAlt />, label: "Dashboard", path: "/medico" },

  ];

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/"); // Redirige al login
  };

  return (
    <aside className="flex flex-col justify-between h-screen w-64 bg-gradient-to-b from-indigo-50 to-white dark:from-slate-900 dark:to-slate-800 border-r border-gray-200 dark:border-gray-800 p-4 shadow-lg">
      <div>
        {/* Logo */}
        <div className="flex items-center gap-2 px-2 pb-6">
          <FaTooth className="text-indigo-600 text-3xl" />
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">ortho&mas</h1>
        </div>

        {/* Usuario */}
        <div className="flex flex-col gap-6">
          <div className="flex gap-3 items-center p-2 rounded-lg bg-indigo-50 dark:bg-slate-700 shadow-sm">
            <img
              src={user?.foto_url || "https://i.pravatar.cc/100"}
              alt={user?.nombre || "Usuario"}
              className="rounded-full w-12 h-12 border-2 border-indigo-600"
            />
            <div>
              <h2 className="text-gray-900 dark:text-white font-semibold">
                {user?.rol?.nombre === "Doctor" ? "Dr. " : ""}{user?.nombre || "Nombre"} {user?.apellido || "Apellido"}
              </h2>
              <p className="text-gray-500 dark:text-gray-300 text-sm">{user?.rol?.nombre || "Rol"}</p>
            </div>
          </div>

          {/* Menú */}
          <nav className="flex flex-col gap-2 mt-4">
            {menuItems.map((item, i) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={i}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200 shadow-md"
                      : "hover:bg-indigo-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {item.icon}
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Cerrar sesión */}
      <div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-700 text-red-600 dark:text-red-400 transition-all duration-200"
        >
          <FaSignOutAlt />
          <span className="text-sm font-medium">Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
