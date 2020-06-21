import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { rol } from "./rol";
import { permission } from "./permission";

@Entity("permission_default", { schema: "users" })
export class permissionDefault {

    @PrimaryGeneratedColumn({ type: "bigint" })
    id: number;

    @ManyToOne(type => rol, rol => rol.id, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'fk_rol' })
    rol: rol;

    @ManyToOne(type => permission, permission => permission.id, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'fk_permission' })
    permission: permission;
}