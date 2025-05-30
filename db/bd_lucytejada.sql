-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 30-05-2025 a las 22:37:45
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `bd_lucytejada`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cursos`
--

CREATE TABLE `cursos` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `instructor_id` int(11) DEFAULT NULL,
  `tipo` varchar(50) DEFAULT NULL,
  `duracion` varchar(50) DEFAULT NULL,
  `horarios` varchar(200) DEFAULT NULL,
  `zona_imparticion` varchar(255) DEFAULT NULL,
  `fecha_inicio` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `cursos`
--

INSERT INTO `cursos` (`id`, `nombre`, `descripcion`, `instructor_id`, `tipo`, `duracion`, `horarios`, `zona_imparticion`, `fecha_inicio`, `created_at`, `updated_at`) VALUES
(7, 'Curso de Actuación Básica', 'Curso introductorio para aprender las bases de la actuación teatral.', 41, 'Presencial', '3 meses', 'Lunes y Miércoles 6pm - 8pm', 'Zona Norte', '2025-06-01', '2025-05-28 02:24:39', '2025-05-28 20:10:38'),
(8, 'Taller Intensivo de Improvisación', 'Aprende técnicas de improvisación para teatro y presentaciones escénicas.', 59, 'Virtual', '1 mes', 'Martes y Jueves 7pm - 9pm', 'Zona Centro', '2025-06-10', '2025-05-28 02:24:56', '2025-05-28 02:24:56'),
(9, 'Curso de Expresión Corporal y Voz', 'Desarrolla habilidades expresivas con ejercicios de cuerpo y voz.', 41, 'Presencial', '2 meses', 'Sábados 9am - 12pm', 'Zona Sur', '2025-07-05', '2025-05-28 02:25:11', '2025-05-28 02:25:11'),
(10, 'Laboratorio de Creación Escénica', 'Espacio para la exploración y creación de piezas teatrales colectivas.', 59, 'Presencial', '4 meses', 'Viernes 5pm - 8pm', 'Zona Oeste', '2025-06-20', '2025-05-28 02:25:26', '2025-05-28 02:25:26');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estudiantes`
--

CREATE TABLE `estudiantes` (
  `id` int(11) NOT NULL,
  `tipo_documento` enum('CC','TI') NOT NULL,
  `documento` varchar(20) NOT NULL,
  `nombres` varchar(100) NOT NULL,
  `apellidos` varchar(100) NOT NULL,
  `correo_electronico` varchar(100) NOT NULL,
  `ciudad_origen` varchar(100) DEFAULT NULL,
  `ciudad_residencia` varchar(100) DEFAULT NULL,
  `direccion` varchar(200) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `tipo_sangre` varchar(5) DEFAULT NULL,
  `sexo` enum('Masculino','Femenino','Otro') DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `estudiantes`
--

INSERT INTO `estudiantes` (`id`, `tipo_documento`, `documento`, `nombres`, `apellidos`, `correo_electronico`, `ciudad_origen`, `ciudad_residencia`, `direccion`, `telefono`, `tipo_sangre`, `sexo`, `created_at`, `updated_at`) VALUES
(3, 'CC', '1234567890', 'Carlos', 'Ramírez', 'juan.perez@example.com', 'Cali', 'Pereira', 'Calle 45 #12-30', '3214567890', 'O+', 'Masculino', '2025-05-18 10:59:20', '2025-05-30 02:18:44'),
(7, 'TI', '1029384756', 'María Fernanda', 'López Ruiz', 'maria.lopez@example.com', 'Cali', 'Bogotá', 'Carrera 12 #34-56', '3012345678', 'A+', 'Femenino', '2025-05-28 02:30:45', '2025-05-28 02:30:45'),
(8, 'CC', '1098765432', 'Andrés Felipe', 'Martínez Díaz', 'andres.martinez@example.com', 'Pereira', 'Manizales', 'Avenida 6 #78-90', '3123456789', 'B+', 'Masculino', '2025-05-28 02:30:57', '2025-05-28 02:30:57'),
(9, 'CC', '2233445566', 'Carlos Eduardo', 'Ramírez Mejía', 'carlos.ramirez@example.com', 'Medellín', 'Bucaramanga', 'Carrera 45 #67-89', '3209876543', 'O-', 'Masculino', '2025-05-28 02:31:32', '2025-05-28 02:31:32'),
(11, 'CC', '5678901234', 'Luisa María', 'García Torres', 'luisa.garcia@example.com', 'Barranquilla', 'Cartagena', 'Calle 90 #12-34', '3134567890', 'AB-', 'Femenino', '2025-05-28 02:33:17', '2025-05-28 02:33:17'),
(13, 'TI', '3344556677', 'Camila Andrea', 'Ortiz Salazar', 'camila.ortiz@example.com', 'Villavicencio', 'Ibagué', 'Diagonal 23 #56-78', '3112233445', 'A-', 'Femenino', '2025-05-28 02:33:50', '2025-05-28 02:33:50'),
(14, 'CC', '4455667788', 'Julián Esteban', 'Moreno Castaño', 'julian.moreno@example.com', 'Pasto', 'Neiva', 'Transversal 7 #11-22', '3145566778', 'B-', 'Masculino', '2025-05-28 02:34:02', '2025-05-28 02:34:02'),
(15, 'CC', '5566778899', 'Isabella Sofía', 'Castro Vargas', 'isabella.castro@example.com', 'Santa Marta', 'Valledupar', 'Calle 44 #33-12', '3156677889', 'AB+', 'Femenino', '2025-05-28 02:34:19', '2025-05-28 02:34:19'),
(16, 'CC', '6677889900', 'Miguel Ángel', 'Navarro Peña', 'miguel.navarro@example.com', 'Cúcuta', 'Armenia', 'Carrera 8 #65-90', '3167788990', 'O+', 'Masculino', '2025-05-28 02:34:30', '2025-05-28 02:34:30'),
(18, 'TI', '7788990011', 'Valentina Alejandra', 'Suárez Restrepo', 'valentina.suarez@example.com', 'Tunja', 'Popayán', 'Avenida 19 #45-32', '3178899001', 'A+', 'Femenino', '2025-05-28 02:34:54', '2025-05-28 02:34:54');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `inscripciones`
--

CREATE TABLE `inscripciones` (
  `id` int(11) NOT NULL,
  `estudiante_id` int(11) NOT NULL,
  `curso_id` int(11) NOT NULL,
  `fecha_inscripcion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `inscripciones`
--

INSERT INTO `inscripciones` (`id`, `estudiante_id`, `curso_id`, `fecha_inscripcion`) VALUES
(3, 8, 9, '2025-05-28 02:30:57'),
(4, 11, 10, '2025-05-28 02:33:17'),
(5, 13, 8, '2025-05-28 02:33:50'),
(6, 14, 9, '2025-05-28 02:34:02'),
(7, 15, 10, '2025-05-28 02:34:19'),
(8, 18, 9, '2025-05-28 02:34:54'),
(12, 7, 9, '2025-05-29 01:42:00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `cedula` varchar(20) NOT NULL,
  `nombres` varchar(100) NOT NULL,
  `apellidos` varchar(100) NOT NULL,
  `correo_electronico` varchar(100) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `rol` enum('Administrativo','Coordinador','Instructor','') DEFAULT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `direccion` varchar(200) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `sexo` enum('Masculino','Femenino','Otro') DEFAULT NULL,
  `tipo_sangre` varchar(5) DEFAULT NULL,
  `primer_inicio_sesion` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `cedula`, `nombres`, `apellidos`, `correo_electronico`, `contrasena`, `rol`, `fecha_nacimiento`, `direccion`, `telefono`, `sexo`, `tipo_sangre`, `primer_inicio_sesion`, `created_at`, `updated_at`) VALUES
(4, '1234567890', 'Admin', 'Principal', 'admin@teatro.com', '$2a$10$S5aQp/DSxI.J5uR9Jny30u28elcTQRuhlS3.PGiLj3Y1nFdMARewe', 'Administrativo', '1980-01-01', 'Calle Principal 123', '3001234567', 'Masculino', 'O+', 0, '2025-04-02 01:52:50', '2025-04-09 03:39:29'),
(39, '1004756531', 'Sebas', 'Conde', 'luissebastian.conde@utp.edu.co', '$2a$10$txE4oX5G4uafGt53j8dZKe6Ogi34NWl.NDXv2wzmfgs0B1WOKDX0S', 'Coordinador', '2000-04-05', 'Calle 15 #10-20', '3114567890', 'Masculino', 'O+', 0, '2025-04-08 04:00:46', '2025-05-19 03:05:12'),
(41, '1003756531', 'Sebastian', 'Conde', 'luissebastiancondetoro@gmail.com', 'b65effc2-77ec-4663-a03f-8370c91efa48', 'Instructor', NULL, NULL, NULL, NULL, NULL, 1, '2025-04-10 01:10:50', '2025-05-19 03:25:22'),
(59, '1004756532', 'Sebastian', 'Conde', 'luissebastiancondetoro81@gmail.com', '$2a$10$UhJP617FE48AnXn2Vp.zcuxnvv0No/KotI4.2PhCdrYSrpkax2xiu', 'Instructor', '2000-04-05', 'Calle 15 #10-20', '3114567890', 'Masculino', 'O+', 0, '2025-05-19 08:54:28', '2025-05-29 23:07:50'),
(63, '1003212312', 'LUIS SEBASTIAN', 'CONDE TORO', 'sebasconde2003@gmail.com', '73e2da9d-ea42-4933-a220-27d84b268239', 'Coordinador', NULL, NULL, NULL, NULL, NULL, 1, '2025-05-27 05:29:59', '2025-05-27 05:29:59'),
(65, '1004789632', 'Stiven', 'Cardona Salazar', 's.cardona4@utp.edu.co', '4e4eaea7-9bca-44b2-bc64-805afceb7358', 'Coordinador', NULL, NULL, NULL, NULL, NULL, 1, '2025-05-27 05:49:41', '2025-05-27 05:49:41'),
(71, '1003789632', 'Stiven', 'Cardona Salazar', 's.cardona@utp.edu.co', 'cba97a2d-c133-44a6-8b42-21bd0b00f4ef', 'Coordinador', NULL, NULL, NULL, NULL, NULL, 1, '2025-05-27 07:28:06', '2025-05-27 07:28:06');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `zonas`
--

CREATE TABLE `zonas` (
  `id` int(11) NOT NULL,
  `estudiante_id` int(11) NOT NULL,
  `zona` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `zonas`
--

INSERT INTO `zonas` (`id`, `estudiante_id`, `zona`, `created_at`, `updated_at`) VALUES
(3, 3, 'Zona Centro', '2025-05-18 10:59:20', '2025-05-18 10:59:20'),
(4, 7, 'Zona desconocida', '2025-05-28 02:30:45', '2025-05-28 02:30:45'),
(5, 8, 'Zona desconocida', '2025-05-28 02:30:57', '2025-05-28 02:30:57'),
(6, 9, 'Zona desconocida', '2025-05-28 02:31:32', '2025-05-28 02:31:32'),
(7, 11, 'Zona desconocida', '2025-05-28 02:33:17', '2025-05-28 02:33:17'),
(8, 13, 'Zona desconocida', '2025-05-28 02:33:50', '2025-05-28 02:33:50'),
(9, 14, 'Zona desconocida', '2025-05-28 02:34:02', '2025-05-28 02:34:02'),
(10, 15, 'Zona desconocida', '2025-05-28 02:34:19', '2025-05-28 02:34:19'),
(11, 16, 'Zona desconocida', '2025-05-28 02:34:30', '2025-05-28 02:34:30'),
(12, 18, 'Zona desconocida', '2025-05-28 02:34:54', '2025-05-28 02:34:54');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `cursos`
--
ALTER TABLE `cursos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `instructor_id` (`instructor_id`);

--
-- Indices de la tabla `estudiantes`
--
ALTER TABLE `estudiantes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `correo_electronico` (`correo_electronico`);

--
-- Indices de la tabla `inscripciones`
--
ALTER TABLE `inscripciones`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `estudiante_id` (`estudiante_id`,`curso_id`),
  ADD KEY `curso_id` (`curso_id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `cedula` (`cedula`),
  ADD UNIQUE KEY `correo_electronico` (`correo_electronico`);

--
-- Indices de la tabla `zonas`
--
ALTER TABLE `zonas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `estudiante_id` (`estudiante_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `cursos`
--
ALTER TABLE `cursos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `estudiantes`
--
ALTER TABLE `estudiantes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT de la tabla `inscripciones`
--
ALTER TABLE `inscripciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=72;

--
-- AUTO_INCREMENT de la tabla `zonas`
--
ALTER TABLE `zonas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `cursos`
--
ALTER TABLE `cursos`
  ADD CONSTRAINT `cursos_ibfk_1` FOREIGN KEY (`instructor_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL;

--
-- Filtros para la tabla `inscripciones`
--
ALTER TABLE `inscripciones`
  ADD CONSTRAINT `inscripciones_ibfk_1` FOREIGN KEY (`estudiante_id`) REFERENCES `estudiantes` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `inscripciones_ibfk_2` FOREIGN KEY (`curso_id`) REFERENCES `cursos` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `zonas`
--
ALTER TABLE `zonas`
  ADD CONSTRAINT `zonas_ibfk_1` FOREIGN KEY (`estudiante_id`) REFERENCES `estudiantes` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
