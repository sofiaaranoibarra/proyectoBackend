import { Router } from "express";
import { Curso } from "../config/models/curso.model.js";
import { UserModel } from "../config/models/user.model.js";


const router = Router();

// Demo de populate
router.get('/demo', async (req, res) => {
    const cursos = await Curso.find().populate('students', 'name email age _id');
    res.status(200).json(cursos);
})


export default router;