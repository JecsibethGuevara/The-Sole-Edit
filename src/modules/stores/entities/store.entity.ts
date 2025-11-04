import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('stores')
export class Store {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string

    @Column()
    description: string;

    @Column()
    address: string;

    @Column()
    phone: string;

    @Column()
    email: string;

    @Column()
    is_active: Boolean;

    @DeleteDateColumn()
    deleted_at: Date;

    //remember: maybe create the relationship later
    @Column()
    created_by: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
