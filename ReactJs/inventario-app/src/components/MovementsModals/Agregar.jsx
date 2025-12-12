import React, { useState, useEffect } from 'react';
import { gapi } from 'gapi-script';
import sheetIdStore from '../../store/sheetIdStore';

const Agregar = ({ type, closeModal, onAdd }) => {
  // Obtiene el sheetId desde Zustand
  const spreadsheetId = sheetIdStore(state => state.sheetId); 

  // Determina si el tipo es una entrada o salida
  const isEntrada = type === "entrada";
  const isSalida = type === "salida";

  // Estado del formulario
  const [formData, setFormData] = useState({
    nFactura: "",
    fecha: "",
    codigo: "",
    descripcion: "",
    cantidad: "",
  });

  // Estado para manejar errores del formulario
  const [errors, setErrors] = useState({
    cantidad: "",
    nFactura: "",
  });
  // Lista de códigos obtenidos del inventario
  const [codigos, setCodigos] = useState([]);

  // Carga los códigos desde Google Sheets cuando cambia el spreadsheetId
  useEffect(() => {
    const fetchCodigos = async () => {
      try {
        const response = await gapi.client.sheets.spreadsheets.values.get({
          spreadsheetId,
          range: "Inventario!A2:A",
        });

        const data = response.result.values || [];
        setCodigos(data.flat()); // Guarda los códigos en el estado
      } catch (error) {
        console.error("Error fetching codes:", error);
      }
    };

    fetchCodigos();
  }, [spreadsheetId]);

  // Maneja los cambios del formulario y valida que "cantidad" sea un número entero
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "cantidad") {
      if (!/^\d*$/.test(value)) {
        setErrors(prev => ({ ...prev, cantidad: "Debe ser un número entero" }));
        return;
      } else {
        setErrors(prev => ({ ...prev, cantidad: "" }));
      }
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Maneja la selección de un código y carga su descripción desde Google Sheets
  const handleSelect = async (e) => {
    const codigo = e.target.value;

    // Actualiza el código seleccionado y limpia la descripción
    setFormData(prev => ({
      ...prev,
      codigo,
      descripcion: "",
    }));

    try {
      // Obtiene todas las filas del inventario
      const response = await gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId,
        range: "Inventario!A2:G",
      });

      const rows = response.result.values || [];
      // Busca la fila del código seleccionado
      const row = rows.find(r => r[0] === codigo);

      // Si existe, carga la descripción asociada
      if (row) {
        setFormData(prev => ({
          ...prev,
          descripcion: row[1],
        }));
      }

    } catch (error) {
      console.error("Error fetching Inventario row:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nFactura || !formData.fecha || !formData.codigo ||
        !formData.descripcion || !formData.cantidad) 
    {
      setErrors(prev => ({ ...prev, cantidad: "Todos los campos son obligatorios" }));
      return;
    }

    try {
      // Validar Factura segun el tipo
      const sheetName = isEntrada ? "Entradas" : "Salidas";
      const respFactura = await gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `${sheetName}!A:A`,
      });

      const facturas = respFactura.result.values?.flat() || [];

      if (facturas.includes(formData.nFactura)) {
        setErrors(prev => ({
          ...prev,
          nFactura: `El Número de Factura ya existe en ${sheetName}`,
        }));
        return;
      }

      // Insertar fila en la hoja correspondiente
      await gapi.client.sheets.spreadsheets.values.append({
        spreadsheetId,
        range: `${sheetName}!A:F`,
        valueInputOption: "RAW",
        insertDataOption: "INSERT_ROWS",
        resource: {
          values: [
            [
              formData.nFactura,
              formData.fecha,
              formData.codigo,
              formData.descripcion,
              formData.cantidad,
              "",
            ],
          ],
        },
      });

      // Actualizar Inventario
      const invResp = await gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId,
        range: "Inventario!A2:G",
      });

      const rows = invResp.result.values || [];
      const rowIndex = rows.findIndex(r => r[0] === formData.codigo);

      if (rowIndex === -1) {
        console.error("Código no encontrado en Inventario");
        return;
      }

      const cantidad = parseInt(formData.cantidad, 10);

      let colIndex = isEntrada ? 3 : 4;   // Entradas = D(3), Salidas = E(4)
      let colLetter = isEntrada ? "D" : "E";

      const currentValue = parseInt(rows[rowIndex][colIndex], 10) || 0;
      const newValue = currentValue + cantidad;

      await gapi.client.sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `Inventario!${colLetter}${rowIndex + 2}`,
        valueInputOption: "RAW",
        resource: { values: [[newValue]] },
      });

      closeModal();
      onAdd();

    } catch (error) {
      console.error("Error submitting:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded shadow-lg w-3/4 md:w-1/2">

        <h2 className="text-xl font-bold mb-4">
          {isEntrada ? "Agregar Entrada" : "Agregar Salida"}
        </h2>

        <form onSubmit={handleSubmit}>

          {/* N° Factura */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">N° Factura</label>
            <input
              type="text"
              name="nFactura"
              value={formData.nFactura}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm pl-1"
            />
            {errors.nFactura && (
              <p className="text-red-500 text-sm">{errors.nFactura}</p>
            )}
          </div>

          {/* Fecha */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Fecha</label>
            <input
              type="date"
              name="fecha"
              value={formData.fecha}
              onChange={handleChange}
              className="mt-1 block w-29 border border-gray-300 rounded-md shadow-sm pl-1"
            />
          </div>

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
              {codigos.map((c, i) => (
                <option key={i} value={c}>{c}</option>
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
              readOnly
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none pl-1"
            />
          </div>

          {/* Cantidad */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Cantidad</label>
            <input
              type="text"
              name="cantidad"
              value={formData.cantidad}
              onChange={handleChange}
              inputMode="numeric"
              pattern="[0-9]*"
              className="mt-1 block w-20 border border-gray-300 rounded-md shadow-sm pl-1"
            />
            {errors.cantidad && <p className="text-red-500 text-sm">{errors.cantidad}</p>}
          </div>

          {/* Botones de Cancelar y Agregar */}
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={closeModal}
              className="bg-gray-500 text-white px-4 py-2 rounded shadow-md hover:bg-gray-600 focus:outline-none">
              Cancelar
            </button>

            <button type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded shadow-md hover:bg-green-600 focus:outline-none">
              Agregar
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Agregar;