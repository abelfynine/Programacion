import React, { useEffect, useMemo, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Operadores disponibles para filtros o comparaciones
const OPERATORS = [
    { value: "equal", label: "Igual" },
    { value: "gte", label: "Igual o mayor" },
    { value: "lte", label: "Igual o menor" },
    { value: "between", label: "Entre" },
    { value: "gt", label: "Mayor" },
    { value: "lt", label: "Menor" },
];

// Operadores específicos para manejo de stock, combinando algunos generales
const STOCK_OPERATORS = [
    { value: "stock_min", label: "Stock mínimo" },
    { value: "stock_above", label: "Stock arriba del mínimo" },
    ...OPERATORS,
];

// Componente Pdf que muestra un modal
// Props: open, onClose (cerrar modal), data (datos a mostrar), 
// type (tipo de reporte) y lowStockLimit (límite de stock)
export default function Pdf({ open, onClose, data, type, lowStockLimit }) {
    // Estado para controlar si se muestran todos los filtros
    const [filterAll, setFilterAll] = useState(true);

    // Definir configuraciones según el tipo
    const config = useMemo(() => {
        if (type === "entradas") {
            return {
                title: "Reporte de Entradas",
                columns: ["N° Factura", "Fecha", "Código", "Descripción", "Cantidad"],
                columnIndexes: [0, 1, 2, 3, 4], // Columnas dentro de data
                allowFilters: false, // No usar filtros numéricos
                allowCodeFilter: true // Sí permite seleccionar códigos
            };
        }

        if (type === "salidas") {
            return {
                title: "Reporte de Salidas",
                columns: ["N° Factura", "Fecha", "Código", "Descripción", "Cantidad"],
                columnIndexes: [0, 1, 2, 3, 4], // Columnas dentro de data
                allowFilters: false, // No usar filtros numéricos
                allowCodeFilter: true // Sí permite seleccionar códigos
            };
        }

        // Si es inventario (por default)
        return {
            title: "Reporte de Inventario",
            columns: ["Código", "Descripción", "Existencias", "Entradas", "Salidas", "Stock"],
            columnIndexes: [0, 1, 2, 3, 4, 5],
            allowFilters: true,
            allowCodeFilter: true
        };
    }, [type]);

    // Lista única de códigos o facturas según el tipo de reporte
    const codes = useMemo(() => {
        // Para Inventario: lista única de códigos (columna 0)
        if (!data) return [];
        if (type === "entradas") {
            // Para entradas: esta lista será N°Factura (columna 0)
            return Array.from(new Set(data.map(r => String(r[0] ?? "").trim()).filter(Boolean)));
        }
        if (type === "salidas") {
            // Para salidas: esta lista será N°Factura (columna 0)
            return Array.from(new Set(data.map(r => String(r[0] ?? "").trim()).filter(Boolean)));
        }
        // Por defecto (inventario): códigos (columna 0)
        return Array.from(new Set(data.map(r => String(r[0] ?? "").trim()).filter(Boolean)));
    }, [data, type]);

    // Lista única de códigos para entradas
    const codesEntrada = useMemo(() => {
        if (type !== "entradas") return [];
        return [...new Set(data.map(row => String(row[2])))]; // columna 2 = código
    }, [type, data]);

    // Lista única de códigos para salidas
    const codesSalida = useMemo(() => {
        if (type !== "salidas") return [];
        return [...new Set(data.map(row => String(row[2])))]; // columna 2 = código
    }, [type, data]);

    // Estados para los códigos seleccionados según tipo de reporte
    const [selectedCodes, setSelectedCodes] = useState([]);
    const [selectedCodesEntrada, setSelectedCodesEntrada] = useState([]);
    const [selectedCodesSalida, setSelectedCodesSalida] = useState([]);

    // Estado para los filtros de valores numéricos y stock
    const [filters, setFilters] = useState({
        existencias: { op: "equal", val1: "", val2: "" },
        entradas: { op: "equal", val1: "", val2: "" },
        salidas: { op: "equal", val1: "", val2: "" },
        stock: { op: "stock_min", val1: "", val2: "" },
        cantidad: { op: "equal", val1: "", val2: "" },
    });

    // Estado para filtros de fecha
    const [dateFilters, setDateFilters] = useState({
        fechaDesde: "",
        fechaHasta: ""
    });

    // Resetea filtros y selecciones cuando se cierra el modal o componente
    useEffect(() => {
        if (!open) {
            setFilterAll(true);
            setSelectedCodes([]);
            setFilters({
                existencias: { op: "equal", val1: "", val2: "" },
                entradas: { op: "equal", val1: "", val2: "" },
                salidas: { op: "equal", val1: "", val2: "" },
                stock: { op: "stock_min", val1: "", val2: "" },
                cantidad: { op: "equal", val1: "", val2: "" },
            });
        }
    }, [open]);

    // Convierte un valor a número, devuelve null si no es válido
    const parseNum = (v) => {
        const n = Number(v);
        return Number.isNaN(n) ? null : n;
    };

    // Evalúa si un valor cumple con un operador y valores de comparación
    const matchesOp = (value, op, v1, v2) => {
        if (value === null || value === undefined) return false;
        const num = Number(value);
        const a = parseNum(v1);
        const b = parseNum(v2);

        switch (op) {
            case "equal": return a !== null && num === a; // Igual
            case "gte": return a !== null && num >= a; // Mayor o igual
            case "lte": return a !== null && num <= a; // Menor o igual
            case "gt": return a !== null && num > a; // Mayor
            case "lt": return a !== null && num < a; // Mayor
            case "between": return a !== null && b !== null && num >= Math.min(a, b) && num <= Math.max(a, b); // Entre dos valores
            default: return false;
        }
    };

    // Devuelve el símbolo correspondiente a un operador
    const getOpSymbol = (op) => {
        const map = {
            equal: "=", // Igual
            gt: ">", // Mayor
            gte: ">=", // Mayor o igual
            lt: "<", // Menor
            lte: "<=", // Menor o igual
            between: "between" // Entre dos valores
        };
        return map[op] || op; // Devuelve el símbolo o el operador original si no existe
    };

    const applyFilters = () => {
        // Comenzar desde las filas del inventario
        let rows = [...data];

        // Si no es Todos, aplicar filtro de código si lo hay
        if (!filterAll) {

            // Filtros para Salidas
            if (type === "salidas") {

                // Filtrar por N° Factura (selectedCodes) - columna 0
                if (selectedCodes.length > 0) {
                    rows = rows.filter(r => selectedCodes.includes(String(r[0])));
                }

                // Filtrar por Código dentro de Salidas (selectedCodesSalida) - columna 2
                if (selectedCodesSalida && selectedCodesSalida.length > 0) {
                    rows = rows.filter(r => selectedCodesSalida.includes(String(r[2] ?? "").trim()));
                }

                // Filtro de Fechas
                if (dateFilters.fechaDesde) {
                    rows = rows.filter(r => r[1] >= dateFilters.fechaDesde);
                }

                if (dateFilters.fechaHasta) {
                    rows = rows.filter(r => r[1] <= dateFilters.fechaHasta);
                }

                // Filtro Numerico de Cantidad
                const cfg = filters.cantidad;

                if (cfg.op === "between") {
                    if (cfg.val1 !== "" && cfg.val2 !== "") {
                        rows = rows.filter(r =>
                            matchesOp(Number(r[4] || 0), cfg.op, cfg.val1, cfg.val2)
                        );
                    }
                } else {
                    if (cfg.val1 !== "") {
                        rows = rows.filter(r =>
                            matchesOp(Number(r[4] || 0), cfg.op, cfg.val1, null)
                        );
                    }
                }

                return rows;
            }

            // Filtros para Entradas
            if (type === "entradas") {

                // Filtrar por N° Factura (selectedCodes) - columna 0
                if (selectedCodes.length > 0) {
                    rows = rows.filter(r => selectedCodes.includes(String(r[0])));
                }

                // Filtrar por Código dentro de Entradas (selectedCodesEntrada) - columna 2
                if (selectedCodesEntrada && selectedCodesEntrada.length > 0) {
                    rows = rows.filter(r => selectedCodesEntrada.includes(String(r[2] ?? "").trim()));
                }

                // Filtro de Fechas
                if (dateFilters.fechaDesde) {
                    rows = rows.filter(r => r[1] >= dateFilters.fechaDesde);
                }

                if (dateFilters.fechaHasta) {
                    rows = rows.filter(r => r[1] <= dateFilters.fechaHasta);
                }

                // Filtro numerico de cantidad
                const cfg = filters.cantidad;

                if (cfg.op === "between") {
                    if (cfg.val1 !== "" && cfg.val2 !== "") {
                        rows = rows.filter(r =>
                            matchesOp(Number(r[4] || 0), cfg.op, cfg.val1, cfg.val2)
                        );
                    }
                } else {
                    if (cfg.val1 !== "") {
                        rows = rows.filter(r =>
                            matchesOp(Number(r[4] || 0), cfg.op, cfg.val1, null)
                        );
                    }
                }

                return rows;
            }

            // Filtros para Inventarios
            // Filtra las filas para incluir solo las cuyo código está en selectedCodes
            if (selectedCodes.length > 0) {
                rows = rows.filter(r => selectedCodes.includes(String(r[0])));
            }

            // Aplica filtros numéricos para existencias, entradas y salidas
            ["existencias", "entradas", "salidas"].forEach((field, idx) => {
                const cfg = filters[field];
                if (!cfg || cfg.op === "") return;
                
                // Para "between", ambos valores deben estar definidos
                if (cfg.op === "between") {
                    if (cfg.val1 === "" || cfg.val2 === "") return;
                } else {
                    if (cfg.val1 === "") return;
                }
                // Determina el índice de columna según el campo
                const colIndex = field === "existencias" ? 2 : field === "entradas" ? 3 : 4;
                // Filtra las filas según el operador y valores
                rows = rows.filter(r => {
                    const val = Number(r[colIndex] || 0);
                    return matchesOp(val, cfg.op, cfg.val1, cfg.val2);
                });
            });

            // Filtra por stock según el límite mínimo o los operadores seleccionados
            const sCfg = filters.stock;
            if (sCfg) {
                if (sCfg.op === "stock_min") {
                    // Filtra filas con stock menor o igual al límite
                    rows = rows.filter(r => Number(r[5] || 0) <= Number(lowStockLimit || 0));
                } else if (sCfg.op === "stock_above") {
                    // Filtra filas con stock mayor al límite
                    rows = rows.filter(r => Number(r[5] || 0) > Number(lowStockLimit || 0));
                } else {
                    // Si el operador es "between", filtra valores entre val1 y val2
                    if (sCfg.op === "between") {
                        if (sCfg.val1 !== "" && sCfg.val2 !== "") {
                            rows = rows.filter(r => matchesOp(Number(r[5] || 0), sCfg.op, sCfg.val1, sCfg.val2));
                        }
                    } else {
                        // Si es otro operador, filtra usando solo val1
                        if (sCfg.val1 !== "") {
                            rows = rows.filter(r => matchesOp(Number(r[5] || 0), sCfg.op, sCfg.val1, sCfg.val2));
                        }
                    }
                }
            }
        }

        return rows;
    };

    const handleGenerate = () => {
        // Aplica los filtros seleccionados sobre los datos
        const filtered = applyFilters();

        // Crear un nuevo PDF en orientación horizontal
        const doc = new jsPDF({ putOnlyUsedFonts: true, orientation: "landscape" });

        // Configurar título del PDF
        doc.setFontSize(18);
        doc.setFont("helvetica", "bold");
        doc.text(config.title, doc.internal.pageSize.getWidth() / 2, 20, { align: "center" });

        // Array para almacenar filas ya procesadas (por si se necesita para evitar duplicados)
        const applied = [];

        // Mostrar todos los datos de la tabla (sin filtros) si filterAll es verdadero
        if (filterAll) {
            applied.push("Todos");
        } else {
            // Filtros Generales (Inventario)
            if (selectedCodes.length > 0) {
                applied.push(`${type === "inventario" ? "Códigos" : "N° Factura"}: ${selectedCodes.join(", ")}`);
            }
            // Filtros Entradas
            if (type === "entradas") {
                // Filtrar por códigos entrada seleccionados
                if (selectedCodesEntrada.length > 0) {
                    applied.push(`Código: ${selectedCodesEntrada.join(", ")}`);
                }
                // Filtrar por rango de fechas
                if (dateFilters.fechaDesde) applied.push(`Fecha desde: ${dateFilters.fechaDesde.split("-").reverse().join("-")}`);
                if (dateFilters.fechaHasta) applied.push(`Fecha hasta: ${dateFilters.fechaHasta.split("-").reverse().join("-")}`);
                // Filtrar por cantidad (entre dos valores o valor único)
                if (filters.cantidad.op === "between" && filters.cantidad.val1 && filters.cantidad.val2)
                    applied.push(`Cantidad: ${filters.cantidad.val1} - ${filters.cantidad.val2}`);
                else if (filters.cantidad.val1)
                    applied.push(`Cantidad ${getOpSymbol(filters.cantidad.op)} ${filters.cantidad.val1}`);
            }
            // Filtros Salidas
            if (type === "salidas") {
                // Filtrar por códigos salida seleccionados
                if (selectedCodesSalida.length > 0) {
                    applied.push(`Código: ${selectedCodesSalida.join(", ")}`);
                }
                // Filtrar por rango de fechas
                if (dateFilters.fechaDesde) applied.push(`Fecha desde: ${dateFilters.fechaDesde.split("-").reverse().join("-")}`);
                if (dateFilters.fechaHasta) applied.push(`Fecha hasta: ${dateFilters.fechaHasta.split("-").reverse().join("-")}`);
                // Filtrar por cantidad (entre dos valores o valor único)
                if (filters.cantidad.op === "between" && filters.cantidad.val1 && filters.cantidad.val2)
                    applied.push(`Cantidad: ${filters.cantidad.val1} - ${filters.cantidad.val2}`);
                else if (filters.cantidad.val1)
                    applied.push(`Cantidad ${getOpSymbol(filters.cantidad.op)} ${filters.cantidad.val1}`);
            }

            // Filtros Inventario (numéricos)
            if (type === "inventario") {
                ["existencias", "entradas", "salidas"].forEach(f => {
                    const cfg = filters[f];
                    if (!cfg) return;

                    // Convertir Nombre a (Existencias, Entradas, Salidas)
                    const label = f.charAt(0).toUpperCase() + f.slice(1);

                    if (cfg.op === "between" && cfg.val1 && cfg.val2) {
                        applied.push(`${label}: ${cfg.val1} - ${cfg.val2}`);
                    }
                    else if (cfg.val1) {
                        applied.push(`${label} ${getOpSymbol(cfg.op)} ${cfg.val1}`);
                    }
                });

                // Filtros para Stock
                const sc = filters.stock;
                if (sc.op === "stock_min")
                    applied.push(`Stock mínimo (${lowStockLimit})`);
                else if (sc.op === "stock_above")
                    applied.push(`Stock arriba del mínimo (${lowStockLimit})`);
                else if (sc.op === "between" && sc.val1 && sc.val2)
                    applied.push(`Stock: ${sc.val1} - ${sc.val2}`);
                else if (sc.val1)
                    applied.push(`Stock ${getOpSymbol(sc.op)} ${sc.val1}`);
            }
        }

        // Escribe en el PDF los filtros aplicados, separados por "|", con tamaño de fuente 10
        doc.setFontSize(10);
        doc.text(`Filtros: ${applied.join(" | ")}`, 14, 28);

        // Prepare table
        const head = [["Código", "Descripción", "Existencias", "Entradas", "Salidas", "Stock"]];
        const body = filtered.map(r => [
            r[0] ?? "",
            r[1] ?? "",
            String(r[2] ?? ""),
            String(r[3] ?? ""),
            String(r[4] ?? ""),
            String(r[5] ?? "")
        ]);

        // Agregar autoTable
        autoTable(doc, {
            startY: 30, // Mueve la tabla más abajo para que no choque con el título
            head: [config.columns],
            body: (filtered.length === 0
                    ? [
                        // Fila vacía con un marcador especial
                        config.columns.map((col, index) =>
                            index === 0 ? "__NO_DATA__" : ""
                        )
                    ]
                    : filtered.map(r =>
                        config.columnIndexes.map(i => {
                            const value = r[i];
                            // Formateo de fechas para Entradas y Salidas
                            if ((type === "entradas" || type === "salidas") && i === 1) {
                                return value ? value.split("-").reverse().join("-") : "Sin fecha";
                            }
                            // Detectar columnas numéricas por su índice
                            const numericIndexesInventario = [2, 3, 4, 5]; // Existencias, Entradas, Salidas, Stock
                            const numericIndexesMovimientos = [4]; // Cantidad en Entradas / Salidas

                            // Determina si la columna actual es numérica según el tipo de reporte
                            let isNumericColumn =
                                type === "inventario"
                                    ? numericIndexesInventario.includes(i)
                                    : (type === "entradas" || type === "salidas")
                                    ? numericIndexesMovimientos.includes(i)
                                    : false;

                            // Casos numéricos mostrar "0"
                            if (isNumericColumn) {
                                return (!value && value !== 0) ? "0" : String(value);
                            }
                            // Casos no numéricos mostrar mensaje
                            return (!value && value !== 0) ? "Sin dato" : String(value);
                        })
                    )
                ),
            styles: { halign: "center" },         // Centra todo
            headStyles: { halign: "center" },     // centra encabezados
            didParseCell: function (data) {       // Asegura centrado en cada celda
                const cellText = data.cell.raw;
                // Si es la fila especial de "No hay datos"
                if (cellText === "__NO_DATA__") {
                    // Mostrar mensaje y centrarlo
                    data.cell.text = ["No hay datos para mostrar"];
                    data.cell.colSpan = data.table.columns.length; // Ocupa todas las columnas
                    data.cell.styles.halign = "center";
                    data.cell.styles.fontStyle = "bold";
                }
                // Para celdas normales, seguir centrado
                else {
                    data.cell.styles.halign = "center";
                }
            }
        });

        // Crea un objeto Date con la fecha y hora actuales
        const fecha = new Date();

        // Día
        const dia = String(fecha.getDate()).padStart(2, "0");

        // Meses en texto
        const meses = [
            "enero", "febrero", "marzo", "abril", "mayo", "junio",
            "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
        ];

        // Mes
        const mes = meses[fecha.getMonth()];

        // Año
        const anio = fecha.getFullYear();

        // Hora
        const horas = String(fecha.getHours()).padStart(2, "0");
        const minutos = String(fecha.getMinutes()).padStart(2, "0");
        const segundos = String(fecha.getSeconds()).padStart(2, "0");

        // Mapea los tipos de reporte a nombres legibles para el PDF
        const namePdf = {
            entradas: "Entradas",
            salidas: "Salidas",
            inventario: "Inventario"
        };

        // Crear nombre de archivo con fecha y hora
        const fileName = `${namePdf[type] || "Inventario"}_${dia}-${mes}-${anio}-${horas}_${minutos}_${segundos}.pdf`;
        doc.save(fileName);
    };

    // Si el modal no está abierto, no renderiza nada
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg w-[90%] md:w-2/4 lg:w-1/3 p-4 max-h-[85vh] overflow-auto">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold">Exportar a PDF</h3>
                </div>
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        {/* Radio Todos */}
                        <input type="radio" id="all" checked={filterAll} onChange={() => setFilterAll(true)} />
                        <label htmlFor="all" className="font-medium">Todos</label>
                        {/* Radio Filtrar */}
                        <input type="radio" id="custom" checked={!filterAll} onChange={() => setFilterAll(false)} className="ml-4" />
                        <label htmlFor="custom" className="font-medium">Filtrar</label>
                    </div>
                    {/* Si no es todos, mostrar filtros */}
                    {!filterAll && (
                        <>
                        {/* Filtro por Codigo o NFactura con checkboxes */}
                        <div>
                            <label className="font-medium">{type === "salidas" || type === "entradas"
                                    ? "N° Factura (selección múltiple):"
                                    : "Código (selección múltiple):"}
                            </label>
                            <div className="mt-2 border rounded p-0 max-h-40 overflow-auto bg-white">
                                {codes.map((c) => {const isSelected = selectedCodes.includes(c);
                                    return (
                                        <label key={c} 
                                            className={`flex items-center gap-2 px-2 py-2 border-b last:border-b-0 cursor-pointer hover:bg-gray-100 ${isSelected ?"bg-sky-50" : ""}`}>
                                            <input
                                                type="checkbox"
                                                value={c}
                                                checked={isSelected}
                                                onChange={(e) => {
                                                    const checked = e.target.checked;
                                                    if (checked) {
                                                        setSelectedCodes((prev) => [...prev, c]);
                                                    } else {
                                                        setSelectedCodes((prev) => prev.filter((x) => x !== c));
                                                    }
                                                }}
                                            />
                                            <span>{c}</span>
                                        </label>
                                    );
                                })}
                            </div>
                            {selectedCodes.length > 0 && (
                                <button
                                    onClick={() => setSelectedCodes([])}
                                    className="mt-2 text-sm text-blue-600 underline"
                                >
                                    Limpiar selección
                                </button>
                            )}
                        </div>
                        {/* Para Salidas */}
                        {type === "salidas" && (
                            <>
                            {/* Filtro por Codigo con checkboxes */}
                            <div>
                                <label className="font-medium">Código (selección múltiple):</label>
                                    <div className="mt-2 border rounded p-0 max-h-40 overflow-auto bg-white">
                                        {codesSalida.map((c) => {const isSelected = selectedCodesSalida.includes(c);
                                            return (<label key={c} 
                                                className={`flex items-center gap-2 px-2 py-2 border-b last:border-b-0 cursor-pointer                   hover:bg-gray-100 ${isSelected ? "bg-sky-50" : ""}`}>
                                                    <input
                                                        type="checkbox"
                                                        value={c}
                                                        checked={isSelected}
                                                        onChange={(e) => {
                                                            const checked = e.target.checked;
                                                            if (checked) {
                                                                setSelectedCodesSalida((prev) => [...prev, c]);
                                                            } else {
                                                                setSelectedCodesSalida((prev) => prev.filter((x) => x !== c));
                                                            }
                                                        }}
                                                    />
                                                    <span>{c}</span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                {selectedCodesSalida.length > 0 && (
                                    <button onClick={() => setSelectedCodesSalida([])} className="mt-2 text-sm text-blue-600 underline">
                                        Limpiar selección
                                    </button>
                                )}
                            </div>
                            {/* FECHAS */}
                            <div className="mt-3">
                                <label className="font-medium">Fecha:</label>
                                <div className="flex flex-row items-center gap-8 mt-2">
                                    {/* Desde */}
                                    <div className="flex flex-row items-center gap-2">
                                        <span className="w-16">Desde:</span>
                                        <input
                                            type="date"
                                            value={dateFilters.fechaDesde}
                                            onChange={(e) => setDateFilters(f => ({ ...f, fechaDesde: e.target.value }))}
                                            className="border p-2 rounded w-40"
                                        />
                                    </div>
                                    {/* Hasta */}
                                    <div className="flex flex-row items-center gap-2">
                                        <span className="w-16">Hasta:</span>
                                        <input
                                            type="date"
                                            value={dateFilters.fechaHasta}
                                            onChange={(e) => setDateFilters(f => ({ ...f, fechaHasta: e.target.value }))}
                                            className="border p-2 rounded w-40"
                                        />
                                    </div>
                                </div>
                            </div>
                            {/* CANTIDAD (numérico con operadores) */}
                            <div className="flex items-center gap-4 mt-3">
                                <label className="w-26 font-medium">Cantidad:</label>
                                <select
                                    value={filters.cantidad.op}
                                    onChange={(e) =>
                                        setFilters(s => ({
                                            ...s,
                                            cantidad: { ...s.cantidad, op: e.target.value }
                                        }))
                                    }
                                    className="border p-2 rounded"
                                >
                                    {OPERATORS.map(o => (
                                        <option key={o.value} value={o.value}>{o.label}</option>
                                    ))}
                                </select>
                                {filters.cantidad.op === "between" ? (
                                    <>
                                        <input
                                            type="number"
                                            value={filters.cantidad.val1}
                                            onChange={(e) =>
                                                setFilters(s => ({
                                                    ...s,
                                                    cantidad: { ...s.cantidad, val1: e.target.value }
                                                }))
                                            }
                                            placeholder="Desde"
                                            className="border p-2 rounded w-24"
                                        />
                                        <input
                                            type="number"
                                            value={filters.cantidad.val2}
                                            onChange={(e) =>
                                                setFilters(s => ({
                                                    ...s,
                                                    cantidad: { ...s.cantidad, val2: e.target.value }
                                                }))
                                            }
                                            placeholder="Hasta"
                                            className="border p-2 rounded w-24"
                                        />
                                    </>
                                ) : (
                                    <input
                                        type="number"
                                        value={filters.cantidad.val1}
                                        onChange={(e) =>
                                            setFilters(s => ({
                                                ...s,
                                                cantidad: { ...s.cantidad, val1: e.target.value }
                                            }))
                                        }
                                        placeholder="Valor"
                                        className="border p-2 rounded w-24"
                                    />
                                )}
                            </div>
                            </>
                        )}
                        {/* Para Entradas */}
                        {type === "entradas" && (
                            <>
                            {/* Filtro por Codigo con checkboxes */}
                            <div>
                                <label className="font-medium">Código (selección múltiple):</label>
                                    <div className="mt-2 border rounded p-0 max-h-40 overflow-auto bg-white">
                                        {codesEntrada.map((c) => {const isSelected = selectedCodesEntrada.includes(c);
                                            return (
                                                <label key={c} className={`flex items-center gap-2 px-2 py-2 border-b last:border-b-0 cursor-pointer hover:bg-gray-100 
                                                    ${isSelected ? "bg-sky-50" : ""}`}>
                                                        <input
                                                            type="checkbox"
                                                            value={c}
                                                            checked={isSelected}
                                                            onChange={(e) => {
                                                                const checked = e.target.checked;
                                                                if (checked) {
                                                                    setSelectedCodesEntrada((prev) => [...prev, c]);
                                                                } else {
                                                                    setSelectedCodesEntrada((prev) => prev.filter((x) => x !== c));
                                                                }
                                                            }}
                                                        />
                                                    <span>{c}</span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                    {selectedCodesEntrada.length > 0 && (
                                        <button
                                            onClick={() => setSelectedCodesEntrada([])}
                                            className="mt-2 text-sm text-blue-600 underline"
                                        >
                                            Limpiar selección
                                        </button>
                                    )}
                                </div>
                                {/* FECHAS */}
                                <div className="mt-3">
                                    <label className="font-medium">Fecha:</label>
                                    <div className="flex flex-row items-center gap-8 mt-2">
                                        {/* Desde */}
                                        <div className="flex flex-row items-center gap-2">
                                            <span className="w-16">Desde:</span>
                                            <input
                                                type="date"
                                                value={dateFilters.fechaDesde}
                                                onChange={(e) => setDateFilters(f => ({ ...f, fechaDesde: e.target.value }))}
                                                className="border p-2 rounded w-40"
                                            />
                                        </div>
                                        {/* Hasta */}
                                        <div className="flex flex-row items-center gap-2">
                                            <span className="w-16">Hasta:</span>
                                            <input
                                                type="date"
                                                value={dateFilters.fechaHasta}
                                                onChange={(e) => setDateFilters(f => ({ ...f, fechaHasta: e.target.value }))}
                                                className="border p-2 rounded w-40"
                                            />
                                        </div>
                                    </div>
                                </div>
                                {/* CANTIDAD (numérico con operadores) */}
                                <div className="flex items-center gap-4 mt-3">
                                    <label className="w-26 font-medium">Cantidad:</label>
                                    <select
                                        value={filters.cantidad.op}
                                        onChange={(e) =>
                                            setFilters(s => ({
                                                ...s,
                                                cantidad: { ...s.cantidad, op: e.target.value }
                                            }))
                                        }
                                        className="border p-2 rounded">
                                        {OPERATORS.map(o => (
                                            <option key={o.value} value={o.value}>{o.label}</option>
                                        ))}
                                    </select>
                                    {filters.cantidad.op === "between" ? (
                                        <>
                                            <input
                                                type="number"
                                                value={filters.cantidad.val1}
                                                onChange={(e) =>
                                                    setFilters(s => ({
                                                        ...s,
                                                        cantidad: { ...s.cantidad, val1: e.target.value }
                                                    }))
                                                }
                                                placeholder="Desde"
                                                className="border p-2 rounded w-24"
                                            />
                                            <input
                                                type="number"
                                                value={filters.cantidad.val2}
                                                onChange={(e) =>
                                                    setFilters(s => ({
                                                        ...s,
                                                        cantidad: { ...s.cantidad, val2: e.target.value }
                                                    }))
                                                }
                                                placeholder="Hasta"
                                                className="border p-2 rounded w-24"
                                            />
                                        </>
                                    ) : (
                                        <input
                                            type="number"
                                            value={filters.cantidad.val1}
                                            onChange={(e) =>
                                                setFilters(s => ({
                                                    ...s,
                                                    cantidad: { ...s.cantidad, val1: e.target.value }
                                                }))
                                            }
                                            placeholder="Valor"
                                            className="border p-2 rounded w-24"
                                        />
                                    )}
                                </div>
                            </>
                        )}
                        {/* Filtro numérico para existencias / entradas / salidas */}
                        {config.allowFilters && (
                            <>
                                {["existencias", "entradas", "salidas"].map((field) => {
                                    return (
                                        <div key={field} className="flex items-center gap-3">
                                            {/* Nombre del label Existencias, Entradas, Salidas */}
                                            <label className="w-28 font-medium">
                                                {field.charAt(0).toUpperCase() + field.slice(1)}:
                                            </label>
                                            {/* Seleccionar el tipo de operacion numerica */}
                                            <select
                                                value={filters[field].op}
                                                onChange={(e) =>
                                                    setFilters(s => ({
                                                        ...s,
                                                        [field]: { ...s[field], op: e.target.value }
                                                    }))
                                                }
                                                className="border p-2 rounded">
                                                {OPERATORS.map((o) => (
                                                    <option key={o.value} value={o.value}>
                                                        {o.label}
                                                    </option>
                                                ))}
                                            </select>
                                            {/* Inputs si es entre 2 valores o 1 valor unico */}
                                            {filters[field].op === "between" ? (
                                                <>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        value={filters[field].val1}
                                                        onChange={(e) =>
                                                            setFilters(s => ({
                                                                ...s,
                                                                [field]: { ...s[field], val1: e.target.value }
                                                            }))
                                                        }
                                                        placeholder="Desde"
                                                        className="border p-2 rounded w-24"
                                                        onKeyDown={(e) => {
                                                            const invalid = ["e", "E", "+", "-", ".", ","];
                                                            if (invalid.includes(e.key)) e.preventDefault();
                                                        }}
                                                        onInput={(e) => {
                                                            e.target.value = e.target.value.replace(/\D+/g, "");
                                                        }}
                                                    />
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        value={filters[field].val2}
                                                        onChange={(e) =>
                                                            setFilters(s => ({
                                                                ...s,
                                                                [field]: { ...s[field], val2: e.target.value }
                                                            }))
                                                        }
                                                        placeholder="Hasta"
                                                        className="border p-2 rounded w-24"
                                                        onKeyDown={(e) => {
                                                            const invalid = ["e", "E", "+", "-", ".", ","];
                                                            if (invalid.includes(e.key)) e.preventDefault();
                                                        }}
                                                        onInput={(e) => {
                                                            e.target.value = e.target.value.replace(/\D+/g, "");
                                                        }}
                                                    />
                                                </>
                                            ) : (
                                                <>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        value={filters[field].val1}
                                                        onChange={(e) =>
                                                            setFilters(s => ({
                                                                ...s,
                                                                [field]: { ...s[field], val1: e.target.value }
                                                            }))
                                                        }
                                                        placeholder="Valor"
                                                        className="border p-2 rounded w-24"
                                                        onKeyDown={(e) => {
                                                            const invalid = ["e", "E", "+", "-", ".", ","];
                                                            if (invalid.includes(e.key)) e.preventDefault();
                                                        }}
                                                        onInput={(e) => {
                                                            e.target.value = e.target.value.replace(/\D+/g, "");
                                                        }}
                                                    />
                                                </>
                                            )}
                                        </div>
                                    );
                                })}
                                {/* Filtro Stock */}
                                <div className="flex items-center gap-3">
                                    <label className="w-28 font-medium">Stock:</label>
                                    <select
                                        value={filters.stock.op}
                                        onChange={(e) => setFilters(s => ({ ...s, stock: { ...s.stock, op: e.target.value } }))}
                                        className="border p-2 rounded">
                                        {STOCK_OPERATORS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                    </select>
                                    {/* Inputs si es entre 2 valores o 1 valor unico */}
                                    {filters.stock.op === "between" ? (
                                        <>
                                            <input
                                                type="number"
                                                min="0"
                                                value={filters.stock.val1}
                                                onChange={(e) =>
                                                    setFilters(s => ({
                                                        ...s,
                                                        stock: { ...s.stock, val1: e.target.value }
                                                    }))
                                                }
                                                placeholder="Desde"
                                                className="border p-2 rounded w-24"
                                                onKeyDown={(e) => {
                                                    const invalid = ["e", "E", "+", "-", ".", ","];
                                                    if (invalid.includes(e.key)) e.preventDefault();
                                                }}
                                                onInput={(e) => {
                                                    e.target.value = e.target.value.replace(/\D+/g, "");
                                                }}
                                            />
                                            <input
                                                type="number"
                                                min="0"
                                                value={filters.stock.val2}
                                                onChange={(e) =>
                                                    setFilters(s => ({
                                                        ...s,
                                                        stock: { ...s.stock, val2: e.target.value }
                                                    }))
                                                }
                                                placeholder="Hasta"
                                                className="border p-2 rounded w-24"
                                                onKeyDown={(e) => {
                                                    const invalid = ["e", "E", "+", "-", ".", ","];
                                                    if (invalid.includes(e.key)) e.preventDefault();
                                                }}
                                                onInput={(e) => {
                                                    e.target.value = e.target.value.replace(/\D+/g, "");
                                                }}
                                            />
                                        </>
                                    ) : (
                                        filters.stock.op !== "stock_min" &&
                                        filters.stock.op !== "stock_above" && (
                                            <input
                                                type="number"
                                                min="0"
                                                value={filters.stock.val1}
                                                onChange={(e) =>
                                                    setFilters(s => ({
                                                        ...s,
                                                        stock: { ...s.stock, val1: e.target.value }
                                                    }))
                                                }
                                                placeholder="Valor"
                                                className="border p-2 rounded w-24"
                                                onKeyDown={(e) => {
                                                    const invalid = ["e", "E", "+", "-", ".", ","];
                                                    if (invalid.includes(e.key)) e.preventDefault();
                                                }}
                                                onInput={(e) => {
                                                    e.target.value = e.target.value.replace(/\D+/g, "");
                                                }}
                                            />
                                        )
                                    )}
                                    {/* Stock minimo o Arriba del Stock */}
                                    {(filters.stock.op === "stock_min" || filters.stock.op === "stock_above") && (
                                        <div className="ml-4 text-sm text-gray-600">Usando límite: {lowStockLimit}</div>
                                    )}
                                </div>
                            </>
                        )}
                        </>
                    )}
                    {/* Botones de Cancelar y Generar PDF */}
                    <div className="flex justify-end gap-3 mt-4">
                        <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded shadow-md hover:bg-gray-600 focus:outline-none">Cancelar</button>
                        <button onClick={handleGenerate} className="bg-[#112291] text-white px-4 py-2 rounded shadow-md hover:bg-[#0A1685] focus:outline-none">Generar PDF</button>
                    </div>
                </div>
            </div>
        </div>
    );
}