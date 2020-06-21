import { BaseEntity, Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, RelationId } from "typeorm";
import { States } from '../enums/states'
import { user } from "./user";
import { permission } from "./permission";

@Entity("user_permission", { schema: "users" })
export class userPermission {

    @PrimaryGeneratedColumn({ type: "bigint" })
    id: number;

    @Column({ type: "enum", enum: States, default: States.Active })
    state!: States;

    @ManyToOne(type => user, user => user.id, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'fk_user' })
    user: user;

    @ManyToOne(type => permission, permission => permission.id, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'fk_permission' })
    permission: permission;
}