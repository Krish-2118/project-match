import { Global, Module } from "@nestjs/common";
import { prisma } from "@repo/database";

const databaseProvider = {
  provide: "PRISMA",
  useValue: prisma,
};

@Global()
@Module({
  providers: [databaseProvider],
  exports: [databaseProvider],
})
export class DatabaseModule {}
