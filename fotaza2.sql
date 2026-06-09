-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 09-06-2026 a las 16:56:28
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

--
-- Volcado de datos para la tabla `coleccion`
--

INSERT INTO `coleccion` (`id`, `usuario_id`, `nombre`, `created_at`) VALUES
(1, 2, 'pruebadecoleccion1', '2026-05-15 12:20:48'),
(2, 5, 'coleccion 1', '2026-05-25 21:58:33'),
(3, 1, 'mi gordito', '2026-06-05 19:44:57'),
(4, 2, 'nuestra coleccion', '2026-06-07 22:06:13');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `coleccion_publicacion`
--

CREATE TABLE `coleccion_publicacion` (
  `coleccion_id` int(10) UNSIGNED NOT NULL,
  `publicacion_id` int(10) UNSIGNED NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `coleccion_publicacion`
--

INSERT INTO `coleccion_publicacion` (`coleccion_id`, `publicacion_id`, `created_at`) VALUES
(1, 1, '2026-05-15 12:20:48'),
(1, 3, '2026-06-01 15:23:40'),
(2, 1, '2026-05-25 21:58:33'),
(3, 4, '2026-06-05 19:44:57'),
(4, 5, '2026-06-07 22:06:13');

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

--
-- Volcado de datos para la tabla `comentario`
--

INSERT INTO `comentario` (`id`, `publicacion_id`, `usuario_id`, `contenido`, `activo`, `created_at`) VALUES
(1, 1, 1, 'que linda foto', 1, '2026-04-27 17:12:31'),
(2, 1, 2, 'muy linda', 1, '2026-05-04 12:32:24'),
(3, 2, 2, 'me gusta la foto, pero no la marca de agua. jaja salu2', 1, '2026-05-25 22:02:15'),
(4, 2, 1, 'que bonito', 1, '2026-05-25 23:07:28'),
(5, 3, 1, 'buenas fotos', 1, '2026-05-25 23:09:54'),
(6, 4, 1, 'muy lindo', 1, '2026-06-05 19:44:37'),
(7, 9, 9, 'Hermosa foto, los colores son increíbles!', 1, '2026-06-09 11:27:57'),
(8, 9, 10, 'Me encanta la composición', 1, '2026-06-09 11:27:57'),
(9, 10, 8, 'La ciudad se ve espectacular de noche', 1, '2026-06-09 11:27:57'),
(10, 10, 10, 'Qué buena toma!', 1, '2026-06-09 11:27:57'),
(11, 11, 8, 'La patagonia es impresionante', 1, '2026-06-09 11:27:57'),
(12, 11, 9, 'Ojalá poder visitarla algún día', 1, '2026-06-09 11:27:57'),
(13, 12, 10, 'Excelente trabajo con la cámara', 1, '2026-06-09 11:27:57'),
(14, 13, 9, 'El detalle es increíble', 1, '2026-06-09 11:27:57'),
(15, 14, 8, 'Los paisajes del desierto son únicos', 1, '2026-06-09 11:27:57');

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

--
-- Volcado de datos para la tabla `denuncia_comentario`
--

INSERT INTO `denuncia_comentario` (`id`, `comentario_id`, `usuario_id`, `motivo_id`, `descripcion`, `created_at`) VALUES
(1, 6, 3, 6, 'estoy celoso', '2026-06-07 21:57:47'),
(2, 6, 5, 6, 'revisa si te llega la denuncia bien', '2026-06-08 13:39:19');

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
-- Volcado de datos para la tabla `denuncia_publicacion`
--

INSERT INTO `denuncia_publicacion` (`id`, `publicacion_id`, `usuario_id`, `motivo_id`, `descripcion`, `created_at`) VALUES
(1, 1, 2, 2, 'prueba para validador', '2026-05-25 22:02:46'),
(2, 1, 5, 1, 'prueba para validador', '2026-05-25 22:03:12'),
(3, 1, 6, 4, 'prueba para validador', '2026-05-25 22:03:46'),
(4, 1, 3, 5, 'prueba para el validador', '2026-05-25 22:04:13'),
(5, 2, 2, 6, 'se denuncia a modo de prueba1', '2026-06-07 21:52:41'),
(6, 2, 1, 6, 'se denuncia a modo de prueba2', '2026-06-07 21:52:59'),
(7, 2, 3, 3, 'se denuncia a modo de prueba3', '2026-06-07 21:53:18'),
(8, 2, 6, 6, 'se denuncia a modo de prueba3', '2026-06-07 21:54:29'),
(9, 6, 2, 1, 'baneado1', '2026-06-08 12:43:11'),
(10, 7, 2, 6, 'baneado1', '2026-06-08 12:43:24'),
(11, 8, 2, 6, 'baneado1', '2026-06-08 12:43:31'),
(12, 6, 1, 5, 'baneado1', '2026-06-08 12:43:45'),
(13, 7, 1, 3, 'baneado1', '2026-06-08 12:43:50'),
(14, 8, 1, 5, 'baneado1', '2026-06-08 12:43:55'),
(15, 6, 5, 3, 'baneado1', '2026-06-08 12:44:10'),
(16, 7, 5, 3, 'baneado1', '2026-06-08 12:44:15'),
(17, 8, 5, 5, 'baneado1', '2026-06-08 12:44:19'),
(18, 6, 6, 3, 'baneado1', '2026-06-08 12:44:33'),
(19, 7, 6, 4, 'baneado1', '2026-06-08 12:44:39'),
(20, 8, 6, 5, 'baneado1', '2026-06-08 12:44:45');

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

--
-- Volcado de datos para la tabla `etiqueta`
--

INSERT INTO `etiqueta` (`id`, `nombre`) VALUES
(9, 'abstracto'),
(5, 'animales'),
(16, 'ciudad'),
(11, 'comida'),
(19, 'desierto'),
(4, 'gatos'),
(10, 'guitar'),
(1, 'guitarra'),
(7, 'lienzo'),
(18, 'macro'),
(6, 'mascotas'),
(20, 'montana'),
(2, 'musica'),
(15, 'naturaleza'),
(21, 'noche'),
(22, 'patagonia'),
(17, 'retrato'),
(8, 'texturas'),
(3, 'xd');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `follower`
--

CREATE TABLE `follower` (
  `seguidor_id` int(10) UNSIGNED NOT NULL,
  `seguido_id` int(10) UNSIGNED NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `follower`
--

INSERT INTO `follower` (`seguidor_id`, `seguido_id`, `created_at`) VALUES
(1, 2, '2026-05-28 13:51:59'),
(1, 5, '2026-06-09 11:34:03'),
(1, 6, '2026-06-09 11:34:03'),
(1, 8, '2026-06-09 11:54:26'),
(1, 9, '2026-06-09 11:54:26'),
(2, 1, '2026-05-04 14:03:39'),
(2, 3, '2026-05-05 13:07:20'),
(3, 2, '2026-05-04 14:49:18'),
(5, 1, '2026-06-09 11:34:03'),
(6, 1, '2026-06-09 11:34:03'),
(8, 1, '2026-06-09 11:54:26'),
(8, 9, '2026-06-09 11:54:26'),
(8, 10, '2026-06-09 11:54:26'),
(9, 1, '2026-06-09 11:54:26'),
(9, 8, '2026-06-09 11:54:26'),
(9, 10, '2026-06-09 11:54:26'),
(10, 8, '2026-06-09 11:54:26'),
(10, 9, '2026-06-09 11:54:26');

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

--
-- Volcado de datos para la tabla `imagen`
--

INSERT INTO `imagen` (`id`, `publicacion_id`, `url`, `licencia`, `marca_agua_texto`, `valoracion_promedio`, `total_valoraciones`, `created_at`) VALUES
(1, 1, '/uploads/1776858183425-734099694.png', 'copyright', 'xd 2026', 5.00, 1, '2026-04-22 08:43:03'),
(2, 2, '/uploads/1779757066399-956298810.jpg', 'copyright', 'el gato', 4.50, 2, '2026-05-25 21:57:46'),
(3, 3, '/uploads/1779757246993-224355345.jpg', 'libre', NULL, 4.00, 1, '2026-05-25 22:00:48'),
(4, 3, '/uploads/1779757247219-596269886.jpg', 'libre', NULL, 4.00, 2, '2026-05-25 22:00:48'),
(5, 3, '/uploads/1779757247591-714515101.jpg', 'libre', NULL, 5.00, 1, '2026-05-25 22:00:48'),
(6, 3, '/uploads/1779757247897-505208455.jpg', 'libre', NULL, 4.00, 2, '2026-05-25 22:00:48'),
(7, 4, '/uploads/1780414378969-658490578.jpg', 'copyright', 'Hernan Funes', 5.00, 1, '2026-06-02 12:32:59'),
(8, 5, '/uploads/1780699956921-301440643.jpg', 'copyright', 'migorditoyyo', 0.00, 0, '2026-06-05 19:52:37'),
(9, 6, '/uploads/1780933196039-448393720.jpg', 'libre', NULL, 0.00, 0, '2026-06-08 12:39:56'),
(10, 7, '/uploads/1780933226595-209701424.jpg', 'libre', NULL, 0.00, 0, '2026-06-08 12:40:26'),
(11, 8, '/uploads/1780933248371-537498332.jpg', 'libre', NULL, 0.00, 0, '2026-06-08 12:40:48'),
(12, 9, 'https://images.pexels.com/photos/13559896/pexels-photo-13559896.jpeg', 'libre', NULL, 4.50, 2, '2026-06-09 11:27:57'),
(13, 10, 'https://images.pexels.com/photos/1519088/pexels-photo-1519088.jpeg', 'libre', NULL, 4.50, 2, '2026-06-09 11:27:57'),
(14, 11, 'https://images.pexels.com/photos/5196982/pexels-photo-5196982.jpeg', 'libre', NULL, 3.50, 2, '2026-06-09 11:27:57'),
(15, 12, 'https://images.pexels.com/photos/31192623/pexels-photo-31192623.jpeg', 'libre', NULL, 4.50, 2, '2026-06-09 11:27:57'),
(16, 13, 'https://images.pexels.com/photos/906052/pexels-photo-906052.jpeg', 'libre', NULL, 5.00, 1, '2026-06-09 11:27:57'),
(17, 14, 'https://images.pexels.com/photos/6261700/pexels-photo-6261700.jpeg', 'libre', NULL, 3.50, 2, '2026-06-09 11:27:57');

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

--
-- Volcado de datos para la tabla `mensaje`
--

INSERT INTO `mensaje` (`id`, `remitente_id`, `destinatario_id`, `imagen_id`, `contenido`, `leido`, `created_at`) VALUES
(1, 2, 1, NULL, 'Hola mi amor', 1, '2026-05-15 12:47:47'),
(2, 2, 1, NULL, 'estoy probando que te llegue la notificacion', 1, '2026-05-19 14:03:53'),
(3, 3, 1, NULL, 'quisiera comprar esta foto', 1, '2026-05-19 14:04:48'),
(4, 2, 1, NULL, 'al parecer no llega', 1, '2026-05-19 14:07:17'),
(5, 2, 1, NULL, 'pero ya lo voy a arreglar', 1, '2026-05-19 14:11:12'),
(6, 2, 1, NULL, '123', 1, '2026-05-19 14:13:55'),
(7, 1, 5, NULL, 'hola', 0, '2026-05-25 23:07:48'),
(8, 1, 2, NULL, 'vamos a probar el chat en vivo', 1, '2026-05-28 13:44:47'),
(9, 1, 2, NULL, 'que te parece?', 1, '2026-05-28 13:45:05'),
(10, 2, 6, 3, 'Hola, me interesa adquirir tu imagen \"texturas\". ¿Podemos hablar?', 0, '2026-06-02 12:29:06'),
(11, 2, 6, 5, 'Hola, me interesa adquirir la imagen 3 de 4. ¿Podemos hablar?', 0, '2026-06-05 11:09:13'),
(12, 1, 2, NULL, 'probando el chat en vivo', 1, '2026-06-05 11:22:45'),
(13, 1, 2, NULL, 'de momento nada', 1, '2026-06-05 11:22:57'),
(14, 2, 1, NULL, 'parece que todavia no esta funcionando correctamente', 1, '2026-06-05 11:23:26'),
(15, 2, 1, NULL, 'vamos de nuevo', 1, '2026-06-05 11:30:56'),
(16, 1, 2, NULL, 'ahora creo que si', 1, '2026-06-05 11:31:10'),
(17, 1, 2, NULL, 'el problema es ahora un tema de diseño. cada vez que entra un mensaje se agranda el height, hay que cambiarlo, fijarle un espacio al chat seguramente', 1, '2026-06-05 11:32:16'),
(18, 2, 1, NULL, 'a ver ahora', 1, '2026-06-05 11:34:47'),
(19, 2, 1, NULL, 'perfecto', 1, '2026-06-05 11:34:50'),
(20, 2, 1, NULL, 'vamos a modificar el estilo del scroll que no coincide con el diseño de la pagina', 1, '2026-06-05 11:35:23'),
(21, 1, 2, NULL, 'listo quedo todo hermoso', 1, '2026-06-05 11:38:24'),
(22, 2, 1, NULL, 'vamos a probar que el visto haga que desaparezca la notificacion tambien', 1, '2026-06-05 11:47:00'),
(23, 2, 1, NULL, 'mm', 1, '2026-06-05 11:47:20'),
(24, 1, 2, NULL, 'a ver ahora', 1, '2026-06-05 11:49:49'),
(25, 1, 2, NULL, 'ahora si jejejejej', 1, '2026-06-05 11:49:54'),
(26, 2, 1, NULL, 'y cuando abre las marca como leidas, perfecto', 1, '2026-06-05 11:50:12'),
(27, 1, 2, 7, 'Hola, me interesa adquirir la publicacion \"ia generated\". ¿Podemos hablar?', 1, '2026-06-05 19:42:48'),
(28, 1, 2, NULL, 'muy lindo en tu foto, no te queres casar conmigo?', 1, '2026-06-05 19:44:00'),
(29, 2, 1, NULL, 'acepto', 1, '2026-06-06 09:55:22'),
(30, 2, 1, NULL, 'gordita vamos a tomar mates', 0, '2026-06-07 18:20:04'),
(31, 2, 1, 8, 'Hola, me interesa adquirir la publicacion \"Cita con mi amor\". ¿Podemos hablar?', 0, '2026-06-07 22:00:56');

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

--
-- Volcado de datos para la tabla `me_interesa`
--

INSERT INTO `me_interesa` (`id`, `imagen_id`, `usuario_id`, `created_at`) VALUES
(1, 1, 2, '2026-05-15 12:47:41'),
(2, 1, 3, '2026-05-19 14:04:41'),
(3, 2, 1, '2026-05-25 23:07:33'),
(4, 4, 1, '2026-05-25 23:10:01'),
(5, 4, 2, '2026-06-01 15:23:36'),
(6, 3, 2, '2026-06-02 12:29:06'),
(7, 5, 2, '2026-06-05 11:09:13'),
(8, 7, 1, '2026-06-05 19:42:48'),
(9, 8, 2, '2026-06-07 22:00:56');

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
  `tipo` enum('comentario','valoracion','me_interesa','nuevo_seguidor','mensaje') NOT NULL,
  `referencia_id` int(10) UNSIGNED DEFAULT NULL,
  `leida` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `notificacion`
--

INSERT INTO `notificacion` (`id`, `usuario_id`, `origen_usuario_id`, `tipo`, `referencia_id`, `leida`, `created_at`) VALUES
(1, 3, 2, 'nuevo_seguidor', NULL, 0, '2026-05-05 13:07:20'),
(2, 1, 2, 'me_interesa', 1, 1, '2026-05-15 12:47:41'),
(3, 1, 2, 'mensaje', 1, 1, '2026-05-19 14:03:53'),
(4, 1, 3, 'me_interesa', 1, 1, '2026-05-19 14:04:41'),
(5, 1, 3, 'mensaje', 1, 1, '2026-05-19 14:04:48'),
(6, 1, 2, 'mensaje', 1, 1, '2026-05-19 14:07:17'),
(7, 1, 2, 'mensaje', 1, 1, '2026-05-19 14:11:12'),
(8, 1, 2, 'mensaje', 1, 1, '2026-05-19 14:13:55'),
(9, 6, 2, 'valoracion', 4, 0, '2026-05-25 22:01:40'),
(10, 5, 2, 'valoracion', 2, 0, '2026-05-25 22:02:04'),
(11, 5, 2, 'comentario', 2, 0, '2026-05-25 22:02:15'),
(12, 5, 1, 'valoracion', 2, 0, '2026-05-25 23:07:06'),
(13, 5, 1, 'comentario', 2, 0, '2026-05-25 23:07:28'),
(14, 5, 1, 'me_interesa', 2, 0, '2026-05-25 23:07:33'),
(15, 5, 1, 'mensaje', 5, 0, '2026-05-25 23:07:48'),
(16, 6, 1, 'comentario', 3, 0, '2026-05-25 23:09:54'),
(17, 6, 1, 'me_interesa', 4, 0, '2026-05-25 23:10:01'),
(18, 6, 1, 'valoracion', 3, 0, '2026-05-25 23:10:08'),
(19, 6, 1, 'valoracion', 4, 0, '2026-05-25 23:10:11'),
(20, 6, 1, 'valoracion', 5, 0, '2026-05-25 23:10:20'),
(21, 6, 1, 'valoracion', 6, 0, '2026-05-25 23:10:25'),
(22, 2, 1, 'mensaje', 2, 1, '2026-05-28 13:44:47'),
(23, 2, 1, 'mensaje', 2, 1, '2026-05-28 13:45:06'),
(24, 2, 1, 'nuevo_seguidor', NULL, 1, '2026-05-28 13:51:59'),
(25, 6, 2, 'me_interesa', 4, 0, '2026-06-01 15:23:36'),
(26, 6, 2, 'valoracion', 6, 0, '2026-06-01 15:26:46'),
(27, 6, 2, 'me_interesa', 3, 0, '2026-06-02 12:29:06'),
(28, 6, 2, 'me_interesa', 5, 0, '2026-06-05 11:09:13'),
(29, 2, 1, 'mensaje', 2, 1, '2026-06-05 11:22:45'),
(30, 2, 1, 'mensaje', 2, 1, '2026-06-05 11:22:57'),
(31, 1, 2, 'mensaje', 1, 1, '2026-06-05 11:23:26'),
(32, 2, 1, 'mensaje', 2, 1, '2026-06-05 11:49:49'),
(33, 2, 1, 'mensaje', 2, 1, '2026-06-05 11:49:54'),
(34, 1, 2, 'mensaje', 1, 1, '2026-06-05 11:50:12'),
(35, 2, 1, 'valoracion', 7, 0, '2026-06-05 19:42:46'),
(36, 2, 1, 'me_interesa', 7, 0, '2026-06-05 19:42:48'),
(37, 2, 1, 'mensaje', 2, 1, '2026-06-05 19:44:00'),
(38, 2, 1, 'comentario', 4, 1, '2026-06-05 19:44:37'),
(39, 1, 2, 'mensaje', 1, 1, '2026-06-06 09:55:22'),
(40, 1, 2, 'mensaje', 1, 0, '2026-06-07 18:20:04'),
(41, 1, 2, 'me_interesa', 8, 0, '2026-06-07 22:00:56');

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

--
-- Volcado de datos para la tabla `persona`
--

INSERT INTO `persona` (`id`, `nombre`, `apellido`, `email`, `password_hash`, `telefono`, `fecha_nacimiento`, `avatar_url`, `created_at`) VALUES
(1, 'Mia', 'Perez', 'miaperez@lagordita.com', '$2b$10$5ziXWco9NTjmmkFbrIt/PuV5UCzM1WaF7IkyElL.d32OhGX.GwNDW', '+542657604851', '1997-03-08', NULL, '2026-03-21 13:19:30'),
(2, 'Hernan', 'Funes', 'funes.hernan.max@gmail.com', '$2b$10$6l0FU/gHLUWRWeAQi5kcYOXLFK7kGjj5BSqJeH7FP/xSXQg7N4epm', '+542657604851', '1995-08-09', NULL, '2026-05-04 12:31:51'),
(3, 'musca', 'riven', 'muscariven@gmail.com', '$2b$10$23vAlkYMHSiY4QYWtZF5AexusQuWL57.PNX.ZEX3lZI30nGNa6fh2', '+542657604851', '2000-02-02', NULL, '2026-05-04 14:49:00'),
(6, 'Validador', 'Admin', 'validador@fotaza.com', '$2b$10$23vAlkYMHSiY4QYWtZF5AexusQuWL57.PNX.ZEX3lZI30nGNa6fh2', '542657604851', '1995-08-09', NULL, '2026-05-25 20:38:08'),
(7, 'Usuario', 'Test 1', 'usuario1@fotaza.com', '$2b$10$p929CyPEBhuzmcFVKIY6S.ztaJLJCJdbIWTZNVQtR4WQEh5jf/ubK', NULL, '1995-08-09', NULL, '2026-05-25 21:54:47'),
(8, 'Usuario ', 'Test 2', 'usuario2@fotaza.com', '$2b$10$ym.I.9uQg7XObaOoVV74sOpahyp0w2mjd.C/lM0JSVJ5USi8pN0LO', NULL, '1995-08-09', NULL, '2026-05-25 21:55:31'),
(9, 'Usuario', '4', 'usuario4@fotaza.com', '$2b$10$nup521yRi5AXw7MGO.WVguI.6v5b963O1.gQTBhm9Jj9HER4bpQvi', '+542657604851', '1999-09-09', NULL, '2026-06-08 12:39:13'),
(10, 'Usuario', 'Cinco', 'usuario5@fotaza.com', '$2b$10$ym.I.9uQg7XObaOoVV74sOpahyp0w2mjd.C/lM0JSVJ5USi8pN0LO', NULL, NULL, NULL, '2026-06-09 11:14:16'),
(11, 'Usuario', 'Seis', 'usuario6@fotaza.com', '$2b$10$ym.I.9uQg7XObaOoVV74sOpahyp0w2mjd.C/lM0JSVJ5USi8pN0LO', NULL, NULL, NULL, '2026-06-09 11:14:16'),
(12, 'Usuario', 'Siete', 'usuario7@fotaza.com', '$2b$10$ym.I.9uQg7XObaOoVV74sOpahyp0w2mjd.C/lM0JSVJ5USi8pN0LO', NULL, NULL, NULL, '2026-06-09 11:14:16');

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
-- Volcado de datos para la tabla `publicacion`
--

INSERT INTO `publicacion` (`id`, `usuario_id`, `titulo`, `descripcion`, `comentarios_abiertos`, `estado`, `created_at`) VALUES
(1, 1, 'test', 'esta es una imagen de prueba', 1, 0, '2026-04-22 08:43:03'),
(2, 5, 'el gato de usuario 1', 'este es el gato de usuario 1, que fue subido como imagen unica. ', 1, 0, '2026-05-25 21:57:46'),
(3, 6, 'texturas', 'se prueba con usuario 2 subir un conjunto de imagenes (4) sin copyright.', 1, 0, '2026-05-25 22:00:48'),
(4, 2, 'ia generated', 'imagenes generadas con ia, generadas con prompt tambien hecho con ia', 0, 0, '2026-06-02 12:32:59'),
(5, 1, 'Cita con mi amor', 'Foto de cuando fuimos a comer a un lugar que nos encanta con mi gordito', 1, 0, '2026-06-05 19:52:37'),
(6, 7, 'publicacion para ser baneado 1', NULL, 1, 2, '2026-06-08 12:39:56'),
(7, 7, 'publicacion para ser baneado 2', NULL, 1, 2, '2026-06-08 12:40:26'),
(8, 7, 'publicacion para ser baneado 3', NULL, 1, 2, '2026-06-08 12:40:48'),
(9, 8, 'Atardecer en la montaña', 'Una vista increíble desde la cima', 1, 0, '2026-06-09 11:27:10'),
(10, 8, 'Ciudad de noche', 'Las luces de la ciudad reflejadas en el río', 1, 0, '2026-06-09 11:27:10'),
(11, 9, 'Naturaleza en la Patagonia', 'Flora y fauna de la patagonia', 1, 0, '2026-06-09 11:27:10'),
(12, 9, 'Retratos urbanos', 'Fotografía callejera en Buenos Aires', 1, 0, '2026-06-09 11:27:10'),
(13, 10, 'Macro fotografía', 'El mundo en detalle', 1, 0, '2026-06-09 11:27:10'),
(14, 10, 'Paisajes desérticos', 'La belleza del desierto argentino', 1, 0, '2026-06-09 11:27:10');

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

--
-- Volcado de datos para la tabla `publicacion_etiqueta`
--

INSERT INTO `publicacion_etiqueta` (`publicacion_id`, `etiqueta_id`) VALUES
(1, 1),
(1, 2),
(1, 3),
(2, 4),
(2, 5),
(2, 6),
(3, 7),
(3, 8),
(3, 9),
(4, 10),
(5, 11),
(6, 3),
(7, 3),
(8, 3),
(9, 15),
(9, 20),
(10, 16),
(10, 21),
(11, 15),
(11, 22),
(12, 16),
(12, 17),
(13, 18),
(14, 19);

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

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id`, `persona_id`, `username`, `estado`, `publicaciones_bajadas`, `updated_at`) VALUES
(1, 1, 'miaperez8', 'activo', 0, '2026-03-21 13:19:30'),
(2, 2, 'hernanprueba', 'activo', 0, '2026-05-04 12:31:51'),
(3, 3, 'muscariven', 'activo', 0, '2026-05-04 14:49:00'),
(5, 7, 'usuario1', 'activo', 0, '2026-05-25 21:54:47'),
(6, 8, 'usuario2', 'activo', 0, '2026-05-25 21:55:31'),
(7, 9, 'usuario4', 'inactivo', 3, '2026-06-08 12:45:19'),
(8, 10, 'usuario5', 'activo', 0, '2026-06-09 11:14:16'),
(9, 11, 'usuario6', 'activo', 0, '2026-06-09 11:14:16'),
(10, 12, 'usuario7', 'activo', 0, '2026-06-09 11:14:16');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `validador`
--

CREATE TABLE `validador` (
  `id` int(10) UNSIGNED NOT NULL,
  `persona_id` int(10) UNSIGNED NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `validador`
--

INSERT INTO `validador` (`id`, `persona_id`, `created_at`) VALUES
(2, 6, '2026-05-25 20:38:08');

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `valoracion`
--

INSERT INTO `valoracion` (`id`, `imagen_id`, `usuario_id`, `puntuacion`, `created_at`) VALUES
(1, 1, 2, 5, '2026-05-04 12:32:10'),
(2, 4, 2, 5, '2026-05-25 22:01:40'),
(3, 2, 2, 4, '2026-05-25 22:02:04'),
(4, 2, 1, 5, '2026-05-25 23:07:06'),
(5, 3, 1, 4, '2026-05-25 23:10:08'),
(6, 4, 1, 3, '2026-05-25 23:10:11'),
(7, 5, 1, 5, '2026-05-25 23:10:20'),
(8, 6, 1, 5, '2026-05-25 23:10:25'),
(9, 6, 2, 3, '2026-06-01 15:26:46'),
(10, 7, 1, 5, '2026-06-05 19:42:46'),
(44, 12, 9, 5, '2026-06-09 11:32:28'),
(45, 12, 10, 4, '2026-06-09 11:32:28'),
(46, 13, 8, 4, '2026-06-09 11:32:28'),
(47, 13, 10, 5, '2026-06-09 11:32:28'),
(48, 14, 8, 4, '2026-06-09 11:32:28'),
(49, 14, 10, 3, '2026-06-09 11:32:28'),
(50, 15, 8, 5, '2026-06-09 11:32:28'),
(51, 15, 10, 4, '2026-06-09 11:32:28'),
(52, 16, 9, 5, '2026-06-09 11:32:28'),
(53, 17, 8, 4, '2026-06-09 11:32:28'),
(54, 17, 9, 3, '2026-06-09 11:32:28');

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
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `comentario`
--
ALTER TABLE `comentario`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `denuncia_comentario`
--
ALTER TABLE `denuncia_comentario`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `denuncia_publicacion`
--
ALTER TABLE `denuncia_publicacion`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de la tabla `etiqueta`
--
ALTER TABLE `etiqueta`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT de la tabla `imagen`
--
ALTER TABLE `imagen`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT de la tabla `mensaje`
--
ALTER TABLE `mensaje`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT de la tabla `me_interesa`
--
ALTER TABLE `me_interesa`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `motivo_denuncia`
--
ALTER TABLE `motivo_denuncia`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `notificacion`
--
ALTER TABLE `notificacion`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT de la tabla `persona`
--
ALTER TABLE `persona`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `publicacion`
--
ALTER TABLE `publicacion`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `validador`
--
ALTER TABLE `validador`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `valoracion`
--
ALTER TABLE `valoracion`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=55;

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
