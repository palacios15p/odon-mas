import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { api } from "../../services/api";

const COLORS = ["#22C55E", "#FACC15", "#EF4444"];

const EstadoCitasChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    api
      .get("estado_citas.php")
      .then((res) => setData(res.data.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="rounded-xl p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
      <h2 className="text-gray-900 dark:text-white text-lg font-bold mb-4">
        Estado de las Citas
      </h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" outerRadius={100} label>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#1F2937",
                borderRadius: "8px",
                color: "#F9FAFB",
              }}
            />
            <Legend
              layout="horizontal"
              align="center"
              verticalAlign="bottom"
              wrapperStyle={{ color: "#9CA3AF", marginTop: "10px" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EstadoCitasChart;
