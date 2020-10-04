import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";

import { UserPermission } from "./userPermission.entity";
import { State } from "../enums/states.enum";

@Entity("permission", { schema: "user" })
@Unique(["key"])
export class Permission {

  @PrimaryGeneratedColumn({ type: "bigint" })
  id: number;

  @Column("character varying", { length: 50 })
  name: string;

  @Column("character varying", { length: 50 })
  key: string;

  @Column("enum", { enum: State, default: State.Active })
  state: State

  @OneToMany(type => UserPermission, userPermission => userPermission.permission)
  users: UserPermission[];
}