import { Product } from "src/modules/products/entities/product.entity";
import { Store } from "src/modules/stores/entities/store.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('store_products')
export class StoreProduct {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Store, store => store.storeProducts)
    @JoinColumn({ name: 'store_id' })
    store: Store;

    @ManyToOne(() => Product, product => product.storeProducts)
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @Column()
    price: number

    @Column()
    stock: number;

    @Column()
    is_available: boolean

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}


