import {
  Entity,
  JoinColumn, 
  PrimaryGeneratedColumn, 
  Column, 
  OneToOne,
} from "typeorm";

import { User } from "./user.entity";
import { States } from "../enums/states.enum";

@Entity("client", { schema: 'users' })
export class Client {

  @PrimaryGeneratedColumn({ type: "bigint" })
  id: number;

  @Column("enum", { enum: States, default: States.Pending })
  state: States;

  @Column("character varying", { nullable: true })
  city: string;

  @Column("character varying", { nullable: true })
  country: string;

  @OneToOne(
    type => User, 
    user => user.client, 
    { nullable: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' }
  )
  @JoinColumn({ name: 'fk_user' })
  user: User;

}