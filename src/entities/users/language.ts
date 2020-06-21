import { BaseEntity, Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, RelationId } from "typeorm";
import { person } from "./person";

@Entity("language", { schema: "users" })
export class language {

    @PrimaryGeneratedColumn({ type: "bigint" })
    id: number;
  
    @Column("character varying", { nullable: true, length: 50 })
    name: string;

    @Column("character varying", { nullable: true, length: 50 })
    key: string;

    @OneToMany(type => person, person => person.language)
    person: person;
}