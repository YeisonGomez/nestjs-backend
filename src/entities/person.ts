import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn, ManyToOne, OneToOne } from "typeorm";
import { user } from "./user";
import { language } from "./language";

@Entity("person", { schema: 'users' })
export class person {

    @PrimaryGeneratedColumn({ type: "bigint" })
    id: number;

    @Column("character varying", { length: 50 })
    name: string;

    @Column("character varying", { nullable: true, length: 50 })
    lastname: string;

    @Column("character varying", { nullable: true, length: 15 })
    phone: string;

    @OneToOne(type => user, user => user.person, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'fk_user' })
    user: person;

    @ManyToOne(type => language, language => language.id, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'fk_language' })
    language: language;

}