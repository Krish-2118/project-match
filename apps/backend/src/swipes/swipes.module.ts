import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database/database.module";
import { SwipesController } from "./swipes.controller";
import { SwipesService } from "./swipes.service";

@Module({
  imports: [DatabaseModule],
  controllers: [SwipesController],
  providers: [SwipesService],
  exports: [SwipesService],
})
export class SwipesModule {}
