import {IsNotEmpty, Length} from "class-validator";

export class IdParam {
    @IsNotEmpty({ message: 'Id is required' })
    @Length(20, 20, { message: 'Id must have 20 characters' })
    id?: string;
}

export class UidParam {
    @IsNotEmpty({ message: 'Uid is required' })
    @Length(28, 28, { message: 'Uid must have 28 characters' })
    userId?: string;
}

export class SearchQuery {
    @IsNotEmpty({ message: 'Search query is required' })
    @Length(1, null, { message: 'Search query must have at least 1  character' })
    query?: string;
}