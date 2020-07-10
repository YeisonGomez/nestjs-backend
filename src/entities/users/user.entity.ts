import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";

import { Person } from "./person.entity";
import { Client } from "./client.entity";
import { UserRole } from "./userRole.entity";
import { UserPermission } from "./userPermission.entity";
import { States } from "../enums/states.enum";

@Entity("user", { schema: 'users' })
@Unique(["email"])
export class User {

  @PrimaryGeneratedColumn({ type: "bigint" })
  id: number;

  @Column("character varying", { length: 200 })
  email: string;

  @Column("character varying", { length: 250 })
  password: string;

  @Column("enum", { enum: States, default: States.Active })
  state: States;

  @Column("character varying", { nullable: true, length: 100 })
  code: string;

  @CreateDateColumn({ type: "timestamp", name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", name: "updated_at" })
  updatedAt: Date;

  @OneToOne(type => Person, person => person.user)
  person: Person;

  @OneToOne(type => Client, client => client.user)
  client: Client;

  @OneToMany(type => UserRole, userRole => userRole.user)
  roles: UserRole[];

  @OneToMany(type => UserPermission, userPermission => userPermission.user)
  permissions: UserPermission[];

}