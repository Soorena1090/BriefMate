import { IsIn, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateProjectDto {
    @IsString()
    @MinLength(3)
    @MaxLength(150)
    title: string;

    @IsOptional()
    @IsString()
    @MaxLength(2000)
    description?: string;

    @IsOptional()
    @IsIn(['draft', 'in_progress', 'completed'])
    status?: 'draft' | 'in_progress' | 'completed';
}