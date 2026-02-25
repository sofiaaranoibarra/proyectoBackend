// ---------------- IMPORTS ----------------
import express from "express";
import handlebars from "express-handlebars";
import fs from "fs";
import path from "path";
import { createServer } from 'http';
import { fileURLToPath } from "url";
import chalk from "chalk";

import http from "http";
import homeRouter from './routes/home.router.js';
import uploadRouter from "./routes/upload.router.js";
import { Server } from "socket.io";

// ---------------- APP + PUERTO ----------------
const app = express();
const PORT = 3000;

// ---------------- CONFIG ES MODULES ----------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------------- SERVIDOR HTTP + SOCKET.IO ----------------
const server = http.createServer(app);
const io = new Server(server);

// ---------------- HANDLEBARS ----------------
app.engine("hbs", handlebars.engine({ extname: ".hbs", defaultLayout: "main" }));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ---------------- MIDDLEWARE ----------------
app.use(express.json());
app.use("/upload", uploadRouter);

// ---------------- PATHS ----------------
const productosPath = path.join(__dirname, "productos.json");
const carritosPath = path.join(__dirname, "carritos.json");
const uploadsPath = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}

// ---------------- FUNCIONES AUXILIARES ----------------
const leerArchivo = (ruta) => {
  try {
    console.log(chalk.cyan(`📖 Leyendo archivo ${ruta}`));
    const data = fs.readFileSync(ruta, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.log(chalk.red("❌ Error al leer archivo"), error.message);
    return [];
  }
};

const guardarArchivo = (ruta, data) => {
  try {
    fs.writeFileSync(ruta, JSON.stringify(data, null, 2));
    console.log(chalk.green("💾 Archivo guardado correctamente"));
  } catch (error) {
    console.log(chalk.red("❌ Error al guardar archivo"), error.message);
  }
};

const generarNuevoId = (items) => {
  if (items.length === 0) return 1;
  return Math.max(...items.map(i => i.id)) + 1;
};

// ---------------- WEBSOCKET ----------------
io.on("connection", (socket) => {
  console.log("🟢 Nuevo Usuario Conectado");

  socket.on("chat:userConnected", (user) => {
    socket.data.username = user;
    socket.broadcast.emit("chat:status", {
      message: "Usuario Conectado 😊"
    });
  });

  const productos = leerArchivo(productosPath);
  socket.emit("productosActualizados", productos);

  socket.on("nuevoProducto", (data) => {
    const productos = leerArchivo(productosPath);

    const nuevoProducto = {
      id: generarNuevoId(productos),
      ...data
    };

    productos.push(nuevoProducto);
    guardarArchivo(productosPath, productos);

    io.emit("productosActualizados", productos);
  });

  socket.on("eliminarProducto", (id) => {
    const productos = leerArchivo(productosPath);
    const filtrados = productos.filter((p) => p.id !== id);

    guardarArchivo(productosPath, filtrados);

    io.emit("productosActualizados", filtrados);
  });

  socket.on("chat:message", (data) => {
    const chatMessage = {
      user: data.user,
      message: data.message,
      timestamp: new Date().toLocaleTimeString("es-AR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
      })
    };

    io.emit("chat:message", chatMessage);
  });

  socket.on("disconnect", () => {
    console.log("🔴 Usuario Desconectado");

    if (socket.data.username) {
      socket.broadcast.emit("chat:status", {
        message: "Usuario Desconectado ☹️"
      });
    }
  });
});

// ---------------- VISTAS ----------------
app.get("/", (req, res) => {
  res.render("home", {
    name: "Sofia",
    last_name: "Arano Ibarra"
  });
});

app.get("/realTimeProducts", (req, res) => {
  res.render("realTimeProducts");
});

app.get("/chat", (req, res) => {
  res.render("chat");
});


// ---------------- PRODUCTOS ----------------
app.get("/productos", (req, res) => {
  const productos = leerArchivo(productosPath);
  res.render("products", {
    title: "Productos",
    productos
  });
});

app.get("/api/productos", (req, res) => {
  const productos = leerArchivo(productosPath);
  res.json({ total: productos.length, productos });
});

app.get("/productos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const productos = leerArchivo(productosPath);
  const producto = productos.find(p => p.id === id);

  if (!producto) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  res.json(producto);
});

app.post("/productos", (req, res) => {
  const { nombre, marca, precio } = req.body;

  if (!nombre || !precio) {
    return res.status(400).json({ error: "Faltan datos obligatorios" });
  }

  const productos = leerArchivo(productosPath);

  const nuevoProducto = {
    id: generarNuevoId(productos),
    nombre,
    marca,
    precio
  };

  productos.push(nuevoProducto);
  guardarArchivo(productosPath, productos);

  // 🔥 Actualiza realtimeProducts
  io.emit("productosActualizados", productos);

  res.status(201).json({
    mensaje: "Producto creado con éxito",
    producto: nuevoProducto
  });
});

app.put("/productos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const productos = leerArchivo(productosPath);
  const producto = productos.find(p => p.id === id);

  if (!producto) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  producto.nombre = req.body.nombre ?? producto.nombre;
  producto.marca = req.body.marca ?? producto.marca;
  producto.precio = req.body.precio ?? producto.precio;

  guardarArchivo(productosPath, productos);

  // 🔥 También actualiza realtime
  io.emit("productosActualizados", productos);

  res.json({ mensaje: "Producto actualizado", producto });
});

app.delete("/productos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const productos = leerArchivo(productosPath);
  const filtrados = productos.filter(p => p.id !== id);

  if (filtrados.length === productos.length) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  guardarArchivo(productosPath, filtrados);

  // 🔥 Actualiza realtimeProducts
  io.emit("productosActualizados", filtrados);

  res.status(204).send();
});

// ---------------- CARRITOS ----------------
app.post("/carritos", (req, res) => {
  const carritos = leerArchivo(carritosPath);

  const nuevoCarrito = {
    id: generarNuevoId(carritos),
    productos: []
  };

  carritos.push(nuevoCarrito);
  guardarArchivo(carritosPath, carritos);

  res.status(201).json(nuevoCarrito);
});

app.get("/carritos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const carritos = leerArchivo(carritosPath);
  const carrito = carritos.find(c => c.id === id);

  if (!carrito) {
    return res.status(404).json({ error: "Carrito no encontrado" });
  }

  res.json(carrito);
});

app.post("/carritos/:id/productos/:pid", (req, res) => {
  const cid = parseInt(req.params.id);
  const pid = parseInt(req.params.pid);

  const carritos = leerArchivo(carritosPath);
  const productos = leerArchivo(productosPath);

  const carrito = carritos.find(c => c.id === cid);
  const producto = productos.find(p => p.id === pid);

  if (!carrito || !producto) {
    return res.status(404).json({ error: "Carrito o producto inexistente" });
  }

  carrito.productos.push(producto);
  guardarArchivo(carritosPath, carritos);

  res.json({ mensaje: "Producto agregado al carrito", carrito });
});

// ---------------- SERVIDOR ----------------
server.listen(PORT, () => {
  console.log(chalk.green.bold(`🚀 Servidor corriendo en http://localhost:${PORT}`));
});

