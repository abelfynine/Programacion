import React, { useState, useEffect } from 'react';
import { gapi } from 'gapi-script';
import InvAgregar from './InvModal/InvAgregar';
import InvModificar from './InvModal/InvModificar';
import InvEliminar from './InvModal/InvEliminar';
import sheetIdStore from '../../../store/sheetIdStore'
import useStockLimitStore from "../../../store/useStockLimitStore";
import PdfModal from '../../ExportModal/ExportPdf';

const Inventario = () => {
    // Obtén el sheetId del store
    const SHEET_ID = sheetIdStore(state => state.sheetId);
    // Ajusta el rango A..F (codigo,desc,existencia,entradas,salidas,stock)
    const RANGE = 'Inventario!A2:F';
    // Se inicializa el estado "isAgregarOpen" en "false", 
    // lo que indica que el modal de agregar está cerrado por defecto.
    const [isAgregarOpen, setIsAgregarOpen] = useState(false);
    // Se inicializa el estado "isModificarOpen" en "false", 
    // lo que indica que el modal de modificar está cerrado por defecto.
    const [isModificarOpen, setIsModificarOpen] = useState(false);
    // Se inicializa el estado "isEliminarOpen" en "false", 
    // lo que indica que el modal de eliminar está cerrado por defecto.
    const [isEliminarOpen, setIsEliminarOpen] = useState(false);

    // Se define el estado "inventario" que inicialmente es un arreglo vacío. 
    const [inventario, setInventario] = useState([]);

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

    // Ver un limite de registros y mostrar las paginas
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);

    // Estado para indicar si la tabla aún está cargando
    const [loadingTableData, setLoadingTableData] = useState(true);

    // Obtiene el límite de stock y sus acciones desde el store de Zustand
    const { lowStockLimit, setLowStockLimit, loadFromStorage } = useStockLimitStore();

    // Cargar los datos de Inventario
    const loadInventoryData = async () => {
        try {
            const response = await gapi.client.sheets.spreadsheets.values.get({
                spreadsheetId: SHEET_ID,
                range: RANGE,
            });

            const data = response.result.values || []; // array de filas

            // Normalizar filas a 6 columnas y calcular stock
            const updatedData = data.map(row => {
                // Asegurar al menos 6 elementos
                const r = [...row];
                while (r.length < 6) r.push(''); // completar con strings vacíos

                const existencia = parseInt(r[2], 10) || 0;
                const entradas = parseInt(r[3], 10) || 0;
                const salidas = parseInt(r[4], 10) || 0;
                const stock = existencia + entradas - salidas;

                r[5] = String(stock);
                return r;
            });

            // Escribir de vuelta todo el bloque empezando en A2 (la API ajusta tamaño)
            await gapi.client.sheets.spreadsheets.values.update({
                spreadsheetId: SHEET_ID,
                range: 'Inventario!A2',
                valueInputOption: 'RAW',
                resource: { values: updatedData },
            });

            setInventario(updatedData);
            setLoadingTableData(false);
        } catch (error) {
            console.error('Error fetching inventory data:', error);
        }
    };

    // Al montar el componente: carga los datos del inventario y el valor guardado en localStorage
    useEffect(() => {
        if (gapi.client && gapi.client.sheets) {
            // Carga datos desde Google Sheets
            loadInventoryData();
        } else {
            console.error('gapi client not initialized');
        }
        // Recupera el límite de stock guardado
        loadFromStorage();
    }, []);

    // Recarga los datos cuando se actualiza la información
    const handleDataUpdate = async () => {
        await loadInventoryData();
    };

    // Recarga los datos después de agregar un nuevo registro
    const handleAdd = async () => {
        await loadInventoryData();
    };

    // Calcular el total de páginas
    const totalPages = Math.max(1, Math.ceil(inventario.length / rowsPerPage));

    // Obtener los datos a mostrar según la página seleccionada
    const paginatedRows = inventario.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    // Cambia la cantidad de filas por página y reinicia a la primera página
    const handleRowsChange = (e) => {
        setRowsPerPage(Number(e.target.value));
        setCurrentPage(1); // reset página
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Inventario</h1>
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

            {/* Selector de filas + Stock mínimo + PDF */}
            <div className="mb-4 flex justify-between items-center">

                {/* IZQUIERDA: Selector de filas */}
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

                {/* DERECHA: Stock mínimo + PDF juntos */}
                <div className="flex items-center gap-4">

                    {/* Stock mínimo */}
                    <div className="flex items-center gap-2">
                        <label className="font-bold">Stock mínimo:</label>
                        <input
                            type="number"
                            value={lowStockLimit}
                            onChange={(e) => setLowStockLimit(Number(e.target.value))}
                            className="border p-2 rounded w-24"
                            min="0"
                        />
                    </div>

                    {/* PDF button */}
                    <button
                        onClick={() => setIsPdfOpen(true)}
                        className="bg-[#112291] text-white px-4 py-2 rounded hover:bg-[#0A1685]"
                    >
                        PDF
                    </button>
                </div>
            </div>

            {/* Tabla */}
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead>
                    <tr className="bg-blue-500 text-white">
                        <th className="py-2 px-4 border-b">Código</th>
                        <th className="py-2 px-4 border-b">Descripción</th>
                        <th className="py-2 px-4 border-b">Existencias</th>
                        <th className="py-2 px-4 border-b">Entradas</th>
                        <th className="py-2 px-4 border-b">Salidas</th>
                        <th className="py-2 px-4 border-b">Stock</th>
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
                        paginatedRows.map((row, index) => {
                            const codigo = row[0] ?? '';
                            const descripcion = row[1] ?? '';
                            const existencia = row[2] ?? '';
                            const entradas = row[3] === "" || row[3] == null ? "0" : row[3];
                            const salidas = row[4] === "" || row[4] == null ? "0" : row[4];
                            const stock = row[5] ?? '';

                            return (
                                <tr key={index}>
                                    <td className="py-2 px-4 border-b text-center">{codigo}</td>
                                    <td className="py-2 px-4 border-b text-center">{descripcion}</td>
                                    <td className="py-2 px-4 border-b text-center">{existencia}</td>
                                    <td className="py-2 px-4 border-b text-center">{entradas}</td>
                                    <td className="py-2 px-4 border-b text-center">{salidas}</td>
                                    <td className={`py-2 px-4 border-b text-center ${Number(stock) <= lowStockLimit && lowStockLimit > 0
                                        ? "bg-red-500 text-black font-bold"
                                        : ""
                                        }`}>{stock}</td>
                                </tr>
                            );
                        })
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
            {isAgregarOpen && <InvAgregar closeModal={closeAgregarModal} onAdd={handleAdd} />}
            {isModificarOpen && <InvModificar closeModal={closeModificarModal} onUpdate={handleDataUpdate} />}
            {isEliminarOpen && <InvEliminar closeModal={closeEliminarModal} onUpdate={handleDataUpdate} />}

            {/* Pdf Modal */}
            {isPdfOpen && <PdfModal open={isPdfOpen} onClose={() => setIsPdfOpen(false)} data={inventario} type="inventario" lowStockLimit={lowStockLimit} />}
        </div>
    );
};

export default Inventario;