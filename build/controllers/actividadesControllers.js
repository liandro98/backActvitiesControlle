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
exports.actividadesController = void 0;
const database_1 = __importDefault(require("../database"));
class ActividadesController {
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var Estatus;
            Estatus = 'CANCELADA';
            const { idUsuario } = req.params;
            const act = yield database_1.default.query('SELECT a.idActividad, a.Nombre_Actividad, a.Descripcion, u_encargado.nombre AS Encargado, u_participante.nombre AS Participante, est.nombreEstatus AS Estatus, a.Fecha_de_inicio, a.Fecha_de_fin, a.Lugar FROM actividades a LEFT JOIN usuarios u_encargado ON a.Encargado = u_encargado.idUsuario LEFT JOIN usuarios u_participante ON a.Participante = u_participante.idUsuario JOIN estatus est ON a.Estatus = est.nombreEstatus WHERE estatus != ? AND (a.Participante = ? OR a.Encargado = ?)', [Estatus, idUsuario, idUsuario]);
            res.json(act);
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const actividad = req.body;
            // Calcular días y costo
            const fechaInicio = new Date(actividad.Fecha_de_inicio);
            const fechaFin = new Date(actividad.Fecha_de_fin);
            const dias = Math.ceil((fechaFin.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24)) + 1;
            const costo = dias * 10; // El costo por dia es de 10 pesos
            // Calcular fechaReunion (2 días antes de Fecha_de_fin)
            let fechaReunion = new Date(fechaFin);
            fechaReunion.setDate(fechaReunion.getDate() - 1);
            // Validar que no sea domingo
            while (fechaReunion.getDay() === 0) { // 0 es domingo
                fechaReunion.setDate(fechaReunion.getDate() - 1);
            }
            // Formatear fechaReunion como string
            const fechaReunionFormatted = fechaReunion.toISOString().split('T')[0];
            // Insertar con costo calculado y fechaReunion
            actividad.costo = costo;
            actividad.fechaReunion = fechaReunionFormatted;
            yield database_1.default.query('INSERT INTO actividades SET ?', [actividad]);
            res.json({ message: 'Actividad Guardada', costo, fechaReunion: actividad.fechaReunion });
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const actividad = req.body;
            // Calcular días y costo si se actualizan las fechas
            if (actividad.Fecha_de_inicio && actividad.Fecha_de_fin) {
                const fechaInicio = new Date(actividad.Fecha_de_inicio);
                const fechaFin = new Date(actividad.Fecha_de_fin);
                const dias = Math.ceil((fechaFin.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24)) + 1;
                actividad.costo = dias * 10;
            }
            yield database_1.default.query('UPDATE actividades SET ? WHERE idActividad = ?', [actividad, id]);
            res.json({ message: 'La actividad se actualizó', actividad });
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            yield database_1.default.query('UPDATE actividades set Estatus = "CANCELADA" WHERE idActividad = ?', [id]);
            res.json({ message: 'La actividad se eliminó' });
        });
    }
    getMeetingLink(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { idUsuario } = req.params;
                // Obtener la actividad con fecha de reunión igual al día actual, donde el usuario es encargado o participante
                const today = new Date().toISOString().split('T')[0];
                const actividad = yield database_1.default.query(`SELECT a.Nombre_Actividad, a.fechaReunion, u_encargado.idUsuario AS idEncargado, u_participante.idUsuario AS idParticipante 
          FROM actividades a
          LEFT JOIN usuarios u_encargado ON a.Encargado = u_encargado.idUsuario
          LEFT JOIN usuarios u_participante ON a.Participante = u_participante.idUsuario
          WHERE a.fechaReunion = ? AND (u_encargado.idUsuario = ? OR u_participante.idUsuario = ?)`, [today, idUsuario, idUsuario]);
                if (actividad.length > 0) {
                    const enlace = `https://meet.jit.si/${actividad[0].Nombre_Actividad}`;
                    res.json({ enlace });
                }
                else {
                    res.status(404).json({ message: 'No tienes actividades programadas para hoy.' });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Error al obtener el enlace de reunión' });
            }
        });
    }
}
exports.actividadesController = new ActividadesController();
