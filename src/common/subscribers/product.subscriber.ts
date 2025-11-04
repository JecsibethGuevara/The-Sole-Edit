// product.subscriber.ts
import { Product } from 'src/modules/products/entities/product.entity';
import { StoreProduct } from 'src/modules/store-products/entities/store-product.entity';
import { Store } from 'src/modules/stores/entities/store.entity';
import {
    EventSubscriber,
    EntitySubscriberInterface,
    InsertEvent,
    DataSource,
} from 'typeorm';


@EventSubscriber()
export class ProductSubscriber implements EntitySubscriberInterface<Product> {
    constructor(private dataSource: DataSource) {
        dataSource.subscribers.push(this);
    }

    listenTo() {
        return Product;
    }

    async afterInsert(event: InsertEvent<Product>): Promise<void> {
        const product = event.entity;

        console.log(`Product ${product.id} created. Creating StoreProduct...`);

        if (!product.store_id) {
            console.error('No store_id provided for product creation');
            return;
        }

        try {
            // Verify store exists
            const store = await event.manager.findOne(Store, {
                where: {
                    id: product.store_id,
                    is_active: true
                }
            });

            if (!store) {
                console.error(`Store with id ${product.store_id} not found or not active`);
                return;
            }

            // Create StoreProduct entry
            const storeProduct = new StoreProduct();
            storeProduct.store = store;
            storeProduct.product = product;
            storeProduct.price = 0;
            storeProduct.stock = 0;
            storeProduct.is_available = false;

            await event.manager.save(StoreProduct, storeProduct);
            console.log(`StoreProduct created for product ${product.id} and store ${store.id}`);

        } catch (error) {
            console.error('Error creating StoreProduct:', error);
            // Don't throw the error to prevent product creation from failing
        }
    }
}