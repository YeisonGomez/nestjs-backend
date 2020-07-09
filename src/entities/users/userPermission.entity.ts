import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { States } from '../enums/states.enum'
import { User } from "./user.entity";
import { Permission } from "./permission.entity";

@Entity("user_permission", { schema: "users" })
export class UserPermission {

  @PrimaryGeneratedColumn({ type: "bigint" })
  id: number;

  @Column({ type: "enum", enum: States, default: States.Active })
  state: States;

  @ManyToOne(
    type => User, 
    user => user.id, 
    { onDelete: 'CASCADE', onUpdate: 'CASCADE' }
  )
  @JoinColumn({ name: 'fk_user' })
  user: User;

  @ManyToOne(
    type => Permission, 
    permission => permission.id, 
    { onDelete: 'CASCADE', onUpdate: 'CASCADE' }
  )
  @JoinColumn({ name: 'fk_permission' })
  permission: Permission;
}