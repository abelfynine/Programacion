// Se importa la función "create" desde la librería "zustand", 
// que permite crear un estado global de manera sencilla.
import { create } from 'zustand';

// Store para manejar el estado de autenticación
export const useAuthStore = create((set) => ({
  isLoggedIn: false, // Indica si el usuario está autenticado
  setIsLoggedIn: (value) => set({ isLoggedIn: value }), // Actualiza el estado de login
}));

export default useAuthStore;