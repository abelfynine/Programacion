import React, { useState, useEffect } from 'react';
import { gapi } from 'gapi-script';
import sheetIdStore from '../../../../store/sheetIdStore'

const InvModificar = ({ closeModal, onUpdate }) => {
  // Estado del formulario
  const [formData, setFormData] = useState({
    codigo: '',
    descripcion: '',
    existencia: '',
  });
  // Obtén el sheetId del store
  const sheetId = sheetIdStore(state => state.sheetId);
  // Estado para manejar errores del formulario
  const [errors, setErrors] = useState({
    existencia: '',
  });
  // Estado para guardar solo los códigos
  const [codigos, setCodigos] = useState([]);
  // Estadp para guardar todas las filas del inventario
  const [data, setData] = useState([]);

  // Carga códigos y datos completos del inventario cuando inicia el componente
  useEffect(() => {
    const fetchData = async () => {
      const codigosRange = 'Inventario!A2:A';
      const dataRange = 'Inventario!A2:G';

      try {
        // Ejecuta ambas consultas a Sheets en paralelo
        const [codigosResponse, dataResponse] = await Promise.all([
          gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: sheetId,
            range: codigosRange,
          }),
          gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: sheetId,
            range: dataRange,
          }),
        ]);

        // Guarda la lista de códigos y todas las filas obtenidas
        setCodigos(codigosResponse.result.values?.flat() || []);
        setData(dataResponse.result.values || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Maneja cambios en inputs, valida que "existencia" sea un número
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'existencia' && !/^\d*$/.test(value)) {
      setErrors({ ...errors, [name]: 'Debe ser un número entero' });
    } else {
      setErrors({ ...errors, [name]: '' });
      setFormData({ ...formData, [name]: value });
    }
  };

  // Rellena el formulario según el código seleccionado
  const handleSelect = (e) => {
    const selectedCodigo = e.target.value;
    const selectedRow = data.find(row => row[0] === selectedCodigo);

    if (selectedRow) {
      setFormData({
        codigo: selectedRow[0],
        descripcion: selectedRow[1],
        existencia: selectedRow[2],
      });
    } else {
      setFormData({ codigo: '', descripcion: '', existencia: '' });
    }
  };

  // Envía la actualización de una fila al inventario en Google Sheets
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.codigo) {
      console.error('No se ha seleccionado ninguna fila');
      return;
    }

    // Calcula la fila real dentro de la hoja (A2 = índice 2)
    const rowIndex = data.findIndex(row => row[0] === formData.codigo) + 2;
    const updatedRow = [formData.codigo, formData.descripcion, formData.existencia];

    try {
      await gapi.client.sheets.spreadsheets.values.update({
        spreadsheetId: sheetId,
        range: `Inventario!A${rowIndex}:G${rowIndex}`,
        valueInputOption: 'RAW',
        resource: { values: [updatedRow] },
      });
      closeModal();
      onUpdate(); // Refresca datos en el padre
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded shadow-lg w-1/2">
        <h2 className="text-xl font-bold mb-4">Modificar Inventario</h2>
        <form onSubmit={handleSubmit}>
          {/* Código */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Código</label>
            <select
              name="codigo"
              value={formData.codigo}
              onChange={handleSelect}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
            >
              <option value="">Seleccionar código</option>
              {codigos.map((codigo, index) => (
                <option key={index} value={codigo}>
                  {codigo}
                </option>
              ))}
            </select>
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
              className="mt-1 block w-20 border border-gray-300 rounded-md shadow-sm pl-1"
            />
            {errors.existencia && <p className="text-red-500 text-sm">{errors.existencia}</p>}
          </div>
          {/* Botones de Cancelar y Modificar */}
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
              className="bg-yellow-500 text-white px-4 py-2 rounded shadow-md hover:bg-yellow-600 focus:outline-none"
            >
              Modificar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InvModificar;