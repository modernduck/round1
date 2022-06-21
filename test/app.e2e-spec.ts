import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { BalanceResponse } from 'src/models';
import { AppService } from './../src/app.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  const mockService = {
    getBalance: async (address: string) =>
      ({
        balance: {
          wei: '2000000000000000000',
          eth: '2',
          usd: '8000',
        },
      } as BalanceResponse),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(AppService)
      .useValue(mockService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
  it('/getAddressValue', () => {
    return request(app.getHttpServer())
      .get('/getAddressValue?address=thisshouldwork')
      .expect(200)
      .expect({
        balance: {
          wei: '2000000000000000000',
          eth: '2',
          usd: '8000',
        },
      });
  });
});
