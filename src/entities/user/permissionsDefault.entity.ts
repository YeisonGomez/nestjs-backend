import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Column } from "typeorm";

import { Role } from "./role.entity";
import { Permission } from "./permission.entity";
import { State } from "../enums/states.enum";

@Entity("permission_default", { schema: "user" })
export class PermissionDefault {

  @PrimaryGeneratedColumn({ type: "bigint" })
  id: number;

  @Column("enum", { enum: State, default: State.Active })
  state: State

  @ManyToOne(
    type => Role,
    role => role.id,
    { onDelete: 'CASCADE', onUpdate: 'CASCADE' }
  )
  @JoinColumn({ name: 'fk_rol' })
  role: Role;

  @ManyToOne(
    type => Permission, 
    permission => permission.id, 
    { onDelete: 'CASCADE', onUpdate: 'CASCADE' }
  )
  @JoinColumn({ name: 'fk_permission' })
  permission: Permission;
}