import {Request, Response} from 'express';
import pool from '../database'
 class ActividadesController{
  
    public async  list (req: Request, res: Response): Promise<void>{
      var Estatus:string;
      Estatus = 'CANCELADA';
      const { idUsuario } = req.params;
      const act = await pool.query('SELECT a.idActividad, a.Nombre_Actividad, a.Descripcion, u_encargado.nombre AS Encargado, u_participante.nombre AS Participante, est.nombreEstatus AS Estatus, a.Fecha_de_inicio, a.Fecha_de_fin, a.Lugar FROM actividades a LEFT JOIN usuarios u_encargado ON a.Encargado = u_encargado.idUsuario LEFT JOIN usuarios u_participante ON a.Participante = u_participante.idUsuario JOIN estatus est ON a.Estatus = est.nombreEstatus WHERE estatus != ? AND (a.Participante = ? OR a.Encargado = ?)', [Estatus, idUsuario, idUsuario]);
       res.json(act);
    }

  public async create(req: Request, res: Response): Promise<void> {
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
    await pool.query('INSERT INTO actividades SET ?', [actividad]);
    res.json({ message: 'Actividad Guardada', costo , fechaReunion: actividad.fechaReunion });
  }

  public async update(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const actividad = req.body;

    // Calcular días y costo si se actualizan las fechas
    if (actividad.Fecha_de_inicio && actividad.Fecha_de_fin) {
      const fechaInicio = new Date(actividad.Fecha_de_inicio);
      const fechaFin = new Date(actividad.Fecha_de_fin);
      const dias = Math.ceil((fechaFin.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      actividad.costo = dias * 10;
    }

    await pool.query('UPDATE actividades SET ? WHERE idActividad = ?', [actividad, id]);
    res.json({ message: 'La actividad se actualizó', actividad });
  }

    public async delete(req: Request, res: Response): Promise<void>{
      const { id } = req.params;
      await pool.query('UPDATE actividades set Estatus = "CANCELADA" WHERE idActividad = ?', [id]); 
      res.json({ message: 'La actividad se eliminó' });
    }

    public async getMeetingLink(req: Request, res: Response): Promise<void> {
      try {
        const { idUsuario } = req.params;
    
        // Obtener la actividad con fecha de reunión igual al día actual, donde el usuario es encargado o participante
        const today = new Date().toISOString().split('T')[0];
        const actividad = await pool.query(
          `SELECT a.Nombre_Actividad, a.fechaReunion, u_encargado.idUsuario AS idEncargado, u_participante.idUsuario AS idParticipante 
          FROM actividades a
          LEFT JOIN usuarios u_encargado ON a.Encargado = u_encargado.idUsuario
          LEFT JOIN usuarios u_participante ON a.Participante = u_participante.idUsuario
          WHERE a.fechaReunion = ? AND (u_encargado.idUsuario = ? OR u_participante.idUsuario = ?)`,
          [today, idUsuario, idUsuario]
        );
    
        if (actividad.length > 0) {
          const enlace = `https://meet.jit.si/${actividad[0].Nombre_Actividad}`;
          res.json({ enlace });
        } else {
          res.status(404).json({ message: 'No tienes actividades programadas para hoy.' });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener el enlace de reunión' });
      }
    }
    
  }
 
 export const actividadesController = new ActividadesController();