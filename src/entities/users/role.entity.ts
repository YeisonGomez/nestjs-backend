import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";

import { UserRole } from "./userRole.entity";
import { States } from "../enums/states.enum";

@Entity("role", { schema: "users" })
@Unique(["key"])
export class Role {

  @PrimaryGeneratedColumn({ type: "bigint" })
  id: number;

  @Column("character varying", { length: 50 })
  name: string;

  @Column("character varying", { length: 50 })
  key: string;

  @Column("enum", { enum: States, default: States.Active })
  state: States

  @OneToMany(type => UserRole, userRole => userRole.role)
  users: UserRole[];

}