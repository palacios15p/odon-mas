const StatCard = ({ title, value, percent, color }) => {
  return (
    <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
      <p className="text-gray-800 dark:text-gray-200 text-base font-medium">{title}</p>
      <p className="text-gray-900 dark:text-white text-3xl font-bold">{value}</p>
      <p className={`${color} text-sm font-medium`}>{percent}</p>
    </div>
  );
};

export default StatCard;
