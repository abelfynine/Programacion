import React, { useState, useEffect } from 'react';
import { gapi } from 'gapi-script';
import sheetIdStore from '../../../../store/sheetIdStore'

const InvEliminar = ({ closeModal, onUpdate }) => {
    // Estado del formulario
    const [formData, setFormData] = useState({
        codigo: '',
        descripcion: '',
        existencia: '',
        entradas: '',
        salidas: '',
        stock: '',
    });

    // Obtén el sheetId del store
    const sheetId = sheetIdStore(state => state.sheetId);
    // Estado con todos los datos del inventario
    const [allData, setAllData] = useState([]);
    const range = 'Inventario!A2:G';

    // Carga los datos del inventario al montar el componente
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await gapi.client.sheets.spreadsheets.values.get({
                    spreadsheetId: sheetId,
                    range,
                });
                const data = response.result.values || [];
                setAllData(data); // Guarda todos los registros
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    // Maneja la selección de un código y carga sus datos en el formulario
    const handleSelect = (e) => {
        const selectedCodigo = e.target.value;
        const rowData = allData.find(row => row[0] === selectedCodigo);
        if (rowData) {
            const [codigo, descripcion, existencia, entradas, salidas, stock] = rowData;
            setFormData({ codigo, descripcion, existencia, entradas: entradas || "0", salidas: salidas || "0", stock });
        } else {
            setFormData({});
        }
    };

    // Envía el formulario y elimina el código seleccionado de todas las hojas
    const handleSubmit = async (e) => {
        e.preventDefault();
        const { codigo } = formData;

        if (!codigo) {
            console.error('No se ha seleccionado un código válido');
            return;
        }

        try {
            // Borrar registros de Entradas y Salidas y luego de Inventario
            const deleteEntries = async (sheetTitle) => {
                const response = await gapi.client.sheets.spreadsheets.values.get({
                    spreadsheetId: sheetId,
                    range: `${sheetTitle}!A2:F`,
                });
                const data = response.result.values || [];

                // Busca filas donde el código coincida
                const rowsToDelete = data.reduce((acc, row, index) => {
                    if (row[2] === codigo) acc.push(index + 2);
                    return acc;
                }, []);

                // Ordenar los índices de fila en orden descendente
                rowsToDelete.sort((a, b) => b - a);

                if (rowsToDelete.length > 0) {
                    const sheetInfo = await gapi.client.sheets.spreadsheets.get({ spreadsheetId: sheetId });
                    const sheet = sheetInfo.result.sheets.find(sheet => sheet.properties.title === sheetTitle);
                    const sheetIdToDeleteFrom = sheet.properties.sheetId;
                    // Genera las solicitudes de eliminación
                    const requests = rowsToDelete.map(rowNumber => ({
                        deleteDimension: {
                            range: {
                                sheetId: sheetIdToDeleteFrom,
                                dimension: 'ROWS',
                                startIndex: rowNumber - 1,
                                endIndex: rowNumber,
                            }
                        }
                    }));

                    await gapi.client.sheets.spreadsheets.batchUpdate({
                        spreadsheetId: sheetId,
                        resource: { requests }
                    });
                }
            };

            // Elimina coincidencias en Entradas y Salidas
            await deleteEntries('Entradas');
            await deleteEntries('Salidas');

            // Eliminar del Inventario
            const inventoryIndex = allData.findIndex(row => row[0] === codigo);
            if (inventoryIndex !== -1) {
                const inventoryRowNumber = inventoryIndex + 2;
                const requests = [{
                    deleteDimension: {
                        range: {
                            sheetId: 0,
                            dimension: 'ROWS',
                            startIndex: inventoryRowNumber - 1,
                            endIndex: inventoryRowNumber,
                        }
                    }
                }];
                await gapi.client.sheets.spreadsheets.batchUpdate({
                    spreadsheetId: sheetId,
                    resource: { requests }
                });
            }

            closeModal();
            if (onUpdate) onUpdate();
        } catch (error) {
            console.error('Error al eliminar los datos:', error);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded shadow-lg w-1/2">
                <h2 className="text-xl font-bold mb-4">Eliminar Inventario</h2>
                <form onSubmit={handleSubmit}>
                    {/* Código */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Código</label>
                        <select
                            name="codigo"
                            value={formData.codigo || ''}
                            onChange={handleSelect}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                        >
                            <option value="">Seleccionar código</option>
                            {allData.map((row, index) => (
                                <option key={index} value={row[0]}>
                                    {row[0]}
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
                            readOnly
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none pl-1"
                        />
                    </div>
                    <div className="flex space-x-4 mb-4">
                        {/* Existencias */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Existencias</label>
                            <input
                                type="text"
                                name="existencia"
                                value={formData.existencia}
                                readOnly
                                className="mt-1 block w-20 border border-gray-300 rounded-md shadow-sm focus:outline-none pl-1"
                            />
                        </div>
                        {/* Entradas */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Entradas</label>
                            <input
                                type="text"
                                name="entradas"
                                value={formData.entradas}
                                readOnly
                                className="mt-1 block w-20 border border-gray-300 rounded-md shadow-sm focus:outline-none pl-1"
                            />
                        </div>
                        {/* Salidas */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Salidas</label>
                            <input
                                type="text"
                                name="salidas"
                                value={formData.salidas}
                                readOnly
                                className="mt-1 block w-20 border border-gray-300 rounded-md shadow-sm focus:outline-none pl-1"
                            />
                        </div>
                        {/* Stock */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Stock</label>
                            <input
                                type="text"
                                name="stock"
                                value={formData.stock}
                                readOnly
                                className="mt-1 block w-20 border border-gray-300 rounded-md shadow-sm focus:outline-none pl-1"
                            />
                        </div>
                    </div>
                    {/* Botones de Cancelar y Eliminar */}    
                    <div className="flex justify-end space-x-2">
                        <button type="button" onClick={closeModal} className="bg-gray-500 text-white px-4 py-2 rounded shadow-md hover:bg-gray-600 focus:outline-none">Cancelar</button>
                        <button type="submit" className="bg-red-500 text-white px-4 py-2 rounded shadow-md hover:bg-red-600 focus:outline-none">Eliminar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default InvEliminar;