import React, { useState, useEffect } from "react";
import { gapi } from "gapi-script";
import sheetIdStore from "../../store/sheetIdStore";

const Eliminar = ({ type, closeModal, onUpdate }) => {
    // Estado del formulario
    const [formData, setFormData] = useState({
        nFactura: "",
        fecha: "",
        codigo: "",
        descripcion: "",
        cantidad: "",
    });

    // Estados para facturas
    const [facturas, setFacturas] = useState([]);

    // Obtiene el sheetId desde Zustand
    const sheetId = sheetIdStore((state) => state.sheetId);

    // Config según tipo
    const cfg = {
        entrada: {
            sheet: "Entradas",
            range: "Entradas!A2:F",
            inventarioColumn: 3, // columna D = entradas en inventario
            title: "Eliminar Entrada",
        },
        salida: {
            sheet: "Salidas",
            range: "Salidas!A2:F",
            inventarioColumn: 4, // columna E = salidas en inventario
            title: "Eliminar Salida",
        },
    }[type];

    // Cargar lista de facturas
    useEffect(() => {
        const fetchFacturas = async () => {
            try {
                // Solicita la columna A (facturas) de la hoja configurada
                const resp = await gapi.client.sheets.spreadsheets.values.get({
                    spreadsheetId: sheetId,
                    range: `${cfg.sheet}!A2:A`,
                });

                const data = resp.result.values || [];
                // Guarda las facturas en el estado
                setFacturas(data.flat());
            } catch (error) {
                console.error("Error cargando facturas:", error);
            }
        };

        // Ejecuta la carga una sola vez
        fetchFacturas();
    }, []);

    // Cargar datos al seleccionar factura
    const handleSelect = async (e) => {
        const nfactura = e.target.value;

        // Reinicia el formulario con la factura seleccionada
        setFormData({
            nFactura: nfactura,
            fecha: "",
            codigo: "",
            descripcion: "",
            cantidad: "",
        });

        try {
            const resp = await gapi.client.sheets.spreadsheets.values.get({
                spreadsheetId: sheetId,
                range: cfg.range,
            });

            // Busca la fila correspondiente en los datos cargados
            const row = resp.result.values?.find((r) => r[0] === nfactura);
            // Si existe, llena el formulario con los valores de la fila
            if (row) {
                setFormData({
                    nFactura: row[0],
                    fecha: row[1],
                    codigo: row[2],
                    descripcion: row[3],
                    cantidad: row[4],
                });
            }
        } catch (err) {
            console.error("Error obteniendo detalles:", err);
        }
    };

    // Obtener sheetId de la hoja correcta
    const getSheetId = async () => {
        try {
            const resp = await gapi.client.sheets.spreadsheets.get({
                spreadsheetId: sheetId,
            });

            const sheet = resp.result.sheets.find(
                (s) => s.properties.title === cfg.sheet
            );

            return sheet ? sheet.properties.sheetId : null;
        } catch {
            return null;
        }
    };

    // Eliminar
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const resp = await gapi.client.sheets.spreadsheets.values.get({
                spreadsheetId: sheetId,
                range: cfg.range,
            });

            const data = resp.result.values || [];
            const idx = data.findIndex((r) => r[0] === formData.nFactura);

            if (idx === -1) return;

            const rowNumber = idx + 2;
            const cantidadEliminar = parseInt(formData.cantidad);

            // Actualizar Inventario
            const invResp = await gapi.client.sheets.spreadsheets.values.get({
                spreadsheetId: sheetId,
                range: "Inventario!A2:G",
            });

            const invData = invResp.result.values || [];
            const invIdx = invData.findIndex((r) => r[0] === formData.codigo);

            if (invIdx !== -1) {
                const invRowNum = invIdx + 2;
                const col = cfg.inventarioColumn;

                const actual = parseInt(invData[invIdx][col]) || 0;
                const nuevo = actual - cantidadEliminar;

                await gapi.client.sheets.spreadsheets.values.update({
                    spreadsheetId: sheetId,
                    range: `Inventario!${String.fromCharCode(65 + col)}${invRowNum}`,
                    valueInputOption: "RAW",
                    resource: { values: [[nuevo]] },
                });
            }

            // Eliminar Fila
            const sheetIdReal = await getSheetId();
            await gapi.client.sheets.spreadsheets.batchUpdate({
                spreadsheetId: sheetId,
                resource: {
                    requests: [
                        {
                            deleteDimension: {
                                range: {
                                    sheetId: sheetIdReal,
                                    dimension: "ROWS",
                                    startIndex: rowNumber - 1,
                                    endIndex: rowNumber,
                                },
                            },
                        },
                    ],
                },
            });

            closeModal();
            onUpdate?.();
        } catch (error) {
            console.error("Error al eliminar:", error);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded shadow-lg w-1/2">
                <h2 className="text-xl font-bold mb-4">{cfg.title}</h2>

                <form onSubmit={handleSubmit}>
                    {/* Seleccionar Factura */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">N° Factura</label>
                        <select
                            name="nFactura"
                            value={formData.nFactura}
                            onChange={handleSelect}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                        >
                            <option value="">Seleccionar factura</option>
                            {facturas.map((factura, index) => (
                                <option key={index} value={factura}>{factura}</option>
                            ))}
                        </select>
                    </div>

                    {/* Campos */}
                    {["fecha", "codigo", "descripcion", "cantidad"].map((field) => (
                        <div key={field} className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">
                                {field === "codigo"
                                    ? "Código"
                                    : field === "descripcion"
                                        ? "Descripción"
                                        : field.charAt(0).toUpperCase() + field.slice(1)}
                            </label>
                            <input
                                type={field === 'fecha' ? 'date' : 'text'}
                                name={field}
                                value={formData[field]}
                                readOnly
                                className={`mt-1 block ${field === 'cantidad' ? 'w-20' : field === 'fecha' ? 'w-29' : 'w-full'} border border-gray-300 rounded-md shadow-sm pl-1 ${field !== 'fecha' ? 'focus:outline-none' : ''}`}
                            />
                        </div>
                    ))}

                    {/* Botones de Cancelar y Eliminar */}
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
                            className="bg-red-500 text-white px-4 py-2 rounded shadow-md hover:bg-red-600 focus:outline-none"
                        >
                            Eliminar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Eliminar;