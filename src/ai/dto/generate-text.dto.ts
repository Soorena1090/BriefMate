import { IsString, MaxLength, MinLength } from "class-validator";

export class GenerateTextDto {
    @IsString()
    @MinLength(5)
    @MaxLength(2000)
    prompt: string;
}