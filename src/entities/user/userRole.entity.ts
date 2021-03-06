import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { User } from "./user.entity";
import { Role } from "./role.entity";
import { State } from '../enums/states.enum'

@Entity("user_role", { schema: "user" })
export class UserRole {

  @PrimaryGeneratedColumn({ type: "bigint" })
  id: number;

  @Column({ type: "enum", enum: State, default: State.Active })
  state: State;

  @ManyToOne(
    type => User, 
    user => user.id, 
    { onDelete: 'CASCADE', onUpdate: 'CASCADE' }
  )
  @JoinColumn({ name: 'fk_user' })
  user: User;

  @ManyToOne(
    type => Role, 
    role => role.id, 
    { onDelete: 'CASCADE', onUpdate: 'CASCADE' }
  )
  @JoinColumn({ name: 'fk_role' })
  role: Role;
}