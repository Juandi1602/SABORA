-- ============================================
-- BASE DE DATOS: SABORA
-- Sistema de recomendación de restaurantes
-- ============================================

CREATE DATABASE sabora;
USE sabora;

-- ============================================
-- TABLA: usuarios
-- ============================================
CREATE TABLE usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    activo TINYINT(1) DEFAULT 1
);

SELECT * FROM usuarios;

-- ============================================
-- TABLA: restaurantes
-- ============================================
CREATE TABLE restaurantes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(500),
    tipo_cocina ENUM(
        'peruana', 'italiana', 'japonesa', 'china',
        'mexicana', 'americana', 'mediterranea',
        'india', 'francesa', 'arabe', 'vegetariana', 'fusion'
    ) NOT NULL,
    telefono VARCHAR(15),
    direccion VARCHAR(255),
    rango_precio ENUM('economico', 'moderado', 'premium') NOT NULL,
    activo TINYINT(1) DEFAULT 1
);

-- ============================================
-- TABLA: restaurante_caracteristicas
-- ============================================
CREATE TABLE restaurante_caracteristicas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_restaurante INT NOT NULL,
    -- Tipos de dieta que soporta
    apto_vegetariano TINYINT(1) DEFAULT 0,
    apto_vegano TINYINT(1) DEFAULT 0,
    apto_pescetariano TINYINT(1) DEFAULT 0,
    apto_flexitariano TINYINT(1) DEFAULT 0,
    apto_fitness TINYINT(1) DEFAULT 0,
    apto_keto TINYINT(1) DEFAULT 0,
    apto_paleo TINYINT(1) DEFAULT 0,
    -- Intolerancias y alergias
    sin_lactosa TINYINT(1) DEFAULT 0,
    sin_gluten TINYINT(1) DEFAULT 0,
    sin_mariscos TINYINT(1) DEFAULT 0,
    sin_frutos_secos TINYINT(1) DEFAULT 0,
    sin_huevo TINYINT(1) DEFAULT 0,
    sin_soya TINYINT(1) DEFAULT 0,
    sin_cerdo TINYINT(1) DEFAULT 0,
    sin_maiz TINYINT(1) DEFAULT 0,
    -- Preferencias adicionales
    halal TINYINT(1) DEFAULT 0,
    kosher TINYINT(1) DEFAULT 0,
    sin_picante TINYINT(1) DEFAULT 0,
    bajo_sodio TINYINT(1) DEFAULT 0,
    bajo_azucar TINYINT(1) DEFAULT 0,
    organico TINYINT(1) DEFAULT 0,
    FOREIGN KEY (id_restaurante) REFERENCES restaurantes(id)
);

-- ============================================
-- TABLA: perfiles_alimenticios
-- ============================================
CREATE TABLE perfiles_alimenticios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT NOT NULL UNIQUE,
    -- Sección 1: Tipo de dieta
    tipo_dieta ENUM(
        'ninguna', 'vegetariano', 'vegano', 'pescetariano',
        'flexitariano', 'fitness', 'keto', 'paleo'
    ) DEFAULT 'ninguna',
    -- Sección 2: Intolerancias y alergias
    sin_lactosa TINYINT(1) DEFAULT 0,
    sin_gluten TINYINT(1) DEFAULT 0,
    sin_mariscos TINYINT(1) DEFAULT 0,
    sin_frutos_secos TINYINT(1) DEFAULT 0,
    sin_huevo TINYINT(1) DEFAULT 0,
    sin_soya TINYINT(1) DEFAULT 0,
    sin_cerdo TINYINT(1) DEFAULT 0,
    sin_maiz TINYINT(1) DEFAULT 0,
    -- Sección 3: Preferencias adicionales
    halal TINYINT(1) DEFAULT 0,
    kosher TINYINT(1) DEFAULT 0,
    sin_picante TINYINT(1) DEFAULT 0,
    bajo_sodio TINYINT(1) DEFAULT 0,
    bajo_azucar TINYINT(1) DEFAULT 0,
    organico TINYINT(1) DEFAULT 0,
    -- Sección 4: Rango de precio
    rango_precio ENUM('economico', 'moderado', 'premium') DEFAULT 'moderado',
    -- Sección 5: Tipo de cocina preferida
    cocina_peruana TINYINT(1) DEFAULT 0,
    cocina_italiana TINYINT(1) DEFAULT 0,
    cocina_japonesa TINYINT(1) DEFAULT 0,
    cocina_china TINYINT(1) DEFAULT 0,
    cocina_mexicana TINYINT(1) DEFAULT 0,
    cocina_americana TINYINT(1) DEFAULT 0,
    cocina_mediterranea TINYINT(1) DEFAULT 0,
    cocina_india TINYINT(1) DEFAULT 0,
    cocina_francesa TINYINT(1) DEFAULT 0,
    cocina_arabe TINYINT(1) DEFAULT 0,
    cocina_vegetariana TINYINT(1) DEFAULT 0,
    cocina_fusion TINYINT(1) DEFAULT 0,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
);

-- ============================================
-- DATOS DE PRUEBA: usuarios
-- ============================================
INSERT INTO usuarios (nombre, apellido, email, contrasena) VALUES
('Juan', 'Pérez', 'juan@email.com', 'hash_contrasena_1'),
('María', 'García', 'maria@email.com', 'hash_contrasena_2'),
('Carlos', 'López', 'carlos@email.com', 'hash_contrasena_3');

-- ============================================
-- DATOS DE PRUEBA: restaurantes
-- ============================================
INSERT INTO restaurantes (nombre, descripcion, tipo_cocina, telefono, direccion, rango_precio) VALUES
('La Huaca Verde', 'Restaurante vegano con opciones de cocina peruana fusión', 'peruana', '999111222', 'Av. Larco 123, Miraflores', 'moderado'),
('Sushi Zen', 'Auténtica cocina japonesa con opciones sin gluten', 'japonesa', '999333444', 'Calle Schell 456, Miraflores', 'premium'),
('Green Bowl', 'Comida fitness y saludable para deportistas', 'americana', '999555666', 'Av. Benavides 789, Surco', 'economico'),
('Casa Italia', 'Pasta y pizzas italianas con opciones vegetarianas', 'italiana', '999777888', 'Av. Pardo 321, Miraflores', 'moderado'),
('El Rincón Peruano', 'Comida tradicional peruana', 'peruana', '999999000', 'Jr. de la Unión 654, Centro', 'economico'),
('Halal Grill', 'Cocina árabe y mediterránea certificada halal', 'arabe', '999112233', 'Av. Javier Prado 987, San Isidro', 'moderado');

-- ============================================
-- DATOS DE PRUEBA: restaurante_caracteristicas
-- ============================================
INSERT INTO restaurante_caracteristicas (
    id_restaurante,
    apto_vegetariano, apto_vegano, apto_fitness,
    sin_lactosa, sin_gluten, sin_mariscos,
    halal, organico
) VALUES
(1, 1, 1, 0, 1, 0, 1, 0, 1),  -- La Huaca Verde
(2, 0, 0, 1, 1, 1, 0, 0, 0),  -- Sushi Zen
(3, 1, 0, 1, 1, 1, 1, 0, 1),  -- Green Bowl
(4, 1, 0, 0, 0, 0, 1, 0, 0),  -- Casa Italia
(5, 0, 0, 0, 0, 0, 0, 0, 0),  -- El Rincón Peruano
(6, 0, 0, 0, 1, 1, 0, 1, 0);  -- Halal Grill

-- ============================================
-- DATOS DE PRUEBA: perfiles_alimenticios
-- ============================================
INSERT INTO perfiles_alimenticios (
    id_usuario, tipo_dieta,
    sin_lactosa, sin_gluten,
    rango_precio,
    cocina_peruana, cocina_japonesa
) VALUES
(1, 'vegano', 1, 0, 'moderado', 1, 0),
(2, 'fitness', 0, 1, 'economico', 0, 1),
(3, 'ninguna', 0, 0, 'premium', 1, 1);

-- ============================================
-- VISTA: recomendaciones
-- Motor de recomendación base
-- ============================================
CREATE VIEW vista_recomendaciones AS
SELECT
    u.id AS id_usuario,
    u.nombre AS usuario,
    r.id AS id_restaurante,
    r.nombre AS restaurante,
    r.tipo_cocina,
    r.rango_precio,
    r.direccion,
    -- Puntaje de coincidencia
    (
        (CASE WHEN pa.tipo_dieta = 'vegetariano' AND rc.apto_vegetariano = 1 THEN 2 ELSE 0 END) +
        (CASE WHEN pa.tipo_dieta = 'vegano' AND rc.apto_vegano = 1 THEN 2 ELSE 0 END) +
        (CASE WHEN pa.tipo_dieta = 'fitness' AND rc.apto_fitness = 1 THEN 2 ELSE 0 END) +
        (CASE WHEN pa.tipo_dieta = 'keto' AND rc.apto_keto = 1 THEN 2 ELSE 0 END) +
        (CASE WHEN pa.tipo_dieta = 'paleo' AND rc.apto_paleo = 1 THEN 2 ELSE 0 END) +
        (CASE WHEN pa.sin_lactosa = 1 AND rc.sin_lactosa = 1 THEN 1 ELSE 0 END) +
        (CASE WHEN pa.sin_gluten = 1 AND rc.sin_gluten = 1 THEN 1 ELSE 0 END) +
        (CASE WHEN pa.sin_mariscos = 1 AND rc.sin_mariscos = 1 THEN 1 ELSE 0 END) +
        (CASE WHEN pa.sin_huevo = 1 AND rc.sin_huevo = 1 THEN 1 ELSE 0 END) +
        (CASE WHEN pa.sin_cerdo = 1 AND rc.sin_cerdo = 1 THEN 1 ELSE 0 END) +
        (CASE WHEN pa.halal = 1 AND rc.halal = 1 THEN 1 ELSE 0 END) +
        (CASE WHEN pa.kosher = 1 AND rc.kosher = 1 THEN 1 ELSE 0 END) +
        (CASE WHEN pa.organico = 1 AND rc.organico = 1 THEN 1 ELSE 0 END) +
        (CASE WHEN pa.rango_precio = r.rango_precio THEN 1 ELSE 0 END)
    ) AS puntaje_coincidencia
FROM usuarios u
JOIN perfiles_alimenticios pa ON u.id = pa.id_usuario
CROSS JOIN restaurantes r
JOIN restaurante_caracteristicas rc ON r.id = rc.id_restaurante
WHERE r.activo = 1 AND u.activo = 1
ORDER BY u.id, puntaje_coincidencia DESC;