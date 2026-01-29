const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Ruta del archivo JSON
const filePath = path.join(__dirname, "productos.json");

// Función para leer productos
const leerProductos = () => {
    const data = fs.readFileSync(filePath, "utf-8");
    
    return JSON.parse(data);
};

// Función para guardar productos
const guardarProductos = (productos) => {
    fs.writeFileSync(filePath, JSON.stringify(productos, null, 2));
};

// Ruta principal
app.get("/", (req, res) => {
    res.status(200).json({ mensaje: "Bienvenidos a la API de Productos" });
});

// GET - todos los productos
app.get("/productos", (req, res) => {
    const productos = leerProductos();
    res.status(200).json({
        total: productos.length,
        productos
    });
});

// GET - producto por ID
app.get("/productos/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const productos = leerProductos();
    const producto = productos.find(p => p.id === id);

    if (!producto) {
        return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.status(200).json(producto);
});

// POST - crear producto
app.post("/productos", (req, res) => {
    const { nombre, marca, precio } = req.body;

    if (!nombre || !precio) {
        return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    const productos = leerProductos();

    const nuevoProducto = {
        id: productos.length ? productos[productos.length - 1].id + 1 : 1,
        nombre,
        marca,
        precio
    };

    productos.push(nuevoProducto);
    guardarProductos(productos);

    res.status(201).json({
        mensaje: "Producto creado con éxito",
        producto: nuevoProducto
    });
});

// PUT - actualizar producto
app.put("/productos/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const { nombre, marca, precio } = req.body;

    const productos = leerProductos();
    const producto = productos.find(p => p.id === id);

    if (!producto) {
        return res.status(404).json({ error: "Producto no encontrado" });
    }

    producto.nombre = nombre ?? producto.nombre;
    producto.marca = marca ?? producto.marca;
    producto.precio = precio ?? producto.precio;

    guardarProductos(productos);

    res.status(200).json({
        mensaje: "Producto actualizado correctamente",
        producto
    });
});

// DELETE - eliminar producto
app.delete("/productos/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const productos = leerProductos();

    const existe = productos.some(p => p.id === id);
    if (!existe) {
        return res.status(404).json({ error: "Producto no encontrado" });
    }

    const productosFiltrados = productos.filter(p => p.id !== id);
    guardarProductos(productosFiltrados);

    res.status(204).send();
});

// Servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
