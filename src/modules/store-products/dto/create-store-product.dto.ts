import { IsBoolean, IsInt, IsNotEmpty, IsString } from "class-validator";
import { Product } from "src/modules/products/entities/product.entity";
import { Store } from "src/modules/stores/entities/store.entity";

export class CreateStoreProductDto {
    @IsNotEmpty()
    store_id: number
    @IsNotEmpty()
    product_id: number
    @IsInt()
    @IsNotEmpty()
    price: number;
    @IsInt()
    @IsNotEmpty()
    stock: number;
    @IsBoolean()
    @IsNotEmpty()
    is_available: boolean;
    @IsInt()
    @IsNotEmpty()
    created_by: number;
}