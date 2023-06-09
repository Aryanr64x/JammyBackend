import express from "express";
import { createJam, getLiveJams, getPublishedJams, publishJam, saveJam } from "../controllers/jamController.js";
import { protect } from "../controllers/authController.js";
const jamRouter = express.Router();

jamRouter.post('', protect ,createJam)
jamRouter.get('/live', protect, getLiveJams)
jamRouter.get('/published', protect, getPublishedJams)
jamRouter.put('/:id/save', protect, saveJam);
jamRouter.put('/:id/publish', protect, publishJam);


export  default  jamRouter;