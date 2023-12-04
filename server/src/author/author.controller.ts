import * as common from "@nestjs/common";
import * as swagger from "@nestjs/swagger";
import { AuthorService } from "./author.service";
import { AuthorControllerBase } from "./base/author.controller.base";

@swagger.ApiTags("authors")
@common.Controller("authors")
export class AuthorController extends AuthorControllerBase {
  constructor(protected readonly service: AuthorService) {
    super(service);
  }
}
