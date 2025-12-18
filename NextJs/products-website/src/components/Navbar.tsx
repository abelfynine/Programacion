import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { BASE_PATH } from "@/lib/basePath";

function Navbar() {
  // Estado del menú móvil
  const [isOpen, setIsOpen] = useState(false);

  // Opciones del menú de navegación
  const menu = [
    { label: "Inicio", href: "/" },
    { label: "Quienes Somos", href: "/#quienessomos" },
    { label: "Servicios", href: "/#servicios" },
    { label: "FAQS", href: "/#faqs" },
    { label: "Contacto", href: "/#contacto" },
    { label: "Artículos", href: "/articulos" },
  ];

  return (
    // Header fijo con efecto blur
    <header className="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur shadow-sm">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo y nombre de la empresa */}
        <div className="flex items-center gap-3">
          <Image
            src={`${BASE_PATH}/images/empresalogo.png`}
            alt="Productos Naturales"
            width={50}
            height={50}
            className="object-contain"
          />
          <span className="text-2xl font-bold text-green-700">
            Empresa de Productos
          </span>
        </div>
        {/* Menu */}
        <div className="hidden lg:flex items-center space-x-8">
          {menu.map((item) => (
            <Link key={item.label} href={item.href} className="relative group whitespace-nowrap text-gray-700 font-medium text-[16px] hover:text-[#7BA882]transition-colors duration-300">{item.label}
              {/* Animacion Underline */}
              <span className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-[#7BA882] transition-all duration-300 group-hover:w-full group-hover:left-0"/>
            </Link>
          ))}
        </div>
        {/* Botón para Móvil */}
        <button className="lg:hidden flex flex-col gap-1.5 w-6 h-6 justify-center" onClick={() => setIsOpen(!isOpen)}>
          <span className={`block h-0.5 w-full bg-gray-700 transition-transform ${isOpen ? "rotate-45 translate-y-2" : ""}`}/>
          <span className={`block h-0.5 w-full bg-gray-700 transition-opacity ${isOpen ? "opacity-0" : "opacity-100"}`}/>
          <span className={`block h-0.5 w-full bg-gray-700 transition-transform ${isOpen ? "-rotate-45 -translate-y-2" : ""}`}/>
        </button>
      </nav>
      {/* Menu Móvil */}
      {isOpen && (
        <div className="lg:hidden bg-white shadow-md w-full px-6 py-4 flex flex-col space-y-4">
          {menu.map((item) => (
            <Link key={item.label} href={item.href} className="text-gray-700 font-medium text-[16px] hover:text-green-700 transition-colors duration-300" 
              onClick={() => setIsOpen(false)}>
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}

export default Navbar;