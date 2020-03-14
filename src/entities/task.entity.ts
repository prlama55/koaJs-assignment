import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    OneToOne,
    JoinColumn,
    BaseEntity,
    PrimaryColumn, ManyToMany, JoinTable
} from 'typeorm';
import {Project} from './project.entity';
import {User} from './user.entity';
export enum Status{
    active = 'Active',
    inactive = 'Inactive',
    declined = 'Declined',
    completed = 'Completed'
}

@Entity()
export class Task extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column({ type: 'uuid', nullable: false })
    assignerId: string;
    @Column({ type: 'uuid', nullable: false })
    projectId: string;

     @Column({ type: 'varchar', nullable: false })
    taskName: string;

    @Column({ type: 'varchar', nullable: false })
    description: string;
    @Column({ type: 'int', nullable: false })
    score: number;
    @Column({ type: 'enum', nullable: false, enum: Status })
    status: string;
    @ManyToOne(type => Project, project => project.tasks,{primary: true})
    @JoinTable({name: 'project'})
    project: Project

    @OneToOne(type => User)
    @JoinTable({name:'assignerId'})
    assigner: User
    @ManyToMany(type => User, {
        cascade: true
    })
    @JoinTable()
    assignees: User[];
}
