import React, { useState } from 'react';
import { gapi } from 'gapi-script';
import sheetIdStore from '../../../../store/sheetIdStore'

const InvAgregar = ({ closeModal, onAdd }) => {
  // Obtén el sheetId del store
  const sheetId = sheetIdStore(state => state.sheetId); 
  // Estado del formulario
  const [formData, setFormData] = useState({ codigo: '', descripcion: '', existencia: '' });
  // Estado para manejar errores del formulario
  const [errors, setErrors] = useState({ existencia: '', codigo: '' });
  // Estado para indicar si se está procesando el envío
  const [loading, setLoading] = useState(false);

  // Maneja los cambios del formulario y valida que "existencia" sea un número entero
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'existencia' && !/^\d*$/.test(value)) {
      updateErrors(name, 'Debe ser un número entero');
    } else {
      setFormData({...formData, [name]: value});
      updateErrors(name, '');
    }
  };

  // Actualiza errores específicos del formulario
  const updateErrors = (field, message) => {
    setErrors(prev => ({ ...prev, [field]: message }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Validación de campos obligatorios
    if (!formData.codigo || !formData.descripcion || !formData.existencia) {
      setErrors(prev => ({
        ...prev,
        codigo: formData.codigo ? '' : 'Campo obligatorio',
        descripcion: formData.descripcion ? '' : 'Campo obligatorio',
        existencia: formData.existencia ? '' : 'Campo obligatorio',
      }));
      setLoading(false);
      return;
    }

    // Verifica si el código ya existe en el inventario
    if (await checkExistingCode(formData.codigo)) {
      updateErrors('codigo', 'El código ya existe en el inventario');
      setLoading(false);
      return;
    }

    // Agrega el registro, limpia el formulario y cierra el modal
    await addNewInventoryItem();
    resetForm();
    closeModal();
    onAdd();
  };

  // Comprueba si un código ya está registrado en la hoja de inventario
  const checkExistingCode = async (code) => {
    const range = 'Inventario!A:A';
    const response = await gapi.client.sheets.spreadsheets.values.get({ spreadsheetId: sheetId, range });
    const existingCodes = response.result.values ? response.result.values.flat() : [];
    return existingCodes.includes(code);
  };

  // Inserta un nuevo ítem en el inventario
  const addNewInventoryItem = async () => {
    await gapi.client.sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: 'Inventario!A:F',
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      resource: { values: [[formData.codigo, formData.descripcion, formData.existencia, '', '', '']] }
    });
  };

  // Limpia el formulario y los errores
  const resetForm = () => {
    setFormData({ codigo: '', descripcion: '', existencia: '' });
    setErrors({});
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded shadow-lg w-3/4 md:w-1/2">
        <h2 className="text-xl font-bold mb-4">Agregar Inventario</h2>
        <form onSubmit={handleSubmit}>
          {/* Código */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Código</label>
            <input
              type="text"
              name="codigo"
              value={formData.codigo}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm pl-1"
            />
            {errors.codigo && <p className="text-red-500 text-sm">{errors.codigo}</p>}
          </div>
          {/* Descripción */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Descripción</label>
            <input
              type="text"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm pl-1"
            />
          </div>
          {/* Existencias */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Existencias</label>
            <input
              type="text"
              name="existencia"
              value={formData.existencia}
              onChange={handleChange}
              inputMode="numeric"
              pattern="[0-9]*"
              className="mt-1 block w-20 border border-gray-300 rounded-md shadow-sm pl-1"
            />
            {errors.existencia && <p className="text-red-500 text-sm">{errors.existencia}</p>}
          </div>
          {/* Botones de Cancelar y Agregar */}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={closeModal}
              className="bg-gray-500 text-white px-4 py-2 rounded shadow-md hover:bg-gray-600 focus:outline-none"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded shadow-md hover:bg-green-600 focus:outline-none"
            >
              Agregar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InvAgregar;