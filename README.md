# 📦 API de Productos – Backend (Node.js + Express)

## 📌 Descripción

Este proyecto corresponde a un **Trabajo Práctico de Backend** desarrollado con **Node.js y Express**, utilizando el sistema de **ES Modules**.

La aplicación implementa una **API REST** para la gestión de productos y utiliza un archivo **JSON como base de datos simulada**, aplicando persistencia de datos mediante el módulo **File System (fs)**.

El objetivo principal es comprender el funcionamiento de un backend básico, el manejo de rutas, métodos HTTP y la persistencia de información sin utilizar bases de datos reales.

---

## 🛠️ Tecnologías utilizadas

* Node.js
* Express.js
* ES Modules (`import / export`)
* File System (fs)
* Chalk (logs en consola)
* Postman (pruebas de la API)

---

## 📁 Estructura del proyecto

PROYECTOBACKEND
│
├── node_modules/                  # Dependencias del proyecto
├── postman/                       # Colección de Postman
├── .gitignore                     # Archivos ignorados por Git
├── package-lock.json              # Control de versiones de dependencias
├── package.json                   # Configuración del proyecto (ES Modules)
├── productos.json                 # Base de datos simulada
├── README.md                      # Documentación del proyecto
└── server.js                      # Servidor Express

---

## ⚙️ Configuración del proyecto (ES Modules)

El proyecto está configurado para utilizar **ES Modules**, lo cual se define en el archivo `package.json`:

```json
{
  "type": "module"
}
```

Gracias a esta configuración, se utiliza la sintaxis moderna `import` para incorporar dependencias en lugar de `require`.

---

El servidor se ejecutará en:

http://localhost:3000

---

## 💾 Persistencia de datos

La aplicación utiliza un archivo **productos.json** como base de datos simulada.

Las operaciones de lectura y escritura se realizan mediante el módulo nativo de Node.js **File System (fs)**:

* `fs.readFileSync()` para leer los productos almacenados
* `fs.writeFileSync()` para guardar los cambios realizados

Esto permite que los datos persistan aun cuando el servidor se reinicia.

---

## 🎨 Uso de Chalk

Se incorporó la librería **Chalk** para mejorar la visualización de los mensajes que se muestran en la consola del servidor.

Chalk permite agregar **colores y estilos** a los `console.log`, facilitando la identificación de:

* Inicio correcto del servidor
* Peticiones recibidas (GET, POST, PUT, DELETE)
* Errores y validaciones
* Acciones exitosas como creación, actualización o eliminación de productos

La librería se utiliza mediante la sintaxis de ES Modules:

```js
import chalk from "chalk";
```

El uso de Chalk no afecta el funcionamiento de la API ni las respuestas enviadas a Postman, ya que su función es exclusivamente visual en la consola.

---

## 📌 Endpoints disponibles

### 🔹 GET – Obtener todos los productos

```
GET /productos
```

---

### 🔹 GET – Obtener un producto por ID

```
GET /productos/:id
```

---

### 🔹 POST – Crear un nuevo producto

```
POST /productos
```

**Body (JSON):**

```json
{
  "nombre": "Auriculares",
  "marca": "Sony",
  "precio": 120000
}
```

---

### 🔹 PUT – Actualizar un producto

```
PUT /productos/:id
```

**Body (JSON):**

```json
{
  "precio": 135000
}
```

---

### 🔹 DELETE – Eliminar un producto

```
DELETE /productos/:id
```

---

## 🧪 Pruebas con Postman

Se creó una **colección de Postman** para probar todos los endpoints de la API, permitiendo validar el correcto funcionamiento del CRUD de productos.

---

## 🎓 Objetivos de aprendizaje

* Comprender el funcionamiento de una API REST
* Manejar rutas y métodos HTTP
* Implementar persistencia de datos sin bases de datos reales
* Utilizar ES Modules en Node.js
* Aplicar Chalk para mejorar la lectura de logs
* Probar endpoints utilizando Postman

---