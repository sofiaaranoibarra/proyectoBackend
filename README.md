# 📦 API de Productos – Backend (Node.js + Express + WebSockets)

---

## 📌 Descripción

Este proyecto corresponde a un Trabajo Práctico de Backend desarrollado con Node.js y Express, utilizando el sistema de ES Modules.

La aplicación implementa una API REST para la gestión de productos, utilizando archivos JSON como base de datos simulada. Además, se incorporó Socket.io para permitir comunicación en tiempo real.

El objetivo principal es comprender el funcionamiento de un backend completo, combinando métodos HTTP, persistencia de datos, renderizado de vistas y comunicación en tiempo real.

---

## 🛠️ Tecnologías utilizadas

- Node.js  
- Express.js  
- ES Modules (import / export)  
- File System (fs)  
- Socket.io  
- Handlebars  
- Postman  

---

## 📁 Estructura del proyecto

```
PROYECTOBACKEND
│
├── node_modules
├── postman
│
├── public
│   ├── css
│   ├── img
│   └── js
│
├── routes
│   ├── home.router.js
│   └── upload.router.js
│
├── uploads
│
├── views
│   ├── layouts
│   │   └── main.hbs
│   │
│   ├── 404.hbs
│   ├── chat.hbs
│   ├── home.hbs
│   ├── products.hbs
│   └── upload.hbs
│
├── .gitignore
├── app.js
├── package-lock.json
├── package.json
├── productos.json
└── README.md
```

---

## ⚙️ Configuración del proyecto (ES Modules)

En el archivo `package.json` se configuró:

```json
{
  "type": "module"
}
```

Esto permite utilizar la sintaxis moderna `import` en lugar de `require`.

---

## 🚀 Cómo ejecutar el proyecto

1. Instalar dependencias:

```
npm install
```

2. Ejecutar el servidor:

```
npm run dev
```

El servidor se ejecuta en:

```
http://localhost:3000
```

---

## 💾 Persistencia de datos

Se utiliza el archivo:

- `productos.json`

como base de datos simulada.

Las operaciones de lectura y escritura se realizan con el módulo nativo File System (fs), lo que permite que los datos se mantengan aunque el servidor se reinicie.

---

## 🔄 Implementación de WebSockets

Se integró Socket.io para permitir comunicación en tiempo real.

Cuando se crean o modifican productos, se emite un evento mediante:

```js
io.emit("productosActualizados", productos);
```

Esto permite que los clientes conectados reciban actualizaciones automáticamente.

---

## 📌 Endpoints principales

### Productos

- GET /productos  
- GET /productos/:id  
- POST /productos  
- PUT /productos/:id  
- DELETE /productos/:id  

### Rutas adicionales

- Ruta principal renderizada con Handlebars  
- Ruta de subida de archivos  

---

## 🎓 Objetivos de aprendizaje

- Comprender el funcionamiento de una API REST  
- Manejar rutas y métodos HTTP  
- Implementar persistencia con archivos JSON  
- Utilizar ES Modules  
- Integrar WebSockets  
- Renderizar vistas con Handlebars  
- Organizar correctamente la estructura del proyecto  

---