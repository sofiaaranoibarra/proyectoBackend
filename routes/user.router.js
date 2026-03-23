import { Router } from "express";
import { UserModel } from "../config/models/user.model.js";
import { Product } from "../config/models/product.model.js";
import mongoose from "mongoose";

const router = Router();



/* Obtener todos los usuarios */
router.get("/", async (req, res) => {
    try {
        const users = await UserModel.find();
        res.status(200).json({ users: users });
    } catch (err) {
        return res.status(500).json({ error: "Error interno del servidor", message: err.message });
    }
});

/* Crear un nuevo usuario */
router.post('/', async (req, res) => {
    try {
        const { nombre, email, ciudad } = req.body;

        if (!nombre || !email || !ciudad) {
            return res.status(400).json({ error: "Faltan campos obligatorios" })
        }

        const user = new UserModel({
            nombre,
            email,
            ciudad
        });

        await user.save();

        res.status(201).json({ message: "Usuario creado exitosamente", user })
    } catch (err) {
        return res.status(500).json({ error: "Error interno del servidor", message: err.message })
    }
})

/* Obtener un usuario por ID */
router.get('/:id', async (req, res) => {
    try {
        const ID = req.params.id
        if (!mongoose.Types.ObjectId.isValid(ID)) {
            return res.status(400).json({ error: "ID con formato Invalido" })
        }
        const user = await UserModel.findById(ID).populate("products");
        if (!user) return res.status(404).json({ error: "Usuario no encontrado" })
        res.status(200).json({ user })
    } catch (err) {
        return res.status(500).json({ error: "Error interno del servidor", message: err.message })
    }
})

/* Agregar un producto a un usuario */
router.post('/:userId/products/:productId', async (req, res) => {
    try {
        const { userId, productId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ error: "ID con formato Invalido" });
        }

        const user = await UserModel.findById(userId);
        const product = await Product.findById(productId);

        if (!user || !product) {
            return res.status(404).json({ error: "Usuario o producto no encontrado" });
        }

        if (user.products.includes(product._id)) {
            return res.status(400).json({ error: `El producto ${product.nombre} ya esta agregado al usuario ${user.name}` });
        }

        user.products.push(product._id);
        await user.save();

        const populatedUser = await UserModel.findById(userId).populate("products");
        res.status(201).json({ message: `Producto ${product.nombre} agregado al usuario ${user.name} exitosamente`, user: populatedUser });
    } catch (err) {
        return res.status(500).json({ error: "Error interno del servidor", message: err.message });
    }
})

/* Eliminar un producto de un usuario */
router.delete('/:userId/products/:productId', async (req, res) => {
    try {
        const { userId, productId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ error: "ID con formato Invalido" });
        }

        const user = await UserModel.findById(userId);
        const product = await Product.findById(productId);

        if (!user || !product) {
            return res.status(404).json({ error: "Usuario o producto no encontrado" });
        }

        user.products = user.products.filter(
            (id) => id.toString() !== productId
        );

        await user.save();

        const populatedUser = await UserModel.findById(userId).populate("products");
        res.status(200).json({ message: `Producto ${product.nombre} removido del usuario ${user.name} correctamente`, user: populatedUser });
    } catch (err) {
        return res.status(500).json({ error: "Error interno del servidor", message: err.message });
    }
})

/* Actualizar un usuario por ID */
router.put('/:id', async (req, res) => {
    try {
        const ID = req.params.id
        if (!mongoose.Types.ObjectId.isValid(ID)) {
            return res.status(400).json({ error: "ID con formato Invalido" })
        }

        const user = await UserModel.findByIdAndUpdate(ID, req.body, {
            returnDocument: 'after',
            runValidators: true
        });
        if (!user) return res.status(404).json({ error: "Usuario no encontrado" })
        res.status(200).json({ message: "Usuario actualizado correctamente", user })
    } catch (err) {
        return res.status(500).json({ error: "Error interno del servidor", message: err.message })
    }
})

/* Eliminar un usuario por ID */
router.delete('/:id', async (req, res) => {
    try {
        const ID = req.params.id
        if (!mongoose.Types.ObjectId.isValid(ID)) {
            return res.status(400).json({ error: "ID con formato Invalido" })
        }
        const user = await UserModel.findByIdAndDelete(ID);
        if (!user) return res.status(404).json({ error: "Usuario no encontrado" })
        res.status(204).end();
    } catch (err) {
        return res.status(500).json({ error: "Error interno del servidor", message: err.message })
    }
})

export default router;
