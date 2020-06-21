import { BaseEntity, Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, RelationId, Unique } from "typeorm";
import { userRol } from "./userRol";

@Entity("rol", { schema: "users" })
@Unique(["key"])
export class rol {

    @PrimaryGeneratedColumn({ type: "bigint" })
    id: number;
  
    @Column("character varying", { length: 50 })
    name: string;

    @Column("character varying", { length: 50 })
    key: string;

    @OneToMany(type => userRol, userRol => userRol.rol)
    users: userRol;

    constructor({ id = undefined, name = '', key = ''} = {}) {
        this.id = id;
        this.name = name;
        this.key = key;
    }
}