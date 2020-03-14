import {Context} from 'koa'
import {Project} from "../entities/project.entity";
import {GenericRepository} from "../database/GenericRepository";
import {User} from "../entities/user.entity";
import {In} from "typeorm";

export const projectList= async (ctx:Context)=>{
    const userRepository = new GenericRepository(User);
    const projectRepository = new GenericRepository(Project);
    const {pageNumber,pageSize, sortBy, orderBy}=ctx.request.query
    const {status, assigner, ...otherFilterParams}=ctx.request.body
    let user:User
    let whereExpression=[]
    if(assigner) user= await userRepository.getEntityByQuery(assigner)

    if(user)  whereExpression.push({assignerId: user.id})
    let checkStatus={}
    if(status) checkStatus={status:In(status)}
    if(otherFilterParams) whereExpression.push({...otherFilterParams})
    const relations={
        relations: ["assignees", "tasks"],
        ...checkStatus
    }
    const queryBuilder= await projectRepository.queryBuilder(ctx,whereExpression, relations)
    console.log("queryBuilder=====",queryBuilder)
    const [list, count]= await projectRepository.list(queryBuilder);
    ctx.body = {
        data: {
            projects: list,
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

export const projectCreate= async (ctx:Context)=>{
    const userRepository = new GenericRepository(User);
    const {assignerId, assignees, ...otherDataBody}=ctx.request.body
    const projectAssignees=await userRepository.getEntities(assignees)
    const project: Project={
        ...otherDataBody,
        assignees:projectAssignees,
        assignerId: assignerId
    }
    const projectRepository = new GenericRepository(Project);
    const projectToBeSaved = await projectRepository.createEntity(project);
    ctx.body = {
        data: projectToBeSaved,
    };
}

