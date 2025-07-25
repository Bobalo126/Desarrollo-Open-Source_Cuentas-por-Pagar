USE [master]
GO
/****** Object:  Database [CuentasPorPagar]    Script Date: 11/6/2025 2:50:02 p. m. ******/
CREATE DATABASE [CuentasPorPagar]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'CuentasPorPagar', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.SQLEXPRESS\MSSQL\DATA\CuentasPorPagar.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'CuentasPorPagar_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.SQLEXPRESS\MSSQL\DATA\CuentasPorPagar_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
 WITH CATALOG_COLLATION = DATABASE_DEFAULT, LEDGER = OFF
GO
ALTER DATABASE [CuentasPorPagar] SET COMPATIBILITY_LEVEL = 160
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [CuentasPorPagar].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [CuentasPorPagar] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [CuentasPorPagar] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [CuentasPorPagar] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [CuentasPorPagar] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [CuentasPorPagar] SET ARITHABORT OFF 
GO
ALTER DATABASE [CuentasPorPagar] SET AUTO_CLOSE ON 
GO
ALTER DATABASE [CuentasPorPagar] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [CuentasPorPagar] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [CuentasPorPagar] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [CuentasPorPagar] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [CuentasPorPagar] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [CuentasPorPagar] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [CuentasPorPagar] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [CuentasPorPagar] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [CuentasPorPagar] SET  ENABLE_BROKER 
GO
ALTER DATABASE [CuentasPorPagar] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [CuentasPorPagar] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [CuentasPorPagar] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [CuentasPorPagar] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [CuentasPorPagar] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [CuentasPorPagar] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [CuentasPorPagar] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [CuentasPorPagar] SET RECOVERY SIMPLE 
GO
ALTER DATABASE [CuentasPorPagar] SET  MULTI_USER 
GO
ALTER DATABASE [CuentasPorPagar] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [CuentasPorPagar] SET DB_CHAINING OFF 
GO
ALTER DATABASE [CuentasPorPagar] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [CuentasPorPagar] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [CuentasPorPagar] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [CuentasPorPagar] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
ALTER DATABASE [CuentasPorPagar] SET QUERY_STORE = ON
GO
ALTER DATABASE [CuentasPorPagar] SET QUERY_STORE (OPERATION_MODE = READ_WRITE, CLEANUP_POLICY = (STALE_QUERY_THRESHOLD_DAYS = 30), DATA_FLUSH_INTERVAL_SECONDS = 900, INTERVAL_LENGTH_MINUTES = 60, MAX_STORAGE_SIZE_MB = 1000, QUERY_CAPTURE_MODE = AUTO, SIZE_BASED_CLEANUP_MODE = AUTO, MAX_PLANS_PER_QUERY = 200, WAIT_STATS_CAPTURE_MODE = ON)
GO
USE [CuentasPorPagar]
GO
/****** Object:  Table [dbo].[ConceptosPago]    Script Date: 11/6/2025 2:50:02 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ConceptosPago](
	[Id] [int] NOT NULL,
	[Descripcion] [nvarchar](255) NOT NULL,
	[Estado] [nvarchar](50) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Parametros]    Script Date: 11/6/2025 2:50:02 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Parametros](
	[AñoProceso] [int] NOT NULL,
	[MesProceso] [int] NOT NULL,
	[CierreEjecutado] [bit] NOT NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Proveedores]    Script Date: 11/6/2025 2:50:02 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Proveedores](
	[IdProveedor] [int] IDENTITY(1,1) NOT NULL,
	[Nombre] [varchar](100) NOT NULL,
	[TipoPersona] [varchar](10) NULL,
	[CedulaRNC] [varchar](20) NOT NULL,
	[Balance] [decimal](18, 2) NULL,
	[Estado] [bit] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[IdProveedor] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
INSERT [dbo].[ConceptosPago] ([Id], [Descripcion], [Estado]) VALUES (1, N'Salario base', N'1')
INSERT [dbo].[ConceptosPago] ([Id], [Descripcion], [Estado]) VALUES (2, N'Bonificación', N'0')
INSERT [dbo].[ConceptosPago] ([Id], [Descripcion], [Estado]) VALUES (3, N'Horas extra', N'1')
INSERT [dbo].[ConceptosPago] ([Id], [Descripcion], [Estado]) VALUES (4, N'Descuento por ausencia', N'0')
INSERT [dbo].[ConceptosPago] ([Id], [Descripcion], [Estado]) VALUES (5, N'Bono por desempeño', N'1')
INSERT [dbo].[ConceptosPago] ([Id], [Descripcion], [Estado]) VALUES (6, N'Vacaciones pagadas', N'1')
INSERT [dbo].[ConceptosPago] ([Id], [Descripcion], [Estado]) VALUES (7, N'Licencia sin goce', N'0')
GO
INSERT [dbo].[Parametros] ([AñoProceso], [MesProceso], [CierreEjecutado]) VALUES (2025, 6, 1)
INSERT [dbo].[Parametros] ([AñoProceso], [MesProceso], [CierreEjecutado]) VALUES (2025, 1, 1)
INSERT [dbo].[Parametros] ([AñoProceso], [MesProceso], [CierreEjecutado]) VALUES (2025, 2, 1)
INSERT [dbo].[Parametros] ([AñoProceso], [MesProceso], [CierreEjecutado]) VALUES (2025, 3, 0)
INSERT [dbo].[Parametros] ([AñoProceso], [MesProceso], [CierreEjecutado]) VALUES (2025, 4, 0)
INSERT [dbo].[Parametros] ([AñoProceso], [MesProceso], [CierreEjecutado]) VALUES (2025, 5, 1)
INSERT [dbo].[Parametros] ([AñoProceso], [MesProceso], [CierreEjecutado]) VALUES (2025, 6, 0)
GO
SET IDENTITY_INSERT [dbo].[Proveedores] ON 

INSERT [dbo].[Proveedores] ([IdProveedor], [Nombre], [TipoPersona], [CedulaRNC], [Balance], [Estado]) VALUES (1, N'Juan Pérez', N'física', N'00112345678', CAST(5000.00 AS Decimal(18, 2)), 1)
INSERT [dbo].[Proveedores] ([IdProveedor], [Nombre], [TipoPersona], [CedulaRNC], [Balance], [Estado]) VALUES (2, N'María Gómez', N'física', N'00123456789', CAST(7500.00 AS Decimal(18, 2)), 1)
INSERT [dbo].[Proveedores] ([IdProveedor], [Nombre], [TipoPersona], [CedulaRNC], [Balance], [Estado]) VALUES (3, N'Constructora ABC SRL', N'jurídica', N'10234567890', CAST(15000.50 AS Decimal(18, 2)), 1)
INSERT [dbo].[Proveedores] ([IdProveedor], [Nombre], [TipoPersona], [CedulaRNC], [Balance], [Estado]) VALUES (4, N'Comercial López', N'jurídica', N'10345678901', CAST(0.00 AS Decimal(18, 2)), 0)
INSERT [dbo].[Proveedores] ([IdProveedor], [Nombre], [TipoPersona], [CedulaRNC], [Balance], [Estado]) VALUES (5, N'Servicios Técnicos SA', N'jurídica', N'10456789012', CAST(3200.75 AS Decimal(18, 2)), 1)
INSERT [dbo].[Proveedores] ([IdProveedor], [Nombre], [TipoPersona], [CedulaRNC], [Balance], [Estado]) VALUES (6, N'Pedro Martínez', N'física', N'00134567890', CAST(450.00 AS Decimal(18, 2)), 0)
SET IDENTITY_INSERT [dbo].[Proveedores] OFF
GO
ALTER TABLE [dbo].[Proveedores] ADD  DEFAULT ((0)) FOR [Balance]
GO
ALTER TABLE [dbo].[Proveedores]  WITH CHECK ADD CHECK  (([TipoPersona]='jurídica' OR [TipoPersona]='física'))
GO
/****** Object:  StoredProcedure [dbo].[ObtenerProveedoresActivos]    Script Date: 11/6/2025 2:50:02 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[ObtenerProveedoresActivos]
AS
BEGIN
    SELECT * FROM Proveedores WHERE Estado = 'Activo';
END;
GO
USE [master]
GO
ALTER DATABASE [CuentasPorPagar] SET  READ_WRITE 
GO
