import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global prefix for all routes
  app.setGlobalPrefix("api");

  // Enable CORS for frontend
  const frontendUrl = process.env.FRONTEND_URL;
  const allowLocalhost = process.env.NODE_ENV !== "production";
  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      if (!origin) return callback(null, true);

      if (frontendUrl && origin === frontendUrl) {
        return callback(null, true);
      }

      if (allowLocalhost) {
        try {
          const url = new URL(origin);
          const isLocalhost = url.hostname === "localhost" || url.hostname === "127.0.0.1";
          const isHttp = url.protocol === "http:" || url.protocol === "https:";
          if (isHttp && isLocalhost) {
            return callback(null, true);
          }
        } catch {
          // ignore invalid origin
        }
      }

      return callback(new Error("Not allowed by CORS"), false);
    },
    credentials: true,
  });

  // Global validation pipe for DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Backend running on http://localhost:${port}`);
}

bootstrap();
