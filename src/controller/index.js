"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var submissions_1 = require("./submissions");
var router = express_1.default.Router();
router.use('/submissions', submissions_1.default);
exports.default = router;
