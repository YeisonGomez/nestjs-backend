import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { Person } from "./person.entity";
import { States } from "../enums/states.enum";

@Entity("language", { schema: "users" })
export class Language {

  @PrimaryGeneratedColumn({ type: "bigint" })
  id: number;

  @Column("character varying", { nullable: true, length: 50 })
  name: string;

  @Column("character varying", { nullable: true, length: 50 })
  key: string;

  @Column("enum", { enum: States, default: States.Active })
  state: States

  @OneToMany(type => Person, person => person.language)
  persons: Person[];
}