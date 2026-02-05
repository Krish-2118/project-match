import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { ProjectsModule } from "./projects/projects.module";
import { SwipesModule } from "./swipes/swipes.module";
import { UsersModule } from "./users/users.module";
import * as path from "path"; // Ensure this is exactly like this

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // We use path?.resolve to prevent a crash if the import fails
      envFilePath: [
        path?.resolve ? path.resolve(process.cwd(), "../../.env") : ".env",
        path?.resolve ? path.resolve(process.cwd(), ".env") : ".env",
      ],
    }),
    AuthModule,
    UsersModule,
    ProjectsModule,
    SwipesModule,
  ],
})
export class AppModule {}
