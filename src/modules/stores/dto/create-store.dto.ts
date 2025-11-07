import { IsEmail, IsString, MinLength, IsNotEmpty, IsPhoneNumber, IsInt } from 'class-validator';

export class CreateStoreDto {

    @IsString()
    @IsNotEmpty()
    name: string

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsString()
    @IsNotEmpty()
    address: string;

    @IsPhoneNumber()
    phone: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;


}
