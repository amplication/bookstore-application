import * as graphql from "@nestjs/graphql";
import { AuthorResolverBase } from "./base/author.resolver.base";
import { Author } from "./base/Author";
import { AuthorService } from "./author.service";

@graphql.Resolver(() => Author)
export class AuthorResolver extends AuthorResolverBase {
  constructor(protected readonly service: AuthorService) {
    super(service);
  }
}
