import { Router } from 'express';
import multer from 'multer';
import multerconfig from './config/multer';
import UserController from './app/controllers/UserController';

import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import DeliverieController from './app/controllers/DeliverieController';
import DeliveryManController from './app/controllers/DeliveryManController';
import SignatureController from './app/controllers/SignatureController';
import FileController from './app/controllers/FileController';
import DeliveryProblemsController from './app/controllers/DeliveryProblemsController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const uploads = multer(multerconfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

// List of Functions availables for deliverymans

routes.post(
  '/signature',
  uploads.single('signature'),
  SignatureController.store
);
// List of Functions availables only for Administrators
routes.use(authMiddleware);
routes.post('/recipient', RecipientController.store);
routes.get('/deliveryman', DeliveryManController.index);
routes.post('/deliveryman', DeliveryManController.store);
routes.put('/deliveryman/:id', DeliveryManController.update);
routes.delete('/deliveryman/:id', DeliveryManController.destroy);

routes.get('/deliveryman/:deliveryman_id/deliveries', DeliverieController.show);
routes.post(
  '/deliveryman/:deliveryman_id/deliveries',
  DeliverieController.store
);
routes.put(
  '/deliveryman/:deliveryman_id/deliveries',
  DeliverieController.update
);
routes.delete('/delivery', DeliverieController.destroy);
routes.post('/files', uploads.single('file'), FileController.store);

routes.post(
  '/delivery/:deliveryman_id/problems',
  DeliveryProblemsController.store
);

routes.get('/delivery/:delivery_id/problems', DeliveryProblemsController.show);

routes.delete(
  '/problem/:problem_id/cancel-delivery',
  DeliveryProblemsController.destroy
);
export default routes;
