/*
------------------------------------------------------------------------------ 
This code was generated by Amplication. 
 
Changes to this file will be lost if the code is regenerated. 

There are other ways to to customize your code, see this doc to learn more
https://docs.amplication.com/how-to/custom-code

------------------------------------------------------------------------------
  */
import * as common from "@nestjs/common";
import * as swagger from "@nestjs/swagger";
import { isRecordNotFoundError } from "../../prisma.util";
import * as errors from "../../errors";
import { Request } from "express";
import { plainToClass } from "class-transformer";
import { ApiNestedQuery } from "../../decorators/api-nested-query.decorator";
import { AuthorService } from "../author.service";
import { AuthorCreateInput } from "./AuthorCreateInput";
import { AuthorWhereInput } from "./AuthorWhereInput";
import { AuthorWhereUniqueInput } from "./AuthorWhereUniqueInput";
import { AuthorFindManyArgs } from "./AuthorFindManyArgs";
import { AuthorUpdateInput } from "./AuthorUpdateInput";
import { Author } from "./Author";
import { BookFindManyArgs } from "../../book/base/BookFindManyArgs";
import { Book } from "../../book/base/Book";
import { BookWhereUniqueInput } from "../../book/base/BookWhereUniqueInput";

export class AuthorControllerBase {
  constructor(protected readonly service: AuthorService) {}
  @common.Post()
  @swagger.ApiCreatedResponse({ type: Author })
  async create(@common.Body() data: AuthorCreateInput): Promise<Author> {
    return await this.service.create({
      data: data,
      select: {
        id: true,
        name: true,
      },
    });
  }

  @common.Get()
  @swagger.ApiOkResponse({ type: [Author] })
  @ApiNestedQuery(AuthorFindManyArgs)
  async findMany(@common.Req() request: Request): Promise<Author[]> {
    const args = plainToClass(AuthorFindManyArgs, request.query);
    return this.service.findMany({
      ...args,
      select: {
        id: true,
        name: true,
      },
    });
  }

  @common.Get("/:id")
  @swagger.ApiOkResponse({ type: Author })
  @swagger.ApiNotFoundResponse({ type: errors.NotFoundException })
  async findOne(
    @common.Param() params: AuthorWhereUniqueInput
  ): Promise<Author | null> {
    const result = await this.service.findOne({
      where: params,
      select: {
        id: true,
        name: true,
      },
    });
    if (result === null) {
      throw new errors.NotFoundException(
        `No resource was found for ${JSON.stringify(params)}`
      );
    }
    return result;
  }

  @common.Patch("/:id")
  @swagger.ApiOkResponse({ type: Author })
  @swagger.ApiNotFoundResponse({ type: errors.NotFoundException })
  async update(
    @common.Param() params: AuthorWhereUniqueInput,
    @common.Body() data: AuthorUpdateInput
  ): Promise<Author | null> {
    try {
      return await this.service.update({
        where: params,
        data: data,
        select: {
          id: true,
          name: true,
        },
      });
    } catch (error) {
      if (isRecordNotFoundError(error)) {
        throw new errors.NotFoundException(
          `No resource was found for ${JSON.stringify(params)}`
        );
      }
      throw error;
    }
  }

  @common.Delete("/:id")
  @swagger.ApiOkResponse({ type: Author })
  @swagger.ApiNotFoundResponse({ type: errors.NotFoundException })
  async delete(
    @common.Param() params: AuthorWhereUniqueInput
  ): Promise<Author | null> {
    try {
      return await this.service.delete({
        where: params,
        select: {
          id: true,
          name: true,
        },
      });
    } catch (error) {
      if (isRecordNotFoundError(error)) {
        throw new errors.NotFoundException(
          `No resource was found for ${JSON.stringify(params)}`
        );
      }
      throw error;
    }
  }

  @common.Get("/:id/books")
  @ApiNestedQuery(BookFindManyArgs)
  async findManyBooks(
    @common.Req() request: Request,
    @common.Param() params: AuthorWhereUniqueInput
  ): Promise<Book[]> {
    const query = plainToClass(BookFindManyArgs, request.query);
    const results = await this.service.findBooks(params.id, {
      ...query,
      select: {
        author: {
          select: {
            id: true,
          },
        },

        genre: true,
        id: true,
        published: true,
        title: true,
      },
    });
    if (results === null) {
      throw new errors.NotFoundException(
        `No resource was found for ${JSON.stringify(params)}`
      );
    }
    return results;
  }

  @common.Post("/:id/books")
  async connectBooks(
    @common.Param() params: AuthorWhereUniqueInput,
    @common.Body() body: BookWhereUniqueInput[]
  ): Promise<void> {
    const data = {
      books: {
        connect: body,
      },
    };
    await this.service.update({
      where: params,
      data,
      select: { id: true },
    });
  }

  @common.Patch("/:id/books")
  async updateBooks(
    @common.Param() params: AuthorWhereUniqueInput,
    @common.Body() body: BookWhereUniqueInput[]
  ): Promise<void> {
    const data = {
      books: {
        set: body,
      },
    };
    await this.service.update({
      where: params,
      data,
      select: { id: true },
    });
  }

  @common.Delete("/:id/books")
  async disconnectBooks(
    @common.Param() params: AuthorWhereUniqueInput,
    @common.Body() body: BookWhereUniqueInput[]
  ): Promise<void> {
    const data = {
      books: {
        disconnect: body,
      },
    };
    await this.service.update({
      where: params,
      data,
      select: { id: true },
    });
  }
}