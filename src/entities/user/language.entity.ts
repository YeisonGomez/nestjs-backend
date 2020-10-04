import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { State } from "../enums/states.enum";
import { User } from "./user.entity";

@Entity("language", { schema: "user" })
export class Language {

  @PrimaryGeneratedColumn({ type: "bigint" })
  id: number;

  @Column("character varying", { nullable: true, length: 50 })
  name: string;

  @Column("character varying", { nullable: true, length: 50 })
  key: string;

  @Column("enum", { enum: State, default: State.Active })
  state: State

  @OneToMany(type => User, user => user.language)
  user: User[];
}