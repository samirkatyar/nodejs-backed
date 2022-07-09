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

    const payloadForLogin: Login = {
      email: 'test@test.com',
      password: 'test',
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

  describe('Get Game List API (GET)', () => {
    it('Get Game List API (GET), skip=0 & limit=10', async () => {
      const response = await request(app.getHttpServer())
        .get('/game/list?skip=0&limit=10')
        .set('x-access-token', token);

      expect(response.statusCode).toBe(200);
      expect(response.body?.length).toBeLessThanOrEqual(10);
    });

    it('Get Game List API (GET), skip=0 & limit=5', async () => {
      const response = await request(app.getHttpServer())
        .get('/game/list?skip=0&limit=5')
        .set('x-access-token', token);

      expect(response.statusCode).toBe(200);
      expect(response.body?.length).toBeLessThanOrEqual(5);
    });

    it('Get Game List API (GET), without skip and without limit', async () => {
      const response = await request(app.getHttpServer())
        .get('/game/list')
        .set('x-access-token', token);

      expect(response.statusCode).toBe(400);
      expect(response.body).toMatchObject({
        statusCode: 400,
        message: 'Validation failed (numeric string is expected)',
      });
    });

    it('Get Game List API (GET), Without Access Token', async () => {
      const response = await request(app.getHttpServer()).get(
        '/game/list?skip=0&limit=10',
      );

      expect(response.statusCode).toBe(403);
    });

    it('Get Game List API (GET), With User Input On Game Name', async () => {
      const response = await request(app.getHttpServer())
        .get('/game/list?skip=0&limit=10&name=Dogou')
        .set('x-access-token', token);

      expect(response.statusCode).toBe(200);
    });

    it('Get Game List API (GET), With User Input On followers', async () => {
      const response = await request(app.getHttpServer())
        .get('/game/list?skip=0&limit=10&followers=10')
        .set('x-access-token', token);

      expect(response.statusCode).toBe(200);
    });

    it('Get Game List API (GET), With User Input On followers Invalid Input', async () => {
      const response = await request(app.getHttpServer())
        .get('/game/list?skip=0&limit=10&followers=dsds')
        .set('x-access-token', token);

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe('Invalid Input');
    });

    it('Get Game List API (GET), With User Input On rating', async () => {
      const response = await request(app.getHttpServer())
        .get('/game/list?skip=0&limit=10&rating=5')
        .set('x-access-token', token);

      expect(response.statusCode).toBe(200);
    });

    it('Get Game List API (GET), With User Input On rating Invalid Input', async () => {
      const response = await request(app.getHttpServer())
        .get('/game/list?skip=0&limit=10&rating=dsds')
        .set('x-access-token', token);

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe('Invalid Input');
    });

    it('Get Game List API (GET), With User Input On totalRating', async () => {
      const response = await request(app.getHttpServer())
        .get('/game/list?skip=0&limit=10&totalRating=5')
        .set('x-access-token', token);

      expect(response.statusCode).toBe(200);
    });

    it('Get Game List API (GET), With User Input On totalRating Invalid Input', async () => {
      const response = await request(app.getHttpServer())
        .get('/game/list?skip=0&limit=10&totalRating=dsds')
        .set('x-access-token', token);

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe('Invalid Input');
    });
  });

  describe('Get My Games API (GET)', () => {
    it('Get My Games API (GET), With Valid Input', async () => {
      const response = await request(app.getHttpServer())
        .get('/game/my-games?skip=0&limit=10')
        .set('x-access-token', token);

      expect(response.statusCode).toBe(200);
      expect(response.body?.length).toBeLessThanOrEqual(10);
    });

    it('Get My Games API (GET), With Invalid Input', async () => {
      const response = await request(app.getHttpServer())
        .get('/game/my-games?skip=dsda&limit=dsa')
        .set('x-access-token', token);

      expect(response.statusCode).toBe(400);
    });
  });

  describe('Add favourite game (PUT)', () => {
    it('Add favourite game, With Valid Name', async () => {
      console.log(token);
      const response = await request(app.getHttpServer())
        .put('/game/addToFavorites')
        .set('x-access-token', token)
        .send({ name: 'City Mysteries' });

      expect(response.statusCode).toBe(200);
      expect(response.body?.name).toBe('City Mysteries');
    });

    it('Add favourite game, With Invalid Name', async () => {
      console.log(token);
      const response = await request(app.getHttpServer())
        .put('/game/addToFavorites')
        .set('x-access-token', token)
        .send({ name: 'Invalid City Mysteries' });

      expect(response.statusCode).toBe(400);
      expect(response.body?.message).toBe('Game with that name not found!');
    });

    it('Add favourite game, Without Name', async () => {
      console.log(token);
      const response = await request(app.getHttpServer())
        .put('/game/addToFavorites')
        .set('x-access-token', token);

      expect(response.statusCode).toBe(400);
    });

    it('Add favourite game, Without Token', async () => {
      console.log(token);
      const response = await request(app.getHttpServer())
        .put('/game/addToFavorites')
        .send({ name: 'City Mysteries' });

      expect(response.statusCode).toBe(403);
    });
  });
});
