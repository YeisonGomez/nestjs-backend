import { Column, Entity, JoinColumn, PrimaryGeneratedColumn, OneToOne } from "typeorm";

import { User } from "./user.entity";

@Entity("person", { schema: 'user' })
export class Person {

  @PrimaryGeneratedColumn({ type: "bigint" })
  id: number;

  @Column("character varying", { length: 50 })
  name: string;

  @Column("character varying", { nullable: true, length: 50 })
  lastname: string;

  @Column("character varying", { nullable: true, length: 15 })
  phone: string;

  @OneToOne(
    type => User, 
    user => user.person, 
    { onDelete: 'CASCADE', onUpdate: 'CASCADE' }
  )
  @JoinColumn({ name: 'fk_user' })
  user: Person;

}