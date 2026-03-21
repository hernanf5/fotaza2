-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 21-03-2026 a las 14:58:56
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `fotaza2`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `coleccion`
--

CREATE TABLE `coleccion` (
  `id` int(10) UNSIGNED NOT NULL,
  `usuario_id` int(10) UNSIGNED NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `coleccion_publicacion`
--

CREATE TABLE `coleccion_publicacion` (
  `coleccion_id` int(10) UNSIGNED NOT NULL,
  `publicacion_id` int(10) UNSIGNED NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `comentario`
--

CREATE TABLE `comentario` (
  `id` int(10) UNSIGNED NOT NULL,
  `publicacion_id` int(10) UNSIGNED NOT NULL,
  `usuario_id` int(10) UNSIGNED NOT NULL,
  `contenido` text NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `denuncia_comentario`
--

CREATE TABLE `denuncia_comentario` (
  `id` int(10) UNSIGNED NOT NULL,
  `comentario_id` int(10) UNSIGNED NOT NULL,
  `usuario_id` int(10) UNSIGNED NOT NULL,
  `motivo_id` int(10) UNSIGNED NOT NULL,
  `descripcion` text NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `denuncia_publicacion`
--

CREATE TABLE `denuncia_publicacion` (
  `id` int(10) UNSIGNED NOT NULL,
  `publicacion_id` int(10) UNSIGNED NOT NULL,
  `usuario_id` int(10) UNSIGNED NOT NULL,
  `motivo_id` int(10) UNSIGNED NOT NULL,
  `descripcion` text NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Disparadores `denuncia_publicacion`
--
DELIMITER $$
CREATE TRIGGER `trg_denuncia_publicacion_insert` AFTER INSERT ON `denuncia_publicacion` FOR EACH ROW BEGIN
  DECLARE total INT;
  SELECT COUNT(*) INTO total
  FROM denuncia_publicacion
  WHERE publicacion_id = NEW.publicacion_id;

  IF total > 3 THEN
    UPDATE publicacion SET estado = 1 WHERE id = NEW.publicacion_id AND estado = 0;
  END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `etiqueta`
--

CREATE TABLE `etiqueta` (
  `id` int(10) UNSIGNED NOT NULL,
  `nombre` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `follower`
--

CREATE TABLE `follower` (
  `seguidor_id` int(10) UNSIGNED NOT NULL,
  `seguido_id` int(10) UNSIGNED NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `imagen`
--

CREATE TABLE `imagen` (
  `id` int(10) UNSIGNED NOT NULL,
  `publicacion_id` int(10) UNSIGNED NOT NULL,
  `url` varchar(500) NOT NULL,
  `licencia` enum('copyright','libre') NOT NULL DEFAULT 'libre',
  `marca_agua_texto` varchar(200) DEFAULT NULL,
  `valoracion_promedio` decimal(3,2) NOT NULL DEFAULT 0.00,
  `total_valoraciones` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mensaje`
--

CREATE TABLE `mensaje` (
  `id` int(10) UNSIGNED NOT NULL,
  `remitente_id` int(10) UNSIGNED NOT NULL,
  `destinatario_id` int(10) UNSIGNED NOT NULL,
  `imagen_id` int(10) UNSIGNED DEFAULT NULL,
  `contenido` text NOT NULL,
  `leido` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `me_interesa`
--

CREATE TABLE `me_interesa` (
  `id` int(10) UNSIGNED NOT NULL,
  `imagen_id` int(10) UNSIGNED NOT NULL,
  `usuario_id` int(10) UNSIGNED NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `motivo_denuncia`
--

CREATE TABLE `motivo_denuncia` (
  `id` int(10) UNSIGNED NOT NULL,
  `descripcion` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `motivo_denuncia`
--

INSERT INTO `motivo_denuncia` (`id`, `descripcion`) VALUES
(1, 'Contenido inapropiado o explícito'),
(2, 'Spam o contenido repetitivo'),
(3, 'Violación de derechos de autor'),
(4, 'Información falsa o engañosa'),
(5, 'Acoso o comportamiento abusivo'),
(6, 'Otro');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `notificacion`
--

CREATE TABLE `notificacion` (
  `id` int(10) UNSIGNED NOT NULL,
  `usuario_id` int(10) UNSIGNED NOT NULL,
  `origen_usuario_id` int(10) UNSIGNED NOT NULL,
  `tipo` enum('comentario','valoracion','me_interesa','nuevo_seguidor') NOT NULL,
  `referencia_id` int(10) UNSIGNED DEFAULT NULL,
  `leida` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `persona`
--

CREATE TABLE `persona` (
  `id` int(10) UNSIGNED NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `avatar_url` varchar(500) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `publicacion`
--

CREATE TABLE `publicacion` (
  `id` int(10) UNSIGNED NOT NULL,
  `usuario_id` int(10) UNSIGNED NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `comentarios_abiertos` tinyint(1) NOT NULL DEFAULT 1,
  `estado` tinyint(3) UNSIGNED NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Disparadores `publicacion`
--
DELIMITER $$
CREATE TRIGGER `trg_publicacion_baja` AFTER UPDATE ON `publicacion` FOR EACH ROW BEGIN
  IF NEW.estado = 2 AND OLD.estado <> 2 THEN
    UPDATE usuario
    SET publicaciones_bajadas = publicaciones_bajadas + 1
    WHERE id = NEW.usuario_id;

    UPDATE usuario
    SET estado = 'inactivo'
    WHERE id = NEW.usuario_id AND publicaciones_bajadas >= 3;
  END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `publicacion_etiqueta`
--

CREATE TABLE `publicacion_etiqueta` (
  `publicacion_id` int(10) UNSIGNED NOT NULL,
  `etiqueta_id` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `id` int(10) UNSIGNED NOT NULL,
  `persona_id` int(10) UNSIGNED NOT NULL,
  `username` varchar(60) NOT NULL,
  `estado` enum('activo','inactivo') NOT NULL DEFAULT 'activo',
  `publicaciones_bajadas` tinyint(3) UNSIGNED NOT NULL DEFAULT 0,
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `validador`
--

CREATE TABLE `validador` (
  `id` int(10) UNSIGNED NOT NULL,
  `persona_id` int(10) UNSIGNED NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `valoracion`
--

CREATE TABLE `valoracion` (
  `id` int(10) UNSIGNED NOT NULL,
  `imagen_id` int(10) UNSIGNED NOT NULL,
  `usuario_id` int(10) UNSIGNED NOT NULL,
  `puntuacion` tinyint(3) UNSIGNED NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ;

--
-- Disparadores `valoracion`
--
DELIMITER $$
CREATE TRIGGER `trg_valoracion_delete` AFTER DELETE ON `valoracion` FOR EACH ROW BEGIN
  UPDATE imagen
  SET
    total_valoraciones = GREATEST(total_valoraciones - 1, 0),
    valoracion_promedio = COALESCE(
      (SELECT AVG(puntuacion) FROM valoracion WHERE imagen_id = OLD.imagen_id),
      0
    )
  WHERE id = OLD.imagen_id;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_valoracion_insert` AFTER INSERT ON `valoracion` FOR EACH ROW BEGIN
  UPDATE imagen
  SET
    total_valoraciones = total_valoraciones + 1,
    valoracion_promedio = (
      SELECT AVG(puntuacion) FROM valoracion WHERE imagen_id = NEW.imagen_id
    )
  WHERE id = NEW.imagen_id;
END
$$
DELIMITER ;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `coleccion`
--
ALTER TABLE `coleccion`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_coleccion_usuario` (`usuario_id`);

--
-- Indices de la tabla `coleccion_publicacion`
--
ALTER TABLE `coleccion_publicacion`
  ADD PRIMARY KEY (`coleccion_id`,`publicacion_id`),
  ADD KEY `fk_colpub_publicacion` (`publicacion_id`);

--
-- Indices de la tabla `comentario`
--
ALTER TABLE `comentario`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_comentario_publicacion` (`publicacion_id`),
  ADD KEY `idx_comentario_usuario` (`usuario_id`);

--
-- Indices de la tabla `denuncia_comentario`
--
ALTER TABLE `denuncia_comentario`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_denuncia_com_usuario` (`comentario_id`,`usuario_id`),
  ADD KEY `idx_dencom_comentario` (`comentario_id`),
  ADD KEY `fk_dencom_usuario` (`usuario_id`),
  ADD KEY `fk_dencom_motivo` (`motivo_id`);

--
-- Indices de la tabla `denuncia_publicacion`
--
ALTER TABLE `denuncia_publicacion`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_denuncia_pub_usuario` (`publicacion_id`,`usuario_id`),
  ADD KEY `idx_denpub_publicacion` (`publicacion_id`),
  ADD KEY `fk_denpub_usuario` (`usuario_id`),
  ADD KEY `fk_denpub_motivo` (`motivo_id`);

--
-- Indices de la tabla `etiqueta`
--
ALTER TABLE `etiqueta`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_etiqueta_nombre` (`nombre`);

--
-- Indices de la tabla `follower`
--
ALTER TABLE `follower`
  ADD PRIMARY KEY (`seguidor_id`,`seguido_id`),
  ADD KEY `idx_follower_seguido` (`seguido_id`);

--
-- Indices de la tabla `imagen`
--
ALTER TABLE `imagen`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_imagen_publicacion` (`publicacion_id`),
  ADD KEY `idx_imagen_valoracion` (`valoracion_promedio`,`total_valoraciones`);

--
-- Indices de la tabla `mensaje`
--
ALTER TABLE `mensaje`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_mensaje_remitente` (`remitente_id`),
  ADD KEY `idx_mensaje_destinatario` (`destinatario_id`),
  ADD KEY `idx_mensaje_imagen` (`imagen_id`);

--
-- Indices de la tabla `me_interesa`
--
ALTER TABLE `me_interesa`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_me_interesa` (`imagen_id`,`usuario_id`),
  ADD KEY `idx_me_interesa_imagen` (`imagen_id`),
  ADD KEY `fk_meint_usuario` (`usuario_id`);

--
-- Indices de la tabla `motivo_denuncia`
--
ALTER TABLE `motivo_denuncia`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `notificacion`
--
ALTER TABLE `notificacion`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_notificacion_usuario` (`usuario_id`),
  ADD KEY `idx_notificacion_leida` (`usuario_id`,`leida`),
  ADD KEY `fk_notif_origen_usuario` (`origen_usuario_id`);

--
-- Indices de la tabla `persona`
--
ALTER TABLE `persona`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_persona_email` (`email`);

--
-- Indices de la tabla `publicacion`
--
ALTER TABLE `publicacion`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_publicacion_usuario` (`usuario_id`),
  ADD KEY `idx_publicacion_estado` (`estado`),
  ADD KEY `idx_publicacion_created` (`created_at`);

--
-- Indices de la tabla `publicacion_etiqueta`
--
ALTER TABLE `publicacion_etiqueta`
  ADD PRIMARY KEY (`publicacion_id`,`etiqueta_id`),
  ADD KEY `fk_pubet_etiqueta` (`etiqueta_id`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_usuario_persona` (`persona_id`),
  ADD UNIQUE KEY `uq_usuario_username` (`username`);

--
-- Indices de la tabla `validador`
--
ALTER TABLE `validador`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_validador_persona` (`persona_id`);

--
-- Indices de la tabla `valoracion`
--
ALTER TABLE `valoracion`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_valoracion_imagen_usuario` (`imagen_id`,`usuario_id`),
  ADD KEY `idx_valoracion_imagen` (`imagen_id`),
  ADD KEY `fk_valoracion_usuario` (`usuario_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `coleccion`
--
ALTER TABLE `coleccion`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `comentario`
--
ALTER TABLE `comentario`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `denuncia_comentario`
--
ALTER TABLE `denuncia_comentario`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `denuncia_publicacion`
--
ALTER TABLE `denuncia_publicacion`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `etiqueta`
--
ALTER TABLE `etiqueta`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `imagen`
--
ALTER TABLE `imagen`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `mensaje`
--
ALTER TABLE `mensaje`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `me_interesa`
--
ALTER TABLE `me_interesa`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `motivo_denuncia`
--
ALTER TABLE `motivo_denuncia`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `notificacion`
--
ALTER TABLE `notificacion`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `persona`
--
ALTER TABLE `persona`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `publicacion`
--
ALTER TABLE `publicacion`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `validador`
--
ALTER TABLE `validador`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `valoracion`
--
ALTER TABLE `valoracion`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `coleccion`
--
ALTER TABLE `coleccion`
  ADD CONSTRAINT `fk_coleccion_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `coleccion_publicacion`
--
ALTER TABLE `coleccion_publicacion`
  ADD CONSTRAINT `fk_colpub_coleccion` FOREIGN KEY (`coleccion_id`) REFERENCES `coleccion` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_colpub_publicacion` FOREIGN KEY (`publicacion_id`) REFERENCES `publicacion` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `comentario`
--
ALTER TABLE `comentario`
  ADD CONSTRAINT `fk_comentario_publicacion` FOREIGN KEY (`publicacion_id`) REFERENCES `publicacion` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_comentario_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `denuncia_comentario`
--
ALTER TABLE `denuncia_comentario`
  ADD CONSTRAINT `fk_dencom_comentario` FOREIGN KEY (`comentario_id`) REFERENCES `comentario` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_dencom_motivo` FOREIGN KEY (`motivo_id`) REFERENCES `motivo_denuncia` (`id`),
  ADD CONSTRAINT `fk_dencom_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `denuncia_publicacion`
--
ALTER TABLE `denuncia_publicacion`
  ADD CONSTRAINT `fk_denpub_motivo` FOREIGN KEY (`motivo_id`) REFERENCES `motivo_denuncia` (`id`),
  ADD CONSTRAINT `fk_denpub_publicacion` FOREIGN KEY (`publicacion_id`) REFERENCES `publicacion` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_denpub_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `follower`
--
ALTER TABLE `follower`
  ADD CONSTRAINT `fk_follower_seguido` FOREIGN KEY (`seguido_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_follower_seguidor` FOREIGN KEY (`seguidor_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `imagen`
--
ALTER TABLE `imagen`
  ADD CONSTRAINT `fk_imagen_publicacion` FOREIGN KEY (`publicacion_id`) REFERENCES `publicacion` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `mensaje`
--
ALTER TABLE `mensaje`
  ADD CONSTRAINT `fk_mensaje_destinatario` FOREIGN KEY (`destinatario_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_mensaje_imagen` FOREIGN KEY (`imagen_id`) REFERENCES `imagen` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_mensaje_remitente` FOREIGN KEY (`remitente_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `me_interesa`
--
ALTER TABLE `me_interesa`
  ADD CONSTRAINT `fk_meint_imagen` FOREIGN KEY (`imagen_id`) REFERENCES `imagen` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_meint_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `notificacion`
--
ALTER TABLE `notificacion`
  ADD CONSTRAINT `fk_notif_origen_usuario` FOREIGN KEY (`origen_usuario_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_notif_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `publicacion`
--
ALTER TABLE `publicacion`
  ADD CONSTRAINT `fk_publicacion_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `publicacion_etiqueta`
--
ALTER TABLE `publicacion_etiqueta`
  ADD CONSTRAINT `fk_pubet_etiqueta` FOREIGN KEY (`etiqueta_id`) REFERENCES `etiqueta` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_pubet_publicacion` FOREIGN KEY (`publicacion_id`) REFERENCES `publicacion` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD CONSTRAINT `fk_usuario_persona` FOREIGN KEY (`persona_id`) REFERENCES `persona` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `validador`
--
ALTER TABLE `validador`
  ADD CONSTRAINT `fk_validador_persona` FOREIGN KEY (`persona_id`) REFERENCES `persona` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `valoracion`
--
ALTER TABLE `valoracion`
  ADD CONSTRAINT `fk_valoracion_imagen` FOREIGN KEY (`imagen_id`) REFERENCES `imagen` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_valoracion_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
