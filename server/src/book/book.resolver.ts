import * as graphql from "@nestjs/graphql";
import { BookResolverBase } from "./base/book.resolver.base";
import { Book } from "./base/Book";
import { BookService } from "./book.service";

@graphql.Resolver(() => Book)
export class BookResolver extends BookResolverBase {
  constructor(protected readonly service: BookService) {
    super(service);
  }
}
