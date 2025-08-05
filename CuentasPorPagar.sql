CREATE DATABASE  IF NOT EXISTS `cuentasporpagar` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `cuentasporpagar`;
-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: cuentasporpagar
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `conceptospago`
--

DROP TABLE IF EXISTS `conceptospago`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `conceptospago` (
  `id` int NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(100) NOT NULL,
  `estado` enum('activo','inactivo') NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `conceptospago`
--

LOCK TABLES `conceptospago` WRITE;
/*!40000 ALTER TABLE `conceptospago` DISABLE KEYS */;
INSERT INTO `conceptospago` VALUES (1,'Servicios Profesionales','activo'),(2,'Compra de Materiales','activo'),(3,'Pago de Honorarios','inactivo'),(4,'Servicios de Consultoría','activo'),(5,'Compra de Equipos','activo'),(6,'Reembolso de Gastos','activo'),(7,'Arrendamiento de Local','inactivo'),(8,'Capacitación de Personal','activo');
/*!40000 ALTER TABLE `conceptospago` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `documentos`
--

DROP TABLE IF EXISTS `documentos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `documentos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `numero_documento` varchar(50) DEFAULT NULL,
  `numero_factura` varchar(50) NOT NULL,
  `fecha_documento` date NOT NULL,
  `monto` decimal(10,2) NOT NULL,
  `fecha_registro` date DEFAULT NULL,
  `proveedor_id` int NOT NULL,
  `estado` enum('Pendiente','Pagado') DEFAULT 'Pendiente',
  PRIMARY KEY (`id`),
  KEY `proveedor_id` (`proveedor_id`),
  CONSTRAINT `documentos_ibfk_1` FOREIGN KEY (`proveedor_id`) REFERENCES `proveedores` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `documentos`
--

LOCK TABLES `documentos` WRITE;
/*!40000 ALTER TABLE `documentos` DISABLE KEYS */;
INSERT INTO `documentos` VALUES (1,'DOC-00001','1234','2025-07-14',2003.00,'2025-07-09',4,'Pagado'),(3,'DOC-00003','23111','2025-07-07',3554444.00,'2025-07-09',3,'Pendiente'),(4,'DOC-00004','1122222','2025-07-16',99800.00,'2025-07-09',5,'Pendiente'),(5,'DOC-00005','211','2025-07-01',543.00,'2025-07-09',4,'Pendiente'),(6,'DOC-00006','423','2025-07-01',12344.00,'2025-07-10',10,'Pendiente'),(7,'DOC-00007','85795','2025-07-29',40000.00,'2025-08-02',1,'Pendiente');
/*!40000 ALTER TABLE `documentos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `parametros`
--

DROP TABLE IF EXISTS `parametros`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `parametros` (
  `id` int NOT NULL AUTO_INCREMENT,
  `anio_proceso` int NOT NULL,
  `mes_proceso` int NOT NULL,
  `cierre_ejecutado` enum('si','no') NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `parametros`
--

LOCK TABLES `parametros` WRITE;
/*!40000 ALTER TABLE `parametros` DISABLE KEYS */;
INSERT INTO `parametros` VALUES (1,2020,11,'no'),(2,2023,3,'si'),(3,2025,4,'si'),(4,2025,5,'si'),(5,2025,6,'no'),(6,2026,7,'no'),(7,2028,1,'no'),(8,2028,7,'no');
/*!40000 ALTER TABLE `parametros` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `proveedores`
--

DROP TABLE IF EXISTS `proveedores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `proveedores` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `tipo_persona` enum('fisica','juridica') NOT NULL,
  `cedula_rnc` varchar(20) NOT NULL,
  `balance` decimal(12,2) NOT NULL DEFAULT '0.00',
  `estado` enum('activo','inactivo') NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cedula_rnc` (`cedula_rnc`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `proveedores`
--

LOCK TABLES `proveedores` WRITE;
/*!40000 ALTER TABLE `proveedores` DISABLE KEYS */;
INSERT INTO `proveedores` VALUES (1,'Juan Pérez','fisica','00112345678',14998.00,'activo'),(2,'Comercial XYZ SRL','juridica','10198765432',45000.00,'activo'),(3,'María López','fisica','00287654321',0.00,'inactivo'),(4,'Tecnología Global SRL','juridica','13145678901',35000.00,'activo'),(5,'Carlos Méndez','fisica','00145678912',5000.00,'activo'),(6,'Grupo Creativo SRL','juridica','10155667788',0.00,'inactivo'),(7,'Lucía Fernández','fisica','00233445566',12000.00,'activo'),(8,'Servicios y Más SRL','juridica','10211223344',7800.00,'activo'),(10,'Mario Mario','fisica','00110641467',1500.00,'activo');
/*!40000 ALTER TABLE `proveedores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) DEFAULT NULL,
  `correo` varchar(100) DEFAULT NULL,
  `rol` enum('admin','usuario') DEFAULT 'usuario',
  `ultima_sesion` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `correo` (`correo`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'Alex Llenas','alex.llenas.arias@gmail.com','admin','2025-08-02 12:59:26'),(2,'Alex Llenas','alex.correo.spam1@gmail.com','usuario','2025-07-09 20:10:47');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-08-02 16:07:42


