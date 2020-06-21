import { BaseEntity, Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, RelationId, Unique } from "typeorm";
import { userPermission } from "./userPermission";

@Entity("permission", { schema: "users" })
@Unique(["key"])
export class permission{

    @PrimaryGeneratedColumn({ type: "bigint" })
    id: number;

    @Column("character varying", { length: 50 })
    name: string;

    @Column("character varying", { length: 50 })
    key: string;

    @OneToMany(type => userPermission, userPermission => userPermission.permission)
    users: userPermission;

    constructor({ id = undefined, name = '', key = ''} = {}) {
        this.id = id;
        this.name = name;
        this.key = key;
    }
}