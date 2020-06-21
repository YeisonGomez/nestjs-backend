import { BaseEntity, Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, RelationId } from "typeorm";
import { States } from '../enums/states'
import { user } from "./user";
import { rol } from "./rol";

@Entity("user_rol", { schema: "users" })
export class userRol {

    @PrimaryGeneratedColumn({ type: "bigint" })
    id: number;

    @Column({ type: "enum", enum: States, default: States.Active })
    state!: States;

    @ManyToOne(type => user, user => user.id, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'fk_user' })
    user: user;

    @ManyToOne(type => rol, rol => rol.id, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'fk_rol' })
    rol: rol;
}