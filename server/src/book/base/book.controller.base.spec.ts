import { Test } from "@nestjs/testing";
import {
  INestApplication,
  HttpStatus,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import request from "supertest";
import { ACGuard } from "nest-access-control";
import { DefaultAuthGuard } from "../../auth/defaultAuth.guard";
import { ACLModule } from "../../auth/acl.module";
import { AclFilterResponseInterceptor } from "../../interceptors/aclFilterResponse.interceptor";
import { AclValidateRequestInterceptor } from "../../interceptors/aclValidateRequest.interceptor";
import { map } from "rxjs";
import { BookController } from "../book.controller";
import { BookService } from "../book.service";

const nonExistingId = "nonExistingId";
const existingId = "existingId";
const CREATE_INPUT = {
  genre: "exampleGenre",
  id: 42,
  published: new Date(),
  title: "exampleTitle",
};
const CREATE_RESULT = {
  genre: "exampleGenre",
  id: 42,
  published: new Date(),
  title: "exampleTitle",
};
const FIND_MANY_RESULT = [
  {
    genre: "exampleGenre",
    id: 42,
    published: new Date(),
    title: "exampleTitle",
  },
];
const FIND_ONE_RESULT = {
  genre: "exampleGenre",
  id: 42,
  published: new Date(),
  title: "exampleTitle",
};

const service = {
  create() {
    return CREATE_RESULT;
  },
  findMany: () => FIND_MANY_RESULT,
  findOne: ({ where }: { where: { id: string } }) => {
    switch (where.id) {
      case existingId:
        return FIND_ONE_RESULT;
      case nonExistingId:
        return null;
    }
  },
};

const basicAuthGuard = {
  canActivate: (context: ExecutionContext) => {
    const argumentHost = context.switchToHttp();
    const request = argumentHost.getRequest();
    request.user = {
      roles: ["user"],
    };
    return true;
  },
};

const acGuard = {
  canActivate: () => {
    return true;
  },
};

const aclFilterResponseInterceptor = {
  intercept: (context: ExecutionContext, next: CallHandler) => {
    return next.handle().pipe(
      map((data) => {
        return data;
      })
    );
  },
};
const aclValidateRequestInterceptor = {
  intercept: (context: ExecutionContext, next: CallHandler) => {
    return next.handle();
  },
};

describe("Book", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: BookService,
          useValue: service,
        },
      ],
      controllers: [BookController],
      imports: [ACLModule],
    })
      .overrideGuard(DefaultAuthGuard)
      .useValue(basicAuthGuard)
      .overrideGuard(ACGuard)
      .useValue(acGuard)
      .overrideInterceptor(AclFilterResponseInterceptor)
      .useValue(aclFilterResponseInterceptor)
      .overrideInterceptor(AclValidateRequestInterceptor)
      .useValue(aclValidateRequestInterceptor)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  test("POST /books", async () => {
    await request(app.getHttpServer())
      .post("/books")
      .send(CREATE_INPUT)
      .expect(HttpStatus.CREATED)
      .expect({
        ...CREATE_RESULT,
        published: CREATE_RESULT.published.toISOString(),
      });
  });

  test("GET /books", async () => {
    await request(app.getHttpServer())
      .get("/books")
      .expect(HttpStatus.OK)
      .expect([
        {
          ...FIND_MANY_RESULT[0],
          published: FIND_MANY_RESULT[0].published.toISOString(),
        },
      ]);
  });

  test("GET /books/:id non existing", async () => {
    await request(app.getHttpServer())
      .get(`${"/books"}/${nonExistingId}`)
      .expect(HttpStatus.NOT_FOUND)
      .expect({
        statusCode: HttpStatus.NOT_FOUND,
        message: `No resource was found for {"${"id"}":"${nonExistingId}"}`,
        error: "Not Found",
      });
  });

  test("GET /books/:id existing", async () => {
    await request(app.getHttpServer())
      .get(`${"/books"}/${existingId}`)
      .expect(HttpStatus.OK)
      .expect({
        ...FIND_ONE_RESULT,
        published: FIND_ONE_RESULT.published.toISOString(),
      });
  });

  test("POST /books existing resource", async () => {
    const agent = request(app.getHttpServer());
    await agent
      .post("/books")
      .send(CREATE_INPUT)
      .expect(HttpStatus.CREATED)
      .expect({
        ...CREATE_RESULT,
        published: CREATE_RESULT.published.toISOString(),
      })
      .then(function () {
        agent
          .post("/books")
          .send(CREATE_INPUT)
          .expect(HttpStatus.CONFLICT)
          .expect({
            statusCode: HttpStatus.CONFLICT,
          });
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
