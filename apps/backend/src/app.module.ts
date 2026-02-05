import path from "node:path";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { ProjectsModule } from "./projects/projects.module";
import { SwipesModule } from "./swipes/swipes.module";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [path.resolve(process.cwd(), "../../.env"), path.resolve(process.cwd(), ".env")],
    }),
    AuthModule,
    UsersModule,
    ProjectsModule,
    SwipesModule,
  ],
})
export class AppModule {}
