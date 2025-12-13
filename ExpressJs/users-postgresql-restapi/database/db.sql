-- Elimina la tabla 'users' si ya existe para evitar errores al crearla
DROP TABLE IF EXISTS users;

-- Crea la tabla 'users' con sus campos
CREATE TABLE users (
    id SERIAL PRIMARY KEY, -- Identificador único autoincremental
    name VARCHAR(40), -- Nombre del usuario (máx. 40 caracteres)
    email TEXT NOT NULL UNIQUE, -- Correo obligatorio y único
    created_at TIMESTAMP NOT NULL DEFAULT NOW() -- Fecha de creación automática
);

-- Inserta dos registros en la tabla 'users'
INSERT INTO users (name, email)
    VALUES ('max', 'max@test.com'),
    ('emi', 'emi@test.com');

-- Muestra todos los registros de la tabla 'users'
select * from users;