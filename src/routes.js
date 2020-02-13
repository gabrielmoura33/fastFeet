import { Router } from 'express';
import multer from 'multer';
import multerconfig from './config/multer';
import UserController from './app/controllers/UserController';

import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import DeliveryManController from './app/controllers/DeliveryManController';
import FileController from './app/controllers/FileController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const uploads = multer(multerconfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

// List of Functions availables only for Administrators
routes.use(authMiddleware);
routes.post('/recipient', RecipientController.store);

routes.get('/deliveryman', DeliveryManController.index);

routes.post('/files', uploads.single('file'), FileController.store);
export default routes;
