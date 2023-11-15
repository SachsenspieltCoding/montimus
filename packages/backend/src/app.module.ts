import { MiddlewareConsumer, Module } from '@nestjs/common';

/** The main module. */
@Module({
  imports: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {}
}
