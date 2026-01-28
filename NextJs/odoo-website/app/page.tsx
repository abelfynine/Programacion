// Indicamos que este archivo es un componente de Next.js que se renderiza en el cliente
"use client";
// Importamos hooks de React
import { useRef, useState, useEffect } from "react";
// Importamos un ícono de copiar de la librería react-icons
import { FaRegCopy } from "react-icons/fa";

// Definimos un tipo TypeScript para los usuarios
type User = {
  name: string;
  email: string;
  password: string;
};

export default function Home() {
  // Creamos una referencia al iframe para poder acceder a él directamente
  const iframeRef = useRef<HTMLIFrameElement>(null);
  // Estado para controlar si el iframe está permitido según el origen
  const [allowed, setAllowed] = useState(false);
  // Estado para indicar si todavía se está verificando el origen
  const [checking, setChecking] = useState(true);

  // Lista de usuarios con sus credenciales, usando variables de entorno
  const users: User[] = [
    { name: "RH", email: process.env.NEXT_PUBLIC_RH!, password: process.env.NEXT_PUBLIC_RH2! },
    { name: "Marketing", email: process.env.NEXT_PUBLIC_MARKETING!, password: process.env.NEXT_PUBLIC_MARKETING2! },
    { name: "Ventas", email: process.env.NEXT_PUBLIC_VENTAS!, password: process.env.NEXT_PUBLIC_VENTAS2! },
    { name: "Mantenimiento", email: process.env.NEXT_PUBLIC_MANTENIMIENTO!, password: process.env.NEXT_PUBLIC_MANTENIMIENTO2! },
    { name: "Operaciones", email: process.env.NEXT_PUBLIC_OPERACIONES!, password: process.env.NEXT_PUBLIC_OPERACIONES2! },
  ];

  // Estado para el usuario actualmente seleccionado, por defecto el primero de la lista
  const [selectedUser, setSelectedUser] = useState<User>(users[0]);

  // Función para copiar texto al portapapeles
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // useEffect que se ejecuta al montar el componente
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.origin === process.env.NEXT_PUBLIC_LOC_ORI) {
      setAllowed(true);
    }
    setChecking(false);
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-start bg-white font-sans p-6">
      {/* Título */}
      <h1 className="text-2xl font-bold text-black mb-4">Usuarios de prueba</h1>
      {/* Campos en la misma línea */}
      <div className="flex items-center justify-center gap-6 mb-6 w-full max-w-full flex-wrap">
        {/* Usuario */}
        <div className="flex items-center gap-2">
          <label className="text-black font-medium">Usuario:</label>
          <select
            className="text-black px-2 py-1 border rounded-md"
            value={selectedUser.name}
            onChange={(e) => {
              const user = users.find(u => u.name === e.target.value);
              if (user) setSelectedUser(user);
            }}
          >
            {users.map(user => (
              <option key={user.name} value={user.name}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        {/* Correo */}
        <div className="flex items-center relative gap-2">
          <label className="text-black font-medium">Correo:</label>
          <input
            type="password"
            readOnly
            value={selectedUser.email}
            className="text-black px-2 py-1 pr-10 border rounded-md focus:outline-none cursor-default w-40"
          />
          <FaRegCopy
            className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700"
            onClick={() => copyToClipboard(selectedUser.email)}
          />
        </div>

        {/* Contraseña */}
        <div className="flex items-center relative gap-2">
          <label className="text-black font-medium">Contraseña:</label>
          <input
            type="password"
            readOnly
            value={selectedUser.password}
            className="text-black px-2 py-1 pr-10 border rounded-md focus:outline-none cursor-default w-32"
          />
          <FaRegCopy
            className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700"
            onClick={() => copyToClipboard(selectedUser.password)}
          />
        </div>
      </div>

      {/* Iframe */}
      <div className="w-full h-[84vh] p-1 sm:p-2 bg-white dark:bg-zinc-900 rounded-lg shadow-lg">
        {checking ? (
          <div className="flex flex-col items-center justify-center h-full bg-gray-100 text-center p-6">
            <p className="text-black text-lg animate-pulse">
              Cargando...
            </p>
          </div>
        ) : allowed ? (
          <iframe
            ref={iframeRef}
            src={process.env.NEXT_PUBLIC_URL}
            className="w-full h-full"
            title="Odoo"
            allow="clipboard-read; clipboard-write"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        ) : (
          <div className="flex flex-col items-center justify-center h-full bg-gray-100 text-center p-6">
            <p className="text-black mb-4 text-lg">
              No se puede cargar Odoo desde este sitio.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}