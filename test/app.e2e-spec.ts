import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { SignUp } from 'src/app/user/dto/sign-up';
import * as request from 'supertest';
import { getConnection } from 'typeorm';
import { AppModule } from '../src/app.module';
import { Login } from '../src/app/user/dto/login';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let token: string;

  jest.setTimeout(10000);

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const payloadForSignUp: SignUp = {
      email: 'test@test.com',
      password: 'test',
      firstName: 'test',
      lastName: 'test',
    };
    await request(app.getHttpServer())
      .post('/user/signup')
      .send(payloadForSignUp);

    const payloadForLogin: SignUp = {
      email: 'test@test.com',
      password: 'test',
      firstName: 'test',
      lastName: 'test',
    };
    const response = await request(app.getHttpServer())
      .post('/user/login')
      .send(payloadForLogin);
    token = response.body.token;
  });

  beforeEach(async () => {
    const connection = getConnection();
    await connection.query('delete from "game"');
  });

  afterAll(async () => {
    const connection = getConnection();
    await connection.query('delete from "game"');
    await connection.query('delete from "user"');
  });

  describe('Signup API (POST)', () => {
    // Clean DB before running every test
    beforeEach(async () => {
      const connection = getConnection();
      await connection.query('delete from "game"');
      await connection.query('delete from "user"');
    });

    it('Signup API, create new user', async () => {
      const payload: SignUp = {
        email: 'test@test.com',
        password: 'test',
        firstName: 'test',
        lastName: 'test',
      };
      const response = await request(app.getHttpServer())
        .post('/user/signup')
        .send(payload);

      expect(response.statusCode).toBe(201);
      expect(response.body?.message).toBeDefined();
    });

    it('Signup API, error on creating multiple users with same details', async () => {
      const payload: SignUp = {
        email: 'test@test.com',
        password: 'test',
        firstName: 'test',
        lastName: 'test',
      };
      await request(app.getHttpServer()).post('/user/signup').send(payload);

      const response = await request(app.getHttpServer())
        .post('/user/signup')
        .send(payload);

      expect(response.statusCode).toBe(400);
      expect(response.body).toMatchObject({
        message: 'User is already created',
      });
    });

    it('Signup API, error on create user missing details', async () => {
      const payload = {
        email: 'test@test.com',
        password: 'test',
        firstName: 'test',
      };
      await request(app.getHttpServer()).post('/user/signup').send(payload);

      const response = await request(app.getHttpServer())
        .post('/user/signup')
        .send(payload);

      expect(response.statusCode).toBe(400);
    });
  });

  describe('Login API (POST)', () => {
    // Clean DB before running every test
    beforeEach(async () => {
      const connection = getConnection();
      await connection.query('delete from "game"');
      await connection.query('delete from "user"');
    });

    it('Login API, login with valid creds', async () => {
      const payloadForSignUp: SignUp = {
        email: 'test@test.com',
        password: 'test',
        firstName: 'test',
        lastName: 'test',
      };

      await request(app.getHttpServer())
        .post('/user/signup')
        .send(payloadForSignUp);

      const payload: Login = {
        email: 'test@test.com',
        password: 'test',
      };

      const response = await request(app.getHttpServer())
        .post('/user/login')
        .send(payload);

      expect(response.statusCode).toBe(201);
      expect(response.body?.token).toBeDefined();
    });

    it('Login API, login with invalid password', async () => {
      const payload: Login = {
        email: 'test@test.com',
        password: 'test',
      };
      await request(app.getHttpServer()).post('/user/signup').send(payload);

      const response = await request(app.getHttpServer())
        .post('/user/login')
        .send({ email: payload.email, password: 'abcd' });

      expect(response.statusCode).toBe(401);
      expect(response.body).toMatchObject({
        message: 'Invalid email or password',
      });
    });

    it('Login API, login with invalid email', async () => {
      const payload: Login = {
        email: 'test@test.com',
        password: 'test',
      };
      await request(app.getHttpServer()).post('/user/signup').send(payload);

      const response = await request(app.getHttpServer())
        .post('/user/login')
        .send({ email: 'test1@test2.com', password: payload.password });

      expect(response.statusCode).toBe(401);
      expect(response.body).toMatchObject({
        message: 'Invalid email or password',
      });
    });
  });
});
