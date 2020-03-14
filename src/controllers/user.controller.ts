import {Context} from 'koa'
import {User} from '../entities/user.entity'
import {GenericRepository} from "../database/GenericRepository";

export const userList= async (ctx:Context)=>{
    const userRepository = new GenericRepository(User);
    const {pageNumber,pageSize, sortBy, orderBy, ...whereExpression}=ctx.request.query
    const queryBuilder= await userRepository.queryBuilder(ctx,[{...whereExpression}])
    console.log("queryBuilder=====",queryBuilder)
    const [list, count]= await userRepository.list(queryBuilder);
    ctx.body = {
        data: {
            users: list,
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

export const userCreate= async (ctx:Context)=>{
    const userRepository = new GenericRepository(User);
    const userToBeSaved = await userRepository.createEntity(ctx.request.body);
    ctx.body = {
        data: userToBeSaved,
    };
}
