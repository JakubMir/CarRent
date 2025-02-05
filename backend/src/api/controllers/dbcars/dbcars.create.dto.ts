import {IsNotEmpty} from "class-validator";

export class DbcarsCreateDto{
    id: string;

    year: number;

    fuelType: string;

    drive: string;

    @IsNotEmpty()
    make: string;

    @IsNotEmpty()
    model: string;
}