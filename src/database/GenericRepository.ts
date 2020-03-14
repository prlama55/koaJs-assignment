import {getRepository, Repository} from "typeorm";
import {Context} from "koa";

export type ObjectType<T> = { new (): T } | Function;
type DynamicHashMap<T, K extends keyof T> = {
    [P in K | 'values']: P extends K ? T[K] : T[]
};

export function makeDynamicHashMap<T, K extends keyof T>(
    key: string,
    value: string
): DynamicHashMap<T, K> {
    return { [key || 'id']: value.toString().toUpperCase() || 'ASC'} as any;
}

export class GenericRepository<T> {
    private repository: Repository<T>;
    constructor(repo: ObjectType<T>) {
        this.repository = getRepository(repo);
    }

    createEntity=async (body: T): Promise<T> =>{
        console.log("body==============",body)
        const toBeSaved:T = this.repository.create(body);
        return  this.repository.save(toBeSaved);
    }

    list=async (filterParams: any): Promise<[T[], number]> =>{
        return await this.repository.findAndCount(filterParams)
    }
    getEntities= async (ids:string[])=>{
        return await this.repository.findByIds(ids)
    }
     getEntity= async (id:string)=>{
        return await this.repository.findOne(id)
    }

    getEntityByQuery= async (query:any): Promise<T>=>{
        return await this.repository.findOne(query)
    }

    queryBuilder= async (ctx: Context, whereExpression: any[]= [],otherExpression:any={})=>{
        let where= {};
        let paging={};
        let order= {}
        if(whereExpression.length>0) where= {where: whereExpression};
        const {pageNumber,pageSize, sortBy, orderBy}=ctx.request.query;
        if(sortBy && orderBy) order= makeDynamicHashMap(sortBy, orderBy);
        if(pageNumber && pageSize) paging={
            skip: pageNumber || 0,
            take: pageSize || 25
        }
console.log("whereExpression==============",whereExpression)
        return {
            ...otherExpression,
            ...where,
            order: order,
            ...paging,
            cache: true
        }
    }
}
