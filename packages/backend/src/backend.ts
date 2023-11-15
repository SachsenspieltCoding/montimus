import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import helmet from "helmet";
import { AppModule } from "./app.module";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.use(helmet.hidePoweredBy());
  app.useGlobalPipes(new ValidationPipe({}));
  app.enableCors({
    credentials: true,
    exposedHeaders: ["Retry-After"],
  });

  const port = process.env.BACKEND_PORT || 3001;
  await app.listen(port);

  const logger = new Logger("Startup");
  logger.log(`Application listening on port ${port}`);
}

bootstrap();
