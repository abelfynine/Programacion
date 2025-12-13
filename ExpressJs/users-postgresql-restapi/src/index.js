// Importa Express para crear el servidor
import express from 'express'
// Importa el puerto desde la configuración
import { PORT } from './config.js'
// Importa las rutas de usuarios
import usersRoutes from "./routes/users.routes.js";
// Importa Morgan para el logging de peticiones HTTP
import morgan from "morgan";

// Crea la aplicación Express
const app = express()

// Middleware
// Muestra logs de las peticiones en consola
app.use(morgan("dev"));
// Procesa JSON en las peticiones
app.use(express.json());
// Procesa datos enviados desde formularios
app.use(express.urlencoded({ extended: false }));

// Registra las rutas de usuarios en la aplicación
app.use(usersRoutes);

// Inicia el servidor en el puerto configurado
app.listen(PORT)

// Muestra un mensaje cuando el servidor está activo
// eslint-disable-next-line no-console
console.log("Server on port", PORT)