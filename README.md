### 1. Instalar dependencias del backend

Abre una terminal y ubícate dentro de la carpeta del proyecto clonado. Luego entra al directorio `backend`:

```bash
cd backend
```

Instala las dependencias necesarias:

```bash
npm install
```

Esto instalará todas las librerías especificadas en el archivo `package.json` del backend.

---

### 2. Instalar dependencias del frontend

Regresa a la carpeta raíz y entra a la carpeta `frontend`:

```bash
cd ../frontend
```

Ahora instala las dependencias del frontend:

```bash
npm install
```

Esto descargará todos los paquetes necesarios para que la aplicación React funcione correctamente.

---

### 3. Iniciar el backend y frontend

Una vez instaladas las dependencias:

#### Para iniciar el servidor backend:
Ubícate en la carpeta `backend` y ejecuta:

```bash
node index.js
```

Esto levantará el servidor Express en el puerto 3001.
Si ves el mensaje “Servidor corriendo en http://localhost:3001” en la terminal, todo está funcionando.

#### Para iniciar el frontend:
Abre una nueva terminal, ubícate en la carpeta `frontend` y ejecuta:

```bash
npm start
```

Esto abrirá la aplicación en tu navegador por defecto (por lo general en http://localhost:3000).

---

### 4. Configuración de MySQL

Para que el backend se conecte correctamente a la base de datos, debes tener un servidor MySQL configurado localmente con los siguientes parámetros:

```bash
Host: localhost

Usuario: root

Contraseña: admin

Base de datos: cuentasporpagar

Puerto: 3306 (por defecto)
```

Asegúrate de que el servidor MySQL esté activo antes de correr node `index.js`, y que la base de datos `cuentasporpagar` exista con las tablas necesarias.
