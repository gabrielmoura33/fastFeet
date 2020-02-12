import { Router } from 'express';
import UserController from './app/controllers/UserController';

import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import DeliveryManController from './app/controllers/DeliveryManController';
import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/users', UserController.store);
routes.post('/session', SessionController.store);

//List of Functions availables only for Administrators
routes.use(authMiddleware);
routes.post('/recipient', RecipientController.store);

routes.get('/deliveryman', DeliveryManController.index);
export default routes;
