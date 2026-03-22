import express from "express";
import homeRouter from './routes/home.router.js';
import userRouter from './routes/user.router.js';
import cursoRouter from './routes/courses.router.js';

import { connectMongoDB } from "./config/db/connect.config.js";

const app = express();
const PORT = 3000;
app.use(express.json());

/* Routers */
app.use(`/`, homeRouter);
app.use(`/users`, userRouter);
app.use(`/curso`, cursoRouter);

/* Error 404 */
app.use((req, res) => {
  res.status(404).json({title: "404 - Página no encontrada"});
});

/* Ejecutar servidor */
const startServer = async () => {
await connectMongoDB('atlas');
app.listen(PORT, () => console.log(`Servidor escuchando en http://localhost:${PORT}`));
};

startServer();
