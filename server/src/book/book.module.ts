import { Module } from "@nestjs/common";
import { BookModuleBase } from "./base/book.module.base";
import { BookService } from "./book.service";
import { BookController } from "./book.controller";
import { BookResolver } from "./book.resolver";

@Module({
  imports: [BookModuleBase],
  controllers: [BookController],
  providers: [BookService, BookResolver],
  exports: [BookService],
})
export class BookModule {}
