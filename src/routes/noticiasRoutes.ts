import { Router } from 'express';
import { noticiasController } from '../controllers/noticiasController';

class NoticiasRoutes {
  public router: Router = Router();

  constructor() {
    this.config();
  }

  config(): void {
    this.router.get('/', noticiasController.list);
    this.router.post('/', noticiasController.create);
    this.router.put('/:id', noticiasController.update);
    this.router.delete('/:id', noticiasController.delete);
  }
}

const noticiasRoutes = new NoticiasRoutes();
export default noticiasRoutes.router;
