import { Router } from 'express';
import appController from './controllers/appController';

export const appRouter = Router();

appRouter.get('/', appController.root);
appRouter.get('/url/:id', appController.information);
appRouter.get('/:id', appController.redirect);

appRouter.post('/url', appController.createUrl);

export default appRouter;
