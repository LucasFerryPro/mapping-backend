import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./User";

@Entity()
export class Poi {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    name: string;

    @Column({ nullable: false })
    latitude: number;

    @Column({ nullable: false })
    longitude: number;

    @Column()
    address: string;

    @OneToMany(() => User, user => user.currentPoI)
    users: User[];

}