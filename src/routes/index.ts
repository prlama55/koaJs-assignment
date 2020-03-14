import Router from "koa-router";
import {userList, userCreate} from "../controllers/user.controller";
import {projectCreate, projectList} from "../controllers/project.controller";
import {taskCreate, taskList} from "../controllers/task.controller";
/**
 * All application routes.
 */
const initRoutes=(router: Router)=>{
    router.get('/', async (ctx, next) => {
        ctx.body = 'Welcome';
        await next()
    });

    // User routes
    router.get('/users', userList)
    .post('/users', userCreate)

    // User routes
    router.get('/projects', projectList)
        .post('/projects', projectCreate)

    // User routes
    router.get('/tasks', taskList)
        .post('/tasks', taskCreate)
}
export default initRoutes
