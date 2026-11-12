import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('RecordController (e2e)', () => {
  let app: INestApplication;
  let generatedUserId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    // Consistence with main.ts
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  // Case 1 Invalid input
  it('/api/records (POST) - should fail if id1 or id2 is missing', () => {
    return request(app.getHttpServer())
      .post('/api/records')
      .send({ id1: 'ABC123' }) // id2 missing
      .expect(400); //Error expected
  });

  // Case 2 New id1 + id2
  it('/api/records (POST) - should generate new userID for new combination', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/records')
      .send({ id1: 'TEST_1', id2: 'TEST_2' })
      .expect(200);

    expect(response.body).toHaveProperty('userID');
    // Check the new UUID should be an UUIDv4
    expect(response.body.userID).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    );
    
    generatedUserId = response.body.userID; // save for case 3 test
  });

  // Case 3 Existing id1 + id2
  it('/api/records (POST) - should return existing userID for same combination', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/records')
      .send({ id1: 'TEST_1', id2: 'TEST_2' })
      .expect(200);

    // Same User ID is expected to be return
    expect(response.body.userID).toEqual(generatedUserId); 
  });
});