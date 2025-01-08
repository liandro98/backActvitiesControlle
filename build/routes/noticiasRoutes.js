"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const noticiasController_1 = require("../controllers/noticiasController");
class NoticiasRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/', noticiasController_1.noticiasController.list);
        this.router.post('/', noticiasController_1.noticiasController.create);
        this.router.put('/:id', noticiasController_1.noticiasController.update);
        this.router.delete('/:id', noticiasController_1.noticiasController.delete);
    }
}
const noticiasRoutes = new NoticiasRoutes();
exports.default = noticiasRoutes.router;
