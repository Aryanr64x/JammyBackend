import express from "express";
import { createJam, getJam, getLiveJams, getPublishedJams, publishJam, saveJam, verifyPasskey } from "../controllers/jamController.js";
import { protect } from "../controllers/authController.js";
const jamRouter = express.Router();

jamRouter.post('', protect ,createJam);
jamRouter.get('/live', protect, getLiveJams);
jamRouter.get('/published', protect, getPublishedJams);
jamRouter.get('/published/:id', getJam);
jamRouter.put('/:id/save', protect, saveJam);
jamRouter.put('/:id/publish', protect, publishJam);
jamRouter.post('/:id/verify', protect, verifyPasskey);


export  default  jamRouter;