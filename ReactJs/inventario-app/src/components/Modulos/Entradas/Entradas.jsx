import React, { useState, useEffect } from 'react';
import { gapi } from 'gapi-script';
import Agregar from '../../MovementsModals/Agregar';
import Modificar from '../../MovementsModals/Modificar';
import Eliminar from '../../MovementsModals/Eliminar';
import sheetIdStore from '../../../store/sheetIdStore'
import PdfModal from '../../ExportModal/ExportPdf';

const Entradas = () => {
  // Obtén el sheetId del store
  const sheetId = sheetIdStore(state => state.sheetId);
  // Se inicializa el estado "isAgregarOpen" en "false", 
  // lo que indica que el modal de agregar está cerrado por defecto.
  const [isAgregarOpen, setIsAgregarOpen] = useState(false);
  // Se inicializa el estado "isModificarOpen" en "false", 
  // lo que indica que el modal de modificar está cerrado por defecto.
  const [isModificarOpen, setIsModificarOpen] = useState(false);
  // Se inicializa el estado "isEliminarOpen" en "false", 
  // lo que indica que el modal de eliminar está cerrado por defecto.
  const [isEliminarOpen, setIsEliminarOpen] = useState(false);

  // Se define el estado "entradas" que inicialmente es un arreglo vacío. 
  const [entradas, setEntradas] = useState([]);

  // Función que abre el modal de agregar estableciendo "isAgregarOpen" en "true".
  const openAgregarModal = () => setIsAgregarOpen(true);
  // Función que cierra el modal de agregar estableciendo "isAgregarOpen" en "false".
  const closeAgregarModal = () => setIsAgregarOpen(false);

  // Función que abre el modal de modificar estableciendo "isModificarOpen" en "true".
  const openModificarModal = () => setIsModificarOpen(true);
  // Función que cierra el modal de modificar estableciendo "isModificarOpen" en "false".
  const closeModificarModal = () => setIsModificarOpen(false);

  // Función que abre el modal de eliminar estableciendo "isEliminarOpen" en "true".
  const openEliminarModal = () => setIsEliminarOpen(true);
  // Función que cierra el modal de eliminar estableciendo "isEliminarOpen" en "false".
  const closeEliminarModal = () => setIsEliminarOpen(false);

  // PDF modal
  const [isPdfOpen, setIsPdfOpen] = useState(false);

  // Estado para indicar si la tabla aún está cargando
  const [loadingTableData, setLoadingTableData] = useState(true);

  // Ver un limite de registros y mostrar las paginas
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  // Función para cargar los datos de entradas
  const handleAdd = async () => {
    try {
      const range = 'Entradas!A:F';

      const response = await gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: range,
      });

      const data = response.result.values || [];
      // Excluir el encabezado si existe
      setEntradas(data.slice(1));
      setLoadingTableData(false)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    // Cargar datos al iniciar el componente
    handleAdd();
  }, []);

  // Actualiza los datos después de una modificación
  const handleDataUpdate = async () => {
    // Llama a handleAdd para recargar los datos
    await handleAdd();
  };

  // Calcular el total de páginas
  const totalPages = Math.max(1, Math.ceil(entradas.length / rowsPerPage));

  // Obtener los datos a mostrar según la página seleccionada
  const paginatedRows = entradas.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleRowsChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1); // reset página
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Entradas</h1>
      <div className="flex justify-between mb-4">
        <button
          onClick={openAgregarModal}
          className="bg-green-500 text-white px-4 py-2 rounded shadow-md hover:bg-green-600 focus:outline-none">
          Agregar
        </button>
        <div className="flex space-x-2">
          <button
            onClick={openModificarModal}
            className="bg-yellow-500 text-white px-4 py-2 rounded shadow-md hover:bg-yellow-600 focus:outline-none">
            Modificar
          </button>
          <button
            onClick={openEliminarModal}
            className="bg-red-500 text-white px-4 py-2 rounded shadow-md hover:bg-red-600 focus:outline-none">
            Eliminar
          </button>
        </div>
      </div>

      {/* Selector de filas */}
      <div className="mb-4 flex justify-between items-center">

        {/* IZQUIERDA: selector */}
        <div className="flex items-center gap-2">
          <label className="font-bold">Mostrar:</label>

          <select
            value={rowsPerPage}
            onChange={handleRowsChange}
            className="border p-2 rounded"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={30}>30</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>

          <span>registros</span>
        </div>

        {/* DERECHA: botón PDF */}
        <button
          onClick={() => setIsPdfOpen(true)}
          className="bg-[#112291] text-white px-4 py-2 rounded hover:bg-[#0A1685]"
        >
          PDF
        </button>

      </div>

      {/* Tabla */}
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-blue-500 text-white">
            <th className="py-2 px-4 border-b">N° Factura</th>
            <th className="py-2 px-4 border-b">Fecha</th>
            <th className="py-2 px-4 border-b">Código</th>
            <th className="py-2 px-4 border-b">Descripción</th>
            <th className="py-2 px-4 border-b">Cantidad</th>
          </tr>
        </thead>
        <tbody>
          {loadingTableData ? (
            <tr>
              <td colSpan="6" className="text-center py-4 text-gray-500">
                Cargando datos...
              </td>
            </tr>
          ) : paginatedRows.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center py-4 text-gray-500">
                No hay datos registrados
              </td>
            </tr>
          ) : (
            paginatedRows.map((row, index) => (
            <tr key={index}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="py-2 px-4 border-b text-center">
                  {cell}
                </td>
              ))}
            </tr>
          ))
        )}
        </tbody>
      </table>

      {/* Paginación */}
      <div className="flex justify-between items-center mt-4">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(prev => prev - 1)}
          className="px-4 py-2 bg-[#009EB0] text-white hover:bg-[#007784] rounded disabled:opacity-50 disabled:pointer-events-none"
        >
          Anterior
        </button>

        <p>Página {currentPage} de {totalPages}</p>

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(prev => prev + 1)}
          className="px-4 py-2 bg-[#009EB0] text-white hover:bg-[#007784] rounded disabled:opacity-50 disabled:pointer-events-none"
        >
          Siguiente
        </button>
      </div>

      {/* Modales */}
      {isAgregarOpen && <Agregar type="entrada" closeModal={closeAgregarModal} onAdd={handleAdd} />}
      {isModificarOpen && <Modificar type="entrada" closeModal={closeModificarModal} onUpdate={handleDataUpdate} />}
      {isEliminarOpen && <Eliminar type="entrada" closeModal={closeEliminarModal} onUpdate={handleDataUpdate} />}

      {/* Pdf Modal */}
      {isPdfOpen && <PdfModal open={isPdfOpen} onClose={() => setIsPdfOpen(false)} data={entradas} type="entradas" />}
    </div>
  );
};

export default Entradas;