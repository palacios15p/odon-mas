import Sidebar from "./Sidebar";
import Header from "./Header";
import SegmentedButtons from "./SegmentedButtons";
import DoctorAppointmentsDashboard from "./DoctorAppointmentsDashboard";

const Dashboard = () => {

  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Sidebar fijo */}
      <Sidebar />

      {/* Contenido principal */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-md">
          <Header />
        </div>
        <SegmentedButtons />
        <DoctorAppointmentsDashboard doctorId={user.id} />

      </main>
    </div>
  );
};

export default Dashboard;
