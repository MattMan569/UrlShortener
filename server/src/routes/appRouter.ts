import { Router } from 'express';
import appController from './controllers/appController';

export const appRouter = Router();

appRouter.get('/', appController.client);
appRouter.get('/:id', appController.redirect);

appRouter.get('/api', appController.apiInformation);
appRouter.get('/api/url/:id', appController.urlInformation);

appRouter.post('/api/url', appController.createUrl);

export default appRouter;
