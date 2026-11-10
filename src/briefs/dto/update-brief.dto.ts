import { IsString, MaxLength, MinLength } from "class-validator";

export class UpdateBriefDto {
    @IsString()
    @MinLength(30)
    @MaxLength(10000)
    content: string;
}