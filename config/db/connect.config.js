import mongoose from "mongoose";

export const connectMongoDB = async (mode) => {
    try {
        const URL_LOCAL = "mongodb://127.0.0.1:27017/backend_76800";
        const URL_ATLAS = "mongodb+srv://sofiaaranoibarra_db_user:PZGIK8CvukB28sQu@coderhouse-backend.crmwt9g.mongodb.net/";

        const URL = mode === "local" ? URL_LOCAL : URL_ATLAS;

        await mongoose.connect(URL);
        console.log(`✅ MongoDB conectada correctamente a ${mode === "local" ? "local" : "Atlas"} | Base de datos: ${mongoose.connection.name}`);
    } catch (err) {
        console.error("❌ Error al conectar a MongoDB", err);
        process.exit(1);
    }
};
