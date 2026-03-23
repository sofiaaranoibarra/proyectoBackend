import { Product } from "../config/models/product.model.js";

export const aggregateProducts = async (req, res) => {
    try {
        await Product.aggregate([
            /* Ordenamos alfabeticamente */
            { $sort: { product: 1 } },

            /* Agrupamos todos los productos en un unico array */
            {
                $group: {
                    _id: null,
                    products: { $push: "$$ROOT" },
                }
            },

            /* Creamos un nuevo documento con el resumen de productos */
            {
                $project: {
                    _id: "resumenProductos",
                    totalProducts: { $size: "$products" },
                    products: 1
                },
            },

            /* Guardamos el documento en una coleccion nueva */
            {
                $merge: {
                    into: "orders",
                    whenMatched: "replace",
                    whenNotMatched: "insert",
                },
            }
        ]);

        res.status(200).json({ message: "Resumen de productos generado y guardado en 'orders'" });
    } catch (error) {
        console.error("Error, se produjo un error en aggregateProducts", error);
        res.status(500).json({ error: "Error, se produjo un error en aggregateProducts" });
    }
};
