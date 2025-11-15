// src/pages/RegisterPage.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaUserCircle } from "react-icons/fa";
import { api } from "../services/api";

const RegisterPage = () => {
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!nombre || !apellido || !correo || !password) {
            toast.warning("Todos los campos son obligatorios.");
            return;
        }
        setLoading(true);
        try {
            await api.post("register.php", { nombre, apellido, correo, password });

            toast.success("Usuario registrado correctamente!");
            navigate("/login");
        } catch (error) {
            console.error(error);
            toast.error("Error al registrar usuario. Verifica los datos.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="font-display bg-gradient-to-br from-indigo-50 via-pink-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-text-light dark:text-text-dark min-h-screen flex flex-col items-center justify-center p-6 relative">
            <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-10 border border-gray-200 dark:border-gray-700 transform transition hover:scale-[1.02]">
                <div className="flex flex-col items-center mb-8">
                    <FaUserCircle className="text-primary text-7xl mb-4 drop-shadow-md" />
                    <h1 className="text-4xl font-extrabold text-primary tracking-wide">Crear Cuenta</h1>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-3 text-center">
                        Regístrate para acceder al sistema de citas
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <input
                        type="text"
                        placeholder="Nombre"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 p-3 bg-transparent focus:ring-2 focus:ring-primary focus:outline-none transition"
                    />
                    <input
                        type="text"
                        placeholder="Apellido"
                        value={apellido}
                        onChange={(e) => setApellido(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 p-3 bg-transparent focus:ring-2 focus:ring-primary focus:outline-none transition"
                    />
                    <input
                        type="email"
                        placeholder="Correo electrónico"
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 p-3 bg-transparent focus:ring-2 focus:ring-primary focus:outline-none transition"
                    />
                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 p-3 bg-transparent focus:ring-2 focus:ring-primary focus:outline-none transition"
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 rounded-lg font-semibold text-white shadow-md transition-transform ${loading
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 hover:scale-105"
                            }`}
                    >
                        {loading ? "Registrando..." : "Registrarse"}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <Link
                        to="/login"
                        className="text-sm text-gray-600 dark:text-gray-400 underline hover:text-primary transition"
                    >
                        ¿Ya tienes una cuenta? Inicia sesión
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
