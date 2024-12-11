"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const loginFacebookController_1 = __importDefault(require("../controllers/loginFacebookController"));
class FacebookAuthRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        // Ruta para iniciar sesión con Facebook
        this.router.post('/', loginFacebookController_1.default.loginWithFacebook);
    }
}
const facebookAuthRoutes = new FacebookAuthRoutes();
exports.default = facebookAuthRoutes.router;
