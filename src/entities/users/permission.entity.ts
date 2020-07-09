import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";

import { UserPermission } from "./userPermission.entity";

@Entity("permission", { schema: "users" })
@Unique(["key"])
export class Permission{

    @PrimaryGeneratedColumn({ type: "bigint" })
    id: number;

    @Column("character varying", { length: 50 })
    name: string;

    @Column("character varying", { length: 50 })
    key: string;

    @OneToMany(type => UserPermission, userPermission => userPermission.permission)
    users: UserPermission[];
}