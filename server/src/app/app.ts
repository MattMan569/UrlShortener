import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';

import { appRouter } from './../routes/appRouter';

export const app = express();

// NOTE: change if server gets https
// Remove the upgrade-insecure-requests header to prevent https resource requests
const { 'upgrade-insecure-requests': discard, ...csp } = helmet.contentSecurityPolicy.getDefaultDirectives();

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            ...csp,
            'default-src': ['\'self\'', 'matthewpolsom.ca'],
        },
    },
}));
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

app.use(express.static(__dirname + './../../client/dist/client'));

app.use(appRouter);

export default app;
