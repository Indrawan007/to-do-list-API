const express = require("express");
const { getAll, createNotes } = require("../controller/notes.js");

const router = express.Router();

router.get('/', getAll);
router.get('/', createNotes);

module.exports = router;