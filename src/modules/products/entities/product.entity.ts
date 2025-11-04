import { Column, CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string

    @Column()
    description: string;

    @Column()
    category: string;

    @Column()
    brand: string;

    @Column()
    image_url: string;

    @Column()
    is_active: Boolean;

    //remember: maybe create the relationship later
    @Column()
    created_by: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
