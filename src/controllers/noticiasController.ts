import { Request, Response } from 'express';
import pool from '../database';

class NoticiasController {
  public async list(req: Request, res: Response): Promise<void> {
    const noticias = await pool.query('SELECT * FROM noticias');
    res.json(noticias);
  }

  public async create(req: Request, res: Response): Promise<void> {
    const { titulo, descripcion, contenido, autor, fecha } = req.body;
    if (!titulo || !descripcion || !contenido || !autor || !fecha) {
      res.status(400).json({ message: 'Todos los campos son obligatorios.' });
      return;
    }
    await pool.query('INSERT INTO noticias SET ?', [req.body]);
    res.json({ message: 'Noticia creada correctamente.' });
  }

  public async update(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { titulo, descripcion, contenido, autor, fecha } = req.body;
    if (!titulo || !descripcion || !contenido || !autor || !fecha) {
      res.status(400).json({ message: 'Todos los campos son obligatorios.' });
      return;
    }
    await pool.query('UPDATE noticias SET ? WHERE idNoticia = ?', [req.body, id]);
    res.json({ message: 'Noticia actualizada correctamente.' });
  }

  public async delete(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    await pool.query('DELETE FROM noticias WHERE idNoticia = ?', [id]);
    res.json({ message: 'Noticia eliminada correctamente.' });
  }
}

export const noticiasController = new NoticiasController();
