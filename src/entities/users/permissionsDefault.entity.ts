import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Column } from "typeorm";

import { Role } from "./role.entity";
import { Permission } from "./permission.entity";
import { States } from "../enums/states.enum";

@Entity("permission_default", { schema: "users" })
export class PermissionDefault {

  @PrimaryGeneratedColumn({ type: "bigint" })
  id: number;

  @Column("enum", { enum: States, default: States.Active })
  state: States

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