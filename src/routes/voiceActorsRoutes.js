const express = require("express");
const router = express.Router();
const voiceActorController = require("../controllers/voiceActorController");


router.post("/", voiceActorController.addVoiceActor);
router.get("/", voiceActorController.getAllVoiceActors);
router.get("/:id", voiceActorController.getVoiceActorById);
router.put("/:id", voiceActorController.updateVoiceActor);
router.delete("/:id", voiceActorController.deleteVoiceActor);

module.exports = router;
