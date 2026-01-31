import express from "express";
import fs from "fs";
import path from "path";
import chalk from "chalk";
import { fileURLToPath } from "url";

const app = express();
const PORT = 3000;

// Necesario para usar __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());

// Ruta del archivo JSON
const filePath = path.join(__dirname, "productos.json");

// Función para leer productos
const leerProductos = () => {
    console.log(chalk.cyan("📖 Leyendo productos desde archivo JSON"));
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data);
};

// Función para guardar productos
const guardarProductos = (productos) => {
    fs.writeFileSync(filePath, JSON.stringify(productos, null, 2));
    console.log(chalk.green("💾 Productos guardados correctamente"));
};

// Ruta principal
app.get("/", (req, res) => {
    console.log(chalk.blue("🏠 GET /"));
    res.status(200).json("Bienvenidos");
});

// GET - todos los productos
app.get("/productos", (req, res) => {
    console.log(chalk.blue("📦 GET /productos"));
    const productos = leerProductos();
    res.status(200).json({
        total: productos.length,
        productos
    });
});

// GET - producto por ID
app.get("/productos/:id", (req, res) => {
    const id = parseInt(req.params.id);
    console.log(chalk.blue(`🔍 GET /productos/${id}`));

    const productos = leerProductos();
    const producto = productos.find(p => p.id === id);

    if (!producto) {
        console.log(chalk.red("❌ Producto no encontrado"));
        return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.status(200).json(producto);
});

// POST - crear producto
app.post("/productos", (req, res) => {
    console.log(chalk.yellow("➕ POST /productos"));

    const { nombre, marca, precio } = req.body;

    if (!nombre || !precio) {
        console.log(chalk.red("⚠️ Datos obligatorios faltantes"));
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

    console.log(chalk.green("✅ Producto creado con éxito"));

    res.status(201).json({
        mensaje: "Producto creado con éxito.",
        producto: nuevoProducto
    });
});

// PUT - actualizar producto
app.put("/productos/:id", (req, res) => {
    const id = parseInt(req.params.id);
    console.log(chalk.yellow(`✏️ PUT /productos/${id}`));

    const { nombre, marca, precio } = req.body;
    const productos = leerProductos();
    const producto = productos.find(p => p.id === id);

    if (!producto) {
        console.log(chalk.red("❌ Producto no encontrado"));
        return res.status(404).json({ error: "Producto no encontrado" });
    }

    producto.nombre = nombre ?? producto.nombre;
    producto.marca = marca ?? producto.marca;
    producto.precio = precio ?? producto.precio;

    guardarProductos(productos);

    console.log(chalk.green("🔄 Producto actualizado correctamente"));

    res.status(200).json({
        mensaje: "Producto actualizado correctamente",
        producto
    });
});

// DELETE - eliminar producto
app.delete("/productos/:id", (req, res) => {
    const id = parseInt(req.params.id);
    console.log(chalk.red(`🗑️ DELETE /productos/${id}`));

    const productos = leerProductos();
    const existe = productos.some(p => p.id === id);

    if (!existe) {
        console.log(chalk.red("❌ Producto no encontrado"));
        return res.status(404).json({ error: "Producto no encontrado" });
    }

    const productosFiltrados = productos.filter(p => p.id !== id);
    guardarProductos(productosFiltrados);

    console.log(chalk.green("🧹 Producto eliminado"));

    res.status(204).send();
});

// Servidor
app.listen(PORT, () => {
    console.log(
        chalk.green.bold(`🚀 Servidor corriendo en http://localhost:${PORT}`)
    );
});
