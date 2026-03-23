import { Router } from "express";
import { aggregateProducts } from "../controllers/aggregations.controller.js";

const router = Router();

router.get('/productos/resumen', aggregateProducts);

export default router;
