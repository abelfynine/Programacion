// Importa el Router de Express para definir rutas
import { Router } from "express";

// Importa los controladores para manejar la lógica de usuarios
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/index.controller.js";

// Crea una instancia del router
const router = Router();

// Define las rutas y asocia cada una con su controlador
// Obtener todos los usuarios
router.get("/users", getUsers);
// Obtener un usuario por ID
router.get("/users/:id", getUserById);
// Crear un nuevo usuario
router.post("/users", createUser);
// Actualizar un usuario por ID
router.put("/users/:id", updateUser);
// Eliminar un usuario por ID
router.delete("/users/:id", deleteUser);

// Exporta el router para usarlo en la aplicación principal
export default router;