var express = require("express");
var router = express.Router();
var getRentIndexController = require("../controllers/getRentIndexController");
var validator = require('../helpers/validator');

router.post("/", validator.validateInputRI, getRentIndexController.index);

module.exports = router;
