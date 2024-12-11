import express,{Application,Request,Response} from 'express';
import morgan from 'morgan';
import cors from 'cors';
import indexRoutes from './routes/indexRoutes';
import actividadesRoutes from './routes/actividadesRoutes';
import HistActRoutes from './routes/histactRoutes';
import encargadoRoutes from './routes/encargadoRoutes';
import participanteRotes from './routes/participantesRoutes';
import estatusRouters from './routes/estatusRouters';
import usuarioRoutes from './routes/usuarioRoutes';
import rolUserRouter from './routes/rolUserRouter';
import loginRoutes from './routes/loginRoutes';
import editaractRouter from './routes/editaractRouter';
import facebookAuthRoutes from './routes/loginFacebookRoutes';
import * as crypto from 'crypto';
class Server{
    public app : Application

    constructor(){
        this.app = express();
        this.config();
        this.routes();
    }


    config():void{
        this.app.set('port',process.env.PORT || 3000);
        this.app.use(morgan('dev'));
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended:false}));
    }
    routes():void{
        this.app.use(indexRoutes);
        this.app.use('/api/actividades',actividadesRoutes);
        this.app.use('/api/histact',HistActRoutes);
        this.app.use('/api/user',usuarioRoutes);
        this.app.use('/api/rol',rolUserRouter);
        this.app.use('/api/add',encargadoRoutes);
        this.app.use('/api/add2',participanteRotes);
        this.app.use('/api/add3',estatusRouters);
        this.app.use('/api/login',loginRoutes)
        this.app.use('/api/login/facebook', facebookAuthRoutes)
        this.app.use('/api/editact',editaractRouter)

        // Endpoint para eliminar los datos de usuario (facebook)
        this.app.post('/delete-user-data', this.handleDeleteUserData);
    }

    // Manejo de solicitudes para eliminar los datos
    handleDeleteUserData(req: Request, res:Response): void{
        const APP_SECRET = '2109528189485154'

        const signedRequest = req.body.signed_request;

        if (!signedRequest) {
            res.status(400).json({ error: 'Solicitud no válida' });
            return;
        }

        // Separar firma y datos
        const [encodedSig, payload] = signedRequest.split('.');
        const sig = Buffer.from(encodedSig, 'base64').toString('hex');
        const data = JSON.parse(Buffer.from(payload, 'base64').toString());

        // Validar firma
        const expectedSig = crypto
            .createHmac('sha256', APP_SECRET)
            .update(payload)
            .digest('hex');

        if (sig !== expectedSig) {
            res.status(400).json({ error: 'Firma inválida' });
            return;
        }

        const userId = data.user_id;

        console.log(`Eliminar datos de usuario con ID: ${userId}`);

        // Lógica para eliminar datos de usuario aquí (base de datos, etc.)

        res.json({
            url: 'https://mi-app.com/delete-confirmation', // URL para confirmar la eliminación.
            confirmation_code: '123456' // Código único para la solicitud.
        });
    }


    start():void{
        this.app.listen(this.app.get('port'), ()=>{
            console.log("Server on Port",this.app.get('port'))
        });
    }

}
const server = new Server();
server.start();