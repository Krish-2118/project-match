import { IsEnum, IsString } from "class-validator";

enum SwipeAction {
  LIKE = "LIKE",
  PASS = "PASS",
}

export class SwipeProjectDto {
  @IsString()
  projectId!: string;

  @IsEnum(SwipeAction)
  action!: SwipeAction;
}

export class SwipeUserDto {
  @IsString()
  userId!: string;

  @IsEnum(SwipeAction)
  action!: SwipeAction;
}
