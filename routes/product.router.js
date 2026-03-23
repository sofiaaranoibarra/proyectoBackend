import { Router } from "express";
import { Product } from "../config/models/product.model.js";
import mongoose from "mongoose";

const router = Router();

/* Obtener todos los productos */
router.get("/", async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json({ products });
    } catch (err) {
        return res.status(500).json({ error: "Error interno del servidor", message: err.message });
    }
});

/* Crear un nuevo producto */
router.post("/", async (req, res) => {
    try {
        const newProduct = await Product.create(req.body);
        res.status(201).json({ message: "Producto creado exitosamente", product: newProduct });
    } catch (err) {
        return res.status(500).json({ error: "Error interno del servidor", message: err.message });
    }
});

/* Obtener un producto por ID */
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "ID con formato Invalido" });
        }

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        res.status(200).json({ product });
    } catch (err) {
        return res.status(500).json({ error: "Error interno del servidor", message: err.message });
    }
});

/* Actualizar un producto por ID */
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "ID con formato Invalido" });
        }

        const product = await Product.findByIdAndUpdate(id, req.body, {
            returnDocument: "after",
            runValidators: true
        });

        if (!product) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        res.status(200).json({ message: "Producto actualizado correctamente", product });
    } catch (err) {
        return res.status(500).json({ error: "Error interno del servidor", message: err.message });
    }
});

/* Eliminar un producto */
router.delete("/:productId", async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.productId);

        if (!product) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        res.status(204).end();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
