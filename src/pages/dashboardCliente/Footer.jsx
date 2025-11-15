// src/components/Footer.jsx
import React from "react";
// 💡 Usar Link para navegación interna, si aplica (asumiendo react-router-dom)
import { Link } from 'react-router-dom'; 

const Footer = () => {
  // Configuración de los enlaces útiles (Mejora UX)
  const links = [
    { name: "Política de Privacidad", to: "/privacy" },
    { name: "Términos de Servicio", to: "/terms" },
    { name: "Soporte", to: "/support" },
  ];

  return (
    // 💡 UI: Asegurar que el footer se ancle en la parte inferior si la página es corta.
    // 💡 UI: Añadir un ligero borde superior o color de fondo sutil para separarlo del contenido.
    <footer className="w-full py-5 border-t border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        
        {/* 1. Derechos de Autor */}
        <p className="text-sm text-gray-500 dark:text-gray-400 order-2 md:order-1 mt-3 md:mt-0">
          © {new Date().getFullYear()} **ortho&amp;mas**. Todos los derechos reservados.
        </p>

        {/* 2. Enlaces Utilitarios (Mejora UX) */}
        <div className="flex space-x-4 order-1 md:order-2">
          {links.map((link) => (
            <Link
              key={link.name}
              to={link.to}
              // 💡 UI: Enlaces sutiles con hover interactivo
              className="text-sm text-gray-600 dark:text-gray-300 hover:text-brand dark:hover:text-brand-light transition duration-150"
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;