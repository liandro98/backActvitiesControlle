import {Request, Response} from 'express';
import pool from '../database'

interface Usuario {
    idUsuario?: number; // Opcional al crear
    nombre: string;
    correo: string;
    contrasena: string | null;
    telefono: string | null;
    nombreRol: string;
  }

  class LoginFacebookController {
    async loginWithFacebook(req: Request, res: Response) {
      const { facebookId, name, email } = req.body;
  
      if (!facebookId || !email) {
        return res.status(400).json({ message: 'Datos incompletos' });
      }
  
      try {
        // Verificar si el usuario ya existe
        const user = await pool.query('SELECT * FROM usuarios WHERE correo = ?', [email]);
  
        if (user.length > 0) {
          // Si el usuario existe, loguearlo
          return res.json({ message: 'Login exitoso', user: user[0] });
        } else {
          // Si el usuario no existe, registrarlo
          const newUser: Usuario = {
            nombre: name,
            correo: email,
            contrasena: null, // Sin contraseña porque usa Facebook
            telefono: null,
            nombreRol: 'PARTICIPANTE', // Ajusta según sea necesario
          };
  
          const result = await pool.query('INSERT INTO usuarios SET ?', [newUser]);
          newUser.idUsuario = result.insertId; // Asignar idUsuario después del registro
  
          return res.json({ message: 'Registro exitoso', user: newUser });
        }
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor' });
      }
    }
  }
  
  export const loginFacebookController = new LoginFacebookController();
  export default loginFacebookController;
  