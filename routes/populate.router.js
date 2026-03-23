import { Router } from "express";
import { UserModel } from "../config/models/user.model.js";

const router = Router();

/* Demo de populate */
router.get("/demo", async (req, res) => {
    const users = await UserModel.find().populate("products");
    res.status(200).json(users);
});

export default router;
