"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const indexRoutes_1 = __importDefault(require("./routes/indexRoutes"));
const actividadesRoutes_1 = __importDefault(require("./routes/actividadesRoutes"));
const histactRoutes_1 = __importDefault(require("./routes/histactRoutes"));
const encargadoRoutes_1 = __importDefault(require("./routes/encargadoRoutes"));
const participantesRoutes_1 = __importDefault(require("./routes/participantesRoutes"));
const estatusRouters_1 = __importDefault(require("./routes/estatusRouters"));
const usuarioRoutes_1 = __importDefault(require("./routes/usuarioRoutes"));
const rolUserRouter_1 = __importDefault(require("./routes/rolUserRouter"));
const loginRoutes_1 = __importDefault(require("./routes/loginRoutes"));
const editaractRouter_1 = __importDefault(require("./routes/editaractRouter"));
const loginFacebookRoutes_1 = __importDefault(require("./routes/loginFacebookRoutes"));
const noticiasRoutes_1 = __importDefault(require("./routes/noticiasRoutes"));
const twitter_api_v2_1 = require("twitter-api-v2");
const crypto = __importStar(require("crypto"));
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.config();
        this.routes();
        this.twitterClient = new twitter_api_v2_1.TwitterApi({
            appKey: 'J4EiM0O758AUc8a1uSxLy4xj7',
            appSecret: '3YslN57mH2Njzm4yv8j1x2u0nAL5KPT5OMamyHJheA47VvhDNY',
            accessToken: '1880213530512879620-BpGKV6eDHgFjAxgmdCAXGRxFb3aAcF',
            accessSecret: 'KJPN1rNrdcn7V375ZXXU9p9IZY66QYrwdO8DXbjsF6WXw',
        });
    }
    config() {
        this.app.set('port', process.env.PORT || 3000);
        this.app.use((0, morgan_1.default)('dev'));
        this.app.use((0, cors_1.default)());
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: false }));
    }
    routes() {
        this.app.use(indexRoutes_1.default);
        this.app.use('/api/actividades', actividadesRoutes_1.default);
        this.app.use('/api/histact', histactRoutes_1.default);
        this.app.use('/api/user', usuarioRoutes_1.default);
        this.app.use('/api/rol', rolUserRouter_1.default);
        this.app.use('/api/add', encargadoRoutes_1.default);
        this.app.use('/api/add2', participantesRoutes_1.default);
        this.app.use('/api/add3', estatusRouters_1.default);
        this.app.use('/api/login', loginRoutes_1.default);
        this.app.use('/api/login/facebook', loginFacebookRoutes_1.default);
        this.app.use('/api/editact', editaractRouter_1.default);
        this.app.use('/api/noticias', noticiasRoutes_1.default);
        this.app.use('/api/twitter', this.twitterRoutes());
        // Endpoint para eliminar los datos de usuario (facebook)
        this.app.post('/delete-user-data', this.handleDeleteUserData);
    }
    // Ruta para interactuar con Twitter
    twitterRoutes() {
        const router = express_1.default.Router();
        router.post('/send-tweet', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { tweet } = req.body; // Texto del tweet enviado desde el cliente
            if (!tweet || typeof tweet !== 'string') {
                return res.status(400).json({ message: 'El tweet es requerido y debe ser una cadena de texto.' });
            }
            try {
                const tweetResponse = yield this.twitterClient.v2.tweet(tweet);
                res.json({ message: 'Tweet enviado con éxito.', tweetResponse });
            }
            catch (error) {
                console.error('Error al enviar el tweet:', error);
                res.status(500).json({ message: 'Error al enviar el tweet.', error });
            }
        }));
        return router;
    }
    // Manejo de solicitudes para eliminar los datos
    handleDeleteUserData(req, res) {
        const APP_SECRET = '2109528189485154';
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
        res.json({
            url: 'https://mi-app.com/delete-confirmation',
            confirmation_code: '123456'
        });
    }
    start() {
        this.app.listen(this.app.get('port'), () => {
            console.log("Server on Port", this.app.get('port'));
        });
    }
}
const server = new Server();
server.start();
