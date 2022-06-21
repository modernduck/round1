import { HttpModule, HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { AppService } from './app.service';
import { Environment } from './environment';
import { BalanceResponse } from './models';

describe('App Service', () => {
  let app: TestingModule;
  let service: AppService;
  let httpService: HttpService;
  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [AppService],
    }).compile();
    service = app.get<AppService>(AppService);
    httpService = app.get<HttpService>(HttpService);
  });
  it('should pass', () => {
    expect(true).toEqual(true);
  });
  describe('getEtherBalance()', () => {
    it('should return EtherResponseData if status == 1', async () => {
      jest.spyOn(httpService, 'get').mockReturnValue(
        of({
          data: {
            status: '1',
            message: 'Hello',
            result: '1000000000000000000',
          },
          status: {} as any,
          statusText: {} as any,
          headers: {} as any,
          config: {} as any,
        }),
      );
      const balance = await service.getEtherBalance('should work address');
      expect(balance.status).toEqual('1');
      expect(balance.result).toEqual('1000000000000000000');
    });
    it('should throw Exception if status != 1', async () => {
      jest.spyOn(httpService, 'get').mockReturnValue(
        of({
          data: {
            status: '0',
            message: 'This is bad',
          },
          status: {} as any,
          statusText: {} as any,
          headers: {} as any,
          config: {} as any,
        }),
      );
      expect(
        service.getEtherBalance('should not work address'),
      ).rejects.toThrowError('This is bad');
    });
  });
  describe('getEtherPrice()', () => {
    it('should return USD string of current ETH Price', async () => {
      jest.spyOn(httpService, 'get').mockReturnValue(
        of({
          data: {
            market_data: {
              current_price: {
                usd: '1000',
              },
            },
          },
          status: {} as any,
          statusText: {} as any,
          headers: {} as any,
          config: {} as any,
        }),
      );
      expect(await service.getEtherPrice()).toEqual('1000');
    });
  });
  describe('getBalance', () => {
    it('should return wei,eth and usd price correctly', async () => {
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
      expect(await service.getBalance('this should work')).toEqual({
        balance: {
          wei: '1000000000000000000',
          eth: '1',
          usd: '2000',
        },
      } as BalanceResponse);
    });
  });
});
