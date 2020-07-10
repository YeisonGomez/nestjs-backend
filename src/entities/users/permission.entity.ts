import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";

import { UserPermission } from "./userPermission.entity";
import { States } from "../enums/states.enum";

@Entity("permission", { schema: "users" })
@Unique(["key"])
export class Permission {

  @PrimaryGeneratedColumn({ type: "bigint" })
  id: number;

  @Column("character varying", { length: 50 })
  name: string;

  @Column("character varying", { length: 50 })
  key: string;

  @Column("enum", { enum: States, default: States.Active })
  state: States

  @OneToMany(type => UserPermission, userPermission => userPermission.permission)
  users: UserPermission[];
}