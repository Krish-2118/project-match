import { IsOptional, IsString, IsUrl, MinLength } from "class-validator";

export class CreateProjectDto {
  @IsString()
  @MinLength(3, { message: "Title must be at least 3 characters" })
  title!: string;

  @IsString()
  @MinLength(10, { message: "Description must be at least 10 characters" })
  description!: string;

  @IsString()
  @MinLength(2, { message: "Add at least one tag" })
  tags!: string;

  @IsOptional()
  @IsUrl()
  imageUrl?: string;
}
