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
exports.noticiasController = void 0;
const database_1 = __importDefault(require("../database"));
class NoticiasController {
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const noticias = yield database_1.default.query('SELECT * FROM noticias');
            res.json(noticias);
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { titulo, descripcion, contenido, autor, fecha } = req.body;
            if (!titulo || !descripcion || !contenido || !autor || !fecha) {
                res.status(400).json({ message: 'Todos los campos son obligatorios.' });
                return;
            }
            yield database_1.default.query('INSERT INTO noticias SET ?', [req.body]);
            res.json({ message: 'Noticia creada correctamente.' });
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { titulo, descripcion, contenido, autor, fecha } = req.body;
            if (!titulo || !descripcion || !contenido || !autor || !fecha) {
                res.status(400).json({ message: 'Todos los campos son obligatorios.' });
                return;
            }
            yield database_1.default.query('UPDATE noticias SET ? WHERE idNoticia = ?', [req.body, id]);
            res.json({ message: 'Noticia actualizada correctamente.' });
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            yield database_1.default.query('DELETE FROM noticias WHERE idNoticia = ?', [id]);
            res.json({ message: 'Noticia eliminada correctamente.' });
        });
    }
}
exports.noticiasController = new NoticiasController();
