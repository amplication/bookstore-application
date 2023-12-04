import * as common from "@nestjs/common";
import * as swagger from "@nestjs/swagger";
import { BookService } from "./book.service";
import { BookControllerBase } from "./base/book.controller.base";

@swagger.ApiTags("books")
@common.Controller("books")
export class BookController extends BookControllerBase {
  constructor(protected readonly service: BookService) {
    super(service);
  }
}
