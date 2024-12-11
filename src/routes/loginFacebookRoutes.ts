import { Router } from 'express';
import loginFacebookController from '../controllers/loginFacebookController';

class FacebookAuthRoutes {
    public router: Router = Router();
  
    constructor() {
      this.config();
    }
  
    config(): void {
      // Ruta para iniciar sesión con Facebook
      this.router.post('/', loginFacebookController.loginWithFacebook);
    }
  }
  
  const facebookAuthRoutes = new FacebookAuthRoutes();
  export default facebookAuthRoutes.router;
  