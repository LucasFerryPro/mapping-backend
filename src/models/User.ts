import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Poi} from "./Poi";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    firstname: string;

    @Column({ nullable: false })
    lastname: string;

    @Column({ nullable: true })
    job: string;

    @Column({ nullable: true })
    phone: string;

    @Column({ nullable: true })
    linkedin: string;

    @ManyToOne(() => Poi, poi => poi.users)
    currentPoI: Poi;

}