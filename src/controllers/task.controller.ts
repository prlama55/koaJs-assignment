import {Context} from 'koa'
import {Task} from '../entities/task.entity'
import {GenericRepository} from "../database/GenericRepository";
import {User} from "../entities/user.entity";
import {Project} from "../entities/project.entity";
import {In, MoreThanOrEqual} from "typeorm";

export const taskList= async (ctx:Context)=>{
    const taskRepository = new GenericRepository(Task);
    const userRepository = new GenericRepository(User);

    const {pageNumber,pageSize, sortBy, orderBy}=ctx.request.query
    const {status, score, assigner, ...otherFilterParams}=ctx.request.body
    let user:User
    let whereExpression=[]
    if(assigner) {
        user= await userRepository.getEntityByQuery(assigner)
    }

    if(user)  whereExpression.push({assignerId: user.id})
    let checkStatus={}
    if(status) checkStatus={status:In(status)}
    if(score) checkStatus={...checkStatus, score:MoreThanOrEqual(4)}
    const relations={
        relations: ["assignees"],
        ...checkStatus
    }
    if(otherFilterParams) whereExpression.push({...otherFilterParams})
    const queryBuilder= await taskRepository.queryBuilder(ctx,whereExpression, relations)
    const [list, count]= await taskRepository.list(queryBuilder);
    ctx.body = {
        data: {
            tasks: list,
            paging:{
                totalRecords: count,
                pageNumber: pageNumber,
                pageSize: pageSize
            },
            order: {
                sortBy: sortBy,
                orderBy: orderBy
            }
        }
    };
}

export const taskCreate= async (ctx:Context)=>{
    const {assignerId, projectId, assignees, ...otherDataBody}=ctx.request.body
    const userRepository = new GenericRepository(User);
    const projectRepository = new GenericRepository(Project);
    const project=await projectRepository.getEntity(projectId)
    const taskAssignees=await userRepository.getEntities(assignees)
    const tasks: Task={
        ...otherDataBody,
        assignees:taskAssignees,
        assignerId: assignerId,
        projectId: projectId
    }
    const taskRepository = new GenericRepository(Task);
    const projectToBeSaved = await taskRepository.createEntity(tasks);
    ctx.body = {
        data: projectToBeSaved,
    };
}

