Creación del proyecto:
- Creación del ambiente:
npx create-react-app frontend //Para crear el ambiente de React
npm start //para iniciar la página, te abrirrá una ventana web
npm init -y //para crear el backend, lo haces en una carpeta al mismo nivel que el front
npm install express //básicamente necesario para no complicarse la vida con Node
npm install --save concurrently //para que el servidor de node.js y react se abran al mismo tiempo

- Paquetes para trabajar en React:
npm install react-router-dom //Permite poder hacer 'links' de una página interna a otra
npm install @mui/material @emotion/react @emotion/styled //Es como bootstrap, pero específicamente para react

- Carpetas:
frontend/src/components -> es donde estarán los componentes compartidos entre todas las páginas (header, footer, sidebars, etc)
frontend/src/views -> es donde estarán las páginas