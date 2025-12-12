import React, { useState, useEffect } from "react";
import { gapi } from "gapi-script";
import sheetIdStore from "../../store/sheetIdStore";

const Modificar = ({ type, closeModal, onUpdate }) => {
    // Determina si el tipo es una entrada o salida
    const isEntrada = type === "entrada";
    const isSalida = type === "salida";
    // Define nombre de la hoja y columna según el tipo
    const sheetName = isEntrada ? "Entradas" : "Salidas";
    const inventarioCol = isEntrada ? 3 : 4; // D=3 Entradas, E=4 Salidas

    // Estado del formulario
    const [formData, setFormData] = useState({
        nfactura: "",
        fecha: "",
        codigo: "",
        descripcion: "",
        cantidad: "",
    });

    // Estados para validaciones, facturas, fila actual y datos cargados
    const [errors, setErrors] = useState({});
    const [facturas, setFacturas] = useState([]);
    const [currentRow, setCurrentRow] = useState(null);
    const [data, setData] = useState([]);

    // Obtiene el sheetId desde Zustand
    const sheetId = sheetIdStore((state) => state.sheetId);

    // Cargar facturas y datos iniciales
    useEffect(() => {
        // Obtiene solo la lista de facturas (columna A)
        const fetchFacturas = async () => {
            const resp = await gapi.client.sheets.spreadsheets.values.get({
                spreadsheetId: sheetId,
                range: `${sheetName}!A2:A`,
            });
            setFacturas(resp.result.values?.flat() || []);
        };

        // Obtiene todas las filas de la hoja (A-F)
        const fetchData = async () => {
            const resp = await gapi.client.sheets.spreadsheets.values.get({
                spreadsheetId: sheetId,
                range: `${sheetName}!A2:F`,
            });
            setData(resp.result.values || []);
        };

        // Ejecuta ambas consultas cuando cambia el sheetId o la hoja seleccionada
        fetchFacturas();
        fetchData();
    }, [sheetId, sheetName]);

    // Cambio de inputs
    const handleChange = (e) => {
        const { name, value } = e.target;

        // Validación: solo permitir números enteros en "cantidad"
        if (name === 'cantidad') {
            if (!/^\d*$/.test(value)) {
                setErrors({ ...errors, cantidad: 'Debe ser un número entero' });
                return; // No actualiza el formulario si es inválido
            } else {
                setErrors({ ...errors, cantidad: '' });
            }
        }

        // Actualiza el estado del formulario
        setFormData({ ...formData, [name]: value });
    };

    // Al seleccionar factura cargar datos de la fila
    const handleSelect = (e) => {
        const nfactura = e.target.value;

        // Reinicia el formulario con la factura seleccionada
        setFormData({
            nfactura: nfactura,
            fecha: "",
            codigo: "",
            descripcion: "",
            cantidad: "",
        });

        // Busca la fila correspondiente en los datos cargados
        const row = data.find((r) => r[0] === nfactura);
        // Si existe, llena el formulario con los valores de la fila
        if (row) {
            setCurrentRow(row);
            setFormData({
                nfactura: row[0],
                fecha: row[1],
                codigo: row[2],
                descripcion: row[3],
                cantidad: row[4],
            });
        }
    };

    // Actualiza un rango específico en la hoja de cálculo con los valores enviados
    const updateSheet = async (range, values) => {
        await gapi.client.sheets.spreadsheets.values.update({
            spreadsheetId: sheetId,
            range,
            valueInputOption: "RAW",
            resource: { values },
        });
    };

    // Guardar cambios
    const handleSubmit = async (e) => {
        // Evita el envío automático del formulario
        e.preventDefault();

        // Verifica que haya una factura seleccionada
        if (!currentRow) {
            console.error('No se ha seleccionado ninguna factura');
            return;
        }

        // Valida que los campos obligatorios no estén vacíos
        if (!formData.nfactura || !formData.fecha || !formData.cantidad) {
            setErrors(prev => ({ ...prev, cantidad: "Todos los campos son obligatorios" }));
            return;
        }

        // Construye la fila actualizada con los nuevos valores
        const updatedRow = [
            formData.nfactura,
            formData.fecha,
            formData.codigo,
            formData.descripcion,
            formData.cantidad,
            currentRow[5],
        ];

        // Busca la posición de la factura en los datos
        const rowIndex = data.findIndex((r) => r[0] === formData.nfactura);
        if (rowIndex === -1) {
            console.error('Factura no encontrada en los datos');
            return;
        }

        // Actualizar inventario
        const invResp = await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: sheetId,
            range: "Inventario!A2:G",
        });

        const invData = invResp.result.values || [];
        const invIndex = invData.findIndex((r) => r[0] === formData.codigo);

        if (invIndex === -1) {
            console.error("Código no encontrado en Inventario");
            return;
        }

        const prevCantidad = parseInt(currentRow[4] || "0");
        const newCantidad = parseInt(formData.cantidad || "0");
        const currentValue = parseInt(invData[invIndex][inventarioCol] || "0");

        // Entradas = sumar
        // Salidas = restar
        // Ajustando la diferencia
        const finalValue = isEntrada
            ? currentValue - prevCantidad + newCantidad
            : currentValue - prevCantidad + newCantidad;

        await updateSheet(`Inventario!${String.fromCharCode(65 + inventarioCol)}${invIndex + 2}`, [[finalValue]]);
        await updateSheet(`${sheetName}!A${rowIndex + 2}:F${rowIndex + 2}`, [updatedRow]);

        closeModal();
        onUpdate?.();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded shadow-lg w-1/2">
                <h2 className="text-xl font-bold mb-4">
                    Modificar {isEntrada ? "Entrada" : "Salida"}
                </h2>

                <form onSubmit={handleSubmit}>
                    {/* Seleccionar Factura */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">N° Factura</label>
                        <select
                            name="nfactura"
                            value={formData.nfactura}
                            onChange={handleSelect}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                        >
                            <option value="">Seleccionar factura</option>
                            {facturas.map((f, i) => (
                                <option key={i} value={f}>{f}</option>
                            ))}
                        </select>
                    </div>

                    {/* Campos */}
                    {["fecha", "codigo", "descripcion"].map((field) => (
                        <div key={field} className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">{field}</label>
                            <input
                                type={field === 'fecha' ? 'date' : 'text'}
                                name={field}
                                value={formData[field]}
                                onChange={handleChange}
                                readOnly={field !== 'fecha'}
                                className={`mt-1 block ${field === 'fecha' ? 'w-29' : 'w-full'} border border-gray-300 rounded-md shadow-sm pl-1 ${field !== 'fecha' ? 'focus:outline-none' : ''}`}
                            />
                        </div>
                    ))}

                    {/* Cantidad */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Cantidad</label>
                        <input
                            type="text"
                            name="cantidad"
                            value={formData.cantidad}
                            onChange={handleChange}
                            className="mt-1 block w-20 border border-gray-300 rounded-md shadow-sm pl-1"
                        />
                        {errors.cantidad && (
                            <p className="text-red-500 text-sm">{errors.cantidad}</p>
                        )}
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

export default Modificar;