import { IsString, MaxLength, MinLength } from "class-validator";

export class CreateBriefDto {
    @IsString()
    @MinLength(30)
    @MaxLength(10000)
    content: string;
}