import { HttpModule, HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Environment } from './environment';
import { BalanceResponse } from './models';

describe('AppController', () => {
  let appController: AppController;
  let httpService: HttpService;
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      imports: [HttpModule],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
    httpService = app.get<HttpService>(HttpService);
  });

  describe('getAddressValue()', () => {
    it('should return correct response', async () => {
      jest.spyOn(httpService, 'get').mockImplementation((url: string) => {
        switch (url) {
          case Environment.COIN_GECKO_ETH_PRICE_URI:
            return of({
              data: {
                market_data: {
                  current_price: {
                    usd: '2000',
                  },
                },
              },
              status: {} as any,
              statusText: {} as any,
              headers: {} as any,
              config: {} as any,
            });
          default:
            return of({
              data: {
                status: '1',
                message: 'Hello',
                result: '1000000000000000000',
              },
              status: {} as any,
              statusText: {} as any,
              headers: {} as any,
              config: {} as any,
            });
        }
      });
      expect(await appController.getAddressValue('this should work')).toEqual({
        balance: {
          wei: '1000000000000000000',
          eth: '1',
          usd: '2000',
        },
      } as BalanceResponse);
    });
  });
});
