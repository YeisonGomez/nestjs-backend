import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";

import { UserRole } from "./userRole.entity";
import { State } from "../enums/states.enum";

@Entity("role", { schema: "user" })
@Unique(["key"])
export class Role {

  @PrimaryGeneratedColumn({ type: "bigint" })
  id: number;

  @Column("character varying", { length: 50 })
  name: string;

  @Column("character varying", { length: 50 })
  key: string;

  @Column("enum", { enum: State, default: State.Active })
  state: State

  @OneToMany(type => UserRole, userRole => userRole.role)
  users: UserRole[];

}