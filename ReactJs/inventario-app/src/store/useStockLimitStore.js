// Se importa la función "create" desde la librería "zustand", 
// que permite crear un estado global de manera sencilla.
import { create } from "zustand";

// Store para manejar el límite de stock bajo
const useStockLimitStore = create((set) => ({
  // Valor inicial del límite
  lowStockLimit: 0,

  // Actualiza el límite y lo guarda en localStorage
  setLowStockLimit: (value) => {
    set({ lowStockLimit: value });
    localStorage.setItem("lowStockLimit", value);
  },

  // Carga el valor desde localStorage al iniciar
  loadFromStorage: () => {
    const saved = Number(localStorage.getItem("lowStockLimit") || 0);
    set({ lowStockLimit: saved });
  }
}));

export default useStockLimitStore;