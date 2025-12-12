import React, { useState } from 'react';
import './index.css'
import Inicio from './components/Modulos/Inicio/Inicio';
import Inventario from './components/Modulos/Inventario/Inventario';
import Entradas from './components/Modulos/Entradas/Entradas';
import Salidas from './components/Modulos/Salidas/Salidas';

import { useAuthStore } from './store/authStore';
import sheetIdStore from './store/sheetIdStore';

function App() {
  // Estado para controlar cuál pestaña está activa
  const [activeTab, setActiveTab] = useState('Inicio');

  // Función que actualiza la pestaña activa cuando el usuario selecciona otra
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Estado global de login
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  // Id del archivo sheet
  const sheetId = sheetIdStore((state) => state.sheetId);

  return (
    <>
      <div className="flex min-h-screen bg-blue-100">
        {/* Menu Lateral Derecho */}
        <aside className="w-64 bg-blue-900 text-white p-4">
          <h2 className="text-xl font-semibold mb-6 text-center">Control de Inventario</h2>
          <ul>
            <li>
              <button
                className={`block w-full py-2 px-4 rounded ${activeTab === 'Inicio' ? 'bg-blue-700' : ''}`}
                onClick={() => handleTabChange('Inicio')}
              >
                Inicio
              </button>
            </li>

            {/* Solo mostrar si esta loggeado */}
            {isLoggedIn && sheetId && (
              <>
            <li>
              <button
                className={`block w-full py-2 px-4 rounded ${activeTab === 'Inventario' ? 'bg-blue-700' : ''}`}
                onClick={() => handleTabChange('Inventario')}
              >
                Inventario
              </button>
            </li>
            <li>
              <button
                className={`block w-full py-2 px-4 rounded ${activeTab === 'Entradas' ? 'bg-blue-700' : ''}`}
                onClick={() => handleTabChange('Entradas')}
              >
                Entradas
              </button>
            </li>
            <li>
              <button
                className={`block w-full py-2 px-4 rounded ${activeTab === 'Salidas' ? 'bg-blue-700' : ''}`}
                onClick={() => handleTabChange('Salidas')}
              >
                Salidas
              </button>
            </li>
            </>
            )}
          </ul>
        </aside>

        {/* Contenido Principal */}
        <main className="flex-1 p-6">
          {activeTab === 'Inicio' && <Inicio />}
          {isLoggedIn && activeTab === 'Inventario' && <Inventario />}
          {isLoggedIn && activeTab === 'Entradas' && <Entradas />}
          {isLoggedIn && activeTab === 'Salidas' && <Salidas />}
        </main>
      </div>
    </>
  )
}

export default App