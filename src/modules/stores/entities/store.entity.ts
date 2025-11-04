import { StoreProduct } from "src/modules/store-products/entities/store-product.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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

    @OneToMany(() => StoreProduct, storeProduct => storeProduct.store)
    storeProducts: StoreProduct[];
}
