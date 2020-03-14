import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    BaseEntity,
    JoinColumn,
    ManyToMany,
    OneToMany
} from 'typeorm';
import {Project} from "./project.entity";
import {Task} from "./task.entity";
@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column({ type:"varchar", unique: true, nullable: false })
    email: string;
    @Column({ type: "varchar", nullable: false })
    password: string;
    @Column({ type: "varchar", nullable: false })
    firstName: string;
    @Column({ type: "varchar", nullable: false })
    surname: string;
}
