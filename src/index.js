"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("module-alias/register");
var express_1 = require("express");
var cors_1 = require("cors");
var dotenv_1 = require("dotenv");
var controller_1 = require("@/controller");
dotenv_1.default.config();
var app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use('/', controller_1.default);
var port = 3000;
app.listen(port, function () {
    console.log("Example app listening on port ".concat(port));
});
