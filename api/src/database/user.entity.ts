import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn() Id!: number;

    @Column({ length: 32 }) name!: string;

    @Column({ unique: true }) email!: string;

    @Column() password!: string;
}