//#region Import
import express, { Express } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import compression from 'compression';
import helmet from 'helmet';
import { AuthenticationRouter } from '../routes/auth/auth.routes';
import { UserRouter } from '../routes/user/user.routes';
import { ProductsRouter } from '../routes/products/products.routes';
import CronConfig from './cron.config';

const { cronStart } = CronConfig();
//#endregion

//#region Configuration

// Const variable
const App: Express = express();

// Compress Bundle
App.use(compression());

// Middle for protection in vulnerabilities
App.use(helmet());

// Use cors
App.use(cors());

// Parse incoming request with json payload
App.use(express.json());

// Get the json payload with Content-Type header
// Preventing to get undefined value in request
App.use(bodyParser.urlencoded({ extended: true }));
App.use(bodyParser.json());

// Run Cron
cronStart();

//#endregion

//#region Routes Config

// Authentication
App.use('/api/authentication', AuthenticationRouter);

// Users
App.use('/api/user', UserRouter);

// Products
App.use('/api/products', ProductsRouter);

//#endregion

export default App;
