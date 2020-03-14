import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    OneToOne,
    JoinColumn,
    BaseEntity,
    ManyToMany,
    JoinTable
} from 'typeorm';
import {Task} from './task.entity';
import {User} from './user.entity';
export enum Status{
    active = 'Active',
    inactive = 'Inactive',
    declined = 'Declined',
    completed = 'Completed'
}

@Entity()
export class Project {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid', nullable: false })
    assignerId: string;

    @Column({ type: 'varchar', nullable: false })
    projectName: string;
    @Column({ type: 'text', nullable: false })
    body: string;
    @Column({ type: 'enum', nullable: false, enum: Status })
    status: string;

    @OneToMany(type => Task, task => task.project, {cascade: true})
    @JoinTable()
    tasks: Task[];

    @OneToOne(type => User)
    @JoinTable({name:'assignerId'})
    assigner: User

    @ManyToMany(type => User, {cascade: true})
    @JoinTable()
    assignees: User[];
}
