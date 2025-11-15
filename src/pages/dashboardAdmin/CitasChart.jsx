import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { api } from "../../services/api";

const CitasChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    api
      .get("citas_por_dia.php")
      .then((res) => setData(res.data.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="rounded-xl p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
      <h2 className="text-gray-900 dark:text-white text-lg font-bold mb-4">
        Citas por Día
      </h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
            <XAxis dataKey="name" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1F2937",
                borderRadius: "8px",
                color: "#F9FAFB",
              }}
            />
            <Bar dataKey="citas" fill="#3B82F6" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CitasChart;
