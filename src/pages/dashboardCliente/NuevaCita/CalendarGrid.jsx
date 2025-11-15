import React, { useMemo } from "react";
import dayjs from "dayjs";

/**
 * CalendarGrid - componente puro (sin llamadas al backend)
 * Props:
 *  - currentMonth (dayjs)
 *  - setCurrentMonth (fn)
 *  - fechaSeleccionada (dayjs)
 *  - setFechaSeleccionada (fn)
 */
const CalendarGrid = ({ currentMonth, setCurrentMonth, fechaSeleccionada, setFechaSeleccionada }) => {
  const startOfMonth = currentMonth.startOf("month");
  const endOfMonth = currentMonth.endOf("month");
  const firstDayOfWeek = startOfMonth.day();
  const daysInMonth = endOfMonth.date();
  const leadingEmptyDays = firstDayOfWeek;
  const totalDaysToShow = daysInMonth + leadingEmptyDays;
  const totalSlots = Math.ceil(totalDaysToShow / 7) * 7;
  const trailingEmptyDays = totalSlots - totalDaysToShow;

  const calendarGrid = useMemo(() => {
    const days = [];
    for (let i = 0; i < leadingEmptyDays; i++) days.push({ type: "empty" });
    for (let i = 1; i <= daysInMonth; i++) {
      const date = startOfMonth.date(i);
      days.push({ type: "day", date, isToday: date.isSame(dayjs(), "day") });
    }
    for (let i = 0; i < trailingEmptyDays; i++) days.push({ type: "empty" });
    return days;
  }, [currentMonth, daysInMonth, leadingEmptyDays, trailingEmptyDays, startOfMonth]);

  const changeMonth = (delta) => setCurrentMonth(currentMonth.add(delta, "month"));

  return (
    <div className="bg-gradient-to-b from-green-50 to-blue-50 dark:from-slate-800 dark:to-slate-900 p-6 rounded-3xl shadow-2xl border border-green-200 dark:border-slate-700 transition-all">
      <h2 className="text-2xl font-bold mb-4 text-green-800 dark:text-green-300 text-center">Seleccione una Fecha</h2>

      <div className="flex items-center justify-between pb-4 border-b border-green-200 dark:border-green-700 mb-4">
        <button onClick={() => changeMonth(-1)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-green-200/50 dark:hover:bg-green-700/50 transition-all duration-300">
          <span className="text-green-700 dark:text-green-200 w-5 h-5">&lt;</span>
        </button>

        <p className="text-xl font-extrabold text-green-900 dark:text-green-100">
          {currentMonth.format("MMMM YYYY").charAt(0).toUpperCase() + currentMonth.format("MMMM YYYY").slice(1)}
        </p>

        <button onClick={() => changeMonth(1)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-green-200/50 dark:hover:bg-green-700/50 transition-all duration-300">
          <span className="text-green-700 dark:text-green-200 w-5 h-5">&gt;</span>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold uppercase text-green-600 dark:text-green-400 mb-2">
        {["dom", "lun", "mar", "mié", "jue", "vie", "sáb"].map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {calendarGrid.map((slot, index) => (
          <div key={index} className="flex items-center justify-center h-12">
            {slot.type === "day" ? (
              <button
                onClick={() => setFechaSeleccionada(slot.date)}
                disabled={slot.date.isBefore(dayjs(), "day")}
                className={`
                  w-10 h-10 rounded-full text-sm font-medium flex items-center justify-center transition-all duration-300
                  ${slot.date.isBefore(dayjs(), "day")
                    ? "text-gray-400 dark:text-gray-600 cursor-not-allowed"
                    : slot.date.isSame(fechaSeleccionada, "day")
                    ? "bg-green-600 text-white font-bold shadow-lg shadow-green-400/50 ring-2 ring-green-300 ring-offset-2 dark:ring-offset-slate-900"
                    : slot.isToday
                    ? "border-2 border-blue-400 text-blue-600 font-semibold hover:bg-blue-100 dark:hover:bg-blue-700/30"
                    : "hover:bg-green-200/40 dark:hover:bg-green-700/40 text-green-800 dark:text-green-200"
                  }`}
              >
                {slot.date.date()}
              </button>
            ) : (
              <span className="h-10 w-10"></span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarGrid;
