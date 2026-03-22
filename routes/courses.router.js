import { Router } from "express";
import { Curso } from "../config/models/curso.model.js";
import { UserModel } from "../config/models/user.model.js";


const router = Router();

/* Obtener todos los cursos */
router.get("/", async (req, res) => {
    const cursos = await Curso.find();
    res.status(200).json({ cursos: cursos });
});


router.post("/", async (req, res) => {
    try {
        const newCourse = await Curso.create(req.body);
        res.status(201).json({ message: "Curso creado exitosamente", curso: newCourse });
        } catch (err) {
            return res.status(500).json({ error: "Error interno del servidor", message: err.message });
        }   
})


/* Agregar un estudiante a un curso */
router.post("/:courseId/inscription/:studentId", async (req, res) => {
    try {
        const curso = await Curso.findById(req.params.courseId);
        const alumno = await UserModel.findById(req.params.studentId);

        if (!curso || !alumno) {
            return res.status(404).json({ error: "Curso o Alumno no encontrado" });
        }

        if (curso.students.includes(alumno._id)) {
            return res.status(400).json({ error: `El alumno con ${alumno.name} ya está inscrito en el curso: ${curso.name}` });
        }

        curso.students.push(alumno._id);
        await curso.save();

        res.status(201).json({ message: `Alumno ${alumno.name} agregado al curso ${curso.title} exitosamente`, curso: curso });

    } catch (err) {
        return res.status(500).json({ error: "Error interno del servidor", message: err.message });
    }
})


/* Desinscribir un estudiante de un curso */
router.delete('/:courseId/desinscription/:studentId', async (req, res) => {
    try {
        const curso = await Curso.findById(req.params.courseId);

        if (!curso) {
            return res.status(404).json({ error: "Curso no encontrado" })
        }

        curso.students = curso.students.filter(
            (id) => id.toString() !== req.params.studentId
        )

        await curso.save();

        res.status(200).json({ message: `El Alumno fue desinscrito del curso ${curso.title} correctamente` })
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


/* Eliminar un curso */
router.delete('/:courseId', async (req, res) => {
    try {
        const curso = await Curso.findByIdAndDelete(req.params.courseId);

        if (!curso) {
            return res.status(404).json({ error: "Curso no encontrado" });
        }

        res.status(204).end();

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


export default router;