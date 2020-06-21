import { Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Column, OneToOne, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { user } from "./user";

@Entity("client", { schema: 'users' })
export class client {

    @PrimaryGeneratedColumn({ type: "bigint" })
    id: number;

    @Column("character varying", { length: 100 })
    state: string;

    @Column("character varying", { nullable: true })
    city: string;

    @Column("character varying", { nullable: true })
    country: string;

    @OneToOne(type => user, user => user.client, { nullable: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'fk_user' })
    user: user;

}