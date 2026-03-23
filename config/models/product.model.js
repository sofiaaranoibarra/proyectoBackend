import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    nombre: { type: String, required: true, index: true },
    marca: { type: String },
    color: { type: String },
    precio: { type: Number, required: true },
    stock: { type: Number, required: true },
});

export const Product = mongoose.model("Product", productSchema);
