import { StoreProduct } from "src/modules/store-products/entities/store-product.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    store_id: number;

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

    @OneToMany(() => StoreProduct, storeProduct => storeProduct.product)
    storeProducts: StoreProduct[];
}
