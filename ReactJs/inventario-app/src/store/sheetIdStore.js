// Se importa la función "create" desde la librería "zustand", 
// que permite crear un estado global de manera sencilla.
import {create} from 'zustand';
import { persist } from 'zustand/middleware';

// Se crea un "store" utilizando "zustand", que contiene un estado llamado "sheetId".
// Inicialmente, "sheetId" se define como "null". 
// También se define una función "setSheetId" que actualiza el valor de "sheetId" cuando se le pasa un nuevo ID.
const sheetIdStore = create(persist((set) => ({
  sheetId: null,           // Estado inicial de sheetId es null.
  setSheetId: (id) => set({ sheetId: id }),  // Función que actualiza el estado de sheetId.
}),
{
  name: "sheet-id-storage", // Nombre en localStorage
}
));

// Se exporta "sheetIdStore" para que esté disponible en otras partes de la aplicación.
export default sheetIdStore;