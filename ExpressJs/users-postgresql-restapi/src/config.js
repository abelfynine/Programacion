// Puerto en el que se ejecutará el servidor (usa el del entorno o 3000 por defecto)
export const PORT = process.env.PORT || 3000;

// Variables de entorno para la conexión a la base de datos
// Usuario de la BD
export const DB_USER = process.env.DB_USER;
// Host de la BD
export const DB_HOST = process.env.DB_HOST;
// Contraseña de la BD
export const DB_PASSWORD = process.env.DB_PASSWORD;
// Nombre de la BD
export const DB_DATABASE = process.env.DB_DATABASE;
// Puerto de la BD
export const DB_PORT = process.env.DB_PORT;