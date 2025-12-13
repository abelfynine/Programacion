// Importa el pool de conexión a la base de datos
import { pool } from "../db.js";

// Obtiene todos los usuarios ordenados por ID
export const getUsers = async (req, res) => {
  const response = await pool.query("SELECT * FROM users ORDER BY id ASC");
  res.status(200).json(response.rows);
};

// Obtiene un usuario específico por su ID
export const getUserById = async (req, res) => {
  // Convierte el ID a número
  const id = parseInt(req.params.id);
  const response = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  res.json(response.rows);
};

// Crea un nuevo usuario
export const createUser = async (req, res) => {
  try {
    // Datos enviados en la petición
    const { name, email } = req.body;

    const { rows } = await pool.query(
      "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
      [name, email]
    );

    // Devuelve el usuario creado
    res.status(201).json(rows[0]);
  } catch (error) {
    // Manejo de errores
    return res.status(500).json({ error: error.message });
  }
};

// Actualiza los datos de un usuario por ID
export const updateUser = async (req, res) => {
  const id = parseInt(req.params.id);
  const { name, email } = req.body;

  const { rows } = await pool.query(
    "UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *",
    [name, email, id]
  );

  // Devuelve el usuario actualizado
  return res.json(rows[0]);
};

// Elimina un usuario por ID
export const deleteUser = async (req, res) => {
  const id = parseInt(req.params.id);
  const { rowCount } = await pool.query("DELETE FROM users where id = $1", [
    id,
  ]);

  // Verifica si el usuario existía
  if (rowCount === 0) {
    return res.status(404).json({ message: "User not found" });
  }

  // Eliminación exitosa sin contenido
  return res.sendStatus(204);
};