"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginFacebookController = void 0;
const database_1 = __importDefault(require("../database"));
class LoginFacebookController {
    loginWithFacebook(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { facebookId, name, email } = req.body;
            if (!facebookId || !email) {
                return res.status(400).json({ message: 'Datos incompletos' });
            }
            try {
                // Verificar si el usuario ya existe
                const user = yield database_1.default.query('SELECT * FROM usuarios WHERE correo = ?', [email]);
                if (user.length > 0) {
                    // Si el usuario existe, loguearlo
                    return res.json({ message: 'Login exitoso', user: user[0] });
                }
                else {
                    // Si el usuario no existe, registrarlo
                    const newUser = {
                        nombre: name,
                        correo: email,
                        contrasena: null, // Sin contraseña porque usa Facebook
                        telefono: null,
                        nombreRol: 'PARTICIPANTE', // Ajusta según sea necesario
                    };
                    const result = yield database_1.default.query('INSERT INTO usuarios SET ?', [newUser]);
                    newUser.idUsuario = result.insertId; // Asignar idUsuario después del registro
                    return res.json({ message: 'Registro exitoso', user: newUser });
                }
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({ message: 'Error en el servidor' });
            }
        });
    }
}
exports.loginFacebookController = new LoginFacebookController();
exports.default = exports.loginFacebookController;
