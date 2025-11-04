import { IsEmail, IsInt, IsNotEmpty, IsPhoneNumber, IsString } from "class-validator";

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    name: string

    @IsInt()
    @IsNotEmpty()
    store_id: number;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsString()
    @IsNotEmpty()
    category: string;

    @IsString()
    @IsNotEmpty()
    brand: string;

    @IsString()
    @IsNotEmpty()
    image_url: string
    //remember: maybe create the relationship later
    @IsInt()
    @IsNotEmpty()
    created_by: number;

}
