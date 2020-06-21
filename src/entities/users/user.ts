import { BaseEntity, Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, RelationId, Unique, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { person } from "./person";
import { client } from "./client";
import { userRol } from "./userRol";

@Entity("user", { schema: 'users' })
@Unique(["email"])
export class user {

    @PrimaryGeneratedColumn({ type: "bigint" })
    id: number;

    @Column("character varying", { length: 200 })
    email: string;

    @Column("character varying", { length: 250 })
    password: string;

    @Column("character varying", { length: 100, default: 'active' })
    state: string;

    @Column("character varying", { nullable: true, length: 100 })
    code: string;

    @CreateDateColumn({ type: "timestamp", name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp", name: "updated_at" })
    updatedAt: Date;

    @OneToOne(type => person, person => person.user)
    person: person;

    @OneToOne(type => client, client => client.user)
    client: client;

    @OneToMany(type => userRol, userRol => userRol.user)
    rols: userRol;

}