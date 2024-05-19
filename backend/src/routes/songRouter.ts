import express from "express";
import {
  getAllSongs,
  createSong,
  getMetadataFromSongId,
  deleteSong,
} from "../controllers/songController";

//middleware
import { requireAuth } from "../middlewares/requireAuth";
import checkIsManager from "../middlewares/checkIsManager";
import { multerSongUploader } from "../cloudinary";

const router = express.Router();
//For managers
//Exclude use requierAuth on createSong. checkIsManager is enough
router.post("/", checkIsManager, multerSongUploader, createSong);
router.get("/delete/:song_id", checkIsManager, deleteSong);

//For normal users
router.use(requireAuth);
router.get("/all", getAllSongs);
router.get("/:song_id", getMetadataFromSongId);

export default router;
