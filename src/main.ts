import "reflect-metadata";
import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as json from 'koa-json';
import * as bodyparser from 'koa-bodyparser';
import * as logger from 'koa-logger';
import * as cors from "koa2-cors";
import databaseConnection from './database/database.connection';
import initRoutes from './routes'
import { config } from './config';
const app = new Koa();
const routerOpts: Router.IRouterOptions = { prefix: '/api'};
const router = new Router(routerOpts);
const PORT = process.env.PORT || 5000;
// Routes/ Endpoints initialize
initRoutes(router)

// Middlewares
app.use(json())
app.use(logger())
app.use(bodyparser())
app.use(
    cors({
        origin: "*"
    })
);
app.use(router.routes()).use(router.allowedMethods());
databaseConnection.then(() => app.listen(config.port,()=>{
    console.log('Koa Server running on port 3000');
})).catch(console.error);
