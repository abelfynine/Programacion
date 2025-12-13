// Importa el cliente de PostgreSQL
import pg from "pg";

// Importa las variables de configuración de la base de datos
import {
  DB_DATABASE,
  DB_HOST,
  DB_PASSWORD,
  DB_PORT,
  DB_USER,
} from "./config.js";

// Crea y exporta un pool de conexiones a PostgreSQL
export const pool = new pg.Pool({
  user: DB_USER, // Usuario de la base de datos
  host: DB_HOST, // Host del servidor
  password: DB_PASSWORD, // Contraseña
  database: DB_DATABASE, // Nombre de la base de datos
  port: DB_PORT, // Puerto de conexión
});