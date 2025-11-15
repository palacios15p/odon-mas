// src/components/Footer.jsx
import React from "react";

const Footer = () => {
  return (
    <footer className="mt-10 py-6 border-t border-gray-200 dark:border-gray-800 text-center text-gray-600 dark:text-gray-400 text-sm">
      <p>
        © {new Date().getFullYear()} <span className="font-semibold text-brand">ortho&mas</span>. 
        Todos los derechos reservados.
      </p>
      <p className="mt-1">Versión 1.0.0</p>
    </footer>
  );
};

export default Footer;
